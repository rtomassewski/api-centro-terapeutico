import { ImpressoesService } from './impressoes.service';
import type { Response } from 'express';
export declare class ImpressoesController {
    private readonly impressoesService;
    constructor(impressoesService: ImpressoesService);
    getProntuarioPdf(pacienteId: number, req: any, res: Response): Promise<void>;
}
