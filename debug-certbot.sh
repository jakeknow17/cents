#!/bin/bash

# Debug script for Certbot ACME challenge issues

set -e

echo "🔍 Debugging Certbot ACME challenge setup..."

# Check if containers are running
echo "📋 Checking container status:"
docker compose ps

echo ""
echo "🌐 Testing nginx connectivity:"
if curl -f -s http://localhost/health; then
    echo "✅ Nginx is responding to health check"
else
    echo "❌ Nginx is not responding"
fi

echo ""
echo "🔍 Testing ACME challenge endpoint:"
if curl -f -s http://localhost/.well-known/acme-challenge/test; then
    echo "✅ ACME challenge endpoint is accessible"
else
    echo "❌ ACME challenge endpoint is not accessible"
fi

echo ""
echo "📁 Checking certbot volume mounts:"
echo "Certbot www volume contents:"
docker compose exec nginx ls -la /var/www/certbot/ || echo "❌ Cannot access /var/www/certbot"

echo ""
echo "📋 Nginx configuration for ACME challenges:"
docker compose exec nginx grep -A 5 -B 5 "acme-challenge" /etc/nginx/nginx.conf || echo "❌ ACME challenge configuration not found"

echo ""
echo "📊 Nginx access logs (last 20 lines):"
docker compose logs --tail=20 nginx

echo ""
echo "🔍 Testing external connectivity:"
echo "Testing from external IP:"
curl -I http://cents.jacobknowlton.com/.well-known/acme-challenge/test 2>/dev/null || echo "❌ External access failed"

echo ""
echo "🌍 DNS resolution:"
echo "cents.jacobknowlton.com resolves to:"
dig +short cents.jacobknowlton.com

echo ""
echo "🖥️  Server IP:"
curl -s ifconfig.me
