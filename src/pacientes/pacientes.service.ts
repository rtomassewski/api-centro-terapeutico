// src/pacientes/pacientes.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client'; // Importante para tratar erros

@Injectable()
export class PacientesService {

  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePacienteDto) {
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
}
