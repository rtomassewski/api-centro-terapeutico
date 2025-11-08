// prisma/seed.ts
import { PrismaClient, NomePapel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seed do banco...');

  // 1. Pega todos os nomes do nosso Enum
  const papeis = Object.values(NomePapel);

  // 2. (NOVO) Usa 'upsert' para cada um
  for (const papelNome of papeis) {
    await prisma.papel.upsert({
      // 2a. Onde procurar (pelo nome)
      where: { nome: papelNome },
      
      // 2b. O que atualizar (se encontrar)
      update: {
        descricao: `Usuário com permissões de ${papelNome}`,
      },
      
      // 2c. O que criar (se não encontrar)
      create: {
        nome: papelNome,
        descricao: `Usuário com permissões de ${papelNome}`,
      },
    });
  }

  console.log(`Papeis sincronizados: ${papeis.join(', ')}`);
  console.log('Seed finalizado com sucesso.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });