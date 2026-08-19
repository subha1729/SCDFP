import React, { useState } from 'react';
import {
  FileText,
  Download,
  FileSpreadsheet,
  Share2,
  BarChart3,
  TrendingUp,
  Boxes,
  Network,
  X,
  Copy,
  Check,
  Calendar,
  Mail,
  UploadCloud,
  RefreshCw
} from 'lucide-react';

import EmailManagerModal from '../components/EmailManagerModal';
import CsvUploaderModal from '../components/CsvUploaderModal';

export default function ReportsView({ onShowToast }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedReportName, setSelectedReportName] = useState('');

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  /* =====================================================
     REPORT DATA
  ===================================================== */

  const reportCards = [
    {
      id: 'sales_report',
      title: 'Sales & Revenue Velocity Report',
      description:
        'Comprehensive store-level sales breakdown, historical growth trajectory, and regional revenue comparison.',
      icon: BarChart3,
      dateRange: 'Q2 - Q3 2026',
      badge: 'Executive Level'
    },
    {
      id: 'forecast_report',
      title: 'AI Forecast Accuracy Audit',
      description:
        'Validation report evaluating XGBoost, LSTM, and Prophet model performance against actual velocity.',
      icon: TrendingUp,
      dateRange: 'Last 30 Days',
      badge: 'ML Diagnostic'
    },
    {
      id: 'inventory_report',
      title: 'Inventory Turnover & Health Report',
      description:
        'Analysis of carrying costs, dead stock risks, safety buffer adequacy, and stockout incident logs.',
      icon: Boxes,
      dateRange: 'Current Quarter',
      badge: 'Supply Chain'
    },
    {
      id: 'cluster_report',
      title: 'Store Cluster & Elasticity Analysis',
      description:
        'Deep dive into store clusters, price elasticity scores, and promotional sensitivity groupings.',
      icon: Network,
      dateRange: 'Annual 2026',
      badge: 'Segment Strategy'
    }
  ];

  /* =====================================================
     REPORT ACTIONS
  ===================================================== */

  const handleDownloadPDF = (title) => {
    if (onShowToast) {
      onShowToast({
        message: `Generating PDF for ${title}... Download starting.`,
        type: 'success'
      });
    }
  };

  const handleExportCSV = (title) => {
    if (onShowToast) {
      onShowToast({
        message: `Exporting raw data table for ${title} as CSV...`,
        type: 'info'
      });
    }
  };

  const handleOpenShare = (title) => {
    setSelectedReportName(title);
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    setCopiedLink(true);

    setTimeout(() => {
      setCopiedLink(false);
    }, 2000);
  };

  /* =====================================================
     DATA ACTIONS
  ===================================================== */

  const handleOpenCsvUpload = () => {
    setIsCsvModalOpen(true);
  };

  const handleSyncData = () => {
    if (onShowToast) {
      onShowToast({
        message: 'Data synchronization started successfully.',
        type: 'success'
      });
    }
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div className="reports-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <header className="reports-header">

        <div className="reports-title-area">

          <div className="reports-title-icon">
            <FileText size={20} />
          </div>

          <div>
            <h1 className="reports-title">
              Reports & Data Hub
            </h1>

            <p className="reports-subtitle">
              Export executive reports, manage datasets, and synchronize
              supply chain data.
            </p>
          </div>

        </div>


        {/* EMAIL BUTTON */}

        <button
          className="btn btn-secondary reports-email-btn"
          onClick={() => setIsEmailModalOpen(true)}
        >
          <Mail size={14} />
          <span>Send Email to Manager</span>
        </button>

      </header>


      {/* =================================================
          DATA INTEGRATION
      ================================================= */}

      <section className="glass-card data-integration-section">

        {/* TITLE */}

        <div className="integration-header">

          <div className="integration-heading">

            <div className="integration-icon">
              <UploadCloud size={17} />
            </div>

            <h2>
              Data Integration
            </h2>

          </div>

        </div>


        {/* DATA TYPES + ACTIONS */}

        <div className="integration-content">

          {/* SALES HISTORY */}

          <div className="integration-item">

            <div className="integration-card-icon sales-icon">
              <TrendingUp size={15} />
            </div>

            <div>
              <h3>
                Sales History
              </h3>

              <span>
                Historical sales data
              </span>
            </div>

          </div>


          {/* INVENTORY STATUS */}

          <div className="integration-item">

            <div className="integration-card-icon inventory-icon">
              <Boxes size={15} />
            </div>

            <div>
              <h3>
                Inventory Status
              </h3>

              <span>
                Current stock data
              </span>
            </div>

          </div>


          {/* BUTTONS */}

          <div className="integration-actions">

            {/* ONLY ONE UPLOAD BUTTON */}

            <button
              className="btn btn-secondary"
              onClick={handleOpenCsvUpload}
            >
              <UploadCloud size={14} />
              <span>Upload CSV</span>
            </button>


            {/* ONLY ONE SYNC BUTTON */}

            <button
              className="btn btn-primary"
              onClick={handleSyncData}
            >
              <RefreshCw size={14} />
              <span>Sync Data</span>
            </button>

          </div>

        </div>

      </section>


      {/* =================================================
          AVAILABLE REPORTS
      ================================================= */}

      <section className="reports-section">

        <div className="reports-section-heading">

          <div>

            <h2>
              Available Reports
            </h2>

            <p>
              Download, export, or securely share generated reports.
            </p>

          </div>

        </div>


        <div className="reports-grid">

          {reportCards.map((report) => {

            const Icon = report.icon;

            return (
              <article
                key={report.id}
                className="glass-card report-card"
              >

                {/* TOP */}

                <div className="report-top">

                  <div className="report-icon">
                    <Icon size={19} />
                  </div>

                  <span className="report-badge">
                    {report.badge}
                  </span>

                </div>


                {/* CONTENT */}

                <div className="report-content">

                  <h3 className="report-title">
                    {report.title}
                  </h3>

                  <p className="report-description">
                    {report.description}
                  </p>

                </div>


                {/* DATE */}

                <div className="report-date-row">

                  <Calendar size={12} />

                  <span>
                    {report.dateRange}
                  </span>

                </div>


                {/* ACTIONS */}

                <div className="report-actions">

                  <button
                    className="btn btn-secondary report-action-btn"
                    onClick={() => handleDownloadPDF(report.title)}
                  >
                    <Download size={13} />
                    <span>Download PDF</span>
                  </button>


                  <button
                    className="btn btn-secondary report-action-btn"
                    onClick={() => handleExportCSV(report.title)}
                  >
                    <FileSpreadsheet size={13} />
                    <span>Export CSV</span>
                  </button>


                  <button
                    className="btn btn-secondary report-share-btn"
                    onClick={() => handleOpenShare(report.title)}
                    title="Share Report"
                  >
                    <Share2 size={13} />
                  </button>

                </div>

              </article>
            );

          })}

        </div>

      </section>


      {/* =================================================
          SHARE MODAL
      ================================================= */}

      {showShareModal && (

        <div
          className="modal-backdrop"
          onClick={() => setShowShareModal(false)}
        >

          <div
            className="modal-card glass-card share-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div>

                <h3 className="modal-title">
                  Share Report
                </h3>

                <p className="modal-subtitle">
                  {selectedReportName}
                </p>

              </div>


              <button
                className="btn-icon btn-secondary"
                onClick={() => setShowShareModal(false)}
              >
                <X size={15} />
              </button>

            </div>


            <div className="modal-body">

              <p className="modal-desc">
                Anyone with this encrypted link can view and
                download this report.
              </p>


              <div className="share-link-box">

                <input
                  type="text"
                  className="input-field share-input"
                  value={`https://nexus-supply.io/reports/share/secure-token-99824?title=${encodeURIComponent(
                    selectedReportName
                  )}`}
                  readOnly
                />


                <button
                  className="btn btn-primary"
                  onClick={handleCopyLink}
                >

                  {copiedLink ? (
                    <Check size={13} />
                  ) : (
                    <Copy size={13} />
                  )}

                  <span>
                    {copiedLink ? 'Copied!' : 'Copy'}
                  </span>

                </button>

              </div>

            </div>

          </div>

        </div>

      )}


      {/* =================================================
          CSV UPLOAD MODAL
      ================================================= */}

      <CsvUploaderModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onUploadSuccess={({ fileName, rowCount, type }) => {

          if (onShowToast) {
            onShowToast({
              message:
                `Successfully processed ${fileName} ` +
                `(${rowCount} rows synced for ${type}).`,
              type: 'success'
            });
          }

        }}
      />


      {/* =================================================
          EMAIL MODAL
      ================================================= */}

      <EmailManagerModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        defaultSubject="Executive Supply Chain & Forecast Digest"
        defaultAttachment="Executive_Digest_Q3.pdf"
        onSendSuccess={({ managerEmail }) => {

          if (onShowToast) {
            onShowToast({
              message:
                `Executive digest emailed to ${managerEmail} successfully!`,
              type: 'success'
            });
          }

        }}
      />


      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`

        /* ==========================================
           PAGE
        ========================================== */

        .reports-page {
          width: 100%;

          display: flex;
          flex-direction: column;

          gap: 23px;

          padding: 2px 0 30px;

          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }


        /* ==========================================
           HEADER
        ========================================== */

        .reports-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;
        }

        .reports-title-area {
          display: flex;
          align-items: flex-start;

          gap: 12px;

          min-width: 0;
        }

        .reports-title-icon {
          width: 42px;
          height: 42px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          color: #A5B4FC;

          background:
            rgba(99, 102, 241, 0.11);

          border:
            1px solid rgba(99, 102, 241, 0.14);
        }

        .reports-title {
          margin: 0;

          color: #F8FAFC;

          font-size: 26px;
          line-height: 1.2;

          font-weight: 750;

          letter-spacing: -0.025em;
        }

        .reports-subtitle {
          margin: 5px 0 0;

          color: #94A3B8;

          font-size: 11.5px;
          line-height: 1.5;
        }

        .reports-email-btn {
          min-height: 36px;

          padding: 0 13px;

          flex-shrink: 0;

          font-family: inherit;

          font-size: 10.5px;
          font-weight: 650;

          white-space: nowrap;
        }


        /* ==========================================
           DATA INTEGRATION
        ========================================== */

        .data-integration-section {
          padding: 15px 18px;
        }

        .integration-header {
          display: flex;
          align-items: center;

          padding-bottom: 12px;

          border-bottom:
            1px solid rgba(148, 163, 184, 0.08);
        }

        .integration-heading {
          display: flex;
          align-items: center;

          gap: 9px;
        }

        .integration-icon {
          width: 32px;
          height: 32px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 7px;

          color: #A5B4FC;

          background:
            rgba(99, 102, 241, 0.10);
        }

        .integration-heading h2 {
          margin: 0;

          color: #F8FAFC;

          font-size: 14px;
          font-weight: 700;
        }


        /* ==========================================
           INTEGRATION CONTENT
        ========================================== */

        .integration-content {
          display: flex;
          align-items: center;

          gap: 12px;

          padding-top: 13px;
        }


        /* ==========================================
           DATA ITEMS
        ========================================== */

        .integration-item {
          flex: 1;

          min-width: 0;

          display: flex;
          align-items: center;

          gap: 9px;

          padding: 10px 12px;

          border-radius: 7px;

          background:
            rgba(255, 255, 255, 0.018);

          border:
            1px solid rgba(148, 163, 184, 0.07);
        }

        .integration-card-icon {
          width: 30px;
          height: 30px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 6px;
        }

        .sales-icon {
          color: #A5B4FC;

          background:
            rgba(99, 102, 241, 0.10);
        }

        .inventory-icon {
          color: #7DD3FC;

          background:
            rgba(56, 189, 248, 0.10);
        }

        .integration-item h3 {
          margin: 0;

          color: #E2E8F0;

          font-size: 10.5px;
          font-weight: 700;
        }

        .integration-item span {
          display: block;

          margin-top: 2px;

          color: #64748B;

          font-size: 8.5px;
        }


        /* ==========================================
           INTEGRATION BUTTONS
        ========================================== */

        .integration-actions {
          display: flex;
          align-items: center;

          gap: 7px;

          flex-shrink: 0;
        }

        .integration-actions .btn {
          height: 34px;

          padding: 0 11px;

          font-family: inherit;

          font-size: 9.5px;

          font-weight: 650;

          white-space: nowrap;
        }


        /* ==========================================
           REPORT SECTION
        ========================================== */

        .reports-section {
          width: 100%;
        }

        .reports-section-heading {
          margin-bottom: 12px;
        }

        .reports-section-heading h2 {
          margin: 0;

          color: #F8FAFC;

          font-size: 16px;
          line-height: 1.3;

          font-weight: 700;
        }

        .reports-section-heading p {
          margin: 4px 0 0;

          color: #64748B;

          font-size: 10px;
          line-height: 1.4;
        }


        /* ==========================================
           REPORT GRID
        ========================================== */

        .reports-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 13px;
        }


        /* ==========================================
           REPORT CARD
        ========================================== */

        .report-card {
          min-width: 0;

          min-height: 250px;

          display: flex;
          flex-direction: column;

          padding: 18px;

          border-radius: 10px;

          background:
            rgba(255, 255, 255, 0.018);

          border:
            1px solid rgba(148, 163, 184, 0.09);

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .report-card:hover {
          background:
            rgba(255, 255, 255, 0.028);

          border-color:
            rgba(148, 163, 184, 0.16);

          transform:
            translateY(-1px);
        }

        .report-top {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 12px;

          margin-bottom: 16px;
        }

        .report-icon {
          width: 38px;
          height: 38px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;

          color: #A5B4FC;

          background:
            rgba(99, 102, 241, 0.10);
        }

        .report-badge {
          display: inline-flex;
          align-items: center;

          min-height: 23px;

          padding: 0 7px;

          border-radius: 5px;

          color: #A5B4FC;

          background:
            rgba(99, 102, 241, 0.09);

          font-size: 8.5px;

          font-weight: 700;

          white-space: nowrap;
        }


        /* ==========================================
           REPORT CONTENT
        ========================================== */

        .report-content {
          flex: 1;

          min-width: 0;
        }

        .report-title {
          margin: 0;

          color: #F8FAFC;

          font-size: 14px;
          line-height: 1.4;

          font-weight: 700;

          letter-spacing: -0.01em;
        }

        .report-description {
          margin: 7px 0 0;

          color: #94A3B8;

          font-size: 10.5px;
          line-height: 1.6;
        }

        .report-date-row {
          display: flex;
          align-items: center;

          gap: 5px;

          margin-top: 16px;

          color: #64748B;

          font-size: 9.5px;

          font-weight: 600;
        }


        /* ==========================================
           REPORT ACTIONS
        ========================================== */

        .report-actions {
          display: flex;
          align-items: center;

          gap: 7px;

          margin-top: 13px;
          padding-top: 13px;

          border-top:
            1px solid rgba(148, 163, 184, 0.08);
        }

        .report-action-btn {
          min-height: 32px;

          flex: 1;

          justify-content: center;

          padding: 0 9px;

          font-family: inherit;

          font-size: 9.5px;

          font-weight: 650;

          white-space: nowrap;
        }

        .report-share-btn {
          width: 32px;
          height: 32px;

          padding: 0;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;
        }


        /* ==========================================
           SHARE MODAL
        ========================================== */

        .share-modal {
          width:
            min(590px, calc(100vw - 32px));

          padding: 21px;
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 20px;

          margin-bottom: 17px;
        }

        .modal-title {
          margin: 0;

          color: #F8FAFC;

          font-size: 16px;
          line-height: 1.35;

          font-weight: 700;
        }

        .modal-subtitle {
          margin: 4px 0 0;

          color: #64748B;

          font-size: 10px;
          line-height: 1.4;
        }

        .modal-desc {
          margin: 0;

          color: #94A3B8;

          font-size: 10.5px;
          line-height: 1.55;
        }

        .share-link-box {
          display: flex;

          gap: 8px;

          margin-top: 14px;
        }

        .share-input {
          min-width: 0;

          flex: 1;

          font-family:
            "JetBrains Mono",
            Consolas,
            monospace;

          font-size: 9px;
        }


        /* ==========================================
           FONT CONSISTENCY
        ========================================== */

        .reports-page button,
        .reports-page input,
        .reports-page select {
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }


        /* ==========================================
           RESPONSIVE
        ========================================== */

        @media (max-width: 950px) {

          .reports-header {
            align-items: flex-start;

            flex-direction: column;
          }

          .reports-email-btn {
            align-self: flex-start;
          }

        }


        @media (max-width: 700px) {

          .integration-content {
            align-items: stretch;

            flex-direction: column;
          }

          .integration-actions {
            width: 100%;
          }

          .integration-actions .btn {
            flex: 1;

            justify-content: center;
          }

          .reports-grid {
            grid-template-columns: 1fr;
          }

        }


        @media (max-width: 500px) {

          .reports-title {
            font-size: 22px;
          }

          .reports-title-icon {
            width: 37px;
            height: 37px;
          }

          .reports-title-area {
            gap: 9px;
          }

          .data-integration-section {
            padding: 14px;
          }

          .integration-content {
            gap: 8px;
          }

          .report-card {
            min-height: auto;

            padding: 16px;
          }

          .report-actions {
            display: grid;

            grid-template-columns: 1fr 1fr;
          }

          .report-share-btn {
            width: 100%;

            grid-column: span 2;
          }

          .share-link-box {
            flex-direction: column;
          }

        }

      `}</style>

    </div>
  );
}