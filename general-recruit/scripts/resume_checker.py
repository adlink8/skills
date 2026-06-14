#!/usr/bin/env python3
"""
通用招聘助手 — 简历诊断规则引擎

用法：
  python resume_checker.py check --file <简历文件.md|.txt|.docx>
  python resume_checker.py checklist  # 显示检查清单

输出 JSON 格式诊断结果。
"""

import json
import sys
import os


CHECKLIST = {
    "基本信息": [
        "姓名、手机号、邮箱是否完整",
        "毕业年份/学历是否清楚",
        "求职意向是否明确（岗位+城市）"
    ],
    "格式": [
        "是否一页以内（应届生）",
        "排版是否清晰、无大面积空白",
        "中英文标点是否统一"
    ],
    "项目经历": [
        "是否有 2-4 个能展开讲的项目",
        "项目是否用 STAR 格式（情境-任务-动作-结果）",
        "是否有量化结果（比如提升了 X% 效率）",
        "技术栈是否在项目中有使用场景佐证"
    ],
    "技能": [
        "技能列表与项目经历是否对应",
        "是否有明显的夸大或虚构",
        "是否遗漏了能写的技能"
    ],
    "避雷": [
        "无夸大或虚构内容",
        "无个人信息泄露（身份证/银行卡等）",
        "无课程大作业类空壳项目"
    ]
}


def check_text(text):
    """对简历文本做规则诊断"""
    suggestions = []
    warnings = []

    # 长度粗略检查
    lines = text.strip().split("\n")
    if len(lines) < 10:
        warnings.append("简历内容过短，建议补充项目经历")

    # 联系方式检测
    has_phone = any(c.isdigit() and len(c) >= 11 for c in text.split())
    has_email = "@" in text and "." in text
    if not has_phone:
        suggestions.append("建议添加手机号")
    if not has_email:
        suggestions.append("建议添加邮箱")

    # 学历检测
    edu_keywords = ["本科", "硕士", "博士", "大专", "专科"]
    has_edu = any(kw in text for kw in edu_keywords)
    if not has_edu:
        suggestions.append("建议注明学历和毕业时间")

    # 求职意向检测
    intent_keywords = ["求职", "意向", "目标岗位", "期望城市"]
    has_intent = any(kw in text for kw in intent_keywords)
    if not has_intent:
        suggestions.append("建议添加求职意向（岗位+城市）")

    # STAR 检测（项目描述是否有动作词+量化词）
    action_words = ["负责", "搭建", "开发", "优化", "设计", "部署", "配置"]
    quant_words = ["提升", "降低", "减少", "缩短", "%", "倍", "个"]

    has_action = any(w in text for w in action_words)
    has_quant = any(w in text for w in quant_words)

    if not has_action:
        suggestions.append("项目描述缺少动作词（如：负责/搭建/优化），建议用 STAR 法则展开")
    if not has_quant:
        suggestions.append("项目描述缺少量化结果（如：提升 XX%/缩短到 XXms），建议补充数字")

    # 避雷检测
    if "身份证" in text:
        warnings.append("简历包含身份证信息，建议删除")
    if text.count("课程") >= 3:
        warnings.append("过多'课程'字样，建议筛选掉课程实验级项目")

    return {
        "status": "ok" if not warnings else "warnings_found",
        "suggestions": suggestions,
        "warnings": warnings,
        "score_hint": "非评分系统，列表仅供参考"
    }


if __name__ == "__main__":
    args = sys.argv[1:]

    if not args:
        print(json.dumps({"error": "用法: resume_checker.py check --file <文件>"}, ensure_ascii=False))
        sys.exit(1)

    if args[0] == "checklist":
        print(json.dumps({"checklist": CHECKLIST}, ensure_ascii=False, indent=2))
    elif args[0] == "check":
        filepath = None
        for i, a in enumerate(args):
            if a == "--file" and i + 1 < len(args):
                filepath = args[i + 1]
                break

        if not filepath or not os.path.exists(filepath):
            print(json.dumps({"error": "文件不存在", "file": filepath}, ensure_ascii=False))
            sys.exit(1)

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                text = f.read()
            result = check_text(text)
            result["file"] = filepath
            print(json.dumps(result, ensure_ascii=False, indent=2))
        except Exception as e:
            print(json.dumps({"error": str(e)}, ensure_ascii=False))
            sys.exit(1)
    else:
        print(f"未知子命令: {args[0]}")
