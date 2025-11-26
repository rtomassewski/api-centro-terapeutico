import { AdministracaoMedicamentosService } from './administracao-medicamentos.service';
import { CreateAdministracaoMedicamentoDto } from './dto/create-administracao-medicamento.dto';
import { AdministrarMedicamentoDto } from './dto/administrar-medicamento.dto';
import { QueryAdministracaoMedicamentoDto } from './dto/query-administracao-medicamento.dto';
export declare class AdministracaoMedicamentosController {
    private readonly service;
    constructor(service: AdministracaoMedicamentosService);
    create(createDto: CreateAdministracaoMedicamentoDto, req: any): Promise<{
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusAdministracao;
        pacienteId: number;
        data_hora_prevista: Date;
        prescricaoId: number;
        notas: string | null;
        usuarioAdministrouId: number | null;
        data_hora_administracao: Date | null;
    }>;
    administrar(id: number, dto: AdministrarMedicamentoDto, req: any): Promise<{
        administracao: {
            id: number;
            clinicaId: number;
            status: import("@prisma/client").$Enums.StatusAdministracao;
            pacienteId: number;
            data_hora_prevista: Date;
            prescricaoId: number;
            notas: string | null;
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
    findAll(req: any, query: QueryAdministracaoMedicamentoDto): Promise<({
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
        data_hora_prevista: Date;
        prescricaoId: number;
        notas: string | null;
        usuarioAdministrouId: number | null;
        data_hora_administracao: Date | null;
    })[]>;
    findOne(id: number, req: any): Promise<({
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
        data_hora_prevista: Date;
        prescricaoId: number;
        notas: string | null;
        usuarioAdministrouId: number | null;
        data_hora_administracao: Date | null;
    }) | null>;
}
