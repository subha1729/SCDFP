import React, {
  useRef,
  useState
} from "react";

import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Database,
  Zap
} from "lucide-react";


const API_BASE =
  "http://localhost:5000";


function DataInput() {

  const salesInput =
    useRef(null);

  const holidayInput =
    useRef(null);

  const inventoryInput =
    useRef(null);


  const [salesFile, setSalesFile] =
    useState(null);

  const [holidayFile, setHolidayFile] =
    useState(null);

  const [inventoryFile, setInventoryFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [stage, setStage] =
    useState("");


  /* ==========================================================
     FILE SELECT
  ========================================================== */

  const handleSalesChange = event => {

    const file =
      event.target.files?.[0];

    setSalesFile(file || null);
    setError("");
  };


  const handleHolidayChange = event => {

    const file =
      event.target.files?.[0];

    setHolidayFile(file || null);
    setError("");
  };


  const handleInventoryChange = event => {

    const file =
      event.target.files?.[0];

    setInventoryFile(file || null);
    setError("");
  };


  /* ==========================================================
     UPLOAD
  ========================================================== */

  const handleUpload = async () => {

    setMessage("");
    setError("");


    if (!salesFile) {

      setError(
        "Please select the sales history CSV."
      );

      return;
    }


    if (!holidayFile) {

      setError(
        "Please select the holiday CSV."
      );

      return;
    }


    if (!inventoryFile) {

      setError(
        "Please select the current inventory status CSV."
      );

      return;
    }


    setLoading(true);

    try {

      setStage(
        "Uploading data..."
      );


      const formData =
        new FormData();


      formData.append(
        "sales",
        salesFile
      );


      formData.append(
        "holidays",
        holidayFile
      );


      formData.append(
        "inventory",
        inventoryFile
      );


      setStage(
        "Running forecasting models..."
      );


      const response =
        await fetch(
          `${API_BASE}/api/upload`,
          {
            method: "POST",
            body: formData
          }
        );


      const result =
        await response.json();


      if (
        !response.ok ||
        !result.success
      ) {

        throw new Error(
          result.message ||
          "Pipeline failed."
        );

      }


      setStage(
        "Updating dashboard..."
      );


      /*
       * Tell all frontend pages that
       * fresh model outputs are available.
       */

      window.dispatchEvent(
        new Event(
          "forecast-data-updated"
        )
      );


      setMessage(
        "Data uploaded successfully. All forecasting and clustering results have been regenerated."
      );


      setStage(
        "Generation complete"
      );


    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Upload failed."
      );

      setStage("");

    } finally {

      setLoading(false);

    }

  };


  /* ==========================================================
     FILE CARD
  ========================================================== */

  const FileCard = ({
    title,
    file,
    inputRef,
    onChange
  }) => (

    <div
      className="upload-file-card"
      onClick={() =>
        inputRef.current?.click()
      }
    >

      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        hidden
        onChange={onChange}
      />


      <div className="upload-file-icon">

        {file ? (

          <CheckCircle size={25} />

        ) : (

          <Upload size={25} />

        )}

      </div>


      <div className="upload-file-content">

        <h3>
          {title}
        </h3>


        {file ? (

          <p>

            <FileText size={14} />

            {file.name}

          </p>

        ) : (

          <p>
            Click to select CSV file
          </p>

        )}

      </div>

    </div>

  );


  /* ==========================================================
     PAGE
  ========================================================== */

  return (

    <div className="data-input-page">


      <div className="page-title">

        <h1>
          Data Input
        </h1>

        <p>
          Upload the latest supply-chain data
          to regenerate forecasts and store
          intelligence.
        </p>

      </div>


      {/* ======================================================
          UPLOAD CARD
      ====================================================== */}

      <div className="upload-main-card">


        <div className="upload-card-header">

          <div>

            <span className="section-eyebrow">
              DATA PIPELINE
            </span>

            <h2>
              Upload forecasting data
            </h2>

            <p>
              Provide the sales history,
              holiday data and current
              inventory status required by
              the forecasting and procurement
              system.
            </p>

          </div>


          <div className="upload-header-icon">

            <Database size={24} />

          </div>

        </div>


        {/* ====================================================
            FILES
        ==================================================== */}

        <div className="upload-files">


          {/* ==================================================
              SALES
          ================================================== */}

          <FileCard
            title="Sales History"
            file={salesFile}
            inputRef={salesInput}
            onChange={handleSalesChange}
          />


          {/* ==================================================
              HOLIDAY
          ================================================== */}

          <FileCard
            title="Holiday Data"
            file={holidayFile}
            inputRef={holidayInput}
            onChange={handleHolidayChange}
          />


          {/* ==================================================
              INVENTORY
          ================================================== */}

          <FileCard
            title="Current Inventory Status"
            file={inventoryFile}
            inputRef={inventoryInput}
            onChange={handleInventoryChange}
          />


        </div>


        {/* ====================================================
            GENERATE
        ==================================================== */}

        <button
          className="generate-button"
          onClick={handleUpload}
          disabled={loading}
        >

          {loading ? (

            <>

              <Loader2
                size={18}
                className="spin"
              />

              Generating...

            </>

          ) : (

            <>

              <Zap size={18} />

              Upload & Generate

            </>

          )}

        </button>


        {/* ====================================================
            PROGRESS
        ==================================================== */}

        {loading && (

          <div className="pipeline-status">

            <Loader2
              size={18}
              className="spin"
            />

            <span>
              {stage}
            </span>

          </div>

        )}


        {/* ====================================================
            SUCCESS
        ==================================================== */}

        {message && (

          <div className="upload-success">

            <CheckCircle size={19} />

            <span>
              {message}
            </span>

          </div>

        )}


        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (

          <div className="upload-error">

            <AlertCircle size={19} />

            <span>
              {error}
            </span>

          </div>

        )}

      </div>


      {/* ======================================================
          PIPELINE INFORMATION
      ====================================================== */}

      <div className="pipeline-info-card">

        <div className="pipeline-info-title">

          <Zap size={19} />

          <strong>
            Automatic processing
          </strong>

        </div>


        <p>

          After upload, the system automatically
          runs XGBoost, LSTM, Prophet and
          hierarchical clustering. The dashboard,
          demand forecasting and clustering views
          are then refreshed with the new results.

        </p>

      </div>

    </div>

  );

}


export default DataInput;