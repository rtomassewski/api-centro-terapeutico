import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AbrirCaixaDto {
  @IsNumber()
  saldo_inicial: number;

  @IsOptional()
  @IsString()
  observacoes?: string;
}