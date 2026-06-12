---
name: gsd:note
description: [通用版] "Zero-friction idea capture. Append, list, or promote notes to todos."
argument-hint: "<text> | list | promote <N> [--global]"
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
---

<objective>
Zero-friction idea capture — one Write call, one confirmation line.

Three subcommands:
- **append** (default): Save a timestamped note file. No questions, no formatting.
- **list**: Show all notes from project and global scopes.
- **promote**: Convert a note into a structured todo.

Runs inline — no Task, no AskUserQuestion, no Bash.
</objective>

<execution_context>
@.planning/workflows/note.md
@.planning/references/ui-brand.md
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Execute the note workflow from @.planning/workflows/note.md end-to-end.
Capture the note, list notes, or promote to todo — depending on arguments.
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
