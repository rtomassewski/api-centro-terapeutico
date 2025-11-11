import { StatusPaciente } from '@prisma/client';
export declare class UpdatePacienteDto {
    nome_completo?: string;
    nome_social?: string;
    data_nascimento?: string;
    cpf?: string;
    nome_responsavel?: string;
    telefone_responsavel?: string;
    status?: StatusPaciente;
}
