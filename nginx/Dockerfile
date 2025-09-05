# Container for building the frontend
FROM node:24.6.0-alpine AS build
WORKDIR /app

# Install dependencies
COPY web/package*.json ./
RUN npm ci --no-audit --no-fund && npm cache clean --force

# Copy all frontend source and build
COPY web/ .
RUN npm run build

# Container for serving the frontend and proxying the backend
FROM nginx:alpine

RUN apk add --no-cache openssl

COPY --from=build /app/dist/ /usr/share/nginx/html/
COPY nginx/nginx-reverse-proxy.conf /etc/nginx/nginx.conf

# Entrypoint scripts (executed by the official nginx entrypoint)
COPY nginx/docker-entrypoint.d/ /docker-entrypoint.d/
# Ensure scripts are executable
RUN chmod +x /docker-entrypoint.d/*.sh || true

EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
