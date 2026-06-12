---
name: gsd:sketch-wrap-up
description: [通用版] "Package sketch design findings into a persistent project skill for future build conversations"
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
Curate sketch design findings and package them into a persistent project skill that Codex
auto-loads when building the real UI. Also writes a summary to `.planning/sketches/` for
project history. Output skill goes to `./.Codex/skills/sketch-findings-[project]/` (project-local).
</objective>

<execution_context>
@.planning/workflows/sketch-wrap-up.md
@.planning/references/ui-brand.md
</execution_context>

<runtime_note>
**Copilot (VS Code):** Use `vscode_askquestions` wherever this workflow calls `AskUserQuestion`.
</runtime_note>

<process>
Execute the sketch-wrap-up workflow from @.planning/workflows/sketch-wrap-up.md end-to-end.
Preserve all curation gates (per-sketch review, grouping approval, AGENTS.md routing line).
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
