# Issue: 完善 gsd-generic-all Agent 文档架构集成与验证

> GitHub Issues was disabled when this record was created. This file is a repository-local issue record and can be copied into GitHub Issues after Issues are enabled.

## 背景

已完成 `gsd-generic-all` 的一、二阶段改造：加入 Agent Documentation Architecture，让 GSD skills 能配合“GSD 总控 + 模块 README + codebase/intel/graph + tests/CI/UAT”的总分结构使用。

核心原则：

```text
GSD 管演进
模块 README 管边界
代码管实现
测试/CI/UAT 管真假
Intel/Graph 管可查询
Docs Audit 防漂移
```

## 已完成

### Phase 1 · 公共协议与核心入口接入

- [x] 新增 `references/agent-doc-architecture.md`
- [x] 新增 `references/doc-authority-order.md`
- [x] 新增 `references/module-readme-protocol.md`
- [x] 新增 `references/project-reading-order.md`
- [x] 新增 `references/documentation-sync-rules.md`
- [x] 新增 `templates/module-readme-template.md`
- [x] 新增 `templates/project-doc-map-template.md`
- [x] 新增 `templates/doc-audit-report-template.md`
- [x] 新增 `templates/agent-handoff-template.md`
- [x] 更新 `gsd-do`，加入项目级 / 模块级请求分类与文档权威顺序
- [x] 更新 `gsd-new-project`，初始化时引入 Agent 文档协议
- [x] 更新 `gsd-plan-phase`，规划时要求记录文档输入和文档同步要求
- [x] 更新 `gsd-execute-phase`，执行时要求读取模块 README，并在行为/API/测试变化后同步文档

### Phase 2 · 审计、验证、情报与图谱接入

- [x] 更新 `gsd-map-codebase`，加入 `DOC-COVERAGE.md` / `README-DRIFT.md` 产物设计
- [x] 更新 `gsd-review`，加入文档架构审查标准
- [x] 更新 `gsd-verify-work`，加入文档同步 UAT 检查
- [x] 更新 `gsd-intel`，加入 `doc-map.json` / `module-boundaries.json`
- [x] 更新 `gsd-graphify`，要求包含文档、模块、API、测试、验证等节点
- [x] 新增 `gsd-docs-audit/SKILL.md`
- [x] 更新 `README.md`，记录 Agent Documentation Architecture

## 后续待办

### 验证类

- [ ] 在真实项目中执行一次 `/gsd-map-codebase`，确认 `DOC-COVERAGE.md` 和 `README-DRIFT.md` 能落地
- [ ] 在真实项目中执行一次 `/gsd-docs-audit`，验证输出：
  - `.planning/docs-audit/DOC-AUDIT.md`
  - `.planning/docs-audit/README-DRIFT.md`
  - `.planning/docs-audit/MISSING-MODULE-READMES.md`
  - `.planning/docs-audit/DOC-SYNC-TODO.md`
- [ ] 在 NovelMind 上跑一次完整流程：
  - `/gsd-map-codebase`
  - `/gsd-intel refresh`
  - `/gsd-docs-audit`
  - `/gsd-plan-phase 3 --prd <file>`
  - `/gsd-execute-phase 3 --wave 1 --interactive`

### CLI 一致性

- [ ] 检查 README 中的 `gsd-sdk` / `gsd-tools` 与 skill 内部的 `gsd-sdk-gen` / `gsd-tools-gen` 命名是否一致
- [ ] 如果 bin 目录实际命令名不同，补软链接说明或统一命名

### Workflow 深化

- [ ] 检查 `.planning/workflows/*.md` 是否也需要直接接入 `agent-doc-architecture.md`
- [ ] 为 `gsd-docs-audit` 增加更明确的 workflow 文档
- [ ] 为 `gsd-map-codebase` 增加 docs-audit 子流程说明

### Intel / Graph 后续增强

- [ ] 验证 `doc-map.json` 与 `module-boundaries.json` 是否需要 SDK handler 支持
- [ ] 验证 graphify 是否能实际包含 Document / Module / APIEndpoint / TestFile / Verification 节点
- [ ] 如果 graphify 当前不支持这些节点，新增 post-processing 方案

## 验收标准

- [ ] NovelMind 项目能按新文档架构完成一次完整 GSD 规划与执行
- [ ] 模块 README、`.planning/STATE.md`、`.planning/codebase/`、`.planning/intel/` 不互相冲突
- [ ] Agent 能区分项目级任务和模块级任务
- [ ] 文档漂移能被 `gsd-docs-audit` 检出
- [ ] 修改代码后，相关模块 README 能被同步或生成明确 TODO
