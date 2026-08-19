import React, { useMemo } from 'react';
import {
  Network,
  Sparkles,
  TrendingUp,
  Store,
  Layers3,
  GitBranch,
  Target
} from 'lucide-react';

import { Scatter } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function StoreClusteringView() {

  /* =========================================================
     CLUSTER DATA
  ========================================================= */

  const clusters = [
    {
      id: 'A',
      name: 'High Performing',
      count: 52,
      avgRevenue: '$14.2K',
      elasticity: '0.42',
      volume: 14.2,
      promo: 'Low',
      buffer: '1.5d',
      risk: '2.1%',
      color: '#6366F1'
    },
    {
      id: 'B',
      name: 'Promo Sensitive',
      count: 48,
      avgRevenue: '$8.9K',
      elasticity: '1.42',
      volume: 8.9,
      promo: 'High',
      buffer: '3.0d',
      risk: '8.4%',
      color: '#0EA5E9'
    },
    {
      id: 'C',
      name: 'Seasonal',
      count: 45,
      avgRevenue: '$6.4K',
      elasticity: '1.18',
      volume: 6.4,
      promo: 'Medium',
      buffer: '4.5d',
      risk: '14.2%',
      color: '#22C55E'
    }
  ];


  /* =========================================================
     CLUSTER FEATURE MAP
  ========================================================= */

  const scatterData = useMemo(() => ({
    datasets: [

      {
        label: 'Cluster A · High Performing',

        data: [
          { x: 84, y: 0.42 },
          { x: 91, y: 0.50 },
          { x: 78, y: 0.35 },
          { x: 95, y: 0.45 },
          { x: 88, y: 0.52 },
          { x: 82, y: 0.38 },
          { x: 90, y: 0.48 }
        ],

        backgroundColor: '#6366F1',
        borderColor: '#A5B4FC',

        pointRadius: 7,
        pointHoverRadius: 10,

        borderWidth: 1
      },

      {
        label: 'Cluster B · Promo Sensitive',

        data: [
          { x: 45, y: 1.80 },
          { x: 55, y: 1.95 },
          { x: 62, y: 1.70 },
          { x: 50, y: 1.85 },
          { x: 58, y: 1.90 },
          { x: 52, y: 1.78 },
          { x: 65, y: 1.88 }
        ],

        backgroundColor: '#0EA5E9',
        borderColor: '#7DD3FC',

        pointRadius: 7,
        pointHoverRadius: 10,

        borderWidth: 1
      },

      {
        label: 'Cluster C · Seasonal',

        data: [
          { x: 30, y: 1.20 },
          { x: 38, y: 1.15 },
          { x: 25, y: 1.30 },
          { x: 42, y: 1.25 },
          { x: 35, y: 1.10 },
          { x: 28, y: 1.35 },
          { x: 40, y: 1.18 }
        ],

        backgroundColor: '#22C55E',
        borderColor: '#86EFAC',

        pointRadius: 7,
        pointHoverRadius: 10,

        borderWidth: 1
      }

    ]
  }), []);


  /* =========================================================
     SCATTER OPTIONS
  ========================================================= */

  const scatterOptions = {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      mode: 'nearest',
      intersect: true
    },

    layout: {
      padding: {
        top: 4,
        right: 18,
        bottom: 12,
        left: 18
      }
    },

    plugins: {

      legend: {

        display: true,

        position: 'top',

        align: 'end',

        labels: {

          color: '#CBD5E1',

          font: {
            family: 'Inter, sans-serif',
            size: 12,
            weight: '600'
          },

          usePointStyle: true,

          pointStyle: 'circle',

          boxWidth: 8,

          boxHeight: 8,

          padding: 18
        }
      },

      tooltip: {

        backgroundColor: '#0F172A',

        borderColor: 'rgba(148,163,184,0.20)',

        borderWidth: 1,

        titleColor: '#F8FAFC',

        bodyColor: '#CBD5E1',

        padding: 12,

        cornerRadius: 8,

        titleFont: {
          family: 'Inter, sans-serif',
          size: 12,
          weight: '700'
        },

        bodyFont: {
          family: 'Inter, sans-serif',
          size: 11
        },

        callbacks: {

          label: (context) => [
            `Sales Velocity: ${context.parsed.x}`,
            `Price Elasticity: ${context.parsed.y.toFixed(2)}`
          ]

        }

      }

    },

    scales: {

      x: {

        type: 'linear',

        min: 0,

        max: 100,

        title: {

          display: true,

          text: 'Sales Velocity',

          color: '#CBD5E1',

          font: {
            family: 'Inter, sans-serif',
            size: 12,
            weight: '600'
          },

          padding: {
            top: 12
          }

        },

        grid: {

          color: 'rgba(148,163,184,0.07)',

          drawTicks: false

        },

        border: {

          color: 'rgba(148,163,184,0.15)',

          width: 1

        },

        ticks: {

          color: '#94A3B8',

          padding: 8,

          maxTicksLimit: 6,

          font: {
            family: 'Inter, sans-serif',
            size: 11,
            weight: '500'
          }

        }

      },

      y: {

        type: 'linear',

        min: 0,

        max: 2.2,

        title: {

          display: true,

          text: 'Price Elasticity',

          color: '#CBD5E1',

          font: {
            family: 'Inter, sans-serif',
            size: 12,
            weight: '600'
          },

          padding: {
            bottom: 12
          }

        },

        grid: {

          color: 'rgba(148,163,184,0.07)',

          drawTicks: false

        },

        border: {

          color: 'rgba(148,163,184,0.15)',

          width: 1

        },

        ticks: {

          color: '#94A3B8',

          padding: 8,

          maxTicksLimit: 6,

          font: {
            family: 'Inter, sans-serif',
            size: 11,
            weight: '500'
          },

          callback: (value) =>
            Number(value).toFixed(1)

        }

      }

    }

  };


  /* =========================================================
     DENDROGRAM DATA

     Euclidean distance / linkage levels.

     Higher distance = higher merge.
  ========================================================= */

  const dendrogramData = {

    clusterA: 0.42,

    clusterB: 0.78,

    clusterC: 1.36,

    mergeAB: 0.78,

    mergeABC: 1.36

  };


  const maxDistance = 1.5;


  /* =========================================================
     SVG DENDROGRAM HELPERS
  ========================================================= */

  const svgWidth = 900;

  const svgHeight = 390;

  const plotTop = 35;

  const plotBottom = 335;

  const plotLeft = 95;

  const plotRight = 700;


  const distanceToY = (distance) => {

    const usableHeight =
      plotBottom - plotTop;

    return (
      plotBottom -
      (distance / maxDistance) *
      usableHeight
    );

  };


  const yA =
    distanceToY(
      dendrogramData.clusterA
    );

  const yB =
    distanceToY(
      dendrogramData.clusterB
    );

  const yC =
    distanceToY(
      dendrogramData.clusterC
    );

  const yAB =
    distanceToY(
      dendrogramData.mergeAB
    );

  const yABC =
    distanceToY(
      dendrogramData.mergeABC
    );


  /* =========================================================
     DENDROGRAM GRID
  ========================================================= */

  const gridDistances = [
    0,
    0.375,
    0.75,
    1.125,
    1.5
  ];


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div className="store-clustering-page">


      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="cluster-page-header">

        <div className="cluster-header-left">

          <div className="cluster-header-icon">
            <Network size={22} />
          </div>

          <div>

            <h1>
              Store Clustering
            </h1>

            <p>
              Segment stores by sales behavior, velocity and price sensitivity.
            </p>

          </div>

        </div>


        <button
          className="btn btn-primary cluster-action-btn"
        >

          <Sparkles size={15} />

          Re-cluster Network

        </button>

      </div>


      {/* =====================================================
          OVERVIEW
          
          Highest Risk REMOVED
          
          Only 3 useful metrics remain.
      ===================================================== */}

      <div className="cluster-overview">


        <div className="overview-card">

          <div className="overview-icon">
            <Store size={18} />
          </div>

          <div>

            <span>
              Total Stores
            </span>

            <strong>
              145
            </strong>

          </div>

        </div>


        <div className="overview-card">

          <div className="overview-icon">
            <Network size={18} />
          </div>

          <div>

            <span>
              Active Clusters
            </span>

            <strong>
              3
            </strong>

          </div>

        </div>


        <div className="overview-card">

          <div className="overview-icon">
            <TrendingUp size={18} />
          </div>

          <div>

            <span>
              Avg Weekly Volume
            </span>

            <strong>
              9.8K
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================================
          CLUSTER SUMMARY CARDS
      ===================================================== */}

      <div className="cluster-cards">

        {clusters.map((cluster) => (

          <div
            className="glass-card cluster-card"
            key={cluster.id}
          >

            <div className="cluster-card-top">

              <span
                className={`cluster-dot cluster-${cluster.id.toLowerCase()}`}
              >
                {cluster.id}
              </span>

              <span className="cluster-count">
                {cluster.count} stores
              </span>

            </div>


            <h3>
              {cluster.name}
            </h3>


            <p>

              {cluster.id === 'A' &&
                'Strong and consistent sales performance with low promotion dependency.'
              }

              {cluster.id === 'B' &&
                'Stores showing strong demand response during promotional periods.'
              }

              {cluster.id === 'C' &&
                'Stores with seasonal demand patterns and higher inventory variation.'
              }

            </p>


            <div className="cluster-metrics">

              <div>

                <span>
                  Avg Revenue
                </span>

                <strong>
                  {cluster.avgRevenue}
                </strong>

              </div>


              <div>

                <span>
                  Elasticity
                </span>

                <strong>
                  {cluster.elasticity}
                </strong>

              </div>

            </div>

          </div>

        ))}

      </div>


      {/* =====================================================
          CLUSTER FEATURE MAP
      ===================================================== */}

      <div className="glass-card main-chart-card">


        <div className="chart-header">

          <div className="chart-heading">

            <div className="chart-title-row">

              <div className="chart-title-icon">
                <Target size={17} />
              </div>

              <div>

                <h2>
                  Cluster Feature Map
                </h2>

                <p>
                  Distribution of stores by sales velocity and price elasticity.
                </p>

              </div>

            </div>

          </div>


          <span className="chart-status">
            K-Means · 3 Clusters
          </span>

        </div>


        <div className="scatter-container">

          <Scatter
            data={scatterData}
            options={scatterOptions}
          />

        </div>

      </div>


      {/* =====================================================
          HIERARCHICAL DENDROGRAM
      ===================================================== */}

      <div className="glass-card dendrogram-card">


        <div className="dendrogram-header">

          <div>

            <div className="dendrogram-title-row">

              <div className="dendrogram-title-icon">
                <GitBranch size={18} />
              </div>

              <h2>
                Hierarchical Dendrogram Clustering Tree
              </h2>

            </div>

            <p>
              Hierarchical store grouping based on Euclidean distance.
            </p>

          </div>


          <span className="distance-badge">
            Euclidean Distance
          </span>

        </div>


        {/* ===================================================
            DENDROGRAM
        =================================================== */}

        <div className="dendrogram-container">

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
            className="dendrogram-svg"
          >


            {/* ===============================================
                GRID
            =============================================== */}

            {gridDistances.map(
              (distance) => {

                const y =
                  distanceToY(
                    distance
                  );

                return (

                  <g key={distance}>

                    <line
                      x1={plotLeft}
                      y1={y}
                      x2={plotRight}
                      y2={y}
                      stroke="rgba(148,163,184,0.07)"
                      strokeWidth="1"
                    />

                    <text
                      x={plotLeft - 18}
                      y={y + 4}
                      textAnchor="end"
                      fill="#64748B"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {distance.toFixed(2)}
                    </text>

                  </g>

                );

              }
            )}


            {/* ===============================================
                Y AXIS TITLE
            =============================================== */}

            <text
              x="18"
              y="195"
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="11"
              fontWeight="600"
              transform="rotate(-90 18 195)"
            >
              Euclidean Distance
            </text>


            {/* ===============================================
                CLUSTER A
            =============================================== */}

            <line
              x1={plotLeft + 45}
              y1={yA}
              x2={plotRight}
              y2={yA}
              stroke="#6366F1"
              strokeWidth="3"
            />


            <circle
              cx={plotRight}
              cy={yA}
              r="9"
              fill="#6366F1"
            />


            <text
              x={plotRight + 20}
              y={yA - 2}
              fill="#E2E8F0"
              fontSize="13"
              fontWeight="700"
            >
              Cluster A
            </text>


            <text
              x={plotRight + 20}
              y={yA + 15}
              fill="#64748B"
              fontSize="10"
            >
              High Performing
            </text>


            {/* ===============================================
                CLUSTER B
            =============================================== */}

            <line
              x1={plotLeft + 45}
              y1={yB}
              x2={plotRight}
              y2={yB}
              stroke="#0EA5E9"
              strokeWidth="3"
            />


            <circle
              cx={plotRight}
              cy={yB}
              r="9"
              fill="#0EA5E9"
            />


            <text
              x={plotRight + 20}
              y={yB - 2}
              fill="#E2E8F0"
              fontSize="13"
              fontWeight="700"
            >
              Cluster B
            </text>


            <text
              x={plotRight + 20}
              y={yB + 15}
              fill="#64748B"
              fontSize="10"
            >
              Promo Sensitive
            </text>


            {/* ===============================================
                CLUSTER C
            =============================================== */}

            <line
              x1={plotLeft + 45}
              y1={yC}
              x2={plotRight}
              y2={yC}
              stroke="#22C55E"
              strokeWidth="3"
            />


            <circle
              cx={plotRight}
              cy={yC}
              r="9"
              fill="#22C55E"
            />


            <text
              x={plotRight + 20}
              y={yC - 2}
              fill="#E2E8F0"
              fontSize="13"
              fontWeight="700"
            >
              Cluster C
            </text>


            <text
              x={plotRight + 20}
              y={yC + 15}
              fill="#64748B"
              fontSize="10"
            >
              Seasonal
            </text>


            {/* ===============================================
                A + B MERGE
            =============================================== */}

            <line
              x1={plotLeft + 45}
              y1={yA}
              x2={plotLeft + 45}
              y2={yAB}
              stroke="#64748B"
              strokeWidth="2"
            />


            <line
              x1={plotLeft + 45}
              y1={yAB}
              x2={plotLeft + 220}
              y2={yAB}
              stroke="#64748B"
              strokeWidth="2"
            />


            <circle
              cx={plotLeft + 45}
              cy={yAB}
              r="5"
              fill="#94A3B8"
            />


            {/* ===============================================
                FINAL MERGE
            =============================================== */}

            <line
              x1={plotLeft + 220}
              y1={yAB}
              x2={plotLeft + 220}
              y2={yABC}
              stroke="#64748B"
              strokeWidth="2"
            />


            <line
              x1={plotLeft + 220}
              y1={yABC}
              x2={plotLeft + 45}
              y2={yABC}
              stroke="#64748B"
              strokeWidth="2"
            />


            <line
              x1={plotLeft + 45}
              y1={yABC}
              x2={plotLeft + 45}
              y2={yC}
              stroke="#64748B"
              strokeWidth="2"
            />


            <circle
              cx={plotLeft + 45}
              cy={yABC}
              r="6"
              fill="#818CF8"
            />


            {/* ===============================================
                DISTANCE LABELS
            =============================================== */}

            <text
              x={plotLeft + 70}
              y={yAB - 8}
              fill="#64748B"
              fontSize="10"
              fontWeight="600"
            >
              d = {dendrogramData.mergeAB.toFixed(2)}
            </text>


            <text
              x={plotLeft + 70}
              y={yABC - 8}
              fill="#64748B"
              fontSize="10"
              fontWeight="600"
            >
              d = {dendrogramData.mergeABC.toFixed(2)}
            </text>


          </svg>

        </div>


        {/* ===================================================
            DENDROGRAM FOOTER
        =================================================== */}

        <div className="dendrogram-footer">

          <div className="distance-explanation">

            <strong>
              Distance Interpretation
            </strong>

            <span>
              Smaller Euclidean distance means stores are more similar.
            </span>

          </div>


          <div className="distance-values">

            <div>

              <b className="legend-a">
                A
              </b>

              <span>
                0.42
              </span>

            </div>


            <div>

              <b className="legend-b">
                B
              </b>

              <span>
                0.78
              </span>

            </div>


            <div>

              <b className="legend-c">
                C
              </b>

              <span>
                1.36
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          CLUSTER COMPARISON ONLY
          
          Cluster Hierarchy / Current Store Segmentation
          has been completely removed.
      ===================================================== */}

      <div className="glass-card comparison-card">


        <div className="secondary-header">

          <div>

            <div className="section-heading-row">

              <div className="section-heading-icon">
                <Layers3 size={17} />
              </div>

              <h2>
                Cluster Comparison
              </h2>

            </div>

            <p>
              Operational characteristics across identified store groups.
            </p>

          </div>

        </div>


        <div className="cluster-table-wrapper">

          <table className="cluster-table">

            <thead>

              <tr>

                <th>
                  Cluster
                </th>

                <th>
                  Stores
                </th>

                <th>
                  Avg Revenue
                </th>

                <th>
                  Volume
                </th>

                <th>
                  Elasticity
                </th>

                <th>
                  Promo Dependency
                </th>

                <th>
                  Buffer
                </th>

                <th>
                  Risk
                </th>

              </tr>

            </thead>


            <tbody>

              {clusters.map(
                (cluster) => (

                  <tr key={cluster.id}>

                    <td>

                      <div className="table-cluster-name">

                        <span
                          className={`table-cluster-dot cluster-${cluster.id.toLowerCase()}`}
                        >
                          {cluster.id}
                        </span>

                        <strong>
                          {cluster.name}
                        </strong>

                      </div>

                    </td>


                    <td>
                      {cluster.count}
                    </td>


                    <td>
                      {cluster.avgRevenue}
                    </td>


                    <td>
                      {cluster.volume}K
                    </td>


                    <td>
                      {cluster.elasticity}
                    </td>


                    <td>
                      {cluster.promo}
                    </td>


                    <td>
                      {cluster.buffer}
                    </td>


                    <td>

                      <span
                        className={
                          cluster.id === 'A'
                            ? 'risk-low'
                            : cluster.id === 'B'
                              ? 'risk-medium'
                              : 'risk-high'
                        }
                      >
                        {cluster.risk}
                      </span>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* =====================================================
           PAGE
        ===================================================== */

        .store-clustering-page {

          width: 100%;

          display: flex;

          flex-direction: column;

          gap: 20px;

          padding-bottom: 35px;

          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

        }


        /* =====================================================
           HEADER
        ===================================================== */

        .cluster-page-header {

          display: flex;

          justify-content: space-between;

          align-items: center;

          gap: 20px;

        }


        .cluster-header-left {

          display: flex;

          align-items: center;

          gap: 13px;

        }


        .cluster-header-icon {

          width: 46px;

          height: 46px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          border-radius: 10px;

          color: #A5B4FC;

          background:
            rgba(99,102,241,0.11);

          border:
            1px solid rgba(99,102,241,0.18);

        }


        .cluster-header-left h1 {

          margin: 0;

          color: #F8FAFC;

          font-size: 28px;

          line-height: 1.2;

          font-weight: 750;

          letter-spacing: -0.025em;

        }


        .cluster-header-left p {

          margin: 6px 0 0;

          color: #94A3B8;

          font-size: 13px;

          line-height: 1.5;

        }


        .cluster-action-btn {

          min-height: 40px;

          padding: 0 15px;

          display: flex;

          align-items: center;

          gap: 7px;

          font-size: 11px;

          font-weight: 650;

          white-space: nowrap;

        }


        /* =====================================================
           TOP OVERVIEW - ONLY 3 CARDS
        ===================================================== */

        .cluster-overview {

          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 12px;

        }


        .overview-card {

          min-height: 72px;

          display: flex;

          align-items: center;

          gap: 11px;

          padding: 14px 16px;

          border-radius: 10px;

          background:
            rgba(255,255,255,0.018);

          border:
            1px solid rgba(148,163,184,0.09);

        }


        .overview-icon {

          width: 36px;

          height: 36px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          border-radius: 8px;

          color: #A5B4FC;

          background:
            rgba(99,102,241,0.09);

        }


        .overview-card span {

          display: block;

          color: #94A3B8;

          font-size: 11px;

          font-weight: 600;

        }


        .overview-card strong {

          display: block;

          margin-top: 3px;

          color: #F1F5F9;

          font-size: 18px;

          font-weight: 750;

        }


        /* =====================================================
           CLUSTER CARDS
        ===================================================== */

        .cluster-cards {

          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 13px;

        }


        .cluster-card {

          min-width: 0;

          padding: 18px;

          border-radius: 11px;

        }


        .cluster-card-top {

          display: flex;

          justify-content: space-between;

          align-items: center;

          margin-bottom: 13px;

        }


        .cluster-dot {

          width: 33px;

          height: 33px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 8px;

          color: white;

          font-size: 12px;

          font-weight: 800;

        }


        .cluster-a {
          background: #4F46E5;
        }


        .cluster-b {
          background: #0284C7;
        }


        .cluster-c {
          background: #16A34A;
        }


        .cluster-count {

          color: #94A3B8;

          font-size: 11px;

          font-weight: 650;

        }


        .cluster-card h3 {

          margin: 0;

          color: #F1F5F9;

          font-size: 16px;

          line-height: 1.35;

          font-weight: 700;

        }


        .cluster-card p {

          min-height: 38px;

          margin: 6px 0 15px;

          color: #94A3B8;

          font-size: 11px;

          line-height: 1.55;

        }


        .cluster-metrics {

          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 12px;

          padding-top: 12px;

          border-top:
            1px solid rgba(148,163,184,0.08);

        }


        .cluster-metrics span {

          display: block;

          color: #64748B;

          font-size: 10px;

        }


        .cluster-metrics strong {

          display: block;

          margin-top: 4px;

          color: #CBD5E1;

          font-size: 14px;

          font-weight: 700;

        }


        /* =====================================================
           FEATURE MAP
        ===================================================== */

        .main-chart-card {

          padding: 19px 20px 17px;

          border-radius: 11px;

        }


        .chart-header {

          display: flex;

          justify-content: space-between;

          align-items: flex-start;

          gap: 20px;

          width: 100%;

        }


        .chart-heading {

          min-width: 0;

        }


        .chart-title-row {

          display: flex;

          align-items: flex-start;

          gap: 10px;

        }


        .chart-title-icon {

          width: 32px;

          height: 32px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 7px;

          color: #A5B4FC;

          background:
            rgba(99,102,241,0.09);

        }


        .chart-title-row h2 {

          margin: 0;

          color: #F8FAFC;

          font-size: 18px;

          line-height: 1.35;

          font-weight: 700;

        }


        .chart-title-row p {

          margin: 5px 0 0;

          color: #94A3B8;

          font-size: 12px;

          line-height: 1.5;

        }


        .chart-status {

          flex-shrink: 0;

          margin-top: 2px;

          padding: 7px 10px;

          border-radius: 6px;

          color: #A5B4FC;

          background:
            rgba(99,102,241,0.09);

          border:
            1px solid rgba(99,102,241,0.18);

          font-size: 10px;

          font-weight: 700;

          white-space: nowrap;

        }


        .scatter-container {

          position: relative;

          width: 100%;

          height: 390px;

          margin-top: 18px;

          padding: 4px 6px 8px 4px;

          box-sizing: border-box;

        }


        /* =====================================================
           DENDROGRAM
        ===================================================== */

        .dendrogram-card {

          padding: 20px;

          border-radius: 12px;

        }


        .dendrogram-header {

          display: flex;

          justify-content: space-between;

          align-items: flex-start;

          gap: 20px;

          margin-bottom: 14px;

        }


        .dendrogram-title-row {

          display: flex;

          align-items: center;

          gap: 9px;

        }


        .dendrogram-title-icon {

          width: 33px;

          height: 33px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 7px;

          color: #A5B4FC;

          background:
            rgba(99,102,241,0.09);

        }


        .dendrogram-header h2 {

          margin: 0;

          color: #F8FAFC;

          font-size: 18px;

          font-weight: 750;

        }


        .dendrogram-header p {

          margin: 5px 0 0 42px;

          color: #94A3B8;

          font-size: 12px;

        }


        .distance-badge {

          padding: 7px 11px;

          border-radius: 6px;

          color: #A5B4FC;

          background:
            rgba(99,102,241,0.10);

          border:
            1px solid rgba(99,102,241,0.24);

          font-size: 11px;

          font-weight: 700;

          white-space: nowrap;

        }


        .dendrogram-container {

          width: 100%;

          height: 390px;

          overflow: hidden;

          border-radius: 9px;

          background:
            rgba(15,23,42,0.32);

        }


        .dendrogram-svg {

          display: block;

          width: 100%;

          height: 100%;

        }


        /* =====================================================
           DENDROGRAM FOOTER
        ===================================================== */

        .dendrogram-footer {

          display: flex;

          justify-content: space-between;

          align-items: center;

          gap: 20px;

          padding: 13px 15px;

          margin-top: 12px;

          border-radius: 8px;

          background:
            rgba(255,255,255,0.018);

          border:
            1px solid rgba(148,163,184,0.08);

        }


        .distance-explanation strong {

          display: block;

          color: #CBD5E1;

          font-size: 11px;

        }


        .distance-explanation span {

          display: block;

          margin-top: 3px;

          color: #64748B;

          font-size: 10px;

        }


        .distance-values {

          display: flex;

          align-items: center;

          gap: 18px;

        }


        .distance-values > div {

          display: flex;

          align-items: center;

          gap: 6px;

          color: #94A3B8;

          font-size: 10px;

        }


        .distance-values b {

          font-size: 11px;

        }


        .legend-a {
          color: #818CF8;
        }


        .legend-b {
          color: #38BDF8;
        }


        .legend-c {
          color: #4ADE80;
        }


        /* =====================================================
           COMPARISON
        ===================================================== */

        .comparison-card {

          width: 100%;

          padding: 18px;

          border-radius: 11px;

          box-sizing: border-box;

        }


        .secondary-header {

          display: flex;

          justify-content: space-between;

          align-items: flex-start;

          gap: 15px;

          margin-bottom: 16px;

        }


        .section-heading-row {

          display: flex;

          align-items: center;

          gap: 9px;

        }


        .section-heading-icon {

          width: 31px;

          height: 31px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 7px;

          color: #A5B4FC;

          background:
            rgba(99,102,241,0.09);

        }


        .secondary-header h2 {

          margin: 0;

          color: #E2E8F0;

          font-size: 16px;

          font-weight: 700;

        }


        .secondary-header p {

          margin: 5px 0 0 40px;

          color: #94A3B8;

          font-size: 11px;

        }


        .cluster-table-wrapper {

          width: 100%;

          overflow-x: auto;

        }


        .cluster-table {

          width: 100%;

          min-width: 760px;

          border-collapse: collapse;

        }


        .cluster-table th {

          padding: 11px 9px;

          text-align: left;

          color: #64748B;

          border-bottom:
            1px solid rgba(148,163,184,0.10);

          font-size: 9px;

          font-weight: 700;

          text-transform: uppercase;

          letter-spacing: 0.03em;

          white-space: nowrap;

        }


        .cluster-table td {

          padding: 14px 9px;

          color: #CBD5E1;

          border-bottom:
            1px solid rgba(148,163,184,0.06);

          font-size: 11px;

          white-space: nowrap;

        }


        .cluster-table tbody tr:last-child td {

          border-bottom: none;

        }


        .table-cluster-name {

          display: flex;

          align-items: center;

          gap: 9px;

        }


        .table-cluster-name strong {

          color: #E2E8F0;

          font-size: 11px;

        }


        .table-cluster-dot {

          width: 27px;

          height: 27px;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          border-radius: 7px;

          color: white;

          font-size: 10px;

          font-weight: 800;

        }


        .risk-low,
        .risk-medium,
        .risk-high {

          display: inline-flex;

          padding: 4px 7px;

          border-radius: 5px;

          font-size: 9px;

          font-weight: 700;

        }


        .risk-low {

          color: #4ADE80;

          background:
            rgba(34,197,94,0.08);

        }


        .risk-medium {

          color: #FBBF24;

          background:
            rgba(245,158,11,0.08);

        }


        .risk-high {

          color: #F87171;

          background:
            rgba(239,68,68,0.08);

        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1050px) {

          .cluster-cards {

            grid-template-columns:
              1fr;

          }

        }


        @media (max-width: 800px) {

          .cluster-overview {

            grid-template-columns:
              1fr;

          }


          .dendrogram-container {

            height: 350px;

          }


          .scatter-container {

            height: 350px;

          }

        }


        @media (max-width: 650px) {

          .cluster-page-header {

            flex-direction: column;

            align-items: flex-start;

          }


          .chart-header {

            flex-direction: column;

          }


          .chart-status {

            align-self: flex-start;

          }


          .dendrogram-header {

            flex-direction: column;

          }


          .distance-badge {

            align-self: flex-start;

          }


          .dendrogram-footer {

            flex-direction: column;

            align-items: flex-start;

          }


          .cluster-header-left h1 {

            font-size: 24px;

          }

        }


      `}</style>

    </div>
  );
}