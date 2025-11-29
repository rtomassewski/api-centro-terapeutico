import { NotasComportamentoService } from './notas-comportamento.service';
import { CreateNotaComportamentoDto } from './dto/create-nota-comportamento.dto';
import { UpdateNotaComportamentoDto } from './dto/update-notas-comportamento.dto';
import { QueryNotaComportamentoDto } from './dto/query-nota-comportamento.dto';
export declare class NotasComportamentoController {
    private readonly service;
    constructor(service: NotasComportamentoService);
    create(createDto: CreateNotaComportamentoDto, req: any): Promise<{
        id: number;
        clinicaId: number;
        pacienteId: number;
        observacao: string | null;
        nota: import("@prisma/client").$Enums.RatingComportamento;
        data_registro: Date;
        usuarioRegistrouId: number;
    }>;
    findAll(query: QueryNotaComportamentoDto, req: any): Promise<({
        usuario_registrou: {
            nome_completo: string;
        };
    } & {
        id: number;
        clinicaId: number;
        pacienteId: number;
        observacao: string | null;
        nota: import("@prisma/client").$Enums.RatingComportamento;
        data_registro: Date;
        usuarioRegistrouId: number;
    })[]>;
    findOne(id: number, req: any): Promise<{
        id: number;
        clinicaId: number;
        pacienteId: number;
        observacao: string | null;
        nota: import("@prisma/client").$Enums.RatingComportamento;
        data_registro: Date;
        usuarioRegistrouId: number;
    }>;
    update(id: number, updateDto: UpdateNotaComportamentoDto, req: any): Promise<{
        id: number;
        clinicaId: number;
        pacienteId: number;
        observacao: string | null;
        nota: import("@prisma/client").$Enums.RatingComportamento;
        data_registro: Date;
        usuarioRegistrouId: number;
    }>;
    remove(id: number, req: any): Promise<{
        id: number;
        clinicaId: number;
        pacienteId: number;
        observacao: string | null;
        nota: import("@prisma/client").$Enums.RatingComportamento;
        data_registro: Date;
        usuarioRegistrouId: number;
    }>;
}
