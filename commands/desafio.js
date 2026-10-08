import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dadosTrilhas = JSON.parse(
  readFileSync(join(__dirname, '../data/trilhas.json'), 'utf-8')
);

/** Banco de desafios por tecnologia e nível. */
const desafios = {
  javascript: {
    iniciante: [
      {
        titulo: 'FizzBuzz',
        enunciado:
          'Escreva uma função que recebe um número inteiro `n` e retorna:\n' +
          '  - "Fizz" se for divisível por 3\n' +
          '  - "Buzz" se for divisível por 5\n' +
          '  - "FizzBuzz" se for divisível por ambos\n' +
          '  - o próprio número em qualquer outro caso',
        dica: 'Use o operador de módulo (%) para verificar divisibilidade.',
        exemplo: 'fizzBuzz(15) → "FizzBuzz"',
      },
      {
        titulo: 'Invertendo String',
        enunciado:
          'Crie uma função que receba uma string e retorne ela invertida, sem usar .reverse().',
        dica: 'Use um laço for decrescente ou .split() + .reduce().',
        exemplo: 'inverter("hello") → "olleh"',
      },
    ],
    intermediario: [
      {
        titulo: 'Debounce',
        enunciado:
          'Implemente uma função `debounce(fn, delay)` que retorna uma versão com debounce da função `fn`. ' +
          'A função retornada deve chamar `fn` apenas após `delay` milissegundos sem ser invocada novamente.',
        dica: 'Use setTimeout e clearTimeout.',
        exemplo: 'const pesquisar = debounce(buscarAPI, 300);',
      },
      {
        titulo: 'Promise.all manual',
        enunciado:
          'Implemente sua própria versão de `Promise.all` sem usar o método nativo. ' +
          'A função deve resolver quando todas as promises passadas resolverem, ' +
          'ou rejeitar assim que qualquer uma rejeitar.',
        dica: 'Use um contador para saber quando todas as promises terminaram.',
        exemplo: 'meuPromiseAll([p1, p2, p3]).then(valores => ...)',
      },
    ],
    avancado: [
      {
        titulo: 'Proxy reativo',
        enunciado:
          'Crie um sistema de reatividade simples usando `Proxy`. ' +
          'Dado um objeto, qualquer alteração em suas propriedades deve disparar um callback de "efeito" registrado.',
        dica: 'Use o trap `set` do Proxy e mantenha um Set de efeitos.',
        exemplo: 'const estado = reativo({ count: 0 }); efeito(() => console.log(estado.count));',
      },
    ],
  },
  python: {
    iniciante: [
      {
        titulo: 'Palíndromo',
        enunciado:
          'Escreva uma função `eh_palindromo(texto)` que retorne `True` se o texto for um palíndromo ' +
          'e `False` caso contrário. Ignore maiúsculas e espaços.',
        dica: 'Normalize o texto com .lower().replace(" ", "") antes de comparar.',
        exemplo: 'eh_palindromo("A man a plan a canal Panama") → True',
      },
      {
        titulo: 'Contador de palavras',
        enunciado:
          'Crie uma função que receba uma string e retorne um dicionário com a frequência de cada palavra.',
        dica: 'Use .split() e um dict para contar. Considere usar collections.Counter.',
        exemplo: 'contar_palavras("a b a c a b") → {"a": 3, "b": 2, "c": 1}',
      },
    ],
    intermediario: [
      {
        titulo: 'Decorador de cache',
        enunciado:
          'Implemente um decorador `@cache` que memorize o resultado de uma função ' +
          'com base nos seus argumentos (sem usar functools.lru_cache).',
        dica: 'Use um dicionário mapeando args → resultado. Converta os args com str().',
        exemplo: '@cache\ndef fib(n): ...',
      },
    ],
    avancado: [
      {
        titulo: 'Generator pipeline',
        enunciado:
          'Construa um pipeline de processamento de dados usando generators. ' +
          'Crie funções geradoras que possam ser encadeadas para: ' +
          '1) ler linhas de um arquivo, 2) filtrar linhas, 3) transformar dados.',
        dica: 'Use `yield from` e compose os generators com `for item in outro_gen()`.',
        exemplo: 'pipeline = transformar(filtrar(ler_arquivo("dados.csv")))',
      },
    ],
  },
  typescript: {
    iniciante: [
      {
        titulo: 'Tipando uma API',
        enunciado:
          'Crie as interfaces TypeScript para representar a resposta de uma API de usuários. ' +
          'Cada usuário tem: id (number), nome (string), email (string), ativo (boolean), ' +
          'e opcionalmente uma lista de permissões (string[]).',
        dica: 'Use `?` para marcar propriedades opcionais.',
        exemplo: 'interface Usuario { id: number; nome: string; ... }',
      },
    ],
    intermediario: [
      {
        titulo: 'Generic Stack',
        enunciado:
          'Implemente uma estrutura de dados Stack (pilha) genérica em TypeScript ' +
          'com os métodos push, pop, peek e isEmpty, todos corretamente tipados.',
        dica: 'Use `class Stack<T>` e mantenha um array privado como armazenamento.',
        exemplo: 'const pilha = new Stack<number>(); pilha.push(1);',
      },
    ],
    avancado: [
      {
        titulo: 'DeepReadonly',
        enunciado:
          'Crie um tipo utilitário `DeepReadonly<T>` que torna todas as propriedades ' +
          'de um objeto imutáveis de forma recursiva, incluindo objetos aninhados.',
        dica: 'Use tipos condicionais e mapeados do TypeScript.',
        exemplo: 'type Config = DeepReadonly<{ db: { host: string } }>;',
      },
    ],
  },
  node: {
    iniciante: [
      {
        titulo: 'Servidor de arquivos estáticos',
        enunciado:
          'Crie um servidor HTTP com o módulo nativo `http` do Node.js que sirva arquivos ' +
          'estáticos de uma pasta `public/`. Se o arquivo não existir, retorne 404.',
        dica: 'Use `fs.readFile` e inspecione a URL da requisição.',
        exemplo: 'GET /index.html → lê e serve ./public/index.html',
      },
    ],
    intermediario: [
      {
        titulo: 'API REST com Express',
        enunciado:
          'Crie uma API REST para gerenciar uma lista de tarefas (to-do list) usando Express. ' +
          'Implemente os endpoints: GET /tasks, POST /tasks, PUT /tasks/:id e DELETE /tasks/:id. ' +
          'Persista os dados em um arquivo JSON.',
        dica: 'Use `express.json()` como middleware e `fs.writeFileSync` para persistir.',
        exemplo: 'POST /tasks { "titulo": "Estudar Node" } → 201 Created',
      },
    ],
    avancado: [
      {
        titulo: 'Rate Limiter middleware',
        enunciado:
          'Implemente um middleware de rate limiting para Express sem bibliotecas externas. ' +
          'Limite cada IP a 100 requisições por janela de 15 minutos. ' +
          'Retorne 429 Too Many Requests quando o limite for atingido.',
        dica: 'Use um Map para armazenar contadores por IP e Date.now() para controlar a janela de tempo.',
        exemplo: 'app.use(rateLimiter({ max: 100, windowMs: 15 * 60 * 1000 }));',
      },
    ],
  },
  cpp: {
    iniciante: [
      {
        titulo: 'Calculadora de ponteiros',
        enunciado:
          'Crie um programa que declare um array de 5 inteiros, percorra-o usando ' +
          'aritmética de ponteiros (sem usar índices) e calcule a soma dos elementos.',
        dica: 'Use um ponteiro `int* p = arr` e incremente com `p++` a cada iteração.',
        exemplo: 'int arr[] = {1,2,3,4,5}; // soma → 15',
      },
      {
        titulo: 'Fibonacci recursivo',
        enunciado:
          'Implemente a função `fib(n)` que retorna o n-ésimo número de Fibonacci ' +
          'de forma recursiva. Adicione casos base para n <= 1.',
        dica: 'fib(0)=0, fib(1)=1, fib(n)=fib(n-1)+fib(n-2).',
        exemplo: 'fib(10) → 55',
      },
    ],
    intermediario: [
      {
        titulo: 'Classe Vector genérica',
        enunciado:
          'Implemente uma classe template `MyVector<T>` com os métodos `push_back`, ' +
          '`pop_back`, `operator[]` e `size`. Gerencie a memória dinamicamente com `new` e `delete[]`.',
        dica: 'Mantenha um ponteiro `T* data`, um `capacity` e um `size`. Duplique o capacity quando necessário.',
        exemplo: 'MyVector<int> v; v.push_back(42); v[0] → 42',
      },
      {
        titulo: 'Smart pointer único',
        enunciado:
          'Implemente uma versão simplificada de `unique_ptr<T>` com construtor, destrutor, ' +
          '`operator*`, `operator->` e método `release()`. Proíba cópia mas permita move semantics.',
        dica: 'Delete o construtor de cópia e o operador de atribuição por cópia. Implemente o construtor de move.',
        exemplo: 'MyUniquePtr<int> p(new int(10)); *p → 10',
      },
    ],
    avancado: [
      {
        titulo: 'Thread pool',
        enunciado:
          'Implemente um `ThreadPool` que aceite tarefas (`std::function<void()>`) via `enqueue()`, ' +
          'as execute em N threads trabalhadoras e encerre de forma limpa ao ser destruído.',
        dica: 'Use `std::queue`, `std::mutex`, `std::condition_variable` e `std::thread`. ' +
              'No destrutor, sete um flag de parada e chame `notify_all()`.',
        exemplo: 'ThreadPool pool(4); pool.enqueue([] { /* tarefa */ });',
      },
    ],
  },
};

/**
 * Gera um desafio de código para a tecnologia e nível especificados.
 * @param {string} tecnologia
 * @param {string} nivel
 * @returns {string}
 */
export function gerarDesafio(tecnologia, nivel) {
  const chave = tecnologia.toLowerCase().trim();
  const nivelNorm = nivel?.toLowerCase().trim() || 'iniciante';

  const tecnologiaExiste = dadosTrilhas.trilhas.some(
    (t) => t.id === chave || t.tecnologia.toLowerCase() === chave
  );

  if (!tecnologiaExiste) {
    const disponiveis = dadosTrilhas.trilhas.map((t) => t.tecnologia).join(', ');
    return `❌ Tecnologia "${tecnologia}" não encontrada.\n📚 Disponíveis: ${disponiveis}`;
  }

  const pool = desafios[chave]?.[nivelNorm];
  if (!pool || pool.length === 0) {
    return `❌ Nenhum desafio encontrado para ${tecnologia} nível ${nivel}.`;
  }

  const desafio = pool[Math.floor(Math.random() * pool.length)];

  return [
    `╔══════════════════════════════════════╗`,
    `  💻 Desafio: ${desafio.titulo}`,
    `  🏷  Tecnologia: ${tecnologia} | Nível: ${nivelNorm}`,
    `╚══════════════════════════════════════╝`,
    '',
    `📋 Enunciado:`,
    desafio.enunciado,
    '',
    `💡 Dica: ${desafio.dica}`,
    '',
    `📌 Exemplo: ${desafio.exemplo}`,
    '',
    `─────────────────────────────────────`,
    `⏳ Boa sorte! Resolva e teste sua solução.`,
  ].join('\n');
}

// ── Execução via CLI (só quando chamado diretamente) ────────────────
const isMain = process.argv[1] &&
  (await import('url')).pathToFileURL(process.argv[1]).href === import.meta.url;

if (isMain) {
  const args = process.argv.slice(2);
  const [tecnologia, nivel] = args;

  if (!tecnologia) {
    console.log('Uso: node commands/desafio.js <tecnologia> [nivel]');
    console.log('Níveis: iniciante | intermediario | avancado');
    console.log('Exemplo: node commands/desafio.js python intermediario');
    process.exit(0);
  }

  console.log(gerarDesafio(tecnologia, nivel));
}
