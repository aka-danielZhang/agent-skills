# Changelog

本仓库遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)；版本号语义：skill 内容结构调整 bump minor，上游文档同步 bump patch（由 `scripts/update-check.mjs` 自动完成）。

## [1.2.0] - 2026-08-15

### 新增
- 「安装插件」完整覆盖：`dsh plugin --profile <name> add/remove` 命令族（本地 checkout / git（pin commit）/ npm / tarball 四种安装源）、bundle 与 profile 双 manifest 模型、`--dump-config` 验证、bundle 对账机制、git 安装的 `prepare` + `allowBuilds` 构建陷阱及信任边界、层叠加载顺序。
- SKILL.md 形态判别表新增「把现成插件装进自己的 dsh」一行；doc-map 手工表收录 `user/develop/basic/publish.md`。
- out-of-tree.md 重组为「安装插件（正式）」与「临时挂载（--patch）」两节，明确主次。

## [1.1.2] - 2026-08-15

### 修复
- CI workflow：job 级 `env.HOME` 在 `env:` 上下文中不可用导致路径为空，改用 `${{ github.workspace }}` 固定路径。
- 上游 URL 归一化（去 `.git` 后缀），避免本地与 CI 远程地址写法差异造成无意义 diff。
- 脏树保护：harness checkout 的 `docs/` 有未提交 `.md` 变更时跳过同步（退出码 3），防止 WIP 指纹与 CI 干净 clone 同步来回打架；`--allow-dirty` 显式放行。

## [1.1.0] - 2026-08-15

### 改变
- 可移植化：移除本机绝对路径，`$DSH` checkout 按 `DSH_CHECKOUT` 环境变量 → `~/workspace/coding-study/deepseek-harness` 顺序定位。
- `install.sh` 从软链改为拷贝式安装（`--force` 覆盖）。
- `doc-map.md` 拆分为手工维护区（高频入口）与自动生成区（docs 全量索引）。

### 新增
- `scripts/update-check.mjs`：对照 `$DSH/docs` 重生成索引、内容指纹检测漂移、校验手工引用、bump patch 版本并提交。
- `scripts/install-cron.sh`：macOS LaunchAgent / 其他平台 crontab 的每日定时同步。
- `.github/workflows/update-check.yml`：CI 兜底同步（无需本机开机）。
- `upstream-state.json`：记录蒸馏自的上游提交与文档指纹。
- SKILL.md 增加 `version` frontmatter。

## [1.0.0] - 2026-08-15

- 初始版本：`dsh-harness-dev` skill（SKILL.md + 3 个 references），软链安装。
