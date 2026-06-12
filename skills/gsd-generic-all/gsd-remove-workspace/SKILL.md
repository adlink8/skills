---
name: gsd:remove-workspace
description: [通用版] "Remove a GSD workspace and clean up worktrees"
argument-hint: "<workspace-name>"
allowed-tools:
  - Bash
  - Read
  - AskUserQuestion
---

<context>
**Arguments:**
- `<workspace-name>` (required) — Name of the workspace to remove
</context>

<objective>
Remove a workspace directory after confirmation. For worktree strategy, runs `git worktree remove` for each member repo first. Refuses if any repo has uncommitted changes.
</objective>

<execution_context>
@.planning/workflows/remove-workspace.md
@.planning/references/ui-brand.md
</execution_context>

<process>
Execute the remove-workspace workflow from @.planning/workflows/remove-workspace.md end-to-end.
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
