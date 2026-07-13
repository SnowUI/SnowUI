# progressive-blur

> **版本**: v1.0.7  
> **职责**: 为文字覆盖、表格行边缘覆盖和后续遮罩场景提供统一的渐进式模糊样式生成器。

## 设计来源

Progressive Blur 参考 `[项目目录]/repos/ProgressiveBlur-main` 中的 Swift 实现。原实现通过 `CIMaskedVariableBlur` 和渐变 mask 让模糊强度沿一个方向变化；Web 平台没有同等的原生可变模糊滤镜，因此 OSS 能力使用多层 `backdrop-filter` 条带叠加，并为每层添加渐隐 mask 近似该效果。

## API

```ts
createProgressiveBlurStyles(options)
createProgressiveBlurContainerStyle(options)
createProgressiveBlurLayerStyles(options)
createUniformBlurStyles(options)
createUniformBlurLayerStyles(options)
```

> `createUniformBlurStyles` / `createUniformBlurLayerStyles` 与渐进式版本共用同一套 `ProgressiveBlurOptions` 和容器定位，但只生成单层、固定 `maxBlur` 强度、在可见宽度处硬截断的普通背景模糊；用于和渐进式模糊做 A/B 对比（见下方“单层与背景模糊的区别”）。

## 关键参数

| 参数 | 默认值 | 说明 |
| :--- | :--- | :--- |
| direction | `left-to-right` | 模糊方向；`left-to-right` 表示左侧更模糊、右侧更清晰 |
| width | `calc((var(--size-12, 3rem) + var(--size-14, 3.5rem)) / 3)` | 可见渐进模糊宽度 |
| layerCount | `16` | 模糊层数量（最小 `1`）；层数越多，模糊强度沿方向的过渡越平滑；小宽度时需要更高层数降低分段感。设为 `1` 时退化为单层固定强度模糊（见下方“单层与背景模糊的区别”） |
| maxBlur / minBlur | `0.75rem / 0rem` | 起点与终点模糊强度；默认终点为 0，避免右侧仍残留非零 `backdrop-filter` |
| sampleExtension | `4rem` | 每层在可见宽度之外额外延伸的透明采样区，用于把 `backdrop-filter` 合成裁切边推离可见模糊区 |
| leadWidthRatio | `0.32` | 第一层高强度基础模糊的额外保留比例 |
| startRatio / endRatio | `0 / 0.74` | 渐进 mask 开始和结束位置；模糊应早于覆盖块宽度结束 |
| featherRatio | `2.4` | 每层 mask 相对步长的羽化宽度；值越大，相邻层重叠越多，窄宽度下越不容易出现块状感 |
| tailOpacity | `0` | mask 末端透明度；默认完全透明，可作为调试右侧残留透明度的入口 |
| stripWidth | `0.625rem` | 兼容旧参数；v1.0.1 起不再用窄条带渲染 |
| edgeFeatherRatio | `0` | 仅 `createUniformBlur*` 使用；单层背景模糊内侧边缘的羽化比例（占可见宽度的 0~1）。`0` = 硬边界；`>0` 时在内侧 mask 上加一段线性渐变，使模糊块边缘过渡柔和 |
| tintColor / tintOpacity | `var(--background-1, #ffffff) / 0%` | 可选背景色；默认不添加可见色块 |

## Svelte 使用示例

```svelte
<script lang="ts">
    import { createProgressiveBlurStyles } from "@snowui-design-system/components";

    const blur = createProgressiveBlurStyles({ width: "3rem" });
</script>

<div style="position: relative; overflow: hidden; border-radius: 1rem;">
    <span>Just now</span>
    <span style={blur.containerStyle} aria-hidden="true">
        {#each blur.layers as layer (layer.index)}
            <span style={layer.style}></span>
        {/each}
    </span>
</div>
```

## 行为契约

- 生成器只输出内联 style 字符串，不读取 DOM，不绑定 Svelte 生命周期。
- 宿主必须提供 `position: relative`、`overflow: hidden` 和期望的圆角；覆盖容器会继承宿主圆角。
- 每一层占据自己的羽化范围加一段透明采样延伸区，并通过连续重叠的 `mask-image` 控制生效范围；禁止回退到无重叠窄条带，否则会重新出现竖向色块边界。
- `width` 只控制可见模糊宽度；`sampleExtension` 不应产生可见色块，只用于规避浏览器 `backdrop-filter` 元素边界的矩形裁切。
- `minBlur` 默认必须为 `0rem`，保证最右侧（或反方向最左侧）真实回到无模糊状态。
- `endRatio` 控制模糊终止位置，必须小于等于 `1`，用于避免覆盖块末端出现硬边。
- 需要右侧操作列时使用 `direction: "right-to-left"`。

## 单层与背景模糊的区别

`layerCount` 控制用多少层不同 `backdrop-filter` 半径来叠加近似“强度沿方向连续变化”的可变模糊：

- **多层（默认 16）**：每层使用递减的 blur 半径并各自带羽化 mask，叠加后模糊强度从 `maxBlur` 平滑过渡到 `minBlur`，这才是真正的“渐进式”模糊。
- **单层（`layerCount: 1`）**：只有一个固定 `maxBlur` 半径的模糊层。它仍然带方向性渐变 mask，所以模糊区域会在边缘按 mask alpha 羽化淡出，而不是硬边。
  - 与普通“整块背景模糊”的区别：背景模糊是整块统一强度、硬边界；单层 ProgressiveBlur 是统一强度但边缘 alpha 渐隐（“有模糊 → 无模糊”的覆盖过渡），不是“强模糊 → 弱模糊”的强度过渡。
  - 如果再把 mask 去掉让其铺满整块，单层 ProgressiveBlur 就与普通背景模糊完全等价。
  - 结论：单层无法表现模糊强度的渐变（那是多层才有的能力），但凭借渐变 mask 仍与硬边背景模糊存在边缘羽化上的区别。

### 单层背景模糊的边缘羽化（edgeFeatherRatio）

单层背景模糊默认是硬边界（`edgeFeatherRatio: 0`），模糊块和清晰内容之间会出现一条明显的竖直切割线。把 `edgeFeatherRatio` 调到大于 0，可以在模糊块**内侧**边缘加一段线性渐变 mask，让边缘过渡柔和：

- 实现：mask 在 `(endRatio - edgeFeatherRatio)` 到 `endRatio` 之间从实心线性过渡到透明，外侧（贴表格边）保持实心。
- 注意：单层的 blur 半径始终不变，羽化的是这一层的**覆盖透明度**，所以靠近边缘是“半透明的模糊层叠在清晰内容之上”。羽化区过宽时可能出现轻微重影（模糊与清晰内容叠加），这正是多层渐进式模糊（逐层递减 blur 半径）能避免、而单层做不到的地方。
- 适合“只想柔化硬边、不需要真正强度渐变”的轻量场景；需要干净的强度渐变时仍应使用渐进式多层。

## Changelog

- 2026-06-27：v1.0.7，`createUniformBlur*` 新增 `edgeFeatherRatio`，可在单层背景模糊的内侧边缘加渐变 mask 柔化硬边界（默认 `0` 仍为硬边）。
- 2026-06-27：v1.0.6，新增 `createUniformBlurStyles` / `createUniformBlurLayerStyles`，生成单层固定强度、硬边界的普通背景模糊，便于和渐进式模糊做 A/B 对比（Table overlay 角色块 `roleOverlayBlurMode="uniform"` 即复用此能力）。
- 2026-06-27：v1.0.5，`layerCount` 最小值从 `2` 放宽到 `1`，允许退化为单层固定强度模糊；补充“单层与背景模糊的区别”说明。ProgressiveBlur-Demo 各场景新增 Layers 层数控制滑块。
- 2026-06-24：v1.0.4，默认层数提升到 16，`minBlur` 改为 `0rem`，新增 `tailOpacity`，让模糊梯度默认从最大值衰减到 0。
- 2026-06-24：v1.0.3，新增 `sampleExtension` 语义，`width` 改为可见模糊宽度，透明采样区默认 `4rem`，避免小宽度时出现整块矩形裁切边。
- 2026-06-24：v1.0.2，mask 生成从窄分段改为重叠羽化带，新增 `featherRatio`，改善窄宽度下的块状感。
- 2026-06-24：v1.0.1，改为全覆盖层 + 连续 mask 分段，避免窄条带 backdrop-filter 边界导致的竖向色块。
- 2026-06-24：v1.0.0，新增渐进式模糊样式生成器与文档。
