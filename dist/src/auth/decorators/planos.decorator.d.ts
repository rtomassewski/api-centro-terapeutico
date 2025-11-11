import { TipoPlano } from '@prisma/client';
export declare const PLANOS_KEY = "planos";
export declare const Planos: (...planos: TipoPlano[]) => import("@nestjs/common").CustomDecorator<string>;
