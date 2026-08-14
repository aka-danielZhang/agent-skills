# Out-of-tree 插件与组合机制

在 harness 仓库之外开发插件、并把它们挂进 dsh 运行时的方式。教程源：`$DSH/docs/user/develop/`（basic/framework/practice）；组合机制源：`$DSH/docs/architecture.md` 的 Profiles and bundles。`$DSH` = `/Users/danielwei_zhang/workspace/coding-study/deepseek-harness`。

## 插件本质与形式

插件是导出 `apply(ctx)` 的模块，三种形式：

1. function：`export function apply(ctx) {}`（多数场景够用）
2. object：`export default { name, inject, apply(ctx) {} }`
3. class：`export default class extends Service`（要向其他插件提供服务时用；见 `user/develop/framework/service.md`）

要点：

- `inject: ['tools']` 声明强依赖，框架等所有必需服务就绪才加载；可选服务用 `ctx.get('x')` 并处理 `undefined`。
- 一切注册自动随卸载清理；显式资源用 `ctx.effect(() => disposer)`。
- 插件配置：定义 `Config` 类型 + schema 校验，从 cordis.yml 的 `config` 字段进来；不可硬编码 tunable，非法配置 fail loud（`user/develop/basic/config.md`）。
- 生命周期状态机 PENDING→LOADING→ACTIVE→…、HMR 行为：`user/develop/framework/index.md`。

## 挂载方式（层叠顺序）

运行中的 dsh 是有序层叠出的插件树，层序：profile 列出的 bundles → profile 的 `cordis.patch.yml` → home 级 patch → `--patch` overlay。patch 按 id 整行替换 config，或 insert 新行。

| 方式 | 适用 | 做法 |
|---|---|---|
| `--patch` overlay（一次性） | 开发调试 | `pnpm dsh web --patch /abs/path/my-plugin/cordis.yml`；插件路径写绝对路径 |
| profile patch（持久） | 每次启动都挂 | dsh home（`~/.dsh/profiles/<name>/`）下 profile + `cordis.patch.yml` |
| agent preset（per-session） | 给一类 agent 会话定制 | `${DSH_HOME:-~/.dsh}/.agent-presets/<id>/` 下 cordis.yml；服务发布行放 host 或 `isolate` realm |
| bundle（分发格式） | 打包给别人装 | package.json `dsh.bundle` 指向 patch 文件；`dsh --profile <name>` 叠加 |

看本机实际启动的插件树：`dsh --profile web --dump-config`——任何打印出来的行都可以被你自己的 patch 替换。

## 环境与验证

- out-of-tree 插件依赖 checkout 的 run-from-source：`$DSH` 下 `pnpm install`（首次再 `pnpm run typecheck` 验证）。
- 启动：`cd $DSH && pnpm dsh web --patch ...`，开 `http://127.0.0.1:3080`。
- 改插件代码：注册皆 effect，HMR 自动生效；若同时改 `apps/web` 壳或普通 packages，需要重建受影响 Web 产物并刷新页面。
- cordis.yml 里允许 `!!js`（双叹号）表达式，仅限插件 `config` 与 entry 的 `disabled`；其他元数据保持字面量。
- keyless 学习路径：`$DSH/docs/cordis-tutorial/index.md` 在 `tmp/` 草稿目录跑 `node --import tsx ../../vendor/cordis/bin.js`，无需 API key。
