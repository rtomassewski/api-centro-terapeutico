import { PrismaService } from '../prisma.service';
import { CreateHistoricoMedicoDto } from './dto/create-historico-medico.dto';
import { UpdateHistoricoMedicoDto } from './dto/update-historico-medico.dto';
export declare class HistoricoMedicoService {
    private prisma;
    constructor(prisma: PrismaService);
    private validarPaciente;
    create(pacienteId: number, dto: CreateHistoricoMedicoDto, usuarioLogado: any): Promise<{
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        pacienteId: number;
        tipo: import("@prisma/client").$Enums.TipoEvolucao;
        usuarioPreencheuId: number;
        data_preenchimento: Date;
        alergias: string | null;
        condicoes_previas: string | null;
        medicamentos_uso_continuo: string | null;
        historico_familiar: string | null;
        historico_social: string | null;
        historico_uso_substancias: string | null;
    }>;
    findAllByPacienteId(pacienteId: number, usuarioLogado: any): Promise<({
        usuario_preencheu: {
            nome_completo: string;
        };
    } & {
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        pacienteId: number;
        tipo: import("@prisma/client").$Enums.TipoEvolucao;
        usuarioPreencheuId: number;
        data_preenchimento: Date;
        alergias: string | null;
        condicoes_previas: string | null;
        medicamentos_uso_continuo: string | null;
        historico_familiar: string | null;
        historico_social: string | null;
        historico_uso_substancias: string | null;
    })[]>;
    update(historicoId: number, dto: UpdateHistoricoMedicoDto, usuarioLogado: any): Promise<{
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        pacienteId: number;
        tipo: import("@prisma/client").$Enums.TipoEvolucao;
        usuarioPreencheuId: number;
        data_preenchimento: Date;
        alergias: string | null;
        condicoes_previas: string | null;
        medicamentos_uso_continuo: string | null;
        historico_familiar: string | null;
        historico_social: string | null;
        historico_uso_substancias: string | null;
    }>;
}
