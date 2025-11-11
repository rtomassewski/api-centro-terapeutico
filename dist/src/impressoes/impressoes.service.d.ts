import { PrismaService } from '../prisma.service';
export declare class ImpressoesService {
    private prisma;
    constructor(prisma: PrismaService);
    private getDadosCompletos;
    private getLogoBuffer;
    gerarProntuarioPdf(pacienteId: number, usuarioLogado: any): Promise<Buffer>;
}
