import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
export declare class UsuariosService {
    private prisma;
    constructor(prisma: PrismaService);
    private getUsuario;
    create(dto: CreateUsuarioDto): Promise<{
        id: number;
        nome_completo: string;
        email: string;
        papelId: number;
        ativo: boolean;
        createdAt: Date;
    }>;
    findAll(usuarioLogado: Usuario): Promise<{
        id: number;
        papel: {
            nome: import("@prisma/client").$Enums.NomePapel;
        };
        nome_completo: string;
        email: string;
        ativo: boolean;
    }[]>;
    findOne(id: number, usuarioLogado: Usuario): Promise<{
        id: number;
        papel: {
            nome: import("@prisma/client").$Enums.NomePapel;
        };
        nome_completo: string;
        email: string;
        registro_conselho: string | null;
        ativo: boolean;
    }>;
    update(id: number, dto: UpdateUsuarioDto, usuarioLogado: Usuario): Promise<{
        id: number;
        nome_completo: string;
        email: string;
        papelId: number;
        ativo: boolean;
    }>;
    remove(id: number, usuarioLogado: Usuario): Promise<{
        id: number;
        nome_completo: string;
        email: string;
        papelId: number;
        clinicaId: number;
        registro_conselho: string | null;
        ativo: boolean;
        assinatura_url: string | null;
        senha_hash: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<({
        papel: {
            nome: import("@prisma/client").$Enums.NomePapel;
            descricao: string | null;
            id: number;
        };
        clinica: {
            licenca: {
                id: number;
                clinicaId: number;
                plano: import("@prisma/client").$Enums.TipoPlano;
                status: import("@prisma/client").$Enums.StatusLicenca;
                data_expiracao: Date;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            razao_social: string;
            nome_fantasia: string;
            cnpj: string;
            ativa: boolean;
            endereco: string | null;
            logo_url: string | null;
            telefone: string | null;
        };
    } & {
        id: number;
        nome_completo: string;
        email: string;
        papelId: number;
        clinicaId: number;
        registro_conselho: string | null;
        ativo: boolean;
        assinatura_url: string | null;
        senha_hash: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findAllPapeis(): Promise<{
        nome: import("@prisma/client").$Enums.NomePapel;
        descricao: string | null;
        id: number;
    }[]>;
}
