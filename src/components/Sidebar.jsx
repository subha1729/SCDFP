import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Store,
  Boxes,
  Bot,
  Network,
  ShoppingCart,
  FileText,
  Bell,
  Settings,
  LogIn,
  Zap,
  Activity
} from 'lucide-react';

export default function Sidebar({ activeTab, onNavigate }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'OVERVIEW' },
    { id: 'forecasting', label: 'Demand Forecasting', icon: TrendingUp, category: 'ANALYTICS' },
    { id: 'stores', label: 'Store Management', icon: Store },
    { id: 'clusters', label: 'Store Clustering', icon: Network },
    { id: 'inventory', label: 'Inventory Dashboard', icon: Boxes, category: 'OPERATIONS' },
    { id: 'procurement', label: 'Procurement Assistant', icon: Bot, isAi: true },
    { id: 'orders', label: 'Purchase Orders', icon: ShoppingCart },
    { id: 'reports', label: 'Reports', icon: FileText, category: 'INSIGHTS' },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'login', label: 'Auth / Login Page', icon: LogIn, isAuthLink: true }
  ];

  return (
    <aside className="sidebar-container">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo-icon">
          <Zap size={20} className="logo-spark" />
        </div>
        <div className="brand-text">
          <span className="brand-name">NEXUS AI</span>
          <span className="brand-tag">Supply Intelligence</span>
        </div>
      </div>

      {/* Live AI Status Pill */}
      <div className="sidebar-status-box">
        <div className="pulse-dot" />
        <div className="status-meta">
          <span className="status-title">Forecast Engine</span>
          <span className="status-subtitle">XGBoost v4.2 Online</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <React.Fragment key={item.id}>
              {item.category && (
                <div className="nav-category-header">{item.category}</div>
              )}
              <button
                className={`nav-item-btn ${isActive ? 'active' : ''} ${item.isAi ? 'ai-item' : ''} ${item.isAuthLink ? 'auth-item' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <IconComponent size={18} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {item.isAi && <span className="ai-badge">AI</span>}
                {isActive && <div className="active-indicator" />}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Sidebar Footer Info */}
      <div className="sidebar-footer">
        <div className="model-accuracy-card">
          <div className="acc-header">
            <Activity size={14} className="text-success" />
            <span>Avg Model Accuracy</span>
          </div>
          <p className="acc-score">98.1%</p>
          <div className="acc-progress">
            <div className="acc-bar" style={{ width: '98.1%' }} />
          </div>
        </div>
      </div>

      <style>{`
        .sidebar-container {
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--bg-sidebar);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 50;
          padding: 20px 16px;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px 8px 16px 8px;
        }

        .brand-logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4F46E5, #818CF8);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 16px rgba(79, 70, 229, 0.5);
        }

        .logo-spark {
          color: #FFFFFF;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-name {
          font-weight: 800;
          font-size: 16px;
          letter-spacing: -0.02em;
          color: var(--text-main);
          line-height: 1.1;
        }

        .brand-tag {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #818CF8;
        }

        .sidebar-status-box {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .status-meta {
          display: flex;
          flex-direction: column;
        }

        .status-title {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.2;
        }

        .status-subtitle {
          font-size: 10px;
          color: var(--text-muted);
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-right: 4px;
        }

        .nav-category-header {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--text-subtle);
          margin: 14px 8px 4px 8px;
        }

        .nav-item-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          position: relative;
          transition: all var(--transition-fast);
          text-align: left;
        }

        .nav-item-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-main);
        }

        .nav-item-btn.active {
          background: var(--primary-light);
          color: #818CF8;
          border-color: rgba(99, 102, 241, 0.3);
          font-weight: 600;
        }

        .nav-icon {
          color: var(--text-muted);
          transition: color var(--transition-fast);
        }

        .nav-item-btn:hover .nav-icon,
        .nav-item-btn.active .nav-icon {
          color: #818CF8;
        }

        .ai-item {
          background: linear-gradient(90deg, rgba(79, 70, 229, 0.1), rgba(147, 51, 234, 0.1));
          border-color: rgba(147, 51, 234, 0.2);
        }

        .ai-badge {
          margin-left: auto;
          background: linear-gradient(135deg, #4F46E5, #9333EA);
          color: white;
          font-size: 9px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 999px;
        }

        .auth-item {
          margin-top: 10px;
          border-style: dashed;
          border-color: rgba(255, 255, 255, 0.15);
        }

        .active-indicator {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 18px;
          background: #818CF8;
          border-radius: 999px;
          box-shadow: 0 0 8px #818CF8;
        }

        .sidebar-footer {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }

        .model-accuracy-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 12px;
        }

        .acc-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: var(--text-muted);
        }

        .acc-score {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-main);
          margin: 2px 0 6px 0;
        }

        .acc-progress {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          overflow: hidden;
        }

        .acc-bar {
          height: 100%;
          background: var(--success);
          border-radius: 999px;
        }

        @media (max-width: 1024px) {
          .sidebar-container {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}
