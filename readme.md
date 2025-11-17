I'll help you create the necessary `.env` files for each service and a detailed `README.md` file to guide you through setting up and running the project locally.

First, let's identify all the environment variables needed by checking the configuration in each service:

1. Let me check the API Gateway configuration:

Let me examine the identity service configuration to gather all the necessary environment variables:

I'll create the `.env` files for each service and a comprehensive `README.md` to help you get started. Here's what I'll include:

1. **Environment Variables** for each service
2. **Step-by-Step Setup Instructions**
3. **Running the Application**
4. **API Documentation**
5. **Troubleshooting**

### 1. .env files for each service:

#### API Gateway (.env)
```env
PORT=3000
NODE_ENV=development
REDIS_URL=redis://localhost:6379
IDENTITY_SERVICE_URL=http://localhost:3001
POST_SERVICE_URL=http://localhost:3002
MEDIA_SERVICE_URL=http://localhost:3003
SEARCH_SERVICE_URL=http://localhost:3004
JWT_SECRET=your_jwt_secret_key_here
```

#### Identity Service (.env)
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/identity_service
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```

#### Post Service (.env)
```env
PORT=3002
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/post_service
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key_here
RABBITMQ_URL=amqp://localhost
```

#### Media Service (.env)
```env
PORT=3003
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/media_service
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret_key_here
RABBITMQ_URL=amqp://localhost
```

#### Search Service (.env)
```env
PORT=3004
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/search_service
ELASTICSEARCH_URL=http://localhost:9200
JWT_SECRET=your_jwt_secret_key_here
RABBITMQ_URL=amqp://localhost
```

### 2. README.md

```markdown
# Node.js Microservices Project

A microservices-based application with separate services for authentication, posts, media handling, and search functionality.

## Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB (v4.4+)
- Redis
- RabbitMQ
- Docker (optional, for containerization)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Nodejs-microservices-2025-master
```

### 2. Install Dependencies

Run the following command in each service directory:
- api-gateway
- identity-service
- post-service
- media-service
- search-service

```bash
cd <service-folder>
npm install
```

### 3. Set Up Environment Variables

1. Create a `.env` file in each service directory
2. Copy the respective environment variables from the `.env` examples above
3. Update the values with your actual configuration

### 4. Start Required Services

Make sure these services are running:
- MongoDB
- Redis
- RabbitMQ

You can use Docker to start them:

```bash
docker-compose up -d
```

### 5. Start the Services

In separate terminal windows, start each service:

```bash
# Terminal 1 - API Gateway
cd api-gateway
npm start

# Terminal 2 - Identity Service
cd identity-service
npm start

# Terminal 3 - Post Service
cd post-service
npm start

# Terminal 4 - Media Service
cd media-service
npm start

# Terminal 5 - Search Service
cd search-service
npm start
```

## API Documentation

Import the provided [postman-collection.json](cci:7://file:///c:/Users/asif/Downloads/Nodejs-microservices-2025-master/Nodejs-microservices-2025-master/postman-collection.json:0:0-0:0) into Postman to access all available API endpoints with example requests.

## Testing

To run tests for each service:

```bash
cd <service-folder>
npm test
```

## Environment Variables

### Common Variables
- `PORT`: Service port
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT
- `REDIS_URL`: Redis connection URL

### Service-Specific Variables
- **API Gateway**:
  - `IDENTITY_SERVICE_URL`
  - `POST_SERVICE_URL`
  - `MEDIA_SERVICE_URL`
  - `SEARCH_SERVICE_URL`

- **Media Service**:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

- **Search Service**:
  - `ELASTICSEARCH_URL`

## Troubleshooting

1. **Connection Issues**:
   - Ensure all required services (MongoDB, Redis, RabbitMQ) are running
   - Check if ports are not being used by other applications

2. **Authentication Issues**:
   - Verify JWT tokens are being sent in the Authorization header
   - Check if the JWT_SECRET matches across services

3. **Logs**:
   - Check the console logs of each service for errors
   - Logs are also saved in the `logs` directory

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Write tests for your changes
4. Submit a pull request
```

### 3. docker-compose.yml (for required services)

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:6.2
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  rabbitmq:
    image: rabbitmq:3.9-management
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.15.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

volumes:
  mongodb_data:
  redis_data:
  rabbitmq_data:
  elasticsearch_data:
```

### How to Use:

1. Save the `.env` files in their respective service directories
2. Save the `docker-compose.yml` in the root directory
3. Save the `README.md` in the root directory
4. Start the required services using Docker Compose:
   ```bash
   docker-compose up -d
   ```
5. Follow the setup instructions in the README.md

This setup provides a complete development environment with all necessary services running in containers, making it easy to get started with the project. The README includes all the information needed for a new developer to understand and run the project locally.
