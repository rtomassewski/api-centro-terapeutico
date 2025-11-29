import { CreateAlaDto } from './dto/create-ala.dto';
import { UpdateAlaDto } from './dto/update-ala.dto';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
export declare class AlasService {
    private prisma;
    constructor(prisma: PrismaService);
    private getAla;
    create(dto: CreateAlaDto, usuarioLogado: Usuario): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
    }>;
    findAll(usuarioLogado: Usuario): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
    }[]>;
    findOne(id: number, usuarioLogado: Usuario): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
    }>;
    update(id: number, dto: UpdateAlaDto, usuarioLogado: Usuario): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
    }>;
    remove(id: number, usuarioLogado: Usuario): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
    }>;
}
