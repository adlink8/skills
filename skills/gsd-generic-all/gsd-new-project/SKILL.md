---
name: gsd:new-project
description: [通用版] "Initialize a new project with deep context gathering and PROJECT.md"
argument-hint: "[--auto]"
allowed-tools:
  - Read
  - Bash
  - Write
  - Task
  - AskUserQuestion
---

<runtime_note>
**Copilot (VS Code):** Use `vscode_askquestions` wherever this workflow calls `AskUserQuestion`. They are equivalent — `vscode_askquestions` is the VS Code Copilot implementation of the same interactive question API.
</runtime_note>

<context>
**Flags:**
- `--auto` — Automatic mode. After config questions, runs research → requirements → roadmap without further interaction. Expects idea document via @ reference.
</context>

<objective>
Initialize a new project through unified flow: questioning → research (optional) → requirements → roadmap.

**Creates:**
- `.planning/PROJECT.md` — project context
- `.planning/config.json` — workflow preferences
- `.planning/research/` — domain research (optional)
- `.planning/REQUIREMENTS.md` — scoped requirements
- `.planning/ROADMAP.md` — phase structure
- `.planning/STATE.md` — project memory
- `.planning/references/` — agent documentation protocol references when available
- `.planning/templates/` — module/documentation templates when available

**After this command:** Run `/gsd-plan-phase 1` to start execution.
</objective>

<execution_context>
@.planning/workflows/new-project.md
@.planning/references/questioning.md
@.planning/references/ui-brand.md
@.planning/references/agent-doc-architecture.md
@.planning/references/doc-authority-order.md
@.planning/references/module-readme-protocol.md
@.planning/references/project-reading-order.md
@.planning/templates/project.md
@.planning/templates/requirements.md
@.planning/templates/module-readme-template.md
@.planning/templates/project-doc-map-template.md
</execution_context>

<process>
Execute the new-project workflow from @.planning/workflows/new-project.md end-to-end.
Preserve all workflow gates (validation, approvals, commits, routing).

When initializing project documentation, seed or preserve the agent documentation architecture:
- keep `.planning/` as the GSD control layer
- keep module README files as local module boundaries
- use code/tests as implementation and verification truth
- avoid duplicating volatile task state in root README
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
