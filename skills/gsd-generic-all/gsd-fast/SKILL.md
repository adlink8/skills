---
name: gsd:fast
description: [通用版] "Execute a trivial task inline — no subagents, no planning overhead"
argument-hint: "[task description]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
---


<objective>
Execute a trivial task directly in the current context without spawning subagents
or generating PLAN.md files. For tasks too small to justify planning overhead:
typo fixes, config changes, small refactors, forgotten commits, simple additions.

This is NOT a replacement for /gsd-quick — use /gsd-quick for anything that
needs research, multi-step planning, or verification. /gsd-fast is for tasks
you could describe in one sentence and execute in under 2 minutes.
</objective>

<execution_context>
@.planning/workflows/fast.md
</execution_context>

<process>
Execute the fast workflow from @.planning/workflows/fast.md end-to-end.
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
