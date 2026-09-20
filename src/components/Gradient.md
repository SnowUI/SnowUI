# Gradient 矢量渐变

> **版本**: v2.13.2
> **职责**: 以可缩放 SVG 矢量绘制 Workshop Frame 200 的六种固定渐变视觉，并以预栅格图层保持四层柔和形变。
> **包归属**: OSS

Gradient 使用六种 SVG 矢量渐变。六种配色共用同一套 `360 × 360` 几何：底色矩形、两枚旋转椭圆和两条曲线路径；每个图层使用 Figma 原始模糊参数与固定色值。静态 Avatar 复用包内 SVG 文件，活动图层使用模块级缓存的 SVG data source；不加载 PNG 或网络资源。

当前版本固定底色矩形，只让 Vector 4、Vector 3、Subtract、Subtract 2 四个有色模糊图层独立运动。Gaussian Blur 在 SVG 图片解码时一次生成，运行中的 DOM 不包含 SVG filter；动效仅修改承载已栅格结果的 HTML 图层 `transform`，不逐帧修改滤镜、路径、颜色或混合模式。

## 组件介绍

以柔和的多层渐变丰富背景与占位画面，提供六种配色与可缩放的形变效果。

## 布局模型

主布局模型：内禀原子布局。

- 根节点为 `Frame`；普通 Gradient / 开启动效的 Avatar 使用固定底色和四张透明 SVG 图层图片，静态 Avatar 使用六种按 palette 复用的包内完整 SVG 图片资源。
- 组件不接受 children，不使用 Leading / Content / Trailing，不提供 `parts`。
- 默认画布为 `360 × 360`，默认无圆角；`size` 或 `width` / `height` 可改变外部几何。
- 可见几何沿用 `0 0 360 360` 坐标系；静态 SVG 使用该 `viewBox`，活动图层则在同一坐标系外扩 overscan，并以 `preserveAspectRatio="none"` 填满画布。
- 四张活动图层图片保留 `filterUnits="userSpaceOnUse"` 的 `feGaussianBlur`；普通 Gradient 的 Subtract 2 使用 `800 × 800` overscan，其他三层使用 `600 × 600`，Avatar 的增强幅度分支全部使用 `720 × 720`。图形随图片 viewport 缩放时，模糊标准差与几何一起按比例缩放，不使用固定屏幕像素模糊，也不需要尺寸观察器。
- 根层使用纯 alpha mask 统一裁切预栅格图层，避免圆角最外圈露出渐变底色毛边。
- 普通 Gradient 默认开启四层 `15s` 闭环动效；Avatar fallback 常态关闭基础形变，可通过 `motion` / `gradientMotion` 显式常驻开启，或在 hover 期间按需运行水波形变。
- 作为 `Avatar fallback` 渲染时，Gradient 根据 Avatar 传入的 `seed` 稳定选择六种配色；若 seed 本身是 `blue / cyan / green / red / orange / purple`，则直接命中对应配色。
- Avatar hover 状态由 Avatar 的统一 `.snowui-media-hoverable` 协议提供；Gradient 自己排除当前 variant，将其余五种 Gradient 的中心主色按实例稳定打乱，并以双层同色 `overlay` 持续交叉过渡。
- 头像 hover 以缓存静态图为底，按需创建四个预栅格 SVG 图层和五色 × 两层 HTML 纯色 Overlay；四层采用 `6.4s / 7.2s / 8.4s / 6.8s` 的独立周期、七段非对称路径和增强幅度持续流动。每次进入从六组相位 / 方向配置中随机选择且不与上次重复，颜色循环仍为 `10s`。两者以 `1s` 淡入、`0.5s` 淡出，离开后完整卸载。
- Gradient 通过模块级共享 `IntersectionObserver` 在离开视口 `128px` 预热范围后暂停内部 transform 并释放 `will-change`；浏览器不支持该能力时保持原有持续动效，不影响视觉与语义。
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
| `motion` | `boolean` | 普通 Gradient 为 `true`；`as="avatar-image"` 为 `false` | 控制四个 SVG 有色图层是否常驻运行；Avatar 为 false 时仍会在 hover 期间按需运行水波形变，不影响多色 Overlay |
| `decorative` | `boolean` | `true` | 装饰图默认隐藏于无障碍树；设为 `false` 时应同时提供 `aria-label` |
| `as` | `string` | - | Frame 角色声明；Avatar 场景可使用 `as="avatar-image"` |

### CSS 动效覆盖

| 变量 | 默认值 | 描述 |
| :--- | :--- | :--- |
| `--snowui-gradient-motion-duration-override` | `15s` | 四层共用的实际循环时长；对应 GD-05 默认基础时长 `60s ÷ 4×` |
| `--snowui-gradient-motion-easing-override` | `steps(90, end)` | 常驻四层每个相邻关键帧区间的更新密度；显式覆盖可恢复连续 easing |
| `--snowui-gradient-motion-vector-4-x-amplitude-override` / `--snowui-gradient-motion-vector-4-y-amplitude-override` | `12%` / `12%` | Vector 4 位移幅度 |
| `--snowui-gradient-motion-vector-4-rotate-amplitude-override` | `20deg` | Vector 4 旋转幅度 |
| `--snowui-gradient-motion-vector-3-x-amplitude-override` / `--snowui-gradient-motion-vector-3-y-amplitude-override` | `12%` / `12%` | Vector 3 位移幅度 |
| `--snowui-gradient-motion-vector-3-scale-amplitude-override` | `0.25` | Vector 3 放大 / 缩小幅度 |
| `--snowui-gradient-motion-subtract-x-amplitude-override` / `--snowui-gradient-motion-subtract-y-amplitude-override` | `12%` / `12%` | Subtract 位移幅度 |
| `--snowui-gradient-motion-subtract-deform-amplitude-override` | `0.25` | Subtract X/Y 反向非等比缩放形变幅度 |
| `--snowui-gradient-motion-subtract-2-x-amplitude-override` / `--snowui-gradient-motion-subtract-2-y-amplitude-override` | `12%` / `12%` | Subtract 2 位移幅度 |
| `--snowui-gradient-motion-subtract-2-rotate-amplitude-override` | `20deg` | Subtract 2 旋转幅度 |
| `--snowui-gradient-motion-subtract-2-scale-amplitude-override` | `0.25` | Subtract 2 放大 / 缩小幅度 |
| `--snowui-gradient-avatar-hover-entry-duration` | `1s` | Gradient Avatar 颜色 Overlay 的入口缓冲时长 |
| `--snowui-gradient-avatar-hover-exit-duration` | `0.5s` | Gradient Avatar 颜色 Overlay 的退出缓冲时长 |
| `--snowui-gradient-avatar-hover-motion-easing-override` | `linear` | Avatar 按需水波形变的连续时间函数 |
| `--snowui-gradient-avatar-hover-motion-vector-4-duration-override` | `6.4s` | Avatar hover Vector 4 独立周期 |
| `--snowui-gradient-avatar-hover-motion-vector-3-duration-override` | `7.2s` | Avatar hover Vector 3 独立周期 |
| `--snowui-gradient-avatar-hover-motion-subtract-duration-override` | `8.4s` | Avatar hover Subtract 独立周期 |
| `--snowui-gradient-avatar-hover-motion-subtract-2-duration-override` | `6.8s` | Avatar hover Subtract 2 独立周期 |

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

## 专业艺术色例外

Gradient 的六组固定 SVG palette、中心色与 Avatar 模式多色 Overlay 已在 [StyleSpec §2.1.3](../../../specs/StyleSpec.md#213-专业艺术色例外强制) 单独登记为专业艺术色例外。它们共同构成经设计确认的生成式矢量视觉资产，因此不映射到 SnowUI 语义 Token，也不能作为按钮、文字、状态、表面或其他组件的通用颜色来源。

例外只覆盖 Gradient 画面及其 Avatar 视觉分支。组件根的尺寸、圆角、外部 `class` / `style` 覆盖、无障碍与 reduced-motion 仍遵守现行 StyleSpec；新增 palette 或将颜色用于新的语义前必须重新登记。

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

Avatar 会向 Gradient fallback 传入 `as="avatar-image"`、稳定 seed 与 `gradientMotion` 开关。默认头像常态使用缓存静态图；hover 时 Gradient 在圆形裁切内按需淡入四个预栅格 SVG 图层，并持续过渡到当前 variant 之外的五种颜色。`gradientMotion` 只决定活动图层是否常驻。

## 矢量与缩放

- 画布：`360 × 360`。
- 图层顺序：底色矩形 → Vector 4 → Vector 3 → Subtract → Subtract 2。
- 椭圆模糊：`stdDeviation=60 / 60`。
- 路径模糊：`stdDeviation=40 / 50`。
- 模块按 `variant + 画布档位` 缓存四张透明 SVG data source；相同 variant 的实例复用同一字符串、图片解码与栅格缓存，不创建实例级 filter ID / filter DOM。
- Avatar 常态基础形变关闭时复用六份短 URL 的包内完整 SVG 资源；hover 只为当前头像按需创建四张活动图层图片，离开淡出后释放。
- 静态 Avatar 与活动图层使用同一套 palette、路径和 blur 参数；普通 Gradient 仅将位于最上方、会旋转并暴露裁切边界的 Subtract 2 扩到 `800 × 800`，其余三层保留 `600 × 600`；Avatar 的 `720 × 720` overscan 覆盖增强幅度。
- Avatar 模式继续使用浏览器原生 `content-visibility: auto` 与布局 / 绘制 containment，跳过长列表视口外子树绘制，不创建逐实例观察器。
- SVG 图片 viewport 负责统一缩放全部几何与 blur；组件不读取实际像素尺寸，也不重新计算 blur。
- 非正方形宽高按 Figma Fill 行为分别缩放 X / Y 轴。四个 HTML 图层先在 SVG foreignObject 的 360 × 360 设计坐标内运动，再由外层 viewBox 整体 Fill；禁止先拉成长方形再旋转，以免露出预栅格图片的硬裁切边界。

## 动效与性能

- 底色保持静止；开启 `motion` 后，单个实例只在四个承载预栅格 SVG 图片的 HTML 图层上运行 CSS transform keyframes。
- 动画只使用 `translate3d + rotate + scale / scaleX / scaleY`；常驻 Gradient 在每个相邻关键帧区间使用90级更新密度，单步位移在默认 360px 画布中低于约1px；仅在 `motion` 开启且接近视口时使用 `will-change: transform`。
- 四个 `feGaussianBlur` 只在图片解码时执行一次；运行中的 DOM 没有 `filter / clipPath / path`，循环不触发 SVG filter 重栅格。
- Avatar 未 hover 时由 Avatar 直接使用共享静态图，不创建 Gradient 组件、活动图层或颜色 Overlay；hover 时才挂载一份 Gradient、四张预栅格活动图层与五种候选色 × 两层结构，离开0.5秒淡出后全部卸载。
- 默认 Avatar hover 的四层周期分别为 `6.4s / 7.2s / 8.4s / 6.8s`，使用原有连续时间函数、七个不等时非镜像途经点、独立负延迟、`18%` 位移、`30deg` 旋转与 `32%` 缩放 / 形变幅度，避免多层同步减速或沿原路返回。
- 原始五层不动画 `fill`、`mix-blend-mode` 或 Gaussian Blur；Avatar hover 只在五组双层同色纯色 Overlay 间交叉动画 opacity。每层使用独立 HTML 合成元素执行 `overlay`，确保 backdrop 是已经完整渲染的 Gradient 图形。
- 颜色顺序仅在组件求值时由 seed 与实例 ID 稳定打乱；每次 hover 只用一次随机数选择与上次不同的六组运动相位 / 方向配置，所有逐帧运动仍由 CSS 完成。JavaScript 只在 hover 边界使用一次 `requestAnimationFrame` 分离挂载与淡入，并以退出计时器在0.5秒淡出后回收 DOM；不使用 JavaScript 动画循环、Canvas 或 ResizeObserver。
- `0%` 与 `100%` 使用完全相同的 transform，保证持续循环时不跳帧。
- 一个模块级 `IntersectionObserver` 服务全部实例；离开视口预热范围后暂停 CSS 动画并移除图层提升，重新进入时从暂停位置继续。能力缺失时保持运行，不引入功能退化。
- 图层预栅格画布大于可见画布；动效幅度限制在 overscan 安全范围内并由根 clip-path 统一裁切。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| Gradient | [Gradient.svelte](./Gradient.svelte) | 六种 SVG 矢量图源、模块级预栅格缓存、视口调度与四层独立合成 transform |
| Test 示例 | [Gradient.test.ts](./Gradient.test.ts) | 六种配色、模糊缩放、持续动效、非正方形和裁切组合验证 |
| Test 调参器 | [GradientMotionController.svelte](../test/GradientMotionController.svelte) | 在 Test 沙箱内保存 19 项调参状态并实时写入 Gradient CSS override；四列排列于图形下方，不属于公开组件 |

### 组合模式

Gradient 是无 children、无内置公开子组件的原子视觉组件，组合模式为“不适用”，不提供 `parts`。

### 动效边界

- 根 Frame 固定 `enableDefaultMotion={false}`。
- 普通 Gradient 默认播放四个预栅格 SVG 图层的独立 transform 动效；Avatar fallback 默认关闭，可由 Gradient `motion` 或 Avatar `gradientMotion` 开启。
- 基础形变开关不参与 Avatar hover 颜色 Overlay；关闭常驻形变时，hover 按需挂载四个活动图层和五色双层 Overlay，使用10s颜色循环、1s入口 / 0.5s退出缓冲和58%单层峰值。
- 不使用 Svelte transition、WAAPI、Canvas 或 JavaScript 动画循环；JavaScript 只负责 hover 边界回收与共享视口可见性调度。
- 常态动效不得改变已确认的六种配色、路径、图层顺序和 blur 基线；Avatar hover 允许通过独立 Overlay 改变合成后的可见色调。
- reduced-motion 是“始终运动”的无障碍例外，系统请求减少动态时必须停止。

---

## 更新日志 (Changelog)

### 圆角边缘修复（2026-09-15）

- `radius="50%"` 使用椭圆路径，正方形时为精确圆形；其他显式圆角使用 `inset(0 round …)` 跟随公开圆角值裁切完整合成结果；继承圆角时使用 `border-box`，替换 `overflow: hidden` 的圆角裁切，保留 alpha mask 的整体合成，减少圆形轮廓的采样毛边；支持 `radius` 与 Avatar 继承圆角。

### v2.13.2 (2026-09-15)

- 动态图层在原始设计坐标中运动后整体适配宽高，修复横向画布左上角露底；保留配色、路径及动画参数；普通 Subtract 2 安全区扩到 800 × 800 以覆盖最小缩放时的四角，其余图层与 Avatar 缓存尺寸不变，不引入尺寸观察器。

### v2.13.1 (2026-08-16)

- 将普通 Gradient 最上方的 Subtract 2 预栅格安全区从 `600 × 600` 扩到 `720 × 720`，避免图层旋转 / 缩放时左上角露出带硬边的底层色块；其他三层维持原画布尺寸，不扩大其合成面积。

### v2.13.0 (2026-08-15)

- 将四个带 Gaussian Blur 的实时 SVG `<g>` 改为模块级缓存的透明 SVG 图片源；浏览器只在图片解码时生成 blur，运行中的四个 HTML 合成图层只执行 transform，避免 Safari 每帧重栅格滤镜。
- 普通 Gradient 使用 `600 × 600` overscan 与每段90级更新密度；Avatar 增强幅度使用 `720 × 720` overscan 并保留原有连续缓动。两者均保留柔和路径、公开幅度和时长覆盖。
- 全部实例共享一个 `IntersectionObserver`；离开视口 `128px` 预热范围后暂停内部动画并释放 `will-change`，能力缺失时保持原有持续动效。

### v2.12.1 (2026-08-15)

- 将六组固定 SVG palette、中心色与 Avatar 模式多色 Overlay 正式登记为专业艺术色例外，并明确例外不扩展到 Gradient 的其他样式契约。

### v2.12.0 (2026-08-06)

- 为 Avatar 内部协议提供共享静态图源与受控 hover 生命周期；默认头像常态由 Avatar 直接渲染静态图，Gradient 只在 hover 或常驻 motion 时实例化。
- 受控 hover effect 只追踪 Avatar 传入的激活值；实例内部的 profile、挂载状态与退出计时更新不参与 effect 依赖，避免循环更新。
- 静态 Avatar 图片增加 lazy loading、异步解码与低请求优先级，减少长列表首屏解码竞争。

### v2.11.0 (2026-08-03)

- 四层 transform 从2–3个姿态扩展为各自七个不等时、非镜像途经点，闭环末段不再沿上一段原路返回。
- 新增六组相位 / 方向组合；每次 Avatar hover 随机选择且避开上一次组合，使相同头像重复进入时也不会从同一状态、同一方向开始。
- 随机只发生在 hover 边界；活动图层数量、filter 数量、CSS逐帧执行方式和退出回收策略保持不变。

### v2.10.0 (2026-08-02)

- 默认 Gradient Avatar 常态继续使用缓存静态图，hover 时才按需挂载一份实时 SVG；离开以0.5秒淡出并连同四组 filter 与 Overlay 一起释放。
- 四个内部图层改用 `6.4s / 7.2s / 8.4s / 6.8s` 独立线性周期与负延迟错峰，hover 幅度提升到18%位移、30度旋转和32%缩放 / 形变，消除同步缓动造成的长停顿感。
- 修正按需 hover 生命周期接入 Frame 支持的 `mouseenter / mouseleave`，同时保留外部 pointer 回调透传。

### v2.9.0 (2026-08-02)

- Gradient Avatar 每种候选色的 Overlay 从四层降为两层，入口缓冲由0.5秒延长为1秒，退出保持0.5秒；颜色、`overlay` 混合、10秒循环和单层58%峰值不变。
- 默认静态 Avatar 改为复用六份包内 SVG 图片资源，移除200头像场景中的800个实例级 filter 节点并消除重复 data URI；与原实时 SVG 的24px截图像素完全一致。
- 保留 hover 按需挂载和 `content-visibility`，单头像 hover 现在只创建10个 pass与10个颜色层。

### v2.8.6 (2026-08-02)

- 保留认可版本 hover 的五色 × 四层 Overlay、`overlay` 混合、10s 循环、0.5s 缓冲与颜色参数，只将完整结构改为 hover 按需挂载、离开淡出后卸载。
- Avatar 模式增加原生 `content-visibility: auto` 与绘制 containment，长列表视口外不绘制静态 SVG；不使用逐头像 IntersectionObserver。

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
