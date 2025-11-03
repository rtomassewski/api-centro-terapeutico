-- CreateEnum
CREATE TYPE "NomePapel" AS ENUM ('ADMINISTRADOR', 'MEDICO', 'PSICOLOGO', 'ENFERMEIRO', 'TERAPEUTA', 'COORDENADOR', 'TECNICO');

-- CreateEnum
CREATE TYPE "StatusPaciente" AS ENUM ('ATIVO', 'ALTA', 'EVADIDO');

-- CreateTable
CREATE TABLE "Papel" (
    "id" SERIAL NOT NULL,
    "nome" "NomePapel" NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "Papel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "registro_conselho" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "papelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" SERIAL NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "nome_social" TEXT,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome_responsavel" TEXT NOT NULL,
    "telefone_responsavel" TEXT NOT NULL,
    "data_admissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusPaciente" NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evolucao" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "data_evolucao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evolucao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Papel_nome_key" ON "Papel"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_cpf_key" ON "Paciente"("cpf");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_papelId_fkey" FOREIGN KEY ("papelId") REFERENCES "Papel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evolucao" ADD CONSTRAINT "Evolucao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evolucao" ADD CONSTRAINT "Evolucao_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
