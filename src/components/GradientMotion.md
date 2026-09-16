# GradientMotion (渐变动效图)

> **版本**: v4.0.1
> **职责**: 按 glimm.dev / `glimm@0.1.4` 还原 shader sweep 渐变效果，可作为可裁切媒体面、头像默认图或背景扫光层使用。
> **包归属**: PRO

GradientMotion 是一个 PRO 动效组件。它输出 glimm.dev 同款 WebGL 扫光带：单条 gaussian band 按方向穿过画布，使用 cosine palette、边缘 wave/ripple、fresnel 与 specular 高光形成虹彩薄膜效果。

## 功能概览

- 内置 glimm 的 6 种 palette：`prism`、`berry`、`lagoon`、`citrus`、`azure`、`ember`
- 可选颜色与 glimm.dev 截图中的 6 个底部 swatch 对齐，组件通过 `variant` 选择颜色
- WebGL shader 还原 glimm 的 cosine palette 公式：`color(t)=a+b*cos(2π*(c*t+d))`
- 还原 glimm sweep band 的默认参数：`bandTight=14`、`waveAmount=1`、`rippleAmount=1`、`brightness=1`、`duration=800`
- 支持 `variant="random"`，可按 `seed` 稳定随机一种 glimm palette
- 支持 `variant="avatar"` 作为默认头像专用变体：按 `seed` 稳定取色，速度为普通 sweep 的 `0.2` 倍；色带固定在画布中，只让波形与色域缓慢往复晃动，全程不闪白
- 当组件收到 `as="avatar-image"` 时会自动启用同样的慢速无空白头像模式，因此 `Avatar fallback={GradientMotion}` 也不会出现白色空白期
- 支持 `direction="ltr|rtl|ttb|btt"` 控制扫光方向
- 支持 `speed`、`size` / `width` / `height` / `radius`、`paused`
- 保留旧预设名作为兼容别名，但视觉都会映射到 glimm 的 6 种 palette
- 支持外部裁切：圆形、圆角、方形、任意父容器 `overflow: hidden` 或 `clip-path`
- 支持 `as` 角色透传；在 Avatar 里推荐 `as="avatar-image"`

## 布局模型

主布局模型：内禀原子布局。

- GradientMotion 的根节点只输出一个由尺寸、圆角与 shader 算法决定的视觉面。
- 组件不管理子内容排列，不接入 Leading / Content / Trailing 三槽位。
- 作为其他组件的子项时表现为 Hug；作为背景时通常配合 `class="w-full h-full"` 或外部 `style` 固定尺寸。
- `as` 透传宿主角色；`as="avatar-image"` 还会启用连续填充头像模式，不改变组件的内禀布局。

## API 参考

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| variant | `"prism" \| "berry" \| "lagoon" \| "citrus" \| "azure" \| "ember" \| "avatar" \| "random"` | `"prism"` | glimm palette。`avatar` 为头像默认图专用慢速无空白变体；旧值 `cosmic` / `matrix` / `electric` / `inferno` / `mystic` / `cyber` / `neon` / `plasma` / `neatBlob` 会映射到 glimm palette |
| seed | `string \| number` | - | 随机预设种子；传入后同一 seed 稳定命中同一 palette |
| direction | `"ltr" \| "rtl" \| "ttb" \| "btt"` | `"ltr"` | 扫光方向 |
| speed | `number` | `1` | 动效速度倍率 |
| duration | `number` | `800` | glimm sweep 基准时长，单位 ms |
| size | `number \| string` | - | 同时设置宽高 |
| width | `number \| string` | - | 宽度 |
| height | `number \| string` | - | 高度 |
| radius | `number \| string` | `"inherit"` | 圆角；默认继承外部容器，便于 Avatar 裁切 |
| intensity | `number` | `1` | 对应 glimm `peakAlpha`，范围限制为 `0` 到 `20` |
| bandTight | `number` | `14` | glimm band gaussian tightness，值越大扫光带越窄 |
| waveAmount | `number` | `1` | glimm edge wave 与头像整体晃动强度，范围 `0–20` |
| rippleAmount | `number` | `1` | 细密波纹强度，范围 `0–20` |
| brightness | `number` | `1` | glimm band RGB 亮度倍率，范围 `0–20` |
| colorSpeed | `number` | `1` | 自定义颜色的时间相位速度倍率，范围 `0–20`；`0` 时颜色停止流动 |
| highlightIntensity | `number` | `1` | Fresnel 与镜面高光强度倍率，范围 `0–20`；`0` 时关闭高光 |
| colors | `readonly [string, string, string, string]` | - | 周期上的四个 HEX 采样色；组件提取均值、正弦项与余弦项生成 glimm 风格连续 palette，并沿时间相位流动 |
| loopMotion | `LoopMotionConfig` | 基于 duration 的线性无限循环 | 覆盖 Frame loop bridge 配置；paused=true 始终优先暂停。shader 的时序仍由 speed、duration 和 paused 控制。 |
| paused | `boolean` | `false` | 是否暂停动效 |
| decorative | `boolean` | `true` | 是否作为装饰图；为 `true` 时输出 `aria-hidden="true"` |
| as | `string` | - | Frame 角色声明；Avatar 场景推荐 `as="avatar-image"` |

> `as="avatar-image"` 会自动启用头像专用连续填充逻辑；如需直接使用组件，也可显式传 `variant="avatar"`。

## 专业艺术色例外

GradientMotion 的内置 glimm cosine palette、WebGL 不可用时的 CSS fallback palette，以及 `colors` 传入的四个六位 HEX 采样色，已在 [StyleSpec §2.1.3](../../../specs/StyleSpec.md#213-专业艺术色例外强制) 单独登记为专业艺术色例外。shader 必须将这些颜色转换为数值向量并生成连续色域；它们表达生成式画面，不表达按钮、文字、状态或表面语义，因此不要求映射到 SnowUI 语义 Token。

该例外只覆盖 GradientMotion 专业画面的 palette。`colors` 不是通用颜色 Prop 协议，不得据此让其他组件跳过 `resolveSnowUIColor()`；组件根的尺寸、圆角、外部 `class` / `style` 覆盖、无障碍、外层 motion 与 reduced-motion 仍遵守现行规范。新增 palette 类型或把这些颜色用于 UI 语义前必须重新登记。

## 使用示例

```svelte
<GradientMotion size={80} radius="9999px" />
```

```svelte
<GradientMotion variant="berry" class="w-full h-full" radius="24px" speed={0.8} />
```

```svelte
<Frame style="width: 44rem; height: 18rem; overflow: hidden; border-radius: 2rem;">
    <GradientMotion variant="prism" width="100%" height="100%" radius="2rem" />
</Frame>
```

```svelte
<Avatar fallback={GradientMotion} data-name="Ada Lovelace" />
```

```svelte
<GradientMotion variant="avatar" seed="Ada Lovelace" size={80} radius="9999px" />
```

```svelte
<Avatar>
    <GradientMotion as="avatar-image" variant="random" seed="profile-42" />
    <Badge as="badge" dot />
</Avatar>
```

```svelte
<script lang="ts">
  let motionSpeed = $state(1);
  const colors = ["prism", "berry", "lagoon", "citrus", "azure", "ember"] as const;
</script>

<Slider bind:value={motionSpeed} minValue={0.2} maxValue={2} step={0.1} />

{#each colors as color}
  <GradientMotion variant={color} width={200} height={120} radius={20} speed={motionSpeed} />
{/each}
```

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 开发者关键字

| 类别 | 关键字 | 描述 |
| :--- | :--- | :--- |
| CSS 类名 | `snowui-gradient-motion` | 根元素类名 |
| CSS 类名 | `snowui-gradient-motion-canvas` | WebGL 渐变渲染 canvas |
| CSS 类名 | `snowui-gradient-motion-fallback` | WebGL 不可用时的 CSS 降级扫光带 |
| CSS 变量 | `--snowui-gradient-motion-radius` | 圆角 |
| CSS 变量 | `--snowui-gradient-motion-width` / `--snowui-gradient-motion-height` | 尺寸 |

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| GradientMotion | [GradientMotion.svelte](./GradientMotion.svelte) | 主组件 |
| 测试示例 | [GradientMotion.test.ts](./GradientMotion.test.ts) | Test 项目示例 |

### 关键字映射

| 关键字 | 处理方式 | 说明 |
| :--- | :--- | :--- |
| variant | shader uniform | 映射为 glimm cosine palette；`avatar` 或 `as="avatar-image"` 会启用固定色带、往复波动、连续填充与 0.2 倍速 |
| speed / duration | Frame `loopMotion` + WebGL tick | 通过 Frame loop bridge 保留时序语义，shader 内部使用 `speed` 推进时间 |
| size / width / height / radius | CSS 变量 | 输出到根节点，外部 class/style 仍可覆盖 |
| paused | CSS class | 控制 fallback animation 与 WebGL tick |
| decorative | aria 属性 | 装饰图默认 `aria-hidden` |

### 关联关系

- **父组件**: [FramePro.svelte](./FramePro.svelte)
- **可组合组件**: [Avatar.md](../../../components/src/components/Avatar.md), [Image.md](../../../components/src/components/Image.md)

---

## 更新日志 (Changelog)

### 圆角边缘修复（2026-09-16）

- 根层按最终 `radius` 使用单一 `clip-path` 与 alpha mask 裁切完整 WebGL 合成结果，canvas 不再重复应用圆角；同时移除 shader 横切轴两端额外的透明渐隐，避免浅色底层在轮廓内侧形成白色细边。扫光带自身的透明合成、palette 与运动算法保持不变。

### v4.0.1 (2026-08-15)

- 将内置 shader palette、CSS fallback palette 与专用 `colors` 四色艺术输入正式登记为专业艺术色例外，并明确例外不扩展到组件其他样式和动效契约。

### v4.0.0 (2026-07-07)

#### glimm.dev 还原
- 移除旧 gradflow / Neat Blob 视觉算法，改为按 `glimm@0.1.4` 的 shader sweep 渐变效果实现。
- 内置 glimm 6 个 cosine palette：`prism`、`berry`、`lagoon`、`citrus`、`azure`、`ember`。
- 还原 gaussian band、edge wave、ripple、fresnel、specular、entry fade 与 premultiplied alpha 合成。
- 默认时长改为 glimm 的 `800ms` sweep；旧预设名保留为兼容别名。

### v3.3.0 (2026-06-13)

#### Neat Blob
- 新增 `variant="neatBlob"`，效果名称由 SnowUI 侧命名，参数来源为 `repos/neat-main/editor/src/components/presets.ts` 的 `BLOB_PRESET`。

### v3.2.0 (2026-06-13)

#### 预设还原
- 移除旧取色体系，改为完全使用 `meerbahadin/gradflow` 的 8 个内置预设。

### v3.1.0 (2026-06-13)

#### 视觉重写
- 参考 `meerbahadin/gradflow` 的 Wave shader，将渐变主算法重写为三色 smoothstep 混色 + 多层正弦波 / silk / smoke / stripe / conic 流动。

### v3.0.0 (2026-06-13)

#### 视觉重写
- 渐变效果彻底重写为内置 WebGL shader。

### v2.0.0 (2026-06-12)

#### 破坏性变更（仅视觉）
- 渐变效果彻底重写为 orbit + morph + glow 三层有机流体渐变。

### v1.0.0 (2026-06-10)

#### 新功能
- 新增 GradientMotion PRO 组件，支持 6 种渐变预设、随机预设、速度控制、头像与背景场景。
