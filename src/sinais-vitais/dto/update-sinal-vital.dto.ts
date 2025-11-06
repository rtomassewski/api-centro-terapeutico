// src/sinais-vitais/dto/update-sinal-vital.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateSinalVitalDto } from './create-sinal-vital.dto';

export class UpdateSinalVitalDto extends PartialType(CreateSinalVitalDto) {}