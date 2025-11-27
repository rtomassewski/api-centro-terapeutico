import { IsInt, IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { TipoEvolucao } from '@prisma/client';

export class CreateEvolucaoDto {
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @IsInt()
  @IsNotEmpty()
  pacienteId: number;

  @IsOptional()
  @IsEnum(TipoEvolucao)
  tipo?: TipoEvolucao; // GERAL, PSICOLOGICA, TERAPEUTICA

  // Importante: Recebemos o ID do agendamento para poder finalizá-lo
  @IsOptional()
  @IsInt()
  agendamentoId?: number;
}