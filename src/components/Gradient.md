# Gradient 矢量渐变

> **版本**: v2.5.0
> **职责**: 以可缩放 SVG 矢量绘制 Workshop Frame 200 的六种固定渐变视觉，并让四个有色图层持续柔和形变。
> **包归属**: OSS

Gradient 完全重写为六种 SVG 矢量渐变。六种配色共用同一套 `360 × 360` 几何：底色矩形、两枚旋转椭圆和两条曲线路径；每个图层使用 Figma 原始模糊参数与固定色值。组件不加载 PNG 或外部 SVG 文件。

当前版本固定底色矩形，只让 Vector 4、Vector 3、Subtract、Subtract 2 四个有色模糊图层独立运动。动效仅修改各图层的合成 `transform`，不逐帧修改滤镜、路径、颜色或混合模式。

## 布局模型

主布局模型：内禀原子布局。

- 根节点为 `Frame`，内部只包含一个私有 SVG 画布。
- 组件不接受 children，不使用 Leading / Content / Trailing，不提供 `parts`。
- 默认画布为 `360 × 360`，默认无圆角；`size` 或 `width` / `height` 可改变外部几何。
- SVG 使用 `viewBox="0 0 360 360"` 与 `preserveAspectRatio="none"` 填满画布。
- 四个 `feGaussianBlur` 使用 `filterUnits="userSpaceOnUse"`。图形通过 SVG viewport 缩放时，模糊标准差与几何一起按比例缩放，不使用固定屏幕像素模糊，也不需要尺寸观察器。
- 根层使用纯 alpha mask 将圆角与 SVG filter 固定在同一合成裁切层，避免圆角最外圈露出渐变底色毛边。
- 四个有色图层以 `15s` 完成一次闭环：Vector 4 位移并旋转、Vector 3 位移并缩放、Subtract 位移并非等比形变、Subtract 2 位移并旋转缩放；各自使用不同关键帧节奏。
- `prefers-reduced-motion: reduce` 下停止内部循环并恢复未经 transform 的静态设计基线。

## API

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `variant` | `"blue" \| "cyan" \| "green" \| "red" \| "orange" \| "purple"` | `"blue"` | 选择 Frame 200 从左到右对应的六种固定配色 |
| `size` | `number \| string` | - | 同时设置宽高；优先级高于 `width` / `height` |
| `width` | `number \| string` | `360` | 宽度；数字值按 px 处理 |
| `height` | `number \| string` | `360` | 高度；数字值按 px 处理 |
| `radius` | `number \| string` | `0` | 外部裁切圆角；数字值按 px 处理 |
| `decorative` | `boolean` | `true` | 装饰图默认隐藏于无障碍树；设为 `false` 时应同时提供 `aria-label` |
| `as` | `string` | - | Frame 角色声明；Avatar 场景可使用 `as="avatar-image"` |

### CSS 动效覆盖

| 变量 | 默认值 | 描述 |
| :--- | :--- | :--- |
| `--snowui-gradient-motion-duration-override` | `15s` | 四层共用的实际循环时长；对应 GD-05 默认基础时长 `60s ÷ 4×` |
| `--snowui-gradient-motion-easing-override` | `cubic-bezier(1, 1, 1, 1)` | 四层各段缓动 |
| `--snowui-gradient-motion-vector-4-x-amplitude-override` / `--snowui-gradient-motion-vector-4-y-amplitude-override` | `12%` / `12%` | Vector 4 位移幅度 |
| `--snowui-gradient-motion-vector-4-rotate-amplitude-override` | `20deg` | Vector 4 旋转幅度 |
| `--snowui-gradient-motion-vector-3-x-amplitude-override` / `--snowui-gradient-motion-vector-3-y-amplitude-override` | `12%` / `12%` | Vector 3 位移幅度 |
| `--snowui-gradient-motion-vector-3-scale-amplitude-override` | `0.25` | Vector 3 放大 / 缩小幅度 |
| `--snowui-gradient-motion-subtract-x-amplitude-override` / `--snowui-gradient-motion-subtract-y-amplitude-override` | `12%` / `12%` | Subtract 位移幅度 |
| `--snowui-gradient-motion-subtract-deform-amplitude-override` | `0.25` | Subtract X/Y 反向非等比缩放形变幅度 |
| `--snowui-gradient-motion-subtract-2-x-amplitude-override` / `--snowui-gradient-motion-subtract-2-y-amplitude-override` | `12%` / `12%` | Subtract 2 位移幅度 |
| `--snowui-gradient-motion-subtract-2-rotate-amplitude-override` | `20deg` | Subtract 2 旋转幅度 |
| `--snowui-gradient-motion-subtract-2-scale-amplitude-override` | `0.25` | Subtract 2 放大 / 缩小幅度 |

组件不提供暂停或随机动效 Prop。Test 的 GD-05 提供 19 条控制条：时长、整体速度、四项缓动坐标以及四层全部 13 项幅度参数；控制条以四列网格排列在图形下方，并以每条控制的可调上限初始化。

## 六种配色

| `variant` | Figma Frame | 底色 | Vector 4 | Vector 3 | Subtract | Subtract 2 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `blue` | 196 | `#290082` | `#58B7FF` | `#6560FF` | `#3AF2FC` | `#D4E6FE` |
| `cyan` | 199 | `#0B005A` | `#5BE4FF` | `#00A5BE` | `#31FF83` | `#D4FEEF` |
| `green` | 197 | `#000A4E` | `#3DE680` | `#16B335` | `#C6F94F` | `#DFFED4` |
| `red` | 194 | `#320061` | `#FF7CB0` | `#FC3551` | `#F9E84F` | `#FED4D5` |
| `orange` | 198 | `#EC2300` | `#FFC654` | `#FF6C04` | `#FF14AD` | `#FEF0D4` |
| `purple` | 195 | `#1E0069` | `#C6BAFF` | `#F935FC` | `#FFF78E` | `#FED4F5` |

这些颜色是视觉资产自身的固定填色，不是公开颜色 Prop，也不映射主题语意色。

## 使用示例

```svelte
<Gradient variant="blue" />
```

```svelte
<Gradient variant="purple" size={160} />
```

```svelte
<Gradient variant="orange" width={240} height={120} radius={24} />
```

```svelte
<Avatar fallback={Gradient} data-name="Gradient avatar" size={80} />
```

## 矢量与缩放

- 画布：`360 × 360`。
- 图层顺序：底色矩形 → Vector 4 → Vector 3 → Subtract → Subtract 2。
- 椭圆模糊：`stdDeviation=60 / 60`。
- 路径模糊：`stdDeviation=40 / 50`。
- 每个实例通过 `$props.id()` 生成独立的 clipPath / filter ID，页面同时出现多个 variant 时不会串用滤镜。
- SVG viewport 负责统一缩放全部几何与 filter region；组件不读取实际像素尺寸，也不重新计算 blur。
- 非正方形宽高按 Figma Fill 行为分别缩放 X / Y 轴。

## 动效与性能

- 底色矩形和 SVG 根层保持静止；单个实例只在四个有色 `<g>` 上运行 CSS transform keyframes。
- 动画只使用 `translate3d + rotate + scale / scaleX / scaleY`，并仅在这四个活动图层使用 `will-change: transform`。
- 四个 `feGaussianBlur` 的标准差、滤镜区域、SVG 路径与固定颜色在循环中保持不变。
- 不动画 `fill`、`mix-blend-mode`、`feBlend` 或 Gaussian Blur；这些变化会带来持续重绘，已从方案中去除。
- 不使用 JavaScript、Svelte effect、`requestAnimationFrame`、Canvas、ResizeObserver、计时器或随机数。
- `0%` 与 `100%` 使用完全相同的 transform，保证持续循环时不跳帧。
- 图层原始几何和 filter region 均大于画布；动效幅度限制在安全范围内并继续由固定 clipPath 裁切。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| Gradient | [Gradient.svelte](./Gradient.svelte) | 六种 SVG 矢量渲染、固定底色与四层独立合成 transform |
| Test 示例 | [Gradient.test.ts](./Gradient.test.ts) | 六种配色、模糊缩放、持续动效、非正方形和裁切组合验证 |
| Test 调参器 | [GradientMotionController.svelte](../test/GradientMotionController.svelte) | 在 Test 沙箱内保存 19 项调参状态并实时写入 Gradient CSS override；四列排列于图形下方，不属于公开组件 |

### 组合模式

Gradient 是无 children、无内置公开子组件的原子视觉组件，组合模式为“不适用”，不提供 `parts`。

### 动效边界

- 根 Frame 固定 `enableDefaultMotion={false}`。
- 内部四个有色 SVG 图层固定持续播放独立合成 transform 动效；底色和 SVG 根层不动，不提供 `speed`、`paused`、`seed` 等运行时 Props。
- 不使用 Svelte transition、WAAPI、Canvas、JavaScript 动画循环或定时器。
- 动效不得改变已确认的六种配色、路径、图层顺序和 blur 基线。
- reduced-motion 是“始终运动”的无障碍例外，系统请求减少动态时必须停止。

---

## 更新日志 (Changelog)

### v2.5.0 (2026-08-02)

- 将 GD-05 全部 19 项动效参数初始化为各自可调范围上限：基础时长 `60s`、整体速度 `4×`、缓动坐标均为 `1`，位移 `12%`、旋转 `20deg`、缩放 / 形变 `25%`。
- Gradient 公开 CSS fallback 同步为上述上限组合；基础时长与速度换算后的默认实际循环时长为 `15s`。

### v2.4.0 (2026-07-30)

- 底色矩形改为始终静止，删除整张 SVG 的统一 transform 动画。
- 四个有色模糊图层分别采用位移 / 旋转、位移 / 缩放、位移 / 非等比形变、位移 / 旋转 / 缩放，并错开关键帧节奏。
- 为控制性能，颜色、混合模式、路径与 Gaussian Blur 全部保持静态；GD-05 更新为四列排列的 19 项控制。

### v2.3.0 (2026-07-30)

- 增强 A/B/C 默认位移，并将默认旋转幅度调整为 `±3deg`、缩放幅度调整为 `5%`，使 `4×` 速度下仍能清楚辨认持续动效。
- Rotate / Scale 从逐关键帧绝对值改为整体变化幅度；时间线自动生成对应的负幅度、中心值与正幅度。
- GD-05 精简为 14 条控制条，以固定四列网格排列在图形下方。

### v2.2.1 (2026-07-30)

- GD-05 新增唯一一条整体速度倍率 Slider，默认 `1×`、范围 `0.1×–4×`。
- 整体速度只换算最终循环时长，不增加第二条动画或 Gradient 运行时脚本。

### v2.2.0 (2026-07-30)

- 将时长、缓动和 A/B/C 三个关键帧的 X、Y、Scale、Rotate 全部落成 CSS override。
- GD-05 通过 Test 专用 `GradientMotionController` 增加 17 条控制条，可实时调整全部动效参数；控制状态不进入 Gradient 运行时。

### v2.1.0 (2026-07-30)

- 增加持续柔和的低频漂移动效。
- 单实例只动画 SVG 根层 `transform`，不逐帧重算 Gaussian Blur、路径或颜色。
- 默认循环时长为 `24s`，支持 `--snowui-gradient-motion-duration-override` 外部覆盖。
- `prefers-reduced-motion: reduce` 下停止循环并恢复静态设计基线。

### v2.0.1 (2026-07-30)

- 根层增加纯 alpha mask，修复带 SVG filter 的内容在圆角 `overflow` 边缘出现有色毛边的问题。

### v2.0.0 (2026-07-30)

#### 破坏性重写

- 删除旧版 Workshop 图层 `c` PNG 渲染与 `355 × 355` 静态裁切方案。
- 按 Workshop Frame 200 重绘六种 `360 × 360` SVG 矢量配色。
- 新增 `variant="blue|cyan|green|red|orange|purple"`。
- 默认尺寸调整为 `360 × 360`，默认圆角调整为 `0`。
- 删除无视觉作用的 `seed` 兼容参数。
- SVG 模糊随 viewBox 几何同步缩放。
- 静态阶段显式关闭 Frame 默认动效。
