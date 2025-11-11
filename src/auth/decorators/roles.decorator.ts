// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { NomePapel } from '@prisma/client'; // Importe o Enum

export const ROLES_KEY = 'roles';
export const Roles = (...roles: NomePapel[]) => SetMetadata(ROLES_KEY, roles);