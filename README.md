# Calculadora Sugar

Calculadora para estimar benefícios e potencial de ganhos como sugar baby.

## Tecnologias Utilizadas

- Node.js
- Express.js
- Armazenamento local em JSON
- JWT para autenticação
- HTML/CSS/JavaScript (Frontend)

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Crie um arquivo `.env` na raiz do projeto
- Copie o conteúdo de `.env.example`
- Preencha com suas configurações

## Variáveis de Ambiente Necessárias

- `PORT`: Porta do servidor (padrão: 3000)
- `JWT_SECRET`: Chave secreta para tokens JWT
- `JWT_EXPIRE`: Tempo de expiração do token (ex: 24h)
- `NODE_ENV`: Ambiente (development/production)

## Desenvolvimento Local

```bash
npm run dev
```

## Produção

```bash
npm start
```

## Deploy no Render

1. Crie uma conta no [Render](https://render.com)
2. Conecte seu repositório GitHub
3. Crie um novo Web Service
4. Configure as variáveis de ambiente
5. Deploy!

### Configuração no Render

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: Configure todas as variáveis do `.env`

## Painel Administrativo

O painel administrativo está disponível em `/admin` e requer autenticação.

### Funcionalidades do Admin

- Dashboard com métricas
- Análise de interações
- Ranking de cidades
- Comparativo de plataformas
- Relatórios

### Primeiro Acesso

1. Configure as credenciais iniciais no `.env`
2. Acesse `/admin`
3. Use as credenciais configuradas
4. **Importante**: Altere a senha após o primeiro acesso

## Armazenamento de Dados

Os dados são armazenados localmente em arquivos JSON na pasta `data/`:
- `users.json`: Informações dos usuários
- `stats.json`: Estatísticas do sistema
- `interactions.json`: Registro de interações

## Segurança

- Autenticação JWT
- Rate Limiting
- Helmet para headers HTTP
- CORS configurado
- Senhas criptografadas

## Licença

MIT 