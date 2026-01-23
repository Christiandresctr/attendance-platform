# Docker Compose Configuration for Attendance Platform

## Overview

This Docker Compose setup provides a complete development environment for the Attendance Platform microservices architecture with the following services:

- **PostgreSQL**: Multi-database setup (auth_service_dev, attendance_service_dev)
- **Auth Service**: Spring Boot microservice with JWT authentication
- **Attendance Service**: Spring Boot microservice for attendance management
- **API Gateway**: Nginx reverse proxy for routing and load balancing
- **pgAdmin**: Web-based PostgreSQL administration interface
- **Redis**: In-memory caching service

## Service Ports and Access

| Service | Container Port | Host Port | URL/Access |
|---------|----------------|-----------|------------|
| PostgreSQL | 5432 | 5432 | `localhost:5432` |
| Auth Service | 8081 | 8081 | `http://localhost:8081` |
| Attendance Service | 8082 | 8082 | `http://localhost:8082` |
| API Gateway | 80 | 8080 | `http://localhost:8080` |
| pgAdmin | 80 | 5050 | `http://localhost:5050` |
| Redis | 6379 | 6379 | `localhost:6379` |

## Network Configuration

All services communicate through a custom Docker network with static IP addresses:

- `postgres`: 172.20.0.10
- `auth-service`: 172.20.0.11
- `attendance-service`: 172.20.0.12
- `api-gateway`: 172.20.0.20
- `pgadmin`: 172.20.0.30
- `redis`: 172.20.0.40

## Database Configuration

### PostgreSQL Databases
- **auth_service_dev**: Used by the authentication service
- **attendance_service_dev**: Used by the attendance service
- **postgres**: Default admin database

### Database Users
- **postgres**: Superuser (password: postgres123)
- **auth_service_user**: Auth service database user (password: auth123)
- **attendance_service_user**: Attendance service database user (password: attendance123)

### pgAdmin Access
- **URL**: http://localhost:5050
- **Email**: admin@attendance.com
- **Password**: admin123

## Quick Start

### Prerequisites
- Docker Desktop (or Docker Engine) installed and running
- At least 4GB RAM available for Docker
- Sufficient disk space for database data (recommended: 10GB+)

### Starting the Platform

1. **Clone and navigate to the project directory:**
   ```bash
   cd attendance-platform
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Monitor the startup process:**
   ```bash
   docker-compose logs -f
   ```

4. **Verify all services are healthy:**
   ```bash
   docker-compose ps
   ```

### Stopping the Platform

```bash
docker-compose down
```

To also remove volumes (⚠️ This will delete all data):
```bash
docker-compose down -v
```

## Service Dependencies

The services have strict dependency order with health checks:
1. PostgreSQL starts first and initializes databases
2. Auth Service starts after PostgreSQL is healthy
3. Attendance Service starts after PostgreSQL and Auth Service are healthy
4. API Gateway starts after both microservices are healthy
5. pgAdmin starts after PostgreSQL is healthy
6. Redis starts independently

## Development Workflow

### Viewing Logs

**All services:**
```bash
docker-compose logs -f
```

**Specific service:**
```bash
docker-compose logs -f auth-service
docker-compose logs -f attendance-service
docker-compose logs -f postgres
```

### Accessing Services

**API Gateway (recommended entry point):**
```bash
curl http://localhost:8080/health
```

**Direct service access:**
```bash
# Auth Service
curl http://localhost:8081/actuator/health

# Attendance Service  
curl http://localhost:8082/actuator/health
```

**Database access:**
```bash
# Using psql
psql -h localhost -p 5432 -U postgres -d auth_service_dev
psql -h localhost -p 5432 -U postgres -d attendance_service_dev

# Or use pgAdmin at http://localhost:5050
```

### Database Initialization

The PostgreSQL container includes database initialization scripts:
- Location: `./database/init/`
- Scripts automatically execute on first container start
- Creates databases, users, and initial schema

### Volume Management

**Persistent data locations:**
- PostgreSQL data: Docker volume `postgres_data`
- pgAdmin data: Docker volume `pgadmin_data`
- Redis data: Docker volume `redis_data`

**Backup and restore:**
```bash
# Backup databases
docker-compose exec postgres pg_dump -U postgres auth_service_dev > backup_auth.sql
docker-compose exec postgres pg_dump -U postgres attendance_service_dev > backup_attendance.sql

# Restore databases
docker-compose exec -T postgres psql -U postgres auth_service_dev < backup_auth.sql
```

## Environment Configuration

### Environment Variables (.env)

Key configuration options in `.env` file:

```bash
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123

# Security
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60s
```

### Custom Configuration

**For development:**
- Set `SPRING_PROFILES_ACTIVE=dev` for debug logging
- Mount source code for live reload (already configured)
- Use higher logging levels

**For production:**
- Set `SPRING_PROFILES_ACTIVE=prod`
- Remove source code mounts
- Use secrets management for passwords
- Enable SSL/TLS

## Health Checks

All services include health checks:
- PostgreSQL: `pg_isready` command
- Spring Boot services: `/actuator/health` endpoint
- Nginx: HTTP health endpoint
- Redis: Redis ping command

Health check status can be viewed with:
```bash
docker-compose ps
```

## Troubleshooting

### Common Issues

**Port conflicts:**
- Ensure ports 8080, 8081, 8082, 5432, 5050, 6379 are available
- Modify ports in docker-compose.yml if needed

**Database connection issues:**
- Check PostgreSQL health: `docker-compose logs postgres`
- Verify network connectivity between containers
- Check database initialization scripts

**Service startup failures:**
- View detailed logs: `docker-compose logs [service-name]`
- Check resource availability (memory, disk space)
- Verify .env file configuration

### Useful Commands

```bash
# Restart specific service
docker-compose restart auth-service

# Rebuild and restart service
docker-compose up -d --build auth-service

# Execute commands in container
docker-compose exec postgres bash
docker-compose exec auth-service bash

# View resource usage
docker stats

# Clean up unused resources
docker system prune -f
```

## Security Considerations

**Development Environment:**
- Default passwords are used (change for production)
- All ports exposed to host
- Debug logging enabled

**Production Deployment:**
- Use strong, unique passwords
- Limit exposed ports
- Enable authentication on all services
- Use secrets management
- Implement network policies
- Enable SSL/TLS encryption

## Performance Tuning

**Database Optimization:**
- PostgreSQL configuration in environment variables
- Connection pooling in Spring Boot applications
- Redis caching for frequently accessed data

**Resource Allocation:**
- Monitor memory usage with `docker stats`
- Adjust container memory limits as needed
- Consider database indexing strategies

## Monitoring and Observability

**Application Metrics:**
- Spring Boot Actuator endpoints exposed
- Health checks at `/actuator/health`
- Metrics at `/actuator/metrics`

**Log Management:**
- Logs mounted to host directories
- Structured logging configured
- Centralized logging can be added

**Future Enhancements:**
- Add Prometheus metrics collection
- Implement distributed tracing
- Add log aggregation (ELK stack)
- Monitor with Grafana dashboards
