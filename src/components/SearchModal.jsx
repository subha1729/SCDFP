import React, { useState } from 'react';
import { Search, X, Store, Boxes, TrendingUp, FileText, ArrowRight } from 'lucide-react';

export default function SearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const quickLinks = [
    { label: 'View XGBoost 30-Day Demand Forecast', category: 'Forecasting', target: 'forecasting', icon: TrendingUp },
    { label: 'Metro Flagship Hub Analytics', category: 'Stores', target: 'stores', icon: Store },
    { label: 'Organic Whole Milk 1L Inventory Status', category: 'Inventory', target: 'inventory', icon: Boxes },
    { label: 'AI Purchase Order Recommendations', category: 'Procurement AI', target: 'procurement', icon: FileText }
  ];

  const filteredLinks = query.trim() === '' 
    ? quickLinks 
    : quickLinks.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal-card glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-header">
          <Search size={20} className="text-muted" />
          <input 
            type="text" 
            placeholder="Type to search SKUs, stores, forecast models, POs..."
            className="search-modal-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button className="btn-icon btn-secondary" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="search-results-list">
          <div className="search-group-title">QUICK SUGGESTIONS & SHORTCUTS</div>
          {filteredLinks.length > 0 ? (
            filteredLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <button 
                  key={idx} 
                  className="search-item-btn" 
                  onClick={() => { onNavigate(link.target); onClose(); }}
                >
                  <div className="item-icon-box">
                    <Icon size={16} />
                  </div>
                  <div className="item-meta">
                    <span className="item-title">{link.label}</span>
                    <span className="item-badge">{link.category}</span>
                  </div>
                  <ArrowRight size={14} className="item-arrow" />
                </button>
              );
            })
          ) : (
            <div className="search-empty-state">
              <p className="empty-text">No matches found for "{query}"</p>
              <span className="empty-sub">Try searching for "Milk", "Metro Hub", "XGBoost", or "PO-2026"</span>
            </div>
          )}
        </div>

        <div className="search-footer">
          <span>Press <strong>ESC</strong> to exit</span>
          <span>Press <strong>ENTER</strong> to select</span>
        </div>
      </div>

      <style>{`
        .search-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 100px;
        }

        .search-modal-card {
          width: 100%;
          max-width: 640px;
          padding: 0;
          border-color: var(--border-highlight);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
        }

        .search-input-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .search-modal-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-main);
          font-size: 16px;
          font-family: inherit;
        }

        .search-results-list {
          padding: 16px;
          max-height: 380px;
          overflow-y: auto;
        }

        .search-group-title {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-subtle);
          margin-bottom: 10px;
        }

        .search-item-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 10px;
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-main);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
        }

        .search-item-btn:hover {
          background: rgba(79, 70, 229, 0.15);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .item-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #818CF8;
        }

        .item-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .item-title {
          font-size: 14px;
          font-weight: 500;
        }

        .item-badge {
          font-size: 11px;
          color: var(--text-muted);
        }

        .item-arrow {
          color: var(--text-muted);
        }

        .search-empty-state {
          padding: 32px 16px;
          text-align: center;
        }

        .empty-text {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-main);
        }

        .empty-sub {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 4px;
          display: block;
        }

        .search-footer {
          padding: 12px 20px;
          border-top: 1px solid var(--border-color);
          background: rgba(15, 23, 42, 0.8);
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
