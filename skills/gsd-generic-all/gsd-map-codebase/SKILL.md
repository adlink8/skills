---
name: gsd:map-codebase
description: [通用版] "Analyze codebase with parallel mapper agents to produce .planning/codebase/ documents"
argument-hint: "[optional: specific area to map, e.g., 'api' or 'auth']"
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - Write
  - Task
---


<objective>
Analyze existing codebase using parallel gsd-codebase-mapper agents to produce structured codebase documents.

Each mapper agent explores a focus area and **writes documents directly** to `.planning/codebase/`. The orchestrator only receives confirmations, keeping context usage minimal.

Output: `.planning/codebase/` folder with structured documents about the codebase state, plus documentation coverage/drift notes when module README files exist.
</objective>

<execution_context>
@.planning/workflows/map-codebase.md
@.planning/references/agent-doc-architecture.md
@.planning/references/module-readme-protocol.md
@.planning/references/doc-authority-order.md
@.planning/templates/doc-audit-report-template.md
</execution_context>

<context>
Focus area: $ARGUMENTS (optional - if provided, tells agents to focus on specific subsystem)

**Load project state if exists:**
Check for .planning/STATE.md - loads context if project already initialized

**This command can run:**
- Before /gsd-new-project (brownfield codebases) - creates codebase map first
- After /gsd-new-project (greenfield codebases) - updates codebase map as code evolves
- Anytime to refresh codebase understanding

**Documentation architecture extension:**
When module README files exist, mappers should compare them to code/tests and record coverage/drift findings. Documentation claims never override code/tests.
</context>

<when_to_use>
**Use map-codebase for:**
- Brownfield projects before initialization (understand existing code first)
- Refreshing codebase map after significant changes
- Onboarding to an unfamiliar codebase
- Before major refactoring (understand current state)
- When STATE.md references outdated codebase info
- When module README files may be stale after implementation waves

**Skip map-codebase for:**
- Greenfield projects with no code yet (nothing to map)
- Trivial codebases (<5 files)
</when_to_use>

<process>
1. Check if .planning/codebase/ already exists (offer to refresh or skip)
2. Create .planning/codebase/ directory structure
3. Spawn 4 parallel gsd-codebase-mapper agents:
   - Agent 1: tech focus → writes STACK.md, INTEGRATIONS.md
   - Agent 2: arch focus → writes ARCHITECTURE.md, STRUCTURE.md
   - Agent 3: quality focus → writes CONVENTIONS.md, TESTING.md
   - Agent 4: concerns/docs focus → writes CONCERNS.md, DOC-COVERAGE.md, README-DRIFT.md
4. Ask mappers to use @.planning/references/module-readme-protocol.md when assessing module README files
5. Wait for agents to complete, collect confirmations (NOT document contents)
6. Verify core 7 documents exist with line counts
7. If module README files exist, verify DOC-COVERAGE.md and README-DRIFT.md exist or explicitly state "no module README files found"
8. Commit codebase map
9. Offer next steps (typically: /gsd-new-project, /gsd-plan-phase, or /gsd-docs-audit)
</process>

<success_criteria>
- [ ] .planning/codebase/ directory created
- [ ] All 7 core codebase documents written by mapper agents
- [ ] Documents follow template structure
- [ ] Parallel agents completed without errors
- [ ] DOC-COVERAGE.md records module README coverage when applicable
- [ ] README-DRIFT.md records stale/conflicting module documentation when applicable
- [ ] User knows next steps
</success_criteria>

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
