import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { QueryAgendamentoDto } from './dto/query-agendamento.dto';
export declare class AgendamentosService {
    private prisma;
    constructor(prisma: PrismaService);
    private getAgendamento;
    private validarPrestador;
    create(dto: CreateAgendamentoDto, usuarioLogado: Usuario): Promise<{
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
    findAll(query: QueryAgendamentoDto, usuarioLogado: Usuario): Promise<({
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
    update(agendamentoId: number, clinicaId: number, updateAgendamentoDto: UpdateAgendamentoDto): Promise<{
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
