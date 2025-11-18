import { LeitosService } from './leitos.service';
import { CreateLeitoDto } from './dto/create-leito.dto';
import { UpdateLeitoDto } from './dto/update-leito.dto';
import { QueryLeitoDto } from './dto/query-leito.dto';
export declare class LeitosController {
    private readonly leitosService;
    constructor(leitosService: LeitosService);
    create(createDto: CreateLeitoDto, req: any): Promise<{
        nome: string;
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusLeito;
        quartoId: number;
        pacienteId: number | null;
    }>;
    findAll(req: any, query: QueryLeitoDto): Promise<({
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
    findOne(id: number, req: any): Promise<({
        paciente: {
            id: number;
            nome_completo: string;
            clinicaId: number;
            nome_social: string | null;
            data_nascimento: Date;
            cpf: string;
            nome_responsavel: string;
            telefone_responsavel: string;
            status: import("@prisma/client").$Enums.StatusPaciente;
            data_admissao: Date;
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
    update(id: number, updateDto: UpdateLeitoDto, req: any): Promise<{
        nome: string;
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusLeito;
        quartoId: number;
        pacienteId: number | null;
    }>;
    remove(id: number, req: any): Promise<{
        nome: string;
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusLeito;
        quartoId: number;
        pacienteId: number | null;
    }>;
}
