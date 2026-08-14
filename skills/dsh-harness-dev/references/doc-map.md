# 任务 → 文档地图

`$DSH` = `/Users/danielwei_zhang/workspace/coding-study/deepseek-harness`；下表路径相对 `$DSH/docs/`。中文版同名 `.zh.md`。

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
