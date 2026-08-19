import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testCsvUpload() {
  const csvFilePath = path.resolve(__dirname, '../python_ml/sample_sales_history.csv');
  console.log(`Reading CSV file from ${csvFilePath}...`);

  const fileData = fs.readFileSync(csvFilePath, 'utf-8');
  const lines = fileData.split('\n').filter(l => l.trim() !== '');
  const headers = lines[0].split(',');
  const rows = lines.slice(1, 10).map(line => {
    const vals = line.split(',');
    const obj = {};
    headers.forEach((h, i) => { obj[h.trim()] = vals[i]?.trim(); });
    return obj;
  });

  console.log(`Parsed ${rows.length} sample rows. Uploading to /api/v1/sales/bulk-upload...`);

  const res = await fetch('http://localhost:5000/api/v1/sales/bulk-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: rows })
  });

  const json = await res.json();
  console.log('Bulk Upload Response:', json);
}

testCsvUpload();
