import { PartialType } from '@nestjs/mapped-types';
import { CreateEntradaEstoqueDto } from './create-entradas-estoque.dto';

export class UpdateEntradasEstoqueDto extends PartialType(CreateEntradaEstoqueDto) {}
