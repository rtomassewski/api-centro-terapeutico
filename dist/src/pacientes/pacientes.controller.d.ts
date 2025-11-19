import { PrescricoesService } from '../prescricoes/prescricoes.service';
import { CreatePrescricaoDto } from '../prescricoes/dto/create-prescricao.dto';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { EvolucoesService } from '../evolucoes/evolucoes.service';
import { CreateEvolucaoDto } from '../evolucoes/dto/create-evolucao.dto';
import { CheckInPacienteDto } from './dto/check-in-paciente.dto';
import { QueryPacienteDto } from './dto/query-paciente.dto';
import { HistoricoMedicoService } from '../historico-medico/historico-medico.service';
import { CreateHistoricoMedicoDto } from '../historico-medico/dto/create-historico-medico.dto';
import { UpdateHistoricoMedicoDto } from '../historico-medico/dto/update-historico-medico.dto';
export declare class PacientesController {
    private readonly pacientesService;
    private readonly evolucoesService;
    private readonly prescricoesService;
    private readonly historicoMedicoService;
    constructor(pacientesService: PacientesService, evolucoesService: EvolucoesService, prescricoesService: PrescricoesService, historicoMedicoService: HistoricoMedicoService);
    create(createPacienteDto: CreatePacienteDto, req: any): Promise<{
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
    }>;
    findAll(req: any, query: QueryPacienteDto): Promise<{
        id: number;
        nome_completo: string;
        nome_social: string | null;
        data_nascimento: Date;
        status: import("@prisma/client").$Enums.StatusPaciente;
    }[]>;
    findOne(pacienteId: number, req: any): Promise<{
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
    }>;
    update(pacienteId: number, updatePacienteDto: UpdatePacienteDto, req: any): Promise<{
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
    }>;
    checkIn(pacienteId: number, dto: CheckInPacienteDto, req: any): Promise<{
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
    }>;
    checkOut(pacienteId: number, req: any): Promise<{
        nome: string;
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusLeito;
        quartoId: number;
        pacienteId: number | null;
    }>;
    createHistorico(pacienteId: number, dto: CreateHistoricoMedicoDto, req: any): Promise<{
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
    getHistorico(pacienteId: number, req: any): Promise<({
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
    updateHistorico(pacienteId: number, dto: UpdateHistoricoMedicoDto, req: any): Promise<{
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
    createEvolucao(pacienteId: number, dto: CreateEvolucaoDto, req: any): Promise<{
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
    findEvolucoes(pacienteId: number, req: any): Promise<({
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
    createPrescricao(pacienteId: number, dto: CreatePrescricaoDto, req: any): Promise<{
        usuario: {
            nome_completo: string;
        };
        produto: {
            nome: string;
        };
    } & {
        id: number;
        createdAt: Date;
        pacienteId: number;
        quantidade_por_dose: number;
        dosagem: string | null;
        posologia: string;
        data_prescricao: Date;
        ativa: boolean;
        produtoId: number;
        usuarioId: number;
    }>;
    findPrescricoes(pacienteId: number, req: any): Promise<({
        usuario: {
            nome_completo: string;
        };
        produto: {
            nome: string;
        };
    } & {
        id: number;
        createdAt: Date;
        pacienteId: number;
        quantidade_por_dose: number;
        dosagem: string | null;
        posologia: string;
        data_prescricao: Date;
        ativa: boolean;
        produtoId: number;
        usuarioId: number;
    })[]>;
}
