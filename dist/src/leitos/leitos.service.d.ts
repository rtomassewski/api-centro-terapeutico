import { CreateLeitoDto } from './dto/create-leito.dto';
import { UpdateLeitoDto } from './dto/update-leito.dto';
import { QueryLeitoDto } from './dto/query-leito.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, Usuario } from '@prisma/client';
export declare class LeitosService {
    private prisma;
    constructor(prisma: PrismaService);
    private getLeito;
    private validarQuarto;
    create(dto: CreateLeitoDto, usuarioLogado: Usuario): Promise<{
        nome: string;
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusLeito;
        quartoId: number;
        pacienteId: number | null;
    }>;
    findAll(query: QueryLeitoDto, usuarioLogado: Usuario): Promise<({
        paciente: {
            id: number;
            nome_completo: string;
        } | null;
        quarto: {
            nome: string;
        };
    } & {
        nome: string;
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusLeito;
        quartoId: number;
        pacienteId: number | null;
    })[]>;
    findOne(id: number, usuarioLogado: Usuario): Promise<({
        paciente: {
            id: number;
            nome_completo: string;
            clinicaId: number;
            status: import("@prisma/client").$Enums.StatusPaciente;
            nome_social: string | null;
            data_nascimento: Date;
            cpf: string;
            nome_responsavel: string;
            telefone_responsavel: string;
            data_admissao: Date;
            saldo: Prisma.Decimal;
        } | null;
        quarto: {
            ala: {
                nome: string;
                descricao: string | null;
                id: number;
                clinicaId: number;
            };
        } & {
            nome: string;
            descricao: string | null;
            id: number;
            clinicaId: number;
            alaId: number;
        };
    } & {
        nome: string;
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusLeito;
        quartoId: number;
        pacienteId: number | null;
    }) | null>;
    update(id: number, dto: UpdateLeitoDto, usuarioLogado: Usuario): Promise<{
        nome: string;
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusLeito;
        quartoId: number;
        pacienteId: number | null;
    }>;
    remove(id: number, usuarioLogado: Usuario): Promise<{
        nome: string;
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusLeito;
        quartoId: number;
        pacienteId: number | null;
    }>;
}
