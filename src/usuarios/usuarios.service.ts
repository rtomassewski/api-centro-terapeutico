// src/usuarios/usuarios.service.ts
import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt'; // Importe o bcrypt

@Injectable()
export class UsuariosService {
  
  // "Injeta" o PrismaService para que possamos usá-lo com 'this.prisma'
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUsuarioDto) {
    // 1. Criptografar a senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(dto.senha, saltRounds);

    // 2. Salvar no banco
    const usuario = await this.prisma.usuario.create({
      data: {
        nome_completo: dto.nome_completo,
        email: dto.email,
        senha_hash: senhaHash, // Salva a senha criptografada
        registro_conselho: dto.registro_conselho,
        papelId: dto.papelId,
        ativo: true,
      },
      // 3. Selecionar o que será retornado (NUNCA retorne a senha)
      select: {
        id: true,
        nome_completo: true,
        email: true,
        ativo: true,
        papelId: true,
        createdAt: true,
      }
    });

    return usuario;
  }
async findAll() {
    // Busca todos os usuários
    return this.prisma.usuario.findMany({
      // Seleciona quais campos queremos retornar
      select: {
        id: true,
        nome_completo: true,
        email: true,
        ativo: true,
        registro_conselho: true,
        // Além dos campos do usuário, queremos incluir o "Papel"
        papel: {
          select: {
            nome: true, // Queremos apenas o nome do papel
          }
        }
      }
    });
  }
async findByEmail(email: string) {
    // Busca um usuário pelo e-mail
    return this.prisma.usuario.findUnique({
      where: {
        email: email,
      },
    });
  }
}


