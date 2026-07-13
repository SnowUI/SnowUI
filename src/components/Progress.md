# Progress 进度组件

> **版本**: v1.1.2
> **职责**: 提供长条形与圆形进度反馈。

**继承**: 复用 Frame.svelte 的通用能力。
**默认能力开关**: `enableResponsive=false`, `enableContext=true`, `enableScaleObserver=false`, `enableDefaultMotion=true`。

## 布局模型

主布局模型：**复合管理布局**。

- `variant="line"`：label 保持显式组合模式，与长条轨道纵向排列，默认 gap 为 4px；label 区域横向占满 Progress 可用宽度。
- `variant="circle"`：`showLabel=true` 时内置生成 Text，与 SVG 圆环重叠并默认居中；默认不显示。
- 空的直系 `as="label"` 自动显示实时 `value`；显式 label 内容保持不变。
- label 默认排版为 12px / 16px，不限制外部自定义文字、字号和颜色。
- line 不提供内置 label：其常见结构是标题、状态与百分比的横向信息区，单一内置文本无法确定内容和对齐语义。

## 关键字

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `value` | `number` | `0` | 百分比进度，自动 clamp 到 0–100 |
| `variant` | `"line" \| "circle"` | `"line"` | 长条形或圆形 |
| `size` | `number \| string` | `16` | 圆形宽高；与 Spinner 默认一致 |
| `thickness` | `number \| string` | line 确定态 `4`；circle 与不确定态为 size 的 `15%`（size=16 时 2.4px） | 长条形高度或圆环粗细；circle / 不确定态对齐 Spinner 环宽 |
| `background` | `SnowUIColor \| string` | `"Black4"` | 轨道底色 |
| `color` | `SnowUIColor \| string` | `"Primary"` | 填充颜色 |
| `isIndeterminate` | `boolean` | `false` | 不确定态 |
| `showLabel` | `boolean` | `false` | 仅 circle 生效；确定态下生成显示实时 value 的内置 Text |
| `loopMotion` | `LoopMotionConfig` | - | 覆盖不确定态循环时序 |
| `parts` | `{ Text? }` | - | 配置 circle 的内置 Text label |
| `children` | `Snippet` | - | 显式 label 组合；存在时替换 circle 内置 label |

## 示例

```svelte
<Progress value={60}>
  <Frame as="label" row class="justify-between">
    <Text>Loading</Text>
    <Text>60%</Text>
  </Frame>
</Progress>

<Progress variant="circle" value={50} size={32} showLabel />

<Progress value={60}>
  <Text as="label">60%</Text>
</Progress>
```

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

- **实现**: [./Progress.svelte](./Progress.svelte)
- **颜色协议**: [../lib/color.md](../lib/color.md)
- 长条形不确定态使用局部平移关键帧，但时序消费 Frame `loopMotion` bridge。
- 圆形不确定态在内部圆环 Frame 上使用 `loopMotion.preset="rotateClockwise"`，中心 label 不参与旋转。
- circle / 不确定态默认几何对齐 Spinner：size=16px，thickness=size×15%（16px 时 2.4px）。
- line 确定态 thickness 默认 4px。
- 空的直系 `as="label"` 由组件自动写入实时值；显式内容不被改写。

## 更新日志 (Changelog)

### v1.1.2 (2026-07-12)

- circle 与不确定态默认 size / thickness 对齐 Spinner：16px / size×15%（2.4px）；line 确定态 thickness 仍为 4px。

### v1.1.1 (2026-07-12)

- 曾将 thickness 统一为 4px；随后被 v1.1.2 按 Spinner 几何回退 circle / 不确定态。

### v1.1.0 (2026-07-04)

- circle 新增默认关闭的 `showLabel` 内置模式，内部生成 Text，默认排版 12px / 16px。
- 新增 `parts.Text`；显式 children 存在时替换内置 label。
- line 维持显式 label 组合模式，避免锁定标题、状态与百分比的布局语义。
- circle 不确定态默认尺寸与粗细对齐 Spinner circle：16px / 15% 环宽。

### v1.0.1 (2026-06-02)

- 空的直系 `as="label"` 自动显示实时值。
- label 默认排版调整为 12px / 16px。

### v1.0.0 (2026-06-01)

- 新增长条形与圆形 Progress、自由尺寸、共享粗细、自由 label、语意色与 indeterminate 动效。
- 长条形 label 区域默认铺满可用宽度；需要两端分布时，外部 label Frame 显式使用 `row class="justify-between"`。
