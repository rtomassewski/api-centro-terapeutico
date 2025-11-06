// src/produtos/dto/update-produto.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoDto } from './create-produto.dto';

// Herda todos os campos do CreateDTO, mas os torna opcionais
export class UpdateProdutoDto extends PartialType(CreateProdutoDto) {}