// src/auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { NomePapel } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: NomePapel[]) => SetMetadata(ROLES_KEY, roles);
