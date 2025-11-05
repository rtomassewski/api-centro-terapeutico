// src/pacientes/pacientes.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client'; // Importante para tratar erros
import { Usuario } from '@prisma/client';

@Injectable()
export class PacientesService {

  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePacienteDto, usuarioLogado: any) {
    try {
      // Tenta criar o paciente
      const paciente = await this.prisma.paciente.create({
        data: {
          nome_completo: dto.nome_completo,
          nome_social: dto.nome_social,
          data_nascimento: dto.data_nascimento, // Prisma converte a string ISO
          cpf: dto.cpf,
          nome_responsavel: dto.nome_responsavel,
          telefone_responsavel: dto.telefone_responsavel,
          clinicaId: usuarioLogado.clinicaId,
          // Status e data_admissao são definidos por @default() no schema
        },
      });
      return paciente;

    } catch (error) {
      // Verifica se o erro é de "Violação de constraint Única"
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' // Código de erro do Prisma para "Unique constraint failed"
      ) {
        // Verifica se a falha foi no campo 'cpf'
        if ((error.meta?.target as string[]).includes('cpf')) {
          throw new ConflictException('Já existe um paciente cadastrado com este CPF.');
        }
      }
      // Se for outro erro, apenas o relança
      throw error;
    }
  }
  async findAll(usuarioLogado: Usuario) {
    // 3. Pega o ID da clínica do usuário logado no token
    const clinicaId = usuarioLogado.clinicaId;

    // 4. Busca no banco
    return this.prisma.paciente.findMany({
      // 5. O FILTRO DE SEGURANÇA!
      where: {
        clinicaId: clinicaId,
      },
      // 6. Seleciona apenas os campos úteis para uma lista
      select: {
        id: true,
        nome_completo: true,
        nome_social: true,
        data_nascimento: true,
        status: true,
      },
      // 7. Ordena por nome
      orderBy: {
        nome_completo: 'asc',
      },
    });
  }
  async findOne(pacienteId: number, usuarioLogado: Usuario) {
    // 1. Busca o paciente pelo ID E pelo clinicaId (o filtro de segurança)
    const paciente = await this.prisma.paciente.findFirst({
      where: {
        id: pacienteId,
        clinicaId: usuarioLogado.clinicaId,
      },
    });

    // 2. Se não encontrar (ou não pertencer à clínica), retorne 404
    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado ou não pertence a esta clínica.');
    }

    // 3. Retorna o paciente com todos os dados
    return paciente;
  }
}
