import { CreatePacienteDto } from './dto/create-paciente.dto';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { Usuario } from '@prisma/client';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { CheckInPacienteDto } from './dto/check-in-paciente.dto';
import { QueryPacienteDto } from './dto/query-paciente.dto';
export declare class PacientesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePacienteDto, usuarioLogado: any): Promise<{
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
    }>;
    findAll(query: QueryPacienteDto, usuarioLogado: Usuario): Promise<{
        id: number;
        nome_completo: string;
        status: import("@prisma/client").$Enums.StatusPaciente;
        nome_social: string | null;
        data_nascimento: Date;
    }[]>;
    findOne(pacienteId: number, usuarioLogado: Usuario): Promise<{
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
    }>;
    update(pacienteId: number, dto: UpdatePacienteDto, usuarioLogado: Usuario): Promise<{
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
    }>;
    checkIn(pacienteId: number, dto: CheckInPacienteDto, usuarioLogado: Usuario): Promise<{
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
    }>;
    checkOut(pacienteId: number, usuarioLogado: Usuario): Promise<{
        nome: string;
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusLeito;
        quartoId: number;
        pacienteId: number | null;
    }>;
}
