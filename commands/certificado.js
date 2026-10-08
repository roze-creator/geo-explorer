import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dadosTrilhas = JSON.parse(
  readFileSync(join(__dirname, '../data/trilhas.json'), 'utf-8')
);

/** Gera um código de certificado único e fictício. */
function gerarCodigo(nome, tecnologia) {
  const base = `${nome}-${tecnologia}-${Date.now()}`;
  let hash = 0;
  for (const char of base) {
    hash = (Math.imul(31, hash) + char.charCodeAt(0)) | 0;
  }
  return `GEO-${Math.abs(hash).toString(36).toUpperCase().padStart(8, '0')}`;
}

/** Formata a data atual em pt-BR. */
function dataAtual() {
  return new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Gera um certificado fictício de conclusão de trilha.
 * @param {string} nome  - Nome do(a) participante
 * @param {string} tecnologia
 * @param {string} [nivel]
 * @returns {string}
 */
export function gerarCertificado(nome, tecnologia, nivel) {
  if (!nome || !tecnologia) {
    return '❌ Uso: certificado <nome> <tecnologia> [nivel]';
  }

  const chave = tecnologia.toLowerCase().trim();
  const trilha = dadosTrilhas.trilhas.find(
    (t) => t.id === chave || t.tecnologia.toLowerCase() === chave
  );

  if (!trilha) {
    const disponiveis = dadosTrilhas.trilhas.map((t) => t.tecnologia).join(', ');
    return `❌ Trilha "${tecnologia}" não encontrada.\n📚 Disponíveis: ${disponiveis}`;
  }

  const nivelNorm = nivel?.toLowerCase().trim();
  const niveisValidos = Object.keys(trilha.niveis);

  if (nivelNorm && !niveisValidos.includes(nivelNorm)) {
    return `❌ Nível "${nivel}" inválido. Disponíveis: ${niveisValidos.join(', ')}`;
  }

  const nivelExibido = nivelNorm
    ? nivelNorm.charAt(0).toUpperCase() + nivelNorm.slice(1)
    : 'Completa';

  const duracao = nivelNorm
    ? trilha.niveis[nivelNorm].duracao
    : Object.values(trilha.niveis)
        .map((n) => parseInt(n.duracao))
        .reduce((a, b) => a + b, 0) + ' semanas';

  const codigo = gerarCodigo(nome, trilha.id + nivelNorm);

  const largura = 54;
  const linha = '═'.repeat(largura);
  /** Centraliza texto na largura do box, nunca ultrapassa. */
  const center = (txt) => {
    const visible = txt.replace(/\p{Emoji}/gu, '  '); // emojis ocupam 2 cols
    const pad = Math.max(0, Math.floor((largura - visible.length) / 2));
    const right = Math.max(0, largura - pad - visible.length);
    return ' '.repeat(pad) + txt + ' '.repeat(right);
  };

  const row = (txt) => `║${center(txt)}║`;

  return [
    `╔${linha}╗`,
    row('🏆  CERTIFICADO DE CONCLUSÃO  🏆'),
    row(''),
    row('Geo-Explorer — Trilhas de Aprendizagem'),
    `╠${linha}╣`,
    row(''),
    `║  Certificamos que                                    ║`,
    row(''),
    row(`✨  ${nome}  ✨`),
    row(''),
    `║  concluiu com exito a trilha de:                     ║`,
    row(''),
    row(`📚  ${trilha.tecnologia}  — Nivel ${nivelExibido}`),
    row(''),
    `║  Duracao: ${duracao.padEnd(43)}║`,
    `║  Data:    ${dataAtual().padEnd(43)}║`,
    `║  Codigo:  ${codigo.padEnd(43)}║`,
    row(''),
    `╠${linha}╣`,
    row('⚠  Certificado ficticio para fins educacionais'),
    `╚${linha}╝`,
  ].join('\n');
}

// ── Execução via CLI (só quando chamado diretamente) ────────────────
const isMain = process.argv[1] &&
  (await import('url')).pathToFileURL(process.argv[1]).href === import.meta.url;

if (isMain) {
  const args = process.argv.slice(2);
  const [nome, tecnologia, nivel] = args;

  if (!nome || !tecnologia) {
    console.log('Uso: node commands/certificado.js <nome> <tecnologia> [nivel]');
    console.log('Exemplo: node commands/certificado.js "Ana Silva" javascript intermediario');
    process.exit(0);
  }

  console.log(gerarCertificado(nome, tecnologia, nivel));
}
