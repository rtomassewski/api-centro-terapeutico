import { PrismaService } from '../prisma.service';
import { CreateProcedimentoDto } from './dto/create-procedimento.dto';
import { UpdateProcedimentoDto } from './dto/update-procedimento.dto';
export declare class ProcedimentosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateProcedimentoDto, clinicaId: number): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        valor: number;
    }>;
    findAll(clinicaId: number, apenasAtivos?: boolean): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        valor: number;
    }[]>;
    findOne(id: number, clinicaId: number): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        valor: number;
    }>;
    update(id: number, clinicaId: number, updateDto: UpdateProcedimentoDto): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        valor: number;
    }>;
    remove(id: number, clinicaId: number): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        valor: number;
    }>;
}
