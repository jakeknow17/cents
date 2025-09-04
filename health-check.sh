#!/bin/bash

# Health check script for production deployment
# Verifies that all services are running and accessible

set -e

echo "🏥 Running health checks for cents.jacobknowlton.com..."

# Check if containers are running
echo "📋 Checking container status..."
docker-compose ps

# Check HTTP redirect
echo "🔄 Testing HTTP to HTTPS redirect..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://cents.jacobknowlton.com)
if [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
    echo "✅ HTTP redirect working (Status: $HTTP_STATUS)"
else
    echo "❌ HTTP redirect not working (Status: $HTTP_STATUS)"
fi

# Check HTTPS
echo "🔒 Testing HTTPS connection..."
HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://cents.jacobknowlton.com)
if [ "$HTTPS_STATUS" = "200" ]; then
    echo "✅ HTTPS working (Status: $HTTPS_STATUS)"
else
    echo "❌ HTTPS not working (Status: $HTTPS_STATUS)"
fi

# Check SSL certificate
echo "🔐 Checking SSL certificate..."
SSL_INFO=$(echo | openssl s_client -connect cents.jacobknowlton.com:443 -servername cents.jacobknowlton.com 2>/dev/null | openssl x509 -noout -dates)
if [ $? -eq 0 ]; then
    echo "✅ SSL certificate valid:"
    echo "$SSL_INFO"
else
    echo "❌ SSL certificate check failed"
fi

# Check API endpoint
echo "🔌 Testing API endpoint..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://cents.jacobknowlton.com/api/v1/budget/accounts)
if [ "$API_STATUS" = "200" ] || [ "$API_STATUS" = "401" ] || [ "$API_STATUS" = "403" ]; then
    echo "✅ API endpoint accessible (Status: $API_STATUS)"
else
    echo "❌ API endpoint not accessible (Status: $API_STATUS)"
fi

# Check database connection
echo "🗄️  Testing database connection..."
DB_CHECK=$(docker-compose exec -T postgres psql -U postgres -d cents -c "SELECT 1;" 2>/dev/null | grep -c "1 row")
if [ "$DB_CHECK" = "1" ]; then
    echo "✅ Database connection working"
else
    echo "❌ Database connection failed"
fi

echo "🏁 Health check complete!"
