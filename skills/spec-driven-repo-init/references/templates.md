# 模板与骨架

`spec-driven-repo-init` 的可复制模板。占位符用 `<尖括号>` 标出，按仓库实情替换；删掉用不到的节，不要留空架子。

## 目标目录树

```
<repo>/
├── AGENTS.md            # 根 standing orders（真实文件）
├── CLAUDE.md            # -> AGENTS.md 的符号链接
├── README.md            # 给人的第一印象，链到 AGENTS.md 与 docs/
├── docs/
│   ├── AGENTS.md        # 文档标准：分层表、写作规则、预算
│   ├── architecture.md  # 有序地图：改核心代码前必读
│   ├── development.md   # 贡献者搭建与日常开发流
│   ├── cookbook/        # 编号步骤 how-to
│   └── postmortem/      # 事故复盘（有事故再建）
├── .agents/
│   ├── notes/           # 决策记录：路径即索引
│   │   ├── README.md    #   格式定义 + 何时写
│   │   ├── proposed/
│   │   ├── implemented/
│   │   └── rejected/
│   └── skills/          # 仓库级可复用工作流（可选）
└── <关键子树>/
    ├── AGENTS.md        # 仅该子树特有的规则
    └── CLAUDE.md        # -> AGENTS.md 软链（如需要）
```

## 根 AGENTS.md 骨架

```markdown
# AGENTS.md

<一句话：这个项目是什么>。<改代码前必读的文档，如：改 `src/core/` 前必读 [docs/architecture.md](docs/architecture.md)>。文档怎么写见 [docs/AGENTS.md](docs/AGENTS.md)。

## 仓库布局

\```
src/           <职责一句话>
docs/          architecture、决策索引、复盘、cookbook
.agents/notes/ 决策记录（见 .agents/notes/README.md）
\```

## 命令

\```sh
<包管理器> install
<测试命令>
<lint 命令>
<构建命令>
\```

## 约定

- <每条规则 1–3 行；有详情的链接到它的家，如 [docs/architecture.md](docs/architecture.md) 或某篇决策记录>
- 文档义务见下节。

## 文档义务

代码变更的同 PR 文档义务（完整矩阵见 [docs/AGENTS.md](docs/AGENTS.md)）：

- 改模块行为 → 更新该模块 README 与相关注释；
- 非平凡变更 → 同 PR 带一篇 `.agents/notes/` 决策记录；
- 改架构/模块关系 → 更新 [docs/architecture.md](docs/architecture.md)。

## 编辑本文件

`CLAUDE.md` 是 `AGENTS.md` 的符号链接（根目录与关键子树同）；编辑真实文件，不要编辑软链。
```

## 子树 AGENTS.md 骨架

```markdown
# <子树路径> AGENTS.md

<只放这个子树特有的规则；根 AGENTS.md 已有的仓库级规则一律不重复。>

- <规则，链接到子树内的拥有文档>
```

## docs/AGENTS.md（文档标准）最小骨架

```markdown
# 文档标准

## 分层：一个事实一个家

| 层 | 职责 | 不放什么 |
|---|---|---|
| 根 AGENTS.md | standing orders，1–3 行 + 链接 | 故事、示例、复述 |
| docs/architecture.md | 组成与扩展点的有序地图 | 类型细节、决策理由 |
| 模块 README | 模块契约：配置、语义、限制 | JSDoc 复述 |
| .agents/notes/ | 决策的为什么与放弃了什么 | 已落地决策的迁移计划 |
| docs/postmortem/ | 事故叙事 | — |
| docs/cookbook/ | 编号步骤 how-to | 设计理由 |

归位：bug → postmortem；理由 → notes；步骤 → cookbook；类型 → 参考页；契约 → README；长期规则 → 根 AGENTS.md。

## 写作规则

- 只写当前状态；变更史进 commit / notes / postmortem。
- 一段一个物理行；引用一律相对路径 Markdown 链接，禁止裸文件名。
- 删除：重复陈述、实现状态注记、手工复述的清单、推理过程。
```

## 决策记录（Agent Note）骨架

路径：`.agents/notes/{proposed|implemented|rejected}/{class}/yyyy-mm-dd-<topic>.md`，class ∈ `feature | bug-fix | simplification | architecture | process | testing`。

```markdown
# <主题>

Status: proposed | implemented | rejected
Date: yyyy-mm-dd

## 决策
<决定了什么，一段话说清。>

## 理由
<为什么这样决定。>

## 放弃的方案
<考虑过什么、为什么不选——这是决策记录最不可替代的部分。>

## 验证
<什么行为/检查锚住了这个决策；已知的覆盖缺口。>
```

规则：`implemented/` 的记录随代码演进只更新事实（路径、名称、默认值），不改决策；被完全取代时并入新记录、互链、删除旧记录。

## CLAUDE.md 的两种形态

```sh
# 首选：符号链接（单一事实源）
ln -s AGENTS.md CLAUDE.md

# 退化形态：不支持软链的环境，文件内容为
# See AGENTS.md — edit that file, not this one.
```
