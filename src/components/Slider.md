# Slider 滑动输入组件

> **版本**: v1.1.2
> **职责**: 提供单值、区间、水平、纵向与可切割 steps 的滑动输入。

**继承**: 复用 Frame.svelte 的通用能力。
**默认能力开关**: `enableResponsive=false`, `enableContext=true`, `enableScaleObserver=false`, `enableDefaultMotion=true`。

## 布局模型

主布局模型：**复合管理布局**。

- 轨道和填充统一使用 SVG line 绘制：默认粗细 4px、轨道 `Black4`、填充 `Primary`，通过 `stroke-linecap="round"` 保证任意粗细均有真实圆头。
- 拖动块固定为 `20px × 14px`，默认使用固定白色与 `0 1px 2px rgba(0, 0, 0, 0.4)` 阴影。
- 鼠标常态隐藏拖动块；hover、`focus-visible`、拖动中显示；触控设备常驻显示。
- label 采用默认内置模式，默认不显示；`showLabel=true` 时自动生成 Text，并显示对应拖动块的实时值。Range 自动生成两个 Text。
- 内置 label 默认排版为 12px / 16px，可通过 `parts.Text` 配置。显式 `<Text as="label">` 内容保持原样并替换内置 label。
- 水平 label 位于拖动块上方，纵向 label 位于拖动块左侧，默认间距均为 2px；label 只在 hover 时显示。
- Range Slider 使用两个直系 `as="label"` 内容时，按顺序分别跟随起点和终点拖动块。

## 关键字

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `value` | `number \| number[]` | `0` | 当前值；数组表达双拖动块 Range Slider；支持 `bind:value` |
| `minValue` | `number` | `0` | 最小值 |
| `maxValue` | `number` | `100` | 最大值 |
| `step` | `number` | `1` | 步进值 |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | 轨道方向 |
| `showSteps` | `boolean` | `false` | 使用 1px 透明缝隙按照 step 切割轨道与填充条 |
| `showLabel` | `boolean` | `false` | 是否生成跟随拖动块的内置 Text label；Range 自动生成两个 |
| `thickness` | `number \| string` | `4` | SVG 轨道与填充描边粗细；`1` 与 `2` 分别输出 1px、2px 实色描边 |
| `background` | `SnowUIColor \| string` | `"Black4"` | 轨道底色 |
| `color` | `SnowUIColor \| string` | `"Primary"` | 填充条颜色 |
| `thumbColor` | `SnowUIColor \| string` | `"StaticWhite100"` | 拖动块颜色 |
| `disabled` | `boolean` | `false` | 禁用交互 |
| `name` | `string` | - | 原生表单字段名 |
| `ariaLabel` | `string \| string[]` | - | 单值可访问名称；Range 可分别声明两个名称 |
| `parts` | `{ Text? }` | - | 配置 `showLabel` 生成的内置 Text |
| `children` | `Snippet` | - | 显式组合入口；可放置一至两个直系 `Text as="label"` 并替换内置 label |

`gap` 沿用 Frame 关键字，但在 Slider 中用于覆盖 label 与拖动块间距。数字仍使用 Frame gap 倍率语义；默认值为 2px。

## 示例

```svelte
<script lang="ts">
  let value = $state(12);
  let range = $state([3, 12]);
</script>

<Slider bind:value showLabel />

<Slider bind:value={range} showLabel ariaLabel={["最小值", "最大值"]} />

<div style="height: 120px;">
  <Slider orientation="vertical" bind:value />
</div>

<Slider value={60} step={10} showSteps />

<Slider value={60}>
  <Text as="label">60%</Text>
</Slider>
```

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

- **实现**: [./Slider.svelte](./Slider.svelte)
- **颜色协议**: [../lib/color.md](../lib/color.md)
- 视觉层与交互层分离：视觉层输出 SnowUI track / fill / thumb；透明原生 range input 保留键盘、ARIA 与表单能力。
- Range Slider 渲染两个原生 range input；拖动轨道时选择距离最近的拖动块。
- steps 只在固定尺寸的 track 上使用 CSS mask 生成 1px 透明缝隙；父级 mask 同时裁切内部 fill，切割线不会随填充宽度移动，也不假设页面背景色。

## 更新日志 (Changelog)

### v1.1.2 (2026-08-03)

- 轨道与填充全部改为 SVG line，以 `stroke-width` 直接消费 `thickness`、以 `stroke-linecap="round"` 绘制圆头；1px 与 2px 不再受 HTML 极细矩形圆角栅格化影响，颜色保持原始实色。

### v1.1.1 (2026-08-03)

- 曾尝试仅对数字 `thickness={1}` 特化极细轨道；该实现已由 v1.1.2 的统一 SVG line 绘制替代。

### v1.1.0 (2026-07-04)

- label 升级为默认内置模式；默认关闭，通过 `showLabel` 开启。
- 单值自动生成一个 Text，Range 自动生成两个 Text；通过 `parts.Text` 配置内置实例。
- 保留显式 `<Text as="label">` 作为自定义内容入口，默认字号维持 12px。

### v1.0.3 (2026-06-02)

- steps mask 收敛到固定尺寸 track，修复切割线随拖动块移动以及 fill 被错误裁切的问题。

### v1.0.2 (2026-06-02)

- 空 `as="label"` 自动注入对应拖动块的实时值；label 默认排版调整为 12px / 16px。

### v1.0.1 (2026-06-02)

- 按更新后的 Figma 节点 `12550:576` 将拖动块调整为 `20px × 14px`、全圆角白底与 `0 1px 2px rgba(0, 0, 0, 0.4)` 阴影。

### v1.0.0 (2026-06-01)

- 新增单值、Range、水平、纵向、steps、自由 label、语意色、表单与键盘支持。
