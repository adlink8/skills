---
name: gsd:inbox
description: [通用版] "Triage and review all open GitHub issues and PRs against project templates and contribution guidelines"
argument-hint: "[--issues] [--prs] [--label] [--close-incomplete] [--repo owner/repo]"
allowed-tools:
  - Read
  - Bash
  - Write
  - Grep
  - Glob
  - AskUserQuestion
---

<objective>
One-command triage of the project's GitHub inbox. Fetches all open issues and PRs,
reviews each against the corresponding template requirements (feature, enhancement,
bug, chore, fix PR, enhancement PR, feature PR), reports completeness and compliance,
and optionally applies labels or closes non-compliant submissions.

**Flow:** Detect repo → Fetch open issues + PRs → Classify each by type → Review against template → Report findings → Optionally act (label, comment, close)
</objective>

<execution_context>
@.planning/workflows/inbox.md
</execution_context>

<context>
**Flags:**
- `--issues` — Review only issues (skip PRs)
- `--prs` — Review only PRs (skip issues)
- `--label` — Auto-apply recommended labels after review
- `--close-incomplete` — Close issues/PRs that fail template compliance (with comment explaining why)
- `--repo owner/repo` — Override auto-detected repository (defaults to current git remote)
</context>

<process>
Execute the inbox workflow from @.planning/workflows/inbox.md end-to-end.
Parse flags from arguments and pass to workflow.
</process>

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
