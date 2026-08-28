import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const CLUSTERING_FILE = path.resolve(
  process.cwd(),
  "..",
  "model_outputs",
  "hierarchical",
  "hierarchical_clustering_result.json"
);

router.get("/", (req, res) => {
  try {
    console.log("Loading clustering output:");
    console.log(CLUSTERING_FILE);

    if (!fs.existsSync(CLUSTERING_FILE)) {
      return res.status(404).json({
        success: false,
        message: "Hierarchical clustering result file not found.",
        path: CLUSTERING_FILE
      });
    }

    const rawData = fs.readFileSync(
      CLUSTERING_FILE,
      "utf-8"
    );

    const clusteringData = JSON.parse(rawData);

    return res.json(clusteringData);

  } catch (error) {
    console.error("Clustering API error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load clustering results.",
      error: error.message
    });
  }
});

export default router;