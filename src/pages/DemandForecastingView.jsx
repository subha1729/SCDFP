import React, { useState } from 'react';
import { 
  TrendingUp, 
  FileSpreadsheet, 
  Filter, 
  Cpu, 
  Sliders, 
  HelpCircle, 
  Search, 
  ArrowUpDown, 
  BarChart3,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { 
  mockStores, 
  mockForecastModels, 
  mockActualVsPredicted30Days,
  mockMonthlyDemand,
  mockPromotionImpact,
  mockHolidayImpact
} from '../data/mockData';
import { fetchMlForecastFromBackend } from '../config/backendIntegration';

export default function DemandForecastingView({ onShowToast }) {
  const [selectedStore, setSelectedStore] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('30_DAYS');
  const [selectedModel, setSelectedModel] = useState('XGBoost');
  const [driverTab, setDriverTab] = useState('monthly'); // 'monthly' | 'promo' | 'holiday'
  const [tableSearch, setTableSearch] = useState('');

  const modelMetrics = mockForecastModels[selectedModel];

  const handleRunBackendMlInference = async () => {
    if (onShowToast) {
      onShowToast({ message: `Triggering ${selectedModel} model inference on backend...`, type: 'info' });
    }
    
    try {
      const mlPayload = {
        storeId: selectedStore,
        horizon: selectedDateRange,
        modelType: selectedModel
      };
      
      await fetchMlForecastFromBackend(mlPayload);
      if (onShowToast) {
        onShowToast({ message: `${selectedModel} inference complete! Updated confidence bands.`, type: 'success' });
      }
    } catch (error) {
      console.error("Backend ML Prediction Error:", error);
    }
  };

  const chartData = {
    labels: mockActualVsPredicted30Days.labels,
    datasets: [
      {
        label: 'Actual Sales Velocity',
        data: mockActualVsPredicted30Days.actual,
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3
      },
      {
        label: `${selectedModel} AI Forecast`,
        data: mockActualVsPredicted30Days.predicted,
        borderColor: '#4F46E5',
        backgroundColor: '#4F46E5',
        borderWidth: 2.5,
        tension: 0.3,
        pointRadius: 3
      },
      {
        label: 'Confidence Interval (95% Upper)',
        data: mockActualVsPredicted30Days.upperBound,
        borderColor: 'rgba(16, 185, 129, 0.4)',
        borderDash: [4, 4],
        backgroundColor: 'rgba(16, 185, 129, 0.06)',
        fill: '+1',
        pointRadius: 0
      },
      {
        label: 'Confidence Interval (95% Lower)',
        data: mockActualVsPredicted30Days.lowerBound,
        borderColor: 'rgba(16, 185, 129, 0.4)',
        borderDash: [4, 4],
        fill: false,
        pointRadius: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94A3B8', font: { family: 'Inter', size: 11 } }
      },
      tooltip: {
        backgroundColor: '#0F172A',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 6
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#64748B' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#64748B' } }
    }
  };

  const driverChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: { color: '#94A3B8', font: { family: 'Inter', size: 11 } }
      },
      tooltip: {
        backgroundColor: '#0F172A',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 6
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748B' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#64748B' } }
    }
  };

  const handleExportCSV = () => {
    if (onShowToast) onShowToast({ message: `Exported 30-Day Forecast Data to CSV file successfully!`, type: 'success' });
  };

  return (
    <div className="forecasting-page">
      {/* Header with single focused export button */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title"><TrendingUp className="text-primary" /> AI Demand Forecasting</h1>
          <p className="page-subtitle">Multi-model AI predictions, actual velocity comparison, and elasticity analysis.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleExportCSV}>
            <FileSpreadsheet size={14} /> Export Forecast CSV
          </button>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="glass-card filter-bar-card">
        <div className="filter-group">
          <label className="input-label"><Filter size={12} /> Select Store Node</label>
          <select 
            className="input-field select-field"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            <option value="ALL">All Regional Stores (Aggregate)</option>
            {mockStores.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="input-label"><Sliders size={12} /> Forecast Horizon</label>
          <select 
            className="input-field select-field"
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
          >
            <option value="7_DAYS">Next 7 Days</option>
            <option value="14_DAYS">Next 14 Days</option>
            <option value="30_DAYS">Next 30 Days (Default)</option>
            <option value="90_DAYS">Next 90 Days (Quarterly)</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="input-label"><Cpu size={12} /> Machine Learning Engine</label>
          <div className="model-toggle-group">
            {['XGBoost', 'LSTM', 'Prophet'].map(model => (
              <button 
                key={model}
                className={`model-btn ${selectedModel === model ? 'active' : ''}`}
                onClick={() => {
                  setSelectedModel(model);
                  handleRunBackendMlInference();
                }}
              >
                {model}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Model Performance Metrics Cards */}
      <div className="grid-3 metrics-grid">
        <div className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">RMSE (Root Mean Square Error)</span>
            <HelpCircle size={14} className="text-muted" title="Measures magnitude of prediction errors" />
          </div>
          <div className="metric-body">
            <span className="metric-val">{modelMetrics.rmse}</span>
            <span className="badge badge-success">Low Variance</span>
          </div>
          <p className="metric-sub">Standard deviation of residual errors for {selectedModel}.</p>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">MAE (Mean Absolute Error)</span>
            <HelpCircle size={14} className="text-muted" title="Average absolute magnitude of errors" />
          </div>
          <div className="metric-body">
            <span className="metric-val">{modelMetrics.mae}</span>
            <span className="badge badge-primary">Optimal</span>
          </div>
          <p className="metric-sub">Average absolute deviation per store SKU forecast.</p>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">MAPE (Mean Abs. Percentage Error)</span>
            <HelpCircle size={14} className="text-muted" title="Percentage error scale" />
          </div>
          <div className="metric-body">
            <span className="metric-val text-success">{modelMetrics.mape}</span>
            <span className="badge badge-success">{modelMetrics.accuracy} Accuracy</span>
          </div>
          <p className="metric-sub">Trained in {modelMetrics.trainingTime} on GPU cluster.</p>
        </div>
      </div>

      {/* Main Forecast Line Chart with Confidence Interval */}
      <div className="glass-card chart-card">
        <div className="card-title">
          <span>Actual Sales vs {selectedModel} AI Forecast (30-Day Outlook & 95% Confidence Band)</span>
          <div className="chart-legend-badge">
            <span className="dot dot-actual" /> Actual
            <span className="dot dot-predict" /> {selectedModel}
            <span className="dot dot-band" /> Confidence Band
          </div>
        </div>
        <div className="chart-wrapper-large">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Demand Drivers & Elasticity Intelligence */}
      <div className="glass-card drivers-section-card">
        <div className="drivers-header">
          <div>
            <h2 className="drivers-title">Demand Drivers & Elasticity Factors</h2>
            <p className="drivers-subtitle">Deep dive into long-term demand trends, promotion elasticity, and holiday event multipliers.</p>
          </div>
          <div className="driver-pill-tabs">
            <button 
              className={`driver-pill ${driverTab === 'monthly' ? 'active' : ''}`}
              onClick={() => setDriverTab('monthly')}
            >
              <Calendar size={13} />
              12-Month Projections
            </button>
            <button 
              className={`driver-pill ${driverTab === 'promo' ? 'active' : ''}`}
              onClick={() => setDriverTab('promo')}
            >
              <BarChart3 size={13} />
              Promotion Lift Factor
            </button>
            <button 
              className={`driver-pill ${driverTab === 'holiday' ? 'active' : ''}`}
              onClick={() => setDriverTab('holiday')}
            >
              <Sparkles size={13} />
              Holiday Multipliers
            </button>
          </div>
        </div>

        <div className="driver-chart-area">
          {driverTab === 'monthly' && (
            <div>
              <div className="driver-chart-info">
                <span className="driver-badge info">12-Month Horizon Comparison</span>
                <span className="driver-caption">Projected 2026 growth trend vs 2025 actual monthly demand baseline.</span>
              </div>
              <div className="driver-chart-wrapper">
                <Line data={mockMonthlyDemand} options={driverChartOptions} />
              </div>
            </div>
          )}

          {driverTab === 'promo' && (
            <div>
              <div className="driver-chart-info">
                <span className="driver-badge warning">Promotional Campaign Elasticity</span>
                <span className="driver-caption">Expected demand lift (%) based on discounting structure and campaign type.</span>
              </div>
              <div className="driver-chart-wrapper">
                <Bar data={mockPromotionImpact} options={driverChartOptions} />
              </div>
            </div>
          )}

          {driverTab === 'holiday' && (
            <div>
              <div className="driver-chart-info">
                <span className="driver-badge primary">Special Event Multipliers</span>
                <span className="driver-caption">Historical volume surges during major calendar events & holiday seasons.</span>
              </div>
              <div className="driver-chart-wrapper">
                <Line data={mockHolidayImpact} options={driverChartOptions} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forecast Data Table */}
      <div className="glass-card table-section-card">
        <div className="table-header-row">
          <h2 className="table-title">Day-by-Day Forecast Breakdown</h2>
          <div className="table-search-box">
            <Search size={14} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search day or value..." 
              className="table-search-input"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Day <ArrowUpDown size={12} /></th>
                <th>Actual Sales (Units)</th>
                <th>AI Predicted ({selectedModel})</th>
                <th>Lower Band (95%)</th>
                <th>Upper Band (95%)</th>
                <th>Variance %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockActualVsPredicted30Days.labels.map((label, idx) => {
                const actual = mockActualVsPredicted30Days.actual[idx];
                const pred = mockActualVsPredicted30Days.predicted[idx];
                const lower = mockActualVsPredicted30Days.lowerBound[idx];
                const upper = mockActualVsPredicted30Days.upperBound[idx];
                const diffPct = (((pred - actual) / actual) * 100).toFixed(1);

                return (
                  <tr key={idx}>
                    <td><strong>{label}</strong></td>
                    <td>{actual}</td>
                    <td><span className="text-primary font-semibold">{pred}</span></td>
                    <td>{lower}</td>
                    <td>{upper}</td>
                    <td className={diffPct >= 0 ? 'text-success' : 'text-danger'}>
                      {diffPct >= 0 ? `+${diffPct}%` : `${diffPct}%`}
                    </td>
                    <td>
                      <span className="badge badge-success">In Band</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .forecasting-page {
          display: flex;
          flex-direction: column;
          gap: 22px;
          padding-bottom: 24px;
        }

        .filter-bar-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px 20px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
          flex: 1;
        }

        .model-toggle-group {
          display: flex;
          background: rgba(9, 13, 22, 0.8);
          padding: 3px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .model-btn {
          flex: 1;
          padding: 7px;
          border-radius: 6px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .model-btn.active {
          background: var(--primary);
          color: white;
        }

        .metric-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 18px;
        }

        .metric-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .metric-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
        }

        .metric-body {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin: 10px 0 4px 0;
        }

        .metric-val {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .metric-sub {
          font-size: 11px;
          color: var(--text-subtle);
        }

        .chart-legend-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          color: var(--text-muted);
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 4px;
        }
        .dot-actual { background: #3B82F6; }
        .dot-predict { background: #4F46E5; }
        .dot-band { background: #10B981; }

        .chart-wrapper-large {
          height: 320px;
          position: relative;
        }

        /* --- Drivers Section --- */
        .drivers-section-card {
          padding: 22px;
        }

        .drivers-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border-color);
        }

        .drivers-title {
          font-size: 16px;
          font-weight: 700;
          color: #F8FAFC;
          margin: 0;
        }

        .drivers-subtitle {
          font-size: 12px;
          color: #64748B;
          margin: 4px 0 0 0;
        }

        .driver-pill-tabs {
          display: flex;
          gap: 6px;
          background: rgba(9, 13, 22, 0.7);
          padding: 4px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .driver-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: #94A3B8;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .driver-pill.active {
          background: #4F46E5;
          color: white;
        }

        .driver-chart-info {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .driver-badge {
          display: inline-flex;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .driver-badge.info { color: #38BDF8; background: rgba(56, 189, 248, 0.12); }
        .driver-badge.warning { color: #FBBF24; background: rgba(251, 191, 36, 0.12); }
        .driver-badge.primary { color: #818CF8; background: rgba(99, 102, 241, 0.12); }

        .driver-caption {
          font-size: 12px;
          color: #94A3B8;
        }

        .driver-chart-wrapper {
          height: 250px;
          position: relative;
        }

        .table-section-card {
          padding: 20px;
        }

        .table-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .table-title {
          font-size: 15px;
          font-weight: 700;
        }

        .table-search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(9, 13, 22, 0.8);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 6px 12px;
        }

        .table-search-input {
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-main);
          font-size: 13px;
        }

        @media (max-width: 1024px) {
          .filter-bar-card { flex-direction: column; align-items: stretch; }
          .drivers-header { flex-direction: column; align-items: flex-start; }
          .driver-pill-tabs { width: 100%; }
          .driver-pill { flex: 1; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
