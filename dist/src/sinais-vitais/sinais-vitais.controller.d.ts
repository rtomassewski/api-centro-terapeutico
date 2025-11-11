import { SinaisVitaisService } from './sinais-vitais.service';
import { CreateSinalVitalDto } from './dto/create-sinal-vital.dto';
import { UpdateSinalVitalDto } from './dto/update-sinal-vital.dto';
import { QuerySinalVitalDto } from './dto/query-sinal-vital.dto';
export declare class SinaisVitaisController {
    private readonly service;
    constructor(service: SinaisVitaisService);
    create(createDto: CreateSinalVitalDto, req: any): Promise<{
        id: number;
        clinicaId: number;
        createdAt: Date;
        pacienteId: number;
        notas: string | null;
        data_hora_afericao: Date;
        pressao_arterial: string | null;
        frequencia_cardiaca: number | null;
        frequencia_respiratoria: number | null;
        temperatura: number | null;
        saturacao_oxigenio: number | null;
        glicemia: number | null;
        dor: number | null;
        usuarioAferiuId: number;
    }>;
    findAll(query: QuerySinalVitalDto, req: any): Promise<({
        usuario_aferiu: {
            nome_completo: string;
        };
    } & {
        id: number;
        clinicaId: number;
        createdAt: Date;
        pacienteId: number;
        notas: string | null;
        data_hora_afericao: Date;
        pressao_arterial: string | null;
        frequencia_cardiaca: number | null;
        frequencia_respiratoria: number | null;
        temperatura: number | null;
        saturacao_oxigenio: number | null;
        glicemia: number | null;
        dor: number | null;
        usuarioAferiuId: number;
    })[]>;
    findOne(id: number, req: any): Promise<({
        paciente: {
            nome_completo: string;
        };
        usuario_aferiu: {
            nome_completo: string;
        };
    } & {
        id: number;
        clinicaId: number;
        createdAt: Date;
        pacienteId: number;
        notas: string | null;
        data_hora_afericao: Date;
        pressao_arterial: string | null;
        frequencia_cardiaca: number | null;
        frequencia_respiratoria: number | null;
        temperatura: number | null;
        saturacao_oxigenio: number | null;
        glicemia: number | null;
        dor: number | null;
        usuarioAferiuId: number;
    }) | null>;
    update(id: number, updateDto: UpdateSinalVitalDto, req: any): Promise<{
        id: number;
        clinicaId: number;
        createdAt: Date;
        pacienteId: number;
        notas: string | null;
        data_hora_afericao: Date;
        pressao_arterial: string | null;
        frequencia_cardiaca: number | null;
        frequencia_respiratoria: number | null;
        temperatura: number | null;
        saturacao_oxigenio: number | null;
        glicemia: number | null;
        dor: number | null;
        usuarioAferiuId: number;
    }>;
    remove(id: number, req: any): Promise<{
        id: number;
        clinicaId: number;
        createdAt: Date;
        pacienteId: number;
        notas: string | null;
        data_hora_afericao: Date;
        pressao_arterial: string | null;
        frequencia_cardiaca: number | null;
        frequencia_respiratoria: number | null;
        temperatura: number | null;
        saturacao_oxigenio: number | null;
        glicemia: number | null;
        dor: number | null;
        usuarioAferiuId: number;
    }>;
}
