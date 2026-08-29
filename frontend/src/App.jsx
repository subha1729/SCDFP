import React, { useState } from "react";

import Dashboard from "./pages/Dashboard";
import AIInsights from "./pages/AIInsights";
import Clustering from "./pages/Clustering";
import DemandForecasting from "./pages/DemandForecasting";
import DataInput from "./pages/DataInput";

import Sidebar from "./components/Sidebar";

import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";


/* ============================================================
   PAGE LABELS
============================================================ */

const pageLabels = {
  dashboard: "Dashboard",

  forecasting: "Demand Forecasting",

  clustering: "Store Clustering",

  "ai-insights": "AI Forecast Assistant",

  stores: "Store Management",

  inventory: "Inventory Dashboard",

  orders: "PO Recommendations",

  reports: "Reports",

  notifications: "Notifications",

  upload: "Data Input",
};


/* ============================================================
   MAIN APP
============================================================ */

function App() {

  const [activePage, setActivePage] =
    useState("dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);


  /* ==========================================================
     CURRENT PAGE
  ========================================================== */

  const currentPage =
    pageLabels[activePage] || "Dashboard";


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="app">


      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />


      {/* ======================================================
          MAIN AREA
      ====================================================== */}

      <div className="main">


        {/* ====================================================
            HEADER
        ==================================================== */}

        <header className="header">


          {/* ==================================================
              MOBILE MENU
          ================================================== */}

          <button
            className="mobile-menu"
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
            type="button"
            aria-label="Open menu"
          >
            <Menu size={19} />
          </button>


          {/* ==================================================
              BREADCRUMB
          ================================================== */}

          <div className="breadcrumb">

            <span>
              Workspace
            </span>

            <ChevronDown size={13} />

            <strong>
              {currentPage}
            </strong>

          </div>


          {/* ==================================================
              HEADER ACTIONS
          ================================================== */}

          <div className="header-actions">


            {/* =================================================
                SEARCH
            ================================================= */}

            <button
              className="header-icon"
              type="button"
              aria-label="Search"
            >
              <Search size={17} />
            </button>


            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <button
              className="header-icon notification-button"
              type="button"
              aria-label="Notifications"
            >
              <Bell size={17} />

              <span></span>
            </button>


            {/* =================================================
                USER
            ================================================= */}

            <div className="user-avatar">
              S
            </div>

          </div>

        </header>


        {/* ====================================================
            PAGE CONTENT
        ==================================================== */}

        <main className="page-content">


          {/* ==================================================
              DASHBOARD
          ================================================== */}

          {activePage === "dashboard" && (
            <Dashboard />
          )}


          {/* ==================================================
              DEMAND FORECASTING
          ================================================== */}

          {activePage === "forecasting" && (
            <DemandForecasting />
          )}


          {/* ==================================================
              STORE CLUSTERING
          ================================================== */}

          {activePage === "clustering" && (
            <Clustering />
          )}


          {/* ==================================================
              AI FORECAST ASSISTANT
          ================================================== */}

          {activePage === "ai-insights" && (
            <AIInsights />
          )}


          {/* ==================================================
              DATA INPUT
          ================================================== */}

          {activePage === "upload" && (
            <DataInput />
          )}


          {/* ==================================================
              OTHER PAGES
          ================================================== */}

          {activePage !== "dashboard" &&
           activePage !== "forecasting" &&
           activePage !== "clustering" &&
           activePage !== "ai-insights" &&
           activePage !== "upload" && (

            <PagePlaceholder
              activePage={activePage}
            />

          )}

        </main>

      </div>

    </div>
  );
}


/* ============================================================
   PAGE PLACEHOLDER
============================================================ */

function PagePlaceholder({
  activePage,
}) {


  /* ==========================================================
     PAGE TITLES
  ========================================================== */

  const titles = {

    stores:
      "Store Management",

    inventory:
      "Inventory Dashboard",

    orders:
      "PO Recommendations",

    reports:
      "Reports",

    notifications:
      "Notifications",

  };


  /* ==========================================================
     PAGE DESCRIPTIONS
  ========================================================== */

  const descriptions = {

    stores:
      "Manage and inspect store-level information.",

    inventory:
      "Monitor inventory demand and stock requirements.",

    orders:
      "Generate purchase order recommendations.",

    reports:
      "Review forecasting and supply-chain reports.",

    notifications:
      "View system and forecasting notifications.",

  };


  /* ==========================================================
     RETURN
  ========================================================== */

  return (

    <div className="page-placeholder">


      {/* ====================================================
          PAGE TITLE
      ==================================================== */}

      <div className="page-title">

        <h1>
          {titles[activePage] ||
            "Supply Chain Intelligence"}
        </h1>

        <p>
          {descriptions[activePage] ||
            "Supply chain intelligence and demand forecasting."}
        </p>

      </div>


      {/* ====================================================
          PLACEHOLDER CARD
      ==================================================== */}

      <div className="placeholder-card">


        <div className="placeholder-icon">

          <span>
            AI
          </span>

        </div>


        <h2>
          Module ready
        </h2>


        <p>
          This section will be connected to the
          actual forecasting, clustering,
          inventory, and procurement outputs.
        </p>


      </div>

    </div>

  );
}


/* ============================================================
   EXPORT
============================================================ */

export default App;