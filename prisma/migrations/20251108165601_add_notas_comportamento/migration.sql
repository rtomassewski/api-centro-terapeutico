-- CreateEnum
CREATE TYPE "RatingComportamento" AS ENUM ('OTIMO', 'BOM', 'RUIM', 'PESSIMO');

-- CreateTable
CREATE TABLE "NotaComportamento" (
    "id" SERIAL NOT NULL,
    "data_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nota" "RatingComportamento" NOT NULL,
    "observacao" TEXT,
    "clinicaId" INTEGER NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "usuarioRegistrouId" INTEGER NOT NULL,

    CONSTRAINT "NotaComportamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NotaComportamento" ADD CONSTRAINT "NotaComportamento_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotaComportamento" ADD CONSTRAINT "NotaComportamento_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotaComportamento" ADD CONSTRAINT "NotaComportamento_usuarioRegistrouId_fkey" FOREIGN KEY ("usuarioRegistrouId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
