# Documentation Sync Rules

These rules prevent documentation drift during GSD execution.

## Update Triggers

Update module README when:

- Module ownership changes.
- Public API, exported function, CLI command, or event changes.
- Data flow changes.
- Test commands or verification flow changes.
- Known risks or integration assumptions change.

Update `.planning/STATE.md` or a phase summary when:

- Project phase status changes.
- A milestone/slice becomes complete.
- Test counts or CI/UAT evidence changes materially.
- A major capability moves from MISSING/PARTIAL to VERIFIED.

Update `.planning/codebase/` when:

- Architecture, structure, stack, testing, integration, or convention changes significantly.
- A map-codebase refresh finds stale generated docs.

Update `.planning/intel/` when:

- API map, file roles, dependencies, module boundaries, or architecture decisions change.
- Structured search results are stale.

Update `.planning/graphs/` when:

- New modules, APIs, tests, requirements, decisions, or dependencies should be queryable as graph nodes.

## Do Not Update

Do not update root README for internal task progress unless public behavior or quick-start instructions changed.

Do not duplicate project state in module README.

Do not mark features as complete in docs unless verification evidence exists.

## Drift Recording

If drift is found but cannot be safely fixed immediately, write it to:

```text
.planning/docs-audit/README-DRIFT.md
.planning/docs-audit/DOC-SYNC-TODO.md
```

A drift item should include:

- Source document
- Conflicting code/test evidence
- Severity: high, medium, low
- Suggested owner/module
- Suggested fix
