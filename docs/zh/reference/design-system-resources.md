# SnowUI 设计系统资料与关系

关系指纹：`1c7a4e5f30a33836`；组件源码基线：`1.2.3`。组件包版本变更时须重新生成并检查本清单、映射和源码下载链接；来源指纹对应权威源，摘要页面可能只包含面向使用者的节选。

## 资料入口

| 资料 | 职责 | 权威等级 | 公开读取或获取 | 来源指纹 |
| --- | --- | --- | --- | --- |
| Figma 组件与变量对照 | 原文件身份、组件和变量与代码 Token 对照；副本必须重新定位。 | 已核对的对照资料 | [读取](./figma-map.md) · [JSON](https://snowui.dev/llms/figma-map.json) | `d755f579d91e41e8` |
| Figma 视觉语义映射 | 将 Figma 属性、样式和变量翻译为公开组件入口或 Token。 | 映射规则 | [读取](../guides/figma.md) | `5fa56d0e5ed8558f` |
| 口语与组件名称 | 面向使用者的口语意图与组件选择摘要；详细依据以来源文档为准。 | 使用者摘要 | [读取](../guides/component-selection.md) | `08b604a6e3064cd6` |
| 样式推荐 | 面向使用者的非强制样式建议摘要；精确值仍以 CSS 和设计输入为准。 | 使用者摘要 | [读取](../guides/styling.md) | `0ed39937b70372c3` |
| 页面工具类 CSS | 可选的页面级工具类实际声明；仅在应用显式加载时生效。 | CSS 实际声明 | [读取](https://snowui.dev/design-system/snowui-utilities.d5a8d46f5bc18b9b.css) | `d5a8d46f5bc18b9b` |
| 响应式工具类 CSS | 可选的响应式工具类实际声明；按需要另行加载。 | CSS 实际声明 | [读取](https://snowui.dev/design-system/snowui-responsive.55c150e2bf51516d.css) | `55c150e2bf51516d` |
| 组件 Token 与主题 | 当前公开包的声明和主题条件；原 CSS 位于版本化源码包的 src/styles。 | CSS 实际声明 | [读取](./tokens.md) · [JSON](https://snowui.dev/llms/tokens.json) · [版本化源码 ZIP](https://snowui.dev/downloads/source/v1.2.3/snowui-source-1.2.3-license-2.4.0.zip) | `2a6eba2ca0cc2df3` |
| 组件公开 API | 组件目录与各组件 API、组合和样式入口；使用安装版本核对。 | 公开 API | [读取](../components/index.md) · [JSON](https://snowui.dev/component-catalog.json) · [版本化源码 ZIP](https://snowui.dev/downloads/source/v1.2.3/snowui-source-1.2.3-license-2.4.0.zip) | `1a300982b9e398b9` |
| Figma 社区获取入口 | 从 Figma 社区获取设计资料。 | 外部资源 | [读取](https://www.figma.com/community/file/1388431032861751537) | `external` |

## 关系与修改路径

- Figma 社区获取 → 在自己副本中按页面／集合、名称、类型、mode、当前值重新定位 → [公开对照](./figma-map.md) → [Figma 映射指南](../guides/figma.md) → [Token 声明](./tokens.md) → 命中组件的公开 API。原文件 ID 与 Code Connect 不会自动沿用到副本。
- 改单个组件：先查 [组件目录](../components/index.md) 与对应 API，再查公开对照和目标设计节点；只更新应用需要的样式入口，确认变体和交互，勿把局部覆盖当成全局 Token。
- 改几何基准：核对 Figma 变量的 Standard 与派生模式、相应 Token、可选页面 [utilities](https://snowui.dev/design-system/snowui-utilities.d5a8d46f5bc18b9b.css) 和 [responsive](https://snowui.dev/design-system/snowui-responsive.55c150e2bf51516d.css)，以及实际消费组件。模式关系不能由 CSS scale 直接替代；无法编辑 Figma 时记录待人工核对步骤。
- 仅通过在线 AI 使用时，按需读取上述 HTTPS 资料；本机路径和 CLI 不可用时说明缺口。复制到 AI 的旧内容不会自动刷新，比较资料指纹并重新读取。

[机器可读关系清单](https://snowui.dev/llms/design-system-resources.json) · [Figma 对照数据](https://snowui.dev/llms/figma-map.json)
