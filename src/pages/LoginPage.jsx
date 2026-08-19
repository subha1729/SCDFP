import React, { useState } from 'react';
import { Zap, ShieldCheck, ArrowRight, Lock, Mail, Check, Sparkles, X } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('elena.vance@nexus-supply.io');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess();
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setResetSent(true);
  };

  return (
    <div className="login-page-container">
      {/* Left Column: Form */}
      <div className="login-form-col">
        <div className="login-form-inner">
          <div className="login-brand-header">
            <div className="brand-logo-icon">
              <Zap size={22} className="logo-spark" />
            </div>
            <div className="brand-title-box">
              <h1 className="brand-title">NEXUS AI</h1>
              <span className="brand-subtitle">Demand Forecasting & Supply Chain Platform</span>
            </div>
          </div>

          <div className="login-welcome-text">
            <h2>Welcome back</h2>
            <p>Enter your credentials to access the AI supply chain command center.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label className="input-label">Work Email</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input 
                  type="email" 
                  className="input-field with-icon" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="label-with-link">
                <label className="input-label">Password</label>
                <button 
                  type="button" 
                  className="forgot-link"
                  onClick={() => setShowForgotModal(true)}
                >
                  Forgot password?
                </button>
              </div>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input 
                  type="password" 
                  className="input-field with-icon" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row-checkbox">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark-custom"><Check size={12} /></span>
                Remember me for 30 days
              </label>
            </div>

            <button type="submit" className="btn btn-primary login-btn">
              Sign In to Platform <ArrowRight size={16} />
            </button>

            <button type="button" onClick={onLoginSuccess} className="btn btn-secondary demo-btn">
              <Sparkles size={14} className="text-warning" /> Quick Demo Access (1-Click)
            </button>
          </form>

          <div className="login-footer">
            <ShieldCheck size={14} className="text-muted" />
            <span>SOC2 Type II Certified & Enterprise Encrypted</span>
          </div>
        </div>
      </div>

      {/* Right Column: Hero Graphic Banner */}
      <div className="login-hero-col">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} /> Next-Gen AI Demand Forecasting
          </div>
          <h2 className="hero-heading">
            Predict store sales with 98%+ precision across all retail nodes.
          </h2>
          <p className="hero-subtext">
            Harness XGBoost, LSTM neural nets, and automated store clustering to minimize stockouts and slash excess inventory carrying costs.
          </p>

          {/* Floating Metric Preview Card */}
          <div className="hero-metric-card glass-card">
            <div className="metric-header">
              <span className="metric-title">Live Model Performance</span>
              <span className="badge badge-success">+18.4% Lift</span>
            </div>
            <div className="metric-bars">
              <div className="bar-col"><div className="bar bar-1" /><span>Mon</span></div>
              <div className="bar-col"><div className="bar bar-2" /><span>Tue</span></div>
              <div className="bar-col"><div className="bar bar-3" /><span>Wed</span></div>
              <div className="bar-col"><div className="bar bar-4" /><span>Thu</span></div>
              <div className="bar-col"><div className="bar bar-5" /><span>Fri</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div className="modal-card glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reset Password</h3>
              <button className="btn-icon btn-secondary" onClick={() => setShowForgotModal(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              {resetSent ? (
                <div className="reset-success-box">
                  <div className="badge badge-success">Instructions Sent</div>
                  <p>Check your email inbox ({resetEmail || email}) for password reset link.</p>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="login-form">
                  <p className="modal-desc">Enter your work email address and we'll send you password recovery instructions.</p>
                  <div className="input-group">
                    <label className="input-label">Work Email</label>
                    <input 
                      type="email" 
                      className="input-field" 
                      defaultValue={email}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary full-width" style={{ marginTop: 12 }}>
                    Send Password Reset Link
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .login-page-container {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          background: var(--bg-dark);
        }

        .login-form-col {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .login-form-inner {
          width: 100%;
          max-width: 420px;
        }

        .login-brand-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 32px;
        }

        .brand-title {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .brand-subtitle {
          font-size: 11px;
          color: var(--text-muted);
        }

        .login-welcome-text h2 {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }

        .login-welcome-text p {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 28px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
        }

        .input-field.with-icon {
          padding-left: 42px;
          width: 100%;
        }

        .label-with-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .forgot-link {
          background: transparent;
          border: none;
          color: #818CF8;
          font-size: 12px;
          cursor: pointer;
        }
        .forgot-link:hover { text-decoration: underline; }

        .form-row-checkbox {
          display: flex;
          align-items: center;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--text-muted);
          cursor: pointer;
          user-select: none;
        }

        .checkbox-label input {
          display: none;
        }

        .checkmark-custom {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          background: rgba(15, 23, 42, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: transparent;
          transition: all var(--transition-fast);
        }

        .checkbox-label input:checked + .checkmark-custom {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .login-btn {
          width: 100%;
          padding: 12px;
          font-size: 15px;
          margin-top: 6px;
        }

        .demo-btn {
          width: 100%;
          padding: 10px;
          border-style: dashed;
        }

        .login-footer {
          margin-top: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-subtle);
        }

        .login-hero-col {
          flex: 1.2;
          background: radial-gradient(circle at 70% 30%, rgba(79, 70, 229, 0.25), transparent 60%), #0B1120;
          border-left: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
          position: relative;
        }

        .hero-content {
          max-width: 520px;
          position: relative;
          z-index: 10;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(79, 70, 229, 0.15);
          border: 1px solid rgba(99, 102, 241, 0.3);
          color: #818CF8;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .hero-heading {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin-bottom: 16px;
          color: #FFFFFF;
        }

        .hero-subtext {
          font-size: 15px;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .hero-metric-card {
          padding: 20px;
          background: rgba(30, 41, 59, 0.7);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .metric-title {
          font-size: 13px;
          font-weight: 600;
        }

        .metric-bars {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 100px;
          gap: 12px;
          padding-top: 10px;
        }

        .bar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          flex: 1;
          height: 100%;
          justify-content: flex-end;
        }

        .bar-col span {
          font-size: 11px;
          color: var(--text-muted);
        }

        .bar {
          width: 100%;
          background: linear-gradient(180deg, #4F46E5, #818CF8);
          border-radius: 6px 6px 0 0;
          transition: height 0.4s ease;
        }

        .bar-1 { height: 40%; }
        .bar-2 { height: 65%; }
        .bar-3 { height: 50%; }
        .bar-4 { height: 85%; }
        .bar-5 { height: 95%; background: linear-gradient(180deg, #22C55E, #4ADE80); }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(6px);
          z-index: 150;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-card {
          width: 100%;
          max-width: 440px;
          padding: 24px;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .modal-desc {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 14px;
        }

        .reset-success-box {
          text-align: center;
          padding: 20px 0;
        }
        .reset-success-box p {
          font-size: 14px;
          margin-top: 12px;
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .login-hero-col { display: none; }
        }
      `}</style>
    </div>
  );
}
