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
        data_evolucao: Date;
        tipo: import("@prisma/client").$Enums.TipoEvolucao;
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
        data_evolucao: Date;
        tipo: import("@prisma/client").$Enums.TipoEvolucao;
    })[]>;
}
