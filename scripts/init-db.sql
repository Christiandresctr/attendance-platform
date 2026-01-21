-- Configuración inicial de la base de datos
-- Extensión para UUID (necesaria para las entidades)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configuración de timezone y locale
SET timezone = 'America/Guayaquil';

-- Crear schema si no existe (opcional, TypeORM lo maneja)
-- CREATE SCHEMA IF NOT EXISTS public;

-- Mensaje de confirmación
DO $$
BEGIN
   RAISE NOTICE 'Base de datos auth_service_dev inicializada correctamente';
END $$;