# Skeleton.svelte 文档

> **版本**: v1.4.0
> **变更记录 (2026-08-15)**: `renderHints` 升级为组件自注册协议并优先于 class 映射；Frame 首层探测只收集已注册 child；完整消费 `radius`；集中 class 映射降级为兼容层。
> **变更记录 (2026-04-28)**: 标注主布局模型为内禀原子布局，明确多项骨架只是内部渲染布局，不注册为通用宿主布局。
> **职责**: 通用骨架渲染器，供 `Frame` 默认加载协议与测试示例复用。

`Skeleton.svelte` 是独立骨架原语，不继承 `Frame`。它只负责“骨架长什么样”，而“何时进入骨架态”由 [Frame.svelte](./Frame.svelte) 的 `loading + skeleton` 协议负责。

## 布局模型

主布局模型：内禀原子布局。

- Skeleton 作为占位原语时，尺寸优先由组件自注册的 `renderHints` 决定；显式 `variant / width / height` 可覆盖 hints，旧 `componentClass` 映射只作兼容。作为外部布局子项时表现为 Hug 或按调用方传入的固定尺寸渲染。
- 多条 text skeleton、avatar-group skeleton overlap 等只是 Skeleton 私有渲染布局，用于模拟目标组件占位，不向外提供通用区域协议。
- Skeleton 不输出 `data-auto-layout`；Frame 的 loading 协议负责决定是否渲染 Skeleton，Skeleton 本身不接管宿主布局。

## 1. 适用范围

- 直接在 test / demo 中显式渲染骨架，用于观察默认样式。
- 被 `Frame` 在 `loading + skeleton` 协议中内部调用，作为默认占位渲染器。
- 配合组件侧的 `renderHints` 接收最终的骨架尺寸与行数提示。

## 2. 输入协议

### 2.1 组件 Props

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `variant` | `"line" \| "circle" \| "rect" \| "text" \| "circular" \| "rectangular"` | `undefined` | 显式指定骨架形状；别名会归一化到 `line / circle / rect` |
| `width` | `string \| number` | `undefined` | 显式宽度；数字会自动转成 `rem` |
| `height` | `string \| number` | `undefined` | 显式高度；数字会自动转成 `rem` |
| `componentClass` | `string` | `undefined` | 旧调用方兼容入口；仅在没有 `renderHints` 时匹配历史默认布局，新组件不得以此登记 |
| `renderHints` | `RenderHints` | `undefined` | 组件自注册协议，支持 `variant / width / height / radius / rows` |
| `loading` | `boolean` | `true` | 是否显示骨架；为 `false` 时回退渲染 `children` |
| `responsive` | `ResponsiveConfig` | `undefined` | 响应式宽高覆写 |
| `class` | `string` | `""` | 外部类名；多项骨架时挂到布局容器，单项骨架时挂到骨架块本身 |
| `style` | `string` | `""` | 行内样式；多项骨架时挂到布局容器，单项骨架时挂到骨架块本身 |

### 2.2 `renderHints` 规则

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `variant` | `"line" \| "circle" \| "rect"` | 覆盖默认骨架形状 |
| `width` | `string \| number` | 覆盖默认宽度 |
| `height` | `string \| number` | 覆盖默认高度 |
| `radius` | `string \| number` | 覆盖骨架圆角；数字按 16px 名义基准转为 rem |
| `rows` | `number` | 大于 `1` 时展开为多条 `line`，最后一行宽度为容器的 `30%` |

未传 `radius` 时，非圆形 Skeleton 使用 `var(--radius-3, 0.75rem)`；`circle` 始终使用 `50%`。旧 Icon class 映射仍保留 `rect + 50%` 的兼容外观。

## 3. 解析顺序

`Skeleton` 的布局解析顺序固定如下：

1. 存在 `renderHints` 时视为组件已自注册，直接以 hints 创建布局；显式 `variant / width / height` 逐字段优先。
2. 没有 hints 但传了显式 `variant / width / height` 时，按显式单项骨架渲染。
3. 仅旧调用方没有 hints / 显式几何时，才根据 `componentClass` 读取历史默认布局。
4. 完全未命中时回退为通用 `rect` 骨架。

## 4. 默认样式规则

### 4.1 通用样式

| 规则 | 值 |
| :--- | :--- |
| 背景色 | `var(--black-10, #0000001a)` |
| 动画 | `snowui-skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite` |
| 交互 | `pointer-events: none; user-select: none;` |
| 显示 | `display: block` |

### 4.2 布局容器样式

| 规则 | 值 |
| :--- | :--- |
| 布局模式 | `display: flex` |
| 默认对齐 | `align-items: center` |
| 默认间距 | `var(--gap-2)` |
| 字号变量 | `--snowui-skeleton-font-size: var(--text-14)` |
| 行高变量 | `--snowui-skeleton-line-height: var(--leading-14)` |

补充规则：

- `.snowui-skeleton-layout-single` 会切回 `display: block`。
- `.snowui-skeleton-layout-text` 会改为纵向布局：`width: 100%; flex-direction: column; align-items: stretch;`
- `.snowui-skeleton-layout-avatar-group` 保持 `gap: 0`。

### 4.3 形状默认值

| 形状 | 默认宽度 | 默认高度 | 默认圆角 |
| :--- | :--- | :--- | :--- |
| `line` | `6rem` | `1.25rem` | `var(--radius-3, 0.75rem)` |
| `circle` | `2.5rem` | `2.5rem` | `50%` |
| `rect` | `6rem` | `3rem` | `var(--radius-3, 0.75rem)` |

补充规则：

- `line` 和 `rect` 默认圆角统一为 `12px`。
- `circle` 永远保持 `border-radius: 50%`。
- `line / circle / rect` 都有 `max-width: 100%; max-height: 100%;` 兜底。

## 5. 组件自注册规则

支持默认 Skeleton 的组件在真实根 Frame 上提供最终 `renderHints`。默认值由组件拥有，调用方传入的 `renderHints` 逐字段优先；尺寸随公开 `size / width / height / rows` 变化时，组件必须先解析最终值再注册。

Frame DOM runtime 在存在 hints 时输出 `data-skeleton-registered="true"` 及对应 `data-render-hint-*`；Tooltip 等直接以 Skeleton 为加载根的窄例外由 Skeleton 输出同一登记属性。父 Frame 进入加载态时，只探测第一层带该标记的 child；未注册的纯布局 / 逻辑节点不生成多余骨架。若当前 Frame 自身没有 hints、首层也没有注册项，仍生成通用 fallback，因此页面无需手写 Skeleton。

`COMPONENT_CLASS_MAPPING` 与 `getSkeletonComponentKey()` 只为旧版直接传 `componentClass` 的调用方保留。SnowUI 新组件与新骨架布局不得新增 class 映射；应在组件根提供 hints，并在组件文档说明动态几何来源。

## 6. 文本骨架规则

任何已注册组件都可以用 `renderHints.rows` 展开成多条文字骨架；Text 会根据内容自动计算行数。

### 6.1 行数来源

- `Text` 自身在骨架态下会统计第一层块级文本段落节点数量。
- 当前统计的标签集合是：
  - `div`
  - `p`
  - `li`
  - `blockquote`
  - `h1-h6`
- 第一层存在纯文本内容时，会额外记作 `1` 条。
- 最终最少渲染 `1` 条。

### 6.2 多条文字骨架布局

| 规则 | 值 |
| :--- | :--- |
| 布局方向 | 上下排列 |
| 容器宽度 | `renderHints.width` / 第一行宽度；未提供时 `100%` |
| 前置行宽度 | `100%` |
| 最后一行宽度 | `30%` |
| 单行高度 | `1.25rem` |

## 7. 第一层渲染规则

`Skeleton` 本身不负责递归拆解整棵组件树，当前规则固定为“只看第一层”。

- 当组件自身进入 `loading + skeleton` 时，优先渲染当前组件自己的 Skeleton。
- 不继续展开组件内部的 `Icon / Text / Avatar` 等子组件。
- 当 `Frame` 进入 `loading + skeleton` 时：
  - 若第一层存在已自注册的直接子组件，则只渲染这些第一层组件对应的 Skeleton。
  - 若第一层不存在组件，则 `Frame` 自身回退为文字形态 Skeleton。

## 8. 尺寸规则

- 数字型 `width / height` 会统一转成 `rem`。
- `Skeleton` 优先使用组件通过 `renderHints.width / height / radius / rows` 提供的最终几何。
- 这意味着圆角矩形 Skeleton 在组件已经提供尺寸提示时，会跟随组件的最终宽高，而不是回退成通用短宽。
- 当前没有启用“读取真实 DOM 实测尺寸”的通用机制。

## 9. 上下文与协议关系

骨架加载上下文通过 `SKELETON_CONTEXT_KEY` 传递：

| 属性 | 描述 |
| :--- | :--- |
| `loading` | 是否处于加载状态 |
| `skeleton` | 是否启用骨架渲染 |

职责分工：

- `Frame` 负责 `loading / skeleton` 协议入口
- `Skeleton` 负责骨架样式、长度规则和 hints 解析；class 映射只作兼容
- 组件通过根 `renderHints` 自注册最终骨架几何

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 模块索引

- **Skeleton 组件**: [./Skeleton.svelte](./Skeleton.svelte)
- **加载协议入口**: [./Frame.svelte](./Frame.svelte)
- **类型定义**: [../logic/frame-types.ts](../logic/frame-types.ts)

### 关键字 / 函数映射

| 类别 | 名称 | 描述 |
| :--- | :--- | :--- |
| CSS 类名 | `snowui-skeleton` | 单个骨架块 |
| CSS 类名 | `snowui-skeleton-line` | 圆角长条骨架 |
| CSS 类名 | `snowui-skeleton-circle` | 圆形骨架 |
| CSS 类名 | `snowui-skeleton-rect` | 圆角矩形骨架 |
| CSS 类名 | `snowui-skeleton-layout-*` | 骨架组合布局 |
| 兼容函数 | `getSkeletonComponentKey` | 仅为旧版 `componentClass` 调用识别组件类型 |
| 解析函数 | `resolveSkeletonLayout` | 优先将组件 `renderHints` 解析为骨架布局，再处理兼容与 fallback |
| 布局函数 | `createTextLayout` | 生成多条文字骨架布局 |
| 覆写函数 | `applyRenderHints` | 将 `renderHints` 叠加到默认布局 |

## 更新日志 (Changelog)

### v1.4.0 (2026-08-15)

- 组件通过根 Frame `renderHints` 自注册，不再要求维护集中 class mapping。
- Frame 首层 probe 只收集 `data-skeleton-registered="true"` 的 child。
- `renderHints.radius` 进入 DOM bridge、probe 与 Skeleton 最终样式。
- 旧 `COMPONENT_CLASS_MAPPING` 保留兼容，但不再接受新 SnowUI 组件登记。

### v1.3.9 (2026-07-30)

- Gradient 完全重写后，默认骨架回退尺寸同步调整为 `360 × 360`；显式 `renderHints` 仍优先。

### v1.3.8 (2026-07-21)

- Gradient 默认骨架回退尺寸同步调整为 `355 × 355` 正方形；显式 `renderHints` 仍优先。

### v1.3.7 (2026-07-20)

- 登记 Gradient 根类名与默认矩形布局；实际 loading 尺寸由 Gradient 的 `renderHints` 覆盖。

### v1.3.6 (2026-03-14)

#### 样式
- Input Skeleton 默认高度同步为 `1.25rem` (20px)，代表内容区域高度。配合 Frame 的 12px 上下 padding，总高度维持在 44px。

### v1.3.5 (2026-03-07)

#### 文档
- 系统补齐 Skeleton 当前全部规则文档，明确：
  - 形状别名
  - 默认尺寸
  - 圆角与动画规则
  - 组件映射表
  - `Text` 多条骨架布局与尾行宽度规则
  - 第一层组件渲染规则
  - `renderHints` 与尺寸继承规则

### v1.3.4 (2026-03-07)

#### 文本骨架布局
- `Text` 多条 Skeleton 改为上下排列，不再并排显示。
- `Text` 多条 Skeleton 中，前置行默认宽度占满文本容器，最后一条固定为文本容器宽度的 `30%`。

#### 尺寸约束
- 圆角矩形 Skeleton 继续优先跟随组件通过 `renderHints` 提供的最终宽高，不额外压缩为通用短宽样式。

### v1.3.3 (2026-03-07)

#### 渲染逻辑
- 骨架渲染规则收敛为“只看第一层组件”。
- `Frame` 在骨架态下优先渲染第一层直接子组件的 Skeleton；只有当第一层没有组件时才回退为自身文字骨架。
- `Text` 在骨架态下新增第一层段落统计逻辑：按第一层块级段落节点数量生成多条文字 Skeleton，并默认占满文本容器宽度。

### v1.3.2 (2026-03-07)

#### 样式调整
- 除圆形骨架外，其他 Skeleton 默认圆角统一为 `12`。
- `text / line` Skeleton 默认高度调整为 `20px`（`1.25rem`）。

### v1.3.1 (2026-03-07)

#### 样式调整
- 矩形骨架默认圆角明确为 `12`（`--radius-3`，fallback `0.75rem`）。

### v1.3.0 (2026-03-07)

#### 架构重构
- 释放 `whileLoad` 关键字：Skeleton 改用 `loading` 控制显隐，配合 Frame 的 `loading / skeleton / whileLoad` 协议分层。

### v1.2.1 (2026-03-07)

#### 新功能
- 补齐 `frame / test` 的 Skeleton 映射与布局声明，配合 standards 检查实现组件目录 Skeleton 覆盖完整性校验。

### v1.2.0 (2026-03-07)

#### 架构重构
- Skeleton 改为不依赖 `Frame` 的独立骨架原语组件，供 `Frame` 默认加载协议与测试示例共同复用。
- 骨架形状收敛为 `line / circle / rect` 三类。
- 新增基于组件根类名的集中骨架分配逻辑。

## 使用示例

```svelte
<!-- 直接显示 Skeleton，用于查看默认样式 -->
<div class="flex flex-col gap-8">
    <Skeleton variant="text" width="12rem" />
    <Skeleton variant="circular" width={40} height={40} />
    <Skeleton variant="rectangular" width="16rem" height="6rem" />
</div>

<!-- 页面或区块根使用 loading，子组件自动继承骨架态 -->
<Frame loading={pageLoading}>
    <Button>提交</Button>
    <Text>加载中的文本</Text>
</Frame>

<!-- Frame 只渲染第一层组件 Skeleton -->
<Frame loading skeleton>
    <Button variant="filled">
        <Icon />
        <Text>Search</Text>
    </Button>
</Frame>

<!-- Text 按第一层段落数渲染多条 Skeleton -->
<Text loading skeleton class="w-full">
    <div>段落一</div>
    <div>段落二</div>
    <div>段落三</div>
</Text>

<!-- 禁用骨架，只保留真实组件的加载态动效 -->
<Frame
    loading={pageLoading}
    skeleton={false}
    whileLoad={{ opacity: 0.6, scale: 0.98 }}
>
    <Button>提交</Button>
</Frame>
```
