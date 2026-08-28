import { spawn } from "child_process";
import path from "path";

const runPython = ({
  action,
  salesPath,
  inventoryPath = null,
  promoPath = null,
  horizon = 7
}) => {
  return new Promise((resolve, reject) => {

    const pythonExecutable =
      process.env.PYTHON_EXECUTABLE || "python";

    const scriptPath = path.resolve(
      process.cwd(),
      process.env.ML_SCRIPT_PATH || "../python_ml/ml_inference.py"
    );

    const args = [
      scriptPath,
      "--action",
      action
    ];

    if (salesPath) {
      args.push("--sales", salesPath);
    }

    if (inventoryPath) {
      args.push("--inventory", inventoryPath);
    }

    if (promoPath) {
      args.push("--promo", promoPath);
    }

    args.push(
      "--horizon",
      String(horizon)
    );

    console.log(
      "Running Python:",
      pythonExecutable,
      args.join(" ")
    );

    const pythonProcess = spawn(
      pythonExecutable,
      args,
      {
        cwd: process.cwd(),
        windowsHide: true
      }
    );

    let stdout = "";
    let stderr = "";

    pythonProcess.stdout.on(
      "data",
      (data) => {
        stdout += data.toString();
      }
    );

    pythonProcess.stderr.on(
      "data",
      (data) => {
        stderr += data.toString();
      }
    );

    pythonProcess.on(
      "error",
      (error) => {
        reject(
          new Error(
            `Failed to start Python process: ${error.message}`
          )
        );
      }
    );

    pythonProcess.on(
      "close",
      (code) => {

        if (code !== 0) {

          reject(
            new Error(
              `Python process failed with code ${code}\n${stderr}`
            )
          );

          return;
        }

        try {

          const lines =
            stdout
              .trim()
              .split("\n")
              .filter(Boolean);

          const lastLine =
            lines[lines.length - 1];

          const result =
            JSON.parse(lastLine);

          resolve(result);

        } catch (error) {

          reject(
            new Error(
              `Could not parse Python output.\nOutput:\n${stdout}\nError:\n${error.message}`
            )
          );

        }
      }
    );
  });
};


/* ============================================================
   FORECAST
   ============================================================ */

export const runForecast = async ({
  salesPath,
  inventoryPath,
  promoPath = null,
  horizon = 7
}) => {

  return runPython({
    action: "forecast",
    salesPath,
    inventoryPath,
    promoPath,
    horizon
  });

};


/* ============================================================
   CLUSTERING
   ============================================================ */

export const runClustering = async ({
  salesPath
}) => {

  return runPython({
    action: "clustering",
    salesPath
  });

};


/* ============================================================
   PROCUREMENT
   ============================================================ */

export const runProcurement = async ({
  salesPath,
  inventoryPath,
  promoPath = null
}) => {

  return runPython({
    action: "procurement",
    salesPath,
    inventoryPath,
    promoPath
  });

};


/* ============================================================
   COMPLETE PIPELINE
   ============================================================ */

export const runAll = async ({
  salesPath,
  inventoryPath,
  promoPath = null,
  horizon = 7
}) => {

  return runPython({
    action: "all",
    salesPath,
    inventoryPath,
    promoPath,
    horizon
  });

};