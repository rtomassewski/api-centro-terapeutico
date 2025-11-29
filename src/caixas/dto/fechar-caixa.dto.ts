import { IsNumber } from 'class-validator';

export class FecharCaixaDto {
  @IsNumber()
  saldo_final: number;
}