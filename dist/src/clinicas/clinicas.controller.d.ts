import { ClinicasService } from './clinicas.service';
import { CreateClinicaDto } from './dto/create-clinica.dto';
import { UpdateClinicaDto } from './dto/update-clinica.dto';
export declare class ClinicasController {
    private readonly clinicasService;
    constructor(clinicasService: ClinicasService);
    create(createDto: CreateClinicaDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        razao_social: string;
        nome_fantasia: string;
        cnpj: string;
        ativa: boolean;
        logo_url: string | null;
        endereco: string | null;
        telefone: string | null;
    }>;
    update(id: number, updateDto: UpdateClinicaDto, req: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        razao_social: string;
        nome_fantasia: string;
        cnpj: string;
        ativa: boolean;
        logo_url: string | null;
        endereco: string | null;
        telefone: string | null;
    }>;
}
