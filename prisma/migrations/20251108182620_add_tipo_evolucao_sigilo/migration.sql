-- CreateEnum
CREATE TYPE "TipoEvolucao" AS ENUM ('GERAL', 'PSICOLOGICA', 'TERAPEUTICA');

-- AlterTable
ALTER TABLE "Evolucao" ADD COLUMN     "tipo" "TipoEvolucao" NOT NULL DEFAULT 'GERAL';
