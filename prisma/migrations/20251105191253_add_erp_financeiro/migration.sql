-- CreateEnum
CREATE TYPE "TipoTransacao" AS ENUM ('RECEITA', 'DESPESA');

-- CreateTable
CREATE TABLE "CategoriaFinanceira" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoTransacao" NOT NULL,
    "clinicaId" INTEGER NOT NULL,

    CONSTRAINT "CategoriaFinanceira_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransacaoFinanceira" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "tipo" "TipoTransacao" NOT NULL,
    "data_vencimento" TIMESTAMP(3) NOT NULL,
    "data_pagamento" TIMESTAMP(3),
    "clinicaId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "pacienteId" INTEGER,

    CONSTRAINT "TransacaoFinanceira_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CategoriaFinanceira" ADD CONSTRAINT "CategoriaFinanceira_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransacaoFinanceira" ADD CONSTRAINT "TransacaoFinanceira_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransacaoFinanceira" ADD CONSTRAINT "TransacaoFinanceira_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaFinanceira"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransacaoFinanceira" ADD CONSTRAINT "TransacaoFinanceira_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
