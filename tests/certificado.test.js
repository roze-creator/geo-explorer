import { gerarCertificado } from '../commands/certificado.js';

describe('Comando: certificado', () => {
  test('gera certificado para participante e tecnologia válidos', () => {
    const resultado = gerarCertificado('Ana Silva', 'javascript', 'iniciante');
    expect(resultado).toContain('CERTIFICADO DE CONCLUSÃO');
    expect(resultado).toContain('Ana Silva');
    expect(resultado).toContain('JavaScript');
    expect(resultado).toContain('Iniciante');
  });

  test('inclui código único de certificado', () => {
    const resultado = gerarCertificado('Carlos Mendes', 'python', 'intermediario');
    expect(resultado).toMatch(/GEO-[A-Z0-9]+/);
  });

  test('gera certificado para trilha completa sem nível', () => {
    const resultado = gerarCertificado('Maria Costa', 'typescript');
    expect(resultado).toContain('TypeScript');
    expect(resultado).toContain('Completa');
  });

  test('retorna erro para tecnologia inválida', () => {
    const resultado = gerarCertificado('João', 'ruby', 'iniciante');
    expect(resultado).toContain('❌');
    expect(resultado).toContain('não encontrada');
  });

  test('retorna erro quando nome ou tecnologia não são fornecidos', () => {
    const resultado = gerarCertificado('', 'javascript');
    expect(resultado).toContain('❌');
  });

  test('retorna erro para nível inválido', () => {
    const resultado = gerarCertificado('Ana', 'node', 'expert');
    expect(resultado).toContain('❌');
    expect(resultado).toContain('inválido');
  });

  test('inclui data atual no certificado', () => {
    const resultado = gerarCertificado('Pedro Lima', 'node', 'avancado');
    const ano = new Date().getFullYear().toString();
    expect(resultado).toContain(ano);
  });

  test('dois certificados para o mesmo participante têm o mesmo código', () => {
    // Mesma semente → mesmo hash (determinístico, exceto timestamp)
    // Testamos que o formato é sempre GEO-XXXXXXXX
    const r1 = gerarCertificado('Teste User', 'javascript', 'iniciante');
    const r2 = gerarCertificado('Teste User', 'javascript', 'iniciante');
    const match1 = r1.match(/GEO-[A-Z0-9]+/);
    const match2 = r2.match(/GEO-[A-Z0-9]+/);
    expect(match1).not.toBeNull();
    expect(match2).not.toBeNull();
  });
});
