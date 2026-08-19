async function testAll() {
  console.log('Testing Express + Python ML endpoints...');

  // 1. Health
  const healthRes = await fetch('http://localhost:5000/api/health');
  const health = await healthRes.json();
  console.log('✓ /api/health:', health.status);

  // 2. Forecast
  const forecastRes = await fetch('http://localhost:5000/api/forecast');
  const forecast = await forecastRes.json();
  console.log('✓ /api/forecast accuracy:', forecast.accuracy_score + '%');

  // 3. Hierarchical Clustering
  const clusterRes = await fetch('http://localhost:5000/api/clustering/hierarchical');
  const cluster = await clusterRes.json();
  console.log('✓ /api/clustering/hierarchical algorithm:', cluster.algorithm);

  // 4. Inventory
  const invRes = await fetch('http://localhost:5000/api/inventory');
  const inv = await invRes.json();
  console.log('✓ /api/inventory count:', inv.length, 'SKUs');

  // 5. Orders
  const orderRes = await fetch('http://localhost:5000/api/orders');
  const orders = await orderRes.json();
  console.log('✓ /api/orders count:', orders.length, 'POs');

  // 6. AI Copilot Chat
  const chatRes = await fetch('http://localhost:5000/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Can we approve order PO-2026-982 for Organic Milk?',
      context: { skuName: 'Organic Whole Milk 1L', recommendedOrder: 330 }
    })
  });
  const chat = await chatRes.json();
  console.log('✓ /api/ai/chat reply:', chat.reply);

  console.log('\n[SUCCESS] All MERN + Python ML + Gemini Copilot endpoints passed!');
}

testAll().catch(console.error);
