#!/bin/bash

# SSL Certificate renewal script
# This script should be run via cron job for automatic renewal

set -e

echo "🔄 Checking for SSL certificate renewal..."

# Run certbot renewal
docker compose run --rm certbot renew

# Reload nginx if certificates were renewed
if [ $? -eq 0 ]; then
    echo "🔄 Reloading nginx configuration..."
    docker compose exec nginx nginx -s reload
    echo "✅ Certificate renewal completed successfully"
else
    echo "ℹ️  No certificate renewal needed"
fi
