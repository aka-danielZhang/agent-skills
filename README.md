# agent-skills

个人 agent skill 仓库。每个 skill 是 `skills/<kebab-case-name>/SKILL.md`（可带同目录 references 资源），通过软链安装到 `~/.agents/skills/` 供 DSH（DeepSeek Harness）在任意会话、任意工作目录发现与加载。

## 安装

```sh
git clone <remote-url> ~/workspace/agent-skills
cd ~/workspace/agent-skills
./install.sh
```

`install.sh` 把 `skills/*` 逐个软链到 `~/.agents/skills/<name>`：已是指向本仓库的链接则跳过；同名但内容不同则告警跳过，不做覆盖。

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

## 新增 skill

1. 建目录 `skills/<name>/`，`<name>` 为 kebab-case（`^[a-z0-9]+(?:-[a-z0-9]+)*$`），与 frontmatter `name` 一致。
2. 写 `SKILL.md`，frontmatter 必填 `name`、`description`（目录展示上限 500 字符，写成触发词丰富的路由描述）；可选 `whenToUse`、`disable-model-invocation`、`user-invocable`。
3. 需要深度资料时放 `references/*.md`，在 SKILL.md 中相对引用并注明"按需读取"。
4. 跑 `./install.sh`，开新会话验证目录里出现该 skill。

## 收录

| Skill | 用途 |
|---|---|
| `dsh-harness-dev` | 在任意目录开发 DeepSeek Harness 插件：形态判别、out-of-tree 插件上手、扩展点地图、文档导航与仓库约定蒸馏 |
