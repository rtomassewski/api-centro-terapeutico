-- DropIndex
DROP INDEX "public"."HistoricoMedico_pacienteId_key";

-- AlterTable
ALTER TABLE "HistoricoMedico" ADD COLUMN     "tipo" "TipoEvolucao" NOT NULL DEFAULT 'GERAL';
