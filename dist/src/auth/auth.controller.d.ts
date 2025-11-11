import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
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
    updatePerfil(req: any, dto: UpdatePerfilDto): Promise<{
        id: number;
        nome_completo: string;
        email: string;
        registro_conselho: string | null;
        assinatura_url: string | null;
    }>;
}
