# frame-scale-observer.svelte.ts 文档

> **版本**: v1.3.2
> **职责**: 监听节点宽高并写入运行时 CSS 变量，服务统一比例系统（不直接应用视觉样式）。

## 1. 功能概览

`frameScaleObserver` 是一个 Svelte Action，用于将元素实时宽高写入 CSS 变量：

- `--snowui-scale-height-runtime`
- `--snowui-scale-width-runtime`
- `--snowui-scale-aspect-ratio-runtime`
- `--snowui-scale-size-runtime`

## 2. 关键字

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| heightVar | `string` | `--snowui-scale-height-runtime` | 写入运行时高度变量名 |
| widthVar | `string` | `--snowui-scale-width-runtime` | 写入运行时宽度变量名 |
| aspectRatioVar | `string` | `--snowui-scale-aspect-ratio-runtime` | 写入运行时高宽比变量名 |
| sizeVar | `string` | `--snowui-scale-size-runtime` | 写入运行时统一尺寸变量名 |
| target | `'self' \| 'parent'` | `'self'` | 监听并写入变量的目标节点 |
| basis | `'height' \| 'width' \| 'mixed' \| 'aspect'` | `'height'` | 统一尺寸计算依据 |
| mixHeightWeight | `number` | `0.5` | `mixed` 模式高度权重 |
| aspectBaseRatio | `number` | `1` | `aspect` 模式参考高宽比 |
| sizeRatio | `number` | `1` | 统一尺寸比例 |

## 3. 统一计算链路（对容器内子内容的影响）

设：
- 容器解析高度 = `H`
- 容器解析宽度 = `W`
- 当前高宽比 = `R = W / H`

1. `basis size`（由 `basis` 决定）  
  - `height`: `B = H`  
  - `width`: `B = W`  
  - `mixed`: `B = H * mixHeightWeight + W * (1 - mixHeightWeight)`  
  - `aspect`: `B = H * (R / aspectBaseRatio)`

2. 统一尺寸  
  - `S = B * sizeRatio`（并写入 `sizeVar` 对应的运行时变量）

3. 默认样式计算（未被 class/props 覆盖时）  
  - `padding-x = B * --snowui-scale-ratio-padding-x`  
  - `padding-y = B * --snowui-scale-ratio-padding-y`  
  - `content-height = B - 2 * padding-y`  
  - `text-size = content-height * --snowui-scale-ratio-text`  
  - `icon-size = S * iconSizeRatio`  
  - `avatar-size = S * avatarSizeRatio`  
  - `gap = content-height * --snowui-scale-ratio-gap`  
  - `radius = B * --snowui-scale-ratio-radius`  
  - `inset-border-width = B * --snowui-scale-ratio-border-width`（`box-shadow: inset`）  
  - `border` 默认不按比例自动生成，仍由 `--snowui-scale-border`（默认 `0 solid transparent`）决定

> 影响范围：容器内文字、Icon、Avatar 以及容器自身的 padding / gap / 圆角 / 内边框都会随 `B` 与 `S` 变化。

## 4. 数值示例（H=28px）

若 `H=28` 且采用默认 `sizeRatio=1`：

- 当 `basis="height"`：`B=28`，`S=28`
- 当 `basis="width"`：`B=W`，`S=W`
- 当 `basis="mixed"` 且默认权重 `0.5`：`B=(28+W)/2`，`S=(28+W)/2`
- 当 `basis="aspect"` 且默认 `aspectBaseRatio=1`：`B=28*(W/28)=W`，`S=W`

例如 `W=112` 时：
- `height` 模式：`B=28`，`S=28`
- `width` 模式：`B=112`，`S=112`
- `mixed` 模式：`B=70`，`S=70`
- `aspect` 模式：`B=112`，`S=112`

因此，容器“实际宽度是多少”会直接通过 `basis` 参与 `B` 的计算，进而影响文字、Icon、Avatar、padding、gap、圆角、内边框的最终像素值。

## 5. 关键字逐项影响（11 项）

| 关键字 | 直接作用 | 对子组件/子内容的影响 |
| :--- | :--- | :--- |
| `scaleHeightVar` | 写入运行时高度 `H` | 当 `scaleBasis=height/mixed/aspect` 时，参与 `B` 计算，进而影响文字、Icon、Avatar、padding、gap、圆角、内边框 |
| `scaleWidthVar` | 写入运行时宽度 `W` | 当 `scaleBasis=width/mixed/aspect` 时，参与 `B` 计算，进而影响上述所有比例结果 |
| `scaleAspectRatioVar` | 写入运行时高宽比 `R=W/H` | 当 `scaleBasis=aspect` 时决定 `B`，进而影响上述所有比例结果 |
| `scaleSizeVar` | 写入运行时统一尺寸 `S` | 直接影响 Icon/Avatar 默认尺寸链路（若未被 class/props 覆盖） |
| `scaleObserverTarget` | 指定监听对象（`self/parent`） | 决定 `H/W/R/S` 取值来自哪个容器，从源头改变子内容所有比例结果 |
| `scaleBasis` | 指定 `B` 计算模式 | 决定以高、宽、混合或高宽比作为基准，直接改变文字、padding、gap、radius、内边框、Icon、Avatar |
| `scaleMixHeightWeight` | `mixed` 模式权重 | 改变 `B=H*w+W*(1-w)`，从而改变所有依赖 `B`/`S` 的子项 |
| `scaleAspectBaseRatio` | `aspect` 参考比值 | 改变 `B=H*(R/base)` 的放大/缩小倍率，进而影响所有依赖 `B`/`S` 的子项 |
| `sizeRatio` | 统一尺寸倍率 | 改变 `S=B*sizeRatio`，主要影响 Icon/Avatar 等统一尺寸链路（不是文字比例） |
| `iconSizeRatio` | Icon 独立倍率 | 在 `S` 基础上单独调整 Icon：`icon-size=S*iconSizeRatio` |
| `avatarSizeRatio` | Avatar 独立倍率 | 在 `S` 基础上单独调整 Avatar：`avatar-size=S*avatarSizeRatio` |

## 6. basis size 补充说明

- `basis size` 是 Scale 系统里的“统一基准尺寸”，用于后续比例计算（如 `sizeRatio`、`iconSizeRatio`、`avatarSizeRatio`）。
- 它与容器大小的关系由 `scaleBasis` 决定：
  - `height`: `basis size = 容器解析高度`（显式 `--snowui-scale-height` > runtime 高度 > fallback）
  - `width`: `basis size = 容器解析宽度`
  - `mixed`: `basis size = 高度 * 高度权重 + 宽度 * 宽度权重`
  - `aspect`: `basis size = 高度 * (当前高宽比 / 参考高宽比)`
- 因此，当“以容器高为基准”（`scaleBasis="height"`）时，`basis size` 与容器解析高度等值。

## 7. 设计约束

1. 不直接写入 `--snowui-scale-height` / `--snowui-scale-width`，避免覆盖外部 class。
2. 使用共享 `ResizeObserverManager`，避免每个组件独立创建观察器。
3. 该 observer 仅负责“观察与变量写入”，不直接触发样式覆盖；样式是否生效由 apply 模式控制。
4. 模块导入与服务端渲染不创建 `ResizeObserver`；仅在浏览器挂载后的首次 `watch()` 延迟创建。浏览器缺少该 API 或初始化失败时，尺寸变量观察退化为无操作，组件核心内容与其他交互继续可用。
5. 同一帧的通知由共享 Manager 合并，并在下一动画帧统一交付，避免观察回调同步写入尺寸变量形成循环。

## 8. 使用示例

```ts
use:frameScaleObserver={{
  heightVar: "--snowui-scale-height-runtime",
  widthVar: "--snowui-scale-width-runtime",
  aspectRatioVar: "--snowui-scale-aspect-ratio-runtime",
  sizeVar: "--snowui-scale-size-runtime",
  basis: "height",
  mixHeightWeight: 0.5,
  aspectBaseRatio: 1,
  sizeRatio: 1,
  target: "self"
}}
```

---

## 更新日志 (Changelog)

### v1.3.2 (2026-08-17)

- 共享 `ResizeObserverManager` 改为首次 `watch()` 时延迟创建，保证模块导入与 SSR 不访问浏览器 API。
- `ResizeObserver` 缺失或初始化失败时只关闭尺寸观察增强，不再抛出未处理异常。

### v1.3.1 (2026-02-07)

#### 文档
- **SOBS.7** 明确 observer 职责为“仅写变量不直接应用样式”，与 apply 模式分层一致。

### v1.3.0 (2026-02-07)

#### 文档
- **SOBS.6** 补充统一计算链路、`H=28px` 数值示例、11 个关键字逐项影响与 `basis size` 说明。

### v1.2.0 (2026-02-07)

#### 新功能
- **SOBS.4** 新增 `sizeVar`，输出统一运行时尺寸变量。
- **SOBS.5** 新增 `basis` / `mixHeightWeight` / `aspectBaseRatio` / `sizeRatio`，使运行时尺寸计算与 scale 配置对齐。

### v1.1.0 (2026-02-07)

#### 新功能
- **SOBS.2** 新增运行时宽度与高宽比变量写入能力。
- **SOBS.3** 导出函数名统一为 `frameScaleObserver`，与文件名语义一致。

### v1.0.0 (2026-02-07)

#### 新功能
- **SOBS.1** 新增尺寸监听 action，向 CSS 变量写入运行时尺寸
