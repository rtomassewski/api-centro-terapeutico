import { CreateSinalVitalDto } from './dto/create-sinal-vital.dto';
import { UpdateSinalVitalDto } from './dto/update-sinal-vital.dto';
import { QuerySinalVitalDto } from './dto/query-sinal-vital.dto';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
export declare class SinaisVitaisService {
    private prisma;
    constructor(prisma: PrismaService);
    private validarPaciente;
    private getSinalVital;
    create(dto: CreateSinalVitalDto, usuarioLogado: Usuario): Promise<{
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
    findAll(query: QuerySinalVitalDto, usuarioLogado: Usuario): Promise<({
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
    findOne(id: number, usuarioLogado: Usuario): Promise<({
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
    update(id: number, dto: UpdateSinalVitalDto, usuarioLogado: Usuario): Promise<{
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
    remove(id: number, usuarioLogado: Usuario): Promise<{
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
