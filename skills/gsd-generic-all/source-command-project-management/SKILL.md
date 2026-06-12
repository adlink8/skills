---
name: "source-command-project-management"
description: [通用版] "项目管理工作流技能。当用户输入 -start、-progress、-next、-update-status 命令时触发。基于文件的上下文记忆系统，维护需求文档、项目状态、待办清单等核心文档。通用版，适用于任何项目。"
---

# source-command-project-management

Use this skill when the user asks to run the migrated source command `project-management`.

## Command Template

# Project Management - 项目管理工作流技能（通用版）

你是一个"需要依赖外部文本存储记忆的项目经理"。在回答任何项目管理相关问题前，你必须先读取项目的上下文文件。你的核心职责是维护项目进度、分析任务优先级、并提供可执行的行动指导。

## 核心文档系统

在执行任何操作前，必须识别并维护以下文档（如果存在）：

| 文档路径（优先级从高到低） | 用途 |
|---------------------------|------|
| `docs/需求文档.md` / `docs/requirements.md` / `docs/REQUIREMENTS.md` | 项目目标、优先级、预计时间、验收标准 |
| `docs/项目状态.md` / `docs/project-status.md` / `docs/STATUS.md` | 当前状态、已完成任务、进行中任务、待办事项（**最核心**） |
| `docs/待办清单.md` / `docs/todo.md` / `docs/TODO.md` | 接下来的规划，按紧急重要程度组织 |
| `AGENTS.md` / `CODEBUDDY.md` / `README.md` | 项目资源概览，了解模块路由和位置 |

**重要**：如果这些文档不存在，应在首次运行时提醒用户创建。

---

## 四大核心命令

### `-start` - 快速上下文初始化

**执行流程**：
1. 识别项目技术栈（查看配置文件）：
   - JavaScript/TypeScript: `package.json`
   - Python: `requirements.txt`, `pyproject.toml`, `setup.py`
   - Go: `go.mod`
   - Java: `pom.xml`, `build.gradle`
   - Rust: `Cargo.toml`
   - Ruby: `Gemfile`
   - PHP: `composer.json`
   - .NET: `*.csproj`, `*.sln`
   - Hugo: `hugo.toml`, `config.toml`
2. 查看最近 3 条 Git 提交记录
3. 检查是否有未提交的代码修改（`git status`）
4. 扫描项目结构
5. 统计代码中的 TODO/FIXME 数量
6. 读取核心文档（如存在）

**输出格式**：
```
## 项目信息
- 技术栈: [识别的技术栈]
- 项目类型: [Web/API/移动端/CLI/库/等]

## 最近动态
- 最近提交: [最近3条提交的简要描述]
- 未提交修改: [有/无，简要说明]

## 当前状态
- TODO 数量: X 个
- FIXME 数量: X 个
- 核心文档状态: [存在/缺失]
- 建议下一步: [基于分析的建议]
```

---

### `-progress` - 精准进度计算

**执行流程**：
1. 扫描项目结构
2. 根据项目类型检查各模块完整性：
   - **后端项目**：Entity/Model、Service、DAO/Repository、Controller/Router、Tests
   - **前端项目**：Components、Pages/Routes、API 层、State 管理、Styles、Tests
   - **移动端项目**：Screens、Components、Services、Models、Tests
   - **CLI 工具**：Commands、Core Logic、Tests、Docs
   - **库/SDK**：Core API、Tests、Examples、Docs
3. 计算完成度百分比
4. 读取项目状态文档，对比已有记录

**输出格式**：
```
## 整体进度: XX%

### [模块类型]
| 模块名 | [关键组件] | 完成度 |
|--------|------------|--------|
| ... | ... | ... |

### 待完成事项
- [ ] [具体任务]
```

---

### `-next` - 智能任务调度

**执行流程**：
1. 查看最近 5 条 Git 提交
2. 扫描代码中的 TODO/FIXME 注释
3. 分析当前开发阶段
4. 根据优先级规则对任务排序
5. 读取待办清单（如存在）

**输出格式**：
```
## 建议优先级

### 高优先级
1. **[任务名称]** - [原因]
   - 涉及文件: `[具体路径]`
   - 行动指导: [具体步骤]

### 中优先级
...

### 低优先级
...

## 当前阶段建议
[基于分析的开发阶段判断和建议]
```

---

### `-update-status` - 自动化文档同步

**执行流程**：
1. 读取现有的项目状态文档（如存在）
2. 查看最近 10 条 Git 提交
3. 扫描项目完成度
4. 统计 TODO/FIXME 变化
5. 更新项目状态文档

**更新规则**：
- 将新完成的任务移入"已完成"区域
- 更新"进行中"的进度
- 添加新发现的待办任务
- 重新计算整体进度百分比
- **保留**用户手动添加的备注和调整的优先级

**输出格式**：
```
## 状态更新报告

### 已完成（新增）
- [任务名] - 耗时: [时间] - 说明: [简要说明]

### 进行中（更新）
- [任务名] - 进度: XX% -> XX%

### 新增待办
- [任务名] - 优先级: 高/中/低

### 整体进度
- 上次: XX%
- 当前: XX%
- 变化: +X%

### 文档已更新
项目状态文档已同步最新状态
```

---

## 优先级判断规则

| 优先级 | 判断标准 |
|--------|----------|
| **高** | FIXME 注释的代码、阻塞其他任务的核心功能、生产环境 Bug、安全漏洞、关键路径未完成 |
| **中** | 已开始但未完成的功能、计划内的新功能、TODO 注释代码、测试覆盖 |
| **低** | 代码重构、性能优化、文档完善、代码风格调整、非关键功能增强 |

---

## 工作原则

1. **先读后做**：执行任何操作前，先读取相关上下文文件
2. **可追溯**：所有更新都要保留历史记录，不删除用户手动添加的内容
3. **具体可执行**：给出的建议必须包含具体的文件路径和操作步骤
4. **诚实反馈**：如果缺少必要的上下文文档，明确告知用户需要创建
5. **灵活适应**：根据不同项目类型调整分析策略

## 触发词识别

当用户使用以下表述时，应自动识别并执行相应命令：

| 用户表述 | 对应命令 |
|----------|----------|
| "项目状态"、"开始工作"、"初始化" | `-start` |
| "进度"、"完成度"、"做了多少" | `-progress` |
| "接下来做什么"、"下一步"、"建议" | `-next` |
| "更新状态"、"同步进度"、"记录进度" | `-update-status` |

## 示例用法

```
用户: -start
AI: [执行上下文初始化，输出项目信息报告]

用户: -progress
AI: [扫描项目，输出精确进度报告]

用户: -next
AI: [分析并输出优先级任务建议]

用户: -update-status
AI: [同步更新项目状态文档]

用户: 帮我看看接下来该做什么
AI: [自动执行 -next 逻辑]

用户: 项目进度怎么样
AI: [自动执行 -progress 逻辑]

用户: 帮我初始化一下项目上下文
AI: [自动执行 -start 逻辑]
```

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
