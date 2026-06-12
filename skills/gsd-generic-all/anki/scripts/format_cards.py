#!/usr/bin/env python3
"""Normalize Anki Markdown card JSON for readable imports.

Input format:
[
  {"Front": "...", "Back": "..."},
  ...
]

The formatter keeps the Anki Markdown note shape, but emits stable HTML inside
the fields for layouts that often render poorly in Anki: multiple-choice
options, fenced code blocks, collapsed code snippets, headings, and key labels.
"""

from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path


OPTION_STYLE = (
    "margin:8px 0; padding:8px 12px; border-left:4px solid #2563eb; "
    "background:#f8fafc; color:#111827 !important; line-height:1.55; "
    "border-radius:4px;"
)


def format_code(code: str, lang: str) -> str:
    escaped = html.escape(code.strip("\n"))
    return (
        f'<pre style="background:#111827; color:#f9fafb; padding:12px 14px; '
        f'border-radius:6px; overflow-x:auto; white-space:pre-wrap; '
        f'line-height:1.55; font-size:14px; margin:10px 0;">'
        f'<code class="language-{html.escape(lang)}">{escaped}</code></pre>'
    )


def strip_bad_option_divs(text: str) -> str:
    text = re.sub(r'<div[^>]*>\s*-\s*</div>\s*', "", text, flags=re.I)

    def restyle(match: re.Match[str]) -> str:
        body = match.group(1).strip()
        if not body:
            return ""
        return f'<div style="{OPTION_STYLE}">{body}</div>'

    return re.sub(r"<div\b[^>]*>(.*?)</div>", restyle, text, flags=re.I | re.S)


def extract_fences(text: str, default_lang: str) -> tuple[str, dict[str, str]]:
    blocks: dict[str, str] = {}

    def repl(match: re.Match[str]) -> str:
        lang = (match.group(1) or default_lang).strip() or default_lang
        key = f"@@CODE_BLOCK_{len(blocks)}@@"
        blocks[key] = format_code(match.group(2), lang)
        return key

    text = re.sub(r"```([A-Za-z0-9_+-]*)\n(.*?)```", repl, text, flags=re.S)
    return text, blocks


def inline_markup(line: str) -> str:
    line = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", line)
    line = re.sub(
        r"`([^`]+)`(?:\{[A-Za-z0-9_+-]+\})?",
        lambda m: (
            '<code style="background:#eef2ff; color:#1e3a8a; padding:1px 4px; '
            f'border-radius:4px;">{html.escape(m.group(1))}</code>'
        ),
        line,
    )
    return line


def has_cjk(text: str) -> bool:
    return bool(re.search(r"[\u4e00-\u9fff]", text))


def looks_like_collapsed_code(line: str, default_lang: str) -> bool:
    if has_cjk(line) or len(line) < 18:
        return False
    if default_lang in {"java", "js", "javascript", "c", "cpp"}:
        return any(
            token in line
            for token in ["public class", "class ", "System.out", "extends ", "new ", "return ", "if ("]
        )
    return any(
        token in line
        for token in ["print(", "input(", "for ", "if ", "while ", "def ", "import ", "range(", ".items()", ".append("]
    )


def expand_collapsed_code(line: str, default_lang: str) -> str:
    code = line.strip()
    if default_lang == "python":
        code = re.sub(r"\s+(?=(?:for|if|elif|else|while|def|return|print|import)\b)", "\n", code)
        code = re.sub(r"\s+(?=[A-Za-z_]\w*\s*=)", "\n", code)
        lines = [part.strip() for part in code.split("\n") if part.strip()]
        formatted: list[str] = []
        indent = 0
        for part in lines:
            if part.startswith(("elif ", "else", "except", "finally")):
                indent = max(indent - 1, 0)
            formatted.append("    " * indent + part)
            if part.endswith(":"):
                indent += 1
        return "\n".join(formatted)

    code = re.sub(
        r"\s+(?=(?:public|private|protected|class|interface|abstract|static|final|if|else|for|while|return|System\.out)\b)",
        "\n",
        code,
    )
    code = code.replace("{ ", "{\n").replace("; ", ";\n").replace(" }", "\n}")
    return "\n".join(part.strip() for part in code.split("\n") if part.strip())


def markdownish_to_html(text: str, default_lang: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = strip_bad_option_divs(text)
    text, code_blocks = extract_fences(text, default_lang)
    text = text.replace("###", "\n###").replace("##", "\n##")

    out: list[str] = []
    paragraph: list[str] = []

    def flush() -> None:
        nonlocal paragraph
        if paragraph:
            body = " ".join(part.strip() for part in paragraph if part.strip())
            if body:
                out.append(f'<p style="margin:8px 0; line-height:1.7; color:#111827;">{inline_markup(body)}</p>')
        paragraph = []

    for raw in text.split("\n"):
        line = raw.strip()
        if not line or line == "-":
            flush()
            continue
        if line in code_blocks:
            flush()
            out.append(code_blocks[line])
            continue
        if line.startswith("<pre") or line.startswith("<div"):
            flush()
            out.append(line)
            continue
        if looks_like_collapsed_code(line, default_lang):
            flush()
            out.append(format_code(expand_collapsed_code(line, default_lang), default_lang))
            continue
        if line.startswith("---"):
            flush()
            out.append('<hr style="border:0; border-top:1px solid #d1d5db; margin:12px 0;">')
            continue
        if line.startswith(">"):
            line = line.lstrip("> ").strip()
        if line.startswith("### "):
            flush()
            out.append(
                f'<h3 style="font-size:17px; margin:12px 0 8px; color:#111827; '
                f'line-height:1.45;">{inline_markup(line[4:].strip())}</h3>'
            )
            continue
        if line.startswith("## "):
            flush()
            out.append(
                f'<h2 style="font-size:19px; margin:0 0 10px; color:#111827; '
                f'line-height:1.45;">{inline_markup(line[3:].strip())}</h2>'
            )
            continue
        if re.match(r"^-\s*[A-D][.．]", line):
            flush()
            option = re.sub(r"^-\s*", "", line)
            out.append(f'<div style="{OPTION_STYLE}">{inline_markup(option)}</div>')
            continue
        if re.match(r"^[A-D][.．]", line):
            flush()
            out.append(f'<div style="{OPTION_STYLE}">{inline_markup(line)}</div>')
            continue
        paragraph.append(line)

    flush()
    return "\n".join(out)


def normalize_cards(cards: list[dict[str, str]], default_lang: str) -> list[dict[str, str]]:
    normalized = []
    for card in cards:
        normalized.append(
            {
                **card,
                "Front": markdownish_to_html(card.get("Front", ""), default_lang),
                "Back": markdownish_to_html(card.get("Back", ""), default_lang),
            }
        )
    return normalized


def stats(cards: list[dict[str, str]]) -> dict[str, int]:
    all_text = "\n".join(card.get("Front", "") + "\n" + card.get("Back", "") for card in cards)
    return {
        "cards": len(cards),
        "blank_option_divs": len(re.findall(r"<div[^>]*>\s*-\s*</div>", all_text)),
        "raw_fences": all_text.count("```"),
        "raw_heading_markers": len(re.findall(r"(^|\n)#{2,3}\s", all_text)),
        "code_blocks": all_text.count("<pre"),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Normalize Anki Markdown card JSON fields.")
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--default-lang", default="text", help="Language for unlabeled code blocks.")
    parser.add_argument("--stats", action="store_true", help="Print quality stats after writing output.")
    args = parser.parse_args()

    cards = json.loads(args.input.read_text(encoding="utf-8"))
    normalized = normalize_cards(cards, args.default_lang)
    args.output.write_text(json.dumps(normalized, ensure_ascii=False, indent=2), encoding="utf-8")

    if args.stats:
        print(json.dumps(stats(normalized), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
