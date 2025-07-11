Node.js App with Prometheus & Grafana Monitoring on Kubernetes

🌐 Project Overview

This project demonstrates how to deploy a simple Node.js application on Kubernetes with full monitoring using Prometheus and Grafana. You'll also expose custom application metrics using prom-client and visualize them in Grafana.

🚀 Tech Stack

Node.js (Express.js) – Web server and metrics endpoint

Docker – Containerizing the Node.js app

Kubernetes (Minikube) – Container orchestration

Prometheus – Metrics collection and alerting

Grafana – Data visualization and dashboarding

Helm – Package manager for Kubernetes

🔧 Setup Instructions

1. 📂 Clone the Repository

git clone https://github.com/athefe-tanjavoor/k8s-nodejs-monitoring-app.git
cd k8s-nodejs-monitoring-app

2. 📁 Project Structure

k8s-nodejs-monitoring-app/
├── app/                 # Node.js Application
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
├── k8s/                 # Kubernetes YAMLs
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── prometheus-values.yaml (if customized)
│   └── grafana-dashboard.json (optional)
└── README.md

3. 🚫 Prerequisites

Minikube

kubectl

Helm

Docker

4. 📄 Build & Push Docker Image

docker build -t <your-dockerhub-username>/k8snodejs:latest ./app
# Login & push to Docker Hub
docker push <your-dockerhub-username>/k8snodejs:latest

5. 🌍 Start Minikube

minikube start --addons=ingress

6. ⚖️ Deploy Node.js App

kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

7. 🏡 Deploy Ingress (Optional)

kubectl apply -f k8s/ingress.yaml

8. ✨ Install Prometheus + Grafana via Helm

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

9. 👀 Access Grafana UI

kubectl port-forward svc/prometheus-grafana -n monitoring 3000:80
# Access in browser: http://localhost:3000
# Default login: admin / <get password>
kubectl get secret prometheus-grafana -n monitoring -o jsonpath="{.data.admin-password}" | base64 --decode

10. 🔀 Expose Metrics from Node.js App

Use prom-client in your index.js:

const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const counter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'statusCode'],
});

app.use((req, res, next) => {
  res.on('finish', () => {
    counter.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

11. 🔍 Import Grafana Dashboard

Use dashboard ID 3662 from Grafana Labs.

Or import the JSON file grafana-dashboard.json.

12. 🚨 Setup Alerts (Optional)

Edit the prometheus-rules.yaml or via Alertmanager UI.

📈 Metrics Observed

CPU / Memory usage (via cAdvisor)

HTTP request count & latency (custom)

Garbage collection time

Event loop lag

Heap memory usage

📦 Final GitHub Push

git add .
git commit -m "Final project with Prometheus & Grafana monitoring"
git push origin main

📊 Output Screenshots



✅ To-Do Checklist

Task

Status

Node.js App Deployment

✅ Done

Prometheus & Grafana Setup

✅ Done

Metrics exposed

✅ Done

Grafana Dashboard imported

✅ Done

README Documentation

✅ Done

Final GitHub Push

✅ Done

📄 License

MIT License

✉️ Contact

For queries or issues, reach out at: [tanjavoorathefe@gmail.com] or open an issue on GitHub.

Happy Monitoring! 🚀