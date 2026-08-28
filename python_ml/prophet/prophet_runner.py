# ============================================================
# PROPHET — SAME 7-DAY FUTURE FORECAST AS LSTM
# ============================================================

import pandas as pd
import numpy as np
import time
from prophet import Prophet
from prophet.plot import plot_plotly
import os


# ------------------------------------------------------------
# 1. LOAD DATA
# ------------------------------------------------------------

sales = pd.read_csv(r"D:\Development\Demand Forecasting Platform\New folder\server\uploads\sales_history_dummy_new.csv")
holidays = pd.read_csv(r"D:\Development\Demand Forecasting Platform\New folder\server\uploads\holiday_dummy_new.csv")

sales["Date"] = pd.to_datetime(sales["Date"])
holidays["Date"] = pd.to_datetime(holidays["Date"])

# ------------------------------------------------------------
# 2. MERGE HOLIDAYS
# ------------------------------------------------------------

df_prophet = sales.merge(
    holidays,
    on="Date",
    how="left"
)

# Make sure required columns exist
if "Promo" not in df_prophet.columns:
    df_prophet["Promo"] = 0

if "SchoolHoliday" not in df_prophet.columns:
    df_prophet["SchoolHoliday"] = 0

df_prophet["Promo"] = pd.to_numeric(
    df_prophet["Promo"], errors="coerce"
).fillna(0)

df_prophet["SchoolHoliday"] = pd.to_numeric(
    df_prophet["SchoolHoliday"], errors="coerce"
).fillna(0)

# ------------------------------------------------------------
# 3. FIND LAST DATE
# ------------------------------------------------------------

LAST_DATE = df_prophet["Date"].max()

FORECAST_DATES = pd.date_range(
    start=LAST_DATE + pd.Timedelta(days=1),
    periods=7,
    freq="D"
)

print("=" * 70)
print("PROPHET 7-DAY FORECAST")
print("=" * 70)

print("Last historical date:", LAST_DATE.date())
print(
    "Forecast period:",
    FORECAST_DATES.min().date(),
    "to",
    FORECAST_DATES.max().date()
)

# ------------------------------------------------------------
# 4. STORES
# ------------------------------------------------------------

store_ids = sorted(
    df_prophet["Store"].unique()
)

print("Stores:", len(store_ids))

# ------------------------------------------------------------
# 5. FORECAST ONE STORE
# ------------------------------------------------------------

def forecast_prophet_store(store_id):

    store_data = (
        df_prophet[
            df_prophet["Store"] == store_id
        ]
        .sort_values("Date")
        .copy()
    )

    # Prophet training data
    prophet_train = store_data[
        ["Date", "Sales", "Promo", "SchoolHoliday"]
    ].rename(
        columns={
            "Date": "ds",
            "Sales": "y"
        }
    )

    # --------------------------------------------------------
    # Future 7 days
    # --------------------------------------------------------

    # Holiday / promo information for future dates
    future = pd.DataFrame({
        "ds": FORECAST_DATES
    })

    # Merge future information from holidays
    future = future.merge(
        holidays[
            ["Date", "SchoolHoliday"]
        ],
        left_on="ds",
        right_on="Date",
        how="left"
    )

    future.drop(
        columns=["Date"],
        inplace=True,
        errors="ignore"
    )

    # If future holiday information is unavailable
    future["SchoolHoliday"] = (
        future["SchoolHoliday"]
        .fillna(0)
        .astype(float)
    )

    # Promo is not known for future dates in this dummy setup.
    # Set to 0 unless you have future promotion information.
    future["Promo"] = 0

    # --------------------------------------------------------
    # Prophet model
    # --------------------------------------------------------

    model = Prophet(
        seasonality_mode="multiplicative",
        yearly_seasonality=False, # we have made it false
        weekly_seasonality=True,
        daily_seasonality=False,
        changepoint_prior_scale=0.05
    )

    model.add_country_holidays(
        country_name="DE"
    )

    model.add_regressor("Promo")
    model.add_regressor("SchoolHoliday")

    model.fit(prophet_train)

    # --------------------------------------------------------
    # Predict
    # --------------------------------------------------------

    forecast = model.predict(future)

    predicted_sales = np.maximum(
        forecast["yhat"].values,
        0
    )

    return predicted_sales


# ============================================================
# 6. RUN ALL STORES
# ============================================================

results = []

start_time = time.time()

for i, store_id in enumerate(store_ids):

    try:

        predictions = forecast_prophet_store(
            store_id
        )

        for date, prediction in zip(
            FORECAST_DATES,
            predictions
        ):

            results.append({
                "Store": store_id,
                "Date": date,
                "ForecastSales": prediction
            })

        if (i + 1) % 100 == 0:
            print(
                f"Processed {i + 1}/{len(store_ids)} stores"
            )

    except Exception as e:

        print(
            f"Store {store_id} failed: {e}"
        )



# ============================================================
# SAVE PROPHET OUTPUT FILES
# ============================================================

import os

OUTPUT_DIR = r"D:\Development\Demand Forecasting Platform\New folder\model_outputs\prophet"

# Create output directory if it does not exist
os.makedirs(OUTPUT_DIR, exist_ok=True)


# ============================================================
# OUTPUT FILE PATHS
# ============================================================

CSV_OUTPUT_FILE = os.path.join(
    OUTPUT_DIR,
    "prophet_store_forecast.csv"
)

JSON_OUTPUT_FILE = os.path.join(
    OUTPUT_DIR,
    "prophet_store_forecast.json"
)


# ============================================================
# DELETE OLD FILES
# ============================================================

output_files = [
    CSV_OUTPUT_FILE,
    JSON_OUTPUT_FILE
]

for file_path in output_files:

    if os.path.exists(file_path):

        os.remove(file_path)

        print(
            f"Existing file removed: {file_path}"
        )


# ============================================================
# STORE FORECAST
# ============================================================

prophet_store_forecast = pd.DataFrame(
    results
)

prophet_store_forecast[
    "ForecastSales"
] = prophet_store_forecast[
    "ForecastSales"
].round(2)


# ============================================================
# SAVE CSV
# ============================================================

prophet_store_forecast.to_csv(
    CSV_OUTPUT_FILE,
    index=False
)


# ============================================================
# SAVE JSON
# ============================================================

prophet_store_forecast.to_json(
    JSON_OUTPUT_FILE,
    orient="records",
    indent=4
)


# # ============================================================
# # 8. OVERALL FORECAST
# # ============================================================

# prophet_overall_forecast = (
#     prophet_store_forecast
#     .groupby("Date", as_index=False)
#     ["ForecastSales"]
#     .sum()
#     .rename(
#         columns={
#             "ForecastSales":
#             "OverallForecastSales"
#         }
#     )
# )

# prophet_overall_forecast[
#     "OverallForecastSales"
# ] = prophet_overall_forecast[
#     "OverallForecastSales"
# ].round(2)

# prophet_overall_forecast.to_csv(
#     "prophet_overall_forecast.csv",
#     index=False
# )

# ============================================================
# 9. DISPLAY
# ============================================================

print("\n" + "=" * 70)
print("STORE FORECAST")
print("=" * 70)

print(
    prophet_store_forecast.to_string(
        index=False
    )
)

print("\n" + "=" * 70)
print("OVERALL 7-DAY PROPHET FORECAST")
print("=" * 70)

# print(
#     prophet_overall_forecast.to_string(
#         index=False
#     )
# )

print("\n" + "=" * 70)
print("COMPLETE")
print("=" * 70)

print(
    "Stores forecasted:",
    len(store_ids)
)

print(
    "Forecast days:",
    len(FORECAST_DATES)
)

print(
    f"Time: {(time.time() - start_time) / 60:.2f} minutes"
)