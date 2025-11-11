import { QuartosService } from './quartos.service';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { UpdateQuartoDto } from './dto/update-quarto.dto';
import { QueryQuartoDto } from './dto/query-quarto.dto';
export declare class QuartosController {
    private readonly quartosService;
    constructor(quartosService: QuartosService);
    create(createDto: CreateQuartoDto, req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        alaId: number;
    }>;
    findAll(req: any, query: QueryQuartoDto): Promise<({
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
    findOne(id: number, req: any): Promise<({
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
    update(id: number, updateDto: UpdateQuartoDto, req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        alaId: number;
    }>;
    remove(id: number, req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        alaId: number;
    }>;
}
