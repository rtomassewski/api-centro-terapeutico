-- CreateEnum
CREATE TYPE "UnidadeMedida" AS ENUM ('UNIDADE', 'CAIXA', 'FRASCO', 'ML');

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "unidade_medida" "UnidadeMedida" NOT NULL DEFAULT 'UNIDADE',
    "quantidade_estoque" INTEGER NOT NULL DEFAULT 0,
    "estoque_minimo" INTEGER NOT NULL DEFAULT 0,
    "clinicaId" INTEGER NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntradaEstoque" (
    "id" SERIAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "data_entrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lote" TEXT,
    "data_validade" TIMESTAMP(3),
    "produtoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "clinicaId" INTEGER NOT NULL,

    CONSTRAINT "EntradaEstoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaidaEstoque" (
    "id" SERIAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "data_saida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo" TEXT,
    "produtoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "clinicaId" INTEGER NOT NULL,
    "administracaoId" INTEGER,

    CONSTRAINT "SaidaEstoque_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SaidaEstoque_administracaoId_key" ON "SaidaEstoque"("administracaoId");

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntradaEstoque" ADD CONSTRAINT "EntradaEstoque_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntradaEstoque" ADD CONSTRAINT "EntradaEstoque_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntradaEstoque" ADD CONSTRAINT "EntradaEstoque_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaidaEstoque" ADD CONSTRAINT "SaidaEstoque_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaidaEstoque" ADD CONSTRAINT "SaidaEstoque_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaidaEstoque" ADD CONSTRAINT "SaidaEstoque_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaidaEstoque" ADD CONSTRAINT "SaidaEstoque_administracaoId_fkey" FOREIGN KEY ("administracaoId") REFERENCES "AdministracaoMedicamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
