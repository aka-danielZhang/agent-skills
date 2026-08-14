# 仓库约定蒸馏（源：$DSH/AGENTS.md）

定位 `$DSH`（Harness checkout）的方法见 SKILL.md。以下是高频踩坑项的浓缩；完整与最新以 `$DSH/AGENTS.md` 为准。

## 包与模块

- 每个 npm 包名 `@deepseek-ai/dsh-<name>`；vendored 包 rescope 后 `private: true`；`@deepseek-ai/cordis` 是所有 harness 包的 peerDependency。
- 全 ESM（`"type": "module"`）。跨包引用用包名；包内相对导入用 `.ts`。
- Raw/Web `cordis.yml` 的 bare 插件名必须出现在对应 resolver manifest 的 `dependencies`（`verify-cordis-config` 强制）。

## 插件与注册

- **注册即 effect**：一切贡献走 `ctx.effect()` / `ctx.on()` / 返回 disposer 的 `register()`。
- **Plugins, not loop changes**：新行为上已文档化的扩展点；改 `agent-loop` 必须更新 `docs/architecture.md`。
- Capability seam 三角色齐全才是一个能力；角色要独立演化时才拆包。
- Waterfall 监听器必须调 `next()`。
- Typed events 用 declaration merging；Event JSDoc 带 `@mode` 和 payload `@param`；`SessionEventMap` 成员默认 required-on-read，结构性变更才 bump `SESSION_FORMAT_VERSION`。

## 类型与配置

- `strict: true` + `noImplicitAny`；残留 `any` 必须解释为何无法收窄。跨包导出带简洁 JSDoc（`verify-export-jsdoc`）。
- 判别联合 switch 收尾 `assertNever`（封闭）或文档化 default（可扩展）。
- 跨边界不透明 id 用 `Branded<B>`，不裸 `string`。
- 类型化同进程边界信任 TypeScript——不为静态接口要求的值加运行时校验/回退/敌意测试；只在 parser/config、队列、模型/工具 JSON、持久化/文件、worker、进程、wire 边界校验。
- 插件不硬编码 tunable：部署可变的值是带校验的 `Config` 字段，可从 cordis.yml 改。
- 配置错误在可自包含判断时 load 期报错，否则最早可解析点报错；绝不静默跳过缺失引用。

## 测试与验证

- CI 覆盖率门槛是 `pnpm run test:coverage`（非 `test`）。
- 非平凡的模型/产品用户可见行为变更，同 PR 加/更新 keyless 快照（`pnpm run test:snapshot`），走真实可运行示例的组装转录；包测试与 mock fixture 不能替代。fixture 须 macOS/Linux 双平台可重放；修 fixture，不改 normalizer。
- 按改动面选最小检查集，不默认全量（见 SKILL.md 验证表）。
- 工具的 UI 渲染意图（`generic`/`terminal`/`diff`/`locations`）是设计的一部分，提前决定；呈现方法是 args 的纯函数。

## 文档与提交

- 代码变更同步改受影响 README 与 JSDoc；文档门禁 `pnpm run doc-sync`；双语 pair 一起更新（`dsh-translate-docs` 仅显式用户调用）。
- 非平凡变更同 PR 带 Agent Note（`$DSH/.agents/notes/`）；archived note 是冻结历史，不是当前权威。
- TODO 三级：`FIXME`（阻塞发布）> `TODO`（尽快）> `XXX`（ someday）。
- 文件恰好一个尾换行（pre-commit 把关）。
- PR：一个 `kind/*`，全部实质 `area/*`；栈式 PR 用 `--force-with-lease` 不裸 `--force`。
- 根/子树 `CLAUDE.md` 是 `AGENTS.md` 的 symlink——编辑真身。

## 编辑 vendored 代码

`vendor/` 是 pinned 源码副本；改动必须伴随 `vendor/README.md` manifest 更新（guard 强制），走其 sync 流程。
