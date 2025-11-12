// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { StatusLicenca, TipoPlano, Prisma, NomePapel } from '@prisma/client';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { PrismaService } from '../prisma.service';
import { CreateTrialDto } from './dto/create-trial.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /**
   * Valida se um usuário existe e se a senha está correta.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const usuario = await this.usuariosService.findByEmail(email);

    if (usuario) {
      const isMatch = await bcrypt.compare(pass, usuario.senha_hash);
      
      // --- CORREÇÃO AQUI ---
      // Checa a senha E se o usuário está ativo
      if (isMatch && usuario.ativo) { 
        const { senha_hash, ...result } = usuario;
        return result;
      }
    }

    // 4. Se não encontrar ou a senha não bater, lança exceção
    throw new UnauthorizedException('E-mail ou senha inválidos.');
  }

  /**
   * Gera o Token JWT para o usuário validado
   */
  async login(usuario: any) {
    if (!usuario.clinica?.licenca) {
      throw new UnauthorizedException('Clínica ou licença não encontrada.');
    }

    const licenca = usuario.clinica.licenca;
    const payload = { 
      sub: usuario.id, // 'sub' (subject) é o padrão do JWT para o ID
      email: usuario.email,
      papelId: usuario.papelId,
      clinicaId: usuario.clinicaId,
      licencaStatus: licenca.status as StatusLicenca,
      licencaPlano: licenca.plano as TipoPlano,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nome: usuario.nome_completo,
        email: usuario.email,
        papelId: usuario.papelId,
        clinicaId: usuario.clinicaId,
        licenca: licenca,
        clinica: usuario.clinica,
      }
    };
  }
  async updatePerfil(userId: number, dto: UpdatePerfilDto) {
    // A validação do DTO já impediu que campos
    // sensíveis (como papelId) fossem enviados.
    
    return this.prisma.usuario.update({
      where: {
        id: userId, // Atualiza apenas o ID do token
      },
      data: dto, // Passa os dados permitidos
      select: {
        // Retorna o perfil atualizado (sem a senha)
        id: true,
        nome_completo: true,
        email: true,
        registro_conselho: true,
        assinatura_url: true,
      },
    });
  }
  async createTrial(dto: CreateTrialDto) {
    // 1. Verificar se os dados já existem (E-mail ou CNPJ)
    const emailExists = await this.prisma.usuario.findUnique({
      where: { email: dto.email_admin },
    });
    if (emailExists) {
      throw new ConflictException('Este e-mail já está em uso.');
    }
    const cnpjExists = await this.prisma.clinica.findUnique({
      where: { cnpj: dto.cnpj },
    });
    if (cnpjExists) {
      throw new ConflictException('Este CNPJ já está registado.');
    }

    // 2. Preparar dados
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(dto.senha_admin, saltRounds);
    const dataExpiracaoTeste = new Date();
    dataExpiracaoTeste.setDate(dataExpiracaoTeste.getDate() + 30); // 30 dias

    // 3. A Transação (Tudo ou Nada)
    try {
      const [novaClinica, novoUsuario] = await this.prisma.$transaction(async (tx) => {
        // 3a. Criar a Clínica
        const clinica = await tx.clinica.create({
          data: {
            nome_fantasia: dto.nome_fantasia,
            razao_social: `${dto.nome_fantasia} LTDA`, // (Razão Social Padrão)
            cnpj: dto.cnpj,
            ativa: true,
          },
        });

        // 3b. Criar a Licença de TESTE
        await tx.licenca.create({
          data: {
            plano: TipoPlano.TESTE,
            status: StatusLicenca.TESTE,
            data_expiracao: dataExpiracaoTeste,
            clinicaId: clinica.id,
          },
        });

        // 3c. Criar o Utilizador Admin (Papel 1)
        const usuario = await tx.usuario.create({
          data: {
            nome_completo: dto.nome_admin,
            email: dto.email_admin,
            senha_hash: senhaHash,
            ativo: true,
            papelId: 1, // 1 = ADMINISTRADOR
            clinicaId: clinica.id,
          },
        });

        return [clinica, usuario];
      });

      // 4. (Sucesso) Fazer o login do novo utilizador
      // (Precisamos de buscar o utilizador com os 'includes' que o login() espera)
      const usuarioCompleto = await this.usuariosService.findByEmail(novoUsuario.email);
      
      return this.login(usuarioCompleto); // Retorna o JWT

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // (Segurança extra se a verificação inicial falhar)
        if (error.code === 'P2002') {
          throw new ConflictException('E-mail ou CNPJ já registado.');
        }
      }
      throw new InternalServerErrorException('Erro ao criar a conta de teste.');
    }
  }
}
