// src/notas-comportamento/dto/update-nota-comportamento.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateNotaComportamentoDto } from './create-nota-comportamento.dto';

// Permite atualizar a nota ou a observação
export class UpdateNotaComportamentoDto extends PartialType(CreateNotaComportamentoDto) {}