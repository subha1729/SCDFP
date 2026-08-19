import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { seedDatabaseIfEmpty } from './seedData.js';

import uploadRoutes from './routes/uploadRoutes.js';
import forecastRoutes from './routes/forecastRoutes.js';
import clusteringRoutes from './routes/clusteringRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/clustering', clusteringRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/ai/chat', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    services: {
      server: 'Express.js Node.js',
      database: 'MongoDB',
      mlEngine: 'Python Pretrained Inference (Agglomerative Clustering & GradientBoosting)',
      aiChat: 'Google Gemini 1.5 Flash Copilot'
    }
  });
});

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error('[ServerError]', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start server
async function startServer() {
  await connectDB();
  await seedDatabaseIfEmpty();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Nexus MERN Backend Server running on http://localhost:${PORT}`);
    console.log(`🤖 Python ML Pretrained Model Engine connected`);
    console.log(`✨ Gemini AI Copilot API ready`);
    console.log(`=======================================================`);
  });
}

startServer();
