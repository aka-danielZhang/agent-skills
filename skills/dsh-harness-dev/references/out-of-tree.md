# Out-of-tree 插件与组合机制

在 harness 仓库之外开发插件、安装插件、并把它们挂进 dsh 运行时的方式。教程源：`$DSH/docs/user/develop/`（basic/framework/practice）；组合机制源：`$DSH/docs/architecture.md` 的 Profiles and bundles；CLI 行为权威：`$DSH/apps/cli/reference/README.md`。定位 `$DSH`（Harness checkout）的方法见 SKILL.md。

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

## 安装插件（bundle → profile）

正式安装路径是 `dsh plugin` 命令族：插件作者把插件打成 **bundle**（npm 包 + `dsh.bundle` manifest），用户装进一个 **profile**。权威教程：`user/develop/basic/publish.md`。

### 两个概念、两个 manifest

| 概念 | 是什么 | manifest |
|---|---|---|
| **bundle** | 作者分发的东西：携带一个配置层的 npm 包 | `package.json` 里 `"dsh": { "bundle": { "patch": "./cordis.patch.yml" } }` |
| **profile** | 用户启动的东西：`$DSH_HOME/profiles/<name>/` 下的一次可运行组合 | `package.json` 里 `dsh.profile` 的有序 `bundles` 列表（由 `dsh plugin` 维护，不手写） |

没有 `dsh.bundle` 声明的包也能装，但只是普通依赖——`dsh plugin` 打一次警告、不激活任何层（适合做被插件 import 的库）。

### 安装、验证、卸载

```sh
dsh plugin --profile demo add ./hello-plugin        # 本地 checkout（add . 在插件目录 = 装当前目录）
dsh plugin --profile demo add github:you/hello-plugin#<sha>   # git host，建议 pin commit
dsh plugin --profile demo add your-package          # npm（发布时已带构建产物）
dsh plugin --profile demo add ./hello-plugin-0.1.0.tgz       # tarball（pnpm pack 产物）

dsh --profile demo --dump-config    # 不启动先看层：应出现 "# == dsh-hello-plugin"
dsh --profile demo                  # 启动

dsh plugin --profile demo remove dsh-hello-plugin  # 同时移除依赖与层
```

- `dsh plugin --profile <name> <args...>` 转发 pnpm verb（`add`/`remove`/`why`/`update`…），pnpm 必须在 PATH；profile 缺失时自动初始化（`web`/`headless` 用随包模板，其他名字以 `@deepseek-ai/dsh-base` 起步）。
- 每次成功运行后 `dsh.profile.bundles` 与已装状态对账：声明了 `dsh.bundle` 的依赖进层栈（`update` 后获得声明也会激活），无声明保持普通依赖，被移除的依赖退出层栈。
- `dsh web` 是 `--profile web` 的硬编码别名。

### git 安装的构建陷阱

git 安装拿到的是**源码不是构建产物**，没人替你跑 `build`：

- **作者侧**：包里要有 `prepare` 脚本（pnpm 在 git 安装后自动执行），自包含地从源码构建入口，不能假设 monorepo 邻居存在。参考实现：[turtle-ui](https://github.com/deepseek-harness/turtle-ui)。
- **用户侧**：pnpm ≥10 默认拒绝跑 git 依赖的 `prepare`，首次 `add` 会失败；把 pnpm 打印的包名 key 抄进 profile 的 `pnpm-workspace.yaml` 后重跑：

  ```yaml
  allowBuilds:
    dsh-hello-plugin: true
  ```

  **这个许可等于允许该包在你的机器上、安装时刻、沙箱之外执行其代码**——只对信任源的包放行，并 pin commit（`#<sha>`）防止上游后续推送悄悄改变执行内容。

- 不想向用户索要许可就走构建产物分发：npm 发布（`pnpm publish` 时构建）或 tarball（`pnpm pack`）——两者都无需任何 build 许可。

### 加载顺序（层叠）

有效配置在空根上按序叠加：

1. profile 的 `dsh.profile.bundles` 列表逐个 bundle patch（列表序，`@deepseek-ai/dsh-base` 恒为首层）；
2. profile 自己的 `cordis.patch.yml`；
3. home 级 `$DSH_HOME/cordis.patch.yml`（机器级偏好，所有 profile 共享）；
4. 各 `--patch <path>` overlay（按 argv 序）。

后层按行 id 胜出；patch **整体替换**行 config，不做深合并——覆盖一行必须重述该行全部字段。用户可在自己的 `cordis.patch.yml` 里覆盖 bundle 的行而不碰插件包。box 内 bundle 名（`@deepseek-ai/dsh-base` 等）永远从 dsh 安装本身解析。

## 临时挂载（不安装）

开发调试用 `--patch` overlay，一次有效（插件路径必须绝对路径）：

```yaml
# my-plugin/cordis.yml
- insert:
    - id: hello
      name: '/absolute/path/to/my-plugin/src/hello.ts'
```

```sh
cd $DSH && pnpm dsh web --patch /absolute/path/to/my-plugin/cordis.yml
```

| 方式 | 适用 |
|---|---|
| `--patch` overlay | 开发调试，一次有效 |
| `dsh plugin add`（上文） | 正式安装，持久 |
| agent preset（per-session） | 给一类 agent 会话定制：`${DSH_HOME:-~/.dsh}/.agent-presets/<id>/` 下 cordis.yml；服务发布行放 host 或 `isolate` realm |

看本机实际启动的插件树：`dsh --profile web --dump-config`——任何打印出来的行都可以被你自己的 patch 替换。

## 环境与验证

- 源码运行依赖 checkout 完成安装：`$DSH` 下 `pnpm install`（首次再 `pnpm run typecheck` 验证）。
- 源码启动：`cd $DSH && pnpm dsh web --patch ...`，开 `http://127.0.0.1:3080`。
- 改插件代码：注册皆 effect，HMR 自动生效；若同时改 `apps/web` 壳或普通 packages，需要重建受影响 Web 产物并刷新页面。
- cordis.yml 里允许 `!!js`（双叹号）表达式，仅限插件 `config` 与 entry 的 `disabled`；其他元数据保持字面量。
- keyless 学习路径：`$DSH/docs/cordis-tutorial/index.md` 在 `tmp/` 草稿目录跑 `node --import tsx ../../vendor/cordis/bin.js`，无需 API key。
