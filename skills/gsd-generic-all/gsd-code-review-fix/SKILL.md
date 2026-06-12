---
name: gsd:code-review-fix
description: [通用版] "Auto-fix issues found by code review in REVIEW.md. Spawns fixer agent, commits each fix atomically, produces REVIEW-FIX.md summary."
argument-hint: "<phase-number> [--all] [--auto]"
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - Write
  - Edit
  - Task
---

<objective>
Auto-fix issues found by code review. Reads REVIEW.md from the specified phase, spawns gsd-code-fixer agent to apply fixes, and produces REVIEW-FIX.md summary.

Arguments:
- Phase number (required) — which phase's REVIEW.md to fix (e.g., "2" or "02")
- `--all` (optional) — include Info findings in fix scope (default: Critical + Warning only)
- `--auto` (optional) — enable fix + re-review iteration loop, capped at 3 iterations

Output: {padded_phase}-REVIEW-FIX.md in phase directory + inline summary of fixes applied
</objective>

<execution_context>
@.planning/workflows/code-review-fix.md
</execution_context>

<context>
Phase: $ARGUMENTS (first positional argument is phase number)

Optional flags parsed from $ARGUMENTS:
- `--all` — Include Info findings in fix scope. Default behavior fixes Critical + Warning only.
- `--auto` — Enable fix + re-review iteration loop. After applying fixes, re-run code-review at same depth. If new issues found, iterate. Cap at 3 iterations total. Without this flag, single fix pass only.

Context files (AGENTS.md, REVIEW.md, phase state) are resolved inside the workflow via `gsd-sdk-gen query init.phase-op` and delegated to agent via config blocks.
</context>

<process>
This command is a thin dispatch layer. It parses arguments and delegates to the workflow.

Execute the code-review-fix workflow from @.planning/workflows/code-review-fix.md end-to-end.

The workflow (not this command) enforces these gates:
- Phase validation (before config gate)
- Config gate check (workflow.code_review)
- REVIEW.md existence check (error if missing)
- REVIEW.md status check (skip if clean/skipped)
- Agent spawning (gsd-code-fixer)
- Iteration loop (if --auto, capped at 3 iterations)
- Result presentation (inline summary + next steps)
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
