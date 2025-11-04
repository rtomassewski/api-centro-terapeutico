/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Paciente` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_nascimento` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome_responsavel` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone_responsavel` to the `Paciente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Paciente" ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "data_admissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data_nascimento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nome_responsavel" TEXT NOT NULL,
ADD COLUMN     "nome_social" TEXT,
ADD COLUMN     "telefone_responsavel" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_cpf_key" ON "Paciente"("cpf");
