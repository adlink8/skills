---
name: gsd:join-discord
description: [通用版] "Join the GSD Discord community"
---


<objective>
Display the Discord invite link for the GSD community server.
</objective>

<output>
# Join the GSD Discord

Connect with other GSD users, get help, share what you're building, and stay updated.

**Invite link:** https://discord.gg/mYgfVNfA2r

Click the link or paste it into your browser to join.
</output>

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
