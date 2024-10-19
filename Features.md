# Features Completed

## Microservices Architecture

### 1. Service-Oriented Architecture
- The backend is divided into multiple microservices, each responsible for a specific domain or functionality.
- Each microservice manages its own database or a part of a shared database.

### 2. Inter-Service Communication
#### HTTP Requests
- Microservices communicate via HTTP requests when necessary to invoke operations on another service or access shared data.

#### Middleware Integration
- Middleware is implemented for handling HTTP requests, event publishing, and event consumption to ensure clean separation of concerns and reusability.

## Containerization and Deployment Configurations

### 1. Containerization with Docker
- Client(front end) and backend microservices are containerized using Docker for consistent deployment across environments.

### 2. Cloud Deployment with Kubernetes
- All services are deployed on DigitalOcean’s Kubernetes cluster.
- Kubernetes Deployment and Service YAML files are used to manage application lifecycle and networking.

### 3. Horizontal Pod Autoscaling (HPA)
- HPA is configured for all microservices to automatically scale based on CPU utilization, ensuring optimal performance under varying loads.

### 4. Health Checks and Auto Healing
- Regular health checks are performed on all Kubernetes pods, with automatic pod recreation in case of failure to maintain service availability.

### 5. Resource Limitation
- Resource limitation applied for all deployments to prevent exhaustion of resources.

## Testing

### 1. Functional Testing
- Comprehensive test suites are written for the microservices using Jest and Supertest, ensuring functionality and integration testing for APIs.

### 2. Load Testing
- Left. Planned to do with Jmeter

### 3. Performance Testing
- Left. Planned to do with Jmeter

## Monitoring

### 1. Metrics Monitoring
- Prometheus and Grafana are integrated to monitor the health and performance of the system locally, for a node server, providing insights into resource utilization and metrics.

### 1. HPA Monitoring
- HPA Configuration and status can be monitored from k8s terminal.

## Database

### 1. MongoDB Atlas
- MongoDB Atlas is used for database management, with automatic handling of sharding and scaling for efficient data distribution.

### 2. Redis Caching
- Redis is deployed with k8s and used for caching in the backend services.

## Cloud Deployment

### 1. Domain Registration and Configuration
- Registered and configured the domain district12.xyz through NameCheap for seamless access to the application.

### 2. Deployment with Ingress and Kong
- Deployed full website using an Ingress controller with Kong and Helm, managing routing for multiple subdomains effectively.

### 3. Preflight Request Handling and CORS Configuration
- Implemented CORS policies to properly handle preflight requests, ensuring secure communication between the client and backend services.

### 4. HTTPS Protocol
- Configured ingress, cluster issuer and cert-manager to switch to https protocol from http

# Features Completed, Pending Testing

## GitHub Actions
- Continuous integration and deployment pipelines are set up using GitHub Actions but require further testing.

## Prometheus Integration
- Prometheus is deployed alongside the cloud infrastructure to monitor the performance and health of the microservices.

# Features Incomplete

### 1. Load Testing
- Conduct load testing to validate the system’s scalability and performance under high traffic.

### 2. Internal Kubernetes Database and Sharding
- Plan to migrate MongoDB to an internal Kubernetes deployment with database sharding to demonstrate database scaling within the cluster.

# Additional Features Planned

### 1. Asynchronus Event-Driven Communication
- RabbitMQ is used as the message broker for event-driven communication between services.
- Services publish and consume events to notify other services or respond to specific events asynchronously.

### 2. API Gateway
- Deploy an API Gateway to centralize routing, authentication, and request management for all microservices, improving security and simplifying external access.

### 3. Service Mesh
- Implement a service mesh (e.g., Istio or Linkerd) to manage microservice-to-microservice communication, enhancing security, observability, and traffic control.