# API Gateway

**Microservicio: API Gateway** 🔌

Un servicio que actúa como punto de entrada para los servicios de la plataforma de asistencia. Valida tokens JWT, enruta solicitudes a servicios downstream y centraliza manejo de errores y seguridad.

---

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Descripción

**API Gateway — attendance-platform** 🔌

Este repositorio contiene el API Gateway del sistema de gestión de asistencia. Su responsabilidad principal es: validar tokens JWT, enrutar solicitudes a servicios downstream (p. ej. attendance-service), centralizar logs y manejo de errores.

---

## Contenido principal

- **Autenticación**: JWT (Passport + passport-jwt). Las claves y secretos se gestionan mediante variables de entorno.
- **Proxy**: Servicios downstream se invocan a través de `ProxyService`, que centraliza el enrutado y el manejo de errores.
- **Configuración**: `ConfigService` (lectura segura de `.env`) para credenciales, URLs y opciones de CORS.
- **Calidad**: TypeScript fuerte, ESLint y pruebas unitarias con Jest.

---

## Variables de entorno (ejemplo)

Usar `.env` en desarrollo; hay un `.env.example` con variables mínimas:

- `PORT` — Puerto del API Gateway (ej. `3000`)
- `JWT_SECRET` — Secreto para validar tokens JWT
- `ATTENDANCE_SERVICE_URL` — URL base del attendance-service
- `CORS_ORIGIN` — Orígenes permitidos para CORS (ej. `*` o `http://localhost:3000`)

> Asegúrate de no subir secretos al repositorio.

---

## Ejecutar localmente (desarrollo) ✅

1. Instalar dependencias:

```bash
pnpm install
```

2. Copiar y editar variables de entorno:

```bash
cp .env.example .env
# editar .env con las variables necesarias
```

3. Ejecutar en modo desarrollo:

```bash
pnpm run start:dev
```

4. Alternativamente, construir y ejecutar en producción:

```bash
pnpm run build
pnpm run start:prod
```

---

## Scripts útiles

- `pnpm run start` — Inicia la app (producción)
- `pnpm run start:dev` — Modo desarrollo (Hot reload)
- `pnpm run build` — Compila TypeScript
- `pnpm run lint` — Ejecuta ESLint
- `pnpm run test` — Ejecuta pruebas unitarias
- `pnpm run test:e2e` — Ejecuta pruebas e2e

---

## Docker

Hay un `Dockerfile` multi-stage para producción y un `docker-compose.yml` para desarrollo local. Ejemplo:

```bash
# construir imagen
docker build -t api-gateway:local .
# o con docker-compose
docker compose up --build
```

---

## Pruebas y calidad

- Ejecuta `pnpm run lint` y corrige advertencias antes de abrir PR.
- Ejecuta `pnpm run test` para validar que las pruebas unitarias pasen.

---

## Notas sobre la refactorización 🔧

- Se añadieron `ConfigService` y `ProxyService` para centralizar configuración y llamadas HTTP.
- Se mejoró `JwtStrategy` y se añadieron tipos para evitar errores de ESLint/TypeScript; en algunos puntos se aplicaron comentarios dirigidos de ESLint para mitigar incompatibilidades de tipado con dependencias externas.
- El proyecto ya compila y linter pasa (`pnpm run build` y `pnpm run lint` comprobados).

---

## Siguiente paso: consolidar documentación 📋

He consolidado la documentación principal en este `README.md`. Si quieres que elimine o archive los archivos `.md` antiguos (`SETUP.md`, `REFACTORING_SUMMARY.md`, `README_REFACTORED.md`, `CHECKLIST.md`, `QUICKSTART.md`, `INSTALLATION_COMPLETE.txt`), dime si prefieres **eliminarlos** o **moverlos a `docs/archive/`** y lo haré.

---

## Contribuir

- Abre un issue describiendo el problema o la mejora.
- Crea un PR con tests y mantén el estilo del proyecto.

---

## Licencia

MIT

