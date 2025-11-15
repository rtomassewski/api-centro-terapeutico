import { CreateClinicaDto } from './dto/create-clinica.dto';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
import { UpdateClinicaDto } from './dto/update-clinica.dto';
export declare class ClinicasService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateClinicaDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        ativa: boolean;
        nome_fantasia: string;
        cnpj: string;
        razao_social: string;
        logo_url: string | null;
        endereco: string | null;
        telefone: string | null;
    }>;
    update(id: number, dto: UpdateClinicaDto, usuarioLogado: Usuario): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        ativa: boolean;
        nome_fantasia: string;
        cnpj: string;
        razao_social: string;
        logo_url: string | null;
        endereco: string | null;
        telefone: string | null;
    }>;
}
