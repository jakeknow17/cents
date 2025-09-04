#!/bin/bash

# Script to switch nginx to SSL configuration after certificate is obtained

set -e

echo "🔒 Switching nginx to SSL configuration..."

# Copy the SSL-enabled nginx configuration
docker compose exec nginx cp /etc/nginx/nginx.conf /etc/nginx/nginx-http-only.conf.backup
docker compose cp nginx/nginx-reverse-proxy.conf cents-nginx:/etc/nginx/nginx.conf

# Test the configuration
echo "🔍 Testing nginx configuration..."
if docker compose exec nginx nginx -t; then
    echo "✅ Nginx configuration is valid"
    
    # Reload nginx
    echo "🔄 Reloading nginx..."
    docker compose exec nginx nginx -s reload
    
    echo "✅ Successfully switched to SSL configuration"
    echo "🌐 Your site should now be available at: https://cents.jacobknowlton.com"
else
    echo "❌ Nginx configuration test failed"
    echo "🔄 Restoring HTTP-only configuration..."
    docker compose exec nginx cp /etc/nginx/nginx-http-only.conf.backup /etc/nginx/nginx.conf
    docker compose exec nginx nginx -s reload
    exit 1
fi
