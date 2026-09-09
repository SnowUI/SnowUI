# Text Motion 共享能力

> **版本**: v1.5.0  
> **职责**: 为 PRO 文字动效组件提供统一内容标准化、排版、字符重组、自然字宽布局、启动序列、颜色动效和减少动效判断。

## 模块

| 文件 | 职责 |
| :--- | :--- |
| `types.ts` | 六项排版 Props、`motionColor` 与默认无变化色的类型契约 |
| `format.ts` | 字符串 / 数字内容标准化，数字统一使用 `Intl.NumberFormat` |
| `typography.ts` | SnowUI Token、PascalCase 语意色和组件 CSS 变量样式生成 |
| `preference.ts` | opt-in 的 `prefers-reduced-motion` 判断 |
| `color.ts` | SlotText 语义的单色 / `chromatic()` 逐字符颜色与落地后颜色回落 |
| `numeric.ts` | 数字提取、增加 / 减少趋势解析与低位到高位顺序 |
| `animation.ts` | 内部动画差值叠加与透明度交接；具体方向、位移和时序由组件传入 |
| `layout.ts` | grapheme 拆分、LCP/LCS diff、自然字宽测量与区段 FLIP |
| `sequence.ts` | `NumericText` 自适应 stagger 与 SlotText / FlowText 槽位路径的统一 `25ms` 启动间隔 |
| `character.ts` | 通用字符重组运行时：LCP/LCS 三段 diff、不变区段边缘 FLIP、变化节点进退场生命周期、趋势方向、启动顺序、清理与变化色生命周期；FlowText 通过内部 colorAllCharacters 选项按目标全文统一编排颜色回落顺序，NumericText 保持仅变化字符着色；视觉 keyframes 由组件注入 |

`NumericText` 与 `FlowText` 的非数字内容统一使用 `character.ts` 完成字符重组，但各组件必须显式注入自己的字符视觉。共享层不得定义缩放、旋转、模糊、透明度等组件视觉；NumericText 私有视觉完整复刻 `numeric-text-main`，包含垂直位移、缩放、旋转、模糊与可见性淡入淡出。

## 与 Frame 动效的边界

- 共享能力不依赖 Frame 默认动效、`while*` 或 bridge 时序，可以自行使用 WAAPI、`requestAnimationFrame`、Svelte transition 等内部实现。
- 组件根必须保留 `FramePro` 和 FrameProps 透传，且 `enableDefaultMotion` 默认遵循 Frame 的 `true`，使默认动效、显式 `while*` 与父级编排可以控制组件整体。
- 字符 / 数位动画只能作用于内部承载层，不得覆盖根 `FramePro` 的 `opacity`、`transform` 或状态样式。
- 仅服务内部测量、宽度轨道等算法节点的嵌套 Frame 可以显式关闭默认动效，但不得影响组件根。

颜色回落的旧 finish / cancel 事件只释放自身登记，不能清除快速更新后的新动画。
