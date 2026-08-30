import express from "express";
import multer from "multer";

import {
  saveUploadedFiles,
  runForecastPipeline
} from "../services/pipelineService.js";

const router = express.Router();


/* ============================================================
   MULTER
============================================================ */

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 100 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {

    if (
      file.mimetype === "text/csv" ||
      file.originalname
        .toLowerCase()
        .endsWith(".csv")
    ) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "Only CSV files are allowed."
        )
      );
    }
  }
});


/* ============================================================
   POST /api/upload
============================================================ */

router.post(
  "/",

  upload.fields([
    {
      name: "sales",
      maxCount: 1
    },
    {
      name: "holidays",
      maxCount: 1
    },
    {
      name: "inventory",
      maxCount: 1
    }
  ]),

  async (req, res) => {

    try {

      console.log("");
      console.log(
        "======================================"
      );
      console.log(
        " DATA UPLOAD STARTED"
      );
      console.log(
        "======================================"
      );


      const salesFile =
        req.files?.sales?.[0];

      const holidayFile =
        req.files?.holidays?.[0];
      
      const inventoryFile =
        req.files?.inventory?.[0];


      /* ------------------------------------------------------
         VALIDATION
      ------------------------------------------------------ */

      if (!salesFile) {

        return res.status(400).json({
          success: false,
          message:
            "Sales history CSV is required."
        });
      }


      if (!holidayFile) {

        return res.status(400).json({
          success: false,
          message:
            "Holiday CSV is required."
        });
      }

      if (!inventoryFile) {

        return res.status(400).json({
          success: false,
          message:
            "Current inventory status CSV is required."
        });

      }


      console.log(
        "Sales file:",
        salesFile.originalname
      );

      console.log(
        "Holiday file:",
        holidayFile.originalname
      );


      /* ------------------------------------------------------
         SAVE FILES
      ------------------------------------------------------ */

      const savedFiles =
        saveUploadedFiles(
          salesFile,
          holidayFile,
          inventoryFile
        );


      console.log(
        "✓ Input files saved"
      );


      /* ------------------------------------------------------
         RUN PIPELINE
      ------------------------------------------------------ */

      const pipelineResult =
        await runForecastPipeline();


      return res.status(200).json({

        success: true,

        message:
          "Files uploaded and forecasting pipeline completed successfully.",

        files: {
          sales:
            salesFile.originalname,

          holidays:
            holidayFile.originalname,
          
          inventory:
            inventoryFile.originalname
        },

        pipeline:
          pipelineResult

      });

    } catch (error) {

      console.error("");
      console.error(
        "======================================"
      );
      console.error(
        " UPLOAD / PIPELINE ERROR"
      );
      console.error(
        "======================================"
      );

      console.error(error);


      return res.status(500).json({

        success: false,

        message:
          "Upload or forecast generation failed.",

        error:
          error.message

      });
    }
  }
);


/* ============================================================
   ERROR HANDLER
============================================================ */

router.use(
  (error, req, res, next) => {

    console.error(
      "Upload error:",
      error
    );

    return res.status(400).json({

      success: false,

      message:
        error.message ||
        "File upload failed."

    });
  }
);


export default router;