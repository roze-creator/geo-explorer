import { gerarDesafio } from '../commands/desafio.js';

describe('Comando: desafio', () => {
  test('gera desafio para tecnologia e nível válidos', () => {
    const resultado = gerarDesafio('javascript', 'iniciante');
    expect(resultado).toContain('💻 Desafio:');
    expect(resultado).toContain('javascript');
    expect(resultado).toContain('iniciante');
  });

  test('usa nível "iniciante" como padrão quando nível não é informado', () => {
    const resultado = gerarDesafio('python');
    expect(resultado).toContain('iniciante');
  });

  test('retorna erro para tecnologia inválida', () => {
    const resultado = gerarDesafio('golang', 'iniciante');
    expect(resultado).toContain('❌');
    expect(resultado).toContain('não encontrada');
  });

  test('retorna erro para tecnologia válida sem desafios nesse nível', () => {
    const resultado = gerarDesafio('node', 'expert');
    expect(resultado).toContain('❌');
  });

  test('gera desafio contendo enunciado e dica', () => {
    const resultado = gerarDesafio('typescript', 'intermediario');
    expect(resultado).toContain('📋 Enunciado:');
    expect(resultado).toContain('💡 Dica:');
    expect(resultado).toContain('📌 Exemplo:');
  });

  test('gera desafio avançado para python', () => {
    const resultado = gerarDesafio('python', 'avancado');
    expect(resultado).toContain('python');
    expect(resultado).toContain('avancado');
  });

  test('desafios de node nível intermediario são gerados', () => {
    const resultado = gerarDesafio('node', 'intermediario');
    expect(resultado).toContain('Node');
    expect(resultado).not.toContain('❌');
  });
});
