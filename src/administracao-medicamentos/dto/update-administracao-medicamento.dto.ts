import { PartialType } from '@nestjs/mapped-types';
import { CreateAdministracaoMedicamentoDto } from './create-administracao-medicamento.dto';

export class UpdateAdministracaoMedicamentoDto extends PartialType(CreateAdministracaoMedicamentoDto) {}
