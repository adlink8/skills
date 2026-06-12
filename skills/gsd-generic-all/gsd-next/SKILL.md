---
name: gsd:next
description: [通用版] "Automatically advance to the next logical step in the GSD workflow"
allowed-tools:
  - Read
  - Bash
  - Grep
  - Glob
  - SlashCommand
---

<objective>
Detect the current project state and automatically invoke the next logical GSD workflow step.
No arguments needed — reads STATE.md, ROADMAP.md, and phase directories to determine what comes next.

Designed for rapid multi-project workflows where remembering which phase/step you're on is overhead.

Supports `--force` flag to bypass safety gates (checkpoint, error state, verification failures, and prior-phase completeness scan).

Before routing to the next step, scans all prior phases for incomplete work: plans that ran without producing summaries, verification failures without overrides, and phases where discussion happened but planning never ran. When incomplete work is found, shows a structured report and offers three options: defer the gaps to the backlog and continue, stop and resolve manually, or force advance without recording. When prior phases are clean, routes silently with no interruption.
</objective>

<execution_context>
@.planning/workflows/next.md
</execution_context>

<process>
Execute the next workflow from @.planning/workflows/next.md end-to-end.
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
