# 📖 Guia do Iniciante — Como o Geo-Explorer foi construído

> Este guia explica, passo a passo, como o projeto Geo-Explorer foi desenvolvido.
> Cada etapa traz o **o quê**, o **porquê** e os **conceitos** que você precisa entender.
> Ideal para quem está começando em programação e quer aprender fazendo.

---

## 🗺️ Visão Geral do Projeto

O Geo-Explorer é uma ferramenta de linha de comando (CLI) que faz três coisas:

1. **Trilha** — mostra um plano de estudos de uma tecnologia
2. **Desafio** — gera um exercício de código
3. **Certificado** — emite um certificado fictício de conclusão

Além disso, ele tem uma **interface visual** (página web) e um **servidor MCP** (para integração com assistentes de IA como o IBM Bob).

---

## 🧰 Ferramentas e Conceitos Necessários

Antes de entrar nas etapas, aqui está um glossário do que você vai encontrar:

### Node.js
É um ambiente que permite rodar JavaScript fora do navegador — no seu computador ou servidor.
Pense nele como o "motor" que executa os arquivos `.js` do projeto.
→ Site oficial: [nodejs.org](https://nodejs.org)

### npm (Node Package Manager)
É o gerenciador de pacotes do Node.js. Serve para instalar bibliotecas prontas que outras pessoas criaram.
O comando `npm install` lê o arquivo `package.json` e baixa tudo que o projeto precisa.

### JavaScript com ES Modules
O projeto usa a sintaxe moderna de módulos do JavaScript:
- `export function minhaFuncao() {}` → torna a função disponível para outros arquivos
- `import { minhaFuncao } from './arquivo.js'` → importa a função em outro arquivo

Isso permite separar o código em arquivos menores e organizados.

### JSON (JavaScript Object Notation)
Formato de arquivo para guardar dados estruturados. Parece com um objeto JavaScript:
```json
{ "nome": "JavaScript", "nivel": "iniciante" }
```
É usado no projeto para armazenar as trilhas de aprendizagem.

### CLI (Command Line Interface)
Interface de linha de comando. Em vez de clicar em botões, você digita comandos no terminal:
```bash
node commands/trilha.js javascript iniciante
```

### Jest
Ferramenta de testes automatizados para JavaScript. Você escreve testes que verificam se
o seu código funciona corretamente, e o Jest roda todos de uma vez.

### MCP (Model Context Protocol)
Protocolo criado para permitir que assistentes de IA (como o IBM Bob) usem ferramentas externas.
O servidor MCP expõe as funções do projeto como "ferramentas" que a IA pode chamar.

### HTML/CSS/JavaScript (interface visual)
A interface web é um único arquivo `.html` que roda direto no navegador, sem precisar de servidor.
Usa HTML para estrutura, CSS para estilo e JavaScript para a lógica interativa.

---

## 📁 Etapa 1 — Criar a Estrutura de Pastas

**O que foi feito:**
Criamos a estrutura de diretórios do projeto antes de escrever qualquer código.

```
geo-explorer/
├── commands/    ← onde ficam os comandos principais
├── data/        ← arquivos de dados (JSON)
├── docs/        ← documentação
├── mcp/         ← servidor MCP
└── tests/       ← testes automatizados
```

**Por que organizar assim?**
Separar o código por responsabilidade (dados, lógica, testes) é uma boa prática chamada
**separação de conceitos**. Facilita encontrar arquivos, manter o código e trabalhar em equipe.

**Comando usado:**
```powershell
New-Item -ItemType Directory -Force -Path geo-explorer/data, geo-explorer/commands, ...
```
`New-Item` é um comando do PowerShell para criar arquivos e pastas.

---

## 📦 Etapa 2 — Criar o `package.json`

**O que foi feito:**
Criamos o arquivo de configuração do projeto Node.js.

```json
{
  "name": "geo-explorer",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

**Conceitos importantes:**

- **`"type": "module"`** → diz ao Node.js para tratar todos os `.js` como ES Modules (usando `import/export`)
- **`dependencies`** → pacotes necessários para o projeto funcionar em produção
- **`devDependencies`** → pacotes usados apenas durante o desenvolvimento (como o Jest para testes)
- **`scripts`** → atalhos de comando; `npm test` executa o que está em `"test"`

---

## 🗄️ Etapa 3 — Montar a Base de Trilhas (`data/trilhas.json`)

**O que foi feito:**
Criamos um arquivo JSON com as informações de cada tecnologia: nome, descrição, níveis e módulos.

```json
{
  "trilhas": [
    {
      "id": "javascript",
      "tecnologia": "JavaScript",
      "descricao": "...",
      "niveis": {
        "iniciante": {
          "duracao": "4 semanas",
          "modulos": ["Módulo 1", "Módulo 2"]
        }
      }
    }
  ]
}
```

**Por que JSON?**
É um formato simples, legível por humanos e fácil de ler com JavaScript usando `JSON.parse()`.
Separar os dados do código (lógica) é uma boa prática: se você quiser adicionar uma nova trilha,
basta editar o JSON — sem mexer no código.

---

## ⌨️ Etapa 4 — Criar o Comando `trilha.js`

**O que foi feito:**
Criamos o arquivo que lê o JSON e exibe o plano de estudos formatado.

**Estrutura do arquivo:**
```
1. Importar dependências (fs, path, url)
2. Ler e parsear o trilhas.json
3. Definir e exportar as funções: buscarTrilha() e exibirTrilha()
4. Bloco CLI: executar somente quando chamado diretamente
```

**Conceito-chave — separar lógica de execução:**
As funções `buscarTrilha` e `exibirTrilha` são **exportadas** para que os testes e o servidor MCP
possam usá-las. O bloco CLI no final só roda quando o arquivo é chamado diretamente pelo Node:

```js
const isMain = process.argv[1] &&
  (await import('url')).pathToFileURL(process.argv[1]).href === import.meta.url;

if (isMain) {
  // executa somente via terminal
}
```

**Por que isso é importante?**
Sem essa verificação, quando o Jest importa o arquivo para testar, o `process.exit(0)` seria
chamado e travaria todos os testes. Esse foi um bug real que encontramos e corrigimos.

**`process.argv`** → array com os argumentos passados na linha de comando.
`process.argv[0]` = caminho do Node, `process.argv[1]` = caminho do script,
`process.argv[2]` em diante = argumentos do usuário.

---

## 💻 Etapa 5 — Criar o Comando `desafio.js`

**O que foi feito:**
Criamos um banco de desafios de código organizados por tecnologia e nível, e uma função que
sorteia um desafio aleatoriamente.

**Conceito-chave — seleção aleatória:**
```js
const desafio = pool[Math.floor(Math.random() * pool.length)];
```
- `Math.random()` → retorna um número decimal entre 0 e 1 (ex: 0.73)
- `* pool.length` → multiplica pelo tamanho do array (ex: 0.73 × 3 = 2.19)
- `Math.floor()` → arredonda para baixo (2.19 → 2), dando um índice válido

**Estrutura de dados usada:**
```js
const desafios = {
  javascript: {
    iniciante: [ { titulo, enunciado, dica, exemplo }, ... ],
    intermediario: [ ... ],
    avancado: [ ... ]
  },
  python: { ... }
};
```
Usar um objeto com chaves aninhadas permite acessar o desafio certo com
`desafios[tecnologia][nivel]` — direto e eficiente.

---

## 🏆 Etapa 6 — Criar o Comando `certificado.js`

**O que foi feito:**
Criamos a função que gera um certificado fictício com nome, tecnologia, nível, data e código único.

**Conceito-chave — hash para código único:**
```js
function gerarCodigo(nome, tecnologia) {
  const base = `${nome}-${tecnologia}-${Date.now()}`;
  let hash = 0;
  for (const char of base) {
    hash = (Math.imul(31, hash) + char.charCodeAt(0)) | 0;
  }
  return `GEO-${Math.abs(hash).toString(36).toUpperCase().padStart(8, '0')}`;
}
```

- **Hash** → algoritmo que transforma qualquer texto em um número de tamanho fixo
- `Math.imul(31, hash)` → multiplicação inteira de 32 bits (padrão djb2)
- `char.charCodeAt(0)` → código numérico do caractere (ex: 'A' = 65)
- `.toString(36)` → converte para base 36 (0-9 + a-z), gerando códigos como `GEO-A3F9B2C1`
- `| 0` → força o resultado para inteiro de 32 bits (evita overflow)

---

## 🔌 Etapa 7 — Criar o Servidor MCP (`mcp/server.js`)

**O que foi feito:**
Criamos um servidor que expõe os três comandos como "ferramentas" para assistentes de IA.

**Como funciona o MCP:**
```
Assistente de IA (IBM Bob)
        ↕  protocolo MCP (JSON sobre stdio)
   Servidor MCP (mcp/server.js)
        ↕  import
   Funções dos comandos (trilha, desafio, certificado)
```

**Código básico de uma ferramenta MCP:**
```js
server.registerTool(
  'trilha',                          // nome da ferramenta
  {
    description: 'Mostra plano de estudos',
    inputSchema: z.object({          // validação dos parâmetros com Zod
      tecnologia: z.string(),
      nivel: z.string().optional(),
    }),
  },
  async ({ tecnologia, nivel }) => { // função que executa
    const resultado = exibirTrilha(tecnologia, nivel);
    return { content: [{ type: 'text', text: resultado }] };
  }
);
```

**Zod** é uma biblioteca de validação de dados. `z.object({ ... })` define a forma esperada
dos parâmetros — se o assistente mandar algo errado, o Zod rejeita antes de executar.

**`stdio` (standard input/output):** canal de comunicação padrão do terminal.
O servidor MCP usa stdio para trocar mensagens JSON com o assistente de IA.

---

## 🧪 Etapa 8 — Criar os Testes Automatizados

**O que foi feito:**
Criamos testes com Jest para verificar que cada comando funciona corretamente.

**Anatomia de um teste:**
```js
describe('Comando: trilha', () => {        // grupo de testes
  test('retorna plano para tecnologia válida', () => {  // um teste
    const resultado = exibirTrilha('javascript');       // executa a função
    expect(resultado).toContain('JavaScript');          // verifica o resultado
  });
});
```

- **`describe`** → agrupa testes relacionados
- **`test`** → define um caso de teste individual
- **`expect(...).toContain(...)`** → verifica se o resultado contém o texto esperado
- **`expect(...).toBeNull()`** → verifica se o resultado é null
- **`expect(...).not.toContain(...)`** → verifica que o texto NÃO está presente

**Por que testar?**
Testes garantem que, ao modificar o código, você não quebra o que já funcionava.
É uma rede de segurança para o seu projeto.

**Bug encontrado e corrigido durante os testes:**
O Jest importa os arquivos dos comandos para testá-los. Como o bloco CLI no final dos arquivos
chamava `process.exit(0)` quando não havia argumentos, o worker do Jest encerrava antes de
rodar qualquer teste. A solução foi envolver o bloco CLI na verificação `isMain` (veja Etapa 4).

---

## 🌐 Etapa 9 — Criar a Interface Visual (`index.html`)

**O que foi feito:**
Criamos uma página web completa em um único arquivo HTML com todo o CSS e JavaScript embutido.

**Por que um único arquivo?**
Para que qualquer pessoa possa abrir clicando duas vezes, sem precisar de servidor web,
instalação ou configuração adicional.

**Estrutura do arquivo:**
```
index.html
├── <style> ... </style>     ← todo o CSS (cores, layout, animações)
├── <header>                 ← barra de navegação com abas
├── <section id="tab-trilha">    ← aba de trilhas
├── <section id="tab-desafio">   ← aba de desafios
├── <section id="tab-certificado"> ← aba de certificados
└── <script> ... </script>   ← toda a lógica JavaScript
```

**Conceitos de CSS usados:**
- **CSS Variables** (`--accent: #6c63ff`) → cores reutilizáveis em todo o arquivo
- **CSS Grid** (`display: grid`) → organiza os cards em colunas automáticas
- **Flexbox** (`display: flex`) → alinha elementos em linha ou coluna
- **Transition** → animações suaves ao passar o mouse nos cards

**Conceito de JavaScript no navegador:**
```js
document.getElementById('btn-trilha')
  .addEventListener('click', renderTrilha);
```
`addEventListener` registra uma função para ser chamada quando o botão é clicado.
`document.getElementById` localiza um elemento HTML pelo seu `id`.

---

## 📋 Etapa 10 — Documentar o Projeto (`README.md`)

**O que foi feito:**
Criamos o README principal do projeto explicando o que é, como instalar, como usar e como testar.

**Por que o README é importante?**
É a primeira coisa que as pessoas veem quando acessam o repositório no GitHub.
Um bom README mostra que o projeto é sério e facilita a vida de quem quer usá-lo.

**Markdown** é a linguagem usada no README:
- `# Título` → título grande
- `## Subtítulo` → subtítulo
- `` `código` `` → trecho de código em linha
- ` ```bash ... ``` ` → bloco de código com destaque de sintaxe
- `| col1 | col2 |` → tabela

---

## 🐛 Bugs Encontrados e Corrigidos

Durante o desenvolvimento, encontramos dois bugs reais:

### Bug 1 — `process.exit` nos testes
**Problema:** O Jest travava ao importar os arquivos de comando porque `process.exit(0)` era
chamado quando não havia argumentos passados.  
**Diagnóstico:** O output do Jest mostrava `process.exit called with "0"` e `worker crashed`.  
**Solução:** Envolver o bloco CLI com a verificação `isMain` que compara `import.meta.url`
com `process.argv[1]`.

### Bug 2 — `String.repeat(-2)` no certificado
**Problema:** A função que centralizava texto no certificado calculava um número negativo
quando o texto era mais largo que a largura do box, causando `RangeError: Invalid count value`.  
**Diagnóstico:** O output do Jest mostrava o erro exatamente na linha do `.repeat()`.  
**Solução:** Usar `Math.max(0, ...)` para garantir que o padding nunca seja negativo, e
reescrever a função `center` para calcular separadamente o espaço à esquerda e à direita.

---

## 🏗️ Arquitetura Final do Projeto

```
geo-explorer/
│
├── 📄 index.html          Interface visual (abre no navegador)
├── 📄 package.json        Configuração do projeto Node.js
├── 📄 README.md           Documentação principal
│
├── 📁 data/
│   └── trilhas.json       Base de dados das trilhas (JSON)
│
├── 📁 commands/
│   ├── trilha.js          Exibe plano de estudos
│   ├── desafio.js         Gera desafio de código
│   └── certificado.js     Gera certificado fictício
│
├── 📁 mcp/
│   └── server.js          Servidor MCP (integração com IA)
│
├── 📁 tests/
│   ├── trilha.test.js      7 testes do comando trilha
│   ├── desafio.test.js     7 testes do comando desafio
│   └── certificado.test.js 8 testes do comando certificado
│
└── 📁 docs/
    └── GUIA-INICIANTE.md  Este arquivo
```

**Fluxo de dados:**
```
trilhas.json  ──→  commands/*.js  ──→  CLI (terminal)
                        ↑                    
                   mcp/server.js  ──→  Assistente de IA
                        ↑
                   index.html     ──→  Navegador (interface visual)
```

---

## 📚 Próximos Passos Sugeridos

Agora que você entende como o projeto foi construído, aqui estão sugestões para evoluir:

1. **Adicionar mais trilhas** → edite `data/trilhas.json` e `commands/desafio.js`
2. **Criar um banco maior de desafios** → adicione mais objetos nos arrays de cada nível
3. **Salvar o histórico** → use `fs.writeFileSync` para guardar trilhas consultadas em um arquivo
4. **Melhorar a interface** → adicione filtros, modo claro/escuro, animações
5. **Publicar no GitHub** → crie um repositório e use `git push` para enviar o projeto
6. **Adicionar mais testes** → escreva casos de teste para cenários que ainda não são cobertos

---

*Guia elaborado como parte do desafio DIO — Geo-Explorer 🌍*
