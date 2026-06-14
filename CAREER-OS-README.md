# Career OS — 求职全流程操作系统

> 一个个人求职平台的完整框架：Skill 操作层 × 参考库知识层 × 个人数据层

## 核心理念

```
Skill (操作层)  = 告诉AI怎么做   →  流程、判断、追问、输出格式
Knowledge (知识层) = 给AI喂什么   →  题库、模板、案例、框架、清单  
Data (数据层)      = 关于你是谁   →  简历、技能栈、求职画像、投递记录
```

## 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                    Career OS 平台                        │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ Skills   │  │Knowledge │  │  Data    │               │
│  │ 操作层   │  │ 知识层   │  │ 数据层   │               │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘               │
│       │             │             │                      │
│  ┌────┴─────────────┴─────────────┴────┐                │
│  │         求职全流程 16 步骤            │               │
│  │  定位 → 投递 → 笔试 → 面试 → 入职    │               │
│  └─────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────┘
```

## 16 步流程 × 三层资源

| # | 步骤 | Skill | 知识库 |
|---|------|-------|--------|
| 1 | 自我定位 | ✅ career-self-assessment | MBTI/霍兰德/技能评估框架 |
| 2 | 行业调研 | ❌ 待建 | reportcamp 8143篇报告索引 |
| 3 | 学习路径 | ❌ 待建 | developer-roadmap / roadmap.sh |
| 4 | 岗位搜索 | ✅ general-recruit | WebSearch 实时搜索 |
| 5 | JD 解读 | ✅ general-recruit | JD 模板库 |
| 6 | 公司背调 | ✅ career-company-check | 企查查/天眼查 MCP |
| 7 | 简历定制 | ✅ resume-assistant / general-recruit | STAR 模板 + JD 关键词库 |
| 8 | 投递管理 | ✅ career-app-tracker | job-tracker 开源工具 |
| 9 | 笔试测评 | ✅ career-assessment-prep | 北森/智鼎/SHL/赛码 题库 |
| 10 | 技术面试 | ✅ interview-master | CS-Notes / system-design-primer |
| 11 | 行为面试 | ✅ interview-master | behavioral_question_bank |
| 12 | 面试复盘 | ✅ interview-master | 失败案例库 |
| 13 | 谈薪 | ✅ interview-master | 薪资行情 + 谈判脚本 |
| 14 | Offer 决策 | ✅ interview-master | 多维度评估框架 |
| 15 | 入职准备 | ❌ 待建 | awesome-onboarding |
| 16 | 试用期生存 | ❌ 待建 | First 90 Days 框架 |

> **进度：12/16 已完成** — 从自我定位到Offer决策的核心链路已走通

## 目录结构

```
career-os/
├── README.md                    ← 你在这里
├── skills/                      # 操作层: WorkBuddy Skills
│   ├── general-recruit/         # ✅ 通用招聘 (步骤 4-7)
│   ├── interview-master/        # ✅ 面试全流程 (步骤 10-14)
│   ├── career-self-assessment/  # ❌ 自我定位 (步骤 1)
│   ├── career-industry-research/ # ❌ 行业调研 (步骤 2)
│   ├── career-learning-path/    # ❌ 学习路径 (步骤 3)
│   ├── career-company-check/    # ❌ 公司背调 (步骤 6)
│   ├── career-app-tracker/      # ❌ 投递管理 (步骤 8)
│   ├── career-assessment-prep/  # ❌ 笔试测评 (步骤 9)
│   ├── career-onboarding-prep/  # ❌ 入职准备 (步骤 15)
│   └── career-probation-survival/ # ❌ 试用期生存 (步骤 16)
│
├── knowledge/                   # 知识层: 参考库文档
│   ├── self-assessment/         # 自我认知框架
│   ├── industry-reports/        # 行业报告索引
│   ├── roadmaps/                # 学习路线图
│   ├── jd-templates/            # JD 解读模板
│   ├── company-check/           # 公司背调清单
│   ├── resume-templates/        # 简历模板
│   ├── assessment-banks/        # 笔试题库
│   ├── interview-banks/         # 面试题库
│   ├── salary-data/             # 薪资行情
│   ├── onboarding/              # 入职指南
│   └── survival/                # 试用期生存指南
│
├── config/                      # 数据层: 个人配置
│   └── profile.yml              # 求职画像
│
├── data/                        # 数据层: 投递数据
│   └── tracker.tsv              # 投递追踪表
│
├── templates/                   # 模板
│   └── cv-template.md           # 简历模板
│
└── docs/                        # 文档
    ├── architecture.md          # 系统架构
    └── how-to-use.md            # 使用指南
```

## 类似项目参考

| 项目 | Stars | 定位 | 与本系统差异 |
|------|-------|------|------------|
| **career-ops** | 48.9K | Claude Code 驱动的 AI 求职管线，含 14 个 skill mode | 西方市场为主，依赖 Claude Code |
| **本系统** | - | WorkBuddy 驱动的全流程中文求职 OS | 16 步完整覆盖 + 参考库独立管理 + 中文生态 |
