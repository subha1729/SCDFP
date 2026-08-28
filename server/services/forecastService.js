import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODEL_OUTPUT_DIR = path.resolve(
  __dirname,
  "../../model_output"
);

function readModelForecast(modelName) {
  const filePath = path.join(
    MODEL_OUTPUT_DIR,
    modelName,
    "store_forecast.json"
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`Forecast file not found: ${filePath}`);
  }

  const rawData = fs.readFileSync(
    filePath,
    "utf-8"
  );

  const data = JSON.parse(rawData);

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.forecast)) {
    return data.forecast;
  }

  return [];
}

export function getAllForecasts() {
  return {
    xgboost: readModelForecast("xgboost"),
    lstm: readModelForecast("lstm"),
    prophet: readModelForecast("prophet"),
  };
}