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
        ativo: boolean;
        papelId: number;
        createdAt: Date;
    }>;
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
        ativo: boolean;
        papelId: number;
    }>;
    remove(id: number, req: any): Promise<{
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
}
