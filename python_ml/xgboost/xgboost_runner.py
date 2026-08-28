# ============================================================
# XGBOOST 7-DAY FORECASTING
# ============================================================
#
# INPUT:
#   sales_history.csv
#   holidays.csv
#
# MODEL:
#   xgboost_rossmann_final.pkl
#
# OUTPUT:
#   xgboost_7day_forecast.csv
#
# The model expects EXACTLY 38 features.
# ============================================================

import os
import warnings
warnings.filterwarnings("ignore")

import joblib
import numpy as np
import pandas as pd
import json


# ============================================================
# CONFIGURATION
# ============================================================

MODEL_PATH = r"D:\Development\Demand Forecasting Platform\New folder\python_ml\xgboost\xgboost_rossmann_final.pkl"

SALES_FILE = r"D:\Development\Demand Forecasting Platform\New folder\server\uploads\sales_history_dummy_new.csv"
HOLIDAY_FILE = r"D:\Development\Demand Forecasting Platform\New folder\server\uploads\holiday_dummy_new.csv"

OUTPUT_FILE = r"store_forecast.csv"

HORIZON = 7


# ============================================================
# EXACT 38 FEATURES
# ============================================================

MODEL_FEATURES = [
    "Store",
    "DayOfWeek",
    "Customers",
    "Promo",
    "StateHoliday",
    "SchoolHoliday",
    "StoreType",
    "Assortment",
    "CompetitionDistance",
    "CompetitionOpenSinceMonth",
    "CompetitionOpenSinceYear",
    "Promo2",
    "Promo2SinceWeek",
    "Promo2SinceYear",
    "PromoInterval",
    "CompetitionExists",
    "Year",
    "Month",
    "Day",
    "Week",
    "Quarter",
    "DayOfYear",
    "IsWeekend",
    "Month_sin",
    "Month_cos",
    "DayOfWeek_sin",
    "DayOfWeek_cos",
    "Sales_Lag_1",
    "Sales_Lag_7",
    "Sales_Lag_14",
    "Sales_Lag_28",
    "Sales_Rolling_7",
    "Sales_Rolling_14",
    "Sales_Rolling_28",
    "Sales_RollingStd_7",
    "Customers_Lag_1",
    "Customers_Lag_7",
    "Customers_Rolling_7"
]


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def clean_columns(df):

    df = df.copy()

    df.columns = [
        str(c).strip()
        for c in df.columns
    ]

    return df


def numeric(series):

    return pd.to_numeric(
        series,
        errors="coerce"
    )


def encode_state_holiday(series):

    """
    Rossmann StateHoliday encoding

    0 -> 0
    a -> 1
    b -> 2
    c -> 3
    """

    mapping = {
        "0": 0,
        "0.0": 0,
        "a": 1,
        "b": 2,
        "c": 3
    }

    return (
        series
        .astype(str)
        .str.strip()
        .str.lower()
        .map(mapping)
        .fillna(0)
        .astype(float)
    )


def encode_store_type(series):

    """
    StoreType

    a -> 0
    b -> 1
    c -> 2
    d -> 3
    """

    mapping = {
        "a": 0,
        "b": 1,
        "c": 2,
        "d": 3
    }

    return (
        series
        .astype(str)
        .str.strip()
        .str.lower()
        .map(mapping)
        .fillna(0)
        .astype(float)
    )


def encode_assortment(series):

    """
    Assortment

    a -> 0
    b -> 1
    c -> 2
    """

    mapping = {
        "a": 0,
        "b": 1,
        "c": 2
    }

    return (
        series
        .astype(str)
        .str.strip()
        .str.lower()
        .map(mapping)
        .fillna(0)
        .astype(float)
    )


def encode_promo_interval(series):

    """
    PromoInterval is not directly useful numerically.

    Convert missing/empty values to 0.
    Otherwise create a numeric indicator.
    """

    s = (
        series
        .fillna("")
        .astype(str)
        .str.strip()
    )

    return (
        s.ne("")
        .astype(int)
    )


# ============================================================
# LOAD MODEL
# ============================================================

print("=" * 70)
print("LOADING PRETRAINED XGBOOST")
print("=" * 70)

package = joblib.load(MODEL_PATH)


if isinstance(package, dict):

    model = package["model"]

    saved_features = package.get(
        "features",
        MODEL_FEATURES
    )

    saved_metrics = package.get(
        "metrics",
        {}
    )

else:

    model = package

    saved_features = MODEL_FEATURES

    saved_metrics = {}


print("Model type:", type(model))

print(
    "Expected features:",
    len(saved_features)
)


# ============================================================
# VERIFY MODEL FEATURES
# ============================================================

if list(saved_features) != MODEL_FEATURES:

    print("\nWARNING:")
    print("Saved model feature order differs from expected list.")

    print("\nSaved features:")

    for i, f in enumerate(saved_features, 1):
        print(i, f)

    raise ValueError(
        "Model feature order does not match the 38-feature pipeline."
    )


print("\n38 feature definition verified.")


# ============================================================
# PRINT TRAINING METRICS
# ============================================================

if saved_metrics:

    print("\nSaved model metrics:")

    for key, value in saved_metrics.items():

        print(
            f"{key}: {value}"
        )


# ============================================================
# LOAD RAW SALES HISTORY
# ============================================================

print("\n" + "=" * 70)
print("LOADING SALES HISTORY")
print("=" * 70)

history = pd.read_csv(
    SALES_FILE,
    low_memory=False
)

history = clean_columns(history)

print(
    "Sales history shape:",
    history.shape
)

print(
    "Columns:",
    history.columns.tolist()
)


# ============================================================
# LOAD HOLIDAYS
# ============================================================

print("\n" + "=" * 70)
print("LOADING HOLIDAYS")
print("=" * 70)

holidays = pd.read_csv(
    HOLIDAY_FILE,
    low_memory=False
)

holidays = clean_columns(holidays)

print(
    "Holiday shape:",
    holidays.shape
)

print(
    "Holiday columns:",
    holidays.columns.tolist()
)


# ============================================================
# REQUIRED INPUT COLUMNS
# ============================================================

required_sales_columns = [
    "Store",
    "Date",
    "Sales",
    "Customers",
    "Promo",
    "StateHoliday",
    "SchoolHoliday",
    "StoreType",
    "Assortment",
    "CompetitionDistance",
    "CompetitionOpenSinceMonth",
    "CompetitionOpenSinceYear",
    "Promo2",
    "Promo2SinceWeek",
    "Promo2SinceYear",
    "PromoInterval"
]


for col in required_sales_columns:

    if col not in history.columns:

        raise ValueError(
            f"Required column missing from sales history: {col}"
        )


# ============================================================
# DATE CONVERSION
# ============================================================

history["Date"] = pd.to_datetime(
    history["Date"],
    errors="coerce"
)

holidays["Date"] = pd.to_datetime(
    holidays["Date"],
    errors="coerce"
)


history = history.dropna(
    subset=["Date"]
)


holidays = holidays.dropna(
    subset=["Date"]
)


# ============================================================
# NUMERIC INPUT COLUMNS
# ============================================================

numeric_columns = [
    "Store",
    "DayOfWeek",
    "Sales",
    "Customers",
    "Promo",
    "SchoolHoliday",
    "CompetitionDistance",
    "CompetitionOpenSinceMonth",
    "CompetitionOpenSinceYear",
    "Promo2",
    "Promo2SinceWeek",
    "Promo2SinceYear"
]


for col in numeric_columns:

    if col in history.columns:

        history[col] = numeric(
            history[col]
        )


# ============================================================
# CLEAN SALES DATA
# ============================================================

history = history.sort_values(
    [
        "Store",
        "Date"
    ]
).reset_index(
    drop=True
)


# Remove duplicate Store + Date rows
history = history.drop_duplicates(
    subset=["Store", "Date"],
    keep="last"
)


# ============================================================
# HOLIDAY INFORMATION
# ============================================================

# The uploaded holiday file can contain different columns.
# We use it to update SchoolHoliday for matching dates.

holiday_columns = holidays.columns.tolist()


if "SchoolHoliday" in holiday_columns:

    holiday_lookup = (
        holidays[
            ["Date", "SchoolHoliday"]
        ]
        .drop_duplicates(
            subset=["Date"]
        )
    )

    history = history.merge(
        holiday_lookup,
        on="Date",
        how="left",
        suffixes=(
            "",
            "_holiday"
        )
    )

    if "SchoolHoliday_holiday" in history.columns:

        history["SchoolHoliday"] = (
            history["SchoolHoliday_holiday"]
            .fillna(
                history["SchoolHoliday"]
            )
        )

        history.drop(
            columns=["SchoolHoliday_holiday"],
            inplace=True
        )


# ============================================================
# FILL BASIC VALUES
# ============================================================

history["Promo"] = (
    numeric(history["Promo"])
    .fillna(0)
)


history["SchoolHoliday"] = (
    numeric(history["SchoolHoliday"])
    .fillna(0)
)


history["Customers"] = (
    numeric(history["Customers"])
    .fillna(0)
)


history["Sales"] = (
    numeric(history["Sales"])
    .fillna(0)
)


# ============================================================
# COMPETITION EXISTS
# ============================================================

history["CompetitionExists"] = (
    history["CompetitionDistance"]
    .notna()
    .astype(int)
)


# ============================================================
# PROMO2 ACTIVE
# ============================================================

history["Promo2"] = (
    numeric(history["Promo2"])
    .fillna(0)
)


# ============================================================
# DATE FEATURES
# ============================================================

history["Year"] = (
    history["Date"].dt.year
)


history["Month"] = (
    history["Date"].dt.month
)


history["Day"] = (
    history["Date"].dt.day
)


history["Week"] = (
    history["Date"].dt.isocalendar().week
    .astype(int)
)


history["Quarter"] = (
    history["Date"].dt.quarter
)


history["DayOfYear"] = (
    history["Date"].dt.dayofyear
)


history["IsWeekend"] = (
    history["DayOfWeek"]
    .isin([6, 7])
    .astype(int)
)


# ============================================================
# CYCLICAL FEATURES
# ============================================================

history["Month_sin"] = np.sin(
    2 * np.pi *
    history["Month"] /
    12
)


history["Month_cos"] = np.cos(
    2 * np.pi *
    history["Month"] /
    12
)


history["DayOfWeek_sin"] = np.sin(
    2 * np.pi *
    history["DayOfWeek"] /
    7
)


history["DayOfWeek_cos"] = np.cos(
    2 * np.pi *
    history["DayOfWeek"] /
    7
)


# ============================================================
# CATEGORICAL ENCODING
# ============================================================

history["StateHoliday"] = encode_state_holiday(
    history["StateHoliday"]
)


history["StoreType"] = encode_store_type(
    history["StoreType"]
)


history["Assortment"] = encode_assortment(
    history["Assortment"]
)


history["PromoInterval"] = encode_promo_interval(
    history["PromoInterval"]
)


# ============================================================
# NUMERIC STORE FEATURES
# ============================================================

store_numeric_columns = [
    "CompetitionDistance",
    "CompetitionOpenSinceMonth",
    "CompetitionOpenSinceYear",
    "Promo2SinceWeek",
    "Promo2SinceYear"
]


for col in store_numeric_columns:

    history[col] = numeric(
        history[col]
    ).fillna(0)


# ============================================================
# LAG FEATURES
# ============================================================

print("\n" + "=" * 70)
print("CREATING LAG FEATURES")
print("=" * 70)


history = history.sort_values(
    [
        "Store",
        "Date"
    ]
).reset_index(
    drop=True
)


grouped_sales = history.groupby(
    "Store"
)["Sales"]


history["Sales_Lag_1"] = (
    grouped_sales
    .shift(1)
)


history["Sales_Lag_7"] = (
    grouped_sales
    .shift(7)
)


history["Sales_Lag_14"] = (
    grouped_sales
    .shift(14)
)


history["Sales_Lag_28"] = (
    grouped_sales
    .shift(28)
)


# ============================================================
# ROLLING SALES FEATURES
# ============================================================

history["Sales_Rolling_7"] = (
    grouped_sales
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


history["Sales_Rolling_14"] = (
    grouped_sales
    .transform(
        lambda x:
        x.shift(1)
        .rolling(
            window=14,
            min_periods=1
        )
        .mean()
    )
)


history["Sales_Rolling_28"] = (
    grouped_sales
    .transform(
        lambda x:
        x.shift(1)
        .rolling(
            window=28,
            min_periods=1
        )
        .mean()
    )
)


history["Sales_RollingStd_7"] = (
    grouped_sales
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
# CUSTOMER FEATURES
# ============================================================

grouped_customers = history.groupby(
    "Store"
)["Customers"]


history["Customers_Lag_1"] = (
    grouped_customers
    .shift(1)
)


history["Customers_Lag_7"] = (
    grouped_customers
    .shift(7)
)


history["Customers_Rolling_7"] = (
    grouped_customers
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
# FILL LAG FEATURES
# ============================================================

lag_features = [
    "Sales_Lag_1",
    "Sales_Lag_7",
    "Sales_Lag_14",
    "Sales_Lag_28",
    "Sales_Rolling_7",
    "Sales_Rolling_14",
    "Sales_Rolling_28",
    "Sales_RollingStd_7",
    "Customers_Lag_1",
    "Customers_Lag_7",
    "Customers_Rolling_7"
]


history[lag_features] = (
    history[lag_features]
    .replace(
        [np.inf, -np.inf],
        np.nan
    )
    .fillna(0)
)


# ============================================================
# CHECK HISTORY
# ============================================================

print(
    "Processed history shape:",
    history.shape
)


print(
    "Stores:",
    history["Store"].nunique()
)


print(
    "Last historical date:",
    history["Date"].max().date()
)


# ============================================================
# FUTURE DATES
# ============================================================

last_date = (
    history["Date"].max()
)


future_dates = pd.date_range(
    start=last_date +
    pd.Timedelta(days=1),
    periods=HORIZON,
    freq="D"
)


print("\n" + "=" * 70)
print("FORECAST PERIOD")
print("=" * 70)


print(
    "Start:",
    future_dates.min().date()
)


print(
    "End:",
    future_dates.max().date()
)


# ============================================================
# GET LAST ROW FOR EACH STORE
# ============================================================

last_rows = (
    history
    .sort_values(
        [
            "Store",
            "Date"
        ]
    )
    .groupby(
        "Store",
        as_index=False
    )
    .tail(1)
    .reset_index(
        drop=True
    )
)


print(
    "\nStores to forecast:",
    len(last_rows)
)


# ============================================================
# CREATE FUTURE DATA
# ============================================================

future_rows = []


for _, last_row in last_rows.iterrows():

    store_id = last_row["Store"]

    for future_date in future_dates:

        row = last_row.copy()

        row["Date"] = future_date

        future_rows.append(
            row
        )


future = pd.DataFrame(
    future_rows
)


# ============================================================
# FUTURE CALENDAR FEATURES
# ============================================================

future["DayOfWeek"] = (
    future["Date"]
    .dt.dayofweek + 1
)


future["Year"] = (
    future["Date"].dt.year
)


future["Month"] = (
    future["Date"].dt.month
)


future["Day"] = (
    future["Date"].dt.day
)


future["Week"] = (
    future["Date"]
    .dt.isocalendar()
    .week
    .astype(int)
)


future["Quarter"] = (
    future["Date"].dt.quarter
)


future["DayOfYear"] = (
    future["Date"].dt.dayofyear
)


future["IsWeekend"] = (
    future["DayOfWeek"]
    .isin([6, 7])
    .astype(int)
)


# ============================================================
# CYCLICAL FUTURE FEATURES
# ============================================================

future["Month_sin"] = np.sin(
    2 * np.pi *
    future["Month"] /
    12
)


future["Month_cos"] = np.cos(
    2 * np.pi *
    future["Month"] /
    12
)


future["DayOfWeek_sin"] = np.sin(
    2 * np.pi *
    future["DayOfWeek"] /
    7
)


future["DayOfWeek_cos"] = np.cos(
    2 * np.pi *
    future["DayOfWeek"] /
    7
)


# ============================================================
# FUTURE HOLIDAY FEATURES
# ============================================================

future["SchoolHoliday"] = 0


if "SchoolHoliday" in holidays.columns:

    holiday_future = holidays[
        holidays["Date"].isin(
            future_dates
        )
    ][
        ["Date", "SchoolHoliday"]
    ].drop_duplicates(
        "Date"
    )

    future = future.drop(
        columns=["SchoolHoliday"],
        errors="ignore"
    )

    future = future.merge(
        holiday_future,
        on="Date",
        how="left"
    )

    future["SchoolHoliday"] = (
        numeric(
            future["SchoolHoliday"]
        )
        .fillna(0)
    )


# ============================================================
# FUTURE PROMO
# ============================================================

# Promo is not normally available in the holiday file.
# For future dates, use the last known promo pattern by
# weekday/store where available.

future["Promo"] = future["Promo"].fillna(0)


# ============================================================
# RECREATE STORE/CATEGORICAL VALUES
# ============================================================

# These were already carried from the latest store row.
# Make sure they are numeric.

future["StateHoliday"] = (
    numeric(
        future["StateHoliday"]
    ).fillna(0)
)


future["StoreType"] = (
    numeric(
        future["StoreType"]
    ).fillna(0)
)


future["Assortment"] = (
    numeric(
        future["Assortment"]
    ).fillna(0)
)


future["PromoInterval"] = (
    numeric(
        future["PromoInterval"]
    ).fillna(0)
)


# ============================================================
# RECURSIVE FORECASTING
# ============================================================
#
# IMPORTANT:
#
# XGBoost uses previous sales values.
#
# Therefore after predicting one day,
# that prediction is added to the history
# and becomes available for the next day.
#
# ============================================================

print("\n" + "=" * 70)
print("RUNNING RECURSIVE XGBOOST FORECAST")
print("=" * 70)


forecast_results = []


working_history = history.copy()


for forecast_date in future_dates:

    print(
        "Predicting:",
        forecast_date.date()
    )

    day_rows = future[
        future["Date"] ==
        forecast_date
    ].copy()


    # --------------------------------------------------------
    # CALCULATE LAGS FROM CURRENT WORKING HISTORY
    # --------------------------------------------------------

    for idx, row in day_rows.iterrows():

        store_id = row["Store"]

        store_history = (
            working_history[
                working_history["Store"] ==
                store_id
            ]
            .sort_values("Date")
        )


        sales_values = (
            store_history["Sales"]
            .values
        )


        customer_values = (
            store_history["Customers"]
            .values
        )


        # ----------------------------------------------------
        # SALES LAGS
        # ----------------------------------------------------

        if len(sales_values) >= 1:

            day_rows.loc[
                idx,
                "Sales_Lag_1"
            ] = sales_values[-1]

        else:

            day_rows.loc[
                idx,
                "Sales_Lag_1"
            ] = 0


        if len(sales_values) >= 7:

            day_rows.loc[
                idx,
                "Sales_Lag_7"
            ] = sales_values[-7]

        else:

            day_rows.loc[
                idx,
                "Sales_Lag_7"
            ] = 0


        if len(sales_values) >= 14:

            day_rows.loc[
                idx,
                "Sales_Lag_14"
            ] = sales_values[-14]

        else:

            day_rows.loc[
                idx,
                "Sales_Lag_14"
            ] = 0


        if len(sales_values) >= 28:

            day_rows.loc[
                idx,
                "Sales_Lag_28"
            ] = sales_values[-28]

        else:

            day_rows.loc[
                idx,
                "Sales_Lag_28"
            ] = 0


        # ----------------------------------------------------
        # ROLLING SALES
        # ----------------------------------------------------

        previous_sales = (
            pd.Series(
                sales_values
            )
            .tail(7)
        )

        day_rows.loc[
            idx,
            "Sales_Rolling_7"
        ] = previous_sales.mean()


        previous_sales_14 = (
            pd.Series(
                sales_values
            )
            .tail(14)
        )

        day_rows.loc[
            idx,
            "Sales_Rolling_14"
        ] = previous_sales_14.mean()


        previous_sales_28 = (
            pd.Series(
                sales_values
            )
            .tail(28)
        )

        day_rows.loc[
            idx,
            "Sales_Rolling_28"
        ] = previous_sales_28.mean()


        day_rows.loc[
            idx,
            "Sales_RollingStd_7"
        ] = previous_sales.std()


        # ----------------------------------------------------
        # CUSTOMER FEATURES
        # ----------------------------------------------------

        if len(customer_values) >= 1:

            day_rows.loc[
                idx,
                "Customers_Lag_1"
            ] = customer_values[-1]

        else:

            day_rows.loc[
                idx,
                "Customers_Lag_1"
            ] = 0


        if len(customer_values) >= 7:

            day_rows.loc[
                idx,
                "Customers_Lag_7"
            ] = customer_values[-7]

        else:

            day_rows.loc[
                idx,
                "Customers_Lag_7"
            ] = 0


        previous_customers = (
            pd.Series(
                customer_values
            )
            .tail(7)
        )


        day_rows.loc[
            idx,
            "Customers_Rolling_7"
        ] = previous_customers.mean()


    # ========================================================
    # FINAL FEATURE MATRIX
    # ========================================================

    X_future = day_rows[
        MODEL_FEATURES
    ].copy()


    # --------------------------------------------------------
    # FORCE NUMERIC
    # --------------------------------------------------------

    for col in MODEL_FEATURES:

        X_future[col] = pd.to_numeric(
            X_future[col],
            errors="coerce"
        )


    X_future = (
        X_future
        .replace(
            [np.inf, -np.inf],
            np.nan
        )
        .fillna(0)
    )


    X_future = X_future.astype(
        np.float64
    )


    # ========================================================
    # VERIFY
    # ========================================================

    if list(X_future.columns) != MODEL_FEATURES:

        raise ValueError(
            "Feature order mismatch!"
        )


    if X_future.shape[1] != 38:

        raise ValueError(
            f"Expected 38 features, got {X_future.shape[1]}"
        )


    object_columns = (
        X_future
        .select_dtypes(
            include=["object"]
        )
        .columns
        .tolist()
    )


    if object_columns:

        raise ValueError(
            f"Object columns found: {object_columns}"
        )


    # ========================================================
    # PREDICT
    # ========================================================

    predictions = model.predict(
        X_future
    )


    predictions = np.maximum(
        predictions,
        0
    )


    # ========================================================
    # SAVE DAY RESULTS
    # ========================================================

    for i, (_, row) in enumerate(
        day_rows.iterrows()
    ):

        predicted_sales = float(
            predictions[i]
        )


        forecast_results.append({
            "Store": int(row["Store"]),
            "Date": forecast_date,
            "ForecastSales": round(
                predicted_sales,
                2
            )
        })


        # ----------------------------------------------------
        # ADD PREDICTION TO WORKING HISTORY
        # ----------------------------------------------------

        new_history_row = row.copy()

        new_history_row["Sales"] = (
            predicted_sales
        )

        new_history_row["Date"] = (
            forecast_date
        )


        working_history = pd.concat(
            [
                working_history,
                pd.DataFrame(
                    [new_history_row]
                )
            ],
            ignore_index=True
        )


# ============================================================
# CREATE FINAL FORECAST DATAFRAME
# ============================================================

forecast_df = pd.DataFrame(
    forecast_results
)


forecast_df = forecast_df.sort_values(
    [
        "Date",
        "Store"
    ]
).reset_index(
    drop=True
)


# ============================================================
# OVERALL FORECAST
# ============================================================

overall_forecast = (
    forecast_df
    .groupby(
        "Date",
        as_index=False
    )[
        "ForecastSales"
    ]
    .sum()
    .rename(
        columns={
            "ForecastSales":
            "OverallForecastSales"
        }
    )
)


overall_forecast[
    "OverallForecastSales"
] = (
    overall_forecast[
        "OverallForecastSales"
    ].round(2)
)


# ============================================================
# SAVE OUTPUT FILES
# ============================================================

import os
import json

OUTPUT_DIR = r"D:\Development\Demand Forecasting Platform\New folder\model_outputs\xgboost"

# Create output folder automatically
os.makedirs(OUTPUT_DIR, exist_ok=True)

OUTPUT_FILE = os.path.join(
    OUTPUT_DIR,
    "store_forecast.csv"
)

JSON_OUTPUT_FILE = os.path.join(
    OUTPUT_DIR,
    "store_forecast.json"
)

CSV_EVALUATION_DAYS = os.path.join(
    OUTPUT_DIR,
    "xgboost_30day_evaluation.csv"
)

JSON_EVALUATION_DAYS = os.path.join(
    OUTPUT_DIR,
    "xgboost_30day_evaluation.json"
)


# ============================================================
# REMOVE OLD FILES
# ============================================================

for file_path in [
    OUTPUT_FILE,
    JSON_OUTPUT_FILE,
    CSV_EVALUATION_DAYS,
    JSON_EVALUATION_DAYS
]:

    if os.path.exists(file_path):

        os.remove(file_path)

        print(
            "Removed existing:",
            file_path
        )


# ============================================================
# SAVE 7-DAY FORECAST CSV
# ============================================================

forecast_df.to_csv(
    OUTPUT_FILE,
    index=False
)


# ============================================================
# CREATE 7-DAY FORECAST JSON
# ============================================================

json_forecast = {
    "model": "XGBoost",
    "forecast_horizon_days": HORIZON,
    "stores": int(
        forecast_df["Store"].nunique()
    ),
    "forecast": []
}


for date in sorted(
    forecast_df["Date"].unique()
):

    date_rows = forecast_df[
        forecast_df["Date"] == date
    ]

    store_forecasts = []

    for _, row in date_rows.iterrows():

        store_forecasts.append({
            "store": int(row["Store"]),
            "forecast_sales": float(
                row["ForecastSales"]
            )
        })


    overall_sales = sum(
        item["forecast_sales"]
        for item in store_forecasts
    )


    json_forecast["forecast"].append({

        "date": (
            date.strftime("%Y-%m-%d")
            if hasattr(date, "strftime")
            else str(date)
        ),

        "stores": store_forecasts,

        "overall_forecast_sales": round(
            overall_sales,
            2
        )
    })


# ============================================================
# SAVE JSON
# ============================================================

with open(
    JSON_OUTPUT_FILE,
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        json_forecast,
        f,
        indent=4
    )


# ============================================================
# FINAL OUTPUT CHECK
# ============================================================

print("\n" + "=" * 70)
print("FORECAST FILES SAVED SUCCESSFULLY")
print("=" * 70)

print(
    "Stores forecasted:",
    forecast_df["Store"].nunique()
)

print(
    "Forecast days:",
    forecast_df["Date"].nunique()
)

print(
    "Forecast rows:",
    len(forecast_df)
)

print()
print("CSV:")
print(OUTPUT_FILE)

print()
print("JSON:")
print(JSON_OUTPUT_FILE)

print("=" * 70)