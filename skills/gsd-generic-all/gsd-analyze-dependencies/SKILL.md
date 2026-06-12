---
name: gsd:analyze-dependencies
description: [通用版] "Analyze phase dependencies and suggest Depends on entries for ROADMAP.md"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---

<objective>
Analyze the phase dependency graph for the current milestone. For each phase pair, determine if there is a dependency relationship based on:
- File overlap (phases that modify the same files must be ordered)
- Semantic dependencies (a phase that uses an API built by another phase)
- Data flow (a phase that consumes output from another phase)

Then suggest `Depends on` updates to ROADMAP.md.
</objective>

<execution_context>
@.planning/workflows/analyze-dependencies.md
</execution_context>

<context>
No arguments required. Requires an active milestone with ROADMAP.md.

Run this command BEFORE `/gsd-manager` to fill in missing `Depends on` fields and prevent merge conflicts from unordered parallel execution.
</context>

<process>
Execute the analyze-dependencies workflow from @.planning/workflows/analyze-dependencies.md end-to-end.
Present dependency suggestions clearly and apply confirmed updates to ROADMAP.md.
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
