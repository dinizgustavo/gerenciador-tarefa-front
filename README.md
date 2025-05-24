# Gerenciador de Tarefas - Frontend (Vue.js)

Este é um projeto de teste para vaga de desenvolvedor, feito em Vue.js, que permite criar, editar, listar e excluir tarefas, com controle de datas e status.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- [npm](https://www.npmjs.com/) (geralmente já vem com o Node)

## Como rodar o projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/dinizgustavo/gerenciador-tarefa-front.git
   cd seu-repo
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure a URL da API:**

   - Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo (ajuste a URL conforme seu backend):

     ```
     VITE_API_BASE_URL=https://localhost:7181/api/tarefas
     ```

   - O frontend irá ler automaticamente essa variável para se comunicar com a API.

4. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

5. **Acesse no navegador:**

   ```
   http://localhost:5173
   ```
   (ou o endereço/porta exibido no terminal)

## Observações

- O projeto foi desenvolvido com [Vite](https://vitejs.dev/) para um ambiente moderno e rápido.
- O frontend espera que o backend da API de tarefas esteja rodando e acessível.
- A URL da API é configurada via arquivo `.env` para facilitar a troca de ambientes.

## Scripts úteis

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — gera a versão de produção
- `npm run preview` — visualiza a build de produção localmente

## Contato

Dúvidas ou problemas? Entre em contato:  
[Gustavo Diniz] — [dinizgustavo92@gmail.com]

---

**Bom teste!**
