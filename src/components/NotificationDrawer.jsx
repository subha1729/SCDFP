import React from 'react';
import { X, CheckCheck, Trash2, AlertTriangle, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { mockNotifications } from '../data/mockData';

export default function NotificationDrawer({ isOpen, onClose, onNavigate }) {
  if (!isOpen) return null;

  const getNotifIcon = (type) => {
    switch(type) {
      case 'alert': return <AlertTriangle size={16} className="text-danger" />;
      case 'info': return <TrendingUp size={16} className="text-info" />;
      case 'success': return <CheckCircle2 size={16} className="text-success" />;
      default: return <Sparkles size={16} className="text-primary" />;
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-card glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-box">
            <h3>Notifications & Alerts</h3>
            <span className="badge badge-primary">{mockNotifications.length} Total</span>
          </div>
          <button className="btn-icon btn-secondary" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-toolbar">
          <button className="btn-text">
            <CheckCheck size={14} /> Mark all read
          </button>
          <button className="btn-text text-muted">
            <Trash2 size={14} /> Clear feed
          </button>
        </div>

        <div className="drawer-content">
          {mockNotifications.map((notif) => (
            <div key={notif.id} className={`notif-card ${!notif.isRead ? 'unread' : ''}`}>
              <div className="notif-icon-col">
                {getNotifIcon(notif.type)}
              </div>
              <div className="notif-body">
                <div className="notif-top">
                  <span className="notif-title">{notif.title}</span>
                  <span className="notif-time">{notif.time}</span>
                </div>
                <p className="notif-msg">{notif.message}</p>
                <button 
                  className="notif-action-link"
                  onClick={() => {
                    if (notif.type === 'alert') onNavigate('inventory');
                    else if (notif.title.includes('Order')) onNavigate('orders');
                    else onNavigate('forecasting');
                    onClose();
                  }}
                >
                  View Details &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="drawer-footer">
          <button className="btn btn-secondary full-width" onClick={() => { onNavigate('notifications'); onClose(); }}>
            Open Notifications Center
          </button>
        </div>
      </div>

      <style>{`
        .drawer-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 90;
          display: flex;
          justify-content: flex-end;
        }

        .drawer-card {
          width: 420px;
          height: 100%;
          border-radius: 0;
          border-left: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          padding: 0;
          animation: slideInRight 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .drawer-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .drawer-title-box {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .drawer-title-box h3 {
          font-size: 18px;
          font-weight: 700;
        }

        .drawer-toolbar {
          padding: 10px 24px;
          background: rgba(15, 23, 42, 0.4);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
        }

        .btn-text {
          background: transparent;
          border: none;
          color: #818CF8;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .drawer-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .notif-card {
          display: flex;
          gap: 12px;
          padding: 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          transition: background var(--transition-fast);
        }

        .notif-card.unread {
          background: rgba(79, 70, 229, 0.08);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .notif-icon-col {
          padding-top: 2px;
        }

        .notif-body {
          flex: 1;
        }

        .notif-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .notif-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-main);
        }

        .notif-time {
          font-size: 11px;
          color: var(--text-muted);
        }

        .notif-msg {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .notif-action-link {
          background: transparent;
          border: none;
          color: #818CF8;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }

        .drawer-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--border-color);
        }

        .full-width {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
