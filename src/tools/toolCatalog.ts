/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The Tools menu as data: ten groups and the tools inside them.
 * Pure data and pure functions. No React, no icons: the screen decides how to draw.
 * A group with nothing available yet is shown as "Coming soon", never hidden.
 */

export type ToolGroupId =
  | 'media'
  | 'text-writing'
  | 'numbers-converters'
  | 'time-counters'
  | 'create-encode'
  | 'reading-knowledge'
  | 'web-data'
  | 'code'
  | 'finance'
  | 'device-system';

export interface ToolGroup {
  id: ToolGroupId;
  name: string;
}

/** Where an available tool leads. */
export type ToolTarget = 'interface-capture' | 'background-proof' | 'text-counter';

export interface CatalogTool {
  id: string;
  name: string;
  description: string;
  groupId: ToolGroupId;
  status: 'available' | 'coming-soon';
  /** Present exactly when status is "available". */
  opens?: ToolTarget;
}

export const TOOL_GROUPS: readonly ToolGroup[] = [
  { id: 'media', name: 'Media' },
  { id: 'text-writing', name: 'Text and Writing' },
  { id: 'numbers-converters', name: 'Numbers and Converters' },
  { id: 'time-counters', name: 'Time and Counters' },
  { id: 'create-encode', name: 'Create and Encode' },
  { id: 'reading-knowledge', name: 'Reading and Knowledge' },
  { id: 'web-data', name: 'Web and Data' },
  { id: 'code', name: 'AXON Code' },
  { id: 'finance', name: 'Finance' },
  { id: 'device-system', name: 'Device and System' },
];

export const CATALOG_TOOLS: readonly CatalogTool[] = [
  {
    id: 'text-counter',
    name: 'Text Counter',
    description: 'Count the words, characters, letters and lines of any text.',
    groupId: 'text-writing',
    status: 'available',
    opens: 'text-counter',
  },
  {
    id: 'interface-capture',
    name: 'Interface Capture',
    description: "Capture and export AXON's real interfaces.",
    groupId: 'web-data',
    status: 'available',
    opens: 'interface-capture',
  },
  {
    id: 'content-extractor',
    name: 'Content Extractor',
    description: 'Extract and organize useful content.',
    groupId: 'web-data',
    status: 'coming-soon',
  },
  {
    id: 'link-analyzer',
    name: 'Link Analyzer',
    description: 'Analyze links and detect what they lead to.',
    groupId: 'web-data',
    status: 'coming-soon',
  },
  {
    id: 'background-proof',
    name: 'Background Proof',
    description: 'Prove background execution with native heartbeats while the app is closed.',
    groupId: 'device-system',
    status: 'available',
    opens: 'background-proof',
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    description: "Get help from AXON's AI.",
    groupId: 'device-system',
    status: 'coming-soon',
  },
];

export interface GroupView {
  group: ToolGroup;
  tools: CatalogTool[];
  /** False when no tool in the group is available yet: the screen shows "Coming soon". */
  hasAvailable: boolean;
}

/** True when the query is found in the tool's name or description (case-insensitive). */
export function toolMatches(tool: CatalogTool, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q === '') return true;
  return tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q);
}

/**
 * The groups to draw, in order, for a filter query.
 * Empty query: all groups, including empty ones.
 * With a query: a group stays when one of its tools matches (only matching tools are shown)
 * or when its own name matches (all of its tools are shown).
 */
export function buildGroupViews(
  query: string,
  groups: readonly ToolGroup[] = TOOL_GROUPS,
  tools: readonly CatalogTool[] = CATALOG_TOOLS
): GroupView[] {
  const q = query.trim().toLowerCase();
  const views: GroupView[] = [];
  for (const group of groups) {
    const inGroup = tools.filter((t) => t.groupId === group.id);
    let shown: CatalogTool[];
    if (q === '') {
      shown = inGroup;
    } else if (group.name.toLowerCase().includes(q)) {
      shown = inGroup;
    } else {
      shown = inGroup.filter((t) => toolMatches(t, q));
      if (shown.length === 0) continue;
    }
    views.push({
      group,
      tools: shown,
      hasAvailable: inGroup.some((t) => t.status === 'available'),
    });
  }
  return views;
}
