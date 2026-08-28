import mongoose from "mongoose";

const forecastSchema = new mongoose.Schema(
  {
    storeId: {
      type: Number,
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    actual: {
      type: Number,
      default: null,
    },

    xgboost: {
      type: Number,
      default: null,
    },

    lstm: {
      type: Number,
      default: null,
    },

    prophet: {
      type: Number,
      default: null,
    },

    ensemble: {
      type: Number,
      default: null,
    },

    model: {
      type: String,
      enum: [
        "XGBoost",
        "LSTM",
        "Prophet",
        "Ensemble",
      ],
      default: "XGBoost",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "forecasts",
  }
);

const Forecast = mongoose.model(
  "Forecast",
  forecastSchema
);

export default Forecast;