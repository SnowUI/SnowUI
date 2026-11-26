# GradientMotion API

来源指纹：d28cb68bc6fcdf8b。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| variant | `GradientMotionVariant` | "prism" | glimm palette。`avatar` 为头像默认图专用慢速无空白变体；旧值 `cosmic` / `matrix` / `electric` / `inferno` / `mystic` / `cyber` / `neon` / `plasma` / `neatBlob` 会映射到 glimm palette |
| seed | `string \| number` | — | 随机预设种子；传入后同一 seed 稳定命中同一 palette |
| speed | `number` | 1 | 动效速度倍率 |
| duration | `number` | 800 | glimm sweep 基准时长，单位 ms |
| size | `number \| string` | — | 同时设置宽高 |
| width | `number \| string` | — | 宽度 |
| height | `number \| string` | — | 高度 |
| radius | `number \| string` | "inherit" | 圆角；默认继承外部容器，便于 Avatar 裁切 |
| intensity | `number` | 1 | 对应 glimm `peakAlpha`，范围限制为 `0` 到 `20` |
| paused | `boolean` | false | 是否暂停动效 |
| decorative | `boolean` | true | 是否作为装饰图；为 `true` 时输出 `aria-hidden="true"` |
| direction | `GradientMotionDirection` | "ltr" | 扫光方向 |
| bandTight | `number` | 14 | glimm band gaussian tightness，值越大扫光带越窄 |
| waveAmount | `number` | 1 | glimm edge wave 与头像整体晃动强度，范围 `0–20` |
| rippleAmount | `number` | 1 | 细密波纹强度，范围 `0–20` |
| brightness | `number` | 1 | glimm band RGB 亮度倍率，范围 `0–20` |
| colorSpeed | `number` | 1 | 自定义颜色的时间相位速度倍率，范围 `0–20`；`0` 时颜色停止流动 |
| highlightIntensity | `number` | 1 | Fresnel 与镜面高光强度倍率，范围 `0–20`；`0` 时关闭高光 |
| colors | `GradientMotionColors` | — | 周期上的四个 HEX 采样色；组件提取均值、正弦项与余弦项生成 glimm 风格连续 palette，并沿时间相位流动 |
| loopMotion | `LoopMotionConfig` | — | 覆盖 Frame loop bridge 配置；paused=true 始终优先暂停。shader 的时序仍由 speed、duration 和 paused 控制。 默认行为：基于 duration 的线性无限循环。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
