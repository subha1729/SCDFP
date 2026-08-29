import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
============================================================
MODEL OUTPUT DIRECTORY
============================================================

Project structure:

New folder/
│
├── model_outputs/
│   ├── xgboost/
│   │   └── store_forecast.json
│   │
│   ├── lstm/
│   │   └── store_forecast.json
│   │
│   └── prophet/
│       └── prophet_store_forecast.json
│
└── server/
    └── services/
        └── forecastService.js

From:
server/services/

../../model_outputs
        ↑
correct directory
============================================================
*/

const MODEL_OUTPUT_DIR = path.resolve(
  __dirname,
  "../../model_outputs"
);


/*
============================================================
READ JSON FILE
============================================================
*/

function readJsonFile(filePath) {

  if (!fs.existsSync(filePath)) {

    throw new Error(
      `Forecast file not found: ${filePath}`
    );
  }

  const rawData = fs.readFileSync(
    filePath,
    "utf-8"
  );

  try {

    return JSON.parse(rawData);

  } catch (error) {

    throw new Error(
      `Invalid JSON in forecast file: ${filePath}`
    );
  }
}


/*
============================================================
NORMALIZE XGBOOST
============================================================

XGBoost format:

{
  "model": "XGBoost",
  "forecast_horizon_days": 7,
  "stores": 50,
  "forecast": [
    {
      "date": "2026-01-01",
      "stores": [
        {
          "store": 1,
          "forecast_sales": 5490.63
        }
      ]
    }
  ]
}

Convert to:

[
  {
    "store": 1,
    "date": "2026-01-01",
    "forecastSales": 5490.63
  }
]
============================================================
*/

function normalizeXGBoost(data) {

  if (
    !data ||
    !Array.isArray(data.forecast)
  ) {
    return [];
  }

  const result = [];

  for (const day of data.forecast) {

    if (
      !day ||
      !day.date ||
      !Array.isArray(day.stores)
    ) {
      continue;
    }

    for (const storeData of day.stores) {

      result.push({
        store: Number(storeData.store),
        date: day.date,
        forecastSales: Number(
          storeData.forecast_sales
        )
      });

    }
  }

  return result;
}


/*
============================================================
NORMALIZE LSTM
============================================================

LSTM format:

[
  {
    "Store": 1,
    "Date": "2026-01-01",
    "ForecastSales": 5513.11
  }
]
============================================================
*/

function normalizeLSTM(data) {

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(item => ({
    store: Number(item.Store),
    date: item.Date,
    forecastSales: Number(
      item.ForecastSales
    )
  }));
}


/*
============================================================
NORMALIZE PROPHET
============================================================

Prophet format:

[
  {
    "Store": 1,
    "Date": 1767225600000,
    "ForecastSales": 5365.17
  }
]

Date is Unix timestamp in milliseconds.

Convert it to:

2026-01-01
============================================================
*/

function normalizeProphet(data) {

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(item => {

    let date;

    /*
    Prophet Date is a timestamp
    */

    if (
      typeof item.Date === "number"
    ) {

      date = new Date(
        item.Date
      )
        .toISOString()
        .split("T")[0];

    } else {

      date = item.Date;

    }

    return {
      store: Number(item.Store),
      date,
      forecastSales: Number(
        item.ForecastSales
      )
    };

  });
}


/*
============================================================
LOAD XGBOOST
============================================================
*/

function getXGBoostForecast() {

  const filePath = path.join(
    MODEL_OUTPUT_DIR,
    "xgboost",
    "store_forecast.json"
  );

  console.log(
    "Loading XGBoost:",
    filePath
  );

  const data = readJsonFile(
    filePath
  );

  return {
    model: "XGBoost",

    forecast_horizon_days:
      data.forecast_horizon_days || 7,

    stores:
      data.stores || 50,

    forecast:
      normalizeXGBoost(data)
  };
}


/*
============================================================
LOAD LSTM
============================================================
*/

function getLSTMForecast() {

  const filePath = path.join(
    MODEL_OUTPUT_DIR,
    "lstm",
    "store_forecast.json"
  );

  console.log(
    "Loading LSTM:",
    filePath
  );

  const data = readJsonFile(
    filePath
  );

  const forecast =
    normalizeLSTM(data);

  return {
    model: "LSTM",

    forecast_horizon_days: 7,

    stores:
      new Set(
        forecast.map(
          item => item.store
        )
      ).size,

    forecast
  };
}


/*
============================================================
LOAD PROPHET
============================================================
*/

function getProphetForecast() {

  const filePath = path.join(
    MODEL_OUTPUT_DIR,
    "prophet",
    "prophet_store_forecast.json"
  );

  console.log(
    "Loading Prophet:",
    filePath
  );

  const data = readJsonFile(
    filePath
  );

  const forecast =
    normalizeProphet(data);

  return {
    model: "Prophet",

    forecast_horizon_days: 7,

    stores:
      new Set(
        forecast.map(
          item => item.store
        )
      ).size,

    forecast
  };
}


/*
============================================================
GET ALL FORECASTS
============================================================
*/

export function getAllForecasts() {

  console.log("");
  console.log(
    "======================================"
  );
  console.log(
    " Loading all forecast models"
  );
  console.log(
    "======================================"
  );

  const xgboost =
    getXGBoostForecast();

  const lstm =
    getLSTMForecast();

  const prophet =
    getProphetForecast();

  console.log(
    "XGBoost records:",
    xgboost.forecast.length
  );

  console.log(
    "LSTM records:",
    lstm.forecast.length
  );

  console.log(
    "Prophet records:",
    prophet.forecast.length
  );

  console.log(
    "======================================"
  );
  console.log("");

  return {
    xgboost,
    lstm,
    prophet
  };
}