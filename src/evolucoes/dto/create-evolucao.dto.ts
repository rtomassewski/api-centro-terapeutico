// src/evolucoes/dto/create-evolucao.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEvolucaoDto {
  @IsString()
  @IsNotEmpty()
  descricao: string;
}
