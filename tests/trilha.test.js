import { exibirTrilha, buscarTrilha } from '../commands/trilha.js';

describe('Comando: trilha', () => {
  test('retorna plano de estudos completo para tecnologia válida', () => {
    const resultado = exibirTrilha('javascript');
    expect(resultado).toContain('JavaScript');
    expect(resultado).toContain('Nível: Iniciante');
    expect(resultado).toContain('Nível: Intermediario');
    expect(resultado).toContain('Nível: Avancado');
  });

  test('retorna apenas o nível especificado', () => {
    const resultado = exibirTrilha('python', 'iniciante');
    expect(resultado).toContain('Python');
    expect(resultado).toContain('Nível: Iniciante');
    expect(resultado).not.toContain('Nível: Intermediario');
    expect(resultado).not.toContain('Nível: Avancado');
  });

  test('retorna erro para tecnologia não encontrada', () => {
    const resultado = exibirTrilha('cobol');
    expect(resultado).toContain('❌');
    expect(resultado).toContain('não encontrada');
  });

  test('retorna erro para nível inválido', () => {
    const resultado = exibirTrilha('node', 'expert');
    expect(resultado).toContain('❌');
    expect(resultado).toContain('inválido');
  });

  test('buscarTrilha retorna null para tecnologia inexistente', () => {
    expect(buscarTrilha('rust')).toBeNull();
  });

  test('buscarTrilha é case-insensitive', () => {
    const trilha = buscarTrilha('JAVASCRIPT');
    expect(trilha).not.toBeNull();
    expect(trilha.tecnologia).toBe('JavaScript');
  });

  test('retorna plano para typescript', () => {
    const resultado = exibirTrilha('typescript', 'intermediario');
    expect(resultado).toContain('TypeScript');
    expect(resultado).toContain('Generics');
  });
});
