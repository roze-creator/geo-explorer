import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dadosTrilhas = JSON.parse(
  readFileSync(join(__dirname, '../data/trilhas.json'), 'utf-8')
);

/**
 * Busca uma trilha pelo id/nome da tecnologia.
 * @param {string} tecnologia
 * @returns {object|null}
 */
export function buscarTrilha(tecnologia) {
  const chave = tecnologia.toLowerCase().trim();
  return (
    dadosTrilhas.trilhas.find(
      (t) => t.id === chave || t.tecnologia.toLowerCase() === chave
    ) ?? null
  );
}

/**
 * Retorna o plano de estudos formatado em texto.
 * @param {string} tecnologia
 * @param {string} [nivel]
 * @returns {string}
 */
export function exibirTrilha(tecnologia, nivel) {
  const trilha = buscarTrilha(tecnologia);

  if (!trilha) {
    const disponiveis = dadosTrilhas.trilhas.map((t) => t.tecnologia).join(', ');
    return `❌ Trilha "${tecnologia}" não encontrada.\n📚 Trilhas disponíveis: ${disponiveis}`;
  }

  const nivelNormalizado = nivel?.toLowerCase().trim();
  const niveisValidos = Object.keys(trilha.niveis);

  if (nivelNormalizado && !niveisValidos.includes(nivelNormalizado)) {
    return `❌ Nível "${nivel}" inválido para a trilha ${trilha.tecnologia}.\n📊 Níveis disponíveis: ${niveisValidos.join(', ')}`;
  }

  const niveisParaExibir = nivelNormalizado
    ? { [nivelNormalizado]: trilha.niveis[nivelNormalizado] }
    : trilha.niveis;

  const linhas = [
    `╔══════════════════════════════════════╗`,
    `  📍 Trilha: ${trilha.tecnologia}`,
    `  📝 ${trilha.descricao}`,
    `╚══════════════════════════════════════╝`,
    '',
  ];

  for (const [nomeNivel, dados] of Object.entries(niveisParaExibir)) {
    linhas.push(`🎯 Nível: ${nomeNivel.charAt(0).toUpperCase() + nomeNivel.slice(1)}`);
    linhas.push(`⏱  Duração estimada: ${dados.duracao}`);
    linhas.push(`📖 Módulos:`);
    dados.modulos.forEach((modulo, i) => {
      linhas.push(`   ${i + 1}. ${modulo}`);
    });
    linhas.push('');
  }

  return linhas.join('\n');
}

// ── Execução via CLI (só quando chamado diretamente) ────────────────
const isMain = process.argv[1] &&
  (await import('url')).pathToFileURL(process.argv[1]).href === import.meta.url;

if (isMain) {
  const args = process.argv.slice(2);
  const [tecnologia, nivel] = args;

  if (!tecnologia) {
    console.log('Uso: node commands/trilha.js <tecnologia> [nivel]');
    console.log('Exemplo: node commands/trilha.js javascript iniciante');
    process.exit(0);
  }

  console.log(exibirTrilha(tecnologia, nivel));
}
