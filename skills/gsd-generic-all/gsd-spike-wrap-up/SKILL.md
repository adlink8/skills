---
name: gsd:spike-wrap-up
description: [通用版] "Package spike findings into a persistent project skill for future build conversations"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
  - AskUserQuestion
---

<objective>
Curate spike experiment findings and package them into a persistent project skill that Codex
auto-loads in future build conversations. Also writes a summary to `.planning/spikes/` for
project history. Output skill goes to `./.Codex/skills/spike-findings-[project]/` (project-local).
</objective>

<execution_context>
@.planning/workflows/spike-wrap-up.md
@.planning/references/ui-brand.md
</execution_context>

<runtime_note>
**Copilot (VS Code):** Use `vscode_askquestions` wherever this workflow calls `AskUserQuestion`.
</runtime_note>

<process>
Execute the spike-wrap-up workflow from @.planning/workflows/spike-wrap-up.md end-to-end.
Preserve all workflow gates (auto-include, feature-area grouping, skill synthesis, AGENTS.md routing line, intelligent next-step routing).
</process>

---

<generic_adapter>
This is a GENERIC version of the GSD skill. It works with any AI runtime
(WorkBuddy, Codex, Claude Code, Cursor, Aider, etc.).

To use this skill with the generic GSD SDK:
  1. Ensure the generic `gsd-sdk-gen` and `gsd-tools-gen` are on your PATH:
     export PATH="$PATH:/path/to/gsd-generic-all/bin"
  2. The SDK will auto-detect the .planning/ directory in your project root.
  3. All `gsd-sdk-gen query` and `gsd-tools-gen.cjs` calls in this skill work unchanged.

Original Codex-specific paths have been replaced with relative .planning/ paths.
</generic_adapter>
