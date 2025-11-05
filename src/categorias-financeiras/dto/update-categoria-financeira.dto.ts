// src/categorias-financeiras/dto/update-categoria-financeira.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaFinanceiraDto } from './create-categoria-financeira.dto';

// Herda todos os campos do CreateDTO, mas os torna opcionais
export class UpdateCategoriaFinanceiraDto extends PartialType(
  CreateCategoriaFinanceiraDto,
) {}