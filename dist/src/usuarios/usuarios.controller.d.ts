import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    create(createUsuarioDto: CreateUsuarioDto): Promise<{
        id: number;
        nome_completo: string;
        email: string;
        papelId: number;
        ativo: boolean;
        createdAt: Date;
    }>;
    listarPapeis(): Promise<{
        nome: import("@prisma/client").$Enums.NomePapel;
        descricao: string | null;
        id: number;
    }[]>;
    findAll(req: any): Promise<{
        id: number;
        papel: {
            nome: import("@prisma/client").$Enums.NomePapel;
        };
        nome_completo: string;
        email: string;
        ativo: boolean;
    }[]>;
    findOne(id: number, req: any): Promise<{
        id: number;
        papel: {
            nome: import("@prisma/client").$Enums.NomePapel;
        };
        nome_completo: string;
        email: string;
        registro_conselho: string | null;
        ativo: boolean;
    }>;
    update(id: number, updateUsuarioDto: UpdateUsuarioDto, req: any): Promise<{
        id: number;
        nome_completo: string;
        email: string;
        papelId: number;
        ativo: boolean;
    }>;
    remove(id: number, req: any): Promise<{
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
}
