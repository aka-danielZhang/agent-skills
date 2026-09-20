# 模板与骨架

`agent-repo-spec` 的可复制参考。占位符用 `<尖括号>` 标出；按仓库实情替换，删掉用不到的节，不要为整齐创建空目录。

## 参考目录树

```text
<repo>/
├── AGENTS.md                  # 极简 standing orders + 事实入口
├── CLAUDE.md                  # -> AGENTS.md
├── README.md                  # 给人的第一印象与最短启动路径
├── docs/
│   ├── AGENTS.md              # 文档分层、写作规则、义务矩阵
│   ├── architecture.md        # 核心组成、流程、模块关系
│   ├── development.md         # 复杂环境搭建与日常开发流（按需）
│   ├── cookbook/              # 不自动触发的线性 how-to（按需）
│   └── postmortem/            # 有事故再建
├── .agents/
│   ├── AGENTS.md              # agent 资产的局部规则（按需）
│   ├── STATUS.md              # 当前工作焦点与状态指针，只链接不复制（按需）
│   ├── local.example.md       # 可提交的本地私有上下文模板
│   ├── local.md               # 用户私有长期记忆，Git 忽略
│   ├── notes/                 # 仓库选定的决策/踩坑记录（按需）
│   └── skills/                # 可自动触发的 agent 工作流（按需）
└── <关键子树>/
    ├── AGENTS.md              # 仅该子树新增的规则
    ├── CLAUDE.md              # -> AGENTS.md（工具需要时）
    └── README.md              # 模块契约、启动和探活
```

## 根 AGENTS.md 极简骨架

```markdown
# AGENTS.md

<一句话说明项目是什么>。架构/合同入口：[<名称>](<相对路径>)。当前状态或开发入口：[<名称>](<相对路径>)。

## Repository layout

\```text
<src-or-module>/  <职责一句话>
docs/             <事实类型一句话>
.agents/           <agent 资产一句话>
\```

## Standing orders

- <只写每个任务、每个会话都成立的规则；细节链到唯一拥有文档>
- 代码与拥有该事实的文档在同一 PR 保持一致；具体义务见 [文档规则](docs/AGENTS.md)。
- 用户私有的仓库上下文按需读取 `.agents/local.md`；不得提交或复制到共享文档。

## Workflows

<只列“什么场景读哪个 skill/文档”的短路由，不复制步骤。没有则删除本节。>

## Editing these instructions

根文件只放全仓 standing orders。仅对某目录生效的规则写进该目录的 `AGENTS.md`；子树只写增量，不复述父级。
```

约束：默认不超过 60 个非空物理行，standing-order bullets 不超过 10 条。根文件不放命令块、安装教程、完整义务矩阵或模块细节。

## 子树 AGENTS.md 骨架

```markdown
# <子树路径>/AGENTS.md

本文件只管 `<子树路径>/**`。全仓规则继承自根 [`AGENTS.md`](<到根的相对路径>)，不在这里复述。

- <本子树独有的规则；详细语义链到拥有文档>
- <模块启动/探活见 README，工程步骤见对应 skill>
```

归位判断：

- 删除目录前缀后仍对全仓成立 → 根 `AGENTS.md`；
- 只在 `<path>/**` 成立 → `<path>/AGENTS.md`；
- 是合同、语义或稳定工程规则 → docs/模块 README；
- 是带判断、分支或工具编排的 agent 流程 → skill；
- 是不自动触发的线性 how-to → cookbook。

## 命令归位参考

| 命令类型 | 唯一拥有位置 | 其他位置怎么写 |
|---|---|---|
| 仓库首次安装、最短启动 | 根 README | AGENTS.md 只链 README |
| 模块启动、调试、探活 | 模块 README | 根 README 只链模块；多模块不复制 |
| 复杂开发环境与 CI 摘要 | `docs/development.md` | README 给最短入口 |
| 根据 diff 选择测试 | pre-push/test skill | 工程规则只写何时必须测试 |
| Flyway、发布、hotfix 等判断流程 | 对应 skill | docs 写稳定约束，skill 写步骤 |
| 实际可执行目标 | package scripts、Makefile、pom/Gradle | 文档调用目标，不复刻脚本实现 |

单模块仓库可由根 README 拥有最短启动命令；多模块仓库由模块 README 拥有各自命令，根 README 只放仓库级编排。

## docs/AGENTS.md 最小骨架

```markdown
# 文档标准

## 一个事实一个家

| 层 | 职责 | 不放什么 |
|---|---|---|
| 根 AGENTS.md | 极简 standing orders + 入口 | 命令块、教程、完整矩阵、模块细节 |
| 子树 AGENTS.md | 该子树新增规则 | 父级已有规则 |
| docs/architecture.md | 组成、流程、模块关系、扩展点 | 类型细节、执行步骤 |
| 模块 README | 模块契约、模块启动和探活 | 其他模块的事情 |
| docs/development.md | 复杂环境搭建、日常开发流、CI 摘要 | standing orders 的复本 |
| .agents/skills/ | 可触发的判断、步骤、工具调用、验证 | 产品合同和工程规则正文 |
| docs/cookbook/ | 不自动触发的线性 how-to | skill 的重复副本 |
| <决策账本> | 为什么、放弃了什么、如何验证 | 当前施工进度 |
| .agents/STATUS.md | 当前工作焦点与各模块状态指针（按需） | 事实正文、决策理由（只链接） |
| docs/postmortem/ | 事故故事 | 当前合同 |

## 写作规则

- 只写当前状态；变更史进 commit、唯一决策账本或 postmortem。
- 仓内引用一律使用相对 Markdown 链接，不用裸文件名。
- 同一事实或规则只写在一个家，其他地方只链接。
- 删除重复陈述、实现状态口号、手工复述的代码清单和推理过程。

## 代码变更的文档义务

<按仓库事实建立矩阵。完整矩阵只放这里或工程规则，不复制到根 AGENTS.md。>
```

## `.agents/AGENTS.md` 最小骨架

```markdown
# .agents/AGENTS.md

本目录保存 agent 资产，不是产品合同。全仓规则继承自根 [`AGENTS.md`](../AGENTS.md)。

| 路径 | 职责 |
|---|---|
| `local.example.md` | 可提交的用户私有上下文结构模板 |
| `local.md` | 用户 × 当前仓库的本地长期记忆；Git 忽略、按需读写 |
| `STATUS.md` | 当前工作焦点与各模块状态指针：只链接不复制，阶段切换时更新（按需） |
| `notes/` | <本仓定义的决策记录或踩坑职责> |
| `skills/` | 到场景才读的步骤和验证；不复述 docs 的规则 |

读取 `local.md` 时只取当前任务需要的字段。不得把其中的秘密复制到聊天、日志、共享文档或提交内容。
```

## `.agents/local.example.md` 骨架

```markdown
# 本地仓库上下文

> 复制为 `local.md` 后填写。`local.md` 仅属于当前用户和当前 clone，Git 忽略。
> Agent 可按需读取和更新，不得把秘密复制到提交内容、共享文档、日志或聊天输出。

## Toolchain

- Maven executable:
- Maven home:
- Java home:
- Docker context:

## Test environments

### <environment>

- Base URL:
- Tenant:
- Username:
- Password source: <environment variable / system keychain / local plaintext chosen by user>
- Notes:
- Last verified:

## Local conventions

- Proxy:
- Local ports:
- Working directory notes:

## Other

- <note>
```

本地文件更新规则：

- 用户明确提供或 agent 通过成功执行确认的事实可以写入；不确定信息不猜。
- 覆盖账号、密码、环境地址前确认；只改相关条目，不重写其他内容。
- 优先记录密码来源。用户选择本地明文时，只能写进已忽略的 `local.md`。
- 纯文档等无关任务不读；测试、调试、本机工具任务只读取需要的字段。

## `.gitignore` 片段与验证

```gitignore
# User-private repository context
.agents/local.md
```

不要忽略整个 `.agents/`，否则会误伤共享的 skills、notes 和模板。创建后验证：

```sh
git check-ignore -v .agents/local.md
if git check-ignore .agents/local.example.md >/dev/null; then
  echo '.agents/local.example.md must remain trackable' >&2
  exit 1
fi
```

`.gitignore` 无法保护已经被 Git 跟踪的秘密；初始化或迁移时还要检查相关文件是否已在 `git ls-files` 中。

## 决策记录（Agent Note）参考骨架

仅在仓库选择 notes 作为唯一决策账本时使用。也可以采用 OQ 表或 ADR，不能并存多份相同决策历史。

路径示例：`.agents/notes/{proposed|implemented|rejected}/{class}/yyyy-mm-dd-<topic>.md`。

```markdown
# <主题>

Status: proposed | implemented | rejected
Date: yyyy-mm-dd

## 决策

<决定了什么。>

## 理由

<为什么这样决定。>

## 放弃的方案

<考虑过什么、为什么不选。>

## 验证

<什么行为或检查锚住该决策；已知覆盖缺口。>
```

## CLAUDE.md 的两种形态

```sh
# 首选：符号链接
ln -s AGENTS.md CLAUDE.md

# 不支持软链时，普通文件只保留一行：
# See AGENTS.md — edit that file, not this one.
```
