"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Iniciando o seed do banco...');
    const descricoes = {
        [client_1.NomePapel.ADMINISTRADOR]: 'Acesso total ao sistema e configurações',
        [client_1.NomePapel.MEDICO]: 'Realiza consultas, prescrições e laudos',
        [client_1.NomePapel.DENTISTA]: 'Realiza atendimentos e procedimentos odontológicos',
        [client_1.NomePapel.PSICOLOGO]: 'Atendimentos de saúde mental e terapia',
        [client_1.NomePapel.ENFERMEIRO]: 'Triagem, medicação e cuidados ao paciente',
        [client_1.NomePapel.ATENDENTE]: 'Agendamentos e cadastro de pacientes',
        [client_1.NomePapel.PSIQUIATRA]: 'Médico especialista em saúde mental',
        [client_1.NomePapel.COORDENADOR]: 'Gestão de equipes e escalas',
    };
    const papeis = Object.values(client_1.NomePapel);
    for (const papelNome of papeis) {
        const descricaoFinal = descricoes[papelNome] || `Profissional do tipo ${papelNome}`;
        await prisma.papel.upsert({
            where: { nome: papelNome },
            update: {
                descricao: descricaoFinal,
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
//# sourceMappingURL=seed.js.map