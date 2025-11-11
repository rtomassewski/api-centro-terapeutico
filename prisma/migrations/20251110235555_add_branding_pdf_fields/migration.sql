-- AlterTable
ALTER TABLE "Clinica" ADD COLUMN     "endereco" TEXT,
ADD COLUMN     "logo_url" TEXT,
ADD COLUMN     "telefone" TEXT;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "assinatura_url" TEXT;
