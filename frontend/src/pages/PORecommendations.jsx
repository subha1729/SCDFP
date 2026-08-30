import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  RefreshCw,
  FileText,
  AlertCircle,
} from "lucide-react";

const API_BASE = "http://localhost:5000";

function PORecommendations() {

  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ============================================================
     LOAD PURCHASE ORDERS
  ============================================================ */

  const loadPurchaseOrders = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/api/purchase-orders`
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {

        throw new Error(
          result.message ||
          "Failed to load purchase orders."
        );

      }

      setPurchaseOrders(
        result.purchaseOrders ||
        result.orders ||
        result.data ||
        []
      );

    } catch (err) {

      console.error(
        "PO loading error:",
        err
      );

      setError(
        err.message ||
        "Failed to load purchase orders."
      );

    } finally {

      setLoading(false);

    }
  };


  /* ============================================================
     INITIAL LOAD + REFRESH AFTER UPLOAD
  ============================================================ */

  useEffect(() => {

    loadPurchaseOrders();

    const handleUpdate = () => {
      loadPurchaseOrders();
    };

    window.addEventListener(
      "forecast-data-updated",
      handleUpdate
    );

    return () => {

      window.removeEventListener(
        "forecast-data-updated",
        handleUpdate
      );

    };

  }, []);


  /* ============================================================
     FORMAT DATE / NUMBER
  ============================================================ */

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    return date;

  };

  const formatNumber = (value, maximumFractionDigits = 0) => {
    const safeValue = Number(value ?? 0);

    return safeValue.toLocaleString(undefined, {
      maximumFractionDigits,
    });
  };

  const totalRecommendations = purchaseOrders.length;
  const totalPOQuantity = purchaseOrders.reduce(
    (sum, order) => sum + Number(order.Recommended_PO ?? 0),
    0
  );
  const averagePOQuantity =
    totalRecommendations > 0
      ? totalPOQuantity / totalRecommendations
      : 0;


  /* ============================================================
     PAGE
  ============================================================ */

  return (

    <div className="data-input-page">

      {/* ======================================================
          PAGE TITLE
      ====================================================== */}

      <div className="page-title">

        <h1>
          Purchase Order Recommendations
        </h1>

        <p>
          Weekly purchase order recommendations
          based on forecasted demand and current
          inventory.
        </p>

      </div>


      {/* ======================================================
          MAIN CARD
      ====================================================== */}

      <div className="upload-main-card">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="upload-card-header">

          <div>

            <span className="section-eyebrow">
              PROCUREMENT
            </span>

            <h2>
              Weekly PO Recommendations
            </h2>

            <p>
              Recommended order quantities for
              each store and procurement week.
            </p>

          </div>


          <div className="upload-header-icon">

            <ShoppingCart size={24} />

          </div>

        </div>


        {/* ====================================================
            REFRESH BUTTON
        ==================================================== */}

        <div className="po-toolbar">

          <button
            className="generate-button"
            onClick={loadPurchaseOrders}
            disabled={loading}
          >

            <RefreshCw size={17} />

            {loading
              ? "Loading..."
              : "Refresh Recommendations"}

          </button>

        </div>


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


        {/* ====================================================
            EMPTY
        ==================================================== */}

        {!loading &&
         !error &&
         purchaseOrders.length === 0 && (

          <div className="placeholder-card">

            <div className="placeholder-icon">

              <FileText size={24} />

            </div>

            <h2>
              No purchase orders available
            </h2>

            <p>
              Upload sales, holiday and inventory
              data to generate purchase order
              recommendations.
            </p>

          </div>

        )}


        {/* ====================================================
            TABLE
        ==================================================== */}

        {!loading &&
         !error &&
         purchaseOrders.length > 0 && (

          <>

            <div className="po-summary-grid">

              <div className="po-summary-card">

                <span className="po-summary-label">
                  Total recommendations
                </span>

                <strong>
                  {totalRecommendations}
                </strong>

              </div>

              <div className="po-summary-card">

                <span className="po-summary-label">
                  Total PO units
                </span>

                <strong>
                  {formatNumber(totalPOQuantity)}
                </strong>

              </div>

              <div className="po-summary-card">

                <span className="po-summary-label">
                  Avg. order qty
                </span>

                <strong>
                  {formatNumber(averagePOQuantity, 2)}
                </strong>

              </div>

            </div>

            <div className="po-table-wrapper">

              <table className="po-table">

                <thead>

                  <tr>

                    <th>
                      Store
                    </th>

                    <th>
                      Week
                    </th>

                    <th>
                      Forecast Demand
                    </th>

                    <th>
                      Available Stock
                    </th>

                    <th>
                      Safety Stock
                    </th>

                    <th>
                      PO Quantity
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {purchaseOrders.map(
                    (order, index) => (

                      <tr
                        key={
                          `${order.Store_ID}-${order.Week_Start}-${index}`
                        }
                      >

                        <td>
                          <span className="po-store-pill">
                            {order.Store_ID ?? "-"}
                          </span>
                        </td>

                        <td>

                          <div className="po-week-cell">

                            <strong>
                              {formatDate(
                                order.Week_Start
                              )}
                            </strong>

                            <span>
                              to {formatDate(order.Week_End)}
                            </span>

                          </div>

                        </td>

                        <td>
                          {formatNumber(
                            order.Forecast_Demand,
                            2
                          )}
                        </td>

                        <td>
                          {formatNumber(
                            order.Available_Stock
                          )}
                        </td>

                        <td>
                          {formatNumber(
                            order.Safety_Stock
                          )}
                        </td>

                        <td>
                          <strong className="po-qty-value">
                            {formatNumber(
                              order.Recommended_PO
                            )}
                          </strong>
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </>

        )}

      </div>

    </div>

  );
}

export default PORecommendations;