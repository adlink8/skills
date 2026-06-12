---
name: gsd:set-profile
description: [通用版] "Switch model profile for GSD agents (quality/balanced/budget/inherit)"
argument-hint: "<profile (quality|balanced|budget|inherit)>"
allowed-tools:
  - Bash
---


Show the following output to the user verbatim, with no extra commentary:

!`if ! command -v gsd-sdk-gen >/dev/null 2>&1; then printf '⚠ gsd-sdk-gen not found in PATH — /gsd-set-profile requires it.\n\nInstall the GSD SDK:\n  npm install -g @gsd-build/sdk\n\nOr update GSD to get the latest packages:\n  /gsd-update\n'; exit 1; fi; gsd-sdk-gen query config-set-model-profile $ARGUMENTS --raw`

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
