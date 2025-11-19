import { AgendamentosService } from './agendamentos.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { QueryAgendamentoDto } from './dto/query-agendamento.dto';
export declare class AgendamentosController {
    private readonly agendamentosService;
    constructor(agendamentosService: AgendamentosService);
    create(createDto: CreateAgendamentoDto, req: any): Promise<{
        pacienteId: number;
        usuarioId: number;
        data_hora_inicio: Date;
        observacao: string | null;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        id: number;
        data_hora_fim: Date;
        notas: string | null;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
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
        pacienteId: number;
        usuarioId: number;
        data_hora_inicio: Date;
        observacao: string | null;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        id: number;
        data_hora_fim: Date;
        notas: string | null;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    update(agendamentoId: number, req: any, updateAgendamentoDto: UpdateAgendamentoDto): Promise<{
        paciente: {
            nome_completo: string;
        };
        usuario: {
            nome_completo: string;
        };
    } & {
        pacienteId: number;
        usuarioId: number;
        data_hora_inicio: Date;
        observacao: string | null;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        id: number;
        data_hora_fim: Date;
        notas: string | null;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
