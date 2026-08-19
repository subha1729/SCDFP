import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, User, LogOut, ChevronDown, Sparkles, Shield, Command } from 'lucide-react';

export default function Header({ 
  activeTab: _activeTab, 
  onNavigate, 
  onToggleSearch, 
  onToggleNotifications, 
  unreadNotifsCount = 2, 
  isDarkMode, 
  onToggleTheme,
  onLogout 
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="header-bar">
      <div className="header-left">
        <button className="search-trigger-btn" onClick={onToggleSearch}>
          <Search size={16} className="search-icon" />
          <span className="search-placeholder">Search stores, SKUs, purchase orders, models...</span>
          <kbd className="search-kbd"><Command size={10} /> K</kbd>
        </button>
      </div>

      <div className="header-right">
        {/* Theme Mode Toggle Button */}
        <button 
          className="header-action-btn" 
          onClick={onToggleTheme} 
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={18} className="text-warning" /> : <Moon size={18} />}
        </button>

        {/* Notifications Tray Trigger */}
        <button 
          className="header-action-btn notif-btn" 
          onClick={onToggleNotifications}
          title="Notifications Feed"
        >
          <Bell size={18} />
          {unreadNotifsCount > 0 && (
            <span className="notif-badge">{unreadNotifsCount}</span>
          )}
        </button>

        {/* User Profile Menu */}
        <div className="profile-dropdown-container">
          <button 
            className="profile-btn" 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="avatar">
              <span>EV</span>
            </div>
            <div className="profile-info">
              <span className="profile-name">Elena Vance</span>
              <span className="profile-role">Lead Demand Planner</span>
            </div>
            <ChevronDown size={14} className="profile-arrow" />
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown-menu glass-card">
              <div className="menu-header">
                <p className="menu-user-email">elena.vance@nexus-supply.io</p>
                <span className="badge badge-primary"><Shield size={10} /> Admin</span>
              </div>
              <div className="menu-divider" />
              <button className="menu-item" onClick={() => { onNavigate('settings'); setShowProfileMenu(false); }}>
                <User size={14} /> Profile & Settings
              </button>
              <button className="menu-item" onClick={() => { onNavigate('procurement'); setShowProfileMenu(false); }}>
                <Sparkles size={14} /> AI Copilot Workspace
              </button>
              <div className="menu-divider" />
              <button className="menu-item logout-item" onClick={() => { setShowProfileMenu(false); onLogout(); }}>
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .header-bar {
          height: var(--header-height);
          background: var(--bg-header);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .header-left {
          flex: 1;
          max-width: 540px;
        }

        .search-trigger-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 8px 14px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .search-trigger-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--border-highlight);
          color: var(--text-main);
        }

        .search-placeholder {
          font-size: 13px;
          flex: 1;
          text-align: left;
        }

        .search-kbd {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 11px;
          font-family: monospace;
          display: flex;
          align-items: center;
          gap: 2px;
          color: var(--text-muted);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .header-action-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all var(--transition-fast);
        }

        .header-action-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-main);
          border-color: var(--border-highlight);
        }

        .notif-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--danger);
          color: white;
          font-size: 10px;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-dark);
        }

        .profile-dropdown-container {
          position: relative;
        }

        .profile-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 4px 12px 4px 6px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .profile-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--border-highlight);
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #4F46E5, #818CF8);
          color: white;
          font-weight: 700;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .profile-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.2;
        }

        .profile-role {
          font-size: 11px;
          color: var(--text-muted);
        }

        .profile-arrow {
          color: var(--text-muted);
        }

        .profile-dropdown-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 240px;
          padding: 12px;
          z-index: 50;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        }

        .menu-header {
          padding: 4px 8px 8px 8px;
        }

        .menu-user-email {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 6px;
        }

        .menu-divider {
          height: 1px;
          background: var(--border-color);
          margin: 8px 0;
        }

        .menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 6px;
          background: transparent;
          border: none;
          color: var(--text-main);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: background var(--transition-fast);
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .logout-item {
          color: var(--danger);
        }
        .logout-item:hover {
          background: var(--danger-bg);
        }

        @media (max-width: 768px) {
          .header-bar { padding: 0 16px; }
          .search-placeholder { display: none; }
          .profile-info { display: none; }
          .profile-arrow { display: none; }
        }
      `}</style>
    </header>
  );
}
