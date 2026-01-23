# Auth Service

**Microservicio: Auth Service** 🔐

Servicio de autenticación y autorización. Maneja registro de usuarios, login, generación de tokens JWT, roles y permisos.

## Características

- Registro y autenticación de usuarios
- Generación y validación de JWT
- Gestión de roles y permisos
- Integración con base de datos para usuarios
- Scripts de seeding para datos iniciales

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

## Scripts Útiles

- `seed-roles.ts`: Sembrar roles iniciales
- `seed-institucional-data.ts`: Sembrar datos institucionales
- `verify-roles.ts`: Verificar roles existentes

## Variables de Entorno

- `DATABASE_URL`: URL de conexión a base de datos
- `JWT_SECRET`: Clave secreta para JWT

## Dependencias Principales

- @nestjs/common
- @nestjs/jwt
- @nestjs/typeorm
- typeorm
- bcrypt