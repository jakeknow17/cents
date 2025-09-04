# Production Deployment Guide

This guide covers deploying the Cents application to production with automatic SSL certificate management.

## Prerequisites

1. **Domain Setup**: Ensure `cents.jacobknowlton.com` points to your server's IP address
2. **Docker & Docker Compose**: Installed on your server
3. **Ports**: 80 and 443 must be open and available
4. **Email**: Valid email address for Let's Encrypt notifications

## Quick Deployment

### 1. Initial Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd cents

# Make deployment scripts executable
chmod +x deploy.sh renew-certs.sh

# Run the deployment script
./deploy.sh
```

### 2. Manual Step-by-Step Deployment

If you prefer manual control:

```bash
# 1. Build and start services
docker compose up -d postgres backend

# 2. Wait for backend to be ready
sleep 10

# 3. Start nginx (HTTP only initially)
docker compose up -d nginx

# 4. Wait for nginx to be ready
sleep 5

# 5. Obtain SSL certificate
docker compose run --rm certbot

# 6. Reload nginx with SSL configuration
docker compose exec nginx nginx -s reload
```

## SSL Certificate Management

### Automatic Renewal

The deployment script sets up automatic certificate renewal via cron job:

```bash
# Check if cron job is set up
crontab -l | grep certbot

# Manual renewal (if needed)
./renew-certs.sh
```

### Certificate Files

SSL certificates are stored in Docker volumes:
- `certbot_certs`: Contains the actual certificates
- `certbot_www`: Webroot for ACME challenges

## Configuration Files

### Security Configuration

The Spring Boot security config allows:
- `https://cents.jacobknowlton.com`
- `https://www.cents.jacobknowlton.com`

### Nginx Configuration

- **HTTP (Port 80)**: Redirects to HTTPS and handles ACME challenges
- **HTTPS (Port 443)**: Serves the application with SSL
- **Security Headers**: HSTS, CSP, XSS protection, etc.
- **CORS**: Configured for production domain

### Environment Variables

- **Frontend**: `VITE_API_BASE_URL=https://cents.jacobknowlton.com/api`
- **Backend**: Uses Docker profile with PostgreSQL connection

## Monitoring & Maintenance

### Check Service Status

```bash
# View running containers
docker compose ps

# View logs
docker compose logs -f nginx
docker compose logs -f backend
docker compose logs -f postgres
```

### Certificate Status

```bash
# Check certificate expiration
docker compose run --rm certbot certificates

# Test SSL configuration
openssl s_client -connect cents.jacobknowlton.com:443 -servername cents.jacobknowlton.com
```

### Backup

```bash
# Backup database
docker compose exec postgres pg_dump -U postgres cents > backup.sql

# Backup certificates
docker run --rm -v cents_certbot_certs:/data -v $(pwd):/backup alpine tar czf /backup/certs-backup.tar.gz -C /data .
```

## Troubleshooting

### Common Issues

1. **Domain not pointing to server**
   ```bash
   # Check DNS
   dig cents.jacobknowlton.com
   curl ifconfig.me
   ```

2. **Certificate renewal fails**
   ```bash
   # Check nginx logs
   docker compose logs nginx
   
   # Manual renewal with verbose output
   docker compose run --rm certbot renew --verbose
   ```

3. **CORS errors**
   - Verify domain in SecurityConfig.kt
   - Check nginx CORS headers
   - Ensure frontend uses HTTPS

4. **Database connection issues**
   ```bash
   # Check postgres logs
   docker compose logs postgres
   
   # Test connection
   docker compose exec postgres psql -U postgres -d cents -c "SELECT 1;"
   ```

### Log Locations

- **Nginx**: `/var/log/nginx/` (inside container)
- **Backend**: Docker logs via `docker compose logs backend`
- **PostgreSQL**: Docker logs via `docker compose logs postgres`

## Security Considerations

1. **Firewall**: Only ports 80 and 443 should be open
2. **Updates**: Regularly update Docker images
3. **Backups**: Regular database and certificate backups
4. **Monitoring**: Set up monitoring for certificate expiration
5. **Access**: Limit SSH access and use key-based authentication

## Performance Optimization

1. **Nginx Caching**: Static assets cached for 1 year
2. **Gzip Compression**: Enabled for text-based files
3. **HTTP/2**: Enabled for better performance
4. **Database**: Consider connection pooling for high traffic

## Scaling Considerations

For high traffic:
1. Use a load balancer (nginx, HAProxy)
2. Scale backend services horizontally
3. Use managed database service
4. Implement Redis for session management
5. Use CDN for static assets

## Support

For issues:
1. Check logs first
2. Verify DNS and network connectivity
3. Test SSL certificate validity
4. Check Docker container health
