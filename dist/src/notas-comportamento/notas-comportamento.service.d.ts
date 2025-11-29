import { CreateNotaComportamentoDto } from './dto/create-nota-comportamento.dto';
import { UpdateNotaComportamentoDto } from './dto/update-notas-comportamento.dto';
import { QueryNotaComportamentoDto } from './dto/query-nota-comportamento.dto';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
export declare class NotasComportamentoService {
    private prisma;
    constructor(prisma: PrismaService);
    private validarPaciente;
    private getNota;
    create(dto: CreateNotaComportamentoDto, usuarioLogado: Usuario): Promise<{
        id: number;
        clinicaId: number;
        pacienteId: number;
        observacao: string | null;
        nota: import("@prisma/client").$Enums.RatingComportamento;
        data_registro: Date;
        usuarioRegistrouId: number;
    }>;
    findAll(query: QueryNotaComportamentoDto, usuarioLogado: Usuario): Promise<({
        usuario_registrou: {
            nome_completo: string;
        };
    } & {
        id: number;
        clinicaId: number;
        pacienteId: number;
        observacao: string | null;
        nota: import("@prisma/client").$Enums.RatingComportamento;
        data_registro: Date;
        usuarioRegistrouId: number;
    })[]>;
    findOne(id: number, usuarioLogado: Usuario): Promise<{
        id: number;
        clinicaId: number;
        pacienteId: number;
        observacao: string | null;
        nota: import("@prisma/client").$Enums.RatingComportamento;
        data_registro: Date;
        usuarioRegistrouId: number;
    }>;
    update(id: number, dto: UpdateNotaComportamentoDto, usuarioLogado: Usuario): Promise<{
        id: number;
        clinicaId: number;
        pacienteId: number;
        observacao: string | null;
        nota: import("@prisma/client").$Enums.RatingComportamento;
        data_registro: Date;
        usuarioRegistrouId: number;
    }>;
    remove(id: number, usuarioLogado: Usuario): Promise<{
        id: number;
        clinicaId: number;
        pacienteId: number;
        observacao: string | null;
        nota: import("@prisma/client").$Enums.RatingComportamento;
        data_registro: Date;
        usuarioRegistrouId: number;
    }>;
}
