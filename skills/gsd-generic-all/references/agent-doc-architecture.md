# Agent Documentation Architecture

This reference defines how GSD-compatible agents should understand, plan, modify, verify, and maintain projects that use layered documentation.

## Purpose

Agents must not read project files randomly or treat planning documents as implementation truth. This architecture gives every agent a stable project-reading protocol:

```text
README.md                 = public project overview
.planning/                = GSD project control layer
.planning/codebase/       = generated codebase map
.planning/intel/          = structured codebase intelligence
.planning/graphs/         = optional project knowledge graph
module README.md          = local module boundary and operating notes
source code               = implementation truth
tests + CI + UAT          = verification truth
```

## Authority Order

When sources conflict, trust them in this order:

1. Passing tests, CI, and UAT evidence
2. Actual source code wired into the main execution path
3. `.planning/intel/` structured intelligence
4. `.planning/codebase/` generated codebase map
5. `.planning/STATE.md`
6. Module README files
7. Root `README.md`
8. Older docs, TODO files, historical roadmap drafts

A feature is not implemented just because a roadmap, README, or requirement says it exists. It is implemented only when code exists, is wired into the main path, and verification proves it works.

## Documentation Responsibilities

### Root README

Use for public-facing project overview, quick start, high-level architecture, stable capabilities, and links.

Do not use for volatile task state, detailed module internals, or phase execution history.

### `.planning/`

Use as the GSD control system for state, roadmap, requirements, phase plans, execution history, decisions, reviews, UAT, and summaries.

### `.planning/codebase/`

Use for generated or refreshed codebase maps: stack, integrations, architecture, structure, conventions, testing, and concerns.

### `.planning/intel/`

Use for machine-readable project intelligence such as API maps, file roles, dependency graphs, architecture decisions, document maps, and module boundaries.

### `.planning/graphs/`

Use for optional knowledge graph artifacts connecting requirements, modules, source files, tests, APIs, decisions, risks, and verification evidence.

### Module README

Use for local module understanding: purpose, boundaries, main files, public interfaces, data flow, tests, known risks, and agent notes.

### Code and Tests

Code is implementation truth. Tests, CI, and UAT are verification truth. Documentation must be updated to match verified behavior, not the other way around.

## Default Agent Workflow

Before planning:

1. Read `.planning/STATE.md` if present.
2. Read `.planning/ROADMAP.md` if present.
3. Read `.planning/codebase/ARCHITECTURE.md` and `.planning/codebase/TESTING.md` if present.
4. Read relevant `.planning/intel/*.json` if present.
5. Read relevant module README files.
6. Read source code and tests that own the behavior.

Before implementation:

1. Classify the request as project-level or module-level.
2. Identify the owning module.
3. Confirm the module owns the requested behavior.
4. Read relevant tests and verification commands.
5. Avoid cross-module edits unless ownership and integration boundaries are clear.

After implementation:

1. Run relevant tests, lint/typecheck, and manual/API/UI verification as applicable.
2. Update module README if behavior, ownership, API, data flow, or tests changed.
3. Update `.planning/STATE.md` or phase summary if project state changed.
4. Record documentation drift in `.planning/docs-audit/` if discovered and not fixed.

## Project-Level vs Module-Level Requests

Project-level requests include roadmap planning, milestone status, release readiness, phase execution, architecture decisions, cross-module integration, and UAT.

Module-level requests include bugs or features in auth, RAG, import, API, frontend reader, data model, security, or tests.

Project-level tasks should start from `.planning/`. Module-level tasks should start from module README, source files, tests, and `.planning/codebase/TESTING.md`.

## Anti-Patterns

Agents must not:

- Treat roadmap items as completed features.
- Update root README for every internal task.
- Create duplicate state documents.
- Modify cross-module behavior without checking ownership.
- Write vague plans such as "implement feature".
- Mark tasks complete without tests or verification.
- Trust module README when code and tests disagree.

## Final Rule

GSD controls project evolution. Module README controls local module understanding. Code implements behavior. Tests prove behavior. Intel and graphs make the project queryable. Docs audit prevents drift.
