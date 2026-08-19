import React, { useState } from 'react';
import { Mail, X, Send, Paperclip } from 'lucide-react';
import { sendEmailToManagerBackend, BACKEND_CONFIG } from '../config/backendIntegration';

export default function EmailManagerModal({ isOpen, onClose, defaultSubject = 'Supply Chain Forecast & PO Update', defaultAttachment = 'Forecast_Report_Q3.pdf', onSendSuccess }) {
  const [managerEmail, setManagerEmail] = useState(BACKEND_CONFIG.DEFAULT_MANAGER_EMAIL);
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState('Hi Manager,\n\nPlease find attached the latest AI Demand Forecast report and recommended Purchase Orders for approval.\n\nBest regards,\nElena Vance');
  const [attachment, setAttachment] = useState(defaultAttachment);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setIsSending(true);

    /* =========================================================================
       [BACKEND EMAIL SERVICE CALL]
       Calls the backend API endpoint to trigger SMTP / SendGrid / Resend manager email.
       ========================================================================= */
    const emailPayload = {
      managerEmail,
      subject,
      message,
      attachment,
      sentAt: new Date().toISOString()
    };

    try {
      await sendEmailToManagerBackend(emailPayload);
      setIsSending(false);
      onSendSuccess({ managerEmail, subject });
      onClose();
    } catch (err) {
      console.error("Failed to send email to manager:", err);
      setIsSending(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card glass-card email-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-box">
            <div className="icon-box-primary">
              <Mail size={18} />
            </div>
            <div>
              <h3>Send Report to Manager</h3>
              <p className="modal-subtitle-text">Email forecasting audits, stock alerts, or PO requests to executive management.</p>
            </div>
          </div>
          <button className="btn-icon btn-secondary" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSendEmail} className="modal-body email-form">
          <div className="input-group">
            <label className="input-label">Manager Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              value={managerEmail}
              onChange={(e) => setManagerEmail(e.target.value)}
              placeholder="manager@company.com"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email Subject</label>
            <input 
              type="text" 
              className="input-field" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Attachment Document</label>
            <div className="attachment-select-box">
              <Paperclip size={14} className="text-muted" />
              <select 
                className="input-field select-field attachment-select"
                value={attachment}
                onChange={(e) => setAttachment(e.target.value)}
              >
                <option value="Forecast_Report_Q3.pdf">Forecast_Report_Q3.pdf (Full Audit)</option>
                <option value="Current_Inventory_Status.csv">Current_Inventory_Status.csv (Raw Stock)</option>
                <option value="Purchase_Order_PO-2026-982.pdf">Purchase_Order_PO-2026-982.pdf</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Message Body</label>
            <textarea 
              className="input-field message-textarea"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSending}>
              <Send size={14} /> {isSending ? 'Sending Email...' : 'Send Email to Manager'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .email-modal {
          width: 100%;
          max-width: 520px;
          padding: 24px;
        }

        .email-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .attachment-select-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(9, 13, 22, 0.8);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 0 10px;
        }

        .attachment-select {
          border: none;
          background: transparent;
          width: 100%;
          padding: 9px 0;
        }

        .message-textarea {
          resize: vertical;
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}
