# Indicator API

来源指纹：fade3c06cd8b93a0。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| axis | `IndicatorAxis` | line 为 `"width"`；corner 为 `"both"` | 调整宿主宽度、高度或同时调整；`both` 只用于 corner |
| edge | `IndicatorEdge` | 根据 axis 推导 | 拖动方向与默认定位边缘 |
| appearance | `IndicatorAppearance` | "line" | 线形或右下角图标视觉 |
| hitAreaPadding | `number \| string` | — | 兼容旧输入，已不再收窄命中带；line 始终覆盖所在整条边 |
| target | `HTMLElement` | 直接父元素 | resize target；可显式关联页面中的任意元素，不要求 Indicator 是其 DOM 后代 |
| revealTarget | `HTMLElement` | target | 控制显隐的 hover 宿主 |
| value | `number` | 实测 target 尺寸 | 当前受控尺寸基线，并同步为 ARIA 当前值 |
| minSize | `number` | 0 | 当前调整轴允许的最小尺寸，单位 px。 |
| maxSize | `number` | Infinity | 当前调整轴允许的最大尺寸，单位 px。 |
| minWidth | `number` | — | width / both 的宽度下限，优先于 minSize。 |
| maxWidth | `number` | — | width / both 的宽度上限，优先于 maxSize。 |
| minHeight | `number` | — | height / both 的高度下限，优先于 minSize。 |
| maxHeight | `number` | — | height / both 的高度上限，优先于 maxSize。 |
| step | `number` | 8 | 方向键每次调整的像素数。 |
| largeStep | `number` | 32 | 按住 Shift 时方向键每次调整的像素数。 |
| applySize | `boolean` | true | 是否直接写入 target 的 width / height |
| disabled | `boolean` | false | 禁止 Pointer 和键盘调整 |
| ariaLabel | `string` | LocaleProvider | 无障碍名称；默认随 axis 和 LocaleProvider 切换，英文为 Resize width / Resize height / Resize width and height |
| onResizeStart | `(value: number, axis: "width" \| "height") => void` | — | 开始调整回调 |
| onSizeChange | `(value: number, axis: "width" \| "height") => void` | — | 尺寸变化回调 |
| onResizeEnd | `(value: number, axis: "width" \| "height") => void` | — | 结束调整回调 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
