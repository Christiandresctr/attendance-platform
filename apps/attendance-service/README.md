# Attendance Service

**Microservicio: Attendance Service** 📊

Servicio responsable de gestionar la asistencia de usuarios en la plataforma. Maneja registros de entrada/salida, validación de tokens JWT y persistencia en base de datos PostgreSQL.

## Características

- Gestión de registros de asistencia
- Validación de JWT para autenticación
- Integración con TypeORM y PostgreSQL
- Arquitectura modular con NestJS

## Instalación

```bash
pnpm install
```

## Ejecución

```bash
# desarrollo
pnpm run start:dev

# producción
pnpm run start:prod
```

## Pruebas

```bash
# unitarias
pnpm run test

# e2e
pnpm run test:e2e
```

## Variables de Entorno

- `DATABASE_URL`: URL de conexión a PostgreSQL
- `JWT_SECRET`: Clave secreta para JWT

## Dependencias Principales

- @nestjs/common
- @nestjs/typeorm
- typeorm
- pg