import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { PrismaService } from '../prisma.service';
export declare class AuthService {
    private usuariosService;
    private jwtService;
    private prisma;
    constructor(usuariosService: UsuariosService, jwtService: JwtService, prisma: PrismaService);
    validateUser(email: string, pass: string): Promise<any>;
    login(usuario: any): Promise<{
        access_token: string;
        usuario: {
            id: any;
            nome: any;
            email: any;
            papelId: any;
            clinicaId: any;
            licenca: any;
            clinica: any;
        };
    }>;
    updatePerfil(userId: number, dto: UpdatePerfilDto): Promise<{
        id: number;
        nome_completo: string;
        email: string;
        registro_conselho: string | null;
        assinatura_url: string | null;
    }>;
}
