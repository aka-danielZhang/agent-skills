---
name: dsh-harness-dev
version: 1.2.0
description: Develop plugins for the DeepSeek Harness (DSH), the Cordis-based agent harness — in-repo packages (tools, services, events, UI), out-of-tree plugins mounted via cordis.yml/profile patches, and where each capability belongs. Use when the user mentions deepseek-harness, DSH, harness 插件, cordis.yml, ctx.tools/ctx.on/ctx.effect, @deepseek-ai/dsh-* packages, agent preset, adding a tool/service/package to the harness, or asks how the harness works while working outside its checkout.
whenToUse: 任何为 DeepSeek Harness 开发、调试、扩展插件或组合 agent preset 的工作；cwd 不在 harness 仓库内时尤其依赖本 skill 路由文档。
---

# 开发 DeepSeek Harness (DSH) 插件

## 定位 Harness checkout

本 skill 依赖一个 DeepSeek Harness 源码 checkout 作为权威文档来源，按以下顺序定位（下称 `$DSH`）：

1. 环境变量 `DSH_CHECKOUT`；
2. `~/workspace/coding-study/deepseek-harness`。

验证标准：`$DSH/docs/architecture.md` 存在。两处都没有时，向用户询问 checkout 位置，或建议 `git clone https://github.com/deepseek-ai/deepseek-harness`。本文档路径均相对 `$DSH/docs/`，中文版同名 `.zh.md`。docs 是权威来源，本 skill 是导航与蒸馏；冲突时以 docs 和源码为准。

## 第一步：判断开发形态

| 用户想要 | 形态 | 做法 |
|---|---|---|
| 改 harness 本体：新增/修改 `packages/` 下的包（工具、服务、事件、UI、adapter） | 仓库内开发 | 切到 `$DSH` 工作，先读 `$DSH/AGENTS.md` 与 `architecture.md`；按 `references/doc-map.md` 选文档 |
| 在独立目录写插件，挂到 dsh 运行时（Web UI / headless） | out-of-tree 插件 | 见下方快速上手与 `references/out-of-tree.md`；教程在 `user/develop/` |
| 把现成插件装进自己的 dsh（安装 / 卸载 / 升级 / 分发） | 插件安装 | `dsh plugin --profile <name> add ...` 一族命令，见 `references/out-of-tree.md` 的「安装插件」节；权威教程 `user/develop/basic/publish.md` |
| 只在当前会话临时扩展运行时（会话里有 `cordis_define` 等工具时） | 动态 Cordis 插件 | 优先加载 `cordis-plugin-development` skill（若在目录中），它专门覆盖动态插件 |
| 组合一个 per-session 的 agent preset | preset | 目录 `${DSH_HOME:-~/.dsh}/.agent-presets/<id>/`，载入 `editing-cordis-compositions` skill（若在目录中） |

## 心智模型（写代码前必懂）

1. **一切皆插件**：模型 adapter、工具注册表、会话日志、agent loop 本身都是 Cordis 插件。没有特权核心可打补丁——扩展 = 在旁边挂一个插件；卸载时注册自动回滚。
2. **Capability seam 三角色**：Service Definition（声明接口）+ Service Provider（实现）+ Consumer（使用，通常是模型工具）。加能力必须三角色齐全，单独一个角色不是一个 seam。
3. **事件是扩展点**：session 事件（durable，落日志）、`agent/*` 事件（live Agent）、capability 事件（`fs/*`、`tools/*` 等）。Waterfall 监听器必须调用 `next()` 委托，否则短路整条链。
4. **注册即 effect**：`ctx.on()`、`ctx.effect()`、各 registry 的 `register()`（返回 disposer）。所有副作用可逆，HMR 免费获得。
5. **Model-visible ⟺ logged**：到达模型请求的任何输入必须能从会话日志重建；新的模型可见输入需要新的 session 事件（扩展 `SessionEventMap`）。

## 新行为放哪（高频行；完整表见 `architecture.md` 的 "Where new behavior goes"）

| 目标 | 机制 |
|---|---|
| 加模型可见能力（工具） | `ctx.tools.register()`，schema 自动进 prompt 组装 |
| 加模型 provider | 在 `ctx.llm` 上注册 `LlmAdapter`（`registerAdapter`） |
| 拦截请求/工具/回合 | 对应 `agent/*` 或 `tools/*` 事件；`agent/turn-stopping` 停回合 |
| 注入模型上下文 | `agent.inject()`，落在下一个被接纳的请求 |
| 给某会话不同能力集 | 组合 agent preset（服务行需 `isolate` realm） |
| 加人类命令（不经模型） | `ctx.commands` |
| 加后台工作 | `ctx.jobs`；`job_*` 工具收集/停止 |
| 加 durable 会话状态 | 扩展 `SessionEventMap`，从日志渲染与重放 |
| 加 Web Chat 业务节点 | 注册 `ConversationNodeDefinition` + keyed renderer |

Hook 形态（权限门）、UI 插件、协议驱动、feature→mechanism 全表：`cookbook/extension-cookbook.md`。

## 快速上手：out-of-tree 最小插件（在独立目录时从这里开始）

插件就是一个导出 `apply(ctx)` 的 TS/JS 模块（依赖 `$DSH` 已 `pnpm install`，运行从源码走）：

```ts
// my-plugin/src/hello.ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'hello-plugin'
export const inject = ['tools'] // 强依赖：等 services 就绪才加载；可选服务用 ctx.get('x')

export function apply(ctx: Context) {
  ctx.effect(() => {
    const timer = setInterval(() => console.log('heartbeat'), 5000)
    return () => clearInterval(timer) // 卸载时清理
  })
}
```

用 patch overlay 挂载（插件路径必须绝对路径）：

```yaml
# my-plugin/cordis.yml
- insert:
    - id: hello
      name: '/absolute/path/to/my-plugin/src/hello.ts'
```

```sh
cd $DSH && pnpm dsh web --patch /absolute/path/to/my-plugin/cordis.yml
# 打开 http://127.0.0.1:3080；配置类型/schema/组合层叠详见 references/out-of-tree.md
```

三种插件形式（function / object / class）、Config 定义、HMR 行为：`user/develop/basic/index.md` 与 `user/develop/basic/config.md`。

## 仓库内开发：必读与验证

- `$DSH/AGENTS.md`：约定总纲（命令、命名、事件、测试、PR 流程）。
- `architecture.md`：改 `packages/` 前必读（组合层、核心包、turn 流、seam、扩展点表）。
- `pnpm run typecheck` 通过是最低门槛；按改动面选**最小**检查集：

| 改动面 | 检查 |
|---|---|
| 行为/逻辑 | 聚焦的 vitest 测试 |
| 模型或用户可见输出 | `pnpm run test:snapshot`（keyless 快照） |
| 文档 | `pnpm run doc-sync` |
| 发布路径/包结构 | `pnpm run build` + `pnpm run hygiene` |

不要默认跑全量套件；CI 负责穷尽覆盖。非平凡变更同 PR 必须带 Agent Note（`$DSH/.agents/notes/`）。完整约定蒸馏见 `references/conventions.md`。

## 按需读取（相对本 skill 目录）

- `references/doc-map.md` — 任务→文档地图 + 自动生成的文档全量索引（生成区勿手改）。
- `references/conventions.md` — 仓库约定蒸馏：命名、ESM、effects、typed events、测试策略、PR 规则。
- `references/out-of-tree.md` — out-of-tree 插件与组合机制：profile/bundle/patch 层叠、preset、配置校验。
- `upstream-state.json` — 上游同步状态：记录本 skill 蒸馏自哪个 harness 提交、各文档内容指纹。

本 skill 由仓库根的 `scripts/update-check.mjs` 定期对照 `$DSH` docs 重生成索引并检测漂移。Cordis 基础不熟时：概念速览 `cordis-primer.md`；动手教程 `cordis-tutorial/index.md`（7 章，keyless）；ctx API 参考 `cordis-api/context.md` 与各子系统页的 Cordis API 区。
