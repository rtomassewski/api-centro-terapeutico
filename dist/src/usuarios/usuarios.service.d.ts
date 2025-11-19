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
        ativo: boolean;
        papelId: number;
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
        ativo: boolean;
        papelId: number;
    }>;
    remove(id: number, usuarioLogado: Usuario): Promise<{
        id: number;
        nome_completo: string;
        email: string;
        senha_hash: string;
        registro_conselho: string | null;
        ativo: boolean;
        papelId: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        assinatura_url: string | null;
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
                status: import("@prisma/client").$Enums.StatusLicenca;
                plano: import("@prisma/client").$Enums.TipoPlano;
                data_expiracao: Date;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            ativa: boolean;
            cnpj: string;
            razao_social: string;
            nome_fantasia: string;
            endereco: string | null;
            logo_url: string | null;
            telefone: string | null;
        };
    } & {
        id: number;
        nome_completo: string;
        email: string;
        senha_hash: string;
        registro_conselho: string | null;
        ativo: boolean;
        papelId: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        assinatura_url: string | null;
    }) | null>;
}
