import { CreateLeitoDto } from './create-leito.dto';
import { StatusLeito } from '@prisma/client';
declare const UpdateLeitoDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateLeitoDto>>;
export declare class UpdateLeitoDto extends UpdateLeitoDto_base {
    status?: StatusLeito;
}
export {};
