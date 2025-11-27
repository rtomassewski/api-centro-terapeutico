// prisma/seed.ts
import { PrismaClient, NomePapel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seed do banco...');

  // Mapa de descrições personalizadas (Opcional)
  const descricoes: Partial<Record<NomePapel, string>> = {
    [NomePapel.ADMINISTRADOR]: 'Acesso total ao sistema e configurações',
    [NomePapel.MEDICO]: 'Realiza consultas, prescrições e laudos',
    [NomePapel.DENTISTA]: 'Realiza atendimentos e procedimentos odontológicos',
    [NomePapel.PSICOLOGO]: 'Atendimentos de saúde mental e terapia',
    [NomePapel.ENFERMEIRO]: 'Triagem, medicação e cuidados ao paciente',
    [NomePapel.ATENDENTE]: 'Agendamentos e cadastro de pacientes',
    [NomePapel.PSIQUIATRA]: 'Médico especialista em saúde mental',
    [NomePapel.COORDENADOR]: 'Gestão de equipes e escalas',
  };

  const papeis = Object.values(NomePapel);

  for (const papelNome of papeis) {
    // Se tiver descrição personalizada usa, senão usa a genérica
    const descricaoFinal = descricoes[papelNome] || `Profissional do tipo ${papelNome}`;

    await prisma.papel.upsert({
      where: { nome: papelNome },
      update: {
        descricao: descricaoFinal, // Atualiza a descrição se já existir
      },
      create: {
        nome: papelNome,
        descricao: descricaoFinal,
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