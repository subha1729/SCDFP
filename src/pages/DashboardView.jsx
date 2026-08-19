import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Boxes,
  AlertTriangle,
  PackageX,
  ShoppingCart,
  DollarSign,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

import { Line, Bar } from 'react-chartjs-2';

import {
  mockKpis,
  mockDailySales,
  mockWeeklyForecast
} from '../data/mockData';
import { fetchDashboardKpis } from '../config/backendIntegration';

export default function DashboardView({ onNavigate }) {
  const [kpis, setKpis] = useState(mockKpis);
  const [chartView, setChartView] = useState('daily');

  useEffect(() => {
    fetchDashboardKpis().then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        setKpis(data);
      }
    });
  }, []);

  /* =========================================================
     KPI ICONS
  ========================================================= */

  const getKpiIcon = (id) => {
    switch (id) {
      case 'predicted_demand':
        return <TrendingUp size={19} />;

      case 'current_inventory':
        return <Boxes size={19} />;

      case 'stock_shortages':
        return <AlertTriangle size={19} />;

      case 'overstock_items':
        return <PackageX size={19} />;

      case 'pending_orders':
        return <ShoppingCart size={19} />;

      case 'revenue_forecast':
        return <DollarSign size={19} />;

      default:
        return <Activity size={19} />;
    }
  };


  /* =========================================================
     KPI COLORS
  ========================================================= */

  const getKpiTone = (id) => {
    switch (id) {

      case 'stock_shortages':
        return 'danger';

      case 'overstock_items':
        return 'warning';

      case 'current_inventory':
        return 'info';

      case 'revenue_forecast':
        return 'success';

      default:
        return 'primary';
    }
  };


  /* =========================================================
     CHART OPTIONS
  ========================================================= */

  const lineChartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      mode: 'index',
      intersect: false
    },

    plugins: {

      legend: {
        position: 'top',
        align: 'end',

        labels: {
          color: '#94A3B8',

          font: {
            family: 'Inter',
            size: 11,
            weight: '500'
          },

          usePointStyle: true,
          pointStyle: 'circle',

          padding: 16
        }
      },

      tooltip: {

        backgroundColor: '#0F172A',

        titleColor: '#F8FAFC',

        bodyColor: '#CBD5E1',

        borderColor: 'rgba(148, 163, 184, 0.2)',

        borderWidth: 1,

        cornerRadius: 8,

        padding: 10
      }
    },

    scales: {

      x: {

        grid: {
          display: false
        },

        border: {
          display: false
        },

        ticks: {
          color: '#64748B',

          font: {
            family: 'Inter',
            size: 11
          }
        }
      },

      y: {

        grid: {
          color: 'rgba(148, 163, 184, 0.08)'
        },

        border: {
          display: false
        },

        ticks: {
          color: '#64748B',

          font: {
            family: 'Inter',
            size: 11
          }
        }
      }
    }
  };


  return (

    <div className="dashboard-container">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="dash-header">

        <div className="dash-header-left">

          <h1 className="dash-title">
            Supply Chain Control Center
          </h1>

          <p className="dash-subtitle">
            Executive overview of inventory velocity, AI demand
            projections, and operational alerts.
          </p>

        </div>


        {/* LIVE TELEMETRY — TOP RIGHT */}

        <div className="status-pill">

          <span className="pulsing-dot" />

          <span>
            LIVE TELEMETRY
          </span>

          <span className="status-active">
            ACTIVE
          </span>

        </div>

      </header>


      {/* =====================================================
          AI RECOMMENDATION
      ===================================================== */}

      <section className="insight-banner">

        <div className="insight-icon-box">
          <Sparkles size={20} />
        </div>


        <div className="insight-content">

          <div className="insight-tag">

            <span>
              AI PREDICTIVE SIGNAL
            </span>

            <span className="badge-live">
              ● +18.4% DEMAND SURGE
            </span>

          </div>


          <h2 className="insight-headline">

            Upcoming weekend promotions will drive an 18.4%
            demand surge across West Coast & Midwest stores.

          </h2>


          <p className="insight-description">

            XGBoost model recommends adding a
            <strong> +330 unit safety buffer</strong> for fresh
            dairy & energy beverages to prevent stockouts.

          </p>

        </div>


        <div className="insight-action">

          <button
            className="btn btn-primary"
            onClick={() => onNavigate('procurement')}
          >

            Review in Procurement

            <ArrowRight size={14} />

          </button>

        </div>

      </section>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <section className="kpi-section">

        <div className="kpi-grid">

          {kpis.map((kpi) => {

            const tone = getKpiTone(kpi.id);

            return (

              <div
                key={kpi.id}
                className={`kpi-box ${kpi.isAlert ? 'alert-kpi' : ''}`}
              >

                <div className="kpi-top-row">

                  <span className="kpi-name">
                    {kpi.label}
                  </span>


                  <div className={`kpi-icon-wrap ${tone}`}>
                    {getKpiIcon(kpi.id)}
                  </div>

                </div>


                <div className="kpi-main-val">
                  {kpi.value}
                </div>


                <div className="kpi-bottom-row">

                  <span
                    className={`kpi-badge ${kpi.isPositive
                        ? 'positive'
                        : 'negative'
                      }`}
                  >

                    {kpi.isPositive
                      ? <ArrowUpRight size={13} />
                      : <ArrowDownRight size={13} />
                    }

                    {kpi.change}

                  </span>


                  <span className="kpi-note">
                    {kpi.subtext}
                  </span>

                </div>

              </div>
            );

          })}

        </div>

      </section>


      {/* =====================================================
          ANALYTICS
      ===================================================== */}

      <section className="analytics-section">

        <div className="chart-card-clean">

          <div className="chart-card-header">

            <div>

              <h2 className="chart-title">
                Demand Velocity vs AI Forecast
              </h2>

              <p className="chart-subtitle">

                {chartView === 'daily'
                  ? '7-Day Actual Sales Volume vs Machine Learning Predictions'
                  : '6-Week Baseline Demand with Promotional Uplift Breakdown'
                }

              </p>

            </div>


            <div className="chart-controls">

              <div className="toggle-pill-group">

                <button
                  className={`toggle-pill ${chartView === 'daily'
                      ? 'active'
                      : ''
                    }`}
                  onClick={() => setChartView('daily')}
                >
                  Daily Velocity
                </button>


                <button
                  className={`toggle-pill ${chartView === 'weekly'
                      ? 'active'
                      : ''
                    }`}
                  onClick={() => setChartView('weekly')}
                >
                  Weekly Uplift
                </button>

              </div>


              <span className="accuracy-tag">

                <CheckCircle2 size={13} />

                98.4% Accuracy

              </span>

            </div>

          </div>


          <div className="chart-canvas-area">

            {chartView === 'daily' ? (

              <Line
                data={mockDailySales}
                options={lineChartOptions}
              />

            ) : (

              <Bar
                data={mockWeeklyForecast}
                options={lineChartOptions}
              />

            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* =====================================================
           BASE
        ===================================================== */

        .dashboard-container {

          display: flex;

          flex-direction: column;

          gap: 26px;

          padding: 4px 0 32px;

          color: #F8FAFC;

          width: 100%;

          box-sizing: border-box;

        }


        /* =====================================================
           HEADER
        ===================================================== */

        .dash-header {

          width: 100%;

          display: flex;

          align-items: flex-start;

          justify-content: space-between;

          gap: 24px;

        }


        .dash-header-left {

          min-width: 0;

        }


        .dash-title {

          margin: 0;

          color: #F8FAFC;

          font-size: 30px;

          line-height: 1.15;

          font-weight: 750;

          letter-spacing: -0.035em;

        }


        .dash-subtitle {

          max-width: 720px;

          margin: 8px 0 0;

          color: #94A3B8;

          font-size: 13px;

          line-height: 1.55;

        }


        /* =====================================================
           LIVE TELEMETRY
        ===================================================== */

        .status-pill {

          display: inline-flex;

          align-items: center;

          gap: 8px;

          min-height: 34px;

          padding: 0 12px;

          flex-shrink: 0;

          white-space: nowrap;

          border-radius: 8px;

          background:
            rgba(34, 197, 94, 0.07);

          border:
            1px solid
            rgba(34, 197, 94, 0.25);

          color: #E2E8F0;

          font-size: 11px;

          font-weight: 700;

          letter-spacing: 0.05em;

        }


        .pulsing-dot {

          width: 7px;

          height: 7px;

          flex-shrink: 0;

          border-radius: 50%;

          background: #22C55E;

          box-shadow:
            0 0 0 4px
            rgba(34, 197, 94, 0.12),
            0 0 8px
            rgba(34, 197, 94, 0.6);

        }


        .status-active {

          color: #4ADE80;

        }


        /* =====================================================
           AI INSIGHT
        ===================================================== */

        .insight-banner {

          display: flex;

          align-items: center;

          gap: 18px;

          padding: 20px 22px;

          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              rgba(79, 70, 229, 0.14),
              rgba(99, 102, 241, 0.045)
            );

          border:
            1px solid
            rgba(99, 102, 241, 0.22);

          box-shadow:
            0 5px 24px
            rgba(0, 0, 0, 0.14);

        }


        .insight-icon-box {

          width: 46px;

          height: 46px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 11px;

          background:
            rgba(99, 102, 241, 0.16);

          border:
            1px solid
            rgba(165, 180, 252, 0.18);

          color: #A5B4FC;

        }


        .insight-content {

          flex: 1;

          min-width: 0;

        }


        .insight-tag {

          display: flex;

          align-items: center;

          flex-wrap: wrap;

          gap: 10px;

          margin-bottom: 6px;

          color: #A5B4FC;

          font-size: 10px;

          font-weight: 700;

          letter-spacing: 0.07em;

        }


        .badge-live {

          color: #4ADE80;

          font-size: 10px;

          letter-spacing: 0;

        }


        .insight-headline {

          margin: 0;

          color: #F8FAFC;

          font-size: 15px;

          line-height: 1.45;

          font-weight: 650;

        }


        .insight-description {

          margin: 6px 0 0;

          color: #A1AEC0;

          font-size: 12px;

          line-height: 1.5;

        }


        .insight-description strong {

          color: #E2E8F0;

          font-weight: 650;

        }


        .insight-action {

          flex-shrink: 0;

        }


        /* =====================================================
           KPI SECTION
        ===================================================== */

        .kpi-section {

          width: 100%;

        }


        .kpi-grid {

          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 14px;

          width: 100%;

        }


        .kpi-box {

          min-width: 0;

          min-height: 145px;

          padding: 18px;

          display: flex;

          flex-direction: column;

          justify-content: space-between;

          border-radius: 13px;

          background:
            rgba(255, 255, 255, 0.025);

          border:
            1px solid
            rgba(148, 163, 184, 0.11);

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;

          box-sizing: border-box;

        }


        .kpi-box:hover {

          background:
            rgba(255, 255, 255, 0.038);

          border-color:
            rgba(148, 163, 184, 0.20);

          transform:
            translateY(-2px);

        }


        .kpi-box.alert-kpi {

          background:
            rgba(239, 68, 68, 0.045);

          border-color:
            rgba(239, 68, 68, 0.23);

        }


        .kpi-top-row {

          display: flex;

          align-items: flex-start;

          justify-content: space-between;

          gap: 14px;

        }


        .kpi-name {

          display: block;

          min-width: 0;

          color: #94A3B8;

          font-size: 12px;

          line-height: 1.35;

          font-weight: 600;

        }


        .kpi-icon-wrap {

          width: 36px;

          height: 36px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 9px;

        }


        .kpi-icon-wrap.primary {

          color: #A5B4FC;

          background:
            rgba(99, 102, 241, 0.12);

        }


        .kpi-icon-wrap.info {

          color: #7DD3FC;

          background:
            rgba(56, 189, 248, 0.12);

        }


        .kpi-icon-wrap.danger {

          color: #FCA5A5;

          background:
            rgba(239, 68, 68, 0.12);

        }


        .kpi-icon-wrap.warning {

          color: #FCD34D;

          background:
            rgba(251, 191, 36, 0.12);

        }


        .kpi-icon-wrap.success {

          color: #6EE7B7;

          background:
            rgba(52, 211, 153, 0.12);

        }


        .kpi-main-val {

          margin: 14px 0 8px;

          color: #F8FAFC;

          font-size: 28px;

          line-height: 1.1;

          font-weight: 750;

          letter-spacing: -0.035em;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;

        }


        .kpi-bottom-row {

          display: flex;

          align-items: center;

          flex-wrap: wrap;

          gap: 7px;

        }


        .kpi-badge {

          display: inline-flex;

          align-items: center;

          gap: 3px;

          font-size: 11px;

          font-weight: 700;

        }


        .kpi-badge.positive {

          color: #34D399;

        }


        .kpi-badge.negative {

          color: #F87171;

        }


        .kpi-note {

          min-width: 0;

          color: #64748B;

          font-size: 11px;

          line-height: 1.3;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

        }


        /* =====================================================
           ANALYTICS
        ===================================================== */

        .analytics-section {

          width: 100%;

        }


        .chart-card-clean {

          padding: 21px;

          border-radius: 13px;

          background:
            rgba(255, 255, 255, 0.022);

          border:
            1px solid
            rgba(148, 163, 184, 0.11);

          box-sizing: border-box;

        }


        .chart-card-header {

          display: flex;

          align-items: flex-start;

          justify-content: space-between;

          gap: 20px;

          margin-bottom: 20px;

        }


        .chart-title {

          margin: 0;

          color: #F8FAFC;

          font-size: 16px;

          line-height: 1.3;

          font-weight: 650;

        }


        .chart-subtitle {

          margin: 5px 0 0;

          color: #64748B;

          font-size: 11.5px;

          line-height: 1.4;

        }


        .chart-controls {

          display: flex;

          align-items: center;

          justify-content: flex-end;

          gap: 10px;

          flex-shrink: 0;

        }


        /* =====================================================
           TOGGLE
        ===================================================== */

        .toggle-pill-group {

          display: flex;

          align-items: center;

          padding: 3px;

          border-radius: 8px;

          background:
            rgba(15, 23, 42, 0.65);

          border:
            1px solid
            rgba(148, 163, 184, 0.13);

        }


        .toggle-pill {

          min-height: 29px;

          padding: 0 12px;

          border: none;

          border-radius: 6px;

          background: transparent;

          color: #94A3B8;

          font-family: inherit;

          font-size: 10.5px;

          font-weight: 600;

          cursor: pointer;

          transition:
            all 0.2s ease;

        }


        .toggle-pill:hover {

          color: #E2E8F0;

        }


        .toggle-pill.active {

          background: #4F46E5;

          color: #FFFFFF;

        }


        /* =====================================================
           ACCURACY
        ===================================================== */

        .accuracy-tag {

          display: inline-flex;

          align-items: center;

          gap: 5px;

          min-height: 29px;

          padding: 0 10px;

          border-radius: 6px;

          background:
            rgba(34, 197, 94, 0.09);

          color: #4ADE80;

          font-size: 10.5px;

          font-weight: 600;

          white-space: nowrap;

        }


        /* =====================================================
           CHART
        ===================================================== */

        .chart-canvas-area {

          position: relative;

          width: 100%;

          height: 360px;

          padding-top: 4px;

        }


        .chart-canvas-area canvas {

          max-width: 100%;

        }


        /* =====================================================
           BUTTON FIX
        ===================================================== */

        .insight-action .btn {

          min-height: 36px;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 7px;

          padding: 0 14px;

          white-space: nowrap;

        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1200px) {

          .kpi-grid {

            grid-template-columns:
              repeat(2, minmax(0, 1fr));

          }


          .chart-card-header {

            align-items: flex-start;

            flex-direction: column;

          }


          .chart-controls {

            width: 100%;

            justify-content: space-between;

          }

        }


        @media (max-width: 800px) {

          .dashboard-container {

            gap: 20px;

          }


          .dash-header {

            flex-direction: column;

          }


          .status-pill {

            align-self: flex-end;

          }


          .dash-title {

            font-size: 26px;

          }


          .insight-banner {

            align-items: flex-start;

          }


          .chart-controls {

            align-items: flex-start;

            flex-direction: column;

          }


          .chart-canvas-area {

            height: 320px;

          }

        }


        @media (max-width: 600px) {

          .kpi-grid {

            grid-template-columns: 1fr;

          }


          .kpi-box {

            min-height: 135px;

          }


          .insight-banner {

            flex-direction: column;

          }


          .insight-action {

            width: 100%;

          }


          .insight-action .btn {

            width: 100%;

          }


          .chart-controls {

            width: 100%;

          }


          .toggle-pill-group {

            width: 100%;

          }


          .toggle-pill {

            flex: 1;

          }


          .chart-canvas-area {

            height: 280px;

          }

        }

      `}</style>

    </div>
  );
}