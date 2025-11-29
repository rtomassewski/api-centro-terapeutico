import { EvolucoesService } from './evolucoes.service';
import { CreateEvolucaoDto } from './dto/create-evolucao.dto';
export declare class EvolucoesController {
    private readonly evolucoesService;
    constructor(evolucoesService: EvolucoesService);
    create(createEvolucaoDto: CreateEvolucaoDto, req: any): Promise<{
        usuario: {
            papel: {
                nome: import("@prisma/client").$Enums.NomePapel;
            };
            nome_completo: string;
        };
    } & {
        descricao: string;
        id: number;
        createdAt: Date;
        pacienteId: number;
        usuarioId: number;
        tipo: import("@prisma/client").$Enums.TipoEvolucao;
        data_evolucao: Date;
    }>;
    findAllByPaciente(id: string, req: any): Promise<({
        usuario: {
            papel: {
                nome: import("@prisma/client").$Enums.NomePapel;
            };
            nome_completo: string;
        };
    } & {
        descricao: string;
        id: number;
        createdAt: Date;
        pacienteId: number;
        usuarioId: number;
        tipo: import("@prisma/client").$Enums.TipoEvolucao;
        data_evolucao: Date;
    })[]>;
}
