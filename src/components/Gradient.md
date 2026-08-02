# Gradient 矢量渐变

> **版本**: v2.8.5
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
- 普通 Gradient 默认开启四层 `15s` 闭环动效；Avatar fallback 默认关闭基础形变，可通过 `motion` / `gradientMotion` 显式开启。
- 作为 `Avatar fallback` 渲染时，Gradient 根据 Avatar 传入的 `seed` 稳定选择六种配色；若 seed 本身是 `blue / cyan / green / red / orange / purple`，则直接命中对应配色。
- Avatar hover 状态由 Avatar 的统一 `.snowui-media-hoverable` 协议提供；Gradient 自己排除当前 variant，将其余五种 Gradient 的中心主色按实例稳定打乱，并以双层同色 `overlay` 持续交叉过渡。
- 头像变色不复制完整 Gradient：每个候选色使用两个同步的 HTML 纯色 Overlay pass，覆盖在完整 SVG 之上并分别执行混合；单层峰值限制为 `58%`，五色循环为 `10s`，通过 `0.5s` 渐显缓冲进入。
- `prefers-reduced-motion: reduce` 下停止内部循环并恢复未经 transform 的静态设计基线。

## API

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `variant` | `"blue" \| "cyan" \| "green" \| "red" \| "orange" \| "purple"` | `"blue"` | 选择 Frame 200 从左到右对应的六种固定配色 |
| `seed` | `string \| number` | - | 仅在 `as="avatar-image"` 且未显式传 `variant` 时用于稳定选择六种配色；配色名可直接命中对应 variant |
| `size` | `number \| string` | - | 同时设置宽高；优先级高于 `width` / `height` |
| `width` | `number \| string` | `360` | 宽度；数字值按 px 处理 |
| `height` | `number \| string` | `360` | 高度；数字值按 px 处理 |
| `radius` | `number \| string` | `0` | 外部裁切圆角；数字值按 px 处理 |
| `motion` | `boolean` | 普通 Gradient 为 `true`；`as="avatar-image"` 为 `false` | 控制四个 SVG 有色图层的持续 transform 动效；不影响 Avatar hover 的多色 Overlay |
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

`motion` 只决定基础矢量形变是否运行。Test 的 GD-05 提供 19 条控制条：时长、整体速度、四项缓动坐标以及四层全部 13 项幅度参数；控制条以四列网格排列在图形下方，并以每条控制的可调上限初始化。

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

<!-- 需要基础矢量持续形变时显式开启 -->
<Avatar gradientMotion data-name="Animated Gradient avatar" size={80} />
```

Avatar 会向 Gradient fallback 传入 `as="avatar-image"`、稳定 seed 与 `gradientMotion` 开关。默认头像的基础矢量形变关闭，但 hover 的颜色序列和 Overlay 绘制仍由 Gradient 完整负责；hover 时会在圆形裁切内持续过渡到当前 variant 之外的五种颜色。

## 矢量与缩放

- 画布：`360 × 360`。
- 图层顺序：底色矩形 → Vector 4 → Vector 3 → Subtract → Subtract 2。
- 椭圆模糊：`stdDeviation=60 / 60`。
- 路径模糊：`stdDeviation=40 / 50`。
- 每个实例通过 `$props.id()` 生成独立的 clipPath / filter ID，页面同时出现多个 variant 时不会串用滤镜。
- SVG viewport 负责统一缩放全部几何与 filter region；组件不读取实际像素尺寸，也不重新计算 blur。
- 非正方形宽高按 Figma Fill 行为分别缩放 X / Y 轴。

## 动效与性能

- 底色矩形和 SVG 根层保持静止；开启 `motion` 后，单个实例只在四个有色 `<g>` 上运行 CSS transform keyframes。
- 动画只使用 `translate3d + rotate + scale / scaleX / scaleY`，并仅在 `motion` 开启时为这四个活动图层使用 `will-change: transform`。
- 四个 `feGaussianBlur` 的标准差、滤镜区域、SVG 路径与固定颜色在循环中保持不变。
- 原始五层不动画 `fill`、`mix-blend-mode`、`feBlend` 或 Gaussian Blur；Avatar hover 只在五组双层同色的 80px 纯色 Overlay 间交叉动画 opacity。每层使用独立 HTML 合成元素执行 `overlay`，确保 backdrop 是已经完整渲染的 Gradient SVG，而不是 SVG 内部隔离的滤镜子树。
- 颜色顺序仅在组件求值时由 seed 与实例 ID 稳定打乱；运行期间不使用 JavaScript 动画、`requestAnimationFrame`、Canvas、ResizeObserver 或计时器。
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
- 普通 Gradient 默认播放四个有色 SVG 图层的独立 transform 动效；Avatar fallback 默认关闭，可由 Gradient `motion` 或 Avatar `gradientMotion` 开启。
- 基础形变开关不参与 Avatar hover 颜色 Overlay；关闭基础形变时，认可版本的五色四层同色 Overlay 结构、10s 循环、0.5s 入口缓冲和 58% 峰值保持不变。
- 不使用 Svelte transition、WAAPI、Canvas、JavaScript 动画循环或定时器。
- 常态动效不得改变已确认的六种配色、路径、图层顺序和 blur 基线；Avatar hover 允许通过独立 Overlay 改变合成后的可见色调。
- reduced-motion 是“始终运动”的无障碍例外，系统请求减少动态时必须停止。

---

## 更新日志 (Changelog)

### v2.8.5 (2026-08-02)

- 新增 `motion` 基础形变开关：普通 Gradient 默认开启，Avatar fallback 默认关闭。
- 关闭基础形变时不挂载 transform animation 与 `will-change`；Avatar hover 的认可版本多色 Overlay 保持不变。

### v2.8.4 (2026-08-02)

- 修复 Avatar hover 颜色层在循环边界反复闪烁：关键帧 `100%` opacity 从错误的 `1` 恢复为与 `0%` 相同的 `0.58`。
- 五组错峰颜色层现在均以完全相同的起止状态闭环，相邻颜色仍保持连续交叉淡化。

### v2.8.3 (2026-08-02)

- 修复 SVG clip / filter 合成上下文导致 `mix-blend-mode: overlay` 退化为近似纯色染色的问题。
- 双层颜色 Overlay 从 SVG `<g>` 移到完整 SVG 上方的 HTML 合成层，使每次混合都以原 Gradient 图形作为 backdrop，保留其明暗与渐变纹理。

### v2.8.2 (2026-08-02)

- 修复双层纯色峰值为 100% 时压平原 Gradient 纹理的问题：两层改为独立 Overlay pass，单层峰值限制为 58%。
- 根据“颜色变化太快”将五色循环时长由 `5s` 增加为 `10s`；每个相邻颜色拥有更长的交叉淡化时间，不发生离散跳色。

### v2.8.1 (2026-08-02)

- Avatar hover Overlay 的显现时长由 `0.15s` 调整为 `0.5s`，使用标准 ease-in-out 缓动，让双层颜色强度与 5s 循环运动自然渐入。
- 动画仍在 hover 时直接以目标速度运行，但由合成层渐显遮蔽启动跳变，不增加 JavaScript 调速、计时器或逐帧计算。

### v2.8.0 (2026-08-02)

- Avatar 每个候选色从单层 Overlay 改为两层完全同步的同色 Overlay，每层分别使用 `overlay` 混合，增强色调变化。
- 五色循环由 `10s` 缩短为 `5s`，颜色过渡速度提高至 2 倍。
- 单个头像仅增加到十个纯色 opacity 层，仍不复制 Gaussian Blur 图形。

### v2.7.0 (2026-08-02)

- Avatar 继续统一提供 hover 状态，Gradient 改为自行管理颜色变化：排除当前 variant 后，将其余五色按实例打乱并持续交叉过渡。
- 删除旋转 / 缩放的 `screen` 渐变带，改用六种 Gradient 的中心主色作为固定 `overlay` 叠加色。
- 为避免复制完整静态 Gradient 带来的 Gaussian Blur 开销，候选色只渲染为五个 80px 纯色矩形且仅动画 opacity。

### v2.6.0 (2026-08-02)

- GD-04 改为六个 `80 × 80` Avatar，逐一展示 blue、cyan、green、red、orange、purple 六种 Gradient fallback。
- Gradient 在 Avatar fallback 模式下按 seed 稳定选择配色；显式 variant 仍拥有最高优先级。
- Avatar hover 新增持续的 `screen` 颜色叠加带，只动画小尺寸叠加层的 transform；reduced-motion 下停止循环并保留静态颜色反馈。

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
