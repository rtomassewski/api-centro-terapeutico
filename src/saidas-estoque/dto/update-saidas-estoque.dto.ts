import { PartialType } from '@nestjs/mapped-types';
import { CreateSaidaEstoqueDto } from './create-saidas-estoque.dto';

export class UpdateSaidasEstoqueDto extends PartialType(CreateSaidaEstoqueDto) {}
