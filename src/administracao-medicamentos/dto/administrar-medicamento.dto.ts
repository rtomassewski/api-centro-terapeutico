// src/administracao-medicamentos/dto/administrar-medicamento.dto.ts
import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StatusAdministracao } from '@prisma/client';

export class AdministrarMedicamentoDto {
  
  // 1. O novo status (não pode ser 'PENDENTE')
  @IsEnum(StatusAdministracao)
  @IsNotEmpty()
  @IsIn([
    StatusAdministracao.ADMINISTRADO,
    StatusAdministracao.RECUSADO,
    StatusAdministracao.NAO_ADMINISTRADO
  ])
  status: StatusAdministracao;

  // 2. Notas (ex: "Paciente recusou", "Paciente dormindo")
  @IsString()
  @IsOptional()
  notas?: string;
}