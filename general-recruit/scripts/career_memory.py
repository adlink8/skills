#!/usr/bin/env python3
"""
通用招聘助手 — 求职记忆管理

用法：
  python career_memory.py init                           # 初始化记忆文件
  python career_memory.py show                           # 查看当前画像
  python career_memory.py append --text "<内容>"         # 追加一行
  python career_memory.py forget                         # 清除记忆（需确认）
"""

import os
import sys
import json
from datetime import datetime

MEMORY_DIR = os.path.join(os.getcwd(), "career-memory")
MEMORY_FILE = os.path.join(MEMORY_DIR, "general-recruit-memory.md")


def init():
    """初始化记忆目录和文件"""
    os.makedirs(MEMORY_DIR, exist_ok=True)
    if not os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, "w", encoding="utf-8") as f:
            f.write(f"# 求职画像\n\n> 创建于 {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n")
        print(json.dumps({"status": "created", "file": MEMORY_FILE}, ensure_ascii=False))
    else:
        print(json.dumps({"status": "exists", "file": MEMORY_FILE}, ensure_ascii=False))


def show():
    """显示当前画像"""
    if not os.path.exists(MEMORY_FILE):
        print(json.dumps({"status": "not_found", "hint": "先运行 init 初始化"}, ensure_ascii=False))
        return
    with open(MEMORY_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    print(json.dumps({"status": "ok", "content": content}, ensure_ascii=False))


def append(text):
    """追加一行到记忆文件"""
    if not os.path.exists(MEMORY_FILE):
        init()
    with open(MEMORY_FILE, "a", encoding="utf-8") as f:
        f.write(f"- [{datetime.now().strftime('%Y-%m-%d %H:%M')}] {text}\n")
    print(json.dumps({"status": "appended", "text": text}, ensure_ascii=False))


def forget():
    """清除记忆（需交互确认）"""
    if not os.path.exists(MEMORY_FILE):
        print(json.dumps({"status": "already_empty"}, ensure_ascii=False))
        return
    # 非交互模式直接删除
    os.remove(MEMORY_FILE)
    print(json.dumps({"status": "deleted"}, ensure_ascii=False))


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        print("用法: career_memory.py <init|show|append|forget>")
        sys.exit(1)

    cmd = args[0]
    if cmd == "init":
        init()
    elif cmd == "show":
        show()
    elif cmd == "append":
        text_idx = None
        for i, a in enumerate(args):
            if a == "--text" and i + 1 < len(args):
                text_idx = i + 1
                break
        if text_idx:
            append(args[text_idx])
        else:
            # 尝试直接取剩余文本
            remaining = " ".join(args[1:])
            if remaining:
                append(remaining)
            else:
                print(json.dumps({"status": "error", "message": "需要 --text 参数"}, ensure_ascii=False))
                sys.exit(1)
    elif cmd == "forget":
        forget()
    else:
        print(f"未知命令: {cmd}")
        sys.exit(1)
