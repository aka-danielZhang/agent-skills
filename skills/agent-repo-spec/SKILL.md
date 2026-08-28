---
name: agent-repo-spec
version: 2.0.0
description: Establish, audit, restructure, or evolve an agent-first repository specification system with a minimal AGENTS.md router, nested rules, one-home-per-fact docs, command ownership, reusable workflows, machine-checkable links, and git-ignored user-local memory. Use when the user asks to 初始化或改造仓库规范, set up or simplify AGENTS.md / CLAUDE.md, adopt agent-first or spec-driven development, reorganize docs, decide where rules or commands belong, audit repository guidance, or persist private per-repo context.
whenToUse: 新建、审查、改造或持续演进 Agent-First 仓库规范时；包括创建或精简 AGENTS.md/CLAUDE.md、设计 docs/ 与子树规则、确定命令和事实归属、配置用户私有的仓库级长期记忆，以及校验代码变更对应的文档义务。
---

# 建立与演进 Agent-First 仓库规范

本 skill 蒸馏自 DeepSeek Harness 的文档规范（其 `AGENTS.md` + `docs/AGENTS.md`），把“仓库文档即 agent 操作规范”的模式沉淀为可用于新建、审查、改造和持续演进任意仓库的工作流。模板与骨架在 [references/templates.md](references/templates.md)，按需读取。

## 核心心智模型

1. **根 `AGENTS.md` 是极简路由器。** 它只放每个会话都必须知道的 standing orders 和事实入口，不是开发手册、命令大全或规则汇编。
2. **一个事实只有一个家（one home per fact）。** 每个事实归属唯一一篇文档，其他地方只用相对 Markdown 链接指过去；重复陈述必然漂移。
3. **稳定规则住文档，情境步骤住 skill/cookbook。** 能被 agent 识别并执行、包含判断或工具编排的流程进 skill；仅供查阅的线性 how-to 进 cookbook，二者不重复。
4. **文档随代码同 PR 改。** 代码、合同、测试和接手状态必须同时保持当前；具体义务由拥有该规则的文档定义，根文件只负责指路。

## 第一步：盘点现状与事实归属

先读已有 README、AGENTS.md、docs、模块 README、构建脚本、CI、`.gitignore` 和配置加载方式。不要先套目录模板。

为已有和待新增内容确定唯一归属：

| 内容 | 唯一归属 |
|---|---|
| 每个会话都必须知道的全仓规则 | 根 `AGENTS.md` |
| 仅某目录及其后代成立的规则 | 该目录的 `AGENTS.md` |
| 架构、合同、类型、语义、工程约束 | 拥有该事实的 `docs/` 页面或模块 README |
| 可自动触发、含判断/分支/工具编排的重复流程 | `.agents/skills/` |
| 不需自动触发的线性操作指南 | `docs/cookbook/` |
| 用户私有、仓库相关、跨会话持久的本机事实 | `.agents/local.md`（Git 忽略） |
| 决策理由与放弃方案 | 仓库选定的唯一决策账本 |
| 事故故事 | `docs/postmortem/` |

同一流程只选一个家。不要同时创建内容相同的 skill 和 cookbook，也不要把规则正文复制进 skill。

## 第二步：写极简根 AGENTS.md

根文件只允许四类内容：

- 一句话项目定位；
- 仓库主要区域与事实入口；
- 真正对每个任务都成立的全仓 standing orders；
- 规则归位和本地私有上下文的入口。

默认预算：不超过 **60 个非空物理行**，standing-order bullets 不超过 **10 条**。超出时先重新归位，不靠压缩措辞硬塞。

**不放**：命令表、安装教程、完整文档义务矩阵、模块细节、工作流步骤、故事、worked example、变更史、从链接目标复制来的规则。启动和检查命令只链到其拥有文档或 skill。

写每句话前问：它是否对每个任务、每个会话都成立？若否，移到子树、docs、README、skill、cookbook 或 `.agents/local.md`。

## 第三步：给关键子树写增量 AGENTS.md

一条规则若只在 `<path>/**` 下成立，就写进 `<path>/AGENTS.md`。子树自动继承父级规则，只写本层新增约束，不复述根文件或上级子树。

- 文档写法 → `docs/AGENTS.md`；
- 某语言或模块独有约束 → 模块根 `AGENTS.md`；
- agent 资产职责 → `.agents/AGENTS.md`；
- 详细语义和步骤仍链到拥有它的文档或 skill，不抄进子树文件。

不是每个目录都需要 AGENTS.md；只有存在真实、稳定、局部规则时才创建。

## 第四步：CLAUDE.md 软链到 AGENTS.md

```sh
ln -s AGENTS.md CLAUDE.md
```

- Claude Code 读 `CLAUDE.md`，DSH / Codex 等读 `AGENTS.md`；软链保证单一事实源。
- 根目录必须建立；关键子树只有在工具需要独立发现时才建立同样软链。
- 永远编辑真实 `AGENTS.md`，不编辑软链。
- 不支持符号链接时，退化为仅指向 `AGENTS.md` 的一行普通文件，并注明编辑真实文件。

## 第五步：文档分层与命令归位

按事实和读者建层，不为整齐创建空目录：

| 层 | 职责 | 不放什么 |
|---|---|---|
| 根 `AGENTS.md` | 极简 standing orders + 入口 | 命令块、教程、完整矩阵、模块细节 |
| 子树 `AGENTS.md` | 该子树增量规则 | 父级已有规则、完整操作手册 |
| `docs/architecture.md` | 组成、核心流程、模块关系、扩展点 | 类型细节、执行步骤、决策故事 |
| `docs/` 参考页 | 类型、语义、配置、工程规则 | 重复的架构叙事 |
| 根 README | 给人的第一印象；小仓库的最短启动路径 | agent standing orders 的复本 |
| 模块 README | 模块契约、模块启动与探活 | 其他模块的事情 |
| `docs/development.md` | 复杂环境搭建、日常开发流、CI 摘要 | 每会话 standing orders |
| `.agents/skills/` | agent 可触发的判断、步骤、工具调用、验证 | 产品合同和工程规则正文 |
| `docs/cookbook/` | 不自动触发的线性 how-to | 规则理由、skill 的重复副本 |
| `.agents/notes/` 或项目决策账本 | 决策理由、放弃方案、验证证据 | 当前施工进度 |
| `docs/postmortem/` | 事故叙事 | 当前合同 |

### 命令归位

命令不默认进入 AGENTS.md，按操作拥有者维护：

| 命令 | 位置 |
|---|---|
| 仓库首次安装、最短启动路径 | 根 README；复杂时链到 `docs/development.md` |
| 某模块启动、调试、探活 | 模块 README |
| 根据 diff 选择测试 | pre-push/test skill |
| 数据库迁移、发布、hotfix 等有判断的流程 | 对应 skill |
| 命令的可执行定义 | package scripts、Makefile、pom/Gradle 等源码 |

单模块仓库允许根 README 拥有最短启动命令；多模块仓库由各模块 README 拥有模块命令，根 README 只放仓库级编排。不要在根 README、模块 README、development 和 skill 四处复制同一命令块。

## 第六步：用户私有的仓库级长期记忆

为“用户 × 当前仓库”的本地事实建立固定入口：

- `.agents/local.example.md`：提交，定义结构和安全占位符；
- `.agents/local.md`：不提交，保存 Maven/JDK 路径、测试环境、测试账号、凭证来源、本机端口和调试备注；
- 根 `AGENTS.md` 只留一行：相关任务按需读取 `.agents/local.md`，不得提交或复制到共享文档。

向 `.gitignore` 精确加入：

```gitignore
# User-private repository context
.agents/local.md
```

执行协议：

1. 纯文档等无关任务不读；测试、调试或本机工具任务只读取需要的章节/字段。
2. 用户明确提供或 agent 通过成功执行确认的本地事实可以更新；不确定信息不猜，覆盖账号、密码或环境地址前确认。
3. 优先记录密码来源（环境变量、系统密钥库）；用户选择明文时只允许留在已忽略的本地文件。
4. 不在聊天、日志、命令行、STATUS、brief、notes、commit message 或提交文件中回显/复制秘密。
5. 用 `Last verified` 标记易变化事实；修改只动相关条目，不重写用户其他内容。
6. 用 `git check-ignore -v .agents/local.md` 验证忽略；确认 `.agents/local.example.md` 未被忽略。

## 第七步：索引与写作规则

- 根 `AGENTS.md` 是唯一总入口；每篇文档链自己的直接下级并说明职责，细节不抄上来。
- 子树 AGENTS.md 依赖工具按目录发现，不需要在根文件枚举所有子树。
- 仓内引用使用相对 Markdown 链接，禁止裸文件名；可配置死链和 anchor 检查。
- README 保持给人的第一印象，并链到 AGENTS.md 与 docs。
- 耐久文档只写当前状态；历史进 commit、唯一决策账本或 postmortem。
- 删除重复陈述、实现状态口号、手工复述的代码清单和推理过程。

## 第八步：文档义务放在拥有它的规则页

完整义务矩阵写进 `docs/AGENTS.md` 或工程规范，不写进根文件。根文件只保留“代码与拥有该事实的文档同 PR 更新”的一行。

通用起点：

| 代码变更 | 同 PR 必须更新 |
|---|---|
| 模块行为、配置、限制 | 拥有该事实的模块 README/参考页 + 必要测试 |
| 架构、模块关系、核心流程 | `docs/architecture.md` |
| 长期全仓规则 | 根 `AGENTS.md` 一条路由或 standing order；细节仍归拥有文档 |
| 子树局部规则 | 对应子树 `AGENTS.md` |
| 重复操作流程 | skill 或 cookbook（二选一） |
| 文档分层规则 | `docs/AGENTS.md` |

纯机械修改可豁免额外决策记录。决策记录的目录形态服从仓库现有做法，不强迫所有仓库采用同一生命周期。

## 执行清单

1. 盘点现状并为事实、规则、步骤、命令、本地私有上下文确定唯一归属。
2. 写极简根 `AGENTS.md`，删除命令块和完整义务矩阵。
3. 给确有局部规则的关键子树写增量 `AGENTS.md`。
4. 创建根 `CLAUDE.md -> AGENTS.md`，按需创建子树软链。
5. 按实际内容建立 docs/、README、skills/cookbook 和决策账本；不造空目录。
6. 创建 `.agents/local.example.md`，忽略并按需创建 `.agents/local.md`。
7. 把完整文档义务写进 `docs/AGENTS.md` 或工程规则，根文件只留入口。
8. 验证软链、相对链接、根文件预算、子树无重复、命令无多处复本、本地文件确实被忽略。
9. 用一个冷启动 agent 验证：只读根 AGENTS.md 就能找到事实、开发入口和按需工作流；需要本机测试时能定位 `.agents/local.md`，无需依赖聊天历史。

## 按仓库规模裁剪

- 最小集：极简根 `AGENTS.md` + `CLAUDE.md` 软链 + 一个真实的架构/合同入口；存在用户私有本地事实时再加 `.agents/local.example.md`。
- 没有事故就不建 postmortem，没有重复流程就不建 skill/cookbook，没有局部规则就不建子树 AGENTS.md。
- 根文件是稀缺上下文。新增内容先问“是否每个会话都需要”；答案不是明确的“是”，就移出根文件。
