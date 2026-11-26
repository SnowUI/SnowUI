# Toast API

来源指纹：af077cd873dd50b2。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| parts | `ComponentPartsOf<{ Button: typeof Button }>` | — | 配置内置关闭 Button 的外观；事件、关闭语义和 ARIA 由 Toast 管理 |
| id | `string` | — | 静态使用时透传为 DOM id；`template` 模式下作为模板 id，供 `showToast(id)` 激活 |
| template | `boolean` | false | **模版模式**:只注册为命令式 Toast 模板，不直接渲染；用于"一段 Toast 代码 + 一个触发按钮"的写法 |
| as | `"toast" \| undefined` | — | **内嵌模式**(v1.1.0):`as="toast"` 启用 Inline 模式,自动发现宿主父元素并绑定 click 事件触发 Toast。遵循 ComponentGuidelines.md §5 三激活模式规范 |
| positive | `boolean` | — | 语义判定：`true`=积极(CheckCircle)；`false`=问题(Warning)；不传则不渲染内置图标 |
| variant | `ToastVariant` | "default" | 视觉变体 |
| size | `ToastSize` | "md" | 仅 default 变体生效 |
| position | `ToastPosition` | "top" | 用于驱动出入场方向（不直接定位） |
| onDismiss | `() => void` | — | 点击关闭 X 时回调（rich 变体） |
| children | `Snippet` | — | 正文和 leading / trailing 槽位内容；独立使用时由调用方处理关闭后的移除 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
