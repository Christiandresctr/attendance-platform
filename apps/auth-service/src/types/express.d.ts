import 'express';
import { User } from '../auth/entities/user.entity'; // ⚡ ruta corregida

declare module 'express' {
  export interface Request {
    user?: User;
  }
}