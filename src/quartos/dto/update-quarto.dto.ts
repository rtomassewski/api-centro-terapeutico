// src/quartos/dto/update-quarto.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateQuartoDto } from './create-quarto.dto';

// Permite atualizar nome, descrição ou mover de Ala (atualizando o alaId)
export class UpdateQuartoDto extends PartialType(CreateQuartoDto) {}