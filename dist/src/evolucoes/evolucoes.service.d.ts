import { CreateEvolucaoDto } from './dto/create-evolucao.dto';
import { PrismaService } from '../prisma.service';
export declare class EvolucoesService {
    private prisma;
    constructor(prisma: PrismaService);
    private validarPaciente;
    create(dto: CreateEvolucaoDto, pacienteId: number, usuarioLogado: any): Promise<{
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
    findAllByPaciente(pacienteId: number, usuarioLogado: any): Promise<({
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
