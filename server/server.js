import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import forecastRoute from "./route/forecastRoute.js";
import clusteringRoute from "./route/clusteringRoute.js";
import uploadRoute from "./route/uploadRoute.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


/* ============================================================
   MIDDLEWARE
   ============================================================ */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/api/upload",
  uploadRoute
);


/* ============================================================
   UPLOAD DIRECTORY
   ============================================================ */

const uploadDir = path.resolve(
  process.cwd(),
  process.env.UPLOAD_DIR || "./uploads"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true
  });
}


/* ============================================================
   HEALTH CHECK
   ============================================================ */

app.get("/api/health", (req, res) => {

  res.json({
    success: true,
    message: "Supply Chain Forecasting API is running",
    server: "online",
    mongodb: "not_required"
  });

});


/* ============================================================
   FORECAST API
   ============================================================ */

app.use(
  "/api/forecast",
  forecastRoute
);

/* ============================================================
   CLUSTERING API
   ============================================================ */

app.use(
  "/api/clustering",
  clusteringRoute
);

/* ============================================================
   ROOT
   ============================================================ */

app.get("/", (req, res) => {

  res.json({
    message: "Supply Chain Demand Forecasting API",
    status: "running"
  });

});


/* ============================================================
   404 HANDLER
   ============================================================ */

app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });

});


/* ============================================================
   ERROR HANDLER
   ============================================================ */

app.use((err, req, res, next) => {

  console.error("Backend error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error"
  });

});


/* ============================================================
   START SERVER
   ============================================================ */

app.listen(PORT, () => {

  console.log("");
  console.log("======================================");
  console.log(" Supply Chain Forecasting Backend");
  console.log("======================================");
  console.log(` Server:  http://localhost:${PORT}`);
  console.log(` Health:  http://localhost:${PORT}/api/health`);
  console.log(` Forecast: http://localhost:${PORT}/api/forecast`);
  console.log(" MongoDB: Not required");
  console.log("======================================");
  console.log("");

});


