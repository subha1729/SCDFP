import sys
import tensorflow as tf
import keras

print("Python:", sys.version)
print("Executable:", sys.executable)
print("TensorFlow:", tf.__version__)
print("Keras:", keras.__version__)



# ============================================================
# FINAL LSTM INFERENCE
# ============================================================
#
# INPUT FILES:
#   1. lstm_model.keras
#   2. sales_history1.csv
#   3. holidays1.csv
#
# MODEL:
#   Input  : 30 days x 22 features
#   Output : 7 days
#
# NO PKL FILES REQUIRED
# NO ZIP FILE REQUIRED
# ============================================================

import os
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import StandardScaler


# ============================================================
# 1. CONFIGURATION
# ============================================================

MODEL_PATH = r"D:\Development\Demand Forecasting Platform\New folder\python_ml\lstm\loaded_model\lstm_model.keras"

SALES_FILE = r"D:\Development\Demand Forecasting Platform\New folder\server\uploads\sales_history_dummy_new.csv"
HOLIDAY_FILE = r"D:\Development\Demand Forecasting Platform\New folder\server\uploads\holiday_dummy_new.csv"

WINDOW_SIZE = 30
HORIZON = 7


# ============================================================
# 2. LOAD MODEL
# ============================================================

print("=" * 70)
print("LOADING MODEL")
print("=" * 70)

model = tf.keras.models.load_model(
    MODEL_PATH,
    compile=False
)

print("Model loaded successfully.")
print("Input shape :", model.input_shape)
print("Output shape:", model.output_shape)


if model.input_shape != (None, 30, 22):
    raise ValueError(
        f"Expected model input (None, 30, 22), "
        f"got {model.input_shape}"
    )

if model.output_shape != (None, 7):
    raise ValueError(
        f"Expected model output (None, 7), "
        f"got {model.output_shape}"
    )


# ============================================================
# 3. LOAD CSV FILES
# ============================================================

print("\n" + "=" * 70)
print("LOADING CSV FILES")
print("=" * 70)

history = pd.read_csv(SALES_FILE)
holidays = pd.read_csv(HOLIDAY_FILE)

print("Sales history shape:", history.shape)
print("Holiday shape:", holidays.shape)


# ============================================================
# 4. DATE CONVERSION
# ============================================================

history["Date"] = pd.to_datetime(
    history["Date"],
    errors="coerce"
)

holidays["Date"] = pd.to_datetime(
    holidays["Date"],
    errors="coerce"
)

if history["Date"].isna().any():
    raise ValueError("Invalid Date values in sales_history1.csv")

if holidays["Date"].isna().any():
    raise ValueError("Invalid Date values in holidays1.csv")


# ============================================================
# 5. CHECK SALES COLUMNS
# ============================================================

required_sales_columns = [
    "Store",
    "Date",
    "Sales",
    "Promo",
    "SchoolHoliday",
    "StateHoliday",
    "StoreType",
    "Assortment",
    "CompetitionDistance",
    "IsPromo2Active"
]

missing = [
    col for col in required_sales_columns
    if col not in history.columns
]

if missing:
    raise ValueError(
        f"Missing columns in sales_history1.csv: {missing}"
    )


# ============================================================
# 6. CHECK HOLIDAY COLUMNS
# ============================================================

required_holiday_columns = [
    "Date",
    "StateHoliday",
    "SchoolHoliday"
]

missing = [
    col for col in required_holiday_columns
    if col not in holidays.columns
]

if missing:
    raise ValueError(
        f"Missing columns in holidays1.csv: {missing}"
    )


# ============================================================
# 7. SORT DATA
# ============================================================

history = history.sort_values(
    ["Store", "Date"]
).reset_index(drop=True)


# ============================================================
# 8. BASIC CLEANING
# ============================================================

history["Sales"] = pd.to_numeric(
    history["Sales"],
    errors="coerce"
).fillna(0)

history["Promo"] = pd.to_numeric(
    history["Promo"],
    errors="coerce"
).fillna(0)

history["SchoolHoliday"] = pd.to_numeric(
    history["SchoolHoliday"],
    errors="coerce"
).fillna(0)

history["IsPromo2Active"] = pd.to_numeric(
    history["IsPromo2Active"],
    errors="coerce"
).fillna(0)

history["CompetitionDistance"] = pd.to_numeric(
    history["CompetitionDistance"],
    errors="coerce"
)


# ============================================================
# 9. APPLY HOLIDAY DATA
# ============================================================

holiday_lookup = holidays[
    ["Date", "StateHoliday", "SchoolHoliday"]
].drop_duplicates("Date")

history = history.merge(
    holiday_lookup,
    on="Date",
    how="left",
    suffixes=("", "_calendar")
)


history["StateHoliday"] = (
    history["StateHoliday_calendar"]
    .combine_first(history["StateHoliday"])
    .fillna("0")
    .astype(str)
)

history["SchoolHoliday"] = (
    history["SchoolHoliday_calendar"]
    .combine_first(history["SchoolHoliday"])
    .fillna(0)
)

history.drop(
    columns=[
        "StateHoliday_calendar",
        "SchoolHoliday_calendar"
    ],
    inplace=True
)


# ============================================================
# 10. SALES LOG TRANSFORMATION
# ============================================================

history["Sales_log"] = np.log1p(
    history["Sales"].clip(lower=0)
)


# ============================================================
# 11. MANUAL STORE-WISE SALES SCALING
# ============================================================
#
# Training preprocessing used:
#
# Sales
#   ↓
# log1p(Sales)
#   ↓
# StandardScaler per Store
#   ↓
# Sales_scaled
#
# We recreate that here.
# ============================================================

history["Sales_scaled"] = np.nan

store_scalers = {}

for store_id in history["Store"].unique():

    mask = history["Store"] == store_id

    scaler = StandardScaler()

    history.loc[mask, "Sales_scaled"] = (
        scaler.fit_transform(
            history.loc[mask, ["Sales_log"]]
        ).reshape(-1)
    )

    store_scalers[store_id] = scaler


print(
    "Store scalers created:",
    len(store_scalers)
)


# ============================================================
# 12. COMPETITION DISTANCE
# ============================================================

history["CompetitionDistance"] = (
    history["CompetitionDistance"]
    .fillna(
        history["CompetitionDistance"].median()
    )
)


# ============================================================
# 13. MANUAL COMPETITION DISTANCE SCALING
# ============================================================

comp_scaler = StandardScaler()

history["CompetitionDistance_scaled"] = (
    comp_scaler.fit_transform(
        history[["CompetitionDistance"]]
    ).reshape(-1)
)


# ============================================================
# 14. DAY OF WEEK
# ============================================================

history["DayOfWeek"] = (
    history["Date"].dt.dayofweek
)


history["DayOfWeek_sin"] = np.sin(
    2 * np.pi * history["DayOfWeek"] / 7
)

history["DayOfWeek_cos"] = np.cos(
    2 * np.pi * history["DayOfWeek"] / 7
)


# ============================================================
# 15. ONE-HOT ENCODING
# ============================================================

history = pd.get_dummies(
    history,
    columns=[
        "StoreType",
        "Assortment",
        "StateHoliday"
    ],
    drop_first=False
)


# Convert bool → int

bool_columns = history.select_dtypes(
    include=["bool"]
).columns

history[bool_columns] = (
    history[bool_columns].astype(int)
)


# ============================================================
# 16. LAG FEATURES
# ============================================================

history = history.sort_values(
    ["Store", "Date"]
).reset_index(drop=True)


history["Sales_lag_7"] = (
    history
    .groupby("Store")["Sales_scaled"]
    .shift(7)
)


# ============================================================
# 17. 7-DAY ROLLING MEAN
# ============================================================

history["Sales_roll_mean_7"] = (
    history
    .groupby("Store")["Sales_scaled"]
    .transform(
        lambda x:
        x.shift(1)
        .rolling(
            window=7,
            min_periods=1
        )
        .mean()
    )
)


# ============================================================
# 18. 7-DAY ROLLING STD
# ============================================================

history["Sales_roll_std_7"] = (
    history
    .groupby("Store")["Sales_scaled"]
    .transform(
        lambda x:
        x.shift(1)
        .rolling(
            window=7,
            min_periods=1
        )
        .std()
    )
)


# ============================================================
# 19. 30-DAY ROLLING MEAN
# ============================================================

history["Sales_roll_mean_30"] = (
    history
    .groupby("Store")["Sales_scaled"]
    .transform(
        lambda x:
        x.shift(1)
        .rolling(
            window=30,
            min_periods=1
        )
        .mean()
    )
)


# ============================================================
# 20. FILL LAG / ROLLING NaN
# ============================================================

lag_columns = [
    "Sales_lag_7",
    "Sales_roll_mean_7",
    "Sales_roll_std_7",
    "Sales_roll_mean_30"
]

history[lag_columns] = (
    history[lag_columns]
    .replace(
        [np.inf, -np.inf],
        np.nan
    )
    .fillna(0)
)


# ============================================================
# 21. EXACT 22 MODEL FEATURES
# ============================================================

FEATURE_COLS = [
    "Promo",
    "SchoolHoliday",
    "IsPromo2Active",

    "StoreType_a",
    "StoreType_b",
    "StoreType_c",
    "StoreType_d",

    "Assortment_a",
    "Assortment_b",
    "Assortment_c",

    "StateHoliday_0",
    "StateHoliday_a",
    "StateHoliday_b",
    "StateHoliday_c",

    "Sales_scaled",

    "CompetitionDistance_scaled",

    "DayOfWeek_sin",
    "DayOfWeek_cos",

    "Sales_lag_7",
    "Sales_roll_mean_7",
    "Sales_roll_std_7",
    "Sales_roll_mean_30"
]


print("\n" + "=" * 70)
print("MODEL FEATURES")
print("=" * 70)

print("Number of features:", len(FEATURE_COLS))

for i, feature in enumerate(FEATURE_COLS, 1):
    print(f"{i:2d}. {feature}")


# ============================================================
# 22. MAKE SURE EVERY FEATURE EXISTS
# ============================================================

for feature in FEATURE_COLS:

    if feature not in history.columns:

        print(
            f"Feature {feature} missing → filling with 0"
        )

        history[feature] = 0


# ============================================================
# 23. CREATE FINAL FEATURE MATRIX
# ============================================================

X_history = history[
    FEATURE_COLS
].copy()


X_history = (
    X_history
    .apply(
        pd.to_numeric,
        errors="coerce"
    )
    .replace(
        [np.inf, -np.inf],
        np.nan
    )
    .fillna(0)
)


print("\nFinal feature matrix:")
print(
    "Shape:",
    X_history.shape
)


if X_history.shape[1] != 22:

    raise ValueError(
        f"Expected 22 features, got {X_history.shape[1]}"
    )


# ============================================================
# 24. BUILD 30-DAY SEQUENCES
# ============================================================

X_sequences = []
used_stores = []

for store_id in sorted(
    history["Store"].unique()
):

    store_history = history[
        history["Store"] == store_id
    ].sort_values("Date")


    if len(store_history) < WINDOW_SIZE:

        print(
            f"Skipping Store {store_id}: "
            f"only {len(store_history)} rows"
        )

        continue


    latest_30 = store_history.tail(
        WINDOW_SIZE
    )


    indices = latest_30.index


    X_store = X_history.loc[
        indices
    ].values


    X_sequences.append(
        X_store
    )

    used_stores.append(
        store_id
    )


# ============================================================
# 25. CREATE LSTM INPUT
# ============================================================

X_input = np.asarray(
    X_sequences,
    dtype=np.float32
)


print("\n" + "=" * 70)
print("LSTM INPUT")
print("=" * 70)

print(
    "Input shape:",
    X_input.shape
)


expected_shape = (
    len(used_stores),
    30,
    22
)


if X_input.shape != expected_shape:

    raise ValueError(
        f"""
Wrong LSTM input shape.

Expected:
{expected_shape}

Got:
{X_input.shape}
"""
    )


print("30 × 22 input check PASSED.")


# ============================================================
# 26. PREDICT
# ============================================================

print("\n" + "=" * 70)
print("RUNNING LSTM")
print("=" * 70)

pred_scaled = model.predict(
    X_input,
    verbose=1
)


print(
    "Prediction shape:",
    pred_scaled.shape
)


# ============================================================
# 27. FORECAST DATES
# ============================================================

last_date = history["Date"].max()

forecast_dates = pd.date_range(
    start=last_date + pd.Timedelta(days=1),
    periods=HORIZON,
    freq="D"
)


print("\nForecast dates:")

for date in forecast_dates:
    print(
        date.strftime("%Y-%m-%d")
    )


# ============================================================
# 28. CONVERT PREDICTIONS BACK TO SALES
# ============================================================

results = []


for i, store_id in enumerate(
    used_stores
):

    scaler = store_scalers[
        store_id
    ]


    prediction_scaled = pred_scaled[i]


    # Reverse StandardScaler

    prediction_log = (
        scaler.inverse_transform(
            prediction_scaled.reshape(-1, 1)
        )
        .reshape(-1)
    )


    # Reverse log1p

    prediction_sales = np.expm1(
        prediction_log
    )


    # Demand cannot be negative

    prediction_sales = np.maximum(
        prediction_sales,
        0
    )


    for date, sales_value in zip(
        forecast_dates,
        prediction_sales
    ):

        results.append({
            "Store": store_id,
            "Date": date.strftime("%Y-%m-%d"),
            "ForecastSales": round(
                float(sales_value),
                2
            )
        })


# ============================================================
# 29. STORE FORECAST
# ============================================================

store_forecast = pd.DataFrame(
    results
)


store_forecast = (
    store_forecast
    .sort_values(
        ["Date", "Store"]
    )
    .reset_index(drop=True)
)


print("\n" + "=" * 70)
print("STORE FORECAST")
print("=" * 70)

print(
    store_forecast.to_string(
        index=False
    )
)


# ============================================================
# 30. OVERALL FORECAST
# ============================================================

overall_forecast = (
    store_forecast
    .groupby("Date")["ForecastSales"]
    .sum()
    .reset_index()
)


overall_forecast.rename(
    columns={
        "ForecastSales":
        "OverallForecastSales"
    },
    inplace=True
)


print("\n" + "=" * 70)
print("OVERALL 7-DAY FORECAST")
print("=" * 70)

print(
    overall_forecast.to_string(
        index=False
    )
)


# ============================================================
# 31. SAVE RESULTS
# ============================================================

import os

# ============================================================
# 31. SAVE RESULTS
# ============================================================

OUTPUT_DIR = r"D:\Development\Demand Forecasting Platform\New folder\model_outputs\lstm"

# os.makedirs(OUTPUT_DIR, exist_ok=True)

csv_filename = os.path.join(
    OUTPUT_DIR,
    "store_forecast.csv"
)

json_filename = os.path.join(
    OUTPUT_DIR,
    "store_forecast.json"
)

# Delete old files if they exist
for file_path in [csv_filename, json_filename]:
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"Existing file removed: {file_path}")

# Save CSV
store_forecast.to_csv(
    csv_filename,
    index=False
)

# Save JSON
store_forecast.to_json(
    json_filename,
    orient="records",
    indent=4
)

print("\n" + "=" * 70)
print("COMPLETE")
print("=" * 70)

print("Stores forecasted:", len(used_stores))
print("Output:", "(stores, 7)")
print("Saved:", csv_filename)
print("Saved:", json_filename)