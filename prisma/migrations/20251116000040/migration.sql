/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Paciente` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf,clinicaId]` on the table `Paciente` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Paciente_cpf_key";

-- AlterTable
ALTER TABLE "Paciente" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_cpf_clinicaId_key" ON "Paciente"("cpf", "clinicaId");
