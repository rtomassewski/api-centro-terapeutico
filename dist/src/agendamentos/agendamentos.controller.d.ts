import { AgendamentosService } from './agendamentos.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { QueryAgendamentoDto } from './dto/query-agendamento.dto';
export declare class AgendamentosController {
    private readonly agendamentosService;
    constructor(agendamentosService: AgendamentosService);
    create(createDto: CreateAgendamentoDto, req: any): Promise<{
        data_hora_inicio: Date;
        data_hora_fim: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        notas: string | null;
        observacao: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        clinicaId: number;
        pacienteId: number;
        usuarioId: number;
    }>;
    findAll(query: QueryAgendamentoDto, req: any): Promise<({
        paciente: {
            id: number;
            nome_completo: string;
        };
        usuario: {
            nome_completo: string;
        };
    } & {
        data_hora_inicio: Date;
        data_hora_fim: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        notas: string | null;
        observacao: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        clinicaId: number;
        pacienteId: number;
        usuarioId: number;
    })[]>;
    update(agendamentoId: number, req: any, updateAgendamentoDto: UpdateAgendamentoDto): Promise<{
        paciente: {
            nome_completo: string;
        };
        usuario: {
            nome_completo: string;
        };
    } & {
        data_hora_inicio: Date;
        data_hora_fim: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        notas: string | null;
        observacao: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        clinicaId: number;
        pacienteId: number;
        usuarioId: number;
    }>;
}
