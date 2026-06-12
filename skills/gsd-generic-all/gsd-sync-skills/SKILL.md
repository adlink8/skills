---
name: gsd:sync-skills
description: [通用版] "Sync managed GSD skills across runtime roots so multi-runtime users stay aligned after an update"
allowed-tools:
  - Bash
  - AskUserQuestion
---


<objective>
Sync managed `gsd-*` skill directories from one canonical runtime's skills root to one or more destination runtime skills roots.

Routes to the sync-skills workflow which handles:
- Argument parsing (--from, --to, --dry-run, --apply)
- Runtime skills root resolution via install.js --skills-root
- Diff computation (CREATE / UPDATE / REMOVE per destination)
- Dry-run reporting (default — no writes)
- Apply execution (copy and remove with idempotency)
- Non-GSD skill preservation (only gsd-* dirs are touched)
</objective>

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
