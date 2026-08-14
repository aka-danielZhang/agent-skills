# agent-skills

开源 agent skill 仓库。每个 skill 是 `skills/<kebab-case-name>/SKILL.md`（可带同目录 `references/` 资源），拷贝安装到 `~/.agents/skills/` 供 DSH（DeepSeek Harness）在任意会话、任意工作目录发现与加载。核心 skill `dsh-harness-dev` 蒸馏自 DeepSeek Harness 的官方文档，并带自动同步管线保持与上游一致。

## 安装

```sh
git clone https://github.com/aka-danielZhang/agent-skills.git ~/workspace/agent-skills
cd ~/workspace/agent-skills
./install.sh            # 拷贝 skills/* 到 ~/.agents/skills/（重装用 --force）
```

skill 内容定位 Harness checkout 的顺序：环境变量 `DSH_CHECKOUT` → `~/workspace/coding-study/deepseek-harness`。开源使用时建议：

```sh
git clone https://github.com/deepseek-ai/deepseek-harness ~/workspace/deepseek-harness
export DSH_CHECKOUT=~/workspace/deepseek-harness   # 可写进 shell rc
```

更新已安装的 skill：`git pull && ./install.sh --force`。

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

本仓库使用 rank 500（用户级）：任何项目、任何会话都生效。权威说明见 harness 仓库 `docs/subsystems/skills.md`。

## 上游文档同步管线

`dsh-harness-dev` 的价值取决于是否跟上 harness docs 的演进，三层保障：

```sh
node scripts/update-check.mjs        # 手动：同步一次（见下）
./scripts/install-cron.sh            # 本机：每日 09:30 自动同步（LaunchAgent/crontab）
./scripts/install-cron.sh --uninstall
```

推到 GitHub 后，`.github/workflows/update-check.yml` 每日 UTC 02:00 兜底跑一次（不依赖本机开机）。

`update-check.mjs` 每次运行：

1. 定位 checkout（`DSH_CHECKOUT` → 缺省路径）。
2. 清点 `docs/` 全部非中文 Markdown，逐文件 sha256 指纹。
3. 与 `skills/dsh-harness-dev/upstream-state.json` 对比：新增 / 修改 / 删除。
4. 重生成 `references/doc-map.md` 的 `GENERATED:doc-index` 区（全量索引，含上游提交号）。
5. 校验手工维护表引用的文档路径仍存在；缺失则告警并以退出码 2 结束（需人工修订）。
6. 有实际变化时 bump SKILL.md 的 `version` patch 段并自动提交（`--no-commit` 跳过提交，CI 用）。

注意：脚本只保证**索引与引用**不腐化；`references/conventions.md` 等蒸馏内容需要人工复核——指纹检测到对应上游文档变化时，review 自动提交的 diff 即可。

## 新增 skill

1. 建目录 `skills/<name>/`，`<name>` 为 kebab-case（`^[a-z0-9]+(?:-[a-z0-9]+)*$`），与 frontmatter `name` 一致。
2. 写 `SKILL.md`，frontmatter 必填 `name`、`description`（目录展示上限 500 字符，写成触发词丰富的路由描述）；可选 `whenToUse`、`version`、`disable-model-invocation`、`user-invocable`。
3. 需要深度资料时放 `references/*.md`，在 SKILL.md 中相对引用并注明"按需读取"；从上游蒸馏的内容放 `upstream-state.json` 记录指纹，接入 `scripts/update-check.mjs`。
4. 跑 `./install.sh`，开新会话验证目录里出现该 skill。

## 收录

| Skill | 用途 |
|---|---|
| `dsh-harness-dev` | 在任意目录开发 DeepSeek Harness 插件：形态判别、out-of-tree 插件上手、扩展点地图、文档导航与仓库约定蒸馏 |

## License

MIT（见 [LICENSE](LICENSE)）。蒸馏内容的权威来源是 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 仓库及其文档的原始许可。
