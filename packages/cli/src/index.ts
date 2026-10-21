#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import {
  compileToA2AAgentCard,
  compileToDnsAidRecords,
  compileToMcpRegistry,
  runInspection,
  validateManifest,
} from '@actionguard/core';

const args = process.argv.slice(2);
const command = args[0];

function printHelp(): void {
  console.log(`
\x1b[1m\x1b[34mActionGuard.ai CLI\x1b[0m — Verification & Schema Drift Detection for AI Agents

\x1b[1mUSAGE:\x1b[0m
  actionguard inspect <url>                 Run 5-stage live protocol & security audit
  actionguard compile [manifest.json]       Compile actionguard.json to MCP, A2A & DNS-AID
  actionguard check <url> --pin <hash>      CI/CD gate: exit 1 if remote schema drifts
  actionguard mcp                           Run as Model Context Protocol (MCP) stdio server
  actionguard help                          Show this help message

\x1b[1mEXAMPLES:\x1b[0m
  npx actionguard inspect https://example.com/mcp
  npx actionguard compile ./actionguard.json
  npx actionguard check https://api.where.care/mcp --pin 4f53cda18c2b...
  npx actionguard mcp
`);
}

async function handleInspect(targetUrl?: string): Promise<void> {
  if (!targetUrl) {
    console.error('\x1b[31mError: Missing target URL.\x1b[0m Usage: actionguard inspect <url>');
    process.exit(1);
    return;
  }

  console.log(`\n\x1b[36m⚡ Probing target:\x1b[0m ${targetUrl} ...\n`);

  try {
    const report = await runInspection(targetUrl);

    let gradeColor = '\x1b[32m'; // Green
    if (report.score.grade === 'B') gradeColor = '\x1b[34m';
    else if (report.score.grade === 'C') gradeColor = '\x1b[33m';
    else if (report.score.grade === 'D' || report.score.grade === 'F') gradeColor = '\x1b[31m';

    console.log(
      '\x1b[1m══════════════════════════════════════════════════════════════════════════\x1b[0m',
    );
    console.log(`  \x1b[1mTarget:\x1b[0m   ${report.targetDomain} (${report.targetUrl})`);
    console.log(
      `  \x1b[1mGrade:\x1b[0m    ${gradeColor}\x1b[1m${report.score.grade} (${report.score.numericalScore}/100)\x1b[0m`,
    );
    console.log(
      `  \x1b[1mTools:\x1b[0m    ${report.tools.length} discovered (~${report.tokenCostEstimate} tokens/turn)`,
    );
    console.log(
      '\x1b[1m══════════════════════════════════════════════════════════════════════════\x1b[0m\n',
    );

    console.log('\x1b[1mCRYPTOGRAPHIC DUAL-HASH:\x1b[0m');
    console.log(`  \x1b[34mSchema SHA-256:\x1b[0m       ${report.hashes.schema_sha256}`);
    console.log(`  \x1b[35mDescriptions SHA-256:\x1b[0m ${report.hashes.descriptions_sha256}\n`);

    console.log('\x1b[1mINSPECTION FINDINGS:\x1b[0m');
    for (const f of report.findings) {
      const tag =
        f.status === 'pass'
          ? '\x1b[32m[PASS]\x1b[0m'
          : f.status === 'warn'
            ? '\x1b[33m[WARN]\x1b[0m'
            : '\x1b[31m[FAIL]\x1b[0m';
      console.log(`  ${tag} \x1b[1m${f.title}\x1b[0m: ${f.message}`);
    }

    console.log(
      `\n\x1b[32m✔ Inspection complete.\x1b[0m View live dashboard at: https://actionguard.ai/reports/${report.id}\n`,
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\x1b[31mInspection failed:\x1b[0m ${msg}`);
    process.exit(1);
  }
}

async function handleCompile(manifestPath = 'actionguard.json'): Promise<void> {
  const resolvedPath = path.resolve(process.cwd(), manifestPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`\x1b[31mError:\x1b[0m Manifest file not found at ${resolvedPath}`);
    process.exit(1);
  }

  try {
    const raw = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
    const manifest = validateManifest(raw);

    console.log(
      `\n\x1b[36mCompiling manifests for ${manifest.title} v${manifest.version}...\x1b[0m\n`,
    );

    const mcpJson = compileToMcpRegistry(manifest);
    const a2aCard = compileToA2AAgentCard(manifest);
    const dnsRecords = compileToDnsAidRecords(manifest);

    // Write out compiled files
    const outDir = process.cwd();
    fs.mkdirSync(path.join(outDir, '.well-known'), { recursive: true });

    fs.writeFileSync(path.join(outDir, 'server.json'), mcpJson);
    fs.writeFileSync(path.join(outDir, '.well-known', 'agent-card.json'), a2aCard);
    fs.writeFileSync(path.join(outDir, 'dns-aid.zone'), dnsRecords);

    console.log('  \x1b[32m✔\x1b[0m Generated \x1b[1mserver.json\x1b[0m (Official MCP Registry)');
    console.log(
      '  \x1b[32m✔\x1b[0m Generated \x1b[1m.well-known/agent-card.json\x1b[0m (A2A Protocol v1.0)',
    );
    console.log('  \x1b[32m✔\x1b[0m Generated \x1b[1mdns-aid.zone\x1b[0m (RFC 8552 / RFC 9460)');
    console.log('\n\x1b[32mAll manifests compiled successfully.\x1b[0m\n');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\x1b[31mCompilation failed:\x1b[0m ${msg}`);
    process.exit(1);
  }
}

async function handleCheck(targetUrl?: string, pinnedHash?: string): Promise<void> {
  if (!targetUrl || !pinnedHash) {
    console.error('\x1b[31mError: Target URL and --pin <hash> are required.\x1b[0m');
    process.exit(1);
    return;
  }

  console.log(
    `\n\x1b[36mCI Gate: Checking ${targetUrl} against pinned hash:\x1b[0m ${pinnedHash} ...\n`,
  );

  try {
    const report = await runInspection(targetUrl);

    if (report.hashes.schema_sha256 !== pinnedHash) {
      console.error('\x1b[31m[FAILED CI GATE]\x1b[0m Schema hash mismatch!');
      console.error(`  Expected: ${pinnedHash}`);
      console.error(`  Observed: ${report.hashes.schema_sha256}`);
      console.error('\nThe upstream endpoint has drifted or broken its schema contract.');
      process.exit(1);
    }

    if (report.score.failCount > 0) {
      console.error('\x1b[31m[FAILED CI GATE]\x1b[0m Security or protocol checks failed.');
      process.exit(1);
    }

    console.log(
      '\x1b[32m✔ [PASSED CI GATE]\x1b[0m Schema matches pinned hash. 0 security failures.\n',
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\x1b[31mCheck failed:\x1b[0m ${msg}`);
    process.exit(1);
  }
}

async function handleMcpStdio(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  const sendResponse = (msg: unknown) => {
    process.stdout.write(`${JSON.stringify(msg)}\n`);
  };

  rl.on('line', async (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    try {
      const req = JSON.parse(trimmed);
      const id = req.id;
      const method = req.method;

      if (method === 'initialize') {
        sendResponse({
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {},
            },
            serverInfo: {
              name: 'actionguard-inspector',
              version: '0.1.0',
            },
          },
        });
      } else if (method === 'notifications/initialized') {
        // Initialized notification, no response required
      } else if (method === 'ping') {
        sendResponse({ jsonrpc: '2.0', id, result: {} });
      } else if (method === 'tools/list') {
        sendResponse({
          jsonrpc: '2.0',
          id,
          result: {
            tools: [
              {
                name: 'actionguard_inspect',
                description:
                  'Run a 5-stage continuous reliability, security, and schema audit of an MCP server or AI agent endpoint.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    url: {
                      type: 'string',
                      description: 'The target MCP server or agent endpoint URL to audit',
                    },
                  },
                  required: ['url'],
                },
              },
              {
                name: 'actionguard_check_drift',
                description:
                  "Verify whether an MCP server's tools schema or descriptions have drifted from a pinned Dual-Hash.",
                inputSchema: {
                  type: 'object',
                  properties: {
                    url: {
                      type: 'string',
                      description: 'The target MCP server endpoint URL',
                    },
                    pinnedSchemaHash: {
                      type: 'string',
                      description: 'Pinned 64-char hex SHA-256 schema hash',
                    },
                  },
                  required: ['url', 'pinnedSchemaHash'],
                },
              },
            ],
          },
        });
      } else if (method === 'tools/call') {
        const toolName = req.params?.name;
        const toolArgs = req.params?.arguments || {};

        if (toolName === 'actionguard_inspect') {
          const report = await runInspection(toolArgs.url);
          sendResponse({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(report, null, 2),
                },
              ],
            },
          });
        } else if (toolName === 'actionguard_check_drift') {
          const report = await runInspection(toolArgs.url);
          const matches = report.hashes.schema_sha256 === toolArgs.pinnedSchemaHash;
          sendResponse({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      matches,
                      targetUrl: toolArgs.url,
                      expectedHash: toolArgs.pinnedSchemaHash,
                      observedHash: report.hashes.schema_sha256,
                      drifted: !matches,
                      grade: report.score.grade,
                    },
                    null,
                    2,
                  ),
                },
              ],
            },
          });
        } else {
          sendResponse({
            jsonrpc: '2.0',
            id,
            error: { code: -32601, message: `Tool not found: ${toolName}` },
          });
        }
      } else if (id !== undefined) {
        sendResponse({
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not found: ${method}` },
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      sendResponse({
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: `Parse error: ${msg}` },
      });
    }
  });
}

async function main(): Promise<void> {
  if (!command && !process.stdin.isTTY) {
    await handleMcpStdio();
    return;
  }

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  if (command === 'inspect') {
    await handleInspect(args[1]);
  } else if (command === 'compile') {
    await handleCompile(args[1]);
  } else if (command === 'check') {
    const pinIdx = args.indexOf('--pin');
    const pinHash = pinIdx !== -1 ? args[pinIdx + 1] : undefined;
    await handleCheck(args[1], pinHash);
  } else if (command === 'mcp' || command === 'server') {
    await handleMcpStdio();
  } else {
    console.error(`Unknown command: "${command}"`);
    printHelp();
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
