const express = require('express');
const client = require('prom-client');

const app = express();
const port = process.env.PORT || 3000;

// Create a Registry to register the metrics
const register = new client.Registry();

// Enable collection of default metrics (memory, CPU, etc.)
client.collectDefaultMetrics({ register });

// Custom metric: Counter for incoming requests
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'statusCode']
});

register.registerMetric(httpRequestsTotal);

// Middleware to count requests
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      statusCode: res.statusCode
    });
  });
  next();
});

// Basic route
app.get('/', (req, res) => {
  res.send('🚀 Hello from Node.js app running on Kubernetes!');
});

// Metrics route
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
