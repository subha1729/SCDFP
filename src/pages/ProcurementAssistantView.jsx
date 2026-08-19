import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  ShoppingCart,
  User,
  CheckCircle2
} from 'lucide-react';

import { mockProcurementItems } from '../data/mockData';
import { sendGeminiChatPrompt } from '../config/backendIntegration';

export default function ProcurementAssistantView({
  onNavigate: _onNavigate,
  onShowToast
}) {
  const [selectedSKU, setSelectedSKU] = useState(mockProcurementItems[0]);

  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I've analyzed stock levels across all distribution centers. Critical shortage detected for ${mockProcurementItems[0].name}. Current stock: ${mockProcurementItems[0].currentStock} units, 30-day predicted demand: ${mockProcurementItems[0].forecast30Days} units. Recommended order: ${mockProcurementItems[0].recommendedOrder} units before ${mockProcurementItems[0].deadline}.`,
      time: '10:42 AM'
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [poStatus, setPoStatus] = useState(null);

  /* =========================================================
     SELECT SKU
  ========================================================= */

  const handleSelectSKU = (sku) => {
    setSelectedSKU(sku);
    setPoStatus(null);

    setChatMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: `Switched SKU focus to ${sku.name} (${sku.sku}). Current stock: ${sku.currentStock}, 30-day forecast: ${sku.forecast30Days}, recommended order: ${sku.recommendedOrder} units.`,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    ]);
  };

  /* =========================================================
     SEND CHAT
  ========================================================= */

  const handleSendChat = async (e) => {
    e.preventDefault();

    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages(prev => [
      ...prev,
      {
        sender: 'user',
        text: userText,
        time: nowTime
      }
    ]);

    setInputMsg('');

    try {
      const response = await sendGeminiChatPrompt(userText, {
        skuName: selectedSKU.name,
        skuCode: selectedSKU.sku,
        currentStock: selectedSKU.currentStock,
        forecast30Days: selectedSKU.forecast30Days,
        recommendedOrder: selectedSKU.recommendedOrder,
        supplier: selectedSKU.supplier,
        deadline: selectedSKU.deadline,
        unitCost: selectedSKU.unitCost
      });

      const replyText = response.reply || `I've updated the replenishment order calculation for ${selectedSKU.name}.`;

      if (
        userText.toLowerCase().includes('approve') ||
        userText.toLowerCase().includes('order')
      ) {
        setPoStatus('generated');
      }

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: replyText,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      ]);
    } catch {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Replenishment recommendation: Order ${selectedSKU.recommendedOrder} units of ${selectedSKU.name} before ${selectedSKU.deadline}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  /* =========================================================
     GENERATE PO
  ========================================================= */

  const handleGeneratePO = async () => {
    setPoStatus('generated');

    try {
      await createPurchaseOrder({
        id: 'PO-2026-982',
        supplier: selectedSKU.supplier,
        itemsCount: 1,
        totalAmount: `$${(selectedSKU.recommendedOrder * parseFloat(selectedSKU.unitCost.replace('$', ''))).toFixed(2)}`,
        status: 'Pending',
        priority: 'High',
        items: [{
          sku: selectedSKU.sku,
          name: selectedSKU.name,
          quantity: selectedSKU.recommendedOrder,
          unitCost: selectedSKU.unitCost,
          total: `$${(selectedSKU.recommendedOrder * parseFloat(selectedSKU.unitCost.replace('$', ''))).toFixed(2)}`
        }]
      });
    } catch (e) {
      console.warn("PO creation notice:", e);
    }

    if (onShowToast) {
      onShowToast({
        message: `Generated Purchase Order PO-2026-982 for ${selectedSKU.recommendedOrder} units of ${selectedSKU.name}`,
        type: 'success'
      });
    }

    setChatMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: `Purchase Order PO-2026-982 has been generated for ${selectedSKU.recommendedOrder} units of ${selectedSKU.name}. The order is ready for approval.`,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    ]);
  };

  /* =========================================================
     APPROVE PO
  ========================================================= */

  const handleApproveOrder = async () => {
    setPoStatus('approved');

    try {
      await updatePurchaseOrderStatus('PO-2026-982', 'Approved');
    } catch (e) {
      console.warn("PO approval notice:", e);
    }

    if (onShowToast) {
      onShowToast({
        message: `Purchase Order PO-2026-982 approved and sent to ${selectedSKU.supplier}.`,
        type: 'success'
      });
    }

    setChatMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: `Purchase Order PO-2026-982 has been approved and dispatched to ${selectedSKU.supplier}.`,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    ]);
  };

  return (
    <div className="procurement-assistant-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="page-header-row">

        <div>
          <h1 className="page-title">
            <Bot className="text-primary" />
            Autonomous AI Procurement Assistant
          </h1>

          <p className="page-subtitle">
            Conversational agent for automated purchase order
            generation and supplier replenishment.
          </p>
        </div>

      </div>


      {/* =====================================================
          MAIN WORKSPACE
      ===================================================== */}

      <div className="procurement-workspace-grid">

        {/* ===================================================
            LEFT — CRITICAL SKU PANEL
        =================================================== */}

        <div className="glass-card left-sku-panel">

          {/* LEFT HEADER */}

          <div className="left-panel-header">

            <div>
              <h3 className="left-panel-title">
                Critical Shortage SKUs
              </h3>

              <span className="left-panel-subtitle">
                Items requiring replenishment
              </span>
            </div>

            <span className="badge badge-danger">
              {mockProcurementItems.length} Action Required
            </span>

          </div>


          {/* SKU LIST */}

          <div className="sku-selector-list">

            {mockProcurementItems.map((item) => (

              <div
                key={item.sku}
                className={`sku-select-card ${selectedSKU.sku === item.sku
                    ? 'selected'
                    : ''
                  }`}
                onClick={() => handleSelectSKU(item)}
              >

                {/* SKU TOP */}

                <div className="sku-top">

                  <span className="sku-code">
                    {item.sku}
                  </span>

                  <span className="badge badge-warning">
                    Before {item.deadline}
                  </span>

                </div>


                {/* PRODUCT */}

                <h4 className="sku-name">
                  {item.name}
                </h4>


                {/* METRICS */}

                <div className="sku-meta-grid">

                  <div>
                    <span className="meta-lbl">
                      Current Stock
                    </span>

                    <strong className="meta-val text-danger">
                      {item.currentStock}
                    </strong>
                  </div>


                  <div>
                    <span className="meta-lbl">
                      30-Day Forecast
                    </span>

                    <strong className="meta-val text-primary">
                      {item.forecast30Days}
                    </strong>
                  </div>


                  <div>
                    <span className="meta-lbl">
                      AI Recommendation
                    </span>

                    <strong className="meta-val text-success">
                      +{item.recommendedOrder}
                    </strong>
                  </div>


                  <div>
                    <span className="meta-lbl">
                      Unit Cost
                    </span>

                    <strong className="meta-val">
                      {item.unitCost}
                    </strong>
                  </div>

                </div>


                {/* SELECTED SKU ACTION */}

                {selectedSKU.sku === item.sku && (

                  <div className="sku-action-area">

                    {poStatus === 'approved' ? (

                      <div className="approved-state">

                        <CheckCircle2 size={15} />

                        <span>
                          PO Approved & Dispatched
                        </span>

                      </div>

                    ) : poStatus === 'generated' ? (

                      <button
                        className="btn btn-primary sku-action-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproveOrder();
                        }}
                      >

                        <CheckCircle2 size={14} />

                        Approve Order

                      </button>

                    ) : (

                      <button
                        className="btn btn-primary sku-action-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGeneratePO();
                        }}
                      >

                        <ShoppingCart size={14} />

                        Generate Purchase Order

                      </button>

                    )}

                  </div>

                )}

              </div>

            ))}

          </div>

        </div>


        {/* ===================================================
            RIGHT — NEXUS COPILOT
        =================================================== */}

        <div className="glass-card right-chat-panel">

          {/* =================================================
              CHAT HEADER

              NO RECOMMENDATION BANNER HERE
          ================================================= */}

          <div className="chat-header">

            <div className="chat-bot-status">

              <div className="bot-avatar-box">
                <Sparkles size={19} />
              </div>


              <div className="bot-info">

                <h3 className="bot-title">
                  Nexus Copilot
                </h3>

                <span className="bot-status-text">

                  <span className="status-dot">
                    ●
                  </span>

                  Ready • Supplier API Connected

                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              CHAT MESSAGES
          ================================================= */}

          <div className="chat-messages-container">

            {chatMessages.map((msg, index) => (

              <div
                key={index}
                className={`chat-bubble-row ${msg.sender === 'user'
                    ? 'user-row'
                    : 'ai-row'
                  }`}
              >

                {/* AVATAR */}

                {msg.sender === 'ai' ? (

                  <div className="msg-avatar ai-avatar">
                    <Bot size={14} />
                  </div>

                ) : (

                  <div className="msg-avatar user-avatar">
                    <User size={14} />
                  </div>

                )}


                {/* MESSAGE */}

                <div className="message-wrapper">

                  <span className="message-sender">

                    {msg.sender === 'ai'
                      ? 'Nexus Copilot'
                      : 'You'}

                  </span>


                  <div className="chat-bubble">

                    <p className="bubble-text">
                      {msg.text}
                    </p>

                    <span className="bubble-time">
                      {msg.time}
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>


          {/* =================================================
              CHAT INPUT

              NO PO BUTTONS HERE
          ================================================= */}

          <form
            onSubmit={handleSendChat}
            className="chat-input-form"
          >

            <input
              type="text"
              placeholder="Ask Nexus Copilot about this order..."
              className="input-field chat-text-input"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
            />


            <button
              type="submit"
              className="btn btn-primary btn-icon send-button"
              aria-label="Send message"
            >

              <Send size={16} />

            </button>

          </form>

        </div>

      </div>


      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* =====================================================
           PAGE
        ===================================================== */

        .procurement-assistant-page {

          display: flex;

          flex-direction: column;

          gap: 22px;

          padding-bottom: 28px;

          color: var(--text-main);

        }


        /* =====================================================
           MAIN GRID
        ===================================================== */

        .procurement-workspace-grid {

          display: grid;

          grid-template-columns:
            360px minmax(0, 1fr);

          gap: 20px;

          height:
            calc(100vh - 180px);

          min-height:
            620px;

          align-items:
            stretch;

        }


        /* =====================================================
           LEFT PANEL
        ===================================================== */

        .left-sku-panel {

          display: flex;

          flex-direction: column;

          min-width: 0;

          min-height: 0;

          overflow: hidden;

          padding: 20px;

        }


        /* =====================================================
           LEFT HEADER
        ===================================================== */

        .left-panel-header {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 12px;

          padding-bottom:
            16px;

          border-bottom:
            1px solid
            var(--border-color);

        }


        .left-panel-title {

          margin:
            0 0 4px;

          color:
            var(--text-main);

          font-size:
            16px;

          line-height:
            1.35;

          font-weight:
            750;

        }


        .left-panel-subtitle {

          display:
            block;

          color:
            var(--text-subtle);

          font-size:
            11px;

          line-height:
            1.4;

        }


        /* =====================================================
           SKU LIST
        ===================================================== */

        .sku-selector-list {

          display:
            flex;

          flex-direction:
            column;

          gap:
            12px;

          flex:
            1;

          min-height:
            0;

          overflow-y:
            auto;

          margin-top:
            16px;

          padding-right:
            5px;

        }


        /* =====================================================
           SKU CARD
        ===================================================== */

        .sku-select-card {

          padding:
            16px;

          border-radius:
            10px;

          background:
            rgba(255, 255, 255, 0.025);

          border:
            1px solid
            var(--border-color);

          cursor:
            pointer;

          transition:
            all 0.18s ease;

        }


        .sku-select-card:hover {

          background:
            rgba(255, 255, 255, 0.045);

          border-color:
            rgba(99, 102, 241, 0.35);

          transform:
            translateY(-1px);

        }


        .sku-select-card.selected {

          background:
            rgba(79, 70, 229, 0.09);

          border-color:
            var(--primary);

          box-shadow:
            inset 3px 0 0 var(--primary);

        }


        /* =====================================================
           SKU TOP
        ===================================================== */

        .sku-top {

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            8px;

          margin-bottom:
            9px;

        }


        .sku-code {

          color:
            var(--text-muted);

          font-size:
            10px;

          line-height:
            1.3;

          font-weight:
            650;

          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;

        }


        .sku-top .badge {

          font-size:
            9px;

          padding:
            4px 7px;

          white-space:
            nowrap;

        }


        /* =====================================================
           PRODUCT NAME
        ===================================================== */

        .sku-name {

          margin:
            0 0 15px;

          color:
            var(--text-main);

          font-size:
            15px;

          line-height:
            1.45;

          font-weight:
            700;

        }


        /* =====================================================
           METRICS
        ===================================================== */

        .sku-meta-grid {

          display:
            grid;

          grid-template-columns:
            1fr 1fr;

          gap:
            12px;

          padding-top:
            14px;

          border-top:
            1px solid
            rgba(148, 163, 184, 0.09);

        }


        .meta-lbl {

          display:
            block;

          margin-bottom:
            4px;

          color:
            var(--text-subtle);

          font-size:
            10px;

          line-height:
            1.4;

          font-weight:
            600;

        }


        .meta-val {

          display:
            block;

          color:
            var(--text-main);

          font-size:
            14px;

          line-height:
            1.35;

          font-weight:
            700;

        }


        /* =====================================================
           SKU ACTION

           PO controls are ONLY HERE.
        ===================================================== */

        .sku-action-area {

          margin-top:
            16px;

          padding-top:
            14px;

          border-top:
            1px solid
            rgba(148, 163, 184, 0.10);

        }


        .sku-action-button {

          width:
            100%;

          min-height:
            39px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          gap:
            7px;

          font-size:
            11px;

          font-weight:
            700;

        }


        .approved-state {

          width:
            100%;

          min-height:
            39px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          gap:
            7px;

          box-sizing:
            border-box;

          border-radius:
            7px;

          background:
            rgba(16, 185, 129, 0.10);

          border:
            1px solid
            rgba(16, 185, 129, 0.25);

          color:
            #34D399;

          font-size:
            10px;

          font-weight:
            700;

        }


        /* =====================================================
           RIGHT CHAT
        ===================================================== */

        .right-chat-panel {

          display:
            flex;

          flex-direction:
            column;

          min-width:
            0;

          min-height:
            0;

          height:
            100%;

          overflow:
            hidden;

          padding:
            0;

        }


        /* =====================================================
           CHAT HEADER

           ONLY BOT INFORMATION.
           NO RECOMMENDATION.
           NO PO BUTTON.
        ===================================================== */

        .chat-header {

          flex-shrink:
            0;

          padding:
            20px 22px;

          border-bottom:
            1px solid
            var(--border-color);

          background:
            rgba(9, 13, 22, 0.42);

        }


        .chat-bot-status {

          display:
            flex;

          align-items:
            center;

          gap:
            12px;

        }


        .bot-avatar-box {

          width:
            40px;

          height:
            40px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          flex-shrink:
            0;

          border-radius:
            10px;

          background:
            linear-gradient(
              135deg,
              #4F46E5,
              #9333EA
            );

          color:
            white;

          box-shadow:
            0 5px 18px
            rgba(79, 70, 229, 0.20);

        }


        .bot-info {

          min-width:
            0;

        }


        .bot-title {

          margin:
            0 0 5px;

          color:
            var(--text-main);

          font-size:
            16px;

          line-height:
            1.35;

          font-weight:
            750;

        }


        .bot-status-text {

          display:
            flex;

          align-items:
            center;

          gap:
            5px;

          color:
            #10B981;

          font-size:
            11px;

          line-height:
            1.4;

          font-weight:
            600;

        }


        .status-dot {

          font-size:
            9px;

          color:
            #10B981;

        }


        /* =====================================================
           CHAT MESSAGES
        ===================================================== */

        .chat-messages-container {

          flex:
            1 1 auto;

          min-height:
            0;

          overflow-y:
            auto;

          padding:
            24px;

          display:
            flex;

          flex-direction:
            column;

          gap:
            18px;

        }


        /* =====================================================
           MESSAGE ROW
        ===================================================== */

        .chat-bubble-row {

          display:
            flex;

          align-items:
            flex-start;

          gap:
            10px;

          max-width:
            78%;

        }


        .ai-row {

          align-self:
            flex-start;

        }


        .user-row {

          align-self:
            flex-end;

          flex-direction:
            row-reverse;

        }


        /* =====================================================
           AVATAR
        ===================================================== */

        .msg-avatar {

          width:
            30px;

          height:
            30px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          flex-shrink:
            0;

          border-radius:
            8px;

          color:
            white;

        }


        .ai-avatar {

          background:
            #4F46E5;

        }


        .user-avatar {

          background:
            #3B82F6;

        }


        /* =====================================================
           MESSAGE
        ===================================================== */

        .message-wrapper {

          min-width:
            0;

        }


        .message-sender {

          display:
            block;

          margin:
            0 0 5px 2px;

          color:
            var(--text-subtle);

          font-size:
            10px;

          line-height:
            1.3;

          font-weight:
            650;

        }


        .user-row .message-sender {

          text-align:
            right;

        }


        .chat-bubble {

          padding:
            12px 15px;

          border-radius:
            10px;

          background:
            rgba(255, 255, 255, 0.035);

          border:
            1px solid
            var(--border-color);

        }


        .user-row .chat-bubble {

          background:
            var(--primary);

          border-color:
            var(--primary);

        }


        .bubble-text {

          margin:
            0;

          color:
            var(--text-main);

          font-size:
            13px;

          line-height:
            1.6;

          font-weight:
            450;

        }


        .user-row .bubble-text {

          color:
            white;

        }


        .bubble-time {

          display:
            block;

          margin-top:
            6px;

          color:
            var(--text-subtle);

          font-size:
            9px;

          line-height:
            1.3;

          text-align:
            right;

        }


        /* =====================================================
           CHAT INPUT
        ===================================================== */

        .chat-input-form {

          flex-shrink:
            0;

          display:
            flex;

          align-items:
            center;

          gap:
            10px;

          padding:
            14px 20px;

          background:
            rgba(9, 13, 22, 0.92);

          border-top:
            1px solid
            var(--border-color);

        }


        .chat-text-input {

          flex:
            1;

          min-width:
            0;

          height:
            43px;

          font-size:
            12px !important;

          line-height:
            1.4;

        }


        .chat-text-input::placeholder {

          color:
            var(--text-subtle);

          opacity:
            0.9;

        }


        .send-button {

          width:
            43px;

          height:
            43px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          flex-shrink:
            0;

        }


        /* =====================================================
           SCROLLBARS
        ===================================================== */

        .sku-selector-list::-webkit-scrollbar,
        .chat-messages-container::-webkit-scrollbar {

          width:
            5px;

        }


        .sku-selector-list::-webkit-scrollbar-track,
        .chat-messages-container::-webkit-scrollbar-track {

          background:
            transparent;

        }


        .sku-selector-list::-webkit-scrollbar-thumb,
        .chat-messages-container::-webkit-scrollbar-thumb {

          background:
            rgba(148, 163, 184, 0.18);

          border-radius:
            10px;

        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1100px) {

          .procurement-workspace-grid {

            grid-template-columns:
              320px minmax(0, 1fr);

          }

        }


        @media (max-width: 900px) {

          .procurement-workspace-grid {

            grid-template-columns:
              1fr;

            height:
              auto;

            min-height:
              0;

          }


          .left-sku-panel {

            max-height:
              450px;

          }


          .right-chat-panel {

            height:
              680px;

          }

        }


        @media (max-width: 650px) {

          .left-panel-header {

            align-items:
              flex-start;

            flex-direction:
              column;

          }


          .chat-header {

            padding:
              17px;

          }


          .chat-messages-container {

            padding:
              17px;

          }


          .chat-input-form {

            padding:
              12px 17px;

          }


          .chat-bubble-row {

            max-width:
              90%;

          }

        }

      `}</style>

    </div>
  );
}