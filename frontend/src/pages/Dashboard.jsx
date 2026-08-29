import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  AlertTriangle,
  CalendarDays,
  RefreshCw,
  Store,
  TrendingUp,
} from "lucide-react";


/* ============================================================
   API
============================================================ */

const API_URL =
  "http://localhost:5000/api/forecast";


/* ============================================================
   FORMAT NUMBER
============================================================ */

function formatNumber(value) {

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      maximumFractionDigits: 0,
    }
  ).format(number);
}


/* ============================================================
   FORMAT DATE
============================================================ */

function formatDate(dateValue) {

  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
    }
  );
}


/* ============================================================
   KPI CARD
============================================================ */

function KpiCard({
  title,
  value,
  subtitle,
  trend,
  trendTone = "positive",
  icon: Icon,
}) {

  return (
    <div className="dashboard-kpi-card">

      <div className="kpi-card-top">

        <div className="kpi-icon">
          <Icon size={18} />
        </div>

        {trend && (
          <span className={`kpi-trend ${trendTone}`}>
            {trend}
          </span>
        )}

      </div>

      <div className="kpi-card-content">

        <span className="kpi-title">
          {title}
        </span>

        <strong className="kpi-value">
          {value}
        </strong>

        <div className="kpi-bottom">
          <span className="kpi-subtitle">
            {subtitle}
          </span>
        </div>

      </div>

    </div>
  );
}


/* ============================================================
   FORECAST CHART
============================================================ */

function ForecastChart({
  dailyDemand,
}) {

  if (!dailyDemand.length) {

    return (
      <div className="dashboard-card forecast-card">

        <div className="dashboard-card-header">

          <div>
            <h2>
              Daily Total Demand
            </h2>

            <p>
              XGBoost forecast across all stores
            </p>
          </div>

          <Activity size={17} />

        </div>

        <div className="empty-state">
          No forecast data available.
        </div>

      </div>
    );
  }


  const maxValue = Math.max(
    ...dailyDemand.map(
      item => item.total
    )
  );

  const minValue = Math.min(
    ...dailyDemand.map(
      item => item.total
    )
  );


  const width = 700;
  const height = 280;

  const leftPadding = 52;
  const rightPadding = 18;
  const topPadding = 18;
  const bottomPadding = 42;


  const chartWidth =
    width -
    leftPadding -
    rightPadding;

  const chartHeight =
    height -
    topPadding -
    bottomPadding;


  const range =
    maxValue -
    minValue ||
    1;


  const points =
    dailyDemand.map(
      (item, index) => {

        const x =
          leftPadding +
          (
            dailyDemand.length === 1
              ? chartWidth / 2
              : (
                  index /
                  (
                    dailyDemand.length - 1
                  )
                ) *
                chartWidth
          );


        const y =
          height -
          bottomPadding -
          (
            (
              item.total -
              minValue
            ) /
            range
          ) *
          chartHeight;


        return {
          ...item,
          x,
          y,
        };

      }
    );


  const linePath =
    points
      .map(
        (point, index) =>
          `${
            index === 0
              ? "M"
              : "L"
          } ${point.x} ${point.y}`
      )
      .join(" ");


  const ticks =
    [0, 1, 2, 3, 4].map(
      step => {

        const value =
          maxValue -
          (
            step / 4
          ) *
          (
            maxValue -
            minValue
          );


        return {
          value,
          y:
            topPadding +
            (
              step / 4
            ) *
            chartHeight,
        };

      }
    );


  return (

    <div className="dashboard-card forecast-card">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="dashboard-card-header">

        <div>

          <h2>
            Daily Total Demand
          </h2>

          <p>
            XGBoost forecast ·{" "}
            {dailyDemand.length}-day horizon ·{" "}
            {dailyDemand[0]?.storeCount || 50} stores
          </p>

        </div>


        <div className="forecast-model">

          <Activity size={14} />

          XGBoost

        </div>

      </div>


      {/* ======================================================
          LEGEND
      ====================================================== */}

      <div className="chart-legend">

        <span>

          <i className="legend-dot predicted"></i>

          Total demand across all stores

        </span>

      </div>


      {/* ======================================================
          CHART
      ====================================================== */}

      <div className="forecast-chart">


        {/* Y AXIS */}

        <div className="chart-y-axis">

          {ticks.map(
            tick => (

              <span
                key={tick.y}
              >
                {formatNumber(
                  Math.round(
                    tick.value
                  )
                )}
              </span>

            )
          )}

        </div>


        {/* CHART AREA */}

        <div className="chart-area">


          <div className="chart-grid">

            {[0, 1, 2, 3].map(
              line => (
                <span
                  key={line}
                />
              )
            )}

          </div>


          <svg
            className="forecast-svg"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
          >


            {/* GRID LINES */}

            {ticks.map(
              tick => (

                <line
                  key={tick.y}
                  x1={leftPadding}
                  x2={
                    width -
                    rightPadding
                  }
                  y1={tick.y}
                  y2={tick.y}
                  stroke="rgba(148,163,184,0.12)"
                  strokeWidth="1"
                />

              )
            )}


            {/* AREA */}

            <path
              d={`
                ${linePath}
                L ${points[
                  points.length - 1
                ].x}
                  ${height -
                  bottomPadding}
                L ${points[0].x}
                  ${height -
                  bottomPadding}
                Z
              `}
              fill="rgba(125,182,255,0.12)"
            />


            {/* LINE */}

            <path
              d={linePath}
              fill="none"
              stroke="#7db6ff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />


            {/* POINTS */}

            {points.map(
              point => (

                <circle
                  key={point.date}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#dfeaf7"
                  stroke="#7db6ff"
                  strokeWidth="2"
                />

              )
            )}

          </svg>


          {/* X AXIS */}

          <div className="chart-x-axis">

            {dailyDemand.map(
              item => (

                <span
                  key={item.date}
                >
                  {formatDate(
                    item.date
                  )}
                </span>

              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   ALERTS
============================================================ */

function AlertsPanel({
  peakDay,
}) {

  return (

    <div className="dashboard-card alerts-card">


      <div className="dashboard-card-header">

        <div>

          <h2>
            Operational Alerts
          </h2>

          <p>
            Items requiring attention
          </p>

        </div>

        <AlertTriangle
          size={17}
        />

      </div>


      <div className="alerts-list">


        {/* PEAK DEMAND */}

        <div className="alert-row">

          <div className="alert-icon forecast">

            <TrendingUp
              size={15}
            />

          </div>


          <div className="alert-content">

            <strong>
              Peak demand predicted
            </strong>

            <span>

              {peakDay
                ? `${formatDate(
                    peakDay.date
                  )} is expected to have the highest total demand.`
                : "No peak day available."
              }

            </span>

          </div>


          <time>
            Live
          </time>

        </div>


        {/* ENGINE */}

        <div className="alert-row">

          <div className="alert-icon info">

            <Activity
              size={15}
            />

          </div>


          <div className="alert-content">

            <strong>
              Forecast engine operational
            </strong>

            <span>
              XGBoost forecast output loaded successfully.
            </span>

          </div>


          <time>
            Now
          </time>

        </div>

      </div>


      <button
        className="view-all-button"
        type="button"
      >
        Forecast monitoring
      </button>

    </div>
  );
}


/* ============================================================
   TOP STORES
============================================================ */

function TopStores({
  storeRows,
}) {

  const topStores =
    storeRows
      .slice(0, 5);


  return (

    <div className="dashboard-card stores-card">


      <div className="dashboard-card-header">

        <div>

          <h2>
            Top Stores by Demand
          </h2>

          <p>
            Highest projected demand across 7 days
          </p>

        </div>

        <Store size={17} />

      </div>


      <div className="store-table">


        <div className="store-table-header">

          <span>
            #
          </span>

          <span>
            STORE
          </span>

          <span>
            7-DAY DEMAND
          </span>

        </div>


        {topStores.map(
          (store, index) => (

            <div
              className="store-table-row"
              key={store.store}
            >

              <span className="store-rank">
                {index + 1}
              </span>


              <strong>
                Store {store.store}
              </strong>


              <span>
                {formatNumber(
                  store.total
                )}
              </span>

            </div>

          )
        )}


        {!topStores.length && (

          <div className="empty-state">
            No store forecast data available.
          </div>

        )}

      </div>

    </div>
  );
}


/* ============================================================
   DASHBOARD
============================================================ */

export default function Dashboard() {


  const [
    forecastData,
    setForecastData,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    refreshing,
    setRefreshing,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  /* ==========================================================
     LOAD FORECAST
  ========================================================== */

  async function loadDashboardData(
    showRefresh = false
  ) {

    try {

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }


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


      setForecastData(
        result.data
      );

    } catch (err) {

      console.error(
        "Unable to load dashboard forecast data:",
        err
      );


      setError(
        err.message ||
        "Unable to load forecast data."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  }


  /* ==========================================================
     INITIAL LOAD
  ========================================================== */

  useEffect(() => {

    loadDashboardData();

  }, []);


  /* ==========================================================
     XGBOOST
  ========================================================== */

  const xgboostForecast =
    forecastData?.xgboost ||
    null;


  /* ==========================================================
     DAILY TOTAL DEMAND
     
     IMPORTANT:

     forecastService.js normalizes XGBoost into:

     {
       store,
       date,
       forecastSales
     }

     Therefore:

     DO NOT use day.stores.

     We group all records by date and
     SUM forecastSales.
  ========================================================== */

  const dailyDemand =
    useMemo(() => {

      if (
        !xgboostForecast ||
        !Array.isArray(
          xgboostForecast.forecast
        )
      ) {

        return [];

      }


      const dateMap = {};


      xgboostForecast.forecast.forEach(
        row => {

          if (
            !row ||
            !row.date
          ) {

            return;

          }


          const demand =
            Number(
              row.forecastSales
            );


          if (
            !Number.isFinite(
              demand
            )
          ) {

            return;

          }


          if (
            !dateMap[row.date]
          ) {

            dateMap[row.date] = {
              total: 0,
              stores: new Set(),
            };

          }


          dateMap[
            row.date
          ].total += demand;


          const store =
            Number(row.store);


          if (
            Number.isFinite(
              store
            )
          ) {

            dateMap[
              row.date
            ].stores.add(store);

          }

        }
      );


      return Object.entries(
        dateMap
      )
        .map(
          ([date, data]) => ({

            date,

            total:
              data.total,

            storeCount:
              data.stores.size,

          })
        )
        .sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        );

    }, [
      xgboostForecast,
    ]);


  /* ==========================================================
     STORE TOTALS
     
     Sum each store's demand
     across all 7 forecast days.
  ========================================================== */

  const storeRows =
    useMemo(() => {

      if (
        !xgboostForecast ||
        !Array.isArray(
          xgboostForecast.forecast
        )
      ) {

        return [];

      }


      const totals = {};


      xgboostForecast.forecast.forEach(
        row => {

          const store =
            Number(row.store);


          const demand =
            Number(
              row.forecastSales
            );


          if (
            !Number.isFinite(
              store
            )
          ) {

            return;

          }


          if (
            !Number.isFinite(
              demand
            )
          ) {

            return;

          }


          totals[store] =
            (
              totals[store] ||
              0
            ) +
            demand;

        }
      );


      return Object.entries(
        totals
      )
        .map(
          ([store, total]) => ({

            store:
              Number(store),

            total,

          })
        )
        .sort(
          (a, b) =>
            b.total -
            a.total
        );

    }, [
      xgboostForecast,
    ]);


  /* ==========================================================
     TOTAL FORECASTED DEMAND
  ========================================================== */

  const totalDemand =
    dailyDemand.reduce(
      (sum, item) =>
        sum +
        item.total,
      0
    );


  /* ==========================================================
     AVERAGE DAILY DEMAND
  ========================================================== */

  const averageDailyDemand =
    dailyDemand.length
      ? totalDemand /
        dailyDemand.length
      : 0;


  /* ==========================================================
     ACTIVE STORES
  ========================================================== */

  const activeStores =
    xgboostForecast?.stores ||
    storeRows.length;


  /* ==========================================================
     PEAK DAY
  ========================================================== */

  const peakDay =
    dailyDemand.length
      ? dailyDemand.reduce(
          (max, item) =>
            item.total >
            max.total
              ? item
              : max,
          dailyDemand[0]
        )
      : null;


  /* ==========================================================
     FORECAST HORIZON
  ========================================================== */

  const horizon =
    xgboostForecast?.forecast_horizon_days ||
    dailyDemand.length;


  /* ==========================================================
     DISPLAY VALUES
  ========================================================== */

  const forecastedDemandValue =
    loading ||
    !xgboostForecast
      ? "—"
      : formatNumber(
          totalDemand
        );


  const storeCountValue =
    loading ||
    !xgboostForecast
      ? "—"
      : formatNumber(
          activeStores
        );


  const peakDemandValue =
    loading ||
    !xgboostForecast ||
    !peakDay
      ? "—"
      : formatNumber(
          peakDay.total
        );


  const horizonValue =
    loading ||
    !xgboostForecast
      ? "—"
      : `${horizon} days`;


  /* ==========================================================
     RENDER
  ========================================================== */

  return (

    <div className="dashboard">


      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="dashboard-page-header">

        <div>

          <div className="dashboard-eyebrow">
            SUPPLY CHAIN INTELLIGENCE
          </div>

          <h1>
            Control Center
          </h1>

          <p>
            Real-time overview of demand and forecast activity.
          </p>

        </div>


        <div className="dashboard-date">

          <CalendarDays
            size={15}
          />

          <span>
            Forecast horizon
          </span>

          <strong>
            {dailyDemand.length
              ? `${dailyDemand.length} days`
              : "Live"}
          </strong>

        </div>

      </div>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (

        <div className="dashboard-error">

          <AlertTriangle
            size={17}
          />

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              loadDashboardData(
                true
              )
            }
          >
            Try again
          </button>

        </div>

      )}


      {/* ======================================================
          KPI CARDS
      ====================================================== */}

      <div className="dashboard-kpi-grid">


        <KpiCard
          title="Forecasted Demand"
          value={
            forecastedDemandValue
          }
          subtitle="XGBoost total forecast"
          trend="+12.4%"
          trendTone="positive"
          icon={TrendingUp}
        />


        <KpiCard
          title="Active Stores"
          value={
            storeCountValue
          }
          subtitle="Stores monitored"
          trend="Live"
          trendTone="positive"
          icon={Store}
        />


        <KpiCard
          title="Peak Demand"
          value={
            peakDemandValue
          }
          subtitle={
            peakDay
              ? formatDate(
                  peakDay.date
                )
              : "No peak day"
          }
          trend="Peak"
          trendTone="neutral"
          icon={Activity}
        />


        <KpiCard
          title="Forecast Horizon"
          value={
            horizonValue
          }
          subtitle="Days in forecast"
          trend="7d"
          trendTone="positive"
          icon={CalendarDays}
        />

      </div>


      {/* ======================================================
          DAILY DEMAND GRAPH
      ====================================================== */}

      <div className="dashboard-grid-main">

        <ForecastChart
          dailyDemand={
            dailyDemand
          }
        />

      </div>


      {/* ======================================================
          LOWER DASHBOARD
      ====================================================== */}

      <div className="dashboard-grid-lower">


        <AlertsPanel
          peakDay={
            peakDay
          }
        />


        <TopStores
          storeRows={
            storeRows
          }
        />

      </div>


      {/* ======================================================
          REFRESH / STATUS
      ====================================================== */}

      <div className="dashboard-status">


        <div className="status-left">

          <span
            className={
              xgboostForecast
                ? "status-live"
                : "status-live loading"
            }
          />

          <span>

            {xgboostForecast
              ? "Forecast engine operational"
              : loading
                ? "Loading forecast data"
                : "Waiting for forecast data"}

          </span>

        </div>


        <div className="dashboard-status-right">

          {xgboostForecast && (
            <span>
              Average daily demand:{" "}
              <strong>
                {formatNumber(
                  averageDailyDemand
                )}
              </strong>
            </span>
          )}


          <button
            className="dashboard-refresh"
            type="button"
            onClick={() =>
              loadDashboardData(
                true
              )
            }
            disabled={
              refreshing
            }
          >

            <RefreshCw
              size={14}
              className={
                refreshing
                  ? "spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </button>

        </div>

      </div>

    </div>
  );
}