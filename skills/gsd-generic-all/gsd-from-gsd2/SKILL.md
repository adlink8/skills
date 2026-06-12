---
name: gsd:from-gsd2
description: [通用版] "Import a GSD-2 (.gsd/) project back to GSD v1 (.planning/) format"
argument-hint: "[--path <dir>] [--force]"
allowed-tools:
  - Read
  - Write
  - Bash
---


<objective>
Reverse-migrate a GSD-2 project (`.gsd/` directory) back to GSD v1 (`.planning/`) format.

Maps the GSD-2 hierarchy (Milestone → Slice → Task) to the GSD v1 hierarchy (Milestone sections in ROADMAP.md → Phase → Plan), preserving completion state, research files, and summaries.

**CJS-only:** `from-gsd2` is not on the `gsd-sdk-gen query` registry; call `gsd-tools-gen.cjs` as shown below (see `docs/CLI-TOOLS.md`).
</objective>

<process>

1. **Locate the .gsd/ directory** — check the current working directory (or `--path` argument):
   ```bash
   node "gsd-tools-gen" from-gsd2 --dry-run
   ```
   If no `.gsd/` is found, report the error and stop.

2. **Show the dry-run preview** — present the full file list and migration statistics to the user. Ask for confirmation before writing anything.

3. **Run the migration** after confirmation:
   ```bash
   node "gsd-tools-gen" from-gsd2
   ```
   Use `--force` if `.planning/` already exists and the user has confirmed overwrite.

4. **Report the result** — show the `filesWritten` count, `planningDir` path, and the preview summary.

</process>

<notes>
- The migration is non-destructive: `.gsd/` is never modified or removed.
- Pass `--path <dir>` to migrate a project at a different path than the current directory.
- Slices are numbered sequentially across all milestones (M001/S01 → phase 01, M001/S02 → phase 02, M002/S01 → phase 03, etc.).
- Tasks within each slice become plans (T01 → plan 01, T02 → plan 02, etc.).
- Completed slices and tasks carry their done state into ROADMAP.md checkboxes and SUMMARY.md files.
- GSD-2 cost/token ledger, database state, and VS Code extension state cannot be migrated.
</notes>

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
