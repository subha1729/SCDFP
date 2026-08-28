import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Store,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  BrainCircuit,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| DEMO DASHBOARD DATA
|--------------------------------------------------------------------------
| These values are temporary UI values.
| Later they will come from the backend/model outputs.
*/

const forecastData = [
  { day: "Mon", actual: 760, forecast: 780 },
  { day: "Tue", actual: 820, forecast: 805 },
  { day: "Wed", actual: 790, forecast: 825 },
  { day: "Thu", actual: 880, forecast: 860 },
  { day: "Fri", actual: 940, forecast: 920 },
  { day: "Sat", actual: 1010, forecast: 990 },
  { day: "Sun", actual: 970, forecast: 1025 },
];

const alerts = [
  {
    type: "warning",
    title: "Low stock detected",
    description: "12 stores require inventory attention",
    time: "18 min ago",
  },
  {
    type: "forecast",
    title: "Demand spike predicted",
    description: "Weekend demand expected to increase",
    time: "42 min ago",
  },
  {
    type: "info",
    title: "Forecast completed",
    description: "7-day forecast generated successfully",
    time: "1 hr ago",
  },
];

const topStores = [
  {
    rank: 1,
    store: "Store 983",
    cluster: "High Demand",
    demand: "1,284",
    change: "+12.8%",
  },
  {
    rank: 2,
    store: "Store 562",
    cluster: "High Demand",
    demand: "1,192",
    change: "+9.4%",
  },
  {
    rank: 3,
    store: "Store 817",
    cluster: "Stable",
    demand: "1,087",
    change: "+6.7%",
  },
  {
    rank: 4,
    store: "Store 341",
    cluster: "Stable",
    demand: "1,021",
    change: "+4.2%",
  },
  {
    rank: 5,
    store: "Store 125",
    cluster: "Growth",
    demand: "984",
    change: "+3.8%",
  },
];

/*
|--------------------------------------------------------------------------
| KPI CARD
|--------------------------------------------------------------------------
*/

function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
}) {
  const positive = trend === "up";

  return (
    <div className="dashboard-kpi-card">

      <div className="kpi-top">

        <div className="kpi-icon">
          <Icon size={18} />
        </div>

        <span className="kpi-label">
          {title}
        </span>

      </div>

      <div className="kpi-value">
        {value}
      </div>

      <div className="kpi-bottom">

        <span className="kpi-subtitle">
          {subtitle}
        </span>

        {trendValue && (
          <span
            className={
              positive
                ? "kpi-trend positive"
                : "kpi-trend negative"
            }
          >
            {positive ? (
              <ArrowUpRight size={13} />
            ) : (
              <ArrowDownRight size={13} />
            )}

            {trendValue}
          </span>
        )}

      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| FORECAST CHART
|--------------------------------------------------------------------------
*/

function ForecastChart() {

  const maxValue = Math.max(
    ...forecastData.flatMap((item) => [
      item.actual,
      item.forecast,
    ])
  );

  return (
    <div className="dashboard-card forecast-card">

      <div className="dashboard-card-header">

        <div>
          <h2>Demand Forecast</h2>

          <p>
            Actual vs predicted demand · Last 7 days
          </p>
        </div>

        <div className="forecast-model">
          <BrainCircuit size={14} />
          XGBoost
        </div>

      </div>

      <div className="chart-legend">

        <span>
          <i className="legend-dot actual"></i>
          Actual
        </span>

        <span>
          <i className="legend-dot predicted"></i>
          Forecast
        </span>

      </div>

      <div className="forecast-chart">

        <div className="chart-y-axis">
          <span>1.1k</span>
          <span>900</span>
          <span>700</span>
          <span>500</span>
        </div>

        <div className="chart-area">

          <div className="chart-grid">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <svg
            className="forecast-svg"
            viewBox="0 0 700 280"
            preserveAspectRatio="none"
          >

            {/* Actual line */}

            <polyline
              points={forecastData
                .map((item, index) => {

                  const x =
                    (index /
                      (forecastData.length - 1)) *
                    680 +
                    10;

                  const y =
                    250 -
                    (item.actual / maxValue) *
                      210;

                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="actual-line"
            />

            {/* Forecast line */}

            <polyline
              points={forecastData
                .map((item, index) => {

                  const x =
                    (index /
                      (forecastData.length - 1)) *
                    680 +
                    10;

                  const y =
                    250 -
                    (item.forecast / maxValue) *
                      210;

                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="7 6"
              className="forecast-line"
            />

          </svg>

          <div className="chart-x-axis">

            {forecastData.map((item) => (
              <span key={item.day}>
                {item.day}
              </span>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| MODEL PERFORMANCE
|--------------------------------------------------------------------------
*/

function ModelPerformance() {

  const models = [
    {
      name: "XGBoost",
      score: "0.799",
      metric: "R²",
      width: "80%",
    },
    {
      name: "LSTM",
      score: "0.764",
      metric: "R²",
      width: "76%",
    },
    {
      name: "Prophet",
      score: "0.681",
      metric: "R²",
      width: "68%",
    },
  ];

  return (
    <div className="dashboard-card performance-card">

      <div className="dashboard-card-header">

        <div>
          <h2>Model Performance</h2>

          <p>
            Current forecasting model comparison
          </p>
        </div>

        <Activity size={17} />

      </div>

      <div className="model-list">

        {models.map((model) => (
          <div className="model-row" key={model.name}>

            <div className="model-row-top">

              <span>
                {model.name}
              </span>

              <strong>
                {model.score}
              </strong>

            </div>

            <div className="model-progress">

              <div
                className="model-progress-value"
                style={{
                  width: model.width,
                }}
              />

            </div>

            <span className="model-metric">
              {model.metric}
            </span>

          </div>
        ))}

      </div>

      <div className="performance-footer">
        Best performing model: <strong>XGBoost</strong>
      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| ALERTS
|--------------------------------------------------------------------------
*/

function AlertsPanel() {

  return (
    <div className="dashboard-card alerts-card">

      <div className="dashboard-card-header">

        <div>
          <h2>Operational Alerts</h2>

          <p>
            Items requiring attention
          </p>
        </div>

        <AlertTriangle size={17} />

      </div>

      <div className="alerts-list">

        {alerts.map((alert, index) => (

          <div
            className="alert-row"
            key={index}
          >

            <div className={`alert-icon ${alert.type}`}>

              {alert.type === "warning" ? (
                <AlertTriangle size={15} />
              ) : alert.type === "forecast" ? (
                <TrendingUp size={15} />
              ) : (
                <Activity size={15} />
              )}

            </div>

            <div className="alert-content">

              <strong>
                {alert.title}
              </strong>

              <span>
                {alert.description}
              </span>

            </div>

            <time>
              {alert.time}
            </time>

          </div>

        ))}

      </div>

      <button className="view-all-button">
        View all alerts
      </button>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| TOP STORES
|--------------------------------------------------------------------------
*/

function TopStores() {

  return (
    <div className="dashboard-card stores-card">

      <div className="dashboard-card-header">

        <div>
          <h2>Top Stores by Demand</h2>

          <p>
            Highest projected demand for next period
          </p>
        </div>

        <Store size={17} />

      </div>

      <div className="store-table">

        <div className="store-table-header">

          <span>#</span>
          <span>STORE</span>
          <span>CLUSTER</span>
          <span>DEMAND</span>
          <span>CHANGE</span>

        </div>

        {topStores.map((store) => (

          <div
            className="store-table-row"
            key={store.store}
          >

            <span className="store-rank">
              {store.rank}
            </span>

            <strong>
              {store.store}
            </strong>

            <span className="cluster-badge">
              {store.cluster}
            </span>

            <span>
              {store.demand}
            </span>

            <span className="store-change">
              {store.change}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| MAIN DASHBOARD
|--------------------------------------------------------------------------
*/

export default function Dashboard() {

  return (
    <div className="dashboard">

      {/* PAGE HEADER */}

      <div className="dashboard-page-header">

        <div>

          <div className="dashboard-eyebrow">
            SUPPLY CHAIN INTELLIGENCE
          </div>

          <h1>
            Control Center
          </h1>

          <p>
            Real-time overview of demand, inventory,
            forecasts and operational activity.
          </p>

        </div>

        <div className="dashboard-date">

          <CalendarDays size={15} />

          <span>
            Forecast horizon
          </span>

          <strong>
            Next 7 days
          </strong>

        </div>

      </div>


      {/* KPI CARDS */}

      <div className="dashboard-kpi-grid">

        <KpiCard
          title="Forecasted Demand"
          value="48,392"
          subtitle="Next 7 days"
          icon={TrendingUp}
          trend="up"
          trendValue="+8.4%"
        />

        <KpiCard
          title="Active Stores"
          value="1,024"
          subtitle="Stores monitored"
          icon={Store}
          trend="up"
          trendValue="+2"
        />

        <KpiCard
          title="Inventory Risk"
          value="137"
          subtitle="Stores at risk"
          icon={Package}
          trend="down"
          trendValue="-6.2%"
        />

        <KpiCard
          title="Model Accuracy"
          value="79.9%"
          subtitle="XGBoost R² score"
          icon={Activity}
          trend="up"
          trendValue="+3.1%"
        />

      </div>


      {/* MAIN ANALYTICS ROW */}

      <div className="dashboard-grid-main">

        <ForecastChart />

        <ModelPerformance />

      </div>


      {/* LOWER ROW */}

      <div className="dashboard-grid-lower">

        <AlertsPanel />

        <TopStores />

      </div>


      {/* FOOTER STATUS */}

      <div className="dashboard-status">

        <div className="status-left">

          <span className="status-live"></span>

          <span>
            Forecast engine operational
          </span>

        </div>

        <span>
          Last model run: Today, 06:30
        </span>

      </div>

    </div>
  );
}