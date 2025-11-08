-- CreateTable
CREATE TABLE "HistoricoMedico" (
    "id" SERIAL NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "clinicaId" INTEGER NOT NULL,
    "usuarioPreencheuId" INTEGER NOT NULL,
    "data_preenchimento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alergias" TEXT,
    "condicoes_previas" TEXT,
    "medicamentos_uso_continuo" TEXT,
    "historico_familiar" TEXT,
    "historico_social" TEXT,
    "historico_uso_substancias" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistoricoMedico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HistoricoMedico_pacienteId_key" ON "HistoricoMedico"("pacienteId");

-- AddForeignKey
ALTER TABLE "HistoricoMedico" ADD CONSTRAINT "HistoricoMedico_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoMedico" ADD CONSTRAINT "HistoricoMedico_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoMedico" ADD CONSTRAINT "HistoricoMedico_usuarioPreencheuId_fkey" FOREIGN KEY ("usuarioPreencheuId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
