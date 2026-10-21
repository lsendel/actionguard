import type { McpToolDefinition } from '../types.js';
import { lintPromptInjection } from './prompt-injection.js';

export interface ParamChange {
  name: string;
  type: 'added' | 'removed' | 'type_changed' | 'required_changed';
  oldValue?: string;
  newValue?: string;
  isBreaking: boolean;
}

export interface ToolDiff {
  name: string;
  status: 'added' | 'removed' | 'modified' | 'unchanged';
  schemaDrift: boolean;
  promptDrift: boolean;
  isBreaking: boolean;
  oldDescription?: string;
  newDescription?: string;
  descriptionDiff?: {
    addedWords: string[];
    removedWords: string[];
  };
  promptPoisoningWarning?: string;
  paramChanges: ParamChange[];
}

export interface CatalogDiffReport {
  hasBreakingDrift: boolean;
  hasPromptMutation: boolean;
  totalToolsOld: number;
  totalToolsNew: number;
  toolsAdded: string[];
  toolsRemoved: string[];
  toolsModified: string[];
  diffs: ToolDiff[];
}

/**
 * Computes a detailed, structured diff between two MCP tool catalogs.
 * Identifies parameter additions/removals, type changes, description mutations,
 * and detects whether any description mutation introduces prompt poisoning patterns.
 */
export function diffToolCatalogs(
  oldTools: McpToolDefinition[] = [],
  newTools: McpToolDefinition[] = [],
): CatalogDiffReport {
  const oldMap = new Map<string, McpToolDefinition>(oldTools.map((t) => [t.name, t]));
  const newMap = new Map<string, McpToolDefinition>(newTools.map((t) => [t.name, t]));

  const allNames = Array.from(new Set([...oldMap.keys(), ...newMap.keys()])).sort();
  const diffs: ToolDiff[] = [];
  const toolsAdded: string[] = [];
  const toolsRemoved: string[] = [];
  const toolsModified: string[] = [];

  let hasBreakingDrift = false;
  let hasPromptMutation = false;

  for (const name of allNames) {
    const oldTool = oldMap.get(name);
    const newTool = newMap.get(name);

    if (!oldTool && newTool) {
      // Tool added
      toolsAdded.push(name);
      diffs.push({
        name,
        status: 'added',
        schemaDrift: true,
        promptDrift: true,
        isBreaking: false,
        newDescription: newTool.description,
        paramChanges: Object.keys(newTool.inputSchema?.properties || {}).map((p) => ({
          name: p,
          type: 'added',
          newValue: (newTool.inputSchema?.properties?.[p] as { type?: string })?.type || 'any',
          isBreaking: false,
        })),
      });
    } else if (oldTool && !newTool) {
      // Tool removed -> breaking!
      toolsRemoved.push(name);
      hasBreakingDrift = true;
      diffs.push({
        name,
        status: 'removed',
        schemaDrift: true,
        promptDrift: true,
        isBreaking: true,
        oldDescription: oldTool.description,
        paramChanges: Object.keys(oldTool.inputSchema?.properties || {}).map((p) => ({
          name: p,
          type: 'removed',
          oldValue: (oldTool.inputSchema?.properties?.[p] as { type?: string })?.type || 'any',
          isBreaking: true,
        })),
      });
    } else if (oldTool && newTool) {
      // Compare schema and descriptions
      const oldDesc = oldTool.description || '';
      const newDesc = newTool.description || '';
      const promptDrift = oldDesc !== newDesc;

      const paramChanges: ParamChange[] = [];
      const oldProps = (oldTool.inputSchema?.properties || {}) as Record<string, { type?: string }>;
      const newProps = (newTool.inputSchema?.properties || {}) as Record<string, { type?: string }>;
      const oldRequired = new Set(oldTool.inputSchema?.required || []);
      const newRequired = new Set(newTool.inputSchema?.required || []);

      const propKeys = Array.from(new Set([...Object.keys(oldProps), ...Object.keys(newProps)]));

      for (const p of propKeys) {
        const inOld = p in oldProps;
        const inNew = p in newProps;

        if (!inOld && inNew) {
          const isReq = newRequired.has(p);
          paramChanges.push({
            name: p,
            type: 'added',
            newValue: newProps[p]?.type || 'any',
            isBreaking: isReq, // adding required parameter is breaking
          });
          if (isReq) hasBreakingDrift = true;
        } else if (inOld && !inNew) {
          paramChanges.push({
            name: p,
            type: 'removed',
            oldValue: oldProps[p]?.type || 'any',
            isBreaking: true, // removing parameter is breaking
          });
          hasBreakingDrift = true;
        } else if (inOld && inNew) {
          const oldType = oldProps[p]?.type || 'any';
          const newType = newProps[p]?.type || 'any';
          if (oldType !== newType) {
            paramChanges.push({
              name: p,
              type: 'type_changed',
              oldValue: oldType,
              newValue: newType,
              isBreaking: true,
            });
            hasBreakingDrift = true;
          } else if (oldRequired.has(p) !== newRequired.has(p)) {
            const nowRequired = newRequired.has(p);
            paramChanges.push({
              name: p,
              type: 'required_changed',
              oldValue: oldRequired.has(p) ? 'required' : 'optional',
              newValue: nowRequired ? 'required' : 'optional',
              isBreaking: nowRequired, // becoming required is breaking
            });
            if (nowRequired) hasBreakingDrift = true;
          }
        }
      }

      const schemaDrift = paramChanges.length > 0;
      let promptPoisoningWarning: string | undefined;

      if (promptDrift) {
        hasPromptMutation = true;
        const scan = lintPromptInjection([newTool]);
        if (scan.length > 0) {
          promptPoisoningWarning = scan[0].message;
        }
      }

      if (schemaDrift || promptDrift) {
        toolsModified.push(name);
      }

      // Calculate simple word diff for description
      let descriptionDiff: { addedWords: string[]; removedWords: string[] } | undefined;
      if (promptDrift) {
        const oldWords = new Set(oldDesc.split(/\s+/).filter(Boolean));
        const newWords = new Set(newDesc.split(/\s+/).filter(Boolean));
        descriptionDiff = {
          addedWords: Array.from(newWords).filter((w) => !oldWords.has(w)),
          removedWords: Array.from(oldWords).filter((w) => !newWords.has(w)),
        };
      }

      diffs.push({
        name,
        status: schemaDrift || promptDrift ? 'modified' : 'unchanged',
        schemaDrift,
        promptDrift,
        isBreaking: paramChanges.some((c) => c.isBreaking),
        oldDescription: oldDesc,
        newDescription: newDesc,
        descriptionDiff,
        promptPoisoningWarning,
        paramChanges,
      });
    }
  }

  return {
    hasBreakingDrift,
    hasPromptMutation,
    totalToolsOld: oldTools.length,
    totalToolsNew: newTools.length,
    toolsAdded,
    toolsRemoved,
    toolsModified,
    diffs,
  };
}
