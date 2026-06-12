---
name: gsd:add-backlog
description: [通用版] "Add an idea to the backlog parking lot (999.x numbering)"
argument-hint: "<description>"
allowed-tools:
  - Read
  - Write
  - Bash
---


<objective>
Add a backlog item to the roadmap using 999.x numbering. Backlog items are
unsequenced ideas that aren't ready for active planning — they live outside
the normal phase sequence and accumulate context over time.
</objective>

<process>

1. **Read ROADMAP.md** to find existing backlog entries:
   ```bash
   cat .planning/ROADMAP.md
   ```

2. **Find next backlog number:**
   ```bash
   NEXT=$(gsd-sdk-gen query phase.next-decimal 999 --raw)
   ```
   If no 999.x phases exist, start at 999.1.

3. **Add to ROADMAP.md** under a `## Backlog` section. If the section doesn't exist, create it at the end.
   Write the ROADMAP entry BEFORE creating the directory — this ensures directory existence is always
   a reliable indicator that the phase is already registered, which prevents false duplicate detection
   in any hook that checks for existing 999.x directories (#2280):

   ```markdown
   ## Backlog

   ### Phase {NEXT}: {description} (BACKLOG)

   **Goal:** [Captured for future planning]
   **Requirements:** TBD
   **Plans:** 0 plans

   Plans:
   - [ ] TBD (promote with /gsd-review-backlog when ready)
   ```

4. **Create the phase directory:**
   ```bash
   SLUG=$(gsd-sdk-gen query generate-slug "$ARGUMENTS" --raw)
   mkdir -p ".planning/phases/${NEXT}-${SLUG}"
   touch ".planning/phases/${NEXT}-${SLUG}/.gitkeep"
   ```

5. **Commit:**
   ```bash
   gsd-sdk-gen query commit "docs: add backlog item ${NEXT} — ${ARGUMENTS}" .planning/ROADMAP.md ".planning/phases/${NEXT}-${SLUG}/.gitkeep"
   ```

6. **Report:**
   ```
   ## 📋 Backlog Item Added

   Phase {NEXT}: {description}
   Directory: .planning/phases/{NEXT}-{slug}/

   This item lives in the backlog parking lot.
   Use /gsd-discuss-phase {NEXT} to explore it further.
   Use /gsd-review-backlog to promote items to active milestone.
   ```

</process>

<notes>
- 999.x numbering keeps backlog items out of the active phase sequence
- Phase directories are created immediately, so /gsd-discuss-phase and /gsd-plan-phase work on them
- No `Depends on:` field — backlog items are unsequenced by definition
- Sparse numbering is fine (999.1, 999.3) — always uses next-decimal
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
