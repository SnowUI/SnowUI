# Components 内置功能图标快照

本目录是 `@snowui-design-system/components` 随包交付的最小功能图标集合，不产生 `resource-svelte` 或 `resource-base` 运行时依赖。

- `snowui` collection：SnowUI 项目自有图形。
- `phosphor` collection：Phosphor Icons，MIT License；许可事实来自 `resource-base/src/collections.ts`。
- `special` collection：仅在生成清单明确命中时进入；当前功能图标清单没有该来源。

`builtin-icon-data.ts` 是检查入库的发布快照，记录每个语义名的 `sourceCollection`、viewBox 与 weight 内容。工作区维护时执行 `node scripts/generate-builtin-icons.mjs` 从同级 `resource-svelte` 已生成组件同步；Components 构建、安装和运行都不执行该脚本。新增语义名必须先核对来源、许可与再分发边界，并把它加入脚本显式 allowlist，禁止把整个资源库复制进 Components。

