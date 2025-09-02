# Docker Setup for Cents Application

This Docker Compose setup will run the entire Cents application stack including the PostgreSQL database, Spring Boot backend, and React frontend.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Clone and navigate to the repository:**
   ```bash
   cd /path/to/cents
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:5432

## Services

### PostgreSQL Database
- **Port:** 5432
- **Database:** cents
- **Username:** postgres
- **Password:** postgres
- **Data persistence:** Docker volume `postgres_data`

### Spring Boot Backend
- **Port:** 8080
- **Language:** Kotlin
- **Framework:** Spring Boot 3.4.5
- **Java Version:** 21
- **Database:** Automatically connects to PostgreSQL
- **Auto-reload:** Source code is mounted for development

### React Frontend
- **Port:** 3000
- **Framework:** React 19 with Vite
- **Build tool:** Vite
- **Server:** Nginx
- **API endpoint:** Configured to connect to backend at http://localhost:8080

## Development Workflow

### Starting services
```bash
# Start all services in background
docker-compose up -d

# Start with logs
docker-compose up

# Start specific service
docker-compose up -d backend
```

### Stopping services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete database data)
docker-compose down -v
```

### Viewing logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f postgres
docker-compose logs -f backend
docker-compose logs -f nginx
```

### Rebuilding services
```bash
# Rebuild and restart all services
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
```

## Database Migrations

The database migrations are automatically applied when the PostgreSQL container starts up. The migration files are located in `service/src/main/resources/db/migration/`.

## Troubleshooting

### Port conflicts
If you get port conflicts, you can modify the ports in `docker-compose.yml`:
```yaml
ports:
  - "8081:8080"  # Change 8081 to any available port
```

### Database connection issues
- Ensure PostgreSQL is healthy: `docker-compose ps postgres`
- Check logs: `docker-compose logs postgres`
- Verify the backend can reach the database: `docker-compose exec backend ping postgres`

### Frontend build issues
- Clear node_modules: `docker-compose exec frontend rm -rf node_modules && npm install`
- Rebuild: `docker-compose up -d --build frontend`

### Backend build issues
- Clear Gradle cache: `docker-compose exec backend ./gradlew clean`
- Rebuild: `docker-compose up -d --build backend`

## Environment Variables

You can customize the setup by creating a `.env` file in the root directory:

```env
POSTGRES_PASSWORD=your_password
SPRING_PROFILES_ACTIVE=production
VITE_API_BASE_URL=http://your-api-domain.com
```

## Production Considerations

For production deployment:

1. **Security:** Change default passwords and use environment variables
2. **SSL:** Configure HTTPS with proper certificates
3. **Monitoring:** Add health checks and monitoring
4. **Backup:** Implement database backup strategies
5. **Scaling:** Consider using Docker Swarm or Kubernetes for scaling

## Cleanup

To completely remove all containers, networks, and volumes:
```bash
docker-compose down -v --remove-orphans
docker system prune -a
```
