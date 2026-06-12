---
name: gsd:settings-integrations
description: [通用版] "Configure third-party API keys, code-review CLI routing, and agent-skill injection"
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
---


<objective>
Interactive configuration of GSD's third-party integration surface:
- Search API keys: `brave_search`, `firecrawl`, `exa_search`, and
  the `search_gitignored` toggle
- Code-review CLI routing: `review.models.{Codex,codex,gemini,opencode}`
- Agent-skill injection: `agent_skills.<agent-type>`

API keys are stored plaintext in `.planning/config.json` but are masked
(`****<last-4>`) in every piece of interactive output. The workflow never
echoes plaintext to stdout, stderr, or any log.

This command is deliberately distinct from `/gsd-settings` (workflow toggles)
and any `/gsd-settings-advanced` tuning surface. It handles *connectivity*,
not pipeline shape.
</objective>

<execution_context>
@.planning/workflows/settings-integrations.md
</execution_context>

<process>
**Follow the settings-integrations workflow** from
`@.planning/workflows/settings-integrations.md`.

The workflow handles:
1. Resolving `$GSD_CONFIG_PATH` (flat vs workstream)
2. Reading current integration values (masked for display)
3. Section 1 — Search Integrations: Brave / Firecrawl / Exa / search_gitignored
4. Section 2 — Review CLI Routing: review.models.{Codex,codex,gemini,opencode}
5. Section 3 — Agent Skills Injection: agent_skills.<agent-type>
6. Writing values via `gsd-sdk-gen query config-set` (which merges, preserving
   unrelated keys)
7. Masked confirmation display
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
