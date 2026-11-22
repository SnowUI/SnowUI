# SnowUI Components 维护者路由说明

读者：官方工作区维护者与维护 AI（本文件不随 npm 运行包发布）。

## 必读阅读链

执行 `components/` 维护任务时，严格按顺序完整读取：

1. `Project/AGENTS.md`（L0 跨项目红线与协作总则）
2. `SnowUI/AGENTS.md`（L1 SnowUI 治理根契约）
3. `SnowUI/docs/TaskRoutes.md`（L2 专题按任务意图路由）
4. 目标组件或模块同目录 `.md` 源码契约

## 目录与契约边界

- **对外包入口（英文）**：根目录 `AGENTS.md`、`README.md`、`llms.txt`、`THIRD_PARTY_NOTICES.md` 及生成的 `component-catalog.json` 面向外部使用者与外部 AI，统一使用英文且严禁包含本机私有路径。
- **源码契约（中文）**：`src/components/*.md`、`src/blocks/*.md` 及 `src/{lib,logic,motion,styles}/**/*.md` 为内部维护与 Site 文档生成的中文权威源，与源码同目录维护，不搬入 `docs/`。
- **更新日志归档（L3）**：`docs/history/changelogs/*.history.md` 存放从组件 `.md` 归档的历史版本记录；`site/scripts/generate-user-docs.mjs` 在生成公开更新日志时自动拼接归档条目。
- **跨仓变更联动（强制）**：新增或修改组件公开 Prop、事件、Snippet 或交互态时，当前任务必改同目录 `.md`、同目录 `*.test.ts` 并执行 `playground` `pnpm updated add <Component>`；同时按 `site/docs/standards/ComponentExampleQualityGuide.md` 主动判断新能力是否具独立官网展示价值（需展示记入 `SnowUI/docs/planning/SnowUIPlan.md` 于合并 `main` 时落地，无需展示写入任务日志），并评估是否同步 `component-discovery.json`（运行 `generate-component-catalog.mjs`）及 `SnowUI/docs/reference/` 登记表。
- **跨仓共享规范**：组件设计、样式、布局、动效与发布规范统一维护在 `SnowUI/docs/standards/`，本目录不复制第二份规范正文。
