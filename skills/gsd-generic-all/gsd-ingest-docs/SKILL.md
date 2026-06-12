---
name: gsd:ingest-docs
description: [通用版] "Scan a repo for mixed ADRs, PRDs, SPECs, and DOCs and bootstrap or merge the full .planning/ setup from them. Classifies each doc in parallel, synthesizes a consolidated context with a conflicts report, and routes to new-project or merge-milestone depending on whether .planning/ already exists."
argument-hint: "[path] [--mode new|merge] [--manifest <file>] [--resolve auto|interactive]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
  - Task
---


<objective>
Build the full `.planning/` setup (or merge into an existing one) from multiple pre-existing planning documents — ADRs, PRDs, SPECs, DOCs — in one pass.

- **Net-new bootstrap** (`--mode new`, default when `.planning/` is absent): produces PROJECT.md + REQUIREMENTS.md + ROADMAP.md + STATE.md from synthesized doc content, delegating final generation to `gsd-roadmapper`.
- **Merge into existing** (`--mode merge`, default when `.planning/` is present): appends phases and requirements derived from the ingested docs; hard-blocks any contradiction with existing locked decisions.

Auto-synthesizes most conflicts using the precedence rule `ADR > SPEC > PRD > DOC` (overridable via manifest). Surfaces unresolved cases in `.planning/INGEST-CONFLICTS.md` with three buckets: auto-resolved, competing-variants, unresolved-blockers. The BLOCKER gate from the shared conflict engine prevents any destination file from being written when unresolved contradictions exist.

**Inputs:** directory-convention discovery (`docs/adr/`, `docs/prd/`, `docs/specs/`, `docs/rfc/`, root-level `{ADR,PRD,SPEC,RFC}-*.md`), or an explicit `--manifest <file>` YAML listing `{path, type, precedence?}` per doc.

**v1 constraints:** hard cap of 50 docs per invocation; `--resolve interactive` is reserved for a future release.
</objective>

<execution_context>
@.planning/workflows/ingest-docs.md
@.planning/references/ui-brand.md
@.planning/references/gate-prompts.md
@.planning/references/doc-conflict-engine.md
</execution_context>

<context>
$ARGUMENTS
</context>

<process>
Execute the ingest-docs workflow end-to-end. Preserve all approval gates (discovery, conflict report, routing) and the BLOCKER safety rule.
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
