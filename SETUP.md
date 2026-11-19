# Colocando o Gestão Protekto no ar (Supabase + domínio GoDaddy)

**Status: passos 1 a 4 já foram feitos.** Projeto Supabase `protekto-gestao` criado, schema + dados migrados, seu login criado, `.env` preenchido. Falta só a publicação (passos 5 e 6).

Seu login: `felipecosta.cpr@gmail.com` / `GestaoProtekto2026` — troque essa senha assim que possível pelo menu "Alterar senha" dentro do sistema, já logado.

## 1. Criar o projeto no Supabase

1. Acesse https://supabase.com e crie uma conta grátis (pode entrar com GitHub ou e-mail).
2. Clique em **New project**. Escolha um nome (ex: `protekto-gestao`), uma senha forte para o banco (guarde essa senha) e a região mais próxima (ex: `South America (São Paulo)`).
3. Aguarde ~2 minutos até o projeto ficar pronto.

## 2. Criar as tabelas e os dados iniciais

1. No menu lateral do projeto, abra **SQL Editor** → **New query**.
2. Abra o arquivo [`supabase/schema.sql`](supabase/schema.sql) deste projeto, copie todo o conteúdo, cole no editor e clique em **Run**.
3. Repita o processo com [`supabase/seed.sql`](supabase/seed.sql) (numa nova query) — isso carrega os 24 clientes e as OS/agendamentos de exemplo que já existiam no app.

## 3. Criar seu login

1. No menu lateral, vá em **Authentication** → **Users** → **Add user** → **Create new user**.
2. Preencha seu e-mail e uma senha. Marque **Auto Confirm User** (assim não precisa confirmar por e-mail).
3. Esse e-mail/senha é o que você vai usar para entrar no sistema.

## 4. Pegar as chaves do projeto

1. No menu lateral, vá em **Project Settings** (ícone de engrenagem) → **Data API**.
2. Copie o **Project URL** e a chave **anon public** (não é a `service_role`, essa não deve ser usada aqui).
3. Abra o arquivo `.env` na raiz do projeto (já existe, só está vazio) e preencha:
   ```
   VITE_SUPABASE_URL=cole_o_project_url_aqui
   VITE_SUPABASE_ANON_KEY=cole_a_chave_anon_aqui
   ```
4. Rode `npm run dev` e acesse `http://localhost:5174` — deve aparecer a tela de login. Entre com o e-mail/senha do passo 3 e confirme que os dados aparecem (Dashboard com 24 clientes, etc).

## 5. Publicar no ar (Cloudflare Pages) — feito ✅

Projeto `protekto-gestao` publicado via `wrangler pages deploy` (mesmas chaves do `.env` já embutidas no build). URL ao vivo, já testada com login real:

**https://protekto-gestao.pages.dev**

Para publicar uma atualização futura, rode a partir da raiz do projeto:
```bash
npm run build
npx wrangler pages deploy dist --project-name=protekto-gestao --branch=main
```

## Tela "Usuários" (criar novos logins pelo app)

Já implementada de verdade — não é mais mock. Ao criar um usuário pela tela, uma Edge Function (`supabase/functions/create-user`) cria a conta de login real no Supabase e o registro em `profiles`. "Excluir" desativa o acesso (não apaga a conta) e pode ser revertido em "Reativar".

Se precisar reimplantar essa função depois de alguma alteração: abra o Supabase → **Edge Functions** → `create-user` → **Code**, cole o conteúdo de [`supabase/functions/create-user/index.ts`](supabase/functions/create-user/index.ts) e clique em **Deploy updates**.

## 6. Apontar seu domínio do GoDaddy

1. No painel do Cloudflare Pages, no seu projeto, vá em **Custom domains** → **Set up a custom domain** e digite seu domínio (ex: `app.seudominio.com.br` ou o domínio raiz).
2. O Cloudflare vai te mostrar um registro DNS para criar (geralmente um `CNAME` apontando para `seuprojetos.pages.dev`).
3. No painel do GoDaddy (**Meu domínio → DNS**), adicione esse registro CNAME com o nome/host que o Cloudflare indicou.
4. Aguarde a propagação (de minutos a poucas horas) e acesse pelo seu domínio.

---

Qualquer erro em algum desses passos, me manda a mensagem/print que eu te ajudo a resolver.
