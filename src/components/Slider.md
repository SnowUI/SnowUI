# Slider 滑动输入组件

> **版本**: v1.4.1
> **职责**: 提供单值、区间、水平、纵向、可切割 steps 与填充式视觉变体的滑动输入。

**继承**: 复用 Frame.svelte 的通用能力。
**默认能力开关**: `enableResponsive=false`, `enableContext=true`, `enableScaleObserver=false`, `enableDefaultMotion=true`。

## 布局模型

主布局模型：**复合管理布局**。

- 轨道、填充条与拖动块规则复用 Progress：默认粗细 4px、轨道 `Black4`、填充 `Primary`、全圆角。
- 拖动块固定为 `20px × 14px`，默认背景为 `Static White/80%`，含 `0.5px` 白色 Inside Stroke（inset shadow）与 `blur(2px)` 背景模糊；drop shadow 保持 `0 1px 2px rgba(0, 0, 0, 0.4)` 不变。
- 鼠标常态隐藏拖动块；hover、`focus-visible`、拖动中显示；触控设备常驻显示。
- label 采用默认内置模式，默认不显示；`showLabel=true` 时自动生成 Text，并显示对应拖动块的实时值。Range 自动生成两个 Text。
- 内置 label 默认排版为 12px / 16px，可通过 `parts.Text` 配置。显式 `<Text as="label">` 内容保持原样并替换内置 label。
- 水平 label 位于拖动块上方，纵向 label 位于拖动块左侧，默认间距均为 2px；label 只在 hover 时显示。
- Range Slider 使用两个直系 `as="label"` 内容时，按顺序分别跟随起点和终点拖动块。
- `solid` / `soft` 是 Workshop `14458:37835` 的两种 32px 条形变体：水平容器默认高 32px、圆角 8px，填充区域扩展为完整高度且左右两端均保留圆角；`title` 是左侧内置标题，默认 `"Text"`，不属于 label。
- `solid` 为高对比样式：填充默认 `Primary`，覆盖区域的 title、数值 label 与指示器使用 `Static White/100%`；未覆盖文字使用 `Black/100%`。
- `soft` 为主题自适应的低对比样式：填充默认 `Black/10%`，title、数值 label 与指示器均以 `Black/100%` 为基色，随亮色 / 暗色主题 token 变化。
- 两种条形变体的右侧数值均复用其他变体的 label 协议：默认不显示，`showLabel=true` 时生成实时百分比，继续支持 `parts.Text` 与显式 label。数值 label 常态通过独立 `opacity: 0.4` 显示，hover、focus 或拖动时提升到 `opacity: 0.8`。
- title 与数值 label 使用与 Slider 等宽、分界绑定 `--snowui-slider-end` 的文字背景裁切；分界可穿过单个字形并随点击、拖动连续移动。`solid` 在覆盖区域切换为白色；`soft` 覆盖前后均保持 `Black/100%`。
- 条形变体的拖动块改为“可拖动”指示器，位于填充右缘内侧 4px；值为 0 时位于 Slider 左边框内侧 4px。鼠标常态隐藏，hover、focus 或拖动时以中心点为动效中心渐显、短变长、细变粗，退出时执行反向动效；时序与 easing 引用 generic Frame preset。
- `thickness` 同时控制条形变体的整体高度；`default` 仍为 4px，`solid` / `soft` 默认 32px。
- `solid` / `soft` + `showSteps` 使用固定 `Black/10%` 的 2px 圆点，只渲染内部刻度，不显示 0% / 100% 端点；圆点不响应 hover，也不随填充覆盖范围改变颜色。条形变体当前只定义水平布局，纵向 Slider 继续使用 `default` 视觉。

## 关键字

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `value` | `number \| number[]` | `0` | 当前值；数组表达双拖动块 Range Slider；支持 `bind:value` |
| `minValue` | `number` | `0` | 最小值 |
| `maxValue` | `number` | `100` | 最大值 |
| `step` | `number` | `1` | 步进值 |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | 轨道方向 |
| `variant` | `"default" \| "solid" \| "soft"` | `"default"` | `solid` 为高对比条形样式；`soft` 为使用 Black token 的主题自适应低对比条形样式 |
| `title` | `string` | `"Text"` | `solid` / `soft` 左侧内置标题；空字符串可隐藏；不是 label |
| `showSteps` | `boolean` | `false` | 使用 1px 透明缝隙按照 step 切割轨道与填充条 |
| `showLabel` | `boolean` | `false` | 是否生成跟随拖动块的内置 Text label；Range 自动生成两个 |
| `thickness` | `number \| string` | `4`；`solid` / `soft` 为 `32` | 轨道粗细；在条形变体中控制整体高度 |
| `background` | `SnowUIColor \| string` | `"Black4"` | 轨道底色 |
| `color` | `SnowUIColor \| string` | `"Primary"`；`soft` 为 `"Black10"` | 填充条颜色；显式传值可覆盖变体默认值 |
| `thumbColor` | `SnowUIColor \| string` | `"StaticWhite80"` | 拖动块颜色 |
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

<Slider value={74} variant="solid" title="Text" showLabel />

<Slider value={0} step={25} showSteps showLabel variant="solid" />

<Slider value={0} variant="solid" title="Volume" thickness={40} showLabel />

<Slider value={74} variant="soft" title="Text" showLabel />
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

### v1.4.1 (2026-08-06)

- `solid` / `soft` 分段点不再渲染 0% 和 100% 两个端点；内部圆点固定使用 `Black/10%`，hover 与填充覆盖时均不变色。

### v1.4.0 (2026-08-06)

- `filled` 重命名为更准确的 `solid`，并新增共享相同条形几何的 `soft` 变体。
- `soft` 默认使用 `Black/10%` 填充；title、数值 label 与指示器使用 `Black/100%` 基色，以适配亮色和暗色主题。
- 条形圆角覆盖入口由 `--snowui-slider-filled-radius-override` 重命名为 `--snowui-slider-bar-radius-override`。

### v1.3.0 (2026-08-06)

- `filled` title 与数值 label 改为实时逐像素分色：黑色填充覆盖区域为白色，未覆盖区域为黑色，文字分界与填充右缘共用实时百分比并随拖动连续移动。

### v1.2.4 (2026-08-06)

- `filled` 数值 label 常态透明度由 20% 提升到 40%，hover、focus 与拖动时由 40% 提升到 80%，修复 100% 填充时白色 label 不清晰的问题。

### v1.2.3 (2026-08-06)

- `filled` 指示器高度由 12px 调整为 8px，保持 2px 宽、全圆角、中心点双轴缩放以及 generic Frame preset 的时长与 easing。

### v1.2.2 (2026-08-06)

- `filled` 指示器调整为 2px × 12px 全圆角胶囊；在黑色填充内固定使用 `Static White/100%`。
- 指示器以图形中心点为基准，从 50% 宽度和高度渐显至完整尺寸；消失时反向缩短、变细并渐隐。

### v1.2.1 (2026-08-06)

- `filled` 新增内置可配置 `title`（默认 `"Text"`），并将右侧百分比统一到既有 `showLabel` / `parts.Text` / 显式 label 协议。
- `filled` 的 `thickness` 默认值为 32px，并可使用与其他变体相同的 prop 或 CSS override 定制整体高度。
- 填充右缘保留 8px 圆角；指示器固定在填充右缘内侧 4px，0 值时固定在 Slider 左边框内侧 4px。

### v1.2.0 (2026-08-06)

- 新增 `filled` 水平视觉变体：32px 高、8px 圆角、完整高度填充、左侧 label 与右侧实时百分比。
- hover、focus 与拖动时在填充边缘显示指示器；出现 / 消失复用 generic Frame preset 的 opacity、scale、duration 与 easing，并支持 reduced motion。
- `filled + showSteps` 新增 2px 圆点分段样式。

### v1.1.1 (2026-08-06)

- thumb 默认背景更新为 `Static White/80%`（`--static-white-80`）；新增 `0.5px` 白色 Inside Stroke（inset shadow）与 `blur(2px)` 背景模糊。
- 原有 drop shadow 保持不变。

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
