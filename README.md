# 🌍 Geo-Explorer

Explorador interativo de trilhas de aprendizagem para desenvolvedores. Consulte trilhas de estudo, receba desafios de código e gere certificados fictícios — tudo pela linha de comando ou via servidor MCP.

---

## 📦 O que é o Geo-Explorer

O Geo-Explorer é um projeto de portfólio construído com Node.js puro (sem framework) que expõe três comandos principais:

| Comando       | O que faz                                                   |
|---------------|-------------------------------------------------------------|
| `trilha`      | Exibe o plano de estudos de uma tecnologia por nível        |
| `desafio`     | Gera um desafio de código conforme tecnologia e nível       |
| `certificado` | Cria um certificado fictício de conclusão de trilha         |

Além dos comandos CLI, o projeto inclui um **servidor MCP** que expõe essas mesmas funcionalidades como ferramentas para assistentes de IA (como o IBM Bob).

---

## 🚀 Como executar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/geo-explorer.git
cd geo-explorer

# Instale as dependências
npm install
```

---

## 🧭 Como usar os comandos

### Trilha

Exibe o plano de estudos de uma tecnologia, opcionalmente filtrado por nível.

```bash
node commands/trilha.js <tecnologia> [nivel]
```

**Exemplos:**
```bash
# Exibe todos os níveis de JavaScript
node commands/trilha.js javascript

# Exibe apenas o nível iniciante de Python
node commands/trilha.js python iniciante

# Exibe o nível avançado de Node.js
node commands/trilha.js node avancado
```

**Tecnologias disponíveis:** `javascript`, `python`, `typescript`, `node`  
**Níveis disponíveis:** `iniciante`, `intermediario`, `avancado`

---

### Desafio

Gera um desafio de código aleatório para a tecnologia e nível informados.

```bash
node commands/desafio.js <tecnologia> [nivel]
```

**Exemplos:**
```bash
# Desafio iniciante de JavaScript
node commands/desafio.js javascript iniciante

# Desafio avançado de Python
node commands/desafio.js python avancado

# Desafio de TypeScript (nível padrão: iniciante)
node commands/desafio.js typescript
```

---

### Certificado

Gera um certificado fictício de conclusão para o participante informado.

```bash
node commands/certificado.js "<nome>" <tecnologia> [nivel]
```

**Exemplos:**
```bash
# Certificado de nível intermediário de JavaScript
node commands/certificado.js "Ana Silva" javascript intermediario

# Certificado de trilha completa de Python
node commands/certificado.js "Carlos Mendes" python

# Certificado de nível avançado de Node.js
node commands/certificado.js "Maria Costa" node avancado
```

---

## 🧪 Como executar os testes

O projeto usa [Jest](https://jestjs.io/) para testes automatizados.

```bash
npm test
```

Os testes cobrem os três comandos e validam:
- Retorno correto para inputs válidos
- Mensagens de erro para tecnologias/níveis inválidos
- Comportamento de edge cases (nome vazio, nível não informado, etc.)

Para rodar os testes de um comando específico:
```bash
npx jest tests/trilha.test.js
npx jest tests/desafio.test.js
npx jest tests/certificado.test.js
```

---

## 🔌 Servidor MCP

O Geo-Explorer inclui um servidor MCP que expõe os três comandos como ferramentas para assistentes de IA.

### Iniciar o servidor

```bash
node mcp/server.js
```

### Registrar no IBM Bob

Adicione ao seu `mcp.json`:

```json
{
  "mcpServers": {
    "geo-explorer": {
      "command": "node",
      "args": ["/caminho/absoluto/para/geo-explorer/mcp/server.js"]
    }
  }
}
```

### Ferramentas disponíveis via MCP

| Ferramenta    | Parâmetros                          |
|---------------|-------------------------------------|
| `trilha`      | `tecnologia` (obrigatório), `nivel` |
| `desafio`     | `tecnologia` (obrigatório), `nivel` |
| `certificado` | `nome`, `tecnologia`, `nivel`       |

---

## 📁 Estrutura do projeto

```
geo-explorer/
├── commands/
│   ├── trilha.js         # Comando de trilha de estudos
│   ├── desafio.js        # Gerador de desafios de código
│   └── certificado.js    # Gerador de certificados fictícios
├── data/
│   └── trilhas.json      # Base de dados das trilhas
├── docs/                 # Documentação adicional
├── mcp/
│   └── server.js         # Servidor MCP
├── tests/
│   ├── trilha.test.js
│   ├── desafio.test.js
│   └── certificado.test.js
├── package.json
└── README.md
```

---

## ✨ Melhorias realizadas

- **4 tecnologias** cobertas com 3 níveis cada (JavaScript, Python, TypeScript, Node.js)
- **Desafios variados** e aleatórios por nível (seleção aleatória do banco)
- **Código de certificado determinístico** baseado em hash do nome + tecnologia
- **Servidor MCP completo** com validação de schema via Zod
- **Testes automatizados** com cobertura de cenários válidos e de erro

---

## 📚 O que aprendi durante o desafio

- Como estruturar um projeto Node.js modular com ES Modules
- Como criar e expor ferramentas via protocolo MCP com `@modelcontextprotocol/sdk`
- Como escrever testes unitários com Jest para módulos ES6
- Como usar hashing simples para gerar identificadores únicos e reproduzíveis
- A importância de separar dados (JSON), lógica (commands) e interface (CLI vs MCP)

---

## ⚠️ Aviso

Os certificados gerados são **fictícios** e têm **fins exclusivamente educacionais**. Não representam qualificação ou credencial real.

---

*Projeto desenvolvido como parte do desafio DIO — Geo-Explorer 🌍*
