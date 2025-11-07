// src/alas/dto/update-ala.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAlaDto } from './create-ala.dto';

// Herda todos os campos do CreateDTO, mas os torna opcionais
export class UpdateAlaDto extends PartialType(CreateAlaDto) {}