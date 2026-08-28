import express from "express";
import { getAllForecasts } from "../services/forecastService.js";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const forecasts = getAllForecasts();

    res.json({
      success: true,
      data: forecasts,
    });
  } catch (error) {
    console.error(
      "Forecast API error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;