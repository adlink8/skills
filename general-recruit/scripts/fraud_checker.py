#!/usr/bin/env python3
"""
通用招聘助手 — 求职诈骗风险检测

用法：
  python fraud_checker.py "<可疑文本>"

基于关键词规则引擎，输出 JSON：
  {
    "risk_level": "high" | "medium" | "low",
    "risk_type": "paid" | "promise" | "redirect" | "fake_identity",
    "matched_signals": ["信号1", "信号2"],
    "suggested_response": "建议回应话术"
  }
"""

import json
import sys

# 高危信号 — 命中任一 = 高度疑似诈骗
HIGH_RISK_PAID = [
    "收费内推", "付费内推", "收费实习", "付费实习",
    "付费培训", "课程包", "服务费", "押金",
    "收费", "转账", "先付款"
]

HIGH_RISK_PROMISE = [
    "保offer", "保过", "包录用", "内部名额",
    "绿色通道", "免笔试", "免面试", "直推",
    "100%通过", "包过", "上岸率", "稳过"
]

HIGH_RISK_REDIRECT = [
    "加微信", "私信我", "扫码进群",
    "QQ群", "主页找我", "DM", "私聊"
]

MEDIUM_RISK = [
    "在职导师", "陪跑", "训练营",
    "身份证照片", "手持照", "下载APP"
]


def check(text):
    text_lower = text.lower()
    matched = []
    risk_type = None
    risk_level = "low"

    # 检查付费信号
    paid_matches = [s for s in HIGH_RISK_PAID if s in text]
    if paid_matches:
        risk_level = "high"
        risk_type = "paid"
        matched.extend(paid_matches)

    # 检查承诺信号
    promise_matches = [s for s in HIGH_RISK_PROMISE if s in text]
    if promise_matches:
        if risk_level != "high":
            risk_level = "high"
            risk_type = "promise"
        matched.extend(promise_matches)

    # 检查引流信号
    redirect_matches = [s for s in HIGH_RISK_REDIRECT if s in text]
    if redirect_matches:
        if risk_level != "high":
            risk_level = "high"
            risk_type = "redirect"
        matched.extend(redirect_matches)

    # 中危信号
    medium_matches = [s for s in MEDIUM_RISK if s in text]
    if medium_matches:
        if risk_level == "low":
            risk_level = "medium"
            risk_type = "medium_risk"
        matched.extend(medium_matches)

    # 组合高危
    has_paid = any(s in text for s in HIGH_RISK_PAID)
    has_promise = any(s in text for s in HIGH_RISK_PROMISE)
    has_redirect = any(s in text for s in HIGH_RISK_REDIRECT)
    combo = sum([has_paid, has_promise, has_redirect])
    if combo >= 2:
        risk_level = "high"
        risk_type = "high_risk_combo"

    # 建议回应
    if risk_level == "high":
        suggested = (
            "安全提醒：正规公司校招和实习全流程 0 收费。"
            "任何收费内推/保过/课程包/服务费都是高危诈骗信号。"
            "如已付款，建议保留证据并在对应平台举报。"
            "建议通过公司官网或正规招聘平台投递。"
        )
    elif risk_level == "medium":
        suggested = (
            "存在可疑信号，建议保持警惕。"
            "正规公司不会要求提供身份证照片或下载非主流APP。"
            "建议核实对方身份后再做决定。"
        )
    else:
        suggested = "暂未检测到明显诈骗风险，但仍建议通过正规渠道投递。"

    return {
        "risk_level": risk_level,
        "risk_type": risk_type or "none",
        "matched_signals": matched,
        "suggested_response": suggested
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "需要提供待检测文本"}, ensure_ascii=False))
        sys.exit(1)

    text = sys.argv[1]
    result = check(text)
    print(json.dumps(result, ensure_ascii=False, indent=2))
