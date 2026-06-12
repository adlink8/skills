# Project Documentation Map

This document maps project documentation layers for GSD-compatible agents.

## Public Overview

- Root README: `README.md`
- Human docs: `docs/`

## GSD Control Layer

- Project state: `.planning/STATE.md`
- Roadmap: `.planning/ROADMAP.md`
- Requirements: `.planning/REQUIREMENTS.md`
- Phase plans: `.planning/phases/`
- Reviews: `.planning/**/REVIEWS.md`
- UAT: `.planning/**/UAT.md`

## Codebase Map

- Stack: `.planning/codebase/STACK.md`
- Architecture: `.planning/codebase/ARCHITECTURE.md`
- Structure: `.planning/codebase/STRUCTURE.md`
- Testing: `.planning/codebase/TESTING.md`
- Concerns: `.planning/codebase/CONCERNS.md`

## Structured Intelligence

- API map: `.planning/intel/api-map.json`
- File roles: `.planning/intel/file-roles.json`
- Dependencies: `.planning/intel/dependency-graph.json`
- Module boundaries: `.planning/intel/module-boundaries.json`
- Doc map: `.planning/intel/doc-map.json`

## Module READMEs

| Module | README | Main Source | Tests |
|---|---|---|---|
| <module> | `<path>/README.md` | `<path>` | `<test path>` |

## Knowledge Graph

- Graph JSON: `.planning/graphs/graph.json`
- Graph report: `.planning/graphs/GRAPH_REPORT.md`
- Graph HTML: `.planning/graphs/graph.html`

## Authority Rule

Tests/CI/UAT > source code > intel > codebase map > STATE > module README > root README > old docs.
