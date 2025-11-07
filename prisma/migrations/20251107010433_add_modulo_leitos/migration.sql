-- CreateEnum
CREATE TYPE "StatusLeito" AS ENUM ('DISPONIVEL', 'OCUPADO', 'RESERVADO', 'MANUTENCAO');

-- CreateTable
CREATE TABLE "Ala" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "clinicaId" INTEGER NOT NULL,

    CONSTRAINT "Ala_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quarto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "alaId" INTEGER NOT NULL,
    "clinicaId" INTEGER NOT NULL,

    CONSTRAINT "Quarto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leito" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "status" "StatusLeito" NOT NULL DEFAULT 'DISPONIVEL',
    "quartoId" INTEGER NOT NULL,
    "clinicaId" INTEGER NOT NULL,
    "pacienteId" INTEGER,

    CONSTRAINT "Leito_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Leito_pacienteId_key" ON "Leito"("pacienteId");

-- AddForeignKey
ALTER TABLE "Ala" ADD CONSTRAINT "Ala_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quarto" ADD CONSTRAINT "Quarto_alaId_fkey" FOREIGN KEY ("alaId") REFERENCES "Ala"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quarto" ADD CONSTRAINT "Quarto_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leito" ADD CONSTRAINT "Leito_quartoId_fkey" FOREIGN KEY ("quartoId") REFERENCES "Quarto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leito" ADD CONSTRAINT "Leito_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leito" ADD CONSTRAINT "Leito_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
