import { CreateQuartoDto } from './dto/create-quarto.dto';
import { UpdateQuartoDto } from './dto/update-quarto.dto';
import { QueryQuartoDto } from './dto/query-quarto.dto';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
export declare class QuartosService {
    private prisma;
    constructor(prisma: PrismaService);
    private getQuarto;
    private validarAla;
    create(dto: CreateQuartoDto, usuarioLogado: Usuario): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        alaId: number;
    }>;
    findAll(query: QueryQuartoDto, usuarioLogado: Usuario): Promise<({
        ala: {
            nome: string;
        };
    } & {
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        alaId: number;
    })[]>;
    findOne(id: number, usuarioLogado: Usuario): Promise<({
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
    }) | null>;
    update(id: number, dto: UpdateQuartoDto, usuarioLogado: Usuario): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        alaId: number;
    }>;
    remove(id: number, usuarioLogado: Usuario): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        alaId: number;
    }>;
}
