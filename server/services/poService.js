import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* ============================================================
   PATH SETUP
============================================================ */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVER_DIR = path.resolve(__dirname, "..");
const PROJECT_ROOT = path.resolve(SERVER_DIR, "..");

const UPLOAD_DIR = path.join(
  SERVER_DIR,
  "uploads"
);

const XGBOOST_OUTPUT_DIR = path.join(
  PROJECT_ROOT,
  "model_outputs",
  "xgboost"
);

const PO_OUTPUT_DIR = path.join(
  PROJECT_ROOT,
  "model_outputs",
  "purchase_orders"
);


/* ============================================================
   ENSURE DIRECTORY
============================================================ */

function ensureDirectory(directory) {

  if (!fs.existsSync(directory)) {

    fs.mkdirSync(directory, {
      recursive: true
    });

  }

}


/* ============================================================
   NUMBER HELPER
============================================================ */

function toNumber(value) {

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;

}


/* ============================================================
   CSV PARSER
============================================================ */

function parseCSV(text) {

  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter(line => line.trim() !== "");

  if (lines.length < 2) {

    return [];

  }

  const headers = lines[0]
    .split(",")
    .map(header =>
      header.trim().replace(/^"|"$/g, "")
    );

  return lines.slice(1).map(line => {

    const values = [];
    let current = "";
    let insideQuotes = false;

    for (const char of line) {

      if (char === '"') {

        insideQuotes = !insideQuotes;

      } else if (
        char === "," &&
        !insideQuotes
      ) {

        values.push(current);
        current = "";

      } else {

        current += char;

      }

    }

    values.push(current);

    const row = {};

    headers.forEach((header, index) => {

      row[header] =
        (values[index] || "")
          .trim()
          .replace(/^"|"$/g, "");

    });

    return row;

  });

}


/* ============================================================
   READ CSV
============================================================ */

function readCSV(filePath) {

  if (!fs.existsSync(filePath)) {

    throw new Error(
      `CSV file not found:\n${filePath}`
    );

  }

  const content =
    fs.readFileSync(
      filePath,
      "utf8"
    );

  return parseCSV(content);

}


/* ============================================================
   FIND FORECAST COLUMN
============================================================ */

function getForecastValue(row) {

  const possibleColumns = [

    "Predicted_Sales",
    "PredictedSales",
    "Forecast",
    "Forecast_Sales",
    "ForecastSales",
    "Sales_Forecast",
    "prediction",
    "Prediction",
    "Predicted"

  ];

  for (const column of possibleColumns) {

    if (
      Object.prototype.hasOwnProperty.call(
        row,
        column
      )
    ) {

      return toNumber(
        row[column]
      );

    }

  }


  /* ----------------------------------------------------------
     Fallback: find a numeric prediction-like column
  ---------------------------------------------------------- */

  for (const key of Object.keys(row)) {

    const lower =
      key.toLowerCase();

    if (
      lower.includes("forecast") ||
      lower.includes("predict")
    ) {

      return toNumber(
        row[key]
      );

    }

  }

  return 0;

}


/* ============================================================
   GET STORE ID
============================================================ */

function getStoreId(row) {

  const possibleColumns = [

    "Store",
    "Store_ID",
    "StoreID",
    "store",
    "store_id"

  ];

  for (const column of possibleColumns) {

    if (
      Object.prototype.hasOwnProperty.call(
        row,
        column
      )
    ) {

      return String(
        row[column]
      ).trim();

    }

  }

  return null;

}


/* ============================================================
   GET FORECAST DATE
============================================================ */

function getDate(row) {

  const possibleColumns = [

    "Date",
    "date",
    "Forecast_Date",
    "forecast_date"

  ];

  for (const column of possibleColumns) {

    if (
      Object.prototype.hasOwnProperty.call(
        row,
        column
      )
    ) {

      return String(
        row[column]
      ).trim();

    }

  }

  return null;

}


/* ============================================================
   GET INVENTORY STORE ID
============================================================ */

function getInventoryStoreId(row) {

  if (
    row.Store_ID !== undefined
  ) {

    return String(
      row.Store_ID
    ).trim();

  }

  if (
    row.Store !== undefined
  ) {

    return String(
      row.Store
    ).trim();

  }

  return null;

}


/* ============================================================
   GENERATE PURCHASE ORDERS
============================================================ */

export function generatePurchaseOrders() {

  console.log("");
  console.log(
    "=========================================="
  );

  console.log(
    " GENERATING 7-DAY PURCHASE ORDERS"
  );

  console.log(
    "=========================================="
  );


  /* ==========================================================
     INPUT FILES
  ========================================================== */

  const inventoryPath =
    path.join(
      UPLOAD_DIR,
      "current_inventory_status.csv"
    );

  const forecastPath =
    path.join(
      XGBOOST_OUTPUT_DIR,
      "store_forecast.csv"
    );


  if (!fs.existsSync(inventoryPath)) {

    throw new Error(
      `Inventory file not found:\n${inventoryPath}`
    );

  }


  if (!fs.existsSync(forecastPath)) {

    throw new Error(
      `XGBoost forecast file not found:\n${forecastPath}`
    );

  }


  /* ==========================================================
     LOAD DATA
  ========================================================== */

  const inventory =
    readCSV(
      inventoryPath
    );

  const forecast =
    readCSV(
      forecastPath
    );


  console.log(
    "Inventory rows:",
    inventory.length
  );

  console.log(
    "Forecast rows:",
    forecast.length
  );


  if (inventory.length === 0) {

    throw new Error(
      "Inventory CSV contains no data."
    );

  }


  if (forecast.length === 0) {

    throw new Error(
      "Forecast CSV contains no data."
    );

  }


  /* ==========================================================
     INVENTORY MAP
  ========================================================== */

  const inventoryMap =
    new Map();


  for (const row of inventory) {

    const storeId =
      getInventoryStoreId(row);

    if (!storeId) {

      continue;

    }

    inventoryMap.set(
      storeId,
      {

        safetyStock:
          toNumber(
            row.Safety_Stock
          ),

        availableStock:
          toNumber(
            row.Available_Stock
          )

      }
    );

  }


  /* ==========================================================
     GROUP NEXT 7 FORECAST DAYS BY STORE
     
     IMPORTANT:
     
     We do NOT group by week.
     
     The model produces 7 daily forecast rows
     for every store.
     
     We sum those 7 rows so each store produces
     exactly ONE purchase order.
  ========================================================== */

  const storeForecast =
    new Map();


  for (const row of forecast) {

    const storeId =
      getStoreId(row);

    const date =
      getDate(row);

    const prediction =
      getForecastValue(row);


    if (!storeId || !date) {

      continue;

    }


    /* --------------------------------------------------------
       Create store record if it does not exist
    -------------------------------------------------------- */

    if (
      !storeForecast.has(storeId)
    ) {

      storeForecast.set(
        storeId,
        {

          storeId,

          forecastStart:
            date,

          forecastEnd:
            date,

          forecastDemand:
            0,

          forecastDays:
            0

        }
      );

    }


    const item =
      storeForecast.get(
        storeId
      );


    /* --------------------------------------------------------
       Add daily forecast to 7-day total
    -------------------------------------------------------- */

    item.forecastDemand +=
      prediction;

    item.forecastDays +=
      1;


    /* --------------------------------------------------------
       Track forecast period
    -------------------------------------------------------- */

    if (
      date < item.forecastStart
    ) {

      item.forecastStart =
        date;

    }


    if (
      date > item.forecastEnd
    ) {

      item.forecastEnd =
        date;

    }

  }


  /* ==========================================================
     VALIDATE FORECAST DAYS
     
     Expected:
     
     7 forecast rows per store.
     
     We warn instead of failing so the pipeline
     remains compatible with existing data.
  ========================================================== */

  for (
    const item of storeForecast.values()
  ) {

    if (
      item.forecastDays !== 7
    ) {

      console.warn(
        `WARNING: Store ${item.storeId} has ` +
        `${item.forecastDays} forecast days. ` +
        `Expected 7.`
      );

    }

  }


  /* ==========================================================
     GENERATE ONE PO PER STORE
  ========================================================== */

  const purchaseOrders = [];


  for (
    const item of storeForecast.values()
  ) {

    const inventoryData =
      inventoryMap.get(
        item.storeId
      );


    /* --------------------------------------------------------
       Inventory
    -------------------------------------------------------- */

    const safetyStock =
      inventoryData
        ? inventoryData.safetyStock
        : 0;

    const availableStock =
      inventoryData
        ? inventoryData.availableStock
        : 0;


    /* --------------------------------------------------------
       PO FORMULA
       
       7-Day Forecast Demand
       + Safety Stock
       - Available Stock
    -------------------------------------------------------- */

    const recommendedPO =
      Math.max(
        0,
        item.forecastDemand
        + safetyStock
        - availableStock
      );


    /* --------------------------------------------------------
       ONE RECORD PER STORE
    -------------------------------------------------------- */

    purchaseOrders.push({

      Store_ID:
        item.storeId,

      Week_Start:
        item.forecastStart,

      Week_End:
        item.forecastEnd,

      Forecast_Demand:
        Number(
          item.forecastDemand.toFixed(2)
        ),

      Safety_Stock:
        Number(
          safetyStock.toFixed(2)
        ),

      Available_Stock:
        Number(
          availableStock.toFixed(2)
        ),

      Recommended_PO:
        Math.ceil(
          recommendedPO
        )

    });

  }


  /* ==========================================================
     SORT BY STORE
  ========================================================== */

  purchaseOrders.sort(
    (a, b) => {

      const storeA =
        Number(a.Store_ID);

      const storeB =
        Number(b.Store_ID);


      if (
        Number.isFinite(storeA) &&
        Number.isFinite(storeB)
      ) {

        return storeA - storeB;

      }


      return String(
        a.Store_ID
      ).localeCompare(
        String(
          b.Store_ID
        )
      );

    }
  );


  /* ==========================================================
     OUTPUT DIRECTORY
  ========================================================== */

  ensureDirectory(
    PO_OUTPUT_DIR
  );


  const csvPath =
    path.join(
      PO_OUTPUT_DIR,
      "weekly_po.csv"
    );

  const jsonPath =
    path.join(
      PO_OUTPUT_DIR,
      "weekly_po.json"
    );


  /* ==========================================================
     CSV
  ========================================================== */

  const headers = [

    "Store_ID",
    "Week_Start",
    "Week_End",
    "Forecast_Demand",
    "Safety_Stock",
    "Available_Stock",
    "Recommended_PO"

  ];


  const csvLines = [

    headers.join(","),

    ...purchaseOrders.map(row =>
      headers
        .map(header =>
          row[header]
        )
        .join(",")
    )

  ];


  fs.writeFileSync(
    csvPath,
    csvLines.join("\n"),
    "utf8"
  );


  /* ==========================================================
     JSON
  ========================================================== */

  fs.writeFileSync(

    jsonPath,

    JSON.stringify(
      purchaseOrders,
      null,
      2
    ),

    "utf8"

  );


  /* ==========================================================
     RESULT
  ========================================================== */

  const uniqueStores =
    new Set(
      purchaseOrders.map(
        row => row.Store_ID
      )
    ).size;


  console.log("");
  console.log(
    "=========================================="
  );

  console.log(
    " PURCHASE ORDERS GENERATED"
  );

  console.log(
    "=========================================="
  );

  console.log(
    "Stores:",
    uniqueStores
  );

  console.log(
    "PO rows:",
    purchaseOrders.length
  );

  console.log(
    "CSV:",
    csvPath
  );

  console.log(
    "JSON:",
    jsonPath
  );

  console.log(
    "=========================================="
  );


  return {

    success: true,

    rows:
      purchaseOrders.length,

    stores:
      uniqueStores,

    csv:
      csvPath,

    json:
      jsonPath,

    purchaseOrders

  };

}


export default {

  generatePurchaseOrders

};