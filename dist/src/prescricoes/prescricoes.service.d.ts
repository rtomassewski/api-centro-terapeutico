import { PrismaService } from '../prisma.service';
import { CreatePrescricaoDto } from './dto/create-prescricao.dto';
import { Usuario } from '@prisma/client';
export declare class PrescricoesService {
    private prisma;
    constructor(prisma: PrismaService);
    private validarPaciente;
    create(dto: CreatePrescricaoDto, pacienteId: number, usuarioId: number): Promise<{
        usuario: {
            nome_completo: string;
        };
        produto: {
            nome: string;
        };
    } & {
        id: number;
        createdAt: Date;
        ativa: boolean;
        pacienteId: number;
        produtoId: number;
        quantidade_por_dose: number;
        dosagem: string | null;
        posologia: string;
        data_prescricao: Date;
        usuarioId: number;
    }>;
    findAllByPaciente(pacienteId: number, usuarioLogado: Usuario): Promise<({
        usuario: {
            nome_completo: string;
        };
        produto: {
            nome: string;
        };
    } & {
        id: number;
        createdAt: Date;
        ativa: boolean;
        pacienteId: number;
        produtoId: number;
        quantidade_por_dose: number;
        dosagem: string | null;
        posologia: string;
        data_prescricao: Date;
        usuarioId: number;
    })[]>;
}
