// prisma/seed.ts
import { PrismaClient, NomePapel } from '@prisma/client';

// Instancia o Prisma
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seed do banco...');

  // Cria um array com todos os papéis do nosso Enum
  const papeis = Object.values(NomePapel);

  for (const papelNome of papeis) {
    // Cria o papel no banco de dados
    await prisma.papel.create({
      data: {
        nome: papelNome,
        descricao: `Usuário com permissões de ${papelNome}`,
      },
    });
  }

  console.log(`Papeis criados: ${papeis.join(', ')}`);
  console.log('Seed finalizado com sucesso.');
}

// Executa a função main e fecha a conexão
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
