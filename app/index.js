const express = require('express');
const promClient = require('prom-client');

const app = express();
const port = process.env.PORT || 3000;

const register = new promClient.Registry();

promClient.collectDefaultMetrics({ register });

const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'statusCode'],
});
register.registerMetric(httpRequestCounter);

app.get('/', (req, res) => {
  httpRequestCounter.labels('GET', '/', '200').inc();
  res.send('🚀 Hello from Node.js app running on Kubernetes with Prometheus!');
});

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

app.listen(port, () => {
  console.log(`✅ Node.js app listening on port ${port}`);
});
