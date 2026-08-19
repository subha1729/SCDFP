import React, { useState } from 'react';
import {
  Settings,
  User,
  Moon,
  Sun,
  Bell,
  ShieldCheck,
  Key,
  Save,
  Database,
  Cpu,
  Mail,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';

import { BACKEND_CONFIG } from '../config/backendIntegration';

export default function SettingsView({
  isDarkMode,
  onToggleTheme,
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('database');

  // Profile state
  const [profileName, setProfileName] = useState('Elena Vance');
  const [profileEmail, setProfileEmail] = useState(
    'elena.vance@nexus-supply.io'
  );
  const [profileRole, setProfileRole] = useState(
    'Lead Demand Planner'
  );

  // Backend config inputs state
  const [mongoUri, setMongoUri] = useState(
    BACKEND_CONFIG.MONGODB_URI
  );

  const [mlEndpoint, setMlEndpoint] = useState(
    BACKEND_CONFIG.ML_MODEL_API_URL
  );

  const [emailApiKey, setEmailApiKey] = useState(
    BACKEND_CONFIG.EMAIL_API_KEY
  );

  const [managerEmail, setManagerEmail] = useState(
    BACKEND_CONFIG.DEFAULT_MANAGER_EMAIL
  );

  const [geminiApiKey, setGeminiApiKey] = useState(
    BACKEND_CONFIG.GEMINI_API_KEY || ''
  );

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);

  const [copiedKey, setCopiedKey] = useState('');


  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = (e) => {
    e.preventDefault();

    onShowToast({
      message: 'Configuration & settings saved successfully!',
      type: 'success'
    });
  };


  /* =========================================================
     COPY
  ========================================================= */

  const handleCopy = (text, keyName) => {
    navigator.clipboard.writeText(text);

    setCopiedKey(keyName);

    setTimeout(() => {
      setCopiedKey('');
    }, 2000);
  };


  return (
    <div className="settings-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page-header-row">

        <div className="settings-header-content">

          <h1 className="page-title">

            <Settings className="text-primary" />

            System Settings & Backend Setup

          </h1>

          <p className="page-subtitle">

            Configure MongoDB URI connection, Python ML model
            endpoints, manager email gateway, and profile specs.

          </p>

        </div>


        {/* TOP SAVE BUTTON */}

        <div className="header-save-action">

          <button
            className="btn btn-primary"
            onClick={handleSave}
          >

            <Save size={14} />

            Save Configuration

          </button>

        </div>

      </div>


      {/* =====================================================
          SETTINGS CONTAINER
      ===================================================== */}

      <div className="settings-container glass-card">

        {/* ===================================================
            LEFT SIDEBAR
        =================================================== */}

        <div className="settings-nav">

          <button
            className={`set-tab ${activeTab === 'database' ? 'active' : ''
              }`}
            onClick={() => setActiveTab('database')}
          >

            <Database size={16} />

            <span>Backend & Database Setup</span>

          </button>


          <button
            className={`set-tab ${activeTab === 'profile' ? 'active' : ''
              }`}
            onClick={() => setActiveTab('profile')}
          >

            <User size={16} />

            <span>Profile Information</span>

          </button>


          <button
            className={`set-tab ${activeTab === 'theme' ? 'active' : ''
              }`}
            onClick={() => setActiveTab('theme')}
          >

            {isDarkMode
              ? <Sun size={16} />
              : <Moon size={16} />
            }

            <span>Theme & Appearance</span>

          </button>


          <button
            className={`set-tab ${activeTab === 'notifications' ? 'active' : ''
              }`}
            onClick={() => setActiveTab('notifications')}
          >

            <Bell size={16} />

            <span>Notification Preferences</span>

          </button>


          <button
            className={`set-tab ${activeTab === 'security' ? 'active' : ''
              }`}
            onClick={() => setActiveTab('security')}
          >

            <ShieldCheck size={16} />

            <span>Security & API Keys</span>

          </button>

        </div>


        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="settings-body">


          {/* =================================================
              DATABASE & BACKEND
          ================================================= */}

          {activeTab === 'database' && (

            <form
              onSubmit={handleSave}
              className="backend-form"
            >

              {/* SECTION HEADER */}

              <div className="backend-section-header">

                <div className="backend-section-icon">

                  <Database size={19} />

                </div>


                <div>

                  <h3 className="section-title">
                    Backend & Database Setup
                  </h3>

                  <p className="sub-text">
                    Configure the database, ML inference service,
                    and email gateway.
                  </p>

                </div>

              </div>


              {/* =================================================
                  MONGODB
              ================================================= */}

              <div className="backend-field">

                <div className="backend-field-header">

                  <label className="input-label">

                    <Database
                      size={14}
                      className="text-primary"
                    />

                    <span>
                      MongoDB Connection String
                    </span>

                    <span className="field-code">
                      MONGO_URI
                    </span>

                  </label>


                  <button
                    type="button"
                    className="copy-btn"
                    onClick={() =>
                      handleCopy(mongoUri, 'mongo')
                    }
                  >

                    {copiedKey === 'mongo'
                      ? <Check size={13} />
                      : <Copy size={13} />
                    }

                    {copiedKey === 'mongo'
                      ? 'Copied'
                      : 'Copy'
                    }

                  </button>

                </div>


                <input
                  type="text"
                  className="input-field code-input backend-input"
                  value={mongoUri}
                  onChange={(e) =>
                    setMongoUri(e.target.value)
                  }
                  placeholder="mongodb+srv://user:password@cluster.mongodb.net/supply_chain_db"
                />


                <div className="backend-hint">

                  <span>Database:</span>

                  <code>supply_chain_db</code>

                  <span>Collections:</span>

                  <code>inventory_status</code>

                  <code>sales_history</code>

                  <code>purchase_orders</code>

                </div>

              </div>


              {/* =================================================
                  ML MODEL API
              ================================================= */}

              <div className="backend-field">

                <div className="backend-field-header">

                  <label className="input-label">

                    <Cpu
                      size={14}
                      className="text-info"
                    />

                    <span>
                      Python ML Model API
                    </span>

                    <span className="field-code">
                      ML_MODEL_API_URL
                    </span>

                  </label>


                  <button
                    type="button"
                    className="copy-btn"
                    onClick={() =>
                      handleCopy(mlEndpoint, 'ml')
                    }
                  >

                    {copiedKey === 'ml'
                      ? <Check size={13} />
                      : <Copy size={13} />
                    }

                    {copiedKey === 'ml'
                      ? 'Copied'
                      : 'Copy'
                    }

                  </button>

                </div>


                <input
                  type="text"
                  className="input-field code-input backend-input"
                  value={mlEndpoint}
                  onChange={(e) =>
                    setMlEndpoint(e.target.value)
                  }
                  placeholder="http://localhost:8000/api/v1/forecast/predict"
                />


                <div className="backend-hint">

                  <span>Models:</span>

                  <code>XGBoost</code>

                  <code>LSTM</code>

                  <code>Prophet</code>

                  <span>forecast inference</span>

                </div>

              </div>


              {/* =================================================
                  GEMINI AI API KEY
              ================================================= */}

              <div className="backend-field">

                <div className="backend-field-header">

                  <label className="input-label">

                    <Sparkles
                      size={14}
                      className="text-primary"
                    />

                    <span>
                      Google Gemini AI API Key
                    </span>

                    <span className="field-code">
                      GEMINI_API_KEY
                    </span>

                  </label>

                </div>


                <input
                  type="password"
                  className="input-field code-input backend-input"
                  value={geminiApiKey}
                  onChange={(e) =>
                    setGeminiApiKey(e.target.value)
                  }
                  placeholder="AIzaSy..."
                />


                <div className="backend-hint">

                  <span>Powers Autonomous AI Procurement Assistant reasoning & supplier negotiation</span>

                </div>

              </div>


              {/* =================================================
                  MANAGER EMAIL
              ================================================= */}

              <div className="backend-field">

                <div className="backend-field-header">

                  <label className="input-label">

                    <Mail
                      size={14}
                      className="text-success"
                    />

                    <span>
                      Executive Manager Email
                    </span>

                  </label>

                </div>


                <input
                  type="email"
                  className="input-field backend-input"
                  value={managerEmail}
                  onChange={(e) =>
                    setManagerEmail(e.target.value)
                  }
                  placeholder="manager@company.com"
                />


                <div className="backend-hint">

                  Used for purchase-order and critical
                  inventory alerts.

                </div>

              </div>


              {/* =================================================
                  EMAIL API KEY
              ================================================= */}

              <div className="backend-field">

                <div className="backend-field-header">

                  <label className="input-label">

                    <Key
                      size={14}
                      className="text-warning"
                    />

                    <span>
                      Email Service API Key
                    </span>

                    <span className="field-code">
                      SENDGRID / RESEND / SMTP
                    </span>

                  </label>

                </div>


                <input
                  type="password"
                  className="input-field code-input backend-input"
                  value={emailApiKey}
                  onChange={(e) =>
                    setEmailApiKey(e.target.value)
                  }
                />


                <div className="backend-hint">

                  Used to dispatch purchase orders and
                  inventory stock alerts.

                </div>

              </div>


              {/* =================================================
                  SAVE CONNECTION
              ================================================= */}

              <div className="backend-actions">

                <button
                  type="submit"
                  className="btn btn-primary backend-save-btn"
                >

                  <Save size={14} />

                  Save Connection Settings

                </button>

              </div>

            </form>
          )}


          {/* =================================================
              PROFILE
          ================================================= */}

          {activeTab === 'profile' && (

            <form
              onSubmit={handleSave}
              className="settings-form"
            >

              <h3 className="section-title">
                Profile Information
              </h3>


              <div className="profile-upload-row">

                <div className="big-avatar">
                  EV
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                >
                  Change Avatar
                </button>

              </div>


              <div className="input-group">

                <label className="input-label">
                  Full Name
                </label>

                <input
                  type="text"
                  className="input-field"
                  value={profileName}
                  onChange={(e) =>
                    setProfileName(e.target.value)
                  }
                />

              </div>


              <div className="input-group">

                <label className="input-label">
                  Work Email
                </label>

                <input
                  type="email"
                  className="input-field"
                  value={profileEmail}
                  onChange={(e) =>
                    setProfileEmail(e.target.value)
                  }
                />

              </div>


              <div className="input-group">

                <label className="input-label">
                  Job Title / Role
                </label>

                <input
                  type="text"
                  className="input-field"
                  value={profileRole}
                  onChange={(e) =>
                    setProfileRole(e.target.value)
                  }
                />

              </div>


              <div className="form-action-row">

                <button
                  type="submit"
                  className="btn btn-primary"
                >

                  <Save size={14} />

                  Save Profile

                </button>

              </div>

            </form>
          )}


          {/* =================================================
              THEME
          ================================================= */}

          {activeTab === 'theme' && (

            <div className="settings-form">

              <h3 className="section-title">
                Theme & Appearance
              </h3>


              <div className="theme-toggle-card">

                <div>

                  <strong>
                    Dark Mode Interface
                  </strong>

                  <p className="sub-text">
                    Clean, minimal enterprise dark theme.
                  </p>

                </div>


                <button
                  className="btn btn-secondary"
                  onClick={onToggleTheme}
                >

                  {isDarkMode
                    ? 'Switch to Light Mode'
                    : 'Switch to Dark Mode'
                  }

                </button>

              </div>

            </div>
          )}


          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          {activeTab === 'notifications' && (

            <div className="settings-form">

              <h3 className="section-title">
                Notification Channels
              </h3>


              <div className="toggle-setting-row">

                <div>

                  <strong>
                    Email Critical Stockout Alerts
                  </strong>

                  <p className="sub-text">

                    Send instant emails when SKUs cross
                    critical safety stock thresholds.

                  </p>

                </div>


                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) =>
                    setEmailAlerts(e.target.checked)
                  }
                />

              </div>


              <div className="toggle-setting-row">

                <div>

                  <strong>
                    Slack Webhook Telemetry Integration
                  </strong>

                  <p className="sub-text">

                    Post real-time demand spike alerts to
                    #supply-chain Slack channel.

                  </p>

                </div>


                <input
                  type="checkbox"
                  checked={slackAlerts}
                  onChange={(e) =>
                    setSlackAlerts(e.target.checked)
                  }
                />

              </div>

            </div>
          )}


          {/* =================================================
              SECURITY
          ================================================= */}

          {activeTab === 'security' && (

            <div className="settings-form">

              <h3 className="section-title">
                API Keys & Security
              </h3>


              <div className="input-group">

                <label className="input-label">

                  <Key size={12} />

                  Platform API Access Token

                </label>


                <div className="share-link-box">

                  <input
                    type="password"
                    className="input-field share-input"
                    value="nxs_live_99841283120038841283"
                    readOnly
                  />


                  <button
                    className="btn btn-secondary"
                    type="button"
                  >
                    Regenerate Key
                  </button>

                </div>

              </div>


              <div className="security-status-box">

                <ShieldCheck
                  size={18}
                  className="text-success"
                />

                <div>

                  <strong>
                    Two-Factor Authentication (2FA) Active
                  </strong>

                  <p className="sub-text">
                    Secured via Authenticator App (TOTP).
                  </p>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>


      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* =====================================================
           PAGE
        ===================================================== */

        .settings-page {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .page-header-row {
          width: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
        }


        .settings-header-content {
          min-width: 0;
          flex: 1;
        }


        .header-save-action {
          flex-shrink: 0;
          margin-left: auto;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }


        .header-save-action .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          white-space: nowrap;
        }


        /* =====================================================
           MAIN SETTINGS CARD
        ===================================================== */

        .settings-container {
          display: grid;
          grid-template-columns: 250px minmax(0, 1fr);

          padding: 0;

          overflow: hidden;

          min-height: 540px;
        }


        /* =====================================================
           SIDEBAR
        ===================================================== */

        .settings-nav {
          border-right: 1px solid var(--border-color);

          background:
            rgba(9, 13, 22, 0.4);

          padding: 14px;

          display: flex;
          flex-direction: column;

          gap: 4px;
        }


        .set-tab {
          width: 100%;

          display: flex;
          align-items: center;

          gap: 10px;

          padding: 11px 12px;

          border-radius: 8px;

          background: transparent;

          border: 1px solid transparent;

          color: var(--text-muted);

          font-size: 13px;

          font-weight: 500;

          cursor: pointer;

          transition: all var(--transition-fast);

          text-align: left;
        }


        .set-tab:hover {
          background:
            rgba(255, 255, 255, 0.04);

          color: var(--text-main);
        }


        .set-tab.active {
          background:
            var(--primary-light);

          color: #818CF8;

          border-color:
            rgba(99, 102, 241, 0.25);

          font-weight: 600;
        }


        /* =====================================================
           CONTENT
        ===================================================== */

        .settings-body {
          min-width: 0;
          padding: 30px;
        }


        .settings-form {
          width: 100%;
          max-width: 680px;

          display: flex;
          flex-direction: column;

          gap: 18px;
        }


        /* =====================================================
           BACKEND FORM
        ===================================================== */

        .backend-form {
          width: 100%;
          max-width: 820px;

          display: flex;
          flex-direction: column;

          gap: 0;
        }


        /* =====================================================
           BACKEND HEADER
        ===================================================== */

        .backend-section-header {
          display: flex;
          align-items: center;

          gap: 13px;

          padding-bottom: 20px;

          margin-bottom: 2px;

          border-bottom:
            1px solid
            var(--border-color);
        }


        .backend-section-icon {
          width: 43px;
          height: 43px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          color: #818CF8;

          background:
            rgba(99, 102, 241, 0.10);

          border:
            1px solid
            rgba(99, 102, 241, 0.18);
        }


        .backend-section-header .section-title {
          margin: 0;

          font-size: 17px;

          line-height: 1.3;

          font-weight: 650;

          color: var(--text-main);
        }


        .backend-section-header .sub-text {
          margin: 4px 0 0;
        }


        /* =====================================================
           BACKEND FIELD
        ===================================================== */

        .backend-field {
          padding: 19px 0;

          border-bottom:
            1px solid
            rgba(148, 163, 184, 0.09);
        }


        .backend-field:last-of-type {
          border-bottom: none;
        }


        .backend-field-header {
          width: 100%;

          display: flex;
          align-items: center;

          justify-content: space-between;

          gap: 16px;

          margin-bottom: 8px;
        }


        .backend-field-header .input-label {
          min-width: 0;

          display: flex;
          align-items: center;

          flex-wrap: wrap;

          gap: 7px;

          color: var(--text-main);

          font-size: 12.5px;

          font-weight: 650;

          line-height: 1.4;
        }


        /* =====================================================
           FIELD CODE
        ===================================================== */

        .field-code {
          display: inline-flex;

          align-items: center;

          padding: 3px 6px;

          border-radius: 4px;

          background:
            rgba(148, 163, 184, 0.08);

          color: var(--text-subtle);

          font-family: monospace;

          font-size: 9px;

          font-weight: 600;

          white-space: nowrap;
        }


        /* =====================================================
           BACKEND INPUT
        ===================================================== */

        .backend-input {
          width: 100%;

          height: 42px;

          box-sizing: border-box;

          font-size: 12px;
        }


        .code-input {
          font-family: monospace;

          color: #818CF8;
        }


        /* =====================================================
           COPY
        ===================================================== */

        .copy-btn {
          flex-shrink: 0;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 5px;

          padding: 5px 9px;

          border:
            1px solid
            var(--border-color);

          border-radius: 6px;

          background: transparent;

          color: #818CF8;

          font-family: inherit;

          font-size: 10px;

          font-weight: 600;

          cursor: pointer;

          transition:
            background 0.2s ease,
            border-color 0.2s ease;
        }


        .copy-btn:hover {
          background:
            rgba(99, 102, 241, 0.08);

          border-color:
            rgba(99, 102, 241, 0.30);
        }


        /* =====================================================
           HINT
        ===================================================== */

        .backend-hint {
          min-height: 17px;

          display: flex;

          align-items: center;

          flex-wrap: wrap;

          gap: 5px;

          margin-top: 7px;

          color: var(--text-subtle);

          font-size: 10.5px;

          line-height: 1.45;
        }


        .backend-hint code {
          padding: 2px 5px;

          border-radius: 4px;

          background:
            rgba(148, 163, 184, 0.07);

          color: var(--text-muted);

          font-family: monospace;

          font-size: 9.5px;
        }


        /* =====================================================
           BACKEND SAVE
        ===================================================== */

        .backend-actions {
          width: 100%;

          display: flex;

          align-items: center;

          justify-content: flex-end;

          padding-top: 18px;
        }


        .backend-save-btn {
          min-width: 190px;

          height: 37px;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 7px;
        }


        /* =====================================================
           NORMAL SECTION
        ===================================================== */

        .section-title {
          margin: 0;

          color: var(--text-main);

          font-size: 17px;

          line-height: 1.35;

          font-weight: 650;
        }


        .sub-text {
          margin: 4px 0 0;

          color: var(--text-muted);

          font-size: 12px;

          line-height: 1.5;
        }


        /* =====================================================
           INPUT GROUP
        ===================================================== */

        .input-group {
          width: 100%;

          display: flex;

          flex-direction: column;

          gap: 7px;
        }


        .input-label {
          color: var(--text-main);

          font-size: 12px;

          font-weight: 600;

          line-height: 1.4;
        }


        .flex-label {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 14px;
        }


        .link-btn {
          background: transparent;

          border: none;

          color: #818CF8;

          font-size: 11.5px;

          cursor: pointer;

          display: flex;

          align-items: center;

          gap: 4px;
        }


        .field-hint {
          font-size: 11.5px;

          color: var(--text-subtle);
        }


        .field-hint code {
          color: var(--text-muted);
        }


        /* =====================================================
           FORM ACTION
        ===================================================== */

        .form-action-row {
          width: 100%;

          display: flex;

          align-items: center;

          justify-content: flex-end;
        }


        /* =====================================================
           PROFILE
        ===================================================== */

        .profile-upload-row {
          display: flex;

          align-items: center;

          gap: 16px;
        }


        .big-avatar {
          width: 54px;

          height: 54px;

          border-radius: 12px;

          background: var(--primary);

          color: white;

          font-size: 18px;

          font-weight: 700;

          display: flex;

          align-items: center;

          justify-content: center;
        }


        /* =====================================================
           THEME / NOTIFICATION
        ===================================================== */

        .theme-toggle-card,
        .toggle-setting-row,
        .security-status-box {

          width: 100%;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 18px;

          padding: 14px;

          background:
            rgba(9, 13, 22, 0.6);

          border:
            1px solid
            var(--border-color);

          border-radius: 10px;

          box-sizing: border-box;
        }


        /* =====================================================
           SECURITY
        ===================================================== */

        .share-link-box {
          display: flex;

          gap: 8px;
        }


        .share-input {
          flex: 1;

          min-width: 0;
        }


        .security-status-box {
          justify-content: flex-start;

          gap: 12px;
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 900px) {

          .settings-container {
            grid-template-columns:
              215px minmax(0, 1fr);
          }

        }


        @media (max-width: 768px) {

          .page-header-row {
            align-items: flex-start;

            flex-direction: column;
          }


          .header-save-action {
            width: 100%;

            margin-left: 0;

            justify-content: flex-end;
          }


          .settings-container {
            grid-template-columns: 1fr;
          }


          .settings-nav {
            border-right: none;

            border-bottom:
              1px solid
              var(--border-color);
          }


          .settings-body {
            padding: 22px;
          }

        }


        @media (max-width: 560px) {

          .settings-body {
            padding: 16px;
          }


          .backend-field-header {
            align-items: flex-start;
          }


          .backend-field-header .input-label {
            flex-wrap: wrap;
          }


          .backend-actions {
            justify-content: stretch;
          }


          .backend-save-btn {
            width: 100%;
          }


          .header-save-action {
            justify-content: stretch;
          }


          .header-save-action .btn {
            width: 100%;
          }


          .theme-toggle-card,
          .toggle-setting-row {
            align-items: flex-start;

            flex-direction: column;
          }


          .share-link-box {
            align-items: stretch;

            flex-direction: column;
          }

        }

      `}</style>

    </div>
  );
}