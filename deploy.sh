#!/bin/bash

# Production deployment script for cents.jacobknowlton.com
# This script handles initial SSL certificate setup and deployment

set -e

echo "🚀 Starting production deployment for cents.jacobknowlton.com"

# Check if domain is pointing to this server
echo "📡 Checking if cents.jacobknowlton.com points to this server..."
DOMAIN_IP=$(dig +short cents.jacobknowlton.com)
SERVER_IP=$(curl -s ifconfig.me)

if [ "$DOMAIN_IP" != "$SERVER_IP" ]; then
    echo "⚠️  WARNING: cents.jacobknowlton.com ($DOMAIN_IP) does not point to this server ($SERVER_IP)"
    echo "Please update your DNS records before continuing."
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker compose down

# Build and start services (without SSL first)
echo "🔨 Building and starting services..."
docker compose up -d postgres backend

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 10

# Start nginx (HTTP only initially)
echo "🌐 Starting nginx (HTTP only)..."
docker compose up -d nginx

# Wait for nginx to be ready and test connectivity
echo "⏳ Waiting for nginx to be ready..."
sleep 10

# Test nginx is responding
echo "🔍 Testing nginx connectivity..."
for i in {1..30}; do
    if curl -f -s http://localhost/.well-known/acme-challenge/test > /dev/null 2>&1; then
        echo "✅ Nginx is responding"
        break
    elif [ $i -eq 30 ]; then
        echo "❌ Nginx failed to start properly"
        docker compose logs nginx
        exit 1
    else
        echo "⏳ Waiting for nginx... (attempt $i/30)"
        sleep 2
    fi
done

# Get initial SSL certificate
echo "🔐 Obtaining SSL certificate..."
if docker compose run --rm certbot; then
    echo "✅ SSL certificate obtained successfully"
    
    # Switch to SSL configuration
    echo "🔄 Switching to SSL configuration..."
    ./switch-to-ssl.sh
else
    echo "❌ Failed to obtain SSL certificate"
    echo "🔍 Debugging information:"
    echo "Nginx logs:"
    docker compose logs nginx
    echo "Certbot logs:"
    docker compose logs certbot
    exit 1
fi

# Set up automatic certificate renewal
echo "⏰ Setting up automatic certificate renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/local/bin/certbot renew --quiet --deploy-hook 'docker compose exec nginx nginx -s reload'") | crontab -

echo "✅ Deployment complete!"
echo "🌐 Your site should now be available at: https://cents.jacobknowlton.com"
echo "🔒 SSL certificate will automatically renew via cron job"

# Show running containers
echo "📋 Running containers:"
docker compose ps
