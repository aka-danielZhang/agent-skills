# agent-skills

开源 agent skill 仓库，收录可安装到 [DSH（DeepSeek Harness）](https://github.com/deepseek-ai/deepseek-harness)的个人 skill。每个 skill 是一个 `skills/<name>/SKILL.md` 目录（可附 `references/` 深度资料），安装后 DSH 在任意会话、任意工作目录都能发现并加载。

收录两个 skill：

- `dsh-harness-dev`：DeepSeek Harness 官方文档的导航与蒸馏，让 agent 在 harness 仓库之外也知道怎么开发 harness 插件，并带自动同步管线保持与上游文档一致。
- `spec-driven-repo-init`：把 harness 的 spec-driven 文档模式（AGENTS.md 为根、CLAUDE.md 软链、docs 分层、决策记录）沉淀为任意仓库的初始化流程与模板。

## 快速开始

```sh
git clone https://github.com/aka-danielZhang/agent-skills.git ~/workspace/agent-skills
cd ~/workspace/agent-skills
./install.sh          # 拷贝 skills/* 到 ~/.agents/skills/
```

开一个新会话，skill 目录里应出现 `dsh-harness-dev`。之后更新 skill：

```sh
cd ~/workspace/agent-skills && git pull && ./install.sh --force
```

## 前置条件：Harness 源码检出

`dsh-harness-dev` 不复制文档正文，所有细节都指向一个 DeepSeek Harness 源码检出（下称 checkout）里的 `docs/`。因此使用前需要本机有一份 checkout，skill 按以下顺序定位：

1. 环境变量 `DSH_CHECKOUT` 指向的目录；
2. 默认路径 `~/workspace/coding-study/deepseek-harness`。

两者都找不到时，skill 会提示补充位置或 clone 官方仓库。全新环境推荐：

```sh
git clone https://github.com/deepseek-ai/deepseek-harness.git ~/workspace/deepseek-harness
echo 'export DSH_CHECKOUT="$HOME/workspace/deepseek-harness"' >> ~/.zshrc   # 按所用 shell 调整
```

## 发现机制

DSH 按以下顺序扫描 skill 根目录（rank 小者优先，重名取最近层）：

| Rank | 来源 | 根目录 |
|---|---|---|
| 100 | project-dsh | `<projectRoot>/.dsh/skills` |
| 200 | project-agents | `<projectRoot>/.agents/skills` |
| 300 | custom | settings.yaml 的 `customSkillDirs` |
| 400 | user-dsh | `~/.dsh/skills` |
| 500 | user-agents | `~/.agents/skills` |
| 600 | bundled | 部署方配置的随包目录 |

本仓库安装在 rank 500（用户级）：任何项目、任何会话都生效。权威说明见 harness 仓库 `docs/subsystems/skills.md`。

## 上游文档同步管线

`dsh-harness-dev` 必须跟上 harness docs 的演进，否则导航会逐渐失效。三层保障：

```sh
node scripts/update-check.mjs        # 手动同步一次
./scripts/install-cron.sh            # 本机定时：每日 09:30（macOS LaunchAgent / 其他平台 crontab）
./scripts/install-cron.sh --uninstall
```

GitHub Actions（`.github/workflows/update-check.yml`）每日 UTC 02:00 再兜底跑一次，不依赖本机开机；上游 docs 有变化时以 CI 的提交为准，本地 `git pull` 即可获得。

`update-check.mjs` 每次运行：

1. 定位 checkout（`DSH_CHECKOUT` → 默认路径）。
2. **脏树保护**：checkout 的 `docs/` 有未提交 `.md` 变更时跳过同步并退出码 3——否则会把 WIP 当成上游记录，与 CI 的干净 clone 同步互相覆盖；确认要同步 WIP 时用 `--allow-dirty`。
3. 清点 `docs/` 全部非中文 Markdown，逐文件 sha256 指纹。
4. 与 `skills/dsh-harness-dev/upstream-state.json` 对比：新增 / 修改 / 删除。
5. 重生成 `references/doc-map.md` 的 `GENERATED:doc-index` 区（全量索引，含上游提交号）。
6. 校验手工维护表引用的文档路径仍存在；缺失则告警并以退出码 2 结束（需人工修订）。
7. 有实际变化时 bump SKILL.md 的 `version` patch 段并自动提交（`--no-commit` 跳过提交，CI 用）。

退出码：`0` 干净 / `2` 引用缺失，需人工修表 / `3` 脏树跳过 / `1` 错误。

边界说明：脚本保证**索引与引用**不腐化；`references/conventions.md` 等蒸馏内容无法机械更新，上游对应文档的指纹变化时，review 自动提交的 diff 并人工跟进即可。

## 新增 skill

1. 建目录 `skills/<name>/`，`<name>` 为 kebab-case（`^[a-z0-9]+(?:-[a-z0-9]+)*$`），与 frontmatter `name` 一致。
2. 写 `SKILL.md`：frontmatter 必填 `name`、`description`（目录展示上限 500 字符，写成触发词丰富的路由描述）；可选 `whenToUse`、`version`、`disable-model-invocation`、`user-invocable`。
3. 深度资料放 `references/*.md`，在 SKILL.md 中相对引用并注明"按需读取"；从上游蒸馏的内容用 `upstream-state.json` 记录指纹并接入 `scripts/update-check.mjs`。
4. 跑 `./install.sh`，开新会话验证目录里出现该 skill。

## 收录

| Skill | 用途 |
|---|---|
| `dsh-harness-dev` | 在任意目录开发 DeepSeek Harness 插件：形态判别、out-of-tree 插件上手、扩展点地图、文档导航与仓库约定蒸馏 |
| `spec-driven-repo-init` | 为任意仓库初始化 spec-driven 文档体系：根 AGENTS.md、CLAUDE.md 软链、docs 分层与索引关系、开发时的文档义务矩阵、可直接套用的模板 |

## License

MIT（见 [LICENSE](LICENSE)）。蒸馏内容的权威来源是 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 仓库及其文档的原始许可。
