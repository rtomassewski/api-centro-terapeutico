/*
  Warnings:

  - You are about to drop the column `notas` on the `Agendamento` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transacaoFinanceiraId]` on the table `Agendamento` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'CONVENIO');

-- CreateEnum
CREATE TYPE "StatusCaixa" AS ENUM ('ABERTO', 'FECHADO');

-- AlterEnum
ALTER TYPE "NomePapel" ADD VALUE 'DENTISTA';

-- AlterTable
ALTER TABLE "Agendamento" DROP COLUMN "notas",
ADD COLUMN     "forma_pagamento" "FormaPagamento",
ADD COLUMN     "pago" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "transacaoFinanceiraId" INTEGER,
ADD COLUMN     "valor_total" DOUBLE PRECISION DEFAULT 0;

-- CreateTable
CREATE TABLE "AgendamentoOnProcedimentos" (
    "agendamentoId" INTEGER NOT NULL,
    "procedimentoId" INTEGER NOT NULL,
    "valor_cobrado" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AgendamentoOnProcedimentos_pkey" PRIMARY KEY ("agendamentoId","procedimentoId")
);

-- CreateTable
CREATE TABLE "Caixa" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "clinicaId" INTEGER NOT NULL,
    "data_abertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_fechamento" TIMESTAMP(3),
    "saldo_inicial" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "saldo_final" DOUBLE PRECISION,
    "status" "StatusCaixa" NOT NULL DEFAULT 'ABERTO',
    "observacoes" TEXT,

    CONSTRAINT "Caixa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimentacaoCaixa" (
    "id" SERIAL NOT NULL,
    "caixaId" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "tipo" "TipoTransacao" NOT NULL,
    "forma_pagamento" "FormaPagamento" NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimentacaoCaixa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Procedimento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "valor" DOUBLE PRECISION NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "clinicaId" INTEGER NOT NULL,

    CONSTRAINT "Procedimento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agendamento_transacaoFinanceiraId_key" ON "Agendamento"("transacaoFinanceiraId");

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_transacaoFinanceiraId_fkey" FOREIGN KEY ("transacaoFinanceiraId") REFERENCES "TransacaoFinanceira"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendamentoOnProcedimentos" ADD CONSTRAINT "AgendamentoOnProcedimentos_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES "Agendamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendamentoOnProcedimentos" ADD CONSTRAINT "AgendamentoOnProcedimentos_procedimentoId_fkey" FOREIGN KEY ("procedimentoId") REFERENCES "Procedimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caixa" ADD CONSTRAINT "Caixa_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caixa" ADD CONSTRAINT "Caixa_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimentacaoCaixa" ADD CONSTRAINT "MovimentacaoCaixa_caixaId_fkey" FOREIGN KEY ("caixaId") REFERENCES "Caixa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Procedimento" ADD CONSTRAINT "Procedimento_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
