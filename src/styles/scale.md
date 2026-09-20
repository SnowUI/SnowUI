# scale.css 文档

> **版本**: v1.5.0
> **职责**: 提供“基于容器高度”的统一比例计算能力，服务于 Button / Avatar / Icon 等组件，并支持外部 class 强覆盖。

## 功能概览 (User)

`scale.css` 提供通用类 `.snowui-scale`，统一计算以下属性：

- 文字大小
- Icon 大小
- padding
- gap
- 圆角
- 内边框（`box-shadow: inset`）
- 边框

## 需求对齐 (Requirements)

### 核心目标

1. 以容器高度作为计算基准。
2. 默认按高度比例缩放（文字、Icon、Avatar 等）。
3. 外部 class 可覆盖默认计算，且覆盖后始终以 class 为准。

### 计算口径

1. 文字大小必须按“可用内容高度”计算：
   - 可用内容高度 = 容器高度 - 上下 padding。
2. 圆角按容器高度比例计算。
3. 支持宽度作为唯一计算依据。
4. 支持高宽同时参与的混合计算。
5. 支持高宽比（aspect ratio）作为计算依据。
6. `Icon`、`文字`、`Avatar` 必须支持不同的比例关系（不强制同一比例）。
7. 文本场景需区分：
   - 单行
   - 多行
   - 截断

### 覆盖优先级

1. 外部 class 一旦设置覆盖变量，原默认计算立即失效。
2. 外部 props 显式配置优先于默认计算。
3. 外部 class 优先于外部 props 显式配置。
4. 在响应式变化、容器高度动态变化时，仍保持上述优先级不变。

### 默认行为（观察层与应用层分离）

1. `.snowui-scale` 默认只计算变量，不直接覆盖组件现有视觉样式。
2. 仅当进入 apply 模式时，才应用文字、Icon、padding、gap、圆角、内边框等计算值。
3. apply 模式触发方式：
   - `data-scale-apply="true"`（Frame 自动在显式设置 `sizeRatio` / `iconSizeRatio` / `avatarSizeRatio` 时写入）
   - 或 class `snowui-scale-apply`（外部手动启用）

## 关键字 (Keyword)

### 输入变量（组件定义比例）

| Keyword | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--snowui-scale-height` | `CSS length` | - | 显式基准高度（外部 class/组件显式设置） |
| `--snowui-scale-height-runtime` | `CSS length` | - | 运行时基准高度（由 Frame Scale Observer 写入） |
| `--snowui-scale-width` | `CSS length` | - | 显式基准宽度（外部 class/组件显式设置） |
| `--snowui-scale-width-runtime` | `CSS length` | - | 运行时基准宽度（由 Frame Scale Observer 写入） |
| `--snowui-scale-aspect-ratio` | `number` | - | 显式高宽比（外部 class/组件显式设置） |
| `--snowui-scale-aspect-ratio-runtime` | `number` | - | 运行时高宽比（由 Frame Scale Observer 写入） |
| `--snowui-scale-size-runtime` | `CSS length` | - | 运行时统一尺寸（由 Frame Scale Observer 按 basis 计算后写入） |
| `scaleBasis` / `data-scale-basis` | `'height' \| 'width' \| 'mixed' \| 'aspect'` | `height` | 计算依据模式（由 Frame Prop 驱动） |
| `--snowui-scale-mix-height-weight` | `number` | `0.5` | mixed 模式高度权重 |
| `--snowui-scale-aspect-base-ratio` | `number` | `1` | aspect 模式参考高宽比 |
| `--snowui-scale-size-ratio` | `number` | `1` | 统一尺寸比例（相对 basis size 的倍率；`1`=与 basis size 等大） |
| `--snowui-scale-icon-ratio` | `number` | `1` | Icon 相对统一尺寸比例 |
| `--snowui-scale-avatar-ratio` | `number` | `1` | Avatar 相对统一尺寸比例 |
| `--snowui-scale-ratio-text` | `number` | `0.4` | 文字比例（相对可用内容高度） |
| `--snowui-scale-ratio-icon` | `number` | `0.5` | Icon 比例（相对可用内容高度） |
| `--snowui-scale-ratio-gap` | `number` | `0.2` | gap 比例（相对可用内容高度） |
| `--snowui-scale-ratio-radius` | `number` | `0.4` | 圆角比例（相对容器高度） |
| `--snowui-scale-ratio-padding-x` | `number` | `0.4` | 水平 padding 比例（相对容器高度） |
| `--snowui-scale-ratio-padding-y` | `number` | `0.2` | 垂直 padding 比例（相对容器高度） |
| `--snowui-scale-ratio-border-width` | `number` | `0.025` | 内边框宽度比例（相对容器高度） |

> 说明：`--snowui-scale-size-ratio` 不参与文字字号比例计算。文字仍由 `--snowui-scale-ratio-text` 决定。

### 覆盖变量（外部 class 优先）

| Keyword | Type | Description |
| :--- | :--- | :--- |
| `--snowui-scale-text-size` | `CSS length` | 覆盖文字大小 |
| `--snowui-scale-icon-size` | `CSS length` | 覆盖 Icon 大小 |
| `--snowui-scale-padding-x` | `CSS length` | 覆盖水平 padding |
| `--snowui-scale-padding-y` | `CSS length` | 覆盖垂直 padding |
| `--snowui-scale-gap` | `CSS length` | 覆盖 gap |
| `--snowui-scale-radius` | `CSS length` | 覆盖圆角 |
| `--snowui-scale-border-width` | `CSS length` | 覆盖内边框宽度 |
| `--snowui-scale-border-color` | `CSS color` | 覆盖内边框颜色 |
| `--snowui-scale-border` | `CSS border` | 覆盖边框 |
| `--snowui-scale-min-height` | `CSS length` | 覆盖最小高度 |
| `--snowui-scale-min-width` | `CSS length` | 覆盖最小宽度 |

## 使用示例

```svelte
<!-- 组件内通过 Frame 配置 basis，默认 height -->
<Frame
  class="snowui-scale"
  enableScaleObserver={true}
  scaleBasis="height"
/>
```

```css
.button-scale-sm {
  --snowui-scale-height: var(--space-28, 1.75rem);
  --snowui-scale-width: var(--space-120, 7.5rem);
  --snowui-scale-ratio-text: 0.5;
  --snowui-scale-ratio-icon: 0.5714;
  --snowui-scale-ratio-padding-x: 0.4286;
  --snowui-scale-ratio-padding-y: 0.1429;
}
```

```css
.force-text-icon {
  --snowui-scale-text-size: 0.875rem;
  --snowui-scale-icon-size: 1rem;
}
```

```svelte
<Frame class="snowui-scale" enableScaleObserver={true} scaleBasis="width" />
<Frame class="snowui-scale" enableScaleObserver={true} scaleBasis="mixed" scaleMixHeightWeight={0.35} />
<Frame class="snowui-scale" enableScaleObserver={true} scaleBasis="aspect" scaleAspectBaseRatio={1.5} />
```

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 模块索引 (Module Index)

- 样式实现: [./scale.css](./scale.css)
- 样式入口: [./index.css](./index.css)
- 样式目录说明: [./README.md](./README.md)

### 关键字映射 (Keyword Handling)

- `--snowui-scale-height` → 容器高度基准
- `--snowui-scale-height-runtime` → 运行时高度回退值
- `--snowui-scale-width` / `--snowui-scale-width-runtime` → 宽度基准
- `--snowui-scale-aspect-ratio` / `--snowui-scale-aspect-ratio-runtime` → 高宽比基准
- `--snowui-scale-size-runtime` → 运行时统一尺寸（由 basis 计算）
- `--snowui-scale-height-resolved`（内部）→ `height > runtime > token fallback`
- `--snowui-scale-width-resolved`（内部）→ `width > runtime > height-resolved fallback`
- `--snowui-scale-basis-size`（内部）→ 按 mode 选择 `height/width/mixed/aspect`
- `--snowui-scale-size-resolved`（内部）→ `class size > props size > runtime size > basis size`
- `--snowui-scale-size-ratio-resolved`（内部）→ `class ratio > props ratio > 1`
- `--snowui-scale-content-height`（内部）→ `height - 2 * padding-y`
- `--snowui-scale-text-size-default`（内部）→ `content-height * ratio-text`
- `--snowui-scale-icon-size-default`（内部）→ `content-height * ratio-icon`

### 关联关系

- 被以下组件复用（规划）:
  - `../components/Button.svelte`
  - `../components/Avatar.svelte`
  - `../components/Icon.svelte`

---

## 更新日志 (Changelog)

### v1.5.0 (2026-02-07)

#### 架构重构
- **SC.12** 将 scale 分为“变量计算层”和“样式应用层”，默认仅计算不覆盖视觉样式。
- **SC.13** 新增 apply 模式入口：`data-scale-apply=\"true\"` 或 `.snowui-scale-apply`。

### v1.4.0 (2026-02-07)

#### 新功能
- **SC.9** 新增统一尺寸输入：`--snowui-scale-size-runtime` 与 `--snowui-scale-size-ratio`
- **SC.10** 新增 Icon/Avatar 独立比例：`--snowui-scale-icon-ratio` / `--snowui-scale-avatar-ratio`

#### 文档
- **SC.11** 覆盖优先级更新为 `class > props > default`

### v1.3.0 (2026-02-07)

#### 新功能
- **SC.6** 新增宽度与高宽比输入变量（显式 + 运行时）
- **SC.7** 新增四种 basis 模式：`height` / `width` / `mixed` / `aspect`

#### 架构重构
- **SC.8** 默认计算基准改为 `basis-size`，以支持高宽联合场景

### v1.2.0 (2026-02-07)

#### 新功能
- **SC.4** 新增 `--snowui-scale-height-runtime` 文档定义，用于 Frame 运行时高度注入。

#### 架构重构
- **SC.5** 明确 `--snowui-scale-height-resolved` 回退链：显式高度优先，运行时高度次之。

### v1.1.0 (2026-02-07)

#### 破坏性变更
- **SC.BREAK.1** 变量命名统一为 `--snowui-scale-*`，移除早期非统一前缀变量。

#### 新功能
- **SC.3** 文档补齐完整需求点（高度基准、可用空间、文本场景、Icon/Avatar 比例差异、覆盖优先级）

### v1.0.0 (2026-02-07)

#### 新功能
- **SC.1** 新增统一高度比例计算样式 `scale.css`
- **SC.2** 提供外部 class 覆盖入口，支持覆盖后优先

响应式可读性：Scale 输出的文字字号和功能图标画布最小为 12 CSS px，不随根字号继续缩小。
