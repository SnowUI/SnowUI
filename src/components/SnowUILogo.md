# SnowUILogo

> **版本**: v1.19.2
> **职责**: 展示 SnowUI 图标、字标或组合标识，支持横向与纵向排列，适合品牌入口和页面署名。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

展示 SnowUI 图标、字标或组合标识，支持横向与纵向排列，适合品牌入口和页面署名。

## 使用选择

<!-- usage-guide:start -->
用于 SnowUI 品牌图形与字标。复用公开变体，不用文字、截图或手写 SVG 模仿品牌图形。

- variant 选择图标、字标或组合方向；scale 调整整体比例。
- 组件本身不创建导航；需要跳转时由页面提供真实链接，纯装饰时设置 decorative。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { SnowUILogo, Text } from '@snowui-design-system/components';
</script>

<SnowUILogo scale={2} />
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| variant | `SnowUILogoVariant` | `"horizontal"` | 图标、字标或两种组合方向 |
| scale | `number` | `1` | 等比缩放图标、字标和组合间距；非有限值或非正数回退为 `1` |
| compactProgress | `number` | `0` | 仅 vertical：0 为完整纵向标识，1 为 28×28 图标，中间值连续收拢字标与间距；范围 0–1，非有限值回退 0，可与 scale 组合用于滚动品牌过渡 |
| hoverMotion | `boolean` | `false` | 开启悬停时图标与字标轮换；关闭时恢复静态品牌，不影响闲置动效与鼠标事件 |
| textMotion | `"greetings" \| "variants"` | `"greetings"` | 选择文字 hover 方案：原版多语言问候或第二版 SnowUI 矢量字形轮换；icon 变体忽略此项，图标 Emoji 轮换保持一致 |
| idleMotion | `boolean` | `false` | 开启品牌 icon 的闲置旋转与上下飘浮；不影响 hover 问候，减少动效偏好下不播放 |
| decorative | `boolean` | `false` | 设为 `true` 时从无障碍树隐藏 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="布局模型"></a>

### 布局模型

主布局模型：内禀原子布局。

- `icon`：设计基准为 `28 × 28`。
- `text`：设计基准为 `71 × 12`。
- `horizontal`：`28 × 28` 图标 + `6` 间距 + `71 × 12` 字标，整体 `105 × 28`。
- `vertical`：`60 × 60` 图标 + `15` 间距 + `119 × 20` 字标，整体 `119 × 95`；各部分随 scale 同步缩放。
- 内部图标与字标是固定品牌几何，不是公开 SnowUI 子组件，不接受 children，也不接入通用槽位。

<a id="使用示例"></a>

### 使用示例

```svelte
<SnowUILogo variant="icon" />
<SnowUILogo variant="text" />
<SnowUILogo variant="horizontal" />
<SnowUILogo variant="vertical" />
```

```svelte
<SnowUILogo variant="horizontal" scale={2} />
```

### 作为主页链接使用

SnowUILogo 只负责品牌视觉，不内置 `href`、路由或打开方式。需要点击 SnowUI Logo 返回主页时，由使用方使用原生 `<a>`、应用路由 Link 或其他导航宿主包裹：

```svelte
<a href="/" aria-label="返回 SnowUI 首页">
    <SnowUILogo variant="horizontal" />
</a>
```

这样可以由页面决定目标地址、客户端路由行为、`target` 与 `rel`，同时保持 SnowUILogo 的视觉职责稳定。

### Site favicon 同步规则

- 修改 Logo 的 icon 品牌图形（路径、形状、配色、渐变或图形比例）时，必须在同一任务同步更新 `../../../site/src/lib/assets/favicon.svg`，保证网站图标与组件中的静态 icon 一致。
- favicon 保留透明背景与静态品牌图形，不包含字标、Emoji 或动效；仅调整 hover、旋转、飘浮等动效，或仅修改字标时，无需改动 favicon。
- 同步后检查 Site 根布局的 favicon 引用和浏览器实际加载结果；Site 的派生文档与静态资源清单按提交前同步流程更新。

### 闲置动效

- 默认关闭，通过 `idleMotion={true}` 显式开启；Site 的启用位置与滚动切换时机由 [主页规则](../../../site/docs/standards/SiteRequirements.md#31-home) 维护，组件不判断路由或 Header 状态。开关不影响 hover 问候；运行中关闭会恢复静态品牌位置。

- 品牌 icon 整体顺时针匀速旋转，16 秒一圈；同时以 5.8 秒周期上下飘浮，曲线 `cubic-bezier(.45, 0, .55, 1)`，上移幅度为图标边长的 1/7（参考站云朵 84px 对应 12px）。
- 两层动效仅作用于品牌图形，字标与命中框保持静止；进入 hover 时暂停退出中的品牌图形，Emoji 不旋转、不飘浮；恢复品牌时从原位渐显并重新开始闲置循环。
- 属于品牌专用动效，与 hover 一样不由 Frame 的 enableDefaultMotion 开关控制；减少动效时不播放。闲置旋转与飘浮使用可由浏览器合成层驱动的 CSS transform 关键帧动画，避免页面切换与主线程繁忙时掉帧或停顿；页面隐藏或进入 hover 期间暂停播放。

### 第二版字形动效

```svelte
<SnowUILogo hoverMotion textMotion="variants" scale={2} />
```

- `textMotion="greetings"` 保留原版多语言问候；`variants` 参考 Apple Mac mini 首屏同词异形的表现，始终呈现 SnowUI 字母，轮换圆线、像素、轮廓、斜体、条纹和加粗六种固定矢量表现，不加载外部字体、图片或视频。
- 只替换文字部分。图标继续同步轮换原有 Emoji；`icon` 无文字，不受此项影响。静态和移出恢复时仍使用原设计稿字标。
- 各字母保留品牌固定横坐标与画布，采用 220ms 压缩翻入、轻微模糊和淡入淡出，六个字母从左到右以 24ms 交错切换。稳定节点目标启动间隔仍为 1000ms，与原版共用完整过渡、移出恢复和十秒续播规则。
- 动态切换方案会回到静态品牌，等待下一次移入；减少动效、页面隐藏与卸载停止循环。横版左对齐、纵版与纯字标居中，scale 与 compactProgress 继续同步缩放。可访问名称始终为 SnowUI。
- 变体为品牌专用矢量装饰，不提供任意文本、字体或时序配置。默认关闭时不创建变体图形或专属计时器；少量静态形状代码随组件交付，未进行独立包体增量测量。

### Hover 动效（原版）

默认关闭；通过 `hoverMotion={true}` 显式开启。运行中关闭时停止轮换并恢复品牌。

- 图标与文字按静态节点顺序同步轮换，目标启动间隔为 1000ms；指针移入后需稳定停留 200ms（组件挂载后 300ms 内同步防误触）才启动轮换，避免快速经过或路由切换瞬间误触；空闲时预热首个 Emoji 测量缓存以减少首次悬停卡顿。每次必须等待图标和全部字母的实际过渡结束，再显示至少一帧稳定节点，繁忙帧不追赶或补播。图标用 320ms 缩小至 45%、模糊、淡出；新图标从同样状态放大、清晰、淡入。
- 文字按 grapheme 拆分，保留相同前后缀，变化中段从左到右交错进入 / 退出；550ms 位移 0.35em、缩放至 60%、旋转 2°、模糊 0.1em，交错总窗口为 550ms × 0.3。字形按自然宽度定位；相同字符的位置平滑过渡，品牌字母进出时保持各自固定横坐标。
- 字号用当前字体 `snowui` 的实际字形高度校准为矢量字标高度，字宽保留字体自身比例；所有问候使用同一校准字号。字体加载完成后重新测量，位置与字号以字标高度的 em 比例表示，随 scale / compactProgress 等比变化。纵向字标不裁切下伸部、重音和出入场模糊；长词允许超出固定外框，不自动缩小。
- 横版中 icon 与文字同步轮换为 Emoji 和问候；品牌字标及所有问候固定左对齐，保持与 icon 的间距，长词向右延伸。纵版和纯字标保持居中；阿拉伯文保留从右向左的字序，横版整词仍以左边界对齐。
- 品牌字标按 Workshop `15907:19183` 拆为六个独立矢量字母；每个字母保留设计稿独立渐变。外框尺寸稳定，内部文字随内容自然排版。
- 动态图形不参与指针命中，悬停范围由稳定的 Logo 外框拥有；文字溢出、缩放和旧字形卸载不会改变命中范围。
- `icon` 只显示表情，`text` 只显示问候；组合变体同步轮换。过渡过程中移入 / 移出只更新最后一次 hover 意图，不取消、重播或跳过当前变化；节点完成后，仍 hover 则继续轮换，已移出则恢复品牌。恢复品牌的过程同样不可被 hover 打断，重新移入会在品牌恢复完成后续播。
- 移出后 10 秒内保留最近完成的问候节点，恢复品牌不覆盖记录：例如到达 B 后移出，再 hover 为 Logo → C；超过 10 秒重新从 A 开始。多个快速 hover 事件只保留最终意图，不积累播放请求。
- Emoji 使用系统字形，在首次需要对应表情时测量并缓存实际着色像素边界，按边界等比适配品牌 icon 的 32×32 viewBox 并居中；最长边与 icon 相同，不拉伸非正方形表情。随 scale / compactProgress 一起缩放。不同操作系统的图形细节可能不同。问候只改变装饰画面，可访问名称始终为 SnowUI，不逐帧播报。
- `prefers-reduced-motion: reduce` 下保留静态品牌，不启动循环；偏好切换、页面隐藏和卸载均停止循环。
- 这是用户批准的 品牌专用实现，不依赖 NumericText 或通用文字动效运行时，不提供通用文字动画 API；后续维护不会自动跟随 NumericText。

### 连续收拢

`compactProgress` 只控制纵向组合自身几何，不读取页面滚动或导航状态。调用方提供 0–1 连续进度；图标从 60 收拢至 28，字标及间距逐渐收拢消失。`scale` 继续等比作用于最终几何。主页固定定位和滚动时机属于 Site，组件不内置页面坐标。

### 字标颜色

- `Snow` 底层为 `--black-100`，上层为各字母独立从左到右的线性渐变：`--white-10` → `#FFFFFF00`。起点保留 Figma 的 White/10% 变量绑定，随暗色主题切换为黑色 10%。
- `UI` 底层为 `--brand`，上层为从上到下的线性渐变：`#FFFFFF00` → `#FFFFFF66`。这两个渐变端点是固定白色，不随主题切换。
- SVG 渐变与路径引用使用实例独立 ID，多 Logo 同页互不干扰。

<a id="无障碍"></a>

### 无障碍

默认输出 `role="img"` 与 `aria-label="SnowUI"`。纯装饰场景应传入 `decorative`；自定义可访问名称可传入 `aria-label`。

组件向 Frame 提供当前 variant 与 scale 对应的 `renderHints`；Skeleton 状态会保留同一外框尺寸。

---

---

## AI Zone

SnowUILogo 是 SnowUI 的品牌视觉原子组件。图标与字标均使用设计稿原始矢量路径；组合形式、比例和间距会随 `scale` 一起等比缩放。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 设计来源

- 图标：Workshop Figma 节点 `15890:18930`；拆分字标：`15907:19183`。
- 图标基准 viewBox 为 `32 × 32`，展示尺寸由 variant 与 scale 决定。
- 字标基准 viewBox 为 `71 × 12`，禁止改用字体近似重建。

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| SnowUILogo | [SnowUILogo.svelte](SnowUILogo.svelte) | 品牌图形、连续收拢与 hover 问候 |
| 专用字标 | [Wordmark.svelte](../internal/snow-ui-logo/Wordmark.svelte) | 设计稿独立字形与品牌专用逐字动画 |
| Test 示例 | [SnowUILogo.test.ts](SnowUILogo.test.ts) | 四种组合、比例缩放、hover 问候、连续收拢与外部链接组合 |

### 组合模式

SnowUILogo 是无 children、无公开内置子组件的品牌视觉原子组件，组合模式登记为“不适用”，不提供 `parts`。导航链接属于使用方组合，不改变组件模式。

### 私有动效值

Hover 的内容列表与轮换周期属于组件私有品牌表达，不公开速度与方向参数；页面通过 compactProgress 表达收拢意图，不穿透图标或字标内部 DOM。

---

## 更新日志

### v1.19.2 (2026-10-23)

- 矢量字母的绘制尺寸与定位直接使用默认字标画布几何，不依赖文字Token的em，避免小根字号或文字缩放Token的12px下限令图形越出画布；保留16px基准、品牌路径、比例、scale／compactProgress与动效，不改变正文的最小字号。

### v1.19.1 (2026-10-07)

- 修正圆线字形中 I 被窄画布压细的问题，使其竖向笔画与 U 等粗，保留字距和外框。

### v1.19.0 (2026-10-07)

- 新增 textMotion="variants" 字标异形轮换方案，与默认 greetings 方案共存；保留图标、稳定命中、减少动效和节点续播契约。

完整历史见 [更新日志归档](../../docs/history/changelogs/SnowUILogo.history.md)。
