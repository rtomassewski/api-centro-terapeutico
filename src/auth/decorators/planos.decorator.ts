// src/auth/decorators/planos.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { TipoPlano } from '@prisma/client';

export const PLANOS_KEY = 'planos';
export const Planos = (...planos: TipoPlano[]) => SetMetadata(PLANOS_KEY, planos);