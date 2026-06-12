# GSD Skills — Generic Version

通用版 GSD 技能套件。87 个技能全部可用，支持任意 AI 运行时。

## 核心改进

**原版问题：**
- 所有技能硬编码 `$HOME/.Codex/` 路径
- `gsd-sdk query` 和 `gsd-tools.cjs` 只能在 Codex 内使用
- 无法在其他 AI 工具（WorkBuddy、Claude Code、Cursor、Aider）上运行

**通用版解决方案：**
1. 提供通用版 `gsd-sdk` 和 `gsd-tools` CLI（纯 Node.js，只操作 `.planning/` 目录）
2. 87 个技能保留原始 `gsd-sdk query` / `gsd-tools` 调用不变
3. 只替换 `$HOME/.Codex` 硬编码路径为相对路径
4. 新增 Agent Documentation Architecture，让 GSD 项目演进、模块 README、代码地图、结构化情报、知识图谱、代码与测试形成稳定的总分协作结构

## 安装

### 1. 确保 Node.js 可用
```bash
node --version  # 需要 v18+
```

### 2. 把通用 SDK 加到 PATH
```bash
# Bash/Zsh
export PATH="$PATH:/path/to/gsd-generic-all/bin"

# Windows PowerShell
$env:PATH += ";C:\path\to\gsd-generic-all\bin"

# 永久配置：加到 ~/.bashrc 或 ~/.zshrc
```

### 3. 验证安装
```bash
gsd-sdk --version    # gsd-sdk-generic 1.0.0
gsd-tools --version  # gsd-tools-generic 1.0.0
```

## 使用

### WorkBuddy
把技能目录复制到 WorkBuddy skills 目录：
```bash
cp -r gsd-generic-all/* ~/.workbuddy/skills/
```

### Claude Code
把任意 `SKILL.md` 复制为项目根目录的 `CLAUDE.md`：
```bash
cp gsd-generic-all/gsd-do/SKILL.md ./CLAUDE.md
```

### Cursor
把内容粘贴到 `.cursorrules` 文件。

### Aider
把内容保存为 `.aider-prompt`。

## Agent Documentation Architecture

本套件现在支持一套面向多 Agent 协作的项目文档架构：

```text
README.md                 = 对外项目总览
.planning/                = GSD 项目控制层
.planning/codebase/       = 代码库地图
.planning/intel/          = 结构化代码情报
.planning/graphs/         = 项目知识图谱
module README.md          = 模块边界和局部说明
source code               = 实现事实
tests + CI + UAT          = 验证事实
```

核心规则：

```text
GSD 管演进
模块 README 管边界
代码管实现
测试/CI/UAT 管真假
Intel/Graph 管可查询
Docs Audit 防漂移
```

### 新增 references

```text
references/agent-doc-architecture.md
references/doc-authority-order.md
references/module-readme-protocol.md
references/project-reading-order.md
references/documentation-sync-rules.md
```

### 新增 templates

```text
templates/module-readme-template.md
templates/project-doc-map-template.md
templates/doc-audit-report-template.md
templates/agent-handoff-template.md
```

### 新增 skill

```text
gsd-docs-audit/SKILL.md
```

用于审计 `.planning/`、模块 README、代码、测试之间是否一致，输出：

```text
.planning/docs-audit/DOC-AUDIT.md
.planning/docs-audit/README-DRIFT.md
.planning/docs-audit/MISSING-MODULE-READMES.md
.planning/docs-audit/DOC-SYNC-TODO.md
```

### 推荐工作流

```bash
/gsd-map-codebase
/gsd-intel refresh
/gsd-docs-audit
/gsd-plan-phase <phase> --prd <file>
/gsd-review --phase <phase> --all
/gsd-execute-phase <phase> --wave 1 --interactive
/gsd-verify-work <phase>
/gsd-graphify build
```

## SDK 支持的命令

### gsd-sdk query
- `commit <message>` — git commit
- `resolve-model <agent>` — 解析模型配置
- `generate-slug <text>` — 生成 URL slug
- `config-get <key>` — 读取 .planning/config.json
- `config-set <key> <value>` — 设置 config
- `state.load` — 读取 STATE.md
- `frontmatter.get <file> [--field k]` — 读取 frontmatter
- `frontmatter.set <file> --field k --value v` — 修改 frontmatter
- `<namespace>.<cmd>` — 通用命名空间命令（todos.list, roadmap.get 等）

### gsd-tools
- `graphify` — 构建 CODEBASE-INDEX.md
- `config-set <key> <value>` — 设置 config

## 验证

```bash
# 确认 87 个技能中无 Codex 路径残留
for f in gsd-generic-all/*/SKILL.md; do
  grep -q '$HOME/.Codex' "$f" && echo "FAIL: $(dirname $f)"
done

# 确认 gsd-sdk 调用已保留
grep -c 'gsd-sdk query' gsd-generic-all/gsd-debug/SKILL.md
# => 4
```

## 文件结构

```
gsd-generic-all/
├── bin/
│   ├── gsd-sdk      # 通用版 gsd-sdk CLI
│   └── gsd-tools    # 通用版 gsd-tools CLI
├── references/      # Agent 文档架构协议
├── templates/       # 模块 README / 文档审计 / 交接模板
├── anki/SKILL.md
├── gsd-add-backlog/SKILL.md
├── gsd-debug/SKILL.md
├── gsd-docs-audit/SKILL.md
├── gsd-do/SKILL.md
├── gsd-execute-phase/SKILL.md
├── gsd-graphify/SKILL.md
├── gsd-intel/SKILL.md
├── gsd-map-codebase/SKILL.md
├── gsd-plan-phase/SKILL.md
├── ... (共 87+ 个技能)
└── README.md
```

## 与原版对比

| 维度 | 原版 (Codex) | 通用版 |
|------|-------------|--------|
| 路径依赖 | `$HOME/.Codex/get-shit-done/` | 相对 `.planning/` |
| SDK 依赖 | Codex 内置 gsd-sdk | 通用 Node.js CLI |
| 运行时 | 仅 Codex | WorkBuddy / Codex / Claude Code / Cursor / Aider |
| 技能文件 | 原始 | 保留原始 gsd-sdk 调用，只改路径 |
| 项目文档架构 | 未统一 | GSD + 模块 README + codebase/intel/graph + docs audit |

## 许可证

遵循原始 GSD 项目的开源许可。
