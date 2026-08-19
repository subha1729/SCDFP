import React, { useState, useEffect, Component } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SearchModal from './components/SearchModal';
import NotificationDrawer from './components/NotificationDrawer';
import Toast from './components/Toast';

import LoginPage from './pages/LoginPage';
import DashboardView from './pages/DashboardView';
import DemandForecastingView from './pages/DemandForecastingView';
import StoreManagementView from './pages/StoreManagementView';
import StoreClusteringView from './pages/StoreClusteringView';
import InventoryDashboardView from './pages/InventoryDashboardView';
import ProcurementAssistantView from './pages/ProcurementAssistantView';
import PurchaseOrdersView from './pages/PurchaseOrdersView';
import ReportsView from './pages/ReportsView';
import NotificationsView from './pages/NotificationsView';
import SettingsView from './pages/SettingsView';

// Error Boundary Component to prevent blank screens
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Platform Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', color: '#F8FAFC', background: '#090D16', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>System Telemetry Alert</h2>
          <p style={{ color: '#94A3B8', maxWidth: 480, marginBottom: 20 }}>
            An unexpected error occurred while rendering the dashboard.
          </p>
          <pre style={{ background: '#131C2E', padding: 16, borderRadius: 8, color: '#EF4444', fontSize: 12, textAlign: 'left', marginBottom: 20 }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            style={{ background: '#4F46E5', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
          >
            Reload Dashboard Workspace
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Global Keyboard Shortcut: Cmd/Ctrl + K for Search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync Theme Mode Class to Body
  useEffect(() => {
    if (!isDarkMode) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [isDarkMode]);

  const showToast = (toastConfig) => {
    setToast(toastConfig);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Page Content View
  const renderPageView = () => {
    switch (activeTab) {
      case 'login':
        return <LoginPage onLoginSuccess={() => handleNavigate('dashboard')} />;
      case 'dashboard':
        return <DashboardView onNavigate={handleNavigate} onShowToast={showToast} />;
      case 'forecasting':
        return <DemandForecastingView onShowToast={showToast} />;
      case 'stores':
        return <StoreManagementView />;
      case 'clusters':
        return <StoreClusteringView />;
      case 'inventory':
        return <InventoryDashboardView onNavigate={handleNavigate} onShowToast={showToast} />;
      case 'procurement':
        return <ProcurementAssistantView onNavigate={handleNavigate} onShowToast={showToast} />;
      case 'orders':
        return <PurchaseOrdersView onShowToast={showToast} />;
      case 'reports':
        return <ReportsView onShowToast={showToast} />;
      case 'notifications':
        return <NotificationsView onNavigate={handleNavigate} onShowToast={showToast} />;
      case 'settings':
        return <SettingsView isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} onShowToast={showToast} />;
      default:
        return <DashboardView onNavigate={handleNavigate} onShowToast={showToast} />;
    }
  };

  // If viewing standalone Login Page
  if (activeTab === 'login') {
    return (
      <ErrorBoundary>
        <LoginPage onLoginSuccess={() => handleNavigate('dashboard')} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="app-container">
        {/* Sticky Left Sidebar */}
        <Sidebar activeTab={activeTab} onNavigate={handleNavigate} />

        {/* Main Content Body */}
        <div className="main-content">
          <Header 
            activeTab={activeTab}
            onNavigate={handleNavigate}
            onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
            onToggleNotifications={() => setIsNotifsOpen(!isNotifsOpen)}
            unreadNotifsCount={2}
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode(!isDarkMode)}
            onLogout={() => handleNavigate('login')}
          />

          <main className="page-body">
            {renderPageView()}
          </main>
        </div>

        {/* Global Modals & Drawers */}
        <SearchModal 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
          onNavigate={handleNavigate} 
        />

        <NotificationDrawer 
          isOpen={isNotifsOpen} 
          onClose={() => setIsNotifsOpen(false)} 
          onNavigate={handleNavigate} 
        />

        {/* Toast Notification Container */}
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </ErrorBoundary>
  );
}
