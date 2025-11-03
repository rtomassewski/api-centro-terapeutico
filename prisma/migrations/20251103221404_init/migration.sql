/*
  Warnings:

  - You are about to drop the column `cpf` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `data_admissao` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `data_nascimento` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `nome_responsavel` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `nome_social` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `telefone_responsavel` on the `Paciente` table. All the data in the column will be lost.
  - Added the required column `clinicaId` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinicaId` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoPlano" AS ENUM ('BASICO', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "StatusLicenca" AS ENUM ('ATIVA', 'INADIMPLENTE', 'CANCELADA', 'TESTE');

-- DropIndex
DROP INDEX "public"."Paciente_cpf_key";

-- AlterTable
ALTER TABLE "Paciente" DROP COLUMN "cpf",
DROP COLUMN "data_admissao",
DROP COLUMN "data_nascimento",
DROP COLUMN "nome_responsavel",
DROP COLUMN "nome_social",
DROP COLUMN "telefone_responsavel",
ADD COLUMN     "clinicaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "clinicaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Clinica" (
    "id" SERIAL NOT NULL,
    "razao_social" TEXT NOT NULL,
    "nome_fantasia" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Licenca" (
    "id" SERIAL NOT NULL,
    "plano" "TipoPlano" NOT NULL DEFAULT 'BASICO',
    "status" "StatusLicenca" NOT NULL DEFAULT 'TESTE',
    "data_expiracao" TIMESTAMP(3) NOT NULL,
    "clinicaId" INTEGER NOT NULL,

    CONSTRAINT "Licenca_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Clinica_cnpj_key" ON "Clinica"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Licenca_clinicaId_key" ON "Licenca"("clinicaId");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Licenca" ADD CONSTRAINT "Licenca_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
