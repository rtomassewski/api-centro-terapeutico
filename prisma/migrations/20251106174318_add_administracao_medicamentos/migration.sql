-- CreateEnum
CREATE TYPE "StatusAdministracao" AS ENUM ('PENDENTE', 'ADMINISTRADO', 'RECUSADO', 'NAO_ADMINISTRADO');

-- CreateTable
CREATE TABLE "AdministracaoMedicamento" (
    "id" SERIAL NOT NULL,
    "data_hora_prevista" TIMESTAMP(3) NOT NULL,
    "data_hora_administracao" TIMESTAMP(3),
    "status" "StatusAdministracao" NOT NULL DEFAULT 'PENDENTE',
    "notas" TEXT,
    "clinicaId" INTEGER NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "prescricaoId" INTEGER NOT NULL,
    "usuarioAdministrouId" INTEGER,

    CONSTRAINT "AdministracaoMedicamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AdministracaoMedicamento" ADD CONSTRAINT "AdministracaoMedicamento_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdministracaoMedicamento" ADD CONSTRAINT "AdministracaoMedicamento_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdministracaoMedicamento" ADD CONSTRAINT "AdministracaoMedicamento_prescricaoId_fkey" FOREIGN KEY ("prescricaoId") REFERENCES "Prescricao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdministracaoMedicamento" ADD CONSTRAINT "AdministracaoMedicamento_usuarioAdministrouId_fkey" FOREIGN KEY ("usuarioAdministrouId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
