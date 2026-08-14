# Changelog

本仓库遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)；版本号语义：skill 内容结构调整 bump minor，上游文档同步 bump patch（由 `scripts/update-check.mjs` 自动完成）。

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
