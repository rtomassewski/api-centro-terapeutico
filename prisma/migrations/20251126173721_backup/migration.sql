/*
  Warnings:

  - The values [DENTISTA] on the enum `NomePapel` will be removed. If these variants are still used in the database, this will fail.
  - The values [PAGO] on the enum `StatusAgendamento` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `procedimentoId` on the `Agendamento` table. All the data in the column will be lost.
  - You are about to drop the column `transacaoId` on the `Agendamento` table. All the data in the column will be lost.
  - You are about to drop the column `valor_acordado` on the `Agendamento` table. All the data in the column will be lost.
  - You are about to drop the column `caixaId` on the `TransacaoFinanceira` table. All the data in the column will be lost.
  - You are about to drop the column `forma_pagamento` on the `TransacaoFinanceira` table. All the data in the column will be lost.
  - You are about to drop the `Caixa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Procedimento` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NomePapel_new" AS ENUM ('ADMINISTRADOR', 'MEDICO', 'PSICOLOGO', 'ENFERMEIRO', 'TERAPEUTA', 'COORDENADOR', 'TECNICO', 'ATENDENTE');
ALTER TABLE "Papel" ALTER COLUMN "nome" TYPE "NomePapel_new" USING ("nome"::text::"NomePapel_new");
ALTER TYPE "NomePapel" RENAME TO "NomePapel_old";
ALTER TYPE "NomePapel_new" RENAME TO "NomePapel";
DROP TYPE "public"."NomePapel_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "StatusAgendamento_new" AS ENUM ('AGENDADO', 'REALIZADO', 'CANCELADO', 'FALTOU');
ALTER TABLE "public"."Agendamento" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Agendamento" ALTER COLUMN "status" TYPE "StatusAgendamento_new" USING ("status"::text::"StatusAgendamento_new");
ALTER TYPE "StatusAgendamento" RENAME TO "StatusAgendamento_old";
ALTER TYPE "StatusAgendamento_new" RENAME TO "StatusAgendamento";
DROP TYPE "public"."StatusAgendamento_old";
ALTER TABLE "Agendamento" ALTER COLUMN "status" SET DEFAULT 'AGENDADO';
COMMIT;

-- DropForeignKey
ALTER TABLE "Agendamento" DROP CONSTRAINT "Agendamento_procedimentoId_fkey";

-- DropForeignKey
ALTER TABLE "Agendamento" DROP CONSTRAINT "Agendamento_transacaoId_fkey";

-- DropForeignKey
ALTER TABLE "Caixa" DROP CONSTRAINT "Caixa_clinicaId_fkey";

-- DropForeignKey
ALTER TABLE "Caixa" DROP CONSTRAINT "Caixa_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Procedimento" DROP CONSTRAINT "Procedimento_clinicaId_fkey";

-- DropForeignKey
ALTER TABLE "TransacaoFinanceira" DROP CONSTRAINT "TransacaoFinanceira_caixaId_fkey";

-- DropIndex
DROP INDEX "Agendamento_transacaoId_key";

-- AlterTable
ALTER TABLE "Agendamento" DROP COLUMN "procedimentoId",
DROP COLUMN "transacaoId",
DROP COLUMN "valor_acordado";

-- AlterTable
ALTER TABLE "TransacaoFinanceira" DROP COLUMN "caixaId",
DROP COLUMN "forma_pagamento";

-- DropTable
DROP TABLE "Caixa";

-- DropTable
DROP TABLE "Procedimento";

-- DropEnum
DROP TYPE "FormaPagamento";

-- DropEnum
DROP TYPE "StatusAtendimento";

-- DropEnum
DROP TYPE "StatusCaixa";
