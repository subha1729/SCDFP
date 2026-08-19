import React, { useState } from 'react';
import { UploadCloud, X, FileSpreadsheet, FileText, TrendingUp, Boxes } from 'lucide-react';
import { persistCsvDataToMongoDB } from '../config/backendIntegration';

export default function CsvUploaderModal({ isOpen, onClose, defaultType = 'sales_history', onUploadSuccess }) {
  const [activeTab, setActiveTab] = useState(defaultType); // 'sales_history' | 'inventory_status'
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewRows, setPreviewRows] = useState([]);

  if (!isOpen) return null;

  const isSalesHistory = activeTab === 'sales_history';
  const modalTitle = isSalesHistory ? 'Upload Sales History CSV' : 'Upload Current Inventory Status CSV';
  const modalSubtitle = isSalesHistory
    ? 'Upload historical store sales data (Date, Store_ID, SKU, Sales_Units, Revenue, Promo_Flag) to re-train AI models.'
    : 'Upload live stock inventory data (SKU_ID, Product_Name, Category, Stock_Level, Reorder_Point, Supplier) to sync stock levels.';

  const handleTabChange = (type) => {
    setActiveTab(type);
    setSelectedFile(null);
    setPreviewRows([]);
  };

  const handleFileChange = (file) => {
    if (!file) return;
    setSelectedFile(file);

    // Read and parse CSV file preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      const headers = lines[0]?.split(',') || [];
      const dataRows = lines.slice(1, 6).map(row => row.split(',')); // Preview top 5 rows

      setPreviewRows({ headers, dataRows, totalCount: lines.length - 1 });
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    try {
      const mockParsedData = Array.from({ length: previewRows.totalCount || 10 }, (_, i) => ({ id: i + 1 }));
      const result = await persistCsvDataToMongoDB(activeTab, mockParsedData, selectedFile);

      setIsUploading(false);
      if (onUploadSuccess) {
        onUploadSuccess({
          fileName: selectedFile.name,
          rowCount: result.rowCount || previewRows.totalCount || 10,
          type: activeTab,
          mlResults: result.mlResults
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card glass-card csv-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <div className="icon-box-primary">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h3>Unified CSV Data Ingestion Hub</h3>
              <p className="modal-subtitle-text">Sync enterprise sales history or inventory stock status to MongoDB.</p>
            </div>
          </div>
          <button className="btn-icon btn-secondary" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* CSV Type Tabs (Together in One Place) */}
        <div className="csv-type-tabs">
          <button
            className={`csv-type-tab-btn ${activeTab === 'sales_history' ? 'active' : ''}`}
            onClick={() => handleTabChange('sales_history')}
          >
            <TrendingUp size={14} />
            1. Sales History CSV
          </button>
          <button
            className={`csv-type-tab-btn ${activeTab === 'inventory_status' ? 'active' : ''}`}
            onClick={() => handleTabChange('inventory_status')}
          >
            <Boxes size={14} />
            2. Inventory Status CSV
          </button>
        </div>

        <div className="modal-body">
          <div className="active-type-header">
            <span className="type-badge-pill">
              {isSalesHistory ? 'Sales History Sync' : 'Stock Levels Sync'}
            </span>
            <p className="type-desc">{modalSubtitle}</p>
          </div>

          {/* Drag & Drop Box */}
          <div
            className={`dropzone-box ${isDragOver ? 'drag-over' : ''} ${selectedFile ? 'file-selected' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".csv"
              className="dropzone-input"
              id="unifiedCsvFileInput"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />

            {!selectedFile ? (
              <label htmlFor="unifiedCsvFileInput" className="dropzone-label">
                <UploadCloud size={32} className="text-muted" />
                <span className="drop-title">Drag & drop your {modalTitle.replace('Upload ', '')} here</span>
                <span className="drop-sub">or click to browse from computer (.csv formats supported)</span>
              </label>
            ) : (
              <div className="selected-file-preview">
                <FileText size={24} className="text-primary" />
                <div className="file-info">
                  <span className="file-name">{selectedFile.name}</span>
                  <span className="file-size">{(selectedFile.size / 1024).toFixed(1)} KB &bull; {previewRows.totalCount || 0} Data Rows</span>
                </div>
                <button className="btn btn-secondary btn-icon" onClick={() => setSelectedFile(null)}>
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Sample CSV Structure Hint */}
          {!selectedFile && (
            <div className="csv-format-hint">
              <span className="hint-label">Expected CSV Column Structure:</span>
              <code>
                {isSalesHistory
                  ? "Date, Store_ID, SKU_ID, Sales_Units, Revenue, Promo_Flag"
                  : "SKU_ID, Product_Name, Category, Stock_Level, Reorder_Point, Supplier_Name"}
              </code>
            </div>
          )}

          {/* CSV Header Preview Table if loaded */}
          {selectedFile && previewRows.headers && (
            <div className="preview-table-box">
              <span className="preview-title">CSV Header Preview (First 5 Rows):</span>
              <div className="table-container mini-table">
                <table className="data-table">
                  <thead>
                    <tr>
                      {previewRows.headers.map((h, idx) => (
                        <th key={idx}>{h.trim()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.dataRows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx}>{cell.trim()}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={!selectedFile || isUploading}
            onClick={handleConfirmUpload}
          >
            {isUploading ? 'Uploading & Processing...' : 'Upload & Sync to Database'}
          </button>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(9, 13, 22, 0.75);
          backdrop-filter: blur(4px);
          z-index: 150;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .csv-modal {
          width: 100%;
          max-width: 600px;
          padding: 24px;
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .modal-title-box {
          display: flex;
          gap: 12px;
        }

        .icon-box-primary {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: var(--primary-light);
          color: #818CF8;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-subtitle-text {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 2px;
          line-height: 1.4;
        }

        .csv-type-tabs {
          display: flex;
          gap: 8px;
          background: rgba(15, 23, 42, 0.6);
          padding: 4px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          margin-bottom: 16px;
        }

        .csv-type-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 6px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .csv-type-tab-btn.active {
          background: var(--primary);
          color: white;
        }

        .active-type-header {
          margin-bottom: 14px;
        }

        .type-badge-pill {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #818CF8;
          background: rgba(99, 102, 241, 0.12);
          padding: 3px 8px;
          border-radius: 4px;
          margin-bottom: 4px;
        }

        .type-desc {
          font-size: 12px;
          color: var(--text-muted);
          margin: 0;
        }

        .dropzone-box {
          border: 2px dashed var(--border-color);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          position: relative;
          background: rgba(255, 255, 255, 0.01);
          transition: all var(--transition-fast);
        }

        .dropzone-box.drag-over {
          border-color: var(--primary);
          background: rgba(79, 70, 229, 0.05);
        }

        .dropzone-input {
          display: none;
        }

        .dropzone-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .drop-title {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-main);
        }

        .drop-sub {
          font-size: 11.5px;
          color: var(--text-muted);
        }

        .selected-file-preview {
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
        }

        .file-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .file-name {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-main);
        }

        .file-size {
          font-size: 11.5px;
          color: var(--text-muted);
        }

        .csv-format-hint {
          margin-top: 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 12px;
        }

        .hint-label {
          display: block;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .csv-format-hint code {
          color: #818CF8;
          font-family: monospace;
          font-size: 11px;
        }

        .preview-table-box {
          margin-top: 16px;
        }

        .preview-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 8px;
          display: block;
        }

        .mini-table {
          max-height: 160px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }
      `}</style>
    </div>
  );
}
