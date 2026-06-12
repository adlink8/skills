---
name: anki
description: [通用版] Create and manage Anki flashcards. Use when the user wants to create flashcards, add notes to Anki, manage decks, or work with spaced repetition learning. Also use when user mentions "anki", "make cards", "add to anki", "learn this", "memorize", "remember this", "SRS", or asks to turn content into flashcards.
---

# Anki Flashcard Management

Use the `anki.sh` script to create and manage flashcards via AnkiConnect.

```bash
ANKI="$(dirname "$SKILL_PATH")/scripts/anki.sh"
```

Preflight:

- Ensure Anki desktop is running with AnkiConnect enabled
- Ensure `curl` and `jq` are available in PATH

## CRITICAL: User Approval Required

**NEVER add cards to Anki without explicit user approval.**

Before adding any cards:

1. Display all proposed cards in full (front + back)
2. Ask user to confirm: "Ready to add these cards?"
3. Only proceed after explicit "yes" / approval

This is non-negotiable. Users must review card quality before adding.

For potentially destructive or irreversible actions:

- `delete`: ask explicit confirmation before deleting notes
- `update`: confirm exact fields/IDs before updating notes
- `rate`: show card + suggested rating, then wait for user confirmation before submitting

## Guidelines

- **MUST** use the `Anki Markdown` note type for basic cards or `Anki Markdown Cloze` for cloze deletions
- Use markdown for both front and back fields
- Test exactly one fact or idea per card
- Make questions atomic and simple
- Keep questions and answers short, clear, and unambiguous
- Ensure each card has one unique, specific answer
- Avoid long lists or multiple items in one card
- Add context or hints so your future self understands
- Personalize with examples or mnemonics if helpful
- Allow multiple simple cards for important concepts
- Create multiple variants of important questions from different angles
- Connect cards to personal goals and projects to avoid "orphan" facts
- Always use syntax highlighting for code (see Code Snippets section)
- When creating multiple related cards, use bulk operations for efficiency
- For exam-question decks, run the formatting guard before APKG generation or bulk import so options, code, and explanations render cleanly in Anki.

## Choosing Card Type

Use **Anki Markdown** (Front/Back) for question-answer pairs where you write a specific question.
Use **Anki Markdown Cloze** (Text/Extra) for fill-in-the-blank cards where hiding parts of a statement is more natural than writing a question.

## Cloze Cards

Use `Anki Markdown Cloze` for fill-in-the-blank cards. Fields are `Text` and `Extra`.

### Syntax

Three forms:

- `{{c1::answer}}` - shows **[...]** on front
- `{{c1::answer::hint}}` - shows **[hint]** on front
- `{{c1::answer::blur}}` - shows blurred content on front (reveals shape but not text)

Full markdown works inside cloze deletions: bold, italic, highlights, inline code with language tags, links, images, code blocks, and tables.

### Multiple Cards

Each cloze number (c1, c2, c3...) generates a separate card. Use different numbers to test different facts from the same note:

```
{"Text": "{{c1::HTML}} provides structure, {{c2::CSS}} provides style."}
```

This produces 2 cards. Card 1 hides "HTML", card 2 hides "CSS".

Using the same number multiple times hides all instances on the same card:

```
{"Text": "{{c1::React}} and {{c1::Vue}} are frontend frameworks."}
```

This produces 1 card that hides both "React" and "Vue".

### Nested Cloze

Cloze deletions can be nested. The outer cloze hides everything including the inner:

```
{"Text": "{{c1::Canberra was {{c2::founded}}}} in 1913."}
```

Card 1 hides "Canberra was founded". Card 2 only hides "founded".

### Inline Code in Cloze

Inline code with language tags works inside cloze. Note the triple closing braces (`}}}`) when code uses `{lang}` syntax:

```
{"Text": "Use {{c1::`querySelector()`{js}}} to find DOM elements."}
```

### Extra Field

The `Extra` field appears on the back of every card. Use it for context, examples, or references. It supports full markdown including code blocks and callouts.

### Cloze Examples

```bash
# Basic cloze
$ANKI add "MyDeck" "Anki Markdown Cloze" '{"Text":"The {{c1::CPU}} executes {{c2::instructions}}.","Extra":"Basic computer architecture."}' --tags "cs"

# Cloze with hint
$ANKI add "MyDeck" "Anki Markdown Cloze" '{"Text":"{{c1::JavaScript::language}} was created in {{c2::1995::year}}.","Extra":"Created by Brendan Eich."}' --tags "history"

# Cloze with blur
$ANKI add "MyDeck" "Anki Markdown Cloze" '{"Text":"The speed of light is {{c1::299,792,458 m/s::blur}}.","Extra":"Often approximated as 3 x 10^8 m/s."}' --tags "physics"
```

## Front Field Format

Use markdown on the front to highlight key terms the question is about:

- Use **bold** or `==highlight==` for the main concept being tested
- Use inline code for technical terms, functions, or syntax

Example: `What does **vertex_index** return in WGSL?`

## Back Field Format

Use this format for the Back field:

1. **Bold one-liner** with the direct answer
2. Blank line
3. Additional context in normal text (optional)

### Formatting for Fast Skimming

- Use `==highlighted==` to make key terms stand out at a glance
- Use **bold** for critical concepts within explanations
- Use syntax highlighting for all code blocks including inline
- Optimize for quick visual scanning—readers should grasp the core idea instantly
- Multiple-choice options must be one option per line, with visible dark text. Avoid placeholder-only option rows such as `-`.
- Explanation fields should be split into short paragraphs. Put answer, key point, and analysis on separate visual blocks when possible.
- For Chinese exam cards, important labels such as `答案`, `解析`, `考点`, `易错点`, and `关键` may use blue emphasis for scanning.

### Keyboard Shortcuts

Use `<kbd>` tags for keyboard keys:

```markdown
Press <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> to open the command palette.
```

### Code Snippets

Always use syntax highlighting:

- Fenced blocks: Use triple backticks with language (`js, `python, ```rust, etc.)
- Inline code: Use `` `code`{lang} `` syntax (e.g., `` `const x = 1`{js} ``)
- Do not leave code questions as one collapsed paragraph. Preserve indentation and line breaks.
- If source text/OCR collapses code into one line, repair it before import. Code should render as a single block, not as raw backticks or inline text.

Advanced features:

- Line highlighting: ```js {2} to highlight line 2
- Word highlighting: ```js /pattern/ to highlight specific words
- Focus mode: Add `// [!code focus]` comment to focus specific lines

### Callouts

Use GitHub-style alerts sparingly for important notes:

```markdown
> [!TIP]
> Brief helpful insight here.

> [!NOTE]
> Useful context the learner should know.

> [!WARNING]
> Common mistake or gotcha to avoid.
```

### Example

```
Front: What does `passEncoder.draw(3)`{js} do with **no vertex buffer**?
Back:

**Invokes the ==vertex shader== 3 times.**

The shader uses `@builtin(vertex_index)`{wgsl} to generate positions ==procedurally==.

> [!TIP]
> Useful for fullscreen quads without geometry data.
```

## Common Operations

Run via `$ANKI <action> [args...]`:

| Action     | Description          | Example                                                                         |
| ---------- | -------------------- | ------------------------------------------------------------------------------- |
| `sync`     | Trigger AnkiWeb sync | `$ANKI sync`                                                                    |
| `decks`    | List decks           | `$ANKI decks --stats`                                                           |
| `models`   | List note types      | `$ANKI models`                                                                  |
| `fields`   | Fields for a model   | `$ANKI fields "Anki Markdown"`                                                  |
| `find`     | Search notes         | `$ANKI find "deck:Spanish tag:verb"`                                            |
| `info`     | Note details         | `$ANKI info 1234 5678`                                                          |
| `add`      | Add one note         | `$ANKI add "My Deck" "Anki Markdown" '{"Front":"Q","Back":"A"}' --tags "t1 t2"` |
| `add-bulk` | Add many notes       | `$ANKI add-bulk "My Deck" "Anki Markdown" '[{"Front":"Q1","Back":"A1"}]'`       |
| `update`   | Update fields        | `$ANKI update 1234 '{"Front":"New Q"}'`                                         |
| `delete`   | Delete notes         | `$ANKI delete 1234 5678`                                                        |
| `due`      | Get due cards        | `$ANKI due "My Deck" --limit 5`                                                 |
| `review`   | Show card            | `$ANKI review 1234`                                                             |
| `rate`     | Rate card (1-4)      | `$ANKI rate 1234 3`                                                             |
| `tags`     | List tags            | `$ANKI tags --pattern "verb"`                                                   |

### Typical workflow

```bash
$ANKI sync                          # sync first
$ANKI decks                         # check available decks
$ANKI models                        # verify required model exists
$ANKI fields "Anki Markdown"        # verify field names for selected model
$ANKI find "deck:MyDeck front:test" # check for duplicates
$ANKI add "MyDeck" "Anki Markdown" '{"Front":"...","Back":"..."}'
$ANKI sync                          # sync after changes
```

## Formatting Guard for Generated JSON

When generating APKG files or preparing `add-bulk` JSON, normalize the card JSON first:

```bash
python "$SKILL_PATH/scripts/format_cards.py" cards.json cards.formatted.json --default-lang python --stats
```

Use `--default-lang java` for Java decks, `--default-lang python` for Python decks, etc.

The formatter repairs common Anki display problems:

- removes blank option rows like `-`
- converts `A. ...`, `B. ...` options into one visible row per option
- converts markdown headings into stable HTML headings
- converts fenced code and collapsed code-like paragraphs into styled code blocks
- keeps code whitespace with `white-space: pre-wrap`
- emits quality stats such as `blank_option_divs`, `raw_fences`, and `code_blocks`

Before importing or packaging a large deck, inspect the stats. Acceptable checks for exam decks:

- `blank_option_divs` should be `0`
- `raw_fences` should be `0` if generating HTML-stabilized fields
- code-heavy decks should report nonzero `code_blocks`

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
