# Project Reading Order

This file defines the default reading order for GSD-compatible agents.

## Project-Level Tasks

Use this order for roadmap, phase planning, milestone status, architecture, release readiness, and cross-module integration:

1. `.planning/STATE.md`
2. `.planning/ROADMAP.md`
3. `.planning/REQUIREMENTS.md`
4. `.planning/codebase/ARCHITECTURE.md`
5. `.planning/codebase/STRUCTURE.md`
6. `.planning/codebase/TESTING.md`
7. `.planning/intel/*.json` if present
8. Relevant module README files
9. Relevant source files
10. Relevant tests
11. CI/UAT evidence

## Module-Level Tasks

Use this order for a focused bug or feature inside a known subsystem:

1. Owning module README
2. `.planning/codebase/TESTING.md`
3. `.planning/intel/file-roles.json` or `module-boundaries.json` if present
4. Relevant source files
5. Relevant tests
6. Integration callers and API routes
7. `.planning/STATE.md` only if state may change

## Brownfield Onboarding

When onboarding an existing codebase:

1. Run or read `/gsd-map-codebase` outputs.
2. Run or read `/gsd-intel refresh` outputs if enabled.
3. Compare module README files to actual code and tests.
4. Record drift before planning new work.

## Rule

Read the smallest authoritative set that can answer the task. Do not load every document by default.
