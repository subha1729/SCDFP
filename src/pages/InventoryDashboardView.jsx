import React, { useState, useEffect } from 'react';
import {
  Boxes,
  ShieldAlert,
  RefreshCw,
  DollarSign,
  Search,
  Filter,
  ShoppingCart,
  AlertTriangle,
  CheckCircle2,
  Package,
  TrendingDown,
  ChevronRight
} from 'lucide-react';

import { Line } from 'react-chartjs-2';
import { mockInventorySKUs } from '../data/mockData';
import { fetchInventory } from '../config/backendIntegration';

export default function InventoryDashboardView({ onNavigate, onShowToast }) {
  const [inventoryList, setInventoryList] = useState(mockInventorySKUs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchInventory().then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        const normalized = data.map(item => ({
          ...item,
          id: item.sku || item.id
        }));
        setInventoryList(normalized);
      }
    });
  }, []);

  const filteredSKUs = inventoryList.filter((item) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.id && item.id.toLowerCase().includes(query)) ||
      (item.sku && item.sku.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query));

    const matchesStatus =
      filterStatus === 'ALL' || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleQuickReorder = (item) => {
    if (onShowToast) {
      onShowToast({
        message: `Triggered Purchase Order generation for ${item.name} (${item.recommendedOrder || 300} units)`,
        type: 'success'
      });
    }
  };

  const inventoryTrendData = {
    labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6'],
    datasets: [
      {
        label: 'Total Stock',
        data: [1420, 1380, 1290, 1240, 1310, 1240],
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5
      },
      {
        label: 'Safety Threshold',
        data: [950, 950, 950, 950, 950, 950],
        borderColor: '#EF4444',
        borderDash: [5, 5],
        borderWidth: 1.5,
        pointRadius: 0
      }
    ]
  };

  const trendOptions = {
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
            size: 10,
            weight: '500'
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 18
        }
      },

      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#F8FAFC',
        bodyColor: '#CBD5E1',
        borderColor: 'rgba(148, 163, 184, 0.16)',
        borderWidth: 1,
        cornerRadius: 9,
        padding: 11
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
            size: 10
          }
        }
      },

      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.07)'
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748B',
          font: {
            family: 'Inter',
            size: 10
          }
        }
      }
    }
  };

  return (
    <div className="inventory-dashboard-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="inventory-header">

        <div className="inventory-title-area">

          <div className="inventory-eyebrow">
            <span className="live-dot" />
            INVENTORY INTELLIGENCE
          </div>

          <h1 className="inventory-title">
            Inventory Control Center
          </h1>

          <p className="inventory-subtitle">
            Monitor stock levels, safety buffers, replenishment risks,
            suppliers and inventory valuation.
          </p>

        </div>

        <div className="inventory-header-actions">

          <div className="inventory-live-status">
            <span className="live-dot small" />
            Live inventory
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={14} />
            Refresh
          </button>

          <button
            className="btn btn-primary"
            onClick={() => onNavigate('procurement')}
          >
            <ShoppingCart size={14} />
            AI Procurement
            <ChevronRight size={13} />
          </button>

        </div>

      </header>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <section>

        <div className="section-heading">

          <div>
            <h2>Inventory Overview</h2>
            <p>Current stock health across all distribution nodes</p>
          </div>

        </div>


        <div className="inventory-kpi-grid">

          {/* TOTAL STOCK */}

          <div className="inventory-kpi-card">

            <div className="inventory-kpi-top">

              <div>
                <span className="inventory-kpi-label">
                  Current Total Stock
                </span>

                <span className="inventory-kpi-caption">
                  All distribution nodes
                </span>
              </div>

              <div className="inventory-icon info">
                <Boxes size={19} />
              </div>

            </div>

            <div className="inventory-kpi-value">
              1,240,500
            </div>

            <div className="inventory-kpi-footer">
              <span className="kpi-status neutral">
                <Package size={12} />
                Units in stock
              </span>
            </div>

          </div>


          {/* SAFETY STOCK */}

          <div className="inventory-kpi-card">

            <div className="inventory-kpi-top">

              <div>
                <span className="inventory-kpi-label">
                  Safety Stock Buffer
                </span>

                <span className="inventory-kpi-caption">
                  Target service level
                </span>
              </div>

              <div className="inventory-icon primary">
                <ShieldAlert size={19} />
              </div>

            </div>

            <div className="inventory-kpi-value">
              350,000
            </div>

            <div className="inventory-kpi-footer">
              <span className="kpi-status positive">
                <CheckCircle2 size={12} />
                99.2% target
              </span>
            </div>

          </div>


          {/* REORDER ALERT */}

          <div className="inventory-kpi-card danger-card">

            <div className="inventory-kpi-top">

              <div>
                <span className="inventory-kpi-label">
                  Below Reorder Level
                </span>

                <span className="inventory-kpi-caption">
                  Requires attention
                </span>
              </div>

              <div className="inventory-icon danger">
                <AlertTriangle size={19} />
              </div>

            </div>

            <div className="inventory-kpi-value danger-value">
              14 SKUs
            </div>

            <div className="inventory-kpi-footer">
              <span className="kpi-status negative">
                <TrendingDown size={12} />
                Immediate PO action
              </span>
            </div>

          </div>


          {/* VALUATION */}

          <div className="inventory-kpi-card">

            <div className="inventory-kpi-top">

              <div>
                <span className="inventory-kpi-label">
                  Asset Valuation
                </span>

                <span className="inventory-kpi-caption">
                  Average cost basis
                </span>
              </div>

              <div className="inventory-icon success">
                <DollarSign size={19} />
              </div>

            </div>

            <div className="inventory-kpi-value success-value">
              $18.4M
            </div>

            <div className="inventory-kpi-footer">
              <span className="kpi-status positive">
                Current inventory value
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          INVENTORY TREND
      ===================================================== */}

      <section className="analytics-card">

        <div className="chart-header">

          <div>

            <div className="chart-title-row">

              <h2>
                Inventory Level Trend
              </h2>

              <span className="chart-badge info">
                6-WEEK VIEW
              </span>

            </div>

            <p>
              Aggregate stock velocity compared with the safety threshold
            </p>

          </div>

          <div className="chart-summary">

            <span>
              CURRENT STOCK
            </span>

            <strong>
              1,240
            </strong>

            <small>
              units
            </small>

          </div>

        </div>

        <div className="inventory-chart-wrapper">
          <Line
            data={inventoryTrendData}
            options={trendOptions}
          />
        </div>

      </section>


      {/* =====================================================
          INVENTORY TABLE
      ===================================================== */}

      <section className="inventory-table-card">

        {/* TABLE HEADER */}

        <div className="inventory-table-header">

          <div>

            <h2>
              Inventory by SKU
            </h2>

            <p>
              Monitor individual products and trigger replenishment actions
            </p>

          </div>

          <div className="sku-count">
            {filteredSKUs.length} SKUs
          </div>

        </div>


        {/* SEARCH + FILTER */}

        <div className="inventory-toolbar">

          <div className="search-box">

            <Search size={15} />

            <input
              type="text"
              placeholder="Search SKU, product or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}

          </div>


          <div className="filter-box">

            <Filter size={14} />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >

              <option value="ALL">
                All statuses
              </option>

              <option value="Healthy">
                Healthy
              </option>

              <option value="Low Stock">
                Low Stock
              </option>

              <option value="Critical">
                Critical
              </option>

            </select>

          </div>

        </div>


        {/* TABLE */}

        <div className="inventory-table-wrapper">

          <table className="inventory-table">

            <thead>

              <tr>

                <th>SKU</th>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>STOCK</th>
                <th>SAFETY</th>
                <th>REORDER</th>
                <th>PRICE</th>
                <th>SUPPLIER</th>
                <th>STATUS</th>
                <th>ACTION</th>

              </tr>

            </thead>

            <tbody>

              {filteredSKUs.length > 0 ? (

                filteredSKUs.map((sku) => (

                  <tr key={sku.id}>

                    <td>
                      <code className="sku-code">
                        {sku.id}
                      </code>
                    </td>

                    <td>

                      <div className="product-name">
                        {sku.name}
                      </div>

                    </td>

                    <td>
                      <span className="category-text">
                        {sku.category}
                      </span>
                    </td>

                    <td>

                      <span
                        className={
                          sku.status === 'Critical'
                            ? 'stock-value critical'
                            : 'stock-value'
                        }
                      >
                        {sku.stock}
                      </span>

                    </td>

                    <td>
                      <span className="table-number">
                        {sku.safetyStock}
                      </span>
                    </td>

                    <td>
                      <span className="table-number">
                        {sku.reorderLevel}
                      </span>
                    </td>

                    <td>
                      <span className="price-value">
                        {sku.price}
                      </span>
                    </td>

                    <td>
                      <span className="supplier-name">
                        {sku.supplier}
                      </span>
                    </td>

                    <td>

                      <span
                        className={`status-badge ${sku.status === 'Healthy'
                            ? 'healthy'
                            : sku.status === 'Low Stock'
                              ? 'low'
                              : 'critical'
                          }`}
                      >

                        {sku.status === 'Healthy' && (
                          <CheckCircle2 size={11} />
                        )}

                        {sku.status === 'Low Stock' && (
                          <AlertTriangle size={11} />
                        )}

                        {sku.status === 'Critical' && (
                          <AlertTriangle size={11} />
                        )}

                        {sku.status}

                      </span>

                    </td>

                    <td>

                      <button
                        className={`reorder-button ${sku.status === 'Critical'
                            ? 'urgent'
                            : ''
                          }`}
                        onClick={() => handleQuickReorder(sku)}
                      >

                        <RefreshCw size={12} />

                        Reorder

                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="10"
                    className="empty-state"
                  >

                    <Search size={22} />

                    <span>
                      No inventory items match your search.
                    </span>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </section>


      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* =========================================
           PAGE
        ========================================= */

        .inventory-dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 28px;
          padding-bottom: 30px;
          color: #F8FAFC;
        }


        /* =========================================
           HEADER
        ========================================= */

        .inventory-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
        }

        .inventory-title-area {
          min-width: 0;
        }

        .inventory-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          color: #818CF8;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: .12em;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22C55E;
          box-shadow: 0 0 0 4px rgba(34,197,94,.10);
        }

        .live-dot.small {
          width: 6px;
          height: 6px;
        }

        .inventory-title {
          margin: 0;
          font-size: 27px;
          line-height: 1.15;
          font-weight: 750;
          letter-spacing: -.035em;
        }

        .inventory-subtitle {
          max-width: 670px;
          margin: 7px 0 0;
          color: #64748B;
          font-size: 12px;
          line-height: 1.55;
        }

        .inventory-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .inventory-live-status {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 7px;
          color: #64748B;
          font-size: 10px;
          white-space: nowrap;
        }


        /* =========================================
           BUTTONS
        ========================================= */

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 36px;
          padding: 0 13px;
          border-radius: 8px;
          border: 1px solid transparent;
          font-family: inherit;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: .2s ease;
          white-space: nowrap;
        }

        .btn:hover {
          transform: translateY(-1px);
        }

        .btn-primary {
          background: #6366F1;
          color: #fff;
          border-color: #6366F1;
          box-shadow: 0 5px 18px rgba(99,102,241,.18);
        }

        .btn-primary:hover {
          background: #5558E8;
        }

        .btn-secondary {
          background: rgba(255,255,255,.025);
          color: #CBD5E1;
          border-color: rgba(148,163,184,.13);
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,.05);
          border-color: rgba(148,163,184,.22);
        }


        /* =========================================
           SECTION HEADING
        ========================================= */

        .section-heading {
          margin-bottom: 13px;
        }

        .section-heading h2 {
          margin: 0;
          color: #E2E8F0;
          font-size: 14px;
          font-weight: 650;
        }

        .section-heading p {
          margin: 4px 0 0;
          color: #64748B;
          font-size: 10.5px;
        }


        /* =========================================
           KPI GRID
        ========================================= */

        .inventory-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 13px;
        }

        .inventory-kpi-card {
          min-height: 145px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 17px;
          border: 1px solid rgba(148,163,184,.10);
          border-radius: 12px;
          background: rgba(255,255,255,.022);
          transition: .2s ease;
        }

        .inventory-kpi-card:hover {
          transform: translateY(-2px);
          border-color: rgba(148,163,184,.18);
          background: rgba(255,255,255,.032);
        }

        .danger-card {
          border-color: rgba(239,68,68,.20);
          background: rgba(239,68,68,.032);
        }

        .inventory-kpi-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .inventory-kpi-label {
          display: block;
          color: #94A3B8;
          font-size: 11px;
          font-weight: 600;
        }

        .inventory-kpi-caption {
          display: block;
          margin-top: 4px;
          color: #475569;
          font-size: 9.5px;
        }

        .inventory-icon {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 9px;
        }

        .inventory-icon.info {
          color: #7DD3FC;
          background: rgba(14,165,233,.10);
        }

        .inventory-icon.primary {
          color: #A5B4FC;
          background: rgba(99,102,241,.10);
        }

        .inventory-icon.danger {
          color: #FCA5A5;
          background: rgba(239,68,68,.10);
        }

        .inventory-icon.success {
          color: #86EFAC;
          background: rgba(34,197,94,.10);
        }

        .inventory-kpi-value {
          margin-top: 15px;
          color: #F8FAFC;
          font-size: 25px;
          font-weight: 700;
          letter-spacing: -.035em;
        }

        .danger-value {
          color: #F87171;
        }

        .success-value {
          color: #4ADE80;
        }

        .inventory-kpi-footer {
          margin-top: 10px;
        }

        .kpi-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 9.5px;
          font-weight: 600;
        }

        .kpi-status.neutral {
          color: #64748B;
        }

        .kpi-status.positive {
          color: #4ADE80;
        }

        .kpi-status.negative {
          color: #F87171;
        }


        /* =========================================
           CHART
        ========================================= */

        .analytics-card {
          padding: 18px;
          border: 1px solid rgba(148,163,184,.10);
          border-radius: 12px;
          background: rgba(255,255,255,.021);
        }

        .chart-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 15px;
        }

        .chart-title-row {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .chart-header h2 {
          margin: 0;
          color: #E2E8F0;
          font-size: 13px;
          font-weight: 650;
        }

        .chart-header p {
          margin: 5px 0 0;
          color: #64748B;
          font-size: 10px;
        }

        .chart-badge {
          padding: 4px 7px;
          border-radius: 5px;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .07em;
        }

        .chart-badge.info {
          color: #7DD3FC;
          background: rgba(14,165,233,.09);
        }

        .chart-summary {
          display: flex;
          align-items: baseline;
          gap: 5px;
        }

        .chart-summary span {
          color: #475569;
          font-size: 8px;
          font-weight: 700;
        }

        .chart-summary strong {
          color: #E2E8F0;
          font-size: 15px;
        }

        .chart-summary small {
          color: #475569;
          font-size: 9px;
        }

        .inventory-chart-wrapper {
          position: relative;
          height: 275px;
        }


        /* =========================================
           TABLE CARD
        ========================================= */

        .inventory-table-card {
          overflow: hidden;
          border: 1px solid rgba(148,163,184,.10);
          border-radius: 12px;
          background: rgba(255,255,255,.021);
        }

        .inventory-table-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 18px 18px 15px;
        }

        .inventory-table-header h2 {
          margin: 0;
          color: #E2E8F0;
          font-size: 13px;
          font-weight: 650;
        }

        .inventory-table-header p {
          margin: 4px 0 0;
          color: #64748B;
          font-size: 10px;
        }

        .sku-count {
          padding: 5px 9px;
          border: 1px solid rgba(148,163,184,.10);
          border-radius: 6px;
          color: #94A3B8;
          background: rgba(255,255,255,.025);
          font-size: 9px;
          font-weight: 600;
        }


        /* =========================================
           TOOLBAR
        ========================================= */

        .inventory-toolbar {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 18px 14px;
        }

        .search-box,
        .filter-box {
          height: 36px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(148,163,184,.11);
          border-radius: 8px;
          background: rgba(255,255,255,.025);
          color: #64748B;
        }

        .search-box {
          flex: 1;
          padding: 0 11px;
        }

        .filter-box {
          width: 190px;
          padding: 0 10px;
        }

        .search-box input,
        .filter-box select {
          width: 100%;
          height: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #CBD5E1;
          font-family: inherit;
          font-size: 10.5px;
        }

        .search-box input::placeholder {
          color: #475569;
        }

        .filter-box select {
          cursor: pointer;
        }

        .filter-box option {
          background: #111827;
          color: #CBD5E1;
        }

        .clear-search {
          border: 0;
          background: transparent;
          color: #64748B;
          font-size: 17px;
          cursor: pointer;
        }


        /* =========================================
           TABLE
        ========================================= */

        .inventory-table-wrapper {
          width: 100%;
          overflow-x: auto;
          border-top: 1px solid rgba(148,163,184,.08);
        }

        .inventory-table {
          width: 100%;
          min-width: 1050px;
          border-collapse: collapse;
        }

        .inventory-table th {
          padding: 10px 13px;
          background: rgba(255,255,255,.018);
          border-bottom: 1px solid rgba(148,163,184,.08);
          color: #475569;
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: .06em;
          text-align: left;
          white-space: nowrap;
        }

        .inventory-table td {
          padding: 12px 13px;
          border-bottom: 1px solid rgba(148,163,184,.055);
          color: #94A3B8;
          font-size: 10px;
          vertical-align: middle;
          white-space: nowrap;
        }

        .inventory-table tbody tr {
          transition: background .15s ease;
        }

        .inventory-table tbody tr:hover {
          background: rgba(255,255,255,.025);
        }

        .inventory-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .sku-code {
          padding: 4px 6px;
          border-radius: 4px;
          color: #A5B4FC;
          background: rgba(99,102,241,.07);
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
        }

        .product-name {
          max-width: 190px;
          overflow: hidden;
          color: #CBD5E1;
          font-size: 10.5px;
          font-weight: 600;
          text-overflow: ellipsis;
        }

        .category-text {
          color: #64748B;
        }

        .stock-value {
          color: #E2E8F0;
          font-weight: 650;
        }

        .stock-value.critical {
          color: #F87171;
        }

        .table-number {
          color: #94A3B8;
        }

        .price-value {
          color: #CBD5E1;
          font-weight: 550;
        }

        .supplier-name {
          color: #64748B;
        }


        /* =========================================
           STATUS
        ========================================= */

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 7px;
          border-radius: 5px;
          font-size: 8.5px;
          font-weight: 650;
        }

        .status-badge.healthy {
          color: #4ADE80;
          background: rgba(34,197,94,.08);
        }

        .status-badge.low {
          color: #FCD34D;
          background: rgba(245,158,11,.08);
        }

        .status-badge.critical {
          color: #F87171;
          background: rgba(239,68,68,.08);
        }


        /* =========================================
           REORDER BUTTON
        ========================================= */

        .reorder-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          height: 28px;
          padding: 0 9px;
          border: 1px solid rgba(148,163,184,.12);
          border-radius: 6px;
          background: rgba(255,255,255,.025);
          color: #94A3B8;
          font-family: inherit;
          font-size: 9px;
          font-weight: 600;
          cursor: pointer;
          transition: .2s ease;
        }

        .reorder-button:hover {
          color: #A5B4FC;
          border-color: rgba(99,102,241,.25);
          background: rgba(99,102,241,.07);
        }

        .reorder-button.urgent {
          color: #FCA5A5;
          border-color: rgba(239,68,68,.18);
          background: rgba(239,68,68,.05);
        }

        .reorder-button.urgent:hover {
          color: #F87171;
          background: rgba(239,68,68,.09);
        }


        /* =========================================
           EMPTY STATE
        ========================================= */

        .empty-state {
          height: 180px;
          color: #475569 !important;
          text-align: center;
        }

        .empty-state span {
          display: block;
          margin-top: 8px;
        }


        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 1200px) {

          .inventory-kpi-grid {
            grid-template-columns: repeat(2, minmax(0,1fr));
          }

          .inventory-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .inventory-header-actions {
            justify-content: flex-start;
          }

        }


        @media (max-width: 700px) {

          .inventory-dashboard-page {
            gap: 20px;
          }

          .inventory-title {
            font-size: 23px;
          }

          .inventory-kpi-grid {
            grid-template-columns: 1fr;
          }

          .inventory-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-box {
            width: auto;
          }

          .chart-header {
            flex-direction: column;
          }

          .chart-summary {
            display: none;
          }

          .inventory-header-actions {
            width: 100%;
          }

        }

      `}</style>

    </div>
  );
}