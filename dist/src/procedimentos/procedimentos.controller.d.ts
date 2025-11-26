import { ProcedimentosService } from './procedimentos.service';
import { CreateProcedimentoDto } from './dto/create-procedimento.dto';
import { UpdateProcedimentoDto } from './dto/update-procedimento.dto';
export declare class ProcedimentosController {
    private readonly procedimentosService;
    constructor(procedimentosService: ProcedimentosService);
    create(createDto: CreateProcedimentoDto, req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        valor: number;
    }>;
    findAll(req: any, ativos?: string): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        valor: number;
    }[]>;
    findOne(id: string, req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        valor: number;
    }>;
    update(id: string, updateDto: UpdateProcedimentoDto, req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        valor: number;
    }>;
    remove(id: string, req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        valor: number;
    }>;
}
