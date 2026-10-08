#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ── Imports dos comandos ────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const { exibirTrilha } = await import(join(__dirname, '../commands/trilha.js'));
const { gerarDesafio } = await import(join(__dirname, '../commands/desafio.js'));
const { gerarCertificado } = await import(join(__dirname, '../commands/certificado.js'));

// ── Criação do servidor MCP ─────────────────────────────────────────
const server = new McpServer({
  name: 'geo-explorer',
  version: '1.0.0',
});

// ── Ferramenta: trilha ──────────────────────────────────────────────
server.registerTool(
  'trilha',
  {
    description:
      'Apresenta o plano de estudos de uma tecnologia. ' +
      'Tecnologias disponíveis: javascript, python, typescript, node.',
    inputSchema: z.object({
      tecnologia: z
        .string()
        .describe('Nome da tecnologia (ex: javascript, python, typescript, node)'),
      nivel: z
        .string()
        .optional()
        .describe('Nível da trilha: iniciante, intermediario ou avancado'),
    }),
  },
  async ({ tecnologia, nivel }) => {
    try {
      const resultado = exibirTrilha(tecnologia, nivel);
      return { content: [{ type: 'text', text: resultado }] };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Erro ao buscar trilha: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// ── Ferramenta: desafio ─────────────────────────────────────────────
server.registerTool(
  'desafio',
  {
    description:
      'Gera um desafio de código de acordo com a tecnologia e o nível informado.',
    inputSchema: z.object({
      tecnologia: z
        .string()
        .describe('Nome da tecnologia (ex: javascript, python, typescript, node)'),
      nivel: z
        .string()
        .optional()
        .describe('Nível do desafio: iniciante, intermediario ou avancado (padrão: iniciante)'),
    }),
  },
  async ({ tecnologia, nivel }) => {
    try {
      const resultado = gerarDesafio(tecnologia, nivel);
      return { content: [{ type: 'text', text: resultado }] };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Erro ao gerar desafio: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// ── Ferramenta: certificado ─────────────────────────────────────────
server.registerTool(
  'certificado',
  {
    description:
      'Gera um certificado fictício de conclusão de trilha para o(a) participante informado(a).',
    inputSchema: z.object({
      nome: z.string().describe('Nome completo do(a) participante'),
      tecnologia: z
        .string()
        .describe('Nome da tecnologia da trilha concluída'),
      nivel: z
        .string()
        .optional()
        .describe('Nível concluído: iniciante, intermediario ou avancado'),
    }),
  },
  async ({ nome, tecnologia, nivel }) => {
    try {
      const resultado = gerarCertificado(nome, tecnologia, nivel);
      return { content: [{ type: 'text', text: resultado }] };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Erro ao gerar certificado: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// ── Inicialização ───────────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Geo-Explorer MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in Geo-Explorer MCP server:', error);
  process.exit(1);
});
