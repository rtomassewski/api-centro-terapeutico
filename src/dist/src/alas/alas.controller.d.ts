import { AlasService } from './alas.service';
import { CreateAlaDto } from './dto/create-ala.dto';
import { UpdateAlaDto } from './dto/update-ala.dto';
export declare class AlasController {
    private readonly alasService;
    constructor(alasService: AlasService);
    create(createDto: CreateAlaDto, req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
    }>;
    findAll(req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
    }[]>;
    findOne(id: number, req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
    }>;
    update(id: number, updateDto: UpdateAlaDto, req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
    }>;
    remove(id: number, req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
    }>;
}
