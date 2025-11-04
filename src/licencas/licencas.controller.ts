// src/licencas/licencas.controller.ts
import { 
  Controller, 
  Get, 
  Body, 
  Patch, // Usamos Patch para atualização parcial
  Param, 
  ParseIntPipe,
  UseGuards // 1. Importe o UseGuards
} from '@nestjs/common';
import { LicencasService } from './licencas.service';
import { UpdateLicencaDto } from './dto/update-licenca.dto';
import { ApiKeyGuard } from '../auth/api-key.guard'; // 2. Importe seu Guarda

// 3. APLIQUE O GUARDA NA CLASSE INTEIRA
// Todas as rotas deste controller exigirão a chave de API
@UseGuards(ApiKeyGuard) 
@Controller('licencas')
export class LicencasController {
  constructor(private readonly licencasService: LicencasService) {}

  @Get()
  findAll() {
    return this.licencasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.licencasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateLicencaDto: UpdateLicencaDto
  ) {
    return this.licencasService.update(id, updateLicencaDto);
  }

  // Removemos o @Post() e o @Delete()
}