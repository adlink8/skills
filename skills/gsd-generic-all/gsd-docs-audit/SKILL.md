---
name: gsd:docs-audit
description: [通用版] "Audit .planning docs, module README files, source code, and tests for documentation drift"
argument-hint: "[optional: module or area] [--fix-readmes]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
---

<objective>
Audit project documentation layers for consistency with source code, tests, CI/UAT evidence, and GSD state.

This skill prevents documentation drift in projects that use GSD plus modular README files.
</objective>

<execution_context>
@.planning/references/agent-doc-architecture.md
@.planning/references/doc-authority-order.md
@.planning/references/module-readme-protocol.md
@.planning/references/documentation-sync-rules.md
@.planning/templates/doc-audit-report-template.md
</execution_context>

<context>
Scope: $ARGUMENTS

Supported usage:
- `/gsd-docs-audit` — audit all documentation layers
- `/gsd-docs-audit rag` — audit a focused module or area
- `/gsd-docs-audit --fix-readmes` — update obvious stale module README files when evidence is clear

Authority order:
Tests/CI/UAT > source code > `.planning/intel/` > `.planning/codebase/` > `.planning/STATE.md` > module README > root README > old docs.
</context>

<process>
1. Create `.planning/docs-audit/` if missing.
2. Discover documentation layers:
   - root `README.md`
   - `docs/`
   - `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`
   - `.planning/codebase/*.md`
   - `.planning/intel/*.json`
   - module README files under source directories
3. Discover relevant source and test files.
4. For each module README:
   - verify required sections from @.planning/references/module-readme-protocol.md
   - verify main files exist
   - verify test commands or test files exist
   - compare claimed responsibilities with code/tests
5. Record findings in:
   - `.planning/docs-audit/DOC-AUDIT.md`
   - `.planning/docs-audit/README-DRIFT.md`
   - `.planning/docs-audit/MISSING-MODULE-READMES.md`
   - `.planning/docs-audit/DOC-SYNC-TODO.md`
6. If `--fix-readmes` is present, only edit README files when the correct state is directly supported by code/tests. Otherwise record the drift instead of guessing.
7. Report next actions and suggested GSD command, usually `/gsd-map-codebase`, `/gsd-intel refresh`, `/gsd-graphify build`, or `/gsd-plan-phase --gaps`.
</process>

<output_contract>
Write or update:

```text
.planning/docs-audit/DOC-AUDIT.md
.planning/docs-audit/README-DRIFT.md
.planning/docs-audit/MISSING-MODULE-READMES.md
.planning/docs-audit/DOC-SYNC-TODO.md
```

Each drift item should include:
- severity: high | medium | low
- document path
- claim or missing section
- code/test evidence
- suggested fix
</output_contract>

<success_criteria>
- [ ] Documentation layers discovered
- [ ] Module README coverage checked
- [ ] README/code/test drift recorded
- [ ] Missing module README candidates recorded
- [ ] Clear next action provided
- [ ] No implementation status marked complete based only on documentation claims
</success_criteria>

---

<generic_adapter>
This is a GENERIC version of the GSD skill. It works with any AI runtime
(WorkBuddy, Codex, Claude Code, Cursor, Aider, etc.).

To use this skill with the generic GSD SDK:
  1. Ensure the generic `gsd-sdk-gen` and `gsd-tools-gen` are on your PATH:
     export PATH="$PATH:/path/to/gsd-generic-all/bin"
  2. The SDK will auto-detect the .planning/ directory in your project root.
  3. This skill reads/writes only project-local `.planning/` files and module README files.

Original Codex-specific paths have been replaced with relative .planning/ paths.
</generic_adapter>
