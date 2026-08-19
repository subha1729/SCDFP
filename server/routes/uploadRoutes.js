import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import csvParser from 'csv-parser';
import { fileURLToPath } from 'url';
import { SalesHistory } from '../models/SalesHistory.js';
import { Inventory } from '../models/Inventory.js';
import { isDbConnected } from '../config/db.js';
import { runPythonMlModel } from '../services/pythonBridge.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');
const UPLOADS_DIR = path.join(ROOT_DIR, 'server', 'uploads');
const MODELS_DIR = path.join(ROOT_DIR, 'python_ml', 'saved_models');

osEnsureDir(UPLOADS_DIR);
osEnsureDir(MODELS_DIR);

function osEnsureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Multer storage for CSV and Model files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.originalname.endsWith('.joblib') || file.originalname.endsWith('.pkl')) {
      cb(null, MODELS_DIR);
    } else {
      cb(null, UPLOADS_DIR);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${basename}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB
});

const router = express.Router();

/**
 * Ingest Sales History CSV & automatically run pre-trained ML models on it
 */
router.post('/sales', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No CSV file uploaded' });
    }

    const filePath = req.file.path;
    const parsedRows = [];

    // Parse CSV rows
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => parsedRows.push(row))
      .on('end', async () => {
        let insertedCount = parsedRows.length;

        // Persist to MongoDB if connected
        if (isDbConnected() && parsedRows.length > 0) {
          try {
            const formatted = parsedRows.map(r => ({
              date: r.Date || r.date || new Date().toISOString().split('T')[0],
              storeId: r.Store_ID || r.store_id || r.Store || 'STR-01',
              skuId: r.SKU_ID || r.sku_id || r.SKU || 'SKU-01',
              salesUnits: parseFloat(r.Sales_Units || r.sales_units || r.Units || 0),
              revenue: parseFloat(r.Revenue || r.revenue || r.Amount || 0),
              promoFlag: parseInt(r.Promo_Flag || r.promo || 0, 10),
              holidayFlag: parseInt(r.Holiday_Flag || r.holiday || 0, 10)
            }));
            await SalesHistory.insertMany(formatted, { ordered: false });
          } catch (dbErr) {
            console.warn('[UploadRoutes] MongoDB insertion warning:', dbErr.message);
          }
        }

        // Run Pre-trained Python ML Model on this newly uploaded CSV
        const mlResults = await runPythonMlModel({ action: 'all', csvPath: filePath });

        return res.json({
          success: true,
          fileName: req.file.originalname,
          rowCount: insertedCount,
          type: 'sales_history',
          mlResults: mlResults.data
        });
      })
      .on('error', (err) => {
        res.status(500).json({ success: false, message: `CSV parse error: ${err.message}` });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Ingest Inventory Stock Status CSV
 */
router.post('/inventory', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No CSV file uploaded' });
    }

    const filePath = req.file.path;
    const parsedRows = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => parsedRows.push(row))
      .on('end', async () => {
        let insertedCount = parsedRows.length;

        if (isDbConnected() && parsedRows.length > 0) {
          try {
            const bulkOps = parsedRows.map(r => ({
              updateOne: {
                filter: { sku: r.SKU_ID || r.sku || r.ID },
                update: {
                  $set: {
                    name: r.Product_Name || r.name || 'Unnamed Product',
                    category: r.Category || r.category || 'General',
                    stock: parseInt(r.Stock_Level || r.stock || 0, 10),
                    reorderLevel: parseInt(r.Reorder_Point || r.reorderLevel || 100, 10),
                    supplier: r.Supplier || r.supplier || 'Standard Supplier'
                  }
                },
                upsert: true
              }
            }));
            await Inventory.bulkWrite(bulkOps);
          } catch (dbErr) {
            console.warn('[UploadRoutes] Inventory DB sync warning:', dbErr.message);
          }
        }

        return res.json({
          success: true,
          fileName: req.file.originalname,
          rowCount: insertedCount,
          type: 'inventory_status'
        });
      })
      .on('error', (err) => {
        res.status(500).json({ success: false, message: `CSV parse error: ${err.message}` });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Upload new pre-trained ML model file (.joblib / .pkl)
 */
router.post('/model', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No model file uploaded' });
  }

  return res.json({
    success: true,
    message: `Pretrained model ${req.file.originalname} uploaded to saved_models directory successfully!`,
    fileName: req.file.filename,
    path: req.file.path
  });
});

export default router;
