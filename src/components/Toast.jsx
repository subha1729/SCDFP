import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle2 size={18} className="text-success" />;
      case 'error': return <AlertCircle size={18} className="text-danger" />;
      default: return <Info size={18} className="text-info" />;
    }
  };

  return (
    <div className="toast-container">
      <div className={`toast-card toast-${toast.type || 'info'} glass-card`}>
        {getIcon()}
        <span className="toast-message">{toast.message}</span>
        <button className="toast-close" onClick={onClose}>
          <X size={14} />
        </button>
      </div>

      <style>{`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 200;
          animation: toastSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes toastSlide {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .toast-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          background: #1E293B;
          border: 1px solid var(--border-highlight);
        }

        .toast-message {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-main);
        }

        .toast-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          margin-left: 8px;
        }
      `}</style>
    </div>
  );
}
