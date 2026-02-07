import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const ROLES = {
  ADMINISTRADOR: 'ADMINISTRADOR',
  PROFESOR: 'PROFESOR',
  ESTUDIANTE: 'ESTUDIANTE'
};