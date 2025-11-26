import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProcedimentoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsNumber()
  @Min(0) // O valor não pode ser negativo
  valor: number;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}