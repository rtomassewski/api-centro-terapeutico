# Viva o Instante - Sistema de Gestão (API Back-End)

Esta é a API central (back-end) para o Sistema de Gestão de Clínicas, construída com NestJS, Prisma e PostgreSQL. A API é responsável por toda a lógica de negócios, segurança de dados, controle de permissões (RBAC) e integração com serviços de terceiros (Pagamentos e Geração de PDF).

O sistema é projetado como um SaaS (Software as a Service) multi-tenant, permitindo que múltiplas clínicas usem a mesma instância da aplicação com total isolamento de dados.

## 🚀 Funcionalidades Principais

O back-end fornece endpoints seguros para:

* **Autenticação e Permissões (RBAC):** Login JWT e controle de acesso granular para 9 papéis (Admin, Médico, Enfermeiro, Psicólogo, Atendente, etc.).
* **Gestão de Pacientes (Prontuário):** CRUD de pacientes, Evoluções (com sigilo profissional), Histórico Médico (Anamnese por tipo), Sinais Vitais e Notas de Comportamento.
* **Módulo Clínico Avançado:** Prescrições (ligadas ao estoque), Aprazamento de Enfermagem e Administração de Medicamentos (com baixa automática no estoque).
* **Gestão de Internação:** CRUD de Alas, Quartos e Leitos, com fluxos de Check-in e Check-out.
* **Gestão Administrativa (ERP):** Financeiro (Contas a Pagar/Receber, Categorias) e Estoque (Produtos, Entradas, Saídas manuais).
* **Gestão SaaS:** Gerenciamento de Licenças e Dashboard de Relatórios (KPIs).
* **Integrações:**
    * **Mercado Pago:** Geração de checkout e recebimento de pagamentos via Webhook para automação de licenças.
    * **PDFKit:** Geração de PDF (com branding da clínica) para impressão de prontuários.

## 🛠 Tech Stack

* **Framework:** NestJS (Node.js)
* **Linguagem:** TypeScript
* **ORM:** Prisma
* **Base de Dados:** PostgreSQL
* **Ambiente:** Docker (para a base de dados)
* **Autenticação:** JWT (Passport.js)
* **Validação:** `class-validator` e `class-transformer`

---

## ⚙️ Instalação e Execução (Desenvolvimento)

### Pré-requisitos

* Node.js (v18+)
* Docker (e Docker Compose)
* Git

### 1. Iniciar a Base de Dados (PostgreSQL)

O projeto está configurado para rodar o PostgreSQL via Docker.

```bash
# Inicia o container do banco de dados em segundo plano
docker run --name terapia-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=terapia_db -p 5432:5432 -d postgres