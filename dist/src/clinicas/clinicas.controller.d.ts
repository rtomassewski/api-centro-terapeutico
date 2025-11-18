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
        ativa: boolean;
        nome_fantasia: string;
        cnpj: string;
        razao_social: string;
        logo_url: string | null;
        endereco: string | null;
        telefone: string | null;
    }>;
    update(id: number, updateDto: UpdateClinicaDto, req: any): Promise<{
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
