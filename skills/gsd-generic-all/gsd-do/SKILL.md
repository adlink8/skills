---
name: gsd:do
description: [通用版] "Route freeform text to the right GSD command automatically"
argument-hint: "<description of what you want to do>"
allowed-tools:
  - Read
  - Bash
  - AskUserQuestion
---

<objective>
Analyze freeform natural language input and dispatch to the most appropriate GSD command.

Acts as a smart dispatcher — never does the work itself. Matches intent to the best GSD command using routing rules, confirms the match, then hands off.

Use when you know what you want but don't know which `/gsd-*` command to run.
</objective>

<execution_context>
@.planning/workflows/do.md
@.planning/references/ui-brand.md
@.planning/references/agent-doc-architecture.md
@.planning/references/project-reading-order.md
@.planning/references/doc-authority-order.md
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Execute the do workflow from @.planning/workflows/do.md end-to-end.

Before routing, classify the request:
- project-level: roadmap, phase planning, milestone status, release readiness, architecture, cross-module integration, verification, review
- module-level: focused bug/feature/test/doc request inside a subsystem

Use @.planning/references/project-reading-order.md to decide which documents the target command should read.
Use @.planning/references/doc-authority-order.md when the user request depends on project state or completion claims.

Route user intent to the best GSD command and invoke it.
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
