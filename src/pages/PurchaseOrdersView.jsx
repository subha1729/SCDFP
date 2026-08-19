import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Eye,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  FileText
} from 'lucide-react';

import { mockPurchaseOrders } from '../data/mockData';
import { fetchPurchaseOrders, updatePurchaseOrderStatus } from '../config/backendIntegration';

export default function PurchaseOrdersView({ onShowToast }) {
  const [ordersList, setOrdersList] = useState(mockPurchaseOrders);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPODrawer, setSelectedPODrawer] = useState(null);

  useEffect(() => {
    fetchPurchaseOrders().then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        setOrdersList(data);
      }
    });
  }, []);

  const filteredOrders = ordersList.filter((po) => {
    const matchesTab =
      activeTab === 'ALL' ||
      po.status.toUpperCase() === activeTab;

    const search = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !search ||
      (po.id && po.id.toLowerCase().includes(search)) ||
      (po.supplier && po.supplier.toLowerCase().includes(search));

    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="badge badge-warning">
            <Clock size={10} />
            Pending Approval
          </span>
        );

      case 'Approved':
        return (
          <span className="badge badge-primary">
            <CheckCircle2 size={10} />
            Approved
          </span>
        );

      case 'Delivered':
        return (
          <span className="badge badge-success">
            <CheckCircle2 size={10} />
            Delivered
          </span>
        );

      case 'Cancelled':
        return (
          <span className="badge badge-danger">
            <XCircle size={10} />
            Cancelled
          </span>
        );

      default:
        return (
          <span className="badge">
            {status}
          </span>
        );
    }
  };

  const handleApprovePO = async (poId) => {
    try {
      await updatePurchaseOrderStatus(poId, 'Approved');
      setOrdersList(prev => prev.map(o => o.id === poId ? { ...o, status: 'Approved' } : o));
    } catch (e) {
      console.warn("PO status update notice:", e);
    }

    if (onShowToast) {
      onShowToast({
        message: `Purchase Order ${poId} approved and sent to vendor.`,
        type: 'success'
      });
    }

    setSelectedPODrawer(null);
  };

  const handleCreatePO = () => {
    if (onShowToast) {
      onShowToast({
        message: 'Create Purchase Order',
        type: 'info'
      });
    }
  };

  return (
    <div className="purchase-orders-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="page-header-row">

        <div className="po-heading">

          <h1 className="page-title">
            <ShoppingCart className="text-primary" />
            Purchase Orders
          </h1>

          <div className="po-subtitle-row">

            <p className="page-subtitle">
              Track replenishment orders, vendor delivery timelines,
              and approval status.
            </p>

            <button
              className="btn btn-primary create-po-btn"
              onClick={handleCreatePO}
            >
              + Create Manual Purchase Order
            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          FILTER + SEARCH
      ===================================================== */}

      <div className="glass-card po-controls">

        <div className="po-status-tabs">

          {[
            'ALL',
            'PENDING',
            'APPROVED',
            'DELIVERED',
            'CANCELLED'
          ].map((tab) => (

            <button
              key={tab}
              className={`po-tab-btn ${activeTab === tab ? 'active' : ''
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>

          ))}

        </div>


        {/* SEARCH */}

        <div className="po-search-wrapper">

          <Search
            size={16}
            className="po-search-icon"
          />

          <input
            type="text"
            className="po-search-input"
            placeholder="Search PO ID or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchQuery && (

            <button
              className="po-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>

          )}

        </div>

      </div>


      {/* =====================================================
          PURCHASE ORDER TABLE
      ===================================================== */}

      <div className="glass-card table-section-card">

        <div className="table-heading-row">

          <div>

            <h2 className="table-heading">
              Purchase Order List
            </h2>

            <p className="table-description">
              {filteredOrders.length} purchase orders matching
              the current filters.
            </p>

          </div>

          <span className="orders-count">
            {filteredOrders.length} Orders
          </span>

        </div>


        <div className="table-container">

          <table className="data-table">

            <thead>

              <tr>
                <th>PO ID</th>
                <th>Supplier Vendor</th>
                <th>Line Items</th>
                <th>Total Value</th>
                <th>Date Created</th>
                <th>Expected Delivery</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>


            <tbody>

              {filteredOrders.length > 0 ? (

                filteredOrders.map((po) => (

                  <tr key={po.id}>

                    <td>
                      <code className="store-id-code">
                        {po.id}
                      </code>
                    </td>


                    <td>
                      <strong className="supplier-name">
                        {po.supplier}
                      </strong>
                    </td>


                    <td>
                      <span className="table-secondary-text">
                        {po.itemsCount} SKUs
                      </span>
                    </td>


                    <td>
                      <strong className="text-primary">
                        {po.totalAmount}
                      </strong>
                    </td>


                    <td>
                      <span className="table-secondary-text">
                        {po.createdDate}
                      </span>
                    </td>


                    <td>
                      <span className="table-secondary-text">
                        {po.expectedDelivery}
                      </span>
                    </td>


                    <td>

                      <span
                        className={`badge ${po.priority === 'High'
                            ? 'badge-danger'
                            : 'badge-primary'
                          }`}
                      >
                        {po.priority}
                      </span>

                    </td>


                    <td>
                      {getStatusBadge(po.status)}
                    </td>


                    <td>

                      <button
                        className="btn btn-secondary btn-icon view-po-btn"
                        onClick={() =>
                          setSelectedPODrawer(po)
                        }
                        title="View Purchase Order"
                        aria-label={`View ${po.id}`}
                      >
                        <Eye size={16} />
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="9"
                    className="empty-table-cell"
                  >

                    <div className="empty-table-state">

                      <ShoppingCart size={28} />

                      <strong>
                        No purchase orders found
                      </strong>

                      <span>
                        Try changing the status filter
                        or search term.
                      </span>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================================
          PURCHASE ORDER DRAWER
      ===================================================== */}

      {selectedPODrawer && (

        <div
          className="drawer-backdrop"
          onClick={() =>
            setSelectedPODrawer(null)
          }
        >

          <div
            className="po-drawer glass-card"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* DRAWER HEADER */}

            <div className="drawer-header">

              <div className="drawer-heading-content">

                <span className="badge badge-primary">
                  {selectedPODrawer.id}
                </span>

                <h2 className="drawer-po-title">
                  Purchase Order Details
                </h2>

                <p className="drawer-po-sub">
                  <Building2 size={12} />
                  Supplier: {selectedPODrawer.supplier}
                </p>

              </div>


              <button
                className="btn-icon btn-secondary drawer-close-btn"
                onClick={() =>
                  setSelectedPODrawer(null)
                }
                aria-label="Close"
              >
                <X size={18} />
              </button>

            </div>


            {/* DRAWER BODY */}
            <div className="drawer-body">
              {/* SPECIFICATION OVERVIEW */}
              <div className="po-spec-card glass-card">
                <div className="spec-grid">
                  <div className="spec-item">
                    <span className="spec-label">
                      <Building2 size={13} className="text-primary" /> Vendor
                    </span>
                    <strong className="spec-val">{selectedPODrawer.supplier}</strong>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">
                      <Clock size={13} className="text-primary" /> Status
                    </span>
                    <div>{getStatusBadge(selectedPODrawer.status)}</div>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">
                      <Calendar size={13} className="text-primary" /> Expected Delivery
                    </span>
                    <strong className="spec-val">{selectedPODrawer.expectedDelivery}</strong>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">
                      <FileText size={13} className="text-primary" /> Issue Date
                    </span>
                    <span className="spec-val-muted">{selectedPODrawer.createdDate}</span>
                  </div>
                </div>
              </div>

              {/* METRICS */}
              <div className="grid-2 drawer-metrics">
                <div className="mini-card">
                  <span className="mini-label">Total Amount</span>
                  <strong className="mini-val text-primary">
                    {selectedPODrawer.totalAmount}
                  </strong>
                </div>
                <div className="mini-card">
                  <span className="mini-label">Line Items</span>
                  <strong className="mini-val">
                    {selectedPODrawer.itemsCount} SKUs
                  </strong>
                </div>
              </div>

              {/* LINE ITEMS */}
              <div className="drawer-section">
                <div className="section-heading-row">
                  <h3 className="section-title">
                    Product Line Items
                  </h3>
                  <span className="item-count-label">
                    {selectedPODrawer.itemsCount} items
                  </span>
                </div>

                <div className="line-items-list">
                  <div className="line-item-row">
                    <div className="line-item-info">
                      <strong>Organic Whole Milk 1L</strong>
                      <span className="item-sub">SKU-8821 • 330 units</span>
                    </div>
                    <strong className="line-item-price">$924.00</strong>
                  </div>
                  <div className="line-item-row">
                    <div className="line-item-info">
                      <strong>Artisan Espresso Beans 1kg</strong>
                      <span className="item-sub">SKU-9943 • 30 units</span>
                    </div>
                    <strong className="line-item-price">$556.00</strong>
                  </div>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="drawer-footer-actions">
                {selectedPODrawer.status === 'Pending' ? (
                  <div className="action-buttons-group">
                    <button
                      className="btn btn-primary full-width"
                      onClick={() => handleApprovePO(selectedPODrawer.id)}
                    >
                      <CheckCircle2 size={16} />
                      Approve & Dispatch Order
                    </button>
                    <button
                      className="btn btn-secondary full-width cancel-po-btn"
                      onClick={() => {
                        setOrdersList(prev => prev.map(o => o.id === selectedPODrawer.id ? { ...o, status: 'Cancelled' } : o));
                        setSelectedPODrawer(prev => ({ ...prev, status: 'Cancelled' }));
                        onShowToast?.(`Purchase Order ${selectedPODrawer.id} cancelled.`, 'info');
                      }}
                    >
                      <XCircle size={16} />
                      Cancel Order
                    </button>
                  </div>
                ) : (
                  <div className="status-confirmed-banner">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>
                      {selectedPODrawer.status === 'Approved'
                        ? 'Order Approved & Dispatched to Supplier'
                        : selectedPODrawer.status === 'Delivered'
                        ? 'Order Fulfilled & Stock Received'
                        : 'Order Cancelled'}
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* =====================================================
           PAGE
        ===================================================== */

        .purchase-orders-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-bottom: 24px;
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .page-header-row {
          width: 100%;
        }

        .po-heading {
          width: 100%;
          min-width: 0;
        }

        .po-heading .page-title {
          display: flex;
          align-items: center;
          gap: 9px;

          margin: 0 0 5px;
        }

        .po-subtitle-row {
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 24px;
        }

        .po-subtitle-row .page-subtitle {
          flex: 1;
          min-width: 0;

          margin: 0;

          line-height: 1.5;
        }

        .create-po-btn {
          flex-shrink: 0;

          height: 40px;

          white-space: nowrap;
        }


        /* =====================================================
           FILTER + SEARCH
        ===================================================== */

        .po-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 24px;

          padding: 12px 16px;

          min-height: 64px;
        }


        /* =====================================================
           STATUS TABS
        ===================================================== */

        .po-status-tabs {
          display: flex;
          align-items: center;

          gap: 4px;

          padding: 4px;

          background: rgba(15, 23, 42, 0.75);

          border: 1px solid var(--border-color);

          border-radius: 9px;

          flex-shrink: 0;
        }

        .po-tab-btn {
          height: 34px;

          padding: 0 13px;

          border: none;
          border-radius: 7px;

          background: transparent;

          color: var(--text-muted);

          font-size: 13px;
          font-weight: 600;

          cursor: pointer;

          white-space: nowrap;

          transition:
            background 0.15s ease,
            color 0.15s ease;
        }

        .po-tab-btn:hover {
          color: var(--text-main);

          background: rgba(255, 255, 255, 0.05);
        }

        .po-tab-btn.active {
          background: var(--primary);

          color: #ffffff;
        }


        /* =====================================================
           SEARCH
        ===================================================== */

        .po-search-wrapper {
          position: relative;

          width: 300px;
          height: 40px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
        }

        .po-search-icon {
          position: absolute;

          left: 13px;

          color: var(--text-muted);

          pointer-events: none;

          z-index: 2;
        }

        .po-search-input {
          width: 100%;
          height: 40px;

          box-sizing: border-box;

          padding: 0 38px 0 38px;

          border: 1px solid var(--border-color);

          border-radius: 8px;

          background: rgba(15, 23, 42, 0.65);

          color: var(--text-main);

          font-size: 13px;

          outline: none;

          transition:
            border-color 0.15s ease,
            background 0.15s ease,
            box-shadow 0.15s ease;
        }

        .po-search-input::placeholder {
          color: var(--text-muted);
          opacity: 0.8;
        }

        .po-search-input:focus {
          border-color: rgba(129, 140, 248, 0.65);

          background: rgba(15, 23, 42, 0.9);

          box-shadow:
            0 0 0 3px
            rgba(99, 102, 241, 0.10);
        }

        .po-search-clear {
          position: absolute;

          right: 8px;

          width: 25px;
          height: 25px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0;

          border: none;
          border-radius: 5px;

          background: transparent;

          color: var(--text-muted);

          cursor: pointer;
        }

        .po-search-clear:hover {
          background: rgba(255, 255, 255, 0.08);

          color: var(--text-main);
        }


        /* =====================================================
           TABLE
        ===================================================== */

        .table-section-card {
          padding: 0;
          overflow: hidden;
        }

        .table-heading-row {
          min-height: 72px;

          padding: 15px 20px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 16px;

          border-bottom: 1px solid var(--border-color);
        }

        .table-heading {
          margin: 0 0 4px;

          color: var(--text-main);

          font-size: 15px;
          font-weight: 750;
        }

        .table-description {
          margin: 0;

          color: var(--text-muted);

          font-size: 11px;

          line-height: 1.45;
        }

        .orders-count {
          padding: 5px 9px;

          border: 1px solid var(--border-color);

          border-radius: 6px;

          background: rgba(255, 255, 255, 0.025);

          color: var(--text-muted);

          font-size: 10px;
          font-weight: 650;

          white-space: nowrap;
        }


        /* =====================================================
           TABLE CONTAINER
        ===================================================== */

        .table-container {
          width: 100%;

          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          min-width: 1000px;

          border-collapse: separate;
          border-spacing: 0;
        }

        .data-table th {
          height: 46px;

          padding: 0 15px;

          background: rgba(15, 23, 42, 0.55);

          border-bottom: 1px solid var(--border-color);

          color: var(--text-muted);

          font-size: 11px;
          font-weight: 700;

          text-align: left;

          white-space: nowrap;
          vertical-align: middle;
        }

        .data-table td {
          min-height: 58px;

          padding: 13px 15px;

          border-bottom:
            1px solid
            rgba(148, 163, 184, 0.07);

          color: var(--text-main);

          vertical-align: middle;

          white-space: nowrap;
        }

        .data-table tbody tr {
          transition: background 0.15s ease;
        }

        .data-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.025);
        }

        .data-table tbody tr:last-child td {
          border-bottom: none;
        }

        .supplier-name {
          display: inline-block;

          max-width: 190px;

          overflow: hidden;

          text-overflow: ellipsis;

          vertical-align: middle;
        }

        .table-secondary-text {
          color: var(--text-muted);
        }

        .view-po-btn {
          width: 32px;
          height: 32px;

          display: inline-flex;

          align-items: center;
          justify-content: center;
        }


        /* =====================================================
           EMPTY TABLE
        ===================================================== */

        .empty-table-cell {
          height: 260px;

          text-align: center !important;
        }

        .empty-table-state {
          display: flex;

          flex-direction: column;

          align-items: center;
          justify-content: center;

          gap: 7px;

          color: var(--text-muted);
        }

        .empty-table-state svg {
          opacity: 0.55;
          margin-bottom: 4px;
        }

        .empty-table-state strong {
          color: var(--text-main);
        }


        /* =====================================================
           DRAWER
        ===================================================== */

        .po-drawer {
          width: 500px;
          max-width: 92vw;

          height: 100%;

          border-radius: 0;

          border-left: 1px solid var(--border-color);

          display: flex;
          flex-direction: column;

          padding: 0;

          overflow: hidden;

          animation:
            slideInRight
            0.25s
            cubic-bezier(0.4, 0, 0.2, 1);
        }

        .drawer-header {
          min-height: 92px;

          padding: 18px 20px;

          display: flex;

          align-items: flex-start;

          justify-content: space-between;

          gap: 16px;

          border-bottom: 1px solid var(--border-color);

          flex-shrink: 0;
        }

        .drawer-heading-content {
          min-width: 0;
        }

        .drawer-po-title {
          margin: 6px 0 5px;

          color: var(--text-main);

          font-size: 20px;
          font-weight: 800;

          line-height: 1.25;
        }

        .drawer-po-sub {
          display: flex;

          align-items: center;

          gap: 5px;

          margin: 0;

          color: var(--text-muted);

          font-size: 12px;

          line-height: 1.4;
        }

        .drawer-close-btn {
          flex-shrink: 0;

          width: 34px;
          height: 34px;
        }


        /* =====================================================
           DRAWER BODY
        ===================================================== */

        .drawer-body {
          flex: 1;

          min-height: 0;

          overflow-y: auto;

          padding: 20px;
        }


        /* =====================================================
           TIMELINE
        ===================================================== */

        .po-timeline-card {
          padding: 18px;

          margin-bottom: 18px;
        }

        .section-title {
          display: flex;

          align-items: center;

          gap: 7px;

          margin: 0;

          font-size: 14px;
          font-weight: 700;
        }

        .po-spec-card {
          padding: 16px;
          margin-bottom: 18px;
          border-radius: 10px;
        }

        .spec-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 16px;
        }

        .spec-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .spec-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .spec-val {
          font-size: 13px;
          font-weight: 650;
          color: var(--text-main);
        }

        .spec-val-muted {
          font-size: 12px;
          color: var(--text-muted);
        }

        /* =====================================================
           DRAWER METRICS
        ===================================================== */

        .drawer-metrics {
          gap: 12px;
          margin-bottom: 20px;
        }

        .mini-card {
          min-height: 66px;
          padding: 13px 14px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }

        .mini-label {
          font-size: 11px;
          color: var(--text-muted);
        }

        .mini-val {
          font-size: 15px;
          line-height: 1.3;
        }

        /* =====================================================
           LINE ITEMS
        ===================================================== */

        .drawer-section {
          margin-top: 4px;
        }

        .section-heading-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }

        .item-count-label {
          color: var(--text-subtle);
          font-size: 10px;
        }

        .line-items-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .line-item-row {
          min-height: 62px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 11px 13px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 13px;
        }

        .line-item-info {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .line-item-info strong {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-sub {
          display: block;
          font-size: 11px;
          color: var(--text-muted);
        }

        .line-item-price {
          flex-shrink: 0;
          white-space: nowrap;
        }

        /* =====================================================
           DRAWER FOOTER
        ===================================================== */

        .drawer-footer-actions {
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid var(--border-color);
        }

        .action-buttons-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .drawer-footer-actions .full-width {
          width: 100%;
          min-height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
        }

        .cancel-po-btn {
          color: var(--danger, #ef4444);
        }

        .cancel-po-btn:hover {
          background: rgba(239, 68, 68, 0.12);
        }

        .status-confirmed-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          border-radius: 8px;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.25);
          color: var(--text-main);
          font-size: 13px;
          font-weight: 550;
        }


        /* =====================================================
           DRAWER SCROLLBAR
        ===================================================== */

        .drawer-body::-webkit-scrollbar {
          width: 5px;
        }

        .drawer-body::-webkit-scrollbar-track {
          background: transparent;
        }

        .drawer-body::-webkit-scrollbar-thumb {
          background:
            rgba(148, 163, 184, 0.18);

          border-radius: 10px;
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1000px) {

          .po-subtitle-row {
            align-items: flex-start;

            flex-direction: column;

            gap: 12px;
          }

          .create-po-btn {
            align-self: flex-end;
          }

          .po-controls {
            align-items: stretch;

            flex-direction: column;

            gap: 12px;
          }

          .po-status-tabs {
            width: 100%;

            overflow-x: auto;
          }

          .po-search-wrapper {
            width: 100%;
          }

        }


        @media (max-width: 700px) {

          .create-po-btn {
            width: 100%;
          }

          .po-status-tabs {
            justify-content: flex-start;
          }

          .po-tab-btn {
            flex-shrink: 0;
          }

          .table-heading-row {
            align-items: flex-start;

            flex-direction: column;
          }

          .po-drawer {
            width: 100%;
            max-width: 100%;
          }

        }


        @media (max-width: 500px) {

          .po-controls {
            padding: 10px;
          }

          .po-tab-btn {
            padding-left: 10px;
            padding-right: 10px;
          }

          .drawer-body {
            padding: 15px;
          }

          .timeline-stepper {
            gap: 0;
          }

          .step-label {
            max-width: 70px;
          }

          .line-item-row {
            align-items: flex-start;
          }

        }

      `}</style>

    </div>
  );
}