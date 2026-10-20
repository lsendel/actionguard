import type { LintFinding, McpToolDefinition } from '../types.js';

// Suspicious prompt injection and tool poisoning regex patterns
const INJECTION_PATTERNS: Array<{ regex: RegExp; name: string; severity: 'fail' | 'warn' }> = [
  {
    regex: /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
    name: 'Instruction Override Pattern',
    severity: 'fail',
  },
  {
    regex: /disregard\s+(the\s+)?(system\s+prompt|guardrails|safety)/i,
    name: 'Guardrail Bypass Pattern',
    severity: 'fail',
  },
  {
    regex: /!\[.*?\]\(https?:\/\/[^\s)]+\)/i,
    name: 'Markdown Image Data Exfiltration',
    severity: 'fail',
  },
  {
    regex: /[\u200B-\u200D\uFEFF]/, // Zero-width spaces and invisible characters
    name: 'Hidden Zero-Width Unicode Characters',
    severity: 'fail',
  },
  {
    regex: /[\u202A-\u202E\u2066-\u2069]/, // Bidirectional text overrides
    name: 'Bidirectional Unicode Text Concealment',
    severity: 'fail',
  },
  {
    regex: /you\s+are\s+now\s+(a|an|in)\s+(new\s+mode|unrestricted|god\s+mode)/i,
    name: 'Jailbreak Persona Reassignment',
    severity: 'fail',
  },
  {
    regex: /before\s+calling\s+any\s+other\s+tool/i,
    name: 'Tool Execution Priority Shadowing',
    severity: 'warn',
  },
];

export function lintPromptInjection(tools: McpToolDefinition[]): LintFinding[] {
  const findings: LintFinding[] = [];

  for (const tool of tools) {
    const textPool: Array<{ source: string; text: string }> = [];

    if (tool.description) {
      textPool.push({ source: `tool "${tool.name}" description`, text: tool.description });
    }

    // Traverse inputSchema properties
    const props = tool.inputSchema?.properties as Record<string, { description?: string }> | undefined;
    if (props && typeof props === 'object') {
      for (const [propName, propVal] of Object.entries(props)) {
        if (propVal && typeof propVal.description === 'string') {
          textPool.push({
            source: `tool "${tool.name}" parameter "${propName}" description`,
            text: propVal.description,
          });
        }
      }
    }

    for (const { source, text } of textPool) {
      for (const pattern of INJECTION_PATTERNS) {
        if (pattern.regex.test(text)) {
          findings.push({
            id: `injection_${tool.name}_${pattern.name.toLowerCase().replace(/\s+/g, '_')}`,
            stage: 'security',
            title: `Suspicious Pattern Detected in ${source}`,
            status: pattern.severity,
            message: `Found ${pattern.name} in ${source}. This may cause LLM orchestrators to behave unpredictably or leak data.`,
            details: { tool: tool.name, pattern: pattern.name },
          });
        }
      }
    }
  }

  if (findings.length === 0) {
    findings.push({
      id: 'prompt_injection_clean',
      stage: 'security',
      title: 'Prompt Injection & Tool Poisoning Audit',
      status: 'pass',
      message: 'No instruction overrides, hidden Unicode, or markdown exfiltration patterns detected.',
    });
  }

  return findings;
}
