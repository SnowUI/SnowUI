# 自适应黑白对比（Adaptive Contrast）

> **版本**: v1.0.0
> **职责**: 为组件提供按背景明暗切换静态黑白前景的共享颜色与 SVG 遮罩能力。
> **别名**: 反白、自动反白、黑白自适应、根据背景切换黑白。

## 使用与边界

适合在纯色背景或组件已知的矢量表面上保持线、圆圈与文字可见。同一点使用 sRGB 灰度 0.5 为明暗分界；深背景用 StaticWhite/100，浅背景用 StaticBlack/100，圆圈内外层互为反色。此能力不是彩色补色或 CSS `mix-blend-mode: difference`，也不是对比率合规检测器。

能力属于 `lib`，不依赖专业协调模块、不自动注入 Frame。组件声明背景表面并拥有自己的前景、事件、几何和 ARIA；消费页面使用组件公开入口。当前接入者是 BarChart、LineChart、ChartGroup 的 `adaptiveContrast`，详见 [ChartSpec](../../../specs/ChartSpec.md#84-自适应黑白对比)。Slider 只是效果参考，本次没有迁移它的内部实现。

支持纯色祖先背景及同坐标系的路径填色、透明度、可解析的 SVG 渐变引用。表面顺序为实际由后向前的绘制顺序。调用方必须提供正确几何；不自动采样图片、Canvas、背景渐变、伪元素、阴影、外部覆盖物或不同坐标系的内容。未知 CSS 颜色和渐变前景保留原样；只有明确黑白色参与自动反白。

## 组件开发入口

```ts
import { getAdaptiveContrastColor, isAdaptiveContrastMonochrome, type AdaptiveContrastSurface } from '@snowui-design-system/components/lib/adaptive-contrast';
import { AdaptiveContrastMask } from '@snowui-design-system/components/lib/adaptive-contrast-renderer';
```

| 入口 | 参数 / 返回 | 说明 |
| --- | --- | --- |
| `getAdaptiveContrastColor(inverse = false)` | `boolean` → CSS `var(...)` 字符串 | false 返回静态黑，true 返回静态白；使用设计系统 Token 并附对应纯色 fallback，不随主题互换。 |
| `isAdaptiveContrastMonochrome(color)` | `string` → `boolean` | 识别 black/white、3/6 位黑白 HEX、4/8 位 alpha=FF 的黑白 HEX 及黑白 Token；不解析任意变量或覆盖彩色前景。公开语义色应先经过 SnowUI 颜色解析。 |
| `AdaptiveContrastSurface.path` | 必填 `string` | 与遮罩相同用户坐标系中的 SVG path 数据。 |
| `AdaptiveContrastSurface.fill` | 必填 `string` | 已解析的 CSS 填色或有效 SVG paint 引用；共享层不创造颜色别名。 |
| `AdaptiveContrastSurface.opacity` | 必填 `number` | 当前有效填色不透明度，调用方提供 0..1。 |

`AdaptiveContrastMask` 是内部 SVG 渲染辅助，通过上述子路径供组件开发使用；不是页面级组件，不进入组件导航。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | 必填 | 文档内唯一、可用于 SVG fragment 的稳定 ID；调用方用它引用 mask。 |
| `width` | `number` | 必填 | SVG 画布宽度，用户坐标单位；与表面路径一致。 |
| `height` | `number` | 必填 | SVG 画布高度，用户坐标单位。 |
| `surfaces` | `AdaptiveContrastSurface[]` | 必填 | 从后向前排列的背景几何，纯色宿主场景可传空数组。 |
| `overflow` | `number` | `256` | 四边额外遮罩空间，用户坐标单位；用于图形外的数字标签，负数钳制为 0。 |

```svelte
<script lang="ts">
    import { getAdaptiveContrastColor } from '@snowui-design-system/components/lib/adaptive-contrast';
    import { AdaptiveContrastMask } from '@snowui-design-system/components/lib/adaptive-contrast-renderer';
    const id = $props.id();
</script>
<svg width="200" height="80" role="img" aria-label="深浅背景上的线条">
    <rect width="100" height="80" fill="var(--static-black-100, #000)" />
    <AdaptiveContrastMask {id} width={200} height={80}
        surfaces={[{path:'M0 0H100V80H0Z',fill:'var(--static-black-100, #000)',opacity:1}]} />
    <path d="M20 40H180" stroke={getAdaptiveContrastColor()} />
    <path d="M20 40H180" stroke={getAdaptiveContrastColor(true)} mask={`url(#${id})`} aria-hidden="true" pointer-events="none" />
</svg>
```

## 生命周期、SSR 与成本

颜色模块是无顶层副作用的纯函数。渲染辅助仅在实际挂载后读取祖先纯色背景，创建一个 MutationObserver（包含 theme / mode 及 class / style 属性）和系统色彩模式监听，并监听祖先背景颜色过渡的结束/取消；卸载时释放。监听 API 缺失时保留首次背景快照；SSR 不读 DOM，初始按 background-1 与白色基底绘制，挂载后校正。

组件必须在开启时才渲染遮罩、登记表面；关闭时不启动该能力专属 Observer、监听或持续测量。渲染层不创建 Portal、ResizeObserver、timer 或 rAF。背景 transition 结束后刷新最终色，不承诺逐帧采样过渡色。

独立导入其他 组件不依赖此模块。接入组件的动态 boolean 分支仍可能保留遮罩静态代码，不能宣称传 false 就产生零字节。2026-09-03 使用 Site 的 Vite 8.2.1 / Svelte 构建三个独立入口，遍历入口 chunk 的静态依赖：普通 Button 的反白模块集合为空；LineChart 的开/关入口都保留同一组共享模块，Rollup `renderedLength` 合计 4,726 字符（颜色模块 418，遮罩 4,308，转出入口 0）。这是 tree-shaking 后、最终压缩前的模块代码长度，不是网络传输增量或 gzip 包体。显式关闭无需初始化的边界由真实浏览器关闭/卸载测试验证。

## 维护与验收

唯一算法入口在本模块，组件只保留前景形状和自身状态映射；不得重新创建图表专属阈值或颜色判定。遮罩附加绘制层不参与 pointer / keyboard 命中，也不重复提供可访问名称。

验证覆盖：黑柱内外不同线色、节点内外反色、浅深色切换、区域 hover、keyboard、彩色前景保留、关闭卸载及非图表 SVG 消费。规范发现入口为 [CommonCapabilities](../../../specs/CommonCapabilities.md) 与 [自然语言映射](../../../specs/NaturalLanguageToSnowUI.md)。
