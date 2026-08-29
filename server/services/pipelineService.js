import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";


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

const PYTHON_ML_DIR = path.join(
  PROJECT_ROOT,
  "python_ml"
);

const MODEL_OUTPUT_DIR = path.join(
  PROJECT_ROOT,
  "model_outputs"
);


/* ============================================================
   PYTHON ENVIRONMENT

   IMPORTANT:
   We DO NOT use "python".

   We use the same TensorFlow environment that successfully
   executed your LSTM runner.
============================================================ */

const PYTHON_EXECUTABLE = path.join(
  PROJECT_ROOT,
  "tf_env",
  "Scripts",
  "python.exe"
);


/* ============================================================
   PYTHON RUNNERS

   DO NOT MODIFY THE PYTHON FILES.
============================================================ */

const RUNNERS = {

  xgboost: path.join(
    PYTHON_ML_DIR,
    "xgboost",
    "xgboost_runner.py"
  ),

  lstm: path.join(
    PYTHON_ML_DIR,
    "lstm",
    "lstm_runner.py"
  ),

  prophet: path.join(
    PYTHON_ML_DIR,
    "prophet",
    "prophet_runner.py"
  ),

  hierarchical: path.join(
    PYTHON_ML_DIR,
    "hierarchical",
    "hierarchical_runner.py"
  )

};


/* ============================================================
   INPUT FILE NAMES

   Python interfaces can continue using their expected names.

   Uploaded files are also preserved using their EXACT
   original names.
============================================================ */

// const SALES_INPUT_NAME = "sales_history.csv";
// const HOLIDAY_INPUT_NAME = "holidays.csv";


/* ============================================================
   UTILITY: ENSURE DIRECTORY
============================================================ */

function ensureDirectory(directory) {

  if (!fs.existsSync(directory)) {

    fs.mkdirSync(
      directory,
      {
        recursive: true
      }
    );

  }

}


/* ============================================================
   UTILITY: CHECK FILE
============================================================ */

function checkFile(filePath, description) {

  if (!fs.existsSync(filePath)) {

    throw new Error(
      `${description} not found:\n${filePath}`
    );

  }

}


/* ============================================================
   INITIALIZE DIRECTORIES
============================================================ */

ensureDirectory(UPLOAD_DIR);
ensureDirectory(MODEL_OUTPUT_DIR);


/* ============================================================
   SAVE UPLOADED FILES
============================================================

   IMPORTANT:

   1. Existing CSV uploads are removed.
   2. New files are saved with their EXACT original names.
   3. We additionally create the standard filenames expected
      by the Python interfaces.

   Therefore:

   Original:
      sales_history_dummy_new.csv

   remains:

      uploads/sales_history_dummy_new.csv

   And the Python-compatible copy is:

      uploads/sales_history.csv

   Same for holidays.
============================================================ */

/* ============================================================
   SAVE UPLOADED FILES
============================================================ */

export function saveUploadedFiles(
  salesFile,
  holidayFile
) {

  if (!salesFile) {
    throw new Error(
      "Sales history file is missing."
    );
  }

  if (!holidayFile) {
    throw new Error(
      "Holiday file is missing."
    );
  }


  console.log("");
  console.log("======================================");
  console.log(" SAVING UPLOADED FILES");
  console.log("======================================");


  /* ----------------------------------------------------------
     REMOVE EVERYTHING FROM uploads
  ---------------------------------------------------------- */

  ensureDirectory(UPLOAD_DIR);

  const existingFiles =
    fs.readdirSync(UPLOAD_DIR);

  for (const filename of existingFiles) {

    const filePath =
      path.join(
        UPLOAD_DIR,
        filename
      );

    if (
      fs.existsSync(filePath) &&
      fs.statSync(filePath).isFile()
    ) {

      fs.unlinkSync(filePath);

      console.log(
        "Removed old upload:",
        filename
      );
    }
  }


  /* ----------------------------------------------------------
     FIXED FILENAMES
     
     The uploaded files MUST ALWAYS be stored as:

       sales_history_dummy_new.csv
       holiday_dummy_new.csv

     No additional copies are created.
  ---------------------------------------------------------- */

  const salesPath =
    path.join(
      UPLOAD_DIR,
      "sales_history_dummy_new.csv"
    );

  const holidayPath =
    path.join(
      UPLOAD_DIR,
      "holiday_dummy_new.csv"
    );


  /* ----------------------------------------------------------
     WRITE SALES FILE
  ---------------------------------------------------------- */

  fs.writeFileSync(
    salesPath,
    salesFile.buffer
  );


  /* ----------------------------------------------------------
     WRITE HOLIDAY FILE
  ---------------------------------------------------------- */

  fs.writeFileSync(
    holidayPath,
    holidayFile.buffer
  );


  /* ----------------------------------------------------------
     VERIFY
  ---------------------------------------------------------- */

  if (!fs.existsSync(salesPath)) {

    throw new Error(
      "Sales file was not saved."
    );
  }

  if (!fs.existsSync(holidayPath)) {

    throw new Error(
      "Holiday file was not saved."
    );
  }


  console.log("");
  console.log("======================================");
  console.log(" FILES SAVED");
  console.log("======================================");

  console.log(
    "Sales:",
    salesPath
  );

  console.log(
    "Holidays:",
    holidayPath
  );

  console.log(
    "======================================");


  return {

    sales: salesPath,

    holidays: holidayPath

  };
}

/* ============================================================
   RUN PYTHON SCRIPT
============================================================ */

function runPython(
  runnerName,
  scriptPath
) {

  return new Promise(
    (resolve, reject) => {

      console.log("");
      console.log(
        "--------------------------------------"
      );

      console.log(
        `Running ${runnerName}:`
      );

      console.log(
        scriptPath
      );

      console.log(
        "Python:"
      );

      console.log(
        PYTHON_EXECUTABLE
      );

      console.log(
        "--------------------------------------"
      );


      /* ======================================================
         CHECK PYTHON
      ====================================================== */

      try {

        checkFile(
          PYTHON_EXECUTABLE,
          `${runnerName} Python executable`
        );

      } catch (error) {

        reject(error);

        return;

      }


      /* ======================================================
         CHECK SCRIPT
      ====================================================== */

      try {

        checkFile(
          scriptPath,
          `${runnerName} Python script`
        );

      } catch (error) {

        reject(error);

        return;

      }


      /* ======================================================
         SPAWN

         shell:false is VERY IMPORTANT.

         Your project path contains spaces:

         Demand Forecasting Platform

         Using shell:true caused:

         D:\Development\Demand

         to be interpreted incorrectly.
      ====================================================== */

      const child =
        spawn(
          PYTHON_EXECUTABLE,
          [
            scriptPath
          ],
          {
            cwd: PROJECT_ROOT,

            shell: false,

            windowsHide: true,

            env: {
              ...process.env,

              PYTHONIOENCODING:
                "utf-8",

              PYTHONUTF8:
                "1"
            }
          }
        );


      let stdout = "";
      let stderr = "";


      /* ======================================================
         STDOUT
      ====================================================== */

      child.stdout.on(
        "data",
        (data) => {

          const text =
            data.toString();

          stdout += text;

          process.stdout.write(text);

        }
      );


      /* ======================================================
         STDERR

         TensorFlow and Prophet may write normal information
         messages to stderr. We therefore DO NOT immediately
         fail here.
      ====================================================== */

      child.stderr.on(
        "data",
        (data) => {

          const text =
            data.toString();

          stderr += text;

          process.stderr.write(text);

        }
      );


      /* ======================================================
         PROCESS ERROR
      ====================================================== */

      child.on(
        "error",
        (error) => {

          reject(
            new Error(
              `${runnerName} process error: ${error.message}`
            )
          );

        }
      );


      /* ======================================================
         PROCESS COMPLETE
      ====================================================== */

      child.on(
        "close",
        (code) => {

          console.log("");

          console.log(
            `Python process exited with code ${code}`
          );


          if (code === 0) {

            resolve({

              success: true,

              runner:
                runnerName,

              stdout,

              stderr

            });

            return;

          }


          /* ==================================================
             FAILED
          ================================================== */

          const combinedOutput =
            [
              stdout,
              stderr
            ]
              .filter(Boolean)
              .join("\n");


          reject(
            new Error(
              `${runnerName} Python process failed with exit code ${code}\n\n${combinedOutput}`
            )
          );

        }
      );

    }
  );

}


/* ============================================================
   XGBOOST
============================================================ */

export async function runXGBoost() {

  console.log("");
  console.log(
    "========== 1/4 XGBOOST =========="
  );

  return await runPython(
    "XGBoost",
    RUNNERS.xgboost
  );

}


/* ============================================================
   LSTM
============================================================ */

export async function runLSTM() {

  console.log("");
  console.log(
    "========== 2/4 LSTM =========="
  );

  return await runPython(
    "LSTM",
    RUNNERS.lstm
  );

}


/* ============================================================
   PROPHET
============================================================ */

export async function runProphet() {

  console.log("");
  console.log(
    "========== 3/4 PROPHET =========="
  );

  return await runPython(
    "Prophet",
    RUNNERS.prophet
  );

}


/* ============================================================
   HIERARCHICAL CLUSTERING
============================================================ */

export async function runHierarchical() {

  console.log("");
  console.log(
    "========== 4/4 HIERARCHICAL =========="
  );

  return await runPython(
    "Hierarchical Clustering",
    RUNNERS.hierarchical
  );

}


/* ============================================================
   VERIFY OUTPUT DIRECTORY
============================================================ */

function listGeneratedFiles() {

  console.log("");
  console.log(
    "=========================================="
  );

  console.log(
    " GENERATED OUTPUT FILES"
  );

  console.log(
    "=========================================="
  );


  if (!fs.existsSync(MODEL_OUTPUT_DIR)) {

    console.log(
      "No model_outputs directory found."
    );

    return [];

  }


  const results = [];


  function walk(directory) {

    const entries =
      fs.readdirSync(
        directory,
        {
          withFileTypes: true
        }
      );


    for (const entry of entries) {

      const fullPath =
        path.join(
          directory,
          entry.name
        );


      if (entry.isDirectory()) {

        walk(fullPath);

      } else {

        results.push(fullPath);

      }

    }

  }


  walk(MODEL_OUTPUT_DIR);


  for (const file of results) {

    console.log(
      file
    );

  }


  console.log(
    "=========================================="
  );


  return results;

}


/* ============================================================
   RUN COMPLETE FORECAST PIPELINE
============================================================

   Upload
      ↓
   Save CSVs
      ↓
   XGBoost
      ↓
   LSTM
      ↓
   Prophet
      ↓
   Hierarchical Clustering
      ↓
   All CSV/JSON outputs available
      ↓
   Frontend refreshes automatically
============================================================ */

export async function runForecastPipeline() {

  console.log("");
  console.log(
    "=========================================="
  );

  console.log(
    " STARTING ML PIPELINE"
  );

  console.log(
    "=========================================="
  );


  /* ==========================================================
     VERIFY PYTHON
  ========================================================== */

  checkFile(
    PYTHON_EXECUTABLE,
    "Python executable"
  );


  /* ==========================================================
     VERIFY ALL RUNNERS
  ========================================================== */

  checkFile(
    RUNNERS.xgboost,
    "XGBoost runner"
  );

  checkFile(
    RUNNERS.lstm,
    "LSTM runner"
  );

  checkFile(
    RUNNERS.prophet,
    "Prophet runner"
  );

  checkFile(
    RUNNERS.hierarchical,
    "Hierarchical runner"
  );


  const results = {};


  try {

    /* ========================================================
       1. XGBOOST
    ======================================================== */

    results.xgboost =
      await runXGBoost();


    /* ========================================================
       2. LSTM
    ======================================================== */

    results.lstm =
      await runLSTM();


    /* ========================================================
       3. PROPHET
    ======================================================== */

    results.prophet =
      await runProphet();


    /* ========================================================
       4. CLUSTERING
    ======================================================== */

    results.hierarchical =
      await runHierarchical();


    /* ========================================================
       OUTPUT SUMMARY
    ======================================================== */

    const generatedFiles =
      listGeneratedFiles();


    console.log("");
    console.log(
      "=========================================="
    );

    console.log(
      " ML PIPELINE COMPLETED SUCCESSFULLY"
    );

    console.log(
      "=========================================="
    );

    console.log(
      "XGBoost: ✓"
    );

    console.log(
      "LSTM: ✓"
    );

    console.log(
      "Prophet: ✓"
    );

    console.log(
      "Hierarchical Clustering: ✓"
    );

    console.log(
      `Generated files: ${generatedFiles.length}`
    );

    console.log(
      "=========================================="
    );


    return {

      success: true,

      message:
        "All forecasting and clustering models completed successfully.",

      models: {

        xgboost: true,

        lstm: true,

        prophet: true,

        hierarchical: true

      },

      generatedFiles

    };

  } catch (error) {

    console.error("");
    console.error(
      "=========================================="
    );

    console.error(
      " ML PIPELINE FAILED"
    );

    console.error(
      "=========================================="
    );

    console.error(
      error.message
    );


    throw error;

  }

}


/* ============================================================
   DEFAULT EXPORT
============================================================ */

export default {

  saveUploadedFiles,

  runForecastPipeline,

  runXGBoost,

  runLSTM,

  runProphet,

  runHierarchical

};