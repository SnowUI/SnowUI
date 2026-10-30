# Components 内置功能图标快照

本目录是 `@snowui-design-system/components` 随包交付的最小功能图标集合，不产生 `resource-svelte` 或 `resource-base` 运行时依赖。

- `snowui` collection：SnowUI 项目自有图形。
- `phosphor` collection：Phosphor Icons，MIT License；许可事实来自 `resource-base/src/collections.ts`。
- `special` collection：仅在生成清单明确命中时进入；当前功能图标清单没有该来源。

`builtin-icon-data.ts` 是检查入库的发布快照，记录每个语义名的 `sourceCollection`、viewBox 与 weight 内容。工作区维护时执行 `node scripts/generate-builtin-icons.mjs` 从同级 `resource-svelte` 已生成组件同步；Components 构建、安装和运行都不执行该脚本。新增语义名必须先核对来源、许可与再分发边界，并把它加入脚本显式 allowlist，禁止把整个资源库复制进 Components。


Accordion / AccordionItem 的 `plus`、`minus` 随包内置，来源为 `resource-svelte@1.0.29` 的 Phosphor regular 图标（MIT）；构建和运行不依赖该资源包。

图形与外框比例以 `resource-base/raw-assets` 为权威，生成消费源为 `resource-base/assets`。快照生成器核对assets中的viewBox及图形内容（允许黑色转换currentColor），禁止组件私自裁切或缩放path。ComponentIcon尺寸优先级为显式size、最近图标上下文、16px默认值；Provider与包内fallback接收相同尺寸。详见 `docs/standards/ComponentGuidelines.md` §2.7。

本轮逐资源结果与非功能 SVG 归类见 [图形比例核对](geometry-audit.md)。

功能图标遵守 StyleSpec 可读性下限：最小 12×12 CSS px，并防止 flex 挤压。原始矢量几何不变。
