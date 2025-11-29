import { NomePapel } from '@prisma/client';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: NomePapel[]) => import("@nestjs/common").CustomDecorator<string>;
