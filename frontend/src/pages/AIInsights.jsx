import React, { useState } from "react";

import {
  Bot,
  Send,
  Sparkles,
  TrendingUp,
  Store,
  Package,
  BarChart3,
  User,
} from "lucide-react";


/* ============================================================
   QUICK QUESTIONS
   ============================================================ */

const quickQuestions = [
  {
    label: "Explain the forecast",
    icon: TrendingUp,
    question:
      "Explain the demand forecast for the next 7 days.",
  },
  {
    label: "Why is demand changing?",
    icon: BarChart3,
    question:
      "Why is demand changing in the upcoming week?",
  },
  {
    label: "Stores needing inventory",
    icon: Store,
    question:
      "Which stores are likely to need more inventory?",
  },
  {
    label: "Inventory risk",
    icon: Package,
    question:
      "Which inventory risks should I focus on?",
  },
];


/* ============================================================
   TEMPORARY AI RESPONSE
   ============================================================ */

function generateResponse(question) {
  const text = question.toLowerCase();

  if (
    text.includes("forecast") ||
    text.includes("demand")
  ) {
    return (
      "The seven-day forecast is based on recent sales "
      + "behaviour, store-level patterns and the features "
      + "provided to the XGBoost model. Once the backend "
      + "is connected, I will explain the exact forecast "
      + "values and the main factors affecting them."
    );
  }

  if (
    text.includes("store") ||
    text.includes("inventory")
  ) {
    return (
      "Stores with higher projected demand should be "
      + "reviewed first. The final recommendation will "
      + "compare the seven-day forecast with inventory "
      + "information."
    );
  }

  if (text.includes("risk")) {
    return (
      "Inventory risk can be identified by comparing "
      + "projected demand with available stock and "
      + "expected supply."
    );
  }

  return (
    "I can explain demand forecasts, store behaviour, "
    + "inventory risk and procurement requirements."
  );
}


/* ============================================================
   AI INSIGHTS PAGE
   ============================================================ */

function AIInsights() {

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text:
        "Hello! I'm your AI Forecast Assistant. "
        + "Ask me about the seven-day demand forecast, "
        + "store behaviour or inventory requirements.",
    },
  ]);

  const [input, setInput] = useState("");


  /* ==========================================================
     SEND MESSAGE
     ========================================================== */

  const sendMessage = () => {

    const question = input.trim();

    if (!question) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: question,
    };

    const assistantMessage = {
      id: Date.now() + 1,
      role: "assistant",
      text: generateResponse(question),
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      assistantMessage,
    ]);

    setInput("");
  };


  /* ==========================================================
     ENTER KEY
     ========================================================== */

  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };


  /* ==========================================================
     QUICK QUESTION
     ========================================================== */

  const askQuickQuestion = (question) => {
    setInput(question);
  };


  return (
    <div className="ai-insights-page">


      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="ai-page-header">

        <div>

          <div className="dashboard-eyebrow">
            AI SUPPLY CHAIN INTELLIGENCE
          </div>

          <h1>
            AI Forecast Assistant
          </h1>

          <p>
            Ask questions about demand forecasts,
            store behaviour, inventory and procurement.
          </p>

        </div>


        <div className="ai-status">

          <span className="ai-status-dot"></span>

          AI Engine Online

        </div>

      </div>


      {/* =====================================================
          AI WORKSPACE
      ===================================================== */}

      <div className="ai-workspace">


        {/* ===================================================
            CHAT CARD
        =================================================== */}

        <div className="ai-chat-card">


          {/* CHAT HEADER */}

          <div className="ai-chat-header">

            <div className="ai-chat-title">

              <div className="ai-avatar">
                <Bot size={19} />
              </div>

              <div>

                <strong>
                  Forecast Intelligence
                </strong>

                <span>
                  XGBoost Forecast Assistant
                </span>

              </div>

            </div>


            <div className="ai-online-badge">

              <span></span>

              Online

            </div>

          </div>


          {/* =================================================
              CHAT MESSAGES
          ================================================= */}

          <div className="ai-messages">

            {messages.map((message) => (

              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "ai-message user"
                    : "ai-message assistant"
                }
              >

                <div className="message-avatar">

                  {message.role === "user" ? (
                    <User size={14} />
                  ) : (
                    <Bot size={14} />
                  )}

                </div>


                <div className="message-content">

                  <div className="message-role">

                    {message.role === "user"
                      ? "You"
                      : "AI Assistant"}

                  </div>


                  <div className="message-text">

                    {message.text}

                  </div>

                </div>

              </div>

            ))}

          </div>


          {/* =================================================
              MESSAGE INPUT
          ================================================= */}

          <div className="ai-input-area">

            <div className="ai-input-wrapper">

              <textarea
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask about your forecast..."
                rows={1}
              />


              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim()}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>

            </div>


            <span className="ai-input-hint">
              Press Enter to send
            </span>

          </div>

        </div>


        {/* ===================================================
            RIGHT SIDE PANEL
        =================================================== */}

        <div className="ai-side-panel">


          {/* =================================================
              FORECAST CONTEXT
          ================================================= */}

          <div className="ai-context-card">

            <div className="ai-context-header">

              <div className="ai-context-icon">
                <Sparkles size={16} />
              </div>

              <div>

                <strong>
                  Forecast Context
                </strong>

                <span>
                  Current model information
                </span>

              </div>

            </div>


            <div className="ai-context-list">


              <div className="ai-context-row">

                <span>
                  Model
                </span>

                <strong>
                  XGBoost
                </strong>

              </div>


              <div className="ai-context-row">

                <span>
                  Forecast horizon
                </span>

                <strong>
                  7 Days
                </strong>

              </div>


              <div className="ai-context-row">

                <span>
                  Forecast status
                </span>

                <strong className="context-success">
                  Ready
                </strong>

              </div>

            </div>

          </div>


          {/* =================================================
              QUICK QUESTIONS
          ================================================= */}

          <div className="ai-questions-card">

            <div className="ai-side-title">

              <strong>
                Ask about your forecast
              </strong>

              <span>
                Quick questions
              </span>

            </div>


            <div className="quick-question-list">

              {quickQuestions.map((item) => {

                const Icon = item.icon;

                return (

                  <button
                    key={item.label}
                    className="quick-question"
                    type="button"
                    onClick={() =>
                      askQuickQuestion(item.question)
                    }
                  >

                    <Icon size={14} />

                    <span>
                      {item.label}
                    </span>

                  </button>

                );

              })}

            </div>

          </div>


          {/* =================================================
              EXPLANATION SCOPE
          ================================================= */}

          <div className="ai-explanation-card">

            <div className="ai-explanation-icon">
              <Sparkles size={15} />
            </div>


            <strong>
              What the assistant explains
            </strong>


            <ul>

              <li>
                Demand trends
              </li>

              <li>
                Store-level forecast changes
              </li>

              <li>
                Inventory requirements
              </li>

              <li>
                Procurement implications
              </li>

            </ul>

          </div>

        </div>

      </div>

    </div>
  );
}


export default AIInsights;