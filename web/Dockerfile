# Frontend build container
FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . ./

# Build the application
RUN npm run build

# The built files are now in /app/dist
# This container is just for building, not running
