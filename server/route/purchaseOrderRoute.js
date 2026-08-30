import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();


/* ============================================================
   PATH SETUP
============================================================ */

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const SERVER_DIR =
  path.resolve(
    __dirname,
    ".."
  );

const PROJECT_ROOT =
  path.resolve(
    SERVER_DIR,
    ".."
  );


const PO_JSON_PATH =
  path.join(
    PROJECT_ROOT,
    "model_outputs",
    "purchase_orders",
    "weekly_po.json"
  );


/* ============================================================
   GET /api/purchase-orders
============================================================ */

router.get("/", async (req, res) => {

  try {

    console.log("");
    console.log(
      "======================================"
    );

    console.log(
      " LOADING PURCHASE ORDERS"
    );

    console.log(
      "======================================"
    );

    console.log(
      "Looking for:",
      PO_JSON_PATH
    );


    /* --------------------------------------------------------
       CHECK FILE
    -------------------------------------------------------- */

    if (!fs.existsSync(PO_JSON_PATH)) {

      console.log(
        "PO JSON NOT FOUND"
      );

      return res.status(404).json({

        success: false,

        message:
          "Purchase order output has not been generated yet.",

        path:
          PO_JSON_PATH,

        purchaseOrders: []

      });

    }


    /* --------------------------------------------------------
       READ JSON
    -------------------------------------------------------- */

    const content =
      fs.readFileSync(
        PO_JSON_PATH,
        "utf8"
      );


    const purchaseOrders =
      JSON.parse(content);


    /* --------------------------------------------------------
       VALIDATE
    -------------------------------------------------------- */

    if (!Array.isArray(purchaseOrders)) {

      throw new Error(
        "weekly_po.json does not contain an array."
      );

    }


    /* --------------------------------------------------------
       STORE COUNT
    -------------------------------------------------------- */

    const storeIds =
      new Set(
        purchaseOrders.map(
          order =>
            String(
              order.Store_ID
            )
        )
      );


    /* --------------------------------------------------------
       TOTALS
    -------------------------------------------------------- */

    const totalForecastDemand =
      purchaseOrders.reduce(
        (total, order) =>
          total +
          Number(
            order.Forecast_Demand || 0
          ),
        0
      );


    const totalRecommendedPO =
      purchaseOrders.reduce(
        (total, order) =>
          total +
          Number(
            order.Recommended_PO || 0
          ),
        0
      );


    /* --------------------------------------------------------
       SUCCESS
    -------------------------------------------------------- */

    console.log(
      "✓ PO JSON loaded"
    );

    console.log(
      "Stores:",
      storeIds.size
    );

    console.log(
      "PO rows:",
      purchaseOrders.length
    );


    return res.status(200).json({

      success: true,

      message:
        "Purchase orders loaded successfully.",

      count:
        purchaseOrders.length,

      storeCount:
        storeIds.size,

      totalForecastDemand:
        Number(
          totalForecastDemand.toFixed(2)
        ),

      totalRecommendedPO:
        Math.ceil(
          totalRecommendedPO
        ),

      purchaseOrders

    });

  } catch (error) {

    console.error(
      "Purchase order route error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to load purchase orders.",

      error:
        error.message,

      purchaseOrders: []

    });

  }

});


export default router;