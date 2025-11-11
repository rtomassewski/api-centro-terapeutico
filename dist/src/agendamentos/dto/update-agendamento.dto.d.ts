import { CreateAgendamentoDto } from './create-agendamento.dto';
import { StatusAgendamento } from '@prisma/client';
declare const UpdateAgendamentoDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateAgendamentoDto>>;
export declare class UpdateAgendamentoDto extends UpdateAgendamentoDto_base {
    status?: StatusAgendamento;
}
export {};
