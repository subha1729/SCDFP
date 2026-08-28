import React, { useState } from "react";

import Dashboard from "./pages/Dashboard";
import AIInsights from "./pages/AIInsights";
import Clustering from "./pages/Clustering";
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

  forecasting:
    "Demand Forecasting",

  clustering:
    "Store Clustering",

  "ai-insights":
    "AI Forecast Assistant",

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

  upload:
    "Data Input",
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

  const currentPage = {
    label:
      pageLabels[activePage] ||
      "Dashboard",
  };


  return (
    <div className="app">


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />


      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="main">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="header">


          {/* =================================================
              MOBILE MENU
          ================================================= */}

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


          {/* =================================================
              BREADCRUMB
          ================================================= */}

          <div className="breadcrumb">

            <span>
              Workspace
            </span>

            <ChevronDown size={13} />

            <strong>
              {activePage === "upload"
                ? "Data Input"
                : currentPage.label}
            </strong>

          </div>


          {/* =================================================
              HEADER ACTIONS
          ================================================= */}

          <div className="header-actions">


            {/* -----------------------------------------------
                SEARCH
            ------------------------------------------------ */}

            <button
              className="header-icon"
              type="button"
              aria-label="Search"
            >
              <Search size={17} />
            </button>


            {/* -----------------------------------------------
                NOTIFICATION
            ------------------------------------------------ */}

            <button
              className="header-icon notification-button"
              type="button"
              aria-label="Notifications"
            >
              <Bell size={17} />

              <span></span>
            </button>


            {/* -----------------------------------------------
                USER AVATAR
            ------------------------------------------------ */}

            <div className="user-avatar">
              S
            </div>

          </div>

        </header>


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main className="page-content">


          {/* =================================================
              DASHBOARD
          ================================================= */}

          {activePage === "dashboard" && (
            <Dashboard />
          )}


          {/* =================================================
              AI FORECAST ASSISTANT
          ================================================= */}

          {activePage === "ai-insights" && (
            <AIInsights />
          )}


          {/* =================================================
              STORE CLUSTERING
          ================================================= */}

          {activePage === "clustering" && (
            <Clustering />
          )}


          {/* =================================================
              OTHER PAGES
          ================================================= */}

          {activePage !== "dashboard" &&
            activePage !== "ai-insights" &&
            activePage !== "clustering" && (
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
   TEMPORARY PAGE PLACEHOLDER
   ============================================================

   These pages will be implemented separately:

   forecasting
   stores
   inventory
   orders
   reports
   notifications
   upload

   Dashboard, AI Insights and Clustering
   are already connected.

   ============================================================ */

function PagePlaceholder({
  activePage,
}) {


  /* ==========================================================
     PAGE TITLES
     ========================================================== */

  const titles = {

    forecasting:
      "Demand Forecasting",

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

    upload:
      "Data Input",

  };


  /* ==========================================================
     PAGE DESCRIPTIONS
     ========================================================== */

  const descriptions = {

    forecasting:
      "Generate and analyze seven-day demand forecasts.",

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

    upload:
      "Upload the data required for forecasting and analysis.",

  };


  return (

    <div className="page-placeholder">


      {/* =====================================================
          PAGE TITLE
      ===================================================== */}

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


      {/* =====================================================
          PLACEHOLDER CARD
      ===================================================== */}

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


export default App;