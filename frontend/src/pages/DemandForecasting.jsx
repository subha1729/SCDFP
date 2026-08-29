import React, { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api/forecast";

const MODEL_INFO = {
  xgboost: {
    name: "XGBoost",
    description: "Gradient boosting demand forecast",
  },
  lstm: {
    name: "LSTM",
    description: "Deep learning time-series forecast",
  },
  prophet: {
    name: "Prophet",
    description: "Time-series forecasting model",
  },
};

function formatNumber(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}


/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function DemandForecasting() {

  const [forecastData, setForecastData] = useState(null);

  const [selectedModel, setSelectedModel] =
    useState("xgboost");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [searchStore, setSearchStore] =
    useState("");

  const STORES_PER_PAGE = 10;


  /* ============================================================
     LOAD FORECASTS
     ============================================================ */

  const loadForecasts = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Forecast API returned ${response.status}`
        );
      }

      const result =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
          "Unable to load forecast data."
        );
      }

      setForecastData(result.data);

    } catch (err) {

      console.error(
        "Forecast loading error:",
        err
      );

      setError(
        err.message ||
        "Unable to load forecast data."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadForecasts();
  }, []);


  /* ============================================================
     SELECTED MODEL DATA
     ============================================================ */

  const selectedForecast = useMemo(() => {

    if (!forecastData) {
      return null;
    }

    return forecastData[selectedModel] || null;

  }, [
    forecastData,
    selectedModel
  ]);


  const forecastRows = useMemo(() => {

    if (
      !selectedForecast ||
      !Array.isArray(
        selectedForecast.forecast
      )
    ) {
      return [];
    }

    return selectedForecast.forecast;

  }, [selectedForecast]);


  /* ============================================================
     UNIQUE DATES
     ============================================================ */

  const dates = useMemo(() => {

    const dateSet = new Set();

    forecastRows.forEach(row => {

      if (row.date) {
        dateSet.add(row.date);
      }

    });

    return Array.from(dateSet).sort();

  }, [forecastRows]);


  /* ============================================================
     DAILY TOTAL DEMAND
     ============================================================

     For every date:

     total demand =
       store 1 demand
       + store 2 demand
       + ...
       + store 50 demand
  ============================================================ */

  const dailyDemand = useMemo(() => {

    return dates.map(date => {

      const rowsForDate =
        forecastRows.filter(
          row => row.date === date
        );

      const total =
        rowsForDate.reduce(
          (sum, row) =>
            sum +
            Number(
              row.forecastSales || 0
            ),
          0
        );

      return {
        date,
        total
      };

    });

  }, [
    dates,
    forecastRows
  ]);


  /* ============================================================
     STORE LIST
     ============================================================ */

  const storeIds = useMemo(() => {

    const stores = new Set();

    forecastRows.forEach(row => {

      if (row.store !== undefined) {
        stores.add(Number(row.store));
      }

    });

    return Array.from(stores).sort(
      (a, b) => a - b
    );

  }, [forecastRows]);


  /* ============================================================
     STORE TABLE
     ============================================================ */

  const storeTable = useMemo(() => {

    return storeIds.map(store => {

      const storeForecast = {};

      dates.forEach(date => {

        const row =
          forecastRows.find(
            item =>
              Number(item.store) === store &&
              item.date === date
          );

        storeForecast[date] =
          row
            ? Number(
                row.forecastSales || 0
              )
            : 0;

      });

      const total =
        dates.reduce(
          (sum, date) =>
            sum +
            storeForecast[date],
          0
        );

      return {
        store,
        forecast: storeForecast,
        total
      };

    });

  }, [
    storeIds,
    dates,
    forecastRows
  ]);


  /* ============================================================
     FILTER STORES
     ============================================================ */

  const filteredStores = useMemo(() => {

    if (!searchStore.trim()) {
      return storeTable;
    }

    const query =
      searchStore
        .trim()
        .toLowerCase();

    return storeTable.filter(
      row =>
        String(row.store)
          .toLowerCase()
          .includes(query)
    );

  }, [
    storeTable,
    searchStore
  ]);


  /* ============================================================
     PAGINATION
     ============================================================ */

  const totalPages =
    Math.ceil(
      filteredStores.length /
      STORES_PER_PAGE
    );

  const paginatedStores =
    filteredStores.slice(
      (currentPage - 1) *
        STORES_PER_PAGE,

      currentPage *
        STORES_PER_PAGE
    );


  useEffect(() => {

    setCurrentPage(1);

  }, [
    selectedModel,
    searchStore
  ]);


  /* ============================================================
     SUMMARY VALUES
     ============================================================ */

  const totalDemand =
    dailyDemand.reduce(
      (sum, item) =>
        sum + item.total,
      0
    );

  const averageDailyDemand =
    dailyDemand.length
      ? totalDemand /
        dailyDemand.length
      : 0;

  const peakDay =
    dailyDemand.length
      ? dailyDemand.reduce(
          (max, item) =>
            item.total > max.total
              ? item
              : max,
          dailyDemand[0]
        )
      : null;


  /* ============================================================
     LOADING
     ============================================================ */

  if (loading) {

    return (
      <div className="demand-forecast-page">

        <div className="demand-forecast-shell demand-forecast-loading">

          <div className="demand-loading-card">

            <div className="demand-loading-spinner" />

            <h2>
              Loading demand forecasts
            </h2>

            <p>
              Reading model outputs...
            </p>

          </div>

        </div>

      </div>
    );
  }


  /* ============================================================
     ERROR
     ============================================================ */

  if (error) {

    return (
      <div className="demand-forecast-page">

        <div className="demand-forecast-shell demand-empty-shell">

          <div className="demand-alert-card">

            <h2>
              Unable to load forecasts
            </h2>

            <p>
              {error}
            </p>

            <button
              onClick={loadForecasts}
              className="demand-action-button"
            >
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }


  /* ============================================================
     NO DATA
     ============================================================ */

  if (!selectedForecast) {

    return (
      <div className="demand-forecast-page">

        <div className="demand-forecast-shell demand-empty-shell">

          <div className="demand-empty-card">

            <h1>
              Demand Forecasting
            </h1>

            <p>
              No forecast output is available.
            </p>

          </div>

        </div>

      </div>
    );
  }


  /* ============================================================
     RENDER
     ============================================================ */

  return (

    <div className="demand-forecast-page">

      <div className="demand-forecast-shell">


        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="demand-forecast-header">

          <div>

            <div className="demand-forecast-eyebrow">
              Demand Intelligence
            </div>

            <h1>
              Demand Forecasting
            </h1>

            <p>
              Predict store-level demand for the next 7 days.
            </p>

          </div>


          <button
            onClick={loadForecasts}
            className="demand-refresh-button"
          >
            ↻ Refresh
          </button>

        </div>


        {/* =====================================================
            MODEL SELECTOR
        ===================================================== */}

        <div className="demand-model-grid">

          {Object.entries(MODEL_INFO).map(
            ([key, model]) => {

              const active =
                selectedModel === key;

              return (

                <button
                  key={key}
                  onClick={() =>
                    setSelectedModel(key)
                  }
                  className={
                    active
                      ? "demand-model-card active"
                      : "demand-model-card"
                  }
                >

                  <div className="demand-model-card-header">

                    <div>

                      <div className="demand-model-name">
                        {model.name}
                      </div>

                      <div className="demand-model-description">
                        {model.description}
                      </div>

                    </div>

                    {active && (
                      <div className="demand-model-indicator" />
                    )}

                  </div>

                </button>

              );

            }
          )}

        </div>


        {/* =====================================================
            SUMMARY CARDS
        ===================================================== */}

        <div className="demand-summary-grid">

          <SummaryCard
            title="Model"
            value={MODEL_INFO[selectedModel]?.name || "XGBoost"}
            subtitle="Primary forecast model"
          />

          <SummaryCard
            title="Stores"
            value={selectedForecast.stores || storeIds.length}
            subtitle="Stores forecasted"
          />

          <SummaryCard
            title="Total Demand"
            value={formatNumber(totalDemand)}
            subtitle="All stores / forecast horizon"
          />

          <SummaryCard
            title="Average Daily"
            value={formatNumber(averageDailyDemand)}
            subtitle="Across all stores"
          />

        </div>


        {/* =====================================================
            DAILY DEMAND GRAPH
        ===================================================== */}

        <div className="demand-panel demand-chart-panel">

          <div className="demand-panel-header demand-chart-header">

            <div>

              <h2>
                Daily Total Demand
              </h2>

              <p>
                Total predicted demand across all stores
              </p>

            </div>

            {peakDay && (

              <div className="text-right">

                <div className="text-xs text-white/40">
                  Peak demand
                </div>

                <div className="font-semibold">
                  {formatNumber(peakDay.total)}
                </div>

                <div className="text-xs text-white/40">
                  {formatDate(peakDay.date)}
                </div>

              </div>

            )}

          </div>


          <DemandChart
            dailyDemand={dailyDemand}
          />

        </div>


        {/* =====================================================
            STORE FORECAST TABLE
        ===================================================== */}

<div className="demand-panel demand-table-panel">

          <div className="demand-table-header">

            <div>

              <h2>
                Store Forecast
              </h2>

              <p>
                Predicted demand for each store over the next 7 days
              </p>

            </div>


            <input
              type="text"
              value={searchStore}
              onChange={e =>
                setSearchStore(
                  e.target.value
                )
              }
              placeholder="Search store..."
              className="demand-search-input"
            />

          </div>


          <div className="demand-table-wrap">

            <table className="demand-table">

              <thead>

                <tr>

                  <th className="demand-table-store-header">
                    Store
                  </th>

                  {dates.map(date => (

                    <th
                      key={date}
                      className="text-right px-5 py-4 font-medium whitespace-nowrap"
                    >
                      {formatDate(date)}
                    </th>

                  ))}

                  <th className="text-right px-6 py-4 font-medium">
                    7-Day Total
                  </th>

                </tr>

              </thead>


              <tbody>

                {paginatedStores.map(
                  row => (

                    <tr
                      key={row.store}
                      className="demand-table-row"
                    >

                      <td className="demand-table-store-cell">

                        Store {row.store}

                      </td>


                      {dates.map(date => (

                        <td
                          key={date}
                          className="demand-table-number"
                        >
                          {formatCurrency(
                            row.forecast[date]
                          )}
                        </td>

                      ))}


                      <td className="demand-table-total">

                        {formatCurrency(
                          row.total
                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>


          {/* ===================================================
              PAGINATION
          =================================================== */}

          <div className="demand-pagination">

            <div className="demand-pagination-meta">

              Showing{" "}

              {filteredStores.length === 0
                ? 0
                : (currentPage - 1) *
                    STORES_PER_PAGE +
                  1}

              {" "}–{" "}

              {Math.min(
                currentPage *
                  STORES_PER_PAGE,
                filteredStores.length
              )}

              {" "}of{" "}

              {filteredStores.length}

            </div>


            <div className="demand-pagination-controls">

              <button
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    page => page - 1
                  )
                }
                className="demand-page-button"
              >
                ←
              </button>


              <div className="demand-page-indicator">
                {currentPage} /{" "}
                {Math.max(
                  totalPages,
                  1
                )}
              </div>


              <button
                disabled={
                  currentPage >=
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    page => page + 1
                  )
                }
                className="demand-page-button"
              >
                →
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}


/* ============================================================
   SUMMARY CARD
============================================================ */

function SummaryCard({
  title,
  value,
  subtitle
}) {

  return (

    <div className="demand-summary-card">

      <div className="demand-summary-label">
        {title}
      </div>

      <div className="demand-summary-value">
        {value}
      </div>

      <div className="demand-summary-subtitle">
        {subtitle}
      </div>

    </div>

  );
}


/* ============================================================
   DEMAND CHART
============================================================ */

function DemandChart({
  dailyDemand
}) {

  if (!dailyDemand.length) {

    return (

      <div className="h-80 flex items-center justify-center text-white/30">
        No forecast data available
      </div>

    );

  }


  const maxValue =
    Math.max(
      ...dailyDemand.map(
        item => item.total
      )
    );

  const minValue =
    Math.min(
      0,
      ...dailyDemand.map(
        item => item.total
      )
    );

  const width = 820;
  const height = 250;
  const leftPadding = 52;
  const rightPadding = 20;
  const topPadding = 16;
  const bottomPadding = 26;
  const chartWidth =
    width - leftPadding - rightPadding;
  const chartHeight =
    height - topPadding - bottomPadding;

  const range =
    maxValue - minValue || 1;

  const points =
    dailyDemand.map((item, index) => {
      const x =
        leftPadding +
        (dailyDemand.length === 1
          ? chartWidth / 2
          : (index / (dailyDemand.length - 1)) * chartWidth);

      const y =
        height -
        bottomPadding -
        ((item.total - minValue) / range) * chartHeight;

      return { ...item, x, y };
    });

  const linePath =
    points
      .map((point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
      )
      .join(" ");

  const areaPath =
    `${linePath} L ${points[points.length - 1].x} ${height - bottomPadding} L ${points[0].x} ${height - bottomPadding} Z`;


  return (

    <div className="w-full">

      <div className="demand-chart-body">

        <div className="demand-chart-y-axis">

          {[0, 1, 2, 3, 4].map(step => {
            const value =
              minValue +
              ((4 - step) / 4) * (maxValue - minValue);

            return (
              <span
                key={step}
                className="demand-chart-y-label"
              >
                {formatNumber(
                  Math.round(value)
                )}
              </span>
            );
          })}

        </div>

        <div className="demand-chart-bars-wrap demand-line-chart-wrap">

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="demand-line-svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="demand-line-fill"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor="rgba(125,182,255,0.45)" />
                <stop offset="100%" stopColor="rgba(125,182,255,0.02)" />
              </linearGradient>
            </defs>

            {[0, 1, 2, 3, 4].map(step => {
              const y =
                topPadding +
                (step / 4) * chartHeight;

              return (
                <line
                  key={step}
                  x1={leftPadding}
                  x2={width - rightPadding}
                  y1={y}
                  y2={y}
                  stroke="rgba(148,163,184,0.12)"
                  strokeWidth="1"
                />
              );
            })}

            <path
              d={areaPath}
              fill="url(#demand-line-fill)"
            />

            <path
              d={linePath}
              fill="none"
              stroke="#7db6ff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map(point => (
              <g key={point.date}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4.5"
                  fill="#dfeaf7"
                  stroke="#7db6ff"
                  strokeWidth="2"
                />
                <title>
                  {formatNumber(point.total)} on {formatDate(point.date)}
                </title>
              </g>
            ))}
          </svg>
        </div>

      </div>

      <div className="demand-chart-x-axis">

        {dailyDemand.map(item => (
          <div
            key={item.date}
            className="demand-chart-x-label"
          >
            {formatDate(item.date)}
          </div>
        ))}

      </div>

    </div>

  );
}