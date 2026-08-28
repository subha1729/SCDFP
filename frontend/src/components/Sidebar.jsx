import React from "react";

import {
  LayoutDashboard,
  TrendingUp,
  Network,
  Boxes,
  ShoppingCart,
  FileText,
  Bell,
  Store,
  Upload,
  Zap,
  MessageSquareText,
} from "lucide-react";


const navigation = [
  {
    section: "OVERVIEW",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    section: "ANALYTICS",
    items: [
      {
        id: "forecasting",
        label: "Demand Forecasting",
        icon: TrendingUp,
      },
      {
        id: "clustering",
        label: "Store Clustering",
        icon: Network,
      },
    ],
  },

  {
    section: "AI INSIGHTS",
    items: [
      {
        id: "ai-insights",
        label: "AI Forecast Assistant",
        icon: MessageSquareText,
      },
    ],
  },

  {
    section: "OPERATIONS",
    items: [
      {
        id: "stores",
        label: "Store Management",
        icon: Store,
      },
      {
        id: "inventory",
        label: "Inventory Dashboard",
        icon: Boxes,
      },
      {
        id: "orders",
        label: "PO Recommendations",
        icon: ShoppingCart,
      },
    ],
  },

  {
    section: "INSIGHTS",
    items: [
      {
        id: "reports",
        label: "Reports",
        icon: FileText,
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
      },
    ],
  },
];


export default function Sidebar({
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
}) {

  return (
    <aside
      className={`sidebar ${
        sidebarOpen ? "open" : ""
      }`}
    >

      {/* =====================================================
          BRAND
      ===================================================== */}

      <div className="brand">

        <div className="brand-logo">
          <Zap size={19} />
        </div>

        <div className="brand-text">
          <strong>NEXUS AI</strong>
          <span>Supply Intelligence</span>
        </div>

      </div>


      {/* =====================================================
          FORECAST ENGINE STATUS
      ===================================================== */}

      <div className="engine-status">

        <span className="status-dot"></span>

        <div className="engine-info">

          <strong>
            Forecast Engine
          </strong>

          <span>
            XGBoost · LSTM · Prophet
          </span>

        </div>

        <span className="engine-online">
          ON
        </span>

      </div>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="navigation">

        {navigation.map((group) => (

          <div
            className="navigation-group"
            key={group.section}
          >

            <div className="navigation-title">
              {group.section}
            </div>


            {group.items.map((item) => {

              const Icon = item.icon;

              return (
                <button
                  key={item.id}

                  className={
                    activePage === item.id
                      ? "navigation-item active"
                      : "navigation-item"
                  }

                  onClick={() => {

                    setActivePage(item.id);

                    setSidebarOpen(false);

                  }}
                >

                  <Icon size={17} />

                  <span>
                    {item.label}
                  </span>


                  {item.id === "notifications" && (
                    <span className="notification-count">
                      2
                    </span>
                  )}

                </button>
              );

            })}

          </div>

        ))}

      </nav>


      {/* =====================================================
          NEW ANALYSIS
      ===================================================== */}

      <button
        className="new-analysis-button"

        onClick={() => {

          setActivePage("upload");

          setSidebarOpen(false);

        }}
      >

        <Upload size={16} />

        New Analysis

      </button>

    </aside>
  );
}