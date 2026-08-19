import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { mockNotifications } from '../data/mockData';

export default function NotificationsView({ onNavigate, onShowToast }) {
  const [filterType, setFilterType] = useState('ALL');
  const [notificationsList, setNotificationsList] = useState(mockNotifications);

  const filteredNotifs = notificationsList.filter(n => {
    return filterType === 'ALL' || n.type === filterType;
  });

  const getNotifIcon = (type) => {
    switch (type) {
      case 'alert':
        return (
          <AlertTriangle
            size={18}
            className="text-danger"
          />
        );

      case 'info':
        return (
          <TrendingUp
            size={18}
            className="text-info"
          />
        );

      case 'success':
        return (
          <CheckCircle2
            size={18}
            className="text-success"
          />
        );

      default:
        return (
          <Sparkles
            size={18}
            className="text-primary"
          />
        );
    }
  };

  const handleMarkAllRead = () => {
    setNotificationsList(prev =>
      prev.map(n => ({
        ...n,
        isRead: true
      }))
    );

    onShowToast({
      message: 'All notifications marked as read.',
      type: 'success'
    });
  };

  const handleClearFeed = () => {
    setNotificationsList([]);

    onShowToast({
      message: 'Cleared notification timeline.',
      type: 'info'
    });
  };

  return (
    <div className="notifications-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="page-header-row">

        <div>
          <h1 className="page-title">
            <Bell className="text-primary" />
            Notifications & Alert Center
          </h1>

          <p className="page-subtitle">
            Real-time supply chain alerts, demand spike notifications,
            and PO updates timeline.
          </p>
        </div>


        {/* TOP RIGHT ACTION BUTTONS */}

        <div className="header-actions">

          <button
            className="btn btn-secondary"
            onClick={handleMarkAllRead}
          >
            <CheckCheck size={14} />
            Mark All Read
          </button>


          <button
            className="btn btn-secondary text-danger"
            onClick={handleClearFeed}
          >
            <Trash2 size={14} />
            Clear All
          </button>

        </div>

      </div>


      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <div className="glass-card controls-card">

        <div className="filter-select-box">

          <Filter
            size={14}
            className="text-muted"
          />

          <select
            className="input-field select-field"
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value)
            }
          >

            <option value="ALL">
              All Alert Types
            </option>

            <option value="alert">
              Low Inventory Alerts (Red)
            </option>

            <option value="info">
              Demand Spikes (Blue)
            </option>

            <option value="success">
              PO & Promotion Updates (Green)
            </option>

          </select>

        </div>


        <span className="notif-count-text">
          Showing {filteredNotifs.length} notifications
        </span>

      </div>


      {/* =====================================================
          NOTIFICATIONS TIMELINE
      ===================================================== */}

      <div className="glass-card timeline-feed-card">

        {filteredNotifs.length > 0 ? (

          <div className="notifications-timeline">

            {filteredNotifs.map((notif) => (

              <div
                key={notif.id}
                className={`timeline-item ${!notif.isRead ? 'unread' : ''
                  }`}
              >

                {/* TIMELINE ICON */}

                <div className="timeline-icon-box">
                  {getNotifIcon(notif.type)}
                </div>


                {/* NOTIFICATION CONTENT */}

                <div className="timeline-content">

                  <div className="timeline-top">

                    <span className="timeline-title">
                      {notif.title}
                    </span>

                    <span className="timeline-time">
                      {notif.time}
                    </span>

                  </div>


                  <p className="timeline-msg">
                    {notif.message}
                  </p>


                  <button
                    className="timeline-action-btn"
                    onClick={() => {

                      if (notif.type === 'alert') {
                        onNavigate('inventory');
                      }

                      else if (
                        notif.title.includes('Order')
                      ) {
                        onNavigate('orders');
                      }

                      else {
                        onNavigate('forecasting');
                      }

                    }}
                  >
                    Take Action
                    <ArrowRight size={12} />
                  </button>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="empty-notif-state">

            <CheckCircle2
              size={32}
              className="text-success"
            />

            <h3>
              All caught up!
            </h3>

            <p>
              No active alerts in your notification queue.
            </p>

          </div>

        )}

      </div>


      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* ===================================================
           MAIN PAGE
        =================================================== */

        .notifications-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }


        /* ===================================================
           HEADER
        =================================================== */

        .page-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          width: 100%;
          gap: 20px;
        }


        .page-header-row > div:first-child {
          flex: 1;
          min-width: 0;
        }


        /* ===================================================
           HEADER ACTIONS
        =================================================== */

        .header-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-left: auto;
          flex-shrink: 0;
          white-space: nowrap;
        }


        /* ===================================================
           FILTER COUNT
        =================================================== */

        .notif-count-text {
          font-size: 13px;
          color: var(--text-muted);
        }


        /* ===================================================
           TIMELINE CARD
        =================================================== */

        .timeline-feed-card {
          padding: 24px;
        }


        .notifications-timeline {
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
        }


        /* TIMELINE VERTICAL LINE */

        .notifications-timeline::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 20px;
          width: 2px;
          background: rgba(255, 255, 255, 0.08);
        }


        /* ===================================================
           TIMELINE ITEM
        =================================================== */

        .timeline-item {
          display: flex;
          gap: 16px;
          position: relative;
          z-index: 2;
        }


        /* ===================================================
           ICON
        =================================================== */

        .timeline-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #1E293B;
          border: 2px solid var(--border-color);

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;
        }


        .timeline-item.unread .timeline-icon-box {
          border-color: #818CF8;
          box-shadow:
            0 0 12px rgba(79, 70, 229, 0.4);
        }


        /* ===================================================
           CONTENT CARD
        =================================================== */

        .timeline-content {
          flex: 1;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 16px;
        }


        .timeline-item.unread .timeline-content {
          background: rgba(79, 70, 229, 0.08);
          border-color: rgba(99, 102, 241, 0.3);
        }


        /* ===================================================
           TITLE + TIME
        =================================================== */

        .timeline-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 6px;
        }


        .timeline-title {
          font-size: 15px;
          font-weight: 700;
          line-height: 1.4;
        }


        .timeline-time {
          font-size: 12px;
          color: var(--text-muted);
          white-space: nowrap;
          flex-shrink: 0;
        }


        /* ===================================================
           MESSAGE
        =================================================== */

        .timeline-msg {
          font-size: 13.5px;
          color: var(--text-muted);
          margin-bottom: 12px;
          line-height: 1.5;
        }


        /* ===================================================
           ACTION BUTTON
        =================================================== */

        .timeline-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;

          background: transparent;
          border: none;

          color: #818CF8;
          font-size: 13px;
          font-weight: 600;

          cursor: pointer;
          padding: 0;
        }


        .timeline-action-btn:hover {
          text-decoration: underline;
        }


        /* ===================================================
           EMPTY STATE
        =================================================== */

        .empty-notif-state {
          padding: 60px;
          text-align: center;

          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }


        .empty-notif-state h3 {
          margin: 0;
        }


        .empty-notif-state p {
          margin: 0;
          color: var(--text-muted);
          font-size: 13px;
        }


        /* ===================================================
           RESPONSIVE
        =================================================== */

        @media (max-width: 700px) {

          .page-header-row {
            flex-direction: column;
            align-items: stretch;
          }


          .header-actions {
            width: 100%;
            justify-content: flex-end;
            margin-left: 0;
          }

        }


        @media (max-width: 480px) {

          .header-actions {
            flex-wrap: wrap;
          }


          .timeline-top {
            align-items: flex-start;
            flex-direction: column;
            gap: 4px;
          }

        }

      `}</style>

    </div>
  );
}