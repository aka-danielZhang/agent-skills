# 任务 → 文档地图

所有路径相对 `$DSH/docs/`（定位 `$DSH` 见 SKILL.md），中文版同名 `.zh.md`。手工维护区只收高频入口；文末生成区是 docs 全量索引，由 `scripts/update-check.mjs` 维护——上游新增文档会自动出现在那里，手工表新增行请确保路径存在（脚本会校验并告警）。

## 改代码前

| 任务 | 文档 |
|---|---|
| 改 `packages/` 前的系统认知（组合、核心包、turn 流、seam、扩展点表） | `architecture.md` |
| Cordis 概念速览（五 ideas、dispatch modes、waterfall 语义、loader 配置） | `cordis-primer.md` |
| Cordis 动手教程（7 章，从零到接入 harness 服务，keyless） | `cordis-tutorial/index.md` |
| Cordis `ctx` 完整 API（框架继承层） | `cordis-api/context.md`、`cordis-api/inherited.md` |
| 术语（capability seam、agent-scope、loop hierarchy、Ralph…） | `glossary.md` |

## 加东西（cookbook，带编号验证步骤）

| 任务 | 文档 |
|---|---|
| 加一个 workspace 包（结构、root 配置注册、README/Model Experience 规范） | `cookbook/adding-a-package.md` |
| 写模型工具（execute 契约、长任务、执行策略与观测点选择、UI 渲染） | `cookbook/adding-a-tool.md` |
| 加 LLM adapter | `cookbook/adding-an-llm-adapter.md`、教程 `user/develop/practice/llm-adapter.md` |
| 加 Web Chat 会话节点 | `cookbook/adding-a-conversation-node.md` |
| 加 vendored 依赖包 | `cookbook/adding-a-vendored-package.md` |
| 扩展插件形态参考（hook/权限门、UI 插件、协议驱动、feature→mechanism 全表） | `cookbook/extension-cookbook.md` |
| 工具入门教程（产品视角） | `user/develop/basic/tool.md` |

## 深入某个子系统

- 索引：`subsystems/README.md`（每个子系统一页：类型定义 + 生成的 Cordis API 区）。
- 常用页：`subsystems/tools.md`（工具管线）、`subsystems/session.md`（SessionEventMap 全目录、`deriveMessages()`）、`subsystems/core.md`（agent loop、AgentHandle 契约）、`subsystems/extensions.md`（动态 Cordis 插件）、`subsystems/skills.md`（skill 发现与加载）。
- 生成目录（勿手改，从源码生成）：`tool-catalog.md`、`config-catalog.md`、`persistence-catalog.md`、`module-graph.md`。

## 事件与生命周期

| 任务 | 文档 |
|---|---|
| turn/step 顺序图与事件全景 | `agent-lifecycle.md` |
| 每个事件的生产者/消费者 | `event-producer-consumer.md` |
| 工具执行管线（guard/pre/post/result 怎么选） | `tool-execution-pipeline.md` |

## 流程与质量

| 任务 | 文档 |
|---|---|
| 环境搭建、tsconfig 双聚合、构建顺序、Git hooks、CI | `development.md` |
| 测试策略（分层、真实实现优先、快照何时必须） | `testing.md` |
| 生命周期/并发/子进程/teardown 的防御性模式 | `defensive-patterns.md` |
| 文档标准（分层、one home per fact、词数预算、i18n pairing） | `AGENTS.md`（docs 子树） |

<!-- BEGIN GENERATED:doc-index (scripts/update-check.mjs) — do not edit -->
上游：https://github.com/deepseek-ai/deepseek-harness @ 47f943859b（2026-08-13）；由 scripts/update-check.mjs 生成，勿手改本区。

### 顶层
- `AGENTS.md` — AGENTS.md — The documentation standard
- `agent-lifecycle.md` — Agent Turn And Step Lifecycle
- `api-gateway.md` — API Gateway
- `architecture.md` — DeepSeek Harness Architecture
- `capability-seams.md` — Capability Seams And Core Services
- `config-catalog.md` — Plugin Config Catalog
- `cordis-primer.md` — Cordis Primer
- `defensive-patterns.md` — Defensive patterns
- `development.md` — Development guide
- `event-producer-consumer.md` — Event Producer And Consumer Matrix
- `glossary.md` — Glossary
- `graph-atlas.md` — Documentation Graph Index
- `module-graph.md` — Module dependency graph
- `persistence-catalog.md` — Session Persistence Event Catalog
- `rescope.md` — Vendored package rescope
- `testing.md` — Testing policy
- `tool-catalog.md` — Tool Schema Catalog
- `tool-execution-pipeline.md` — Tool Execution Pipeline
- `web-styling.md` — Web UI style reference

### cookbook/
- `cookbook/adding-a-conversation-node.md` — Add a Web Client conversation node
- `cookbook/adding-a-package.md` — Cookbook: adding a workspace package
- `cookbook/adding-a-tool.md` — Tool authoring reference
- `cookbook/adding-a-vendored-package.md` — Cookbook: adding a vendored package
- `cookbook/adding-an-llm-adapter.md` — Cookbook: adding an LLM adapter
- `cookbook/extension-cookbook.md` — Cookbook: extension plugin shapes
- `cookbook/maintaining-dsh-code-review.md` — Maintaining the dsh-code-review skill
- `cookbook/responding-to-pr-review-on-a-stack.md` — Responding to review across a stacked PR chain

### cordis-api/
- `cordis-api/context.md` — Context
- `cordis-api/events.md` — Events
- `cordis-api/fiber.md` — Fiber
- `cordis-api/inherited.md` — Inherited Cordis API
- `cordis-api/registry.md` — Registry
- `cordis-api/service.md` — Service

### cordis-tutorial/
- `cordis-tutorial/01-first-plugin.md` — 1. Your first plugin
- `cordis-tutorial/02-lifecycle-and-effects.md` — 2. Lifecycle and effects
- `cordis-tutorial/03-services.md` — 3. Services
- `cordis-tutorial/04-events.md` — 4. Events
- `cordis-tutorial/05-config.md` — 5. Configuration
- `cordis-tutorial/06-composition-and-hmr.md` — 6. Composition and HMR
- `cordis-tutorial/07-into-the-harness.md` — 7. Into the harness
- `cordis-tutorial/index.md` — Cordis tutorial

### postmortem/
- `postmortem/0001-acp-default-export-drops-inject.md` — Post-mortem 0001: ACP server crashed on connect — `export default` dropped the plugin's `inject`
- `postmortem/0002-js-expression-disabled-filesystem-tools.md` — Post-mortem 0002: Filesystem snapshot tools were permanently disabled
- `postmortem/0003-web-agent-gui-feedback-loop.md` — Post-mortem 0003: Web agent validated a replacement server instead of its current GUI
- `postmortem/0004-landlock-partial-notice-misclassified-child-failures.md` — Post-mortem 0004: Landlock partial-enforcement notice misclassified child failures
- `postmortem/README.md` — Post-mortems

### subsystems/
- `subsystems/README.md` — Subsystems
- `subsystems/approval.md` — User Approval
- `subsystems/attachment.md` — Durable Image Attachments
- `subsystems/client-modules.md` — Client Modules
- `subsystems/code-runtime.md` — Code Runtime
- `subsystems/commands.md` — Human Commands
- `subsystems/compaction.md` — Compaction
- `subsystems/core.md` — Core
- `subsystems/credentials.md` — User Credentials
- `subsystems/extensions.md` — Extensions
- `subsystems/feedback.md` — Message Feedback
- `subsystems/filesystem.md` — Filesystem
- `subsystems/goal.md` — Same-session goals
- `subsystems/invariants.md` — Runtime Invariants
- `subsystems/jobs.md` — Background Task Runtime
- `subsystems/llm-streaming.md` — LLM Streaming
- `subsystems/lsp.md` — LSP navigation
- `subsystems/permission-presets.md` — Permission Presets
- `subsystems/persistence.md` — Session Persistence
- `subsystems/plan.md` — Plan Mode
- `subsystems/sandbox.md` — Process Sandbox
- `subsystems/schedule.md` — Session-local Schedule
- `subsystems/scope.md` — Scoped Registration
- `subsystems/session-projection.md` — Session Projections
- `subsystems/session-query.md` — Session Query
- `subsystems/session-reference.md` — Session References
- `subsystems/session-telemetry.md` — SessionTelemetryBackend
- `subsystems/session-title.md` — Session Titles
- `subsystems/session.md` — Sessions
- `subsystems/settings.md` — User Settings
- `subsystems/shell.md` — Bash Executor
- `subsystems/skills.md` — Skills
- `subsystems/spill.md` — Spill Storage
- `subsystems/storage.md` — Storage
- `subsystems/subagent.md` — Subagent
- `subsystems/subprocess.md` — Subprocess
- `subsystems/system-prompt.md` — System Prompt Assembly
- `subsystems/terminal.md` — Persistent PTY Sessions
- `subsystems/token-meter.md` — Token Meter
- `subsystems/tools.md` — Tools
- `subsystems/typert.md` — Typert remote calls
- `subsystems/user-questions.md` — User Interaction
- `subsystems/web-server.md` — HTTP Server
- `subsystems/web.md` — Web Access
- `subsystems/workflow.md` — Workflow
- `subsystems/workspace.md` — Workspaces

### user/
- `user/index.md` — DeepSeek Harness

### user/develop/basic/
- `user/develop/basic/config.md` — Plugin configuration
- `user/develop/basic/index.md` — Your first plugin
- `user/develop/basic/publish.md` — Package and install a plugin
- `user/develop/basic/tool.md` — Build a tool

### user/develop/framework/
- `user/develop/framework/events.md` — Event system
- `user/develop/framework/index.md` — Plugins and lifecycle
- `user/develop/framework/service.md` — Services and dependencies

### user/develop/practice/
- `user/develop/practice/index.md` — Three-role capability design
- `user/develop/practice/llm-adapter.md` — LLM adapters

### user/guide/
- `user/guide/index.md` — Use the Web UI
- `user/guide/providers.md` — Configure models
- `user/guide/python-sdk.md` — Get started with the Python SDK
<!-- END GENERATED:doc-index -->
