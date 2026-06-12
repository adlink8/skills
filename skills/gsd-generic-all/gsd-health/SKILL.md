---
name: gsd:health
description: [通用版] "Diagnose planning directory health and optionally repair issues"
argument-hint: "[--repair]"
allowed-tools:
  - Read
  - Bash
  - Write
  - AskUserQuestion
---

<objective>
Validate `.planning/` directory integrity and report actionable issues. Checks for missing files, invalid configurations, inconsistent state, and orphaned plans.
</objective>

<execution_context>
@.planning/workflows/health.md
</execution_context>

<process>
Execute the health workflow from @.planning/workflows/health.md end-to-end.
Parse --repair flag from arguments and pass to workflow.
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
