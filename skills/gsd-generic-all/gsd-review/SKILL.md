---
name: gsd:review
description: [通用版] "Request cross-AI peer review of phase plans from external AI CLIs"
argument-hint: "--phase N [--gemini] [--Codex] [--codex] [--opencode] [--qwen] [--cursor] [--all]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---


<objective>
Invoke external AI CLIs (Gemini, Codex, Codex, OpenCode, Qwen Code, Cursor) to independently review phase plans.
Produces a structured REVIEWS.md with per-reviewer feedback that can be fed back into
planning via /gsd-plan-phase --reviews.

**Flow:** Detect CLIs → Build review prompt → Invoke each CLI → Collect responses → Write REVIEWS.md
</objective>

<execution_context>
@.planning/workflows/review.md
@.planning/references/agent-doc-architecture.md
@.planning/references/doc-authority-order.md
@.planning/references/documentation-sync-rules.md
</execution_context>

<context>
Phase number: extracted from $ARGUMENTS (required)

**Flags:**
- `--gemini` — Include Gemini CLI review
- `--Codex` — Include Codex CLI review (uses separate session)
- `--codex` — Include Codex CLI review
- `--opencode` — Include OpenCode review (uses model from user's OpenCode config)
- `--qwen` — Include Qwen Code review (Alibaba Qwen models)
- `--cursor` — Include Cursor agent review
- `--all` — Include all available CLIs

**Documentation architecture review criteria:**
Ask reviewers to check whether the plan:
- respects the documentation authority order
- reads project-level vs module-level documents correctly
- identifies owning modules and module README inputs
- includes verification before completion
- updates module README / `.planning/STATE.md` / summaries when behavior changes
- avoids creating duplicate or conflicting state documents
</context>

<process>
Execute the review workflow from @.planning/workflows/review.md end-to-end.
Include documentation architecture criteria in the generated review prompt.
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
