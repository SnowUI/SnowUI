# frame-types.ts 文档

> **版本**: v1.8.0
> **职责**: 定义 Frame 组件的核心类型接口，确保类型安全和代码提示。

## 1. 核心状态类型 (CoreState)

定义了组件生命周期中的核心状态。

```typescript
export type CoreState =
    | "StartLoad"   // 开始加载
    | "Load"        // 加载完成
    | "Reload"      // 重新加载
    | "Appear"      // 出现
    | "Disappear"   // 消失
    | "Idle"        // 空闲
    | "Active"      // 激活
    | "Disabled"    // 禁用
    | "Validating"  // 验证中
    | "Uploading"   // 上传中
    | "Editing"     // 编辑中
    | (string & {}); // 支持自定义状态字符串
```

## 2. 状态转变与联动 (Transitions & Linkage)

### StateTransition
定义状态转变的目标，支持 `auto` 自动流转。

```typescript
export type StateTransition = CoreState | [CoreState, "auto"];
```

### LinkageControl
定义跨组件联动控制结构。支持引用对象 (组件实例) 和事件修饰符。

```typescript
export interface LinkageControl {
    target: string | object;             // 目标组件 ID 或 实例引用
    action: "play" | "reset" | "pause";  // 动作类型
    reverse?: boolean;                   // 是否反向执行
    stop?: boolean;                      // 阻止冒泡
    prevent?: boolean;                   // 阻止默认行为
}
```

### EventTrigger
事件触发器的值类型，可以是简单的状态转变，也可以是复杂的联动控制。

```typescript
export type EventTrigger = CoreState | LinkageControl;
```

## 3. Frame Props 接口

`FrameProps` 接口定义了 Frame 组件支持的所有属性。

### 3.1 基础属性
- `class`, `style`, `children`, `as`, `tag`, `id`, `element`
- `loading`, `skeleton`: 加载协议入口与骨架开关
- `customStates`: 自定义状态列表
- 能力开关：`enableResponsive` / `enableContext` / `enableScaleObserver`
- 自动布局内容宽度：`contentFill` / `contentHug`
- 文本截断已迁移到 `Text` 组件（`lines` / `onTruncate` 不再属于 `FrameProps`）

### 3.1.1 能力开关扩展 (Scale)
- `enableScaleObserver`: 是否启用宽高监听并写入运行时尺寸变量（默认 `false`）
- `scaleHeightVar`: 运行时高度变量名（默认 `--snowui-scale-height-runtime`）
- `scaleWidthVar`: 运行时宽度变量名（默认 `--snowui-scale-width-runtime`）
- `scaleAspectRatioVar`: 运行时高宽比变量名（默认 `--snowui-scale-aspect-ratio-runtime`）
- `scaleSizeVar`: 运行时统一尺寸变量名（默认 `--snowui-scale-size-runtime`）
- `scaleObserverTarget`: 监听目标（`self` / `parent`）
- `scaleBasis`: 计算依据（`height` / `width` / `mixed` / `aspect`，默认 `height`）
- `scaleMixHeightWeight`: mixed 模式下高度权重（默认 `0.5`）
- `scaleAspectBaseRatio`: aspect 模式参考高宽比（默认 `1`）
- `sizeRatio`: 统一尺寸比例（相对 basis size 的倍率，默认 `1`；`1` 表示与 basis size 等大，不是文字比例）
- `iconSizeRatio`: Icon 比例（默认跟随 `sizeRatio`）
- `avatarSizeRatio`: Avatar 比例（默认跟随 `sizeRatio`）

### 3.1.2 Scale 优先级

- `class` 覆盖变量 > `props` 注入变量 > 默认计算
- 上述优先级用于统一保证组件与非组件在同一数值下的计算结果一致

### 3.2 核心状态链式转变
- `StartLoad`, `Load`, `Reload` 等
- `Validating`, `Uploading`, `Editing` (新增)
- `onReload`: Reload 状态的回调

### 3.3 事件驱动
- `Click`, `Drag`, `Hover`, `Focus`, `Key`, `Scroll`

### 3.4 响应式与布局
- `responsive`: 响应式覆写对象
- `xs` - `2xl`: 断点布局方向
- `row`, `column`, `grid`: 内部布局方向
- `morph`: 布局稳定性开关

### 3.5 动效触发器 (while*)
- `whileLoad` - `whileScroll`: 事件驱动动效（其中 `whileLoad` 仅表示加载态动效，不再承担加载状态入口）
- `whileCollapsed`, `whileExpanded`: 形态驱动动效
- `whileXs` - `while2xl`: 响应式驱动动效

### 3.6 动效参数
- `variants`: 动效变体
- `delay`: 延迟
- `scroll`: 滚动联动配置
- `layoutId`: 共享元素转场 ID

### 3.7 Frame Evolution [v1.3]
- CSS 行为工具类已从 `FrameProps` 中移出，组件通过 `class` 主动声明 `.snowui-hoverable` / `.snowui-field-bordered`
- `scope`: 能力作用域 (`self`, `children`, `descendants`, `explicit`)
- `access`: 上下文权限 (`readonly`, `writeable`)

### 3.8 编排 (Orchestration)
- `orchestrate`: 启用编排
- `orchestrateMode`: 编排模式
- `orchestrateOrder`: 视觉排序方式
- `orchestrateGroup`: 编排组 ID

---

## 更新日志 (Changelog)

### v1.8.0 (2026-03-07)

#### 新功能
- 新增 `loading?: boolean` 与 `skeleton?: boolean`，用于分离加载状态入口和骨架呈现开关。

#### 架构重构
- `whileLoad` 回归纯加载态动效配置，不再兼任加载状态入口。

### v1.7.0 (2026-02-23)

#### 架构重构
- 从 `FrameProps` 移除 `enableTruncation` / `lines` / `onTruncate`，截断能力迁移至 `Text` 组件。

### v1.6.0 (2026-02-07)

#### 新功能
- **FT.5** 新增 `scaleSizeVar` 运行时统一尺寸变量
- **FT.6** 新增 `sizeRatio` / `iconSizeRatio` / `avatarSizeRatio` 配置项

#### 文档
- **FT.7** 明确 Scale 配置优先级：`class > props > default`

### v1.5.0 (2026-02-07)

#### 新功能
- **FT.3** 新增 `scaleWidthVar` 与 `scaleAspectRatioVar` 配置项
- **FT.4** 新增 `scaleBasis`、`scaleMixHeightWeight`、`scaleAspectBaseRatio` 配置项

### v1.4.0 (2026-02-07)

#### 新功能
- **FT.1** 新增 `enableScaleObserver` 能力开关
- **FT.2** 新增 `scaleHeightVar` 与 `scaleObserverTarget` 配置项
