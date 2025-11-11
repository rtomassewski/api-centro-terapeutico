"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Iniciando o seed do banco...');
    const papeis = Object.values(client_1.NomePapel);
    for (const papelNome of papeis) {
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
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map