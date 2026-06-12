# Documentation Authority Order

Use this order whenever project documents disagree.

## Trust Order

1. Passing tests, CI, and UAT evidence
2. Source code wired into the main execution path
3. `.planning/intel/` structured codebase intelligence
4. `.planning/codebase/` generated codebase map
5. `.planning/STATE.md`
6. Module README files
7. Root `README.md`
8. Historical docs, TODOs, old plans, old roadmap drafts

## Rules

- Documentation helps navigation; it does not prove implementation.
- A feature is verified only when code exists, is wired, and tests or UAT prove it works.
- If module README conflicts with source code, trust code and record drift.
- If `.planning/STATE.md` conflicts with passing CI/UAT, update state.
- If generated codebase docs conflict with module README, inspect source and tests before deciding.

## Drift Handling

When drift is found:

1. Fix the outdated document immediately if the correct state is clear.
2. Otherwise record it in `.planning/docs-audit/README-DRIFT.md`.
3. Do not use the stale document as planning input until resolved.
