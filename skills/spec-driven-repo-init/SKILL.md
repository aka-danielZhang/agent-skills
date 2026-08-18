---
name: spec-driven-repo-init
version: 1.0.0
description: Initialize or restructure a repository's documentation for spec-driven, agent-first development — authoring the root AGENTS.md, symlinking CLAUDE.md to it, laying out docs/ by tier, assigning each fact exactly one home, wiring machine-checkable index links, and defining which docs must change with every code change. Use when the user asks to 初始化仓库文档, set up AGENTS.md / CLAUDE.md, adopt spec-driven development, organize docs for AI agents, decide where a document should live, or bootstrap a new repo's documentation system.
whenToUse: 初始化新仓库或改造现有仓库、建立 spec-driven 文档体系时；包括创建 AGENTS.md/CLAUDE.md、设计 docs/ 目录分层、确定每篇文档的读者与索引关系、规定开发时必须同步更新哪些文档。
---

# 用 Spec-Driven 文档体系初始化仓库

本 skill 蒸馏自 DeepSeek Harness 的文档规范（其 `AGENTS.md` + `docs/AGENTS.md`），把「仓库文档即 agent 操作规范」的模式沉淀为任意仓库可执行的初始化流程。模板与骨架在 [references/templates.md](references/templates.md)。

## 核心心智模型（先立住三条）

1. **AGENTS.md 是根。** 它是每个 agent 会话都在上下文里的 standing orders；仓库里其他一切文档都从它通过链接可达。写不进去的进不了 agent 的脑子。
2. **一个事实只有一个家（one home per fact）。** 每个事实归属唯一一篇文档，其他地方一律用相对路径 Markdown 链接指过去。重复陈述必然漂移。
3. **文档随代码同 PR 改。** 文档不是事后补的；每类代码变更对应明确的文档义务（见第五步）。

## 第一步：根 AGENTS.md

先读仓库现状（已有 README、代码结构、命令脚本），再写根 `AGENTS.md`。它只装**每个会话都需要的规则**，每条 1–3 行并以链接指向该规则的家。骨架（完整模板见 references）：

- 一句话项目定位 + 指向架构文档的「改代码前必读」链接；
- 仓库布局树（目录 + 一句话职责）；
- 命令表（install / test / lint / build / run）；
- 约定与禁忌（standing orders，逐条列出，链接到详情文档）；
- 文档义务（开发时必须改哪些文档，见第五步）。

**不放**：故事、教程、worked example、从链接目标复制来的细节。根文件必须短——Harness 给自己定的预算是 ≤1600 词；普通仓库建议 ≤800 词，超了说明内容放错了层。

## 第二步：CLAUDE.md 软链到 AGENTS.md

```sh
ln -s AGENTS.md CLAUDE.md
```

- Claude Code 读 `CLAUDE.md`，DSH / Codex 等读 `AGENTS.md`；软链保证**单一事实源**，两份内容永不漂移。
- 在根目录建，必要时也在关键子树根建（如 `packages/`、`examples/`），同样软链到该子树的 `AGENTS.md`。
- **永远编辑真实文件，不编辑软链。** 在根 AGENTS.md 里写明这一点。
- 目标环境不支持符号链接（如某些 Windows 检出）时，退化为内容只有一行 `# See AGENTS.md` 的普通文件，并在文件里注明「编辑 AGENTS.md」。

## 第三步：docs/ 分层——每篇文档给谁看、放什么

按下表建层。**读者决定内容**：写给 agent 每会话读的要短而硬；写给人查阅的才允许长。

| 层 | 给谁看 | 职责 | 不放什么 |
|---|---|---|---|
| 根 `AGENTS.md` | 每个 agent 会话 | standing orders，每条 1–3 行 + 链接 | 故事、示例、从别处复制的内容 |
| 子树 `AGENTS.md` | 进入该子树工作的 agent | 仅该子树特有的规则 | 根文件已覆盖的仓库级规则 |
| `docs/architecture.md` | 改核心代码前的人/agent | 有序地图：组成、核心模块、扩展点 | 类型细节（→参考页）、决策理由（→决策记录） |
| `docs/` 参考页（每主题/子系统一页） | 查特定主题的人 | 类型定义、语义、配置 | 行为叙事（→architecture） |
| 模块级 `README.md` | 改这个模块的人/agent | 该模块的契约：配置、语义、限制、扩展点 | JSDoc 复述、其他模块的事 |
| `docs/development.md` | 贡献者 | 环境搭建、日常开发流、CI 摘要 | 版本理由（→决策记录） |
| `docs/cookbook/` | 要做某件事的人/agent | 编号步骤的 how-to，带验证步骤 | 设计理由（→决策记录） |
| `docs/postmortem/` | 复盘事故的人 | 事故故事——唯一允许叙事体的层 | — |
| `.agents/notes/` 决策记录 | 未来要改这个决策的人/agent | 为什么、放弃了什么、如何验证 | 已落地决策的迁移计划、验收清单 |
| `docs/AGENTS.md`（或 `docs/README.md`） | 写文档的人/agent | 文档标准本身：分层表、写作规则、预算 | 产品/运行时契约 |
| `.agents/skills/` | 执行特定工作流的 agent | 可复用工作流与判断标准 | 产品与运行时契约（→docs 或源码） |

**归位口诀**：bug → postmortem；理由 → 决策记录；步骤 → cookbook；类型/语义 → 参考页；模块契约 → README；长期规则 → 根 AGENTS.md。

**写作规则**（写进 `docs/AGENTS.md`）：

- 只写当前状态，不写变更史（"之前/现在/不再"、PR 号禁止出现在耐久文档里；历史进 commit、决策记录、postmortem）；
- 每篇文档声明自己是 tutorial（有序路径通向结果）还是 reference（支持查阅，无教学顺序）；
- 一段一个物理行；跨文档引用用相对路径链接，禁止裸文件名，使链接可机器校验；
- 删掉 slop：重复陈述、实现状态注记（"已实现！"会腐烂）、手工复述的目录/清单（交给生成器或源码）、推理过程。

## 第四步：索引关系怎么建

- **根 AGENTS.md 是唯一入口**：链接 architecture.md、docs 标准、开发指南；子树 AGENTS.md 由 agent 工具自动发现（Claude Code / DSH 均支持嵌套 AGENTS.md），无需手工列全。
- **每篇文档链自己的直接下级**，并用一句话说明其职责；下级的细节不抄上来。
- **决策记录不建 INDEX.md**：路径即索引——`.agents/notes/{proposed|implemented|rejected}/{class}/yyyy-mm-dd-topic.md`，生命周期和类别编码在路径里，靠浏览目录和全文搜索发现。
- **链接必须机器可校验**：全部用相对路径 Markdown 链接（`[架构](docs/architecture.md)`），有条件就配一个死链检查脚本（校验链接目标和 `#anchor`）。
- README.md 保持给人看的第一印象，并链到 AGENTS.md 与 docs/。

## 第五步：开发时必须同步修改哪些文档（义务矩阵）

把这张表写进根 AGENTS.md 的「文档义务」节，这是 spec-driven 能持续成立的关键：

| 代码变更 | 同 PR 必须更新 |
|---|---|
| 改了某模块行为/配置/限制 | 该模块 README + 相关 JSDoc/注释 |
| 非平凡变更（行为、契约、结构、流程、磁盘/线上格式） | 一篇决策记录：新决策进 `.agents/notes/implemented/`，大提案先进 `proposed/`；已存在的决策更新拥有它的那篇，不开重复篇 |
| 改了架构、模块关系、核心流程 | `docs/architecture.md` |
| 新增一条长期规则 | 根 `AGENTS.md`（1–3 行 + 链接到理由） |
| 修了线上事故 | `docs/postmortem/` 一篇 |
| 新增「怎么做 X」的重复操作 | `docs/cookbook/` 一篇 |
| 文档分层/写作规则本身变化 | `docs/AGENTS.md` |

纯机械/局部修改（格式化、改名且不改语义）豁免决策记录。决策记录随代码演进只更新事实（路径、名称），不改决策本身；被完全取代的旧记录并入新记录并互链。

## 执行清单

1. 盘点现状：已有 README、docs、CLAUDE.md、CI 脚本；识别已有内容该归到哪一层。
2. 写根 `AGENTS.md`（用 references/templates.md 骨架，按仓库实情填布局树和命令表）。
3. `ln -s AGENTS.md CLAUDE.md`（根 + 需要的子树）。
4. 建 `docs/` 骨架：`architecture.md`、`development.md`、`AGENTS.md`（文档标准精简版）、`cookbook/README.md`、`postmortem/README.md`。
5. 建 `.agents/notes/` 骨架：`README.md`（格式定义 + 何时写）+ `proposed/` `implemented/` `rejected/`。
6. 给规则密集的关键子树写子树 `AGENTS.md`。
7. 把第五步的义务矩阵写进根 AGENTS.md。
8. 验证：CLAUDE.md 是软链；所有相对链接目标存在；用一个 agent 会话冷启动读仓库，确认它只读根 AGENTS.md 就能找到一切。

## 按仓库规模裁剪

- **最小集（任何仓库第一天就该有）**：根 `AGENTS.md` + `CLAUDE.md` 软链 + `docs/architecture.md` + 义务矩阵。其余层按需长出来——没有事故就不需要 postmortem/。
- **不要为了整齐而造空目录**：每一层都是因为有一类事实没地方放才创建。
- **预算意识**：根 AGENTS.md 是稀缺资源（每个会话都占上下文），新增规则先问「这条规则属于哪个子树/文档」，只有真正全仓库每会话都需要的才进根。
