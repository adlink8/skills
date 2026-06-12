# Module README Protocol

Module README files are local operating manuals for agents and humans. They define module ownership and prevent accidental cross-module edits.

## Required Sections

Each module README should include:

```markdown
# Module: <Name>

## Purpose

What this module owns and why it exists.

## Boundaries

Owns:
- ...

Does not own:
- ...

## Main Files

- `path/to/file`

## Data Flow

Input → Step → Output

## Public Interfaces

- API endpoints
- exported functions
- CLI commands
- events

## Tests

```bash
<exact commands>
```

## Current Status

- Done:
- Partial:
- Missing:

## Known Risks

- ...

## Agent Notes

- Do not modify X without checking Y.
```

## Agent Use Rules

Before changing a module:

1. Read the module README.
2. Read all files listed in `Main Files`.
3. Read the listed tests.
4. Confirm the requested behavior belongs to this module.
5. If the README is stale, inspect code/tests and record drift.

After changing a module:

1. Update the module README if ownership, API, behavior, data flow, tests, or risks changed.
2. Update `.planning/STATE.md` or phase summary when project-level state changes.
3. Run module tests and broader regression tests when integration boundaries changed.

## Good Module README Qualities

- Short and factual.
- Lists exact file paths and test commands.
- States what the module does not own.
- Links to code and tests, not vague concepts.
- Avoids aspirational future features unless clearly marked as planned.

## Anti-Patterns

- Writing project roadmap into module README.
- Duplicating root README content.
- Claiming features are done without test evidence.
- Leaving test commands vague.
- Omitting module boundaries.
