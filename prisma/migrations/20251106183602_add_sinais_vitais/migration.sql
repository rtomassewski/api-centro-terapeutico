-- CreateTable
CREATE TABLE "SinalVital" (
    "id" SERIAL NOT NULL,
    "data_hora_afericao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pressao_arterial" TEXT,
    "frequencia_cardiaca" INTEGER,
    "frequencia_respiratoria" INTEGER,
    "temperatura" DOUBLE PRECISION,
    "saturacao_oxigenio" INTEGER,
    "glicemia" INTEGER,
    "dor" INTEGER,
    "notas" TEXT,
    "clinicaId" INTEGER NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "usuarioAferiuId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SinalVital_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SinalVital" ADD CONSTRAINT "SinalVital_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SinalVital" ADD CONSTRAINT "SinalVital_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SinalVital" ADD CONSTRAINT "SinalVital_usuarioAferiuId_fkey" FOREIGN KEY ("usuarioAferiuId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
