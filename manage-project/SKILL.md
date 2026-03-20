---
name: manage-project
description: Generic project management workflow: maintain project docs (requirements/status/todo), prioritize next steps, and safely sync AUTOGEN sections without overwriting hand-written content. Use when user asks for status/progress/next steps, or wants to sync project docs.
---

# Project Management (Generic)

这个 skill 的目标：**少猜测、可执行、可安全自动更新**。

## 何时使用（触发）

- `-start`：初始化上下文快照（仓库结构、git、TODO/FIXME、当前阶段）
- `-progress`：计算整体进度与关键缺口
- `-next`：根据任务结构化信息 + 评分体系，给出下一步任务序列（含依赖）
- `-update-status`：**只更新 AUTOGEN 区块**，不会覆盖你手写内容

自然语言触发：
- “项目现在什么状态/进度如何” → `-start` + `-progress`
- “接下来做什么/优先级怎么排” → `-next`
- “同步一下文档/更新状态” → `-update-status`

---

## 文件约定（推荐，但可渐进采用）

为了把“工作流（skill）”和“项目事实（project docs）”分离，建议仓库使用以下三件套（没有也不会阻塞，只是自动化能力会下降）：

- `project/requirements.md`：需求与范围（主要手写）
- `project/project-status.md`：项目状态总览（手写 + AUTOGEN）
- `project/todo.md`：任务清单（手写 + AUTOGEN，建议结构化）

本 skill 目录中：
- `REFERENCE.md`：优先级评分体系与推断规则
- `scripts/`：可执行脚本（扫描/快照/更新 AUTOGEN）

### AUTOGEN 安全区（可自动更新）

`-update-status`（或脚本 `update_autogen.py`）**只能**修改以下标记之间的内容，其他内容必须保留：

- `project/todo.md`：
  - `<!-- AUTOGEN:DISCOVERED_TASKS:START -->` … `<!-- AUTOGEN:DISCOVERED_TASKS:END -->`
- `project/project-status.md`：
  - `<!-- AUTOGEN:PROJECT_SNAPSHOT:START -->` … `<!-- AUTOGEN:PROJECT_SNAPSHOT:END -->`

---

## todo.md 的结构化任务格式（推荐）

为了让 `-next` 的排序更“确定”、更少主观，请尽量把任务写成下面格式（字段可逐步补全；`module` 按你的仓库自定义即可）：

```md
- [ ] (mp-001) Task title
  - module: backend | frontend | infra | docs | tests | <your-module>
  - status: planned | in_progress | blocked | done
  - deps: [mp-000]              # optional
  - acceptance: concrete acceptance criteria
  - scores:                    # optional: if you set them, they win
      impact: 0-10
      effort: 0-10
      risk: 0-10
      dependencies: 0-10
      urgency: 0-10
```

如果缺少 `scores`，则按 `REFERENCE.md` 的规则做推断，但会更不稳定。

---

## 可执行脚本（提升自动化）

脚本都在 `scripts/` 里：

- `scripts/scan_todos.py`：扫描仓库 TODO/FIXME（可配置 include/exclude）
- `scripts/git_snapshot.sh`：输出 git 快照
- `scripts/update_autogen.py`：更新 AUTOGEN 区块（缺少目标文件时会给出提示，不会硬报错）

运行示例（在仓库根目录执行）：

```bash
python3 .claude/skills/manage-project/scripts/update_autogen.py
```
