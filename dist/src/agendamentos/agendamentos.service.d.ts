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
    findAll(query: QueryAgendamentoDto, usuarioLogado: Usuario): Promise<({
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
    update(agendamentoId: number, clinicaId: number, updateAgendamentoDto: UpdateAgendamentoDto): Promise<{
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
