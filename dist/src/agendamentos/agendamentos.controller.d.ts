import { AgendamentosService } from './agendamentos.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { QueryAgendamentoDto } from './dto/query-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
export declare class AgendamentosController {
    private readonly agendamentosService;
    constructor(agendamentosService: AgendamentosService);
    create(createDto: CreateAgendamentoDto, req: any): Promise<{
        usuario: {
            nome_completo: string;
        };
        paciente: {
            nome_completo: string;
        };
    } & {
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        pacienteId: number;
        usuarioId: number;
        data_hora_inicio: Date;
        data_hora_fim: Date;
        notas: string | null;
    }>;
    findAll(query: QueryAgendamentoDto, req: any): Promise<({
        usuario: {
            id: number;
            nome_completo: string;
        };
        paciente: {
            id: number;
            nome_completo: string;
        };
    } & {
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        pacienteId: number;
        usuarioId: number;
        data_hora_inicio: Date;
        data_hora_fim: Date;
        notas: string | null;
    })[]>;
    findOne(id: number, req: any): Promise<{
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        pacienteId: number;
        usuarioId: number;
        data_hora_inicio: Date;
        data_hora_fim: Date;
        notas: string | null;
    }>;
    update(id: number, updateDto: UpdateAgendamentoDto, req: any): Promise<{
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        pacienteId: number;
        usuarioId: number;
        data_hora_inicio: Date;
        data_hora_fim: Date;
        notas: string | null;
    }>;
    remove(id: number, req: any): Promise<{
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        pacienteId: number;
        usuarioId: number;
        data_hora_inicio: Date;
        data_hora_fim: Date;
        notas: string | null;
    }>;
}
