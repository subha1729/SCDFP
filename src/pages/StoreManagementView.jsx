import React, { useState, useEffect } from 'react';
import {
  Store,
  Search,
  Filter,
  Eye,
  X,
  TrendingUp,
  Boxes,
  Tag,
  ChevronLeft,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { mockStores } from '../data/mockData';
import { fetchStores } from '../config/backendIntegration';

export default function StoreManagementView() {
  const [storesList, setStoresList] = useState(mockStores);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedStoreDrawer, setSelectedStoreDrawer] = useState(null);
  const [currentPage] = useState(1);

  useEffect(() => {
    fetchStores().then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        setStoresList(data);
      }
    });
  }, []);

  // Filter stores
  const filteredStores = storesList.filter(store => {
    const matchesSearch = (store.name && store.name.toLowerCase().includes(searchTerm.toLowerCase())) || (store.id && store.id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRegion = selectedRegion === 'ALL' || store.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const storeDrawerChart = {
    labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6'],
    datasets: [
      {
        label: 'Weekly Sales ($k)',
        data: [140, 165, 150, 185, 210, 240],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const drawerChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748B' } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748B' } }
    }
  };

  return (
    <div className="store-management-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title"><Store className="text-primary" /> Store Management</h1>
          <p className="page-subtitle">Monitor store network performance, regional stock health, and sales velocity.</p>
        </div>
        <button className="btn btn-primary">
          + Add New Store Location
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card store-controls-card">
        <div className="search-input-box">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Search by Store Name or Store ID..."
            className="store-search-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-select-box">
          <Filter size={14} className="text-muted" />
          <select
            className="input-field select-field"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="ALL">All Regions</option>
            <option value="North America East">North America East</option>
            <option value="West Coast">West Coast</option>
            <option value="Midwest">Midwest</option>
            <option value="South">South</option>
            <option value="Southeast">Southeast</option>
            <option value="Northwest">Northwest</option>
            <option value="Northeast">Northeast</option>
          </select>
        </div>
      </div>

      {/* Stores Data Table */}
      <div className="glass-card table-section-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Store ID</th>
                <th>Store Name</th>
                <th>Region</th>
                <th>Store Type</th>
                <th>Current Sales</th>
                <th>Inventory Health</th>
                <th>Replenishment Lead Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr key={store.id}>
                  <td><code className="store-id-code">{store.id}</code></td>
                  <td><strong>{store.name}</strong></td>
                  <td><span className="region-tag"><MapPin size={12} /> {store.region}</span></td>
                  <td>{store.type}</td>
                  <td><strong className="text-primary">{store.sales}</strong></td>
                  <td>{store.inventoryLevel}</td>
                  <td>{store.leadTime}</td>
                  <td>
                    <span className={`badge ${store.status === 'Optimal' ? 'badge-success' : store.status === 'Low Stock' ? 'badge-warning' : 'badge-danger'
                      }`}>
                      {store.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-icon"
                      onClick={() => setSelectedStoreDrawer(store)}
                      title="View Detailed Store Analytics Drawer"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="pagination-bar">
          <span className="pagination-info">Showing 1 to {filteredStores.length} of {mockStores.length} Stores</span>
          <div className="pagination-controls">
            <button className="btn btn-secondary btn-icon" disabled={currentPage === 1}>
              <ChevronLeft size={16} />
            </button>
            <button className="btn btn-primary btn-icon">1</button>
            <button className="btn btn-secondary btn-icon">2</button>
            <button className="btn btn-secondary btn-icon">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-Over Store Detail Drawer */}
      {selectedStoreDrawer && (
        <div className="drawer-backdrop" onClick={() => setSelectedStoreDrawer(null)}>
          <div className="store-drawer glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <span className="badge badge-primary">{selectedStoreDrawer.id}</span>
                <h2 className="drawer-store-name">{selectedStoreDrawer.name}</h2>
                <p className="drawer-store-sub"><MapPin size={12} /> {selectedStoreDrawer.region} &bull; {selectedStoreDrawer.type}</p>
              </div>
              <button className="btn-icon btn-secondary" onClick={() => setSelectedStoreDrawer(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="drawer-body">
              {/* Metric Cards Grid */}
              <div className="grid-2 drawer-metrics">
                <div className="mini-card">
                  <span className="mini-label">Monthly Sales Velocity</span>
                  <strong className="mini-val text-primary">{selectedStoreDrawer.sales}</strong>
                </div>
                <div className="mini-card">
                  <span className="mini-label">Inventory Level</span>
                  <strong className="mini-val text-success">{selectedStoreDrawer.inventoryLevel}</strong>
                </div>
              </div>

              {/* Weekly Sales Trend Chart */}
              <div className="drawer-section">
                <h3 className="section-title"><TrendingUp size={16} className="text-primary" /> Weekly Sales Trend</h3>
                <div className="drawer-chart-container">
                  <Line data={storeDrawerChart} options={drawerChartOptions} />
                </div>
              </div>

              {/* Inventory Breakdown */}
              <div className="drawer-section">
                <h3 className="section-title"><Boxes size={16} className="text-info" /> Stock Category Allocation</h3>
                <div className="inventory-alloc-list">
                  <div className="alloc-row">
                    <span>Dairy & Fresh Produce</span>
                    <strong>42% (Optimal)</strong>
                  </div>
                  <div className="alloc-row">
                    <span>Packaged & Beverages</span>
                    <strong>35% (Healthy)</strong>
                  </div>
                  <div className="alloc-row">
                    <span>Consumer Electronics</span>
                    <strong className="text-warning">23% (Low Stock Alert)</strong>
                  </div>
                </div>
              </div>

              {/* Promotion History */}
              <div className="drawer-section">
                <h3 className="section-title"><Tag size={16} className="text-warning" /> Active & Past Campaigns</h3>
                <div className="promo-history-list">
                  <div className="promo-item">
                    <span className="badge badge-success">Active</span>
                    <span className="promo-name">Weekend Flash Sale (20% Off Beverages)</span>
                  </div>
                  <div className="promo-item">
                    <span className="badge badge-info">Completed</span>
                    <span className="promo-name">Summer Back-to-School Event</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .store-management-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .store-controls-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px 20px;
        }

        .search-input-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 8px 14px;
        }

        .store-search-field {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-main);
          font-size: 14px;
        }

        .filter-select-box {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 240px;
        }

        .store-id-code {
          background: rgba(79, 70, 229, 0.15);
          color: #818CF8;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
        }

        .region-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
          font-size: 13px;
        }

        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
          margin-top: 16px;
        }

        .pagination-info {
          font-size: 13px;
          color: var(--text-muted);
        }

        .pagination-controls {
          display: flex;
          gap: 6px;
        }

        .store-drawer {
          width: 480px;
          height: 100%;
          border-radius: 0;
          border-left: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          padding: 0;
          animation: slideInRight 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .drawer-header {
          padding: 24px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .drawer-store-name {
          font-size: 20px;
          font-weight: 800;
          margin: 6px 0 2px 0;
        }

        .drawer-store-sub {
          font-size: 12px;
          color: var(--text-muted);
        }

        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .mini-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 12px;
          display: flex;
          flex-direction: column;
        }

        .mini-label {
          font-size: 11px;
          color: var(--text-muted);
        }

        .mini-val {
          font-size: 20px;
          font-weight: 800;
          margin-top: 4px;
        }

        .drawer-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .section-title {
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .drawer-chart-container {
          height: 180px;
          position: relative;
        }

        .inventory-alloc-list, .promo-history-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .alloc-row, .promo-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}
