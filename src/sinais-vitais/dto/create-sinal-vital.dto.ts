// src/sinais-vitais/dto/create-sinal-vital.dto.ts
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  Min,
  Max,
} from 'class-validator';

export class CreateSinalVitalDto {
  @IsInt()
  @IsNotEmpty()
  pacienteId: number;

  @IsDateString()
  @IsOptional()
  data_hora_afericao?: string; // Se omitido, o service usará 'agora'

  @IsString() @IsOptional()
  pressao_arterial?: string;

  @IsInt() @IsOptional() @Min(0)
  frequencia_cardiaca?: number;

  @IsInt() @IsOptional() @Min(0)
  frequencia_respiratoria?: number;

  @IsNumber() @IsOptional()
  temperatura?: number;

  @IsInt() @IsOptional() @Min(0) @Max(100)
  saturacao_oxigenio?: number;

  @IsInt() @IsOptional() @Min(0)
  glicemia?: number;

  @IsInt() @IsOptional() @Min(0) @Max(10)
  dor?: number;

  @IsString() @IsOptional()
  notas?: string;
}