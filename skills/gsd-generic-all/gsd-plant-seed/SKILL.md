---
name: gsd:plant-seed
description: [通用版] "Capture a forward-looking idea with trigger conditions — surfaces automatically at the right milestone"
argument-hint: "[idea summary]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - AskUserQuestion
---


<objective>
Capture an idea that's too big for now but should surface automatically when the right
milestone arrives. Seeds solve context rot: instead of a one-liner in Deferred that nobody
reads, a seed preserves the full WHY, WHEN to surface, and breadcrumbs to details.

Creates: .planning/seeds/SEED-NNN-slug.md
Consumed by: /gsd-new-milestone (scans seeds and presents matches)
</objective>

<execution_context>
@.planning/workflows/plant-seed.md
</execution_context>

<process>
Execute the plant-seed workflow from @.planning/workflows/plant-seed.md end-to-end.
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
