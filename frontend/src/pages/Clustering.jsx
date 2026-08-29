import React, { useEffect, useMemo, useState } from "react";

import {
  Network,
  Store,
  Users,
  GitBranch,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { getClusters } from "../services/api";


/*
|--------------------------------------------------------------------------
| CLUSTERING PAGE
|--------------------------------------------------------------------------
|
| Data comes completely from:
|
| GET /api/clustering
|
| Expected response:
|
| {
|   status,
|   model,
|   store_assignments,
|   cluster_summary,
|   scatter_data,
|   dendrogram
| }
|
| Nothing below hardcodes cluster/store values.
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Small helpers
|--------------------------------------------------------------------------
*/

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}


function getClusterLabel(cluster, index) {
  return `Cluster ${cluster ?? index}`;
}


/*
|--------------------------------------------------------------------------
| Loading state
|--------------------------------------------------------------------------
*/

function LoadingState() {
  return (
    <div className="page-placeholder">
      <div className="placeholder-card">

        <RefreshCw
          size={28}
          className="clustering-loading-icon"
        />

        <h2>
          Loading store clusters
        </h2>

        <p>
          Fetching the latest clustering results from
          the forecasting backend.
        </p>

      </div>
    </div>
  );
}


/*
|--------------------------------------------------------------------------
| Error state
|--------------------------------------------------------------------------
*/

function ErrorState({ message, onRetry }) {
  return (
    <div className="page-placeholder">

      <div className="placeholder-card">

        <div className="placeholder-icon">
          <AlertTriangle size={22} />
        </div>

        <h2>
          Unable to load clustering
        </h2>

        <p>
          {message}
        </p>

        <button
          type="button"
          className="view-all-button"
          onClick={onRetry}
        >
          <RefreshCw size={14} />
          Retry
        </button>

      </div>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| KPI CARD
|--------------------------------------------------------------------------
*/

function ClusterKpi({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="dashboard-kpi-card">

      <div className="kpi-top">

        <div className="kpi-icon">
          <Icon size={18} />
        </div>

        <span className="kpi-label">
          {label}
        </span>

      </div>

      <div className="kpi-value">
        {value}
      </div>

      <div className="kpi-bottom">

        <span className="kpi-subtitle">
          {description}
        </span>

      </div>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| SCATTER PLOT
|--------------------------------------------------------------------------
|
| Uses:
|   scatter_data[].x
|   scatter_data[].y
|   scatter_data[].cluster
|
| Therefore a different backend JSON automatically produces
| a different graph.
|--------------------------------------------------------------------------
*/

function ScatterPlot({ data }) {

  const [selectedStore, setSelectedStore] =
    useState(null);


  const bounds = useMemo(() => {

    if (!data.length) {
      return {
        minX: -1,
        maxX: 1,
        minY: -1,
        maxY: 1,
      };
    }

    const xs = data.map((item) => Number(item.x));
    const ys = data.map((item) => Number(item.y));

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const paddingX =
      Math.max((maxX - minX) * 0.08, 0.5);

    const paddingY =
      Math.max((maxY - minY) * 0.08, 0.5);

    return {
      minX: minX - paddingX,
      maxX: maxX + paddingX,
      minY: minY - paddingY,
      maxY: maxY + paddingY,
    };

  }, [data]);


  const width = 760;
  const height = 420;

  const padding = {
    top: 25,
    right: 25,
    bottom: 50,
    left: 55,
  };


  const plotWidth =
    width -
    padding.left -
    padding.right;

  const plotHeight =
    height -
    padding.top -
    padding.bottom;


  const xPosition = (x) => {

    const ratio =
      (Number(x) - bounds.minX) /
      (bounds.maxX - bounds.minX || 1);

    return (
      padding.left +
      ratio * plotWidth
    );

  };


  const yPosition = (y) => {

    const ratio =
      (Number(y) - bounds.minY) /
      (bounds.maxY - bounds.minY || 1);

    return (
      padding.top +
      (1 - ratio) * plotHeight
    );

  };


  const clusters = [
    ...new Set(
      data.map((item) => Number(item.cluster))
    ),
  ].sort((a, b) => a - b);


  return (
    <div className="dashboard-card clustering-scatter-card">

      <div className="dashboard-card-header">

        <div>

          <h2>
            Store Cluster Map
          </h2>

          <p>
            PCA visualization of store behaviour
          </p>

        </div>

        <div className="forecast-model">
          <Network size={14} />
          Hierarchical
        </div>

      </div>


      {/* LEGEND */}

      <div className="chart-legend">

        {clusters.map((cluster) => (

          <span key={cluster}>

            <i
              className={`legend-dot cluster-${cluster % 6}`}
            />

            Cluster {cluster}

          </span>

        ))}

      </div>


      {/* GRAPH */}

      <div className="clustering-scatter-wrapper">

        <svg
          className="clustering-scatter-svg"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >

          {/* Horizontal grid */}

          {[0, 1, 2, 3, 4].map((line) => {

            const y =
              padding.top +
              (line / 4) * plotHeight;

            return (
              <line
                key={`h-${line}`}
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                className="cluster-grid-line"
              />
            );

          })}


          {/* Vertical grid */}

          {[0, 1, 2, 3, 4].map((line) => {

            const x =
              padding.left +
              (line / 4) * plotWidth;

            return (
              <line
                key={`v-${line}`}
                x1={x}
                x2={x}
                y1={padding.top}
                y2={height - padding.bottom}
                className="cluster-grid-line"
              />
            );

          })}


          {/* Axis */}

          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={height - padding.bottom}
            y2={height - padding.bottom}
            className="cluster-axis"
          />

          <line
            x1={padding.left}
            x2={padding.left}
            y1={padding.top}
            y2={height - padding.bottom}
            className="cluster-axis"
          />


          {/* Points */}

          {data.map((point, index) => {

            const x =
              xPosition(point.x);

            const y =
              yPosition(point.y);

            const cluster =
              Number(point.cluster);

            const isSelected =
              selectedStore === point.store;


            return (
              <g
                key={`${point.store}-${index}`}
                onClick={() =>
                  setSelectedStore(point.store)
                }
                className="cluster-point-group"
              >

                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 7 : 5}
                  className={`cluster-point cluster-${cluster % 6}`}
                />

                {isSelected && (
                  <text
                    x={x + 9}
                    y={y - 9}
                    className="cluster-point-label"
                  >
                    Store {point.store}
                  </text>
                )}

              </g>
            );

          })}

        </svg>

      </div>


      {selectedStore !== null && (

        <div className="cluster-selected-store">

          <strong>
            Store {selectedStore}
          </strong>

          <span>
            Click another point to inspect it
          </span>

        </div>

      )}

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| CLUSTER SUMMARY
|--------------------------------------------------------------------------
*/

function ClusterSummary({ summary }) {

  return (
    <div className="dashboard-card">

      <div className="dashboard-card-header">

        <div>

          <h2>
            Cluster Summary
          </h2>

          <p>
            Stores grouped by behavioural similarity
          </p>

        </div>

        <Users size={17} />

      </div>


      <div className="cluster-summary-grid">

        {summary.map((cluster, index) => (

          <div
            className="cluster-summary-item"
            key={cluster.cluster ?? index}
          >

            <div className="cluster-summary-top">

              <div
                className={`cluster-summary-dot cluster-${
                  Number(cluster.cluster) % 6
                }`}
              />

              <strong>
                {getClusterLabel(
                  cluster.cluster,
                  index
                )}
              </strong>

            </div>


            <div className="cluster-summary-count">

              {formatNumber(
                cluster.store_count
              )}

              <span>
                stores
              </span>

            </div>


            <div className="cluster-store-list">

              {(cluster.stores || [])
                .slice(0, 12)
                .map((store) => (

                  <span key={store}>
                    {store}
                  </span>

                ))}

              {(cluster.stores || []).length > 12 && (

                <span>
                  +
                  {(cluster.stores || []).length - 12}
                  {" "}more
                </span>

              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| STORE ASSIGNMENTS TABLE
|--------------------------------------------------------------------------
*/

function StoreAssignments({ assignments }) {

  const [search, setSearch] =
    useState("");


  const filteredStores =
    assignments.filter((item) =>
      String(item.store)
        .toLowerCase()
        .includes(search.toLowerCase())
    );


  return (
    <div className="dashboard-card stores-card">

      <div className="dashboard-card-header">

        <div>

          <h2>
            Store Assignments
          </h2>

          <p>
            Store-to-cluster mapping returned by the model
          </p>

        </div>

        <Store size={17} />

      </div>


      <div className="cluster-table-toolbar">

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search store..."
          className="cluster-search"
        />

        <span>
          {filteredStores.length} stores
        </span>

      </div>


      <div className="store-table">

        <div className="store-table-header">

          <span>
            STORE
          </span>

          <span>
            CLUSTER
          </span>

        </div>


        {filteredStores.map((item, index) => (

          <div
            className="store-table-row clustering-store-row"
            key={`${item.store}-${index}`}
          >

            <strong>
              Store {item.store}
            </strong>

            <span
              className={`cluster-badge cluster-badge-${
                Number(item.cluster) % 6
              }`}
            >
              Cluster {item.cluster}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| DENDROGRAM
|--------------------------------------------------------------------------
|
| linkage_matrix rows are:
|
| [clusterA, clusterB, distance, count]
|
| We draw a compact hierarchical visualization from that
| matrix rather than hardcoding branches.
|--------------------------------------------------------------------------
*/

function Dendrogram({ dendrogram }) {

  if (
    !dendrogram ||
    !Array.isArray(dendrogram.linkage_matrix) ||
    !dendrogram.linkage_matrix.length
  ) {
    return null;
  }


  const matrix =
    dendrogram.linkage_matrix;

  const labels =
    dendrogram.labels || [];

  if (!labels.length) {
    return null;
  }

  const width = 900;
  const leftPad = 60;
  const rightPad = 50;
  const topPad = 26;
  const bottomPad = 20;
  const rowGap = 18;

  const plotWidth =
    width - leftPad - rightPad;

  const maxDistance =
    Math.max(
      ...matrix.map((row) =>
        Number(row[2]) || 0
      ),
      1
    );

  const positions = {};

  labels.forEach((label, index) => {
    positions[label] = {
      x: leftPad +
        (index / Math.max(labels.length - 1, 1)) *
          plotWidth,
      y: topPad + index * rowGap,
    };
  });

  const mergeRows =
    matrix.map((row, index) => {
      const leftId = Number(row[0]);
      const rightId = Number(row[1]);
      const distance = Number(row[2]) || 0;

      const leftNode = positions[leftId];
      const rightNode = positions[rightId];

      if (!leftNode || !rightNode) {
        return null;
      }

      const mergedId = labels.length + index;
      const x =
        (leftNode.x + rightNode.x) / 2;

      const y =
        topPad +
        (labels.length + index) * rowGap;

      positions[mergedId] = { x, y };

      return {
        leftId,
        rightId,
        leftNode,
        rightNode,
        x,
        y,
        distance,
        mergedId,
      };
    });

  const height =
    Math.max(
      260,
      topPad +
        (labels.length + matrix.length + 2) * rowGap +
        bottomPad
    );

  return (
    <div className="dashboard-card dendrogram-card">

      <div className="dashboard-card-header">

        <div>

          <h2>
            Hierarchical Dendrogram
          </h2>

          <p>
            Linkage:{" "}
            {dendrogram.linkage_method ||
              "ward"}
          </p>

        </div>

        <GitBranch size={17} />

      </div>


      <div className="dendrogram-wrapper">

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="dendrogram-svg"
          preserveAspectRatio="xMidYMid meet"
        >

          {mergeRows.map((merge, index) => {
            if (!merge) {
              return null;
            }

            const distanceRatio =
              (merge.distance / maxDistance) || 0;

            const distanceX =
              leftPad +
              distanceRatio * plotWidth;

            const leftStemX = merge.leftNode.x;
            const rightStemX = merge.rightNode.x;

            return (
              <g
                key={`merge-${index}`}
                className="dendrogram-row"
              >
                <line
                  x1={leftStemX}
                  x2={leftStemX}
                  y1={merge.leftNode.y}
                  y2={merge.y}
                  className="dendrogram-stem"
                />

                <line
                  x1={rightStemX}
                  x2={rightStemX}
                  y1={merge.rightNode.y}
                  y2={merge.y}
                  className="dendrogram-stem"
                />

                <line
                  x1={Math.min(leftStemX, rightStemX)}
                  x2={Math.max(leftStemX, rightStemX)}
                  y1={merge.y}
                  y2={merge.y}
                  className="dendrogram-branch"
                />

                <line
                  x1={distanceX}
                  x2={distanceX}
                  y1={merge.y - 4}
                  y2={merge.y + 4}
                  className="dendrogram-distance-line"
                />

                <circle
                  cx={merge.x}
                  cy={merge.y}
                  r="3.4"
                  className="dendrogram-node"
                />

                <text
                  x={distanceX + 8}
                  y={merge.y + 3}
                  className="dendrogram-distance"
                >
                  {merge.distance.toFixed(2)}
                </text>
              </g>
            );
          })}

          {labels.map((label, index) => {
            const point = positions[label];

            return (
              <g key={`label-${label}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3.2"
                  className="dendrogram-leaf"
                />

                <text
                  x={point.x - 6}
                  y={point.y - 11}
                  className="dendrogram-label"
                >
                  {label}
                </text>
              </g>
            );
          })}

        </svg>

      </div>


      <div className="dendrogram-footer">

        <span>
          {labels.length} stores
        </span>

        <span>
          {matrix.length} linkage operations
        </span>

      </div>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| MAIN PAGE
|--------------------------------------------------------------------------
*/

export default function Clustering() {

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  const loadClusters = async () => {

    try {

      setLoading(true);
      setError(null);

      const response =
        await getClusters();

      if (
        !response ||
        response.status === "error"
      ) {
        throw new Error(
          response?.message ||
          "Invalid clustering response."
        );
      }

      setData(response);

    } catch (err) {

      console.error(
        "Clustering request failed:",
        err
      );

      setError(
        err.message ||
        "Unable to connect to the clustering backend."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadClusters();

  }, []);


  if (loading) {
    return <LoadingState />;
  }


  if (error) {

    return (
      <ErrorState
        message={error}
        onRetry={loadClusters}
      />
    );

  }


  const model =
    data?.model || {};

  const assignments =
    Array.isArray(data?.store_assignments)
      ? data.store_assignments
      : [];

  const summary =
    Array.isArray(data?.cluster_summary)
      ? data.cluster_summary
      : [];

  const scatter =
    Array.isArray(data?.scatter_data)
      ? data.scatter_data
      : [];

  const dendrogram =
    data?.dendrogram || null;


  const storeCount =
    assignments.length;


  const clusterCount =
    Number(model.number_of_clusters) ||
    summary.length;


  return (
    <div className="dashboard clustering-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="dashboard-page-header">

        <div>

          <div className="dashboard-eyebrow">
            STORE SEGMENTATION
          </div>

          <h1>
            Store Clustering
          </h1>

          <p>
            Analyze stores grouped by similar sales
            behaviour and operational characteristics.
          </p>

        </div>


        <div className="dashboard-date">

          <Network size={15} />

          <span>
            Model
          </span>

          <strong>
            {model.name ||
              "Hierarchical Clustering"}
          </strong>

        </div>

      </div>


      {/* =====================================================
          MODEL STATUS
      ===================================================== */}

      <div className="clustering-model-status">

        <div className="clustering-model-status-left">

          <CheckCircle2 size={16} />

          <div>

            <strong>
              Clustering engine ready
            </strong>

            <span>
              {model.linkage
                ? `${model.linkage} linkage`
                : "Hierarchical clustering"}
            </span>

          </div>

        </div>


        <button
          type="button"
          className="cluster-refresh-button"
          onClick={loadClusters}
        >

          <RefreshCw size={14} />

          Refresh

        </button>

      </div>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <div className="dashboard-kpi-grid">

        <ClusterKpi
          icon={Store}
          label="Stores Clustered"
          value={formatNumber(storeCount)}
          description="Stores analysed"
        />

        <ClusterKpi
          icon={Network}
          label="Clusters"
          value={formatNumber(clusterCount)}
          description="Behavioural segments"
        />

        <ClusterKpi
          icon={GitBranch}
          label="Linkage"
          value={
            model.linkage ||
            dendrogram?.linkage_method ||
            "Ward"
          }
          description="Hierarchical method"
        />

        <ClusterKpi
          icon={Users}
          label="Assignments"
          value={formatNumber(assignments.length)}
          description="Store mappings"
        />

      </div>


      {/* =====================================================
          CLUSTER SUMMARY
      ===================================================== */}

      <ClusterSummary
        summary={summary}
      />


      {/* =====================================================
          SCATTER GRAPH
      ===================================================== */}

      <ScatterPlot
        data={scatter}
      />


      {/* =====================================================
          STORE ASSIGNMENTS
      ===================================================== */}

      <StoreAssignments
        assignments={assignments}
      />


      {/* =====================================================
          DENDROGRAM
      ===================================================== */}

      <Dendrogram
        dendrogram={dendrogram}
      />


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="dashboard-status">

        <div className="status-left">

          <span className="status-live"></span>

          <span>
            Clustering engine operational
          </span>

        </div>

        <span>
          {storeCount} stores ·{" "}
          {clusterCount} clusters
        </span>

      </div>

    </div>
  );
}