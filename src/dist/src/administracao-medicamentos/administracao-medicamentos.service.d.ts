import { CreateAdministracaoMedicamentoDto } from './dto/create-administracao-medicamento.dto';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
import { AdministrarMedicamentoDto } from './dto/administrar-medicamento.dto';
import { QueryAdministracaoMedicamentoDto } from './dto/query-administracao-medicamento.dto';
export declare class AdministracaoMedicamentosService {
    private prisma;
    constructor(prisma: PrismaService);
    private getAdministracao;
    private validarEntidades;
    create(dto: CreateAdministracaoMedicamentoDto, usuarioLogado: Usuario): Promise<{
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusAdministracao;
        pacienteId: number;
        notas: string | null;
        data_hora_prevista: Date;
        prescricaoId: number;
        usuarioAdministrouId: number | null;
        data_hora_administracao: Date | null;
    }>;
    administrar(id: number, dto: AdministrarMedicamentoDto, usuarioLogado: Usuario): Promise<{
        administracao: {
            id: number;
            clinicaId: number;
            status: import("@prisma/client").$Enums.StatusAdministracao;
            pacienteId: number;
            notas: string | null;
            data_hora_prevista: Date;
            prescricaoId: number;
            usuarioAdministrouId: number | null;
            data_hora_administracao: Date | null;
        };
        saida_estoque: {
            id: number;
            clinicaId: number;
            produtoId: number;
            usuarioId: number;
            quantidade: number;
            data_saida: Date;
            motivo: string | null;
            administracaoId: number | null;
        } | null;
        estoque_atual: number | undefined;
    }>;
    findAll(query: QueryAdministracaoMedicamentoDto, usuarioLogado: Usuario): Promise<({
        paciente: {
            nome_completo: string;
        };
        prescricao: {
            produto: {
                nome: string;
            };
            quantidade_por_dose: number;
            dosagem: string | null;
        };
        usuario_administrou: {
            nome_completo: string;
        } | null;
    } & {
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusAdministracao;
        pacienteId: number;
        notas: string | null;
        data_hora_prevista: Date;
        prescricaoId: number;
        usuarioAdministrouId: number | null;
        data_hora_administracao: Date | null;
    })[]>;
    findOne(id: number, usuarioLogado: Usuario): Promise<({
        paciente: {
            nome_completo: string;
        };
        prescricao: {
            produto: {
                nome: string;
            };
            dosagem: string | null;
            posologia: string;
        };
        usuario_administrou: {
            nome_completo: string;
        } | null;
    } & {
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusAdministracao;
        pacienteId: number;
        notas: string | null;
        data_hora_prevista: Date;
        prescricaoId: number;
        usuarioAdministrouId: number | null;
        data_hora_administracao: Date | null;
    }) | null>;
}
