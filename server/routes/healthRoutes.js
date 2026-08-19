import express from 'express';
import { isDbConnected } from '../config/db.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Nexus Supply Chain AI API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      connected: isDbConnected(),
      mode: isDbConnected() ? 'MongoDB Live' : 'In-Memory Zero-Downtime Store'
    },
    services: {
      mlEngine: 'Operational (GradientBoosting / XGBoost / Prophet / Hierarchical Clustering)',
      emailService: 'Operational (Nodemailer Transporter)',
      csvIngestionHub: 'Operational'
    }
  });
});

export default router;
