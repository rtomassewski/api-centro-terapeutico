import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { QueryAgendamentoDto } from './dto/query-agendamento.dto';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
export declare class AgendamentosService {
    private prisma;
    constructor(prisma: PrismaService);
    private validarEntidades;
    private checarConflito;
    create(dto: CreateAgendamentoDto, usuarioLogado: Usuario): Promise<{
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
    findAll(query: QueryAgendamentoDto, usuarioLogado: Usuario): Promise<({
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
    private getAgendamento;
    findOne(id: number, usuarioLogado: Usuario): Promise<{
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
    update(id: number, dto: UpdateAgendamentoDto, usuarioLogado: Usuario): Promise<{
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
    remove(id: number, usuarioLogado: Usuario): Promise<{
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
