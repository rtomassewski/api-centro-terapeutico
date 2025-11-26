"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const usuarios_module_1 = require("./usuarios/usuarios.module");
const pacientes_module_1 = require("./pacientes/pacientes.module");
const auth_module_1 = require("./auth/auth.module");
const evolucoes_module_1 = require("./evolucoes/evolucoes.module");
const prescricoes_module_1 = require("./prescricoes/prescricoes.module");
const clinicas_module_1 = require("./clinicas/clinicas.module");
const config_1 = require("@nestjs/config");
const licencas_module_1 = require("./licencas/licencas.module");
const pagamentos_module_1 = require("./pagamentos/pagamentos.module");
const categorias_financeiras_module_1 = require("./categorias-financeiras/categorias-financeiras.module");
const transacoes_financeiras_module_1 = require("./transacoes-financeiras/transacoes-financeiras.module");
const agendamentos_module_1 = require("./agendamentos/agendamentos.module");
const administracao_medicamentos_module_1 = require("./administracao-medicamentos/administracao-medicamentos.module");
const sinais_vitais_module_1 = require("./sinais-vitais/sinais-vitais.module");
const produtos_module_1 = require("./produtos/produtos.module");
const entradas_estoque_module_1 = require("./entradas-estoque/entradas-estoque.module");
const saidas_estoque_module_1 = require("./saidas-estoque/saidas-estoque.module");
const alas_module_1 = require("./alas/alas.module");
const quartos_module_1 = require("./quartos/quartos.module");
const leitos_module_1 = require("./leitos/leitos.module");
const relatorios_module_1 = require("./relatorios/relatorios.module");
const historico_medico_module_1 = require("./historico-medico/historico-medico.module");
const notas_comportamento_module_1 = require("./notas-comportamento/notas-comportamento.module");
const impressoes_module_1 = require("./impressoes/impressoes.module");
const procedimentos_module_1 = require("./procedimentos/procedimentos.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({
                isGlobal: true,
            }), usuarios_module_1.UsuariosModule, pacientes_module_1.PacientesModule, auth_module_1.AuthModule, evolucoes_module_1.EvolucoesModule, prescricoes_module_1.PrescricoesModule, clinicas_module_1.ClinicasModule, licencas_module_1.LicencasModule, pagamentos_module_1.PagamentosModule, categorias_financeiras_module_1.CategoriasFinanceirasModule, transacoes_financeiras_module_1.TransacoesFinanceirasModule, agendamentos_module_1.AgendamentosModule, administracao_medicamentos_module_1.AdministracaoMedicamentosModule, sinais_vitais_module_1.SinaisVitaisModule, produtos_module_1.ProdutosModule, entradas_estoque_module_1.EntradasEstoqueModule, saidas_estoque_module_1.SaidasEstoqueModule, alas_module_1.AlasModule, quartos_module_1.QuartosModule, leitos_module_1.LeitosModule, relatorios_module_1.RelatoriosModule, historico_medico_module_1.HistoricoMedicoModule, notas_comportamento_module_1.NotasComportamentoModule, impressoes_module_1.ImpressoesModule, procedimentos_module_1.ProcedimentosModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map