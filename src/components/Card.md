# Card.svelte

> **版本**: v1.0.1
> **更新**: 2026-05-26
> **职责**: 提供可承载自定义内容、Pin 子项与溢出滚动的通用表面容器，不内建标题或操作区。
> **布局模型**: 槽位宿主布局 / 容器内组件间布局
> **文档**: ./Card.md

Card 是通用容器组件，只负责外壳视觉、内容排列、Pin 承载和内容溢出滚动。Card 不内建标题、正文、图标或操作区；内部内容完全由使用方自定义。

用户 API 与组合说明如下；源码实现见 [Card.svelte](./Card.svelte)。

---

## 关键字速查

| 类别 | 关键字 |
|:---|:---|
| **布局** | `row`, `column`, `wrap`, `scrollable` |
| **状态** | `active`, `selected`, Frame `data-state="Active"` |
| **交互** | `interactive`, `disabled` |
| **Pin** | `pinOffset`, `pinOffsetX`, `pinOffsetY`, 子节点 `as="pin-*"` |
| **内容** | `children` |
| **Frame 透传** | `class`, `style`, `data-*`, 事件、动效关键字等 `...rest` |

---

## Props

| 关键字 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| `row` | `boolean` | `false` | 横向排列直系普通内容。与 Frame 写法一致 |
| `column` | `boolean` | —（!row） | 纵向排列普通内容，未传时取 row 的反值；row 与 column 同时为 true 时 row 优先。 |
| `wrap` | `boolean` | `false` | 普通内容是否允许换行；默认不换行 |
| `contentFill` | `boolean` | `false` | 普通内容子项宽度填满 Card 内容区；优先级高于 `contentHug` |
| `contentHug` | `boolean` | `false` | 普通内容子项宽度按内容收缩 |
| `active` | `boolean` | `false` | 是否使用激活态外观 |
| `selected` | `boolean` | `false` | 激活态语义别名；作用和效果与 `active` 相同 |
| `interactive` | `boolean` | `false` | 使容器具备交互外观、指针和 hover 边框；点击副作用仍由调用方事件负责，不自动导航、选择或生成按钮键盘行为。 |
| `scrollable` | `boolean` | `true` | 内容溢出时是否启用内部滚动；无高度约束时内容自然撑高 |
| `pinOffset` | `number \| string` | `12` | Pin 内容统一偏移，数字按 px 处理 |
| `pinOffsetX` | `number \| string` | - | Pin 水平偏移，优先级高于 `pinOffset` |
| `pinOffsetY` | `number \| string` | - | Pin 垂直偏移，优先级高于 `pinOffset` |
| `children` | `Snippet` | - | 任意自定义内容 |
| `...rest` | `FrameProps` | - | 透传至根 Frame |

---

## 外观

Card 默认外观来自 Figma Card 组件：

| 状态 | 背景 | 内置边框 |
|:---|:---|:---|
| Default | `surface/1` | 无 |
| Hover | `surface/1` | `0.5px black/40%` |
| Active | `surface/1` | `1px primary` |

边框使用 StyleSpec 内边框规范的 inset `box-shadow` 实现，不占布局尺寸。Card 不叠加 inner shadow。激活态包括：

- `active={true}`
- `selected={true}`
- Frame 状态机输出 `data-state="Active"`

激活态优先级高于 hover，激活态边框颜色固定为 `Primary`。

---

## 布局

Card 使用 `row` / `column`，与 Frame 方向关键字统一。

```svelte
<Card>
  <Text>第一行</Text>
  <Text>第二行</Text>
</Card>

<Card row>
  <Text>第一列</Text>
  <Text>第二列</Text>
</Card>
```

内容宽度策略：

- 默认自动判断：Card 有显式宽度（如 `style="width:..."`、`width` class、`w-full` / `size-full`）时普通内容为 Fill；Card 为 Hug 宽度时普通内容也为 Hug。
- `contentFill` 强制普通内容 Fill。
- `contentHug` 强制普通内容 Hug。
- `contentFill` 与 `contentHug` 同时传入时，`contentFill` 优先。

默认 `column`：

- gap 为 `4px`
- Fill 内容子节点 `width: 100%`
- Hug 内容子节点 `width: fit-content; max-width: 100%`

`row`：

- gap 为 `8px`
- Fill 内容子节点 `flex: 1 1 0; min-width: 0`
- Hug 内容子节点 `flex: 0 0 auto; min-width: 0`

`row` 与 `column` 同时传入时，按 Frame 当前解析规则 `row` 优先。

Card 默认关闭 wrap；需要换行时显式传入 `wrap`。

---

## 三槽内容

Card 不提供 `CardItem` 子组件。需要 leading / content / trailing 三槽内容时，使用现有 Frame：

```svelte
<Card>
  <Frame row>
    <Icon as="leading">...</Icon>
    <Text>标题</Text>
    <Button as="trailing" bare>...</Button>
  </Frame>
</Card>
```

这样可以复用 SnowUI 现有的三槽位、Fill / Hug、gap、wrap 与外置槽位替换协议。

---

## Pin

Card 只采用 `as="pin-*"` 协议，不提供 `position` prop 或对象式 pin 配置。

```svelte
<Card>
  <Icon as="pin-top-right">...</Icon>
  <Text>内容</Text>
</Card>
```

支持九方位：

| 方位 | 写法 |
|:---|:---|
| top-left | `as="pin-top-left"` |
| top | `as="pin-top"` |
| top-right | `as="pin-top-right"` |
| left | `as="pin-left"` |
| center | `as="pin-center"` |
| right | `as="pin-right"` |
| bottom-left | `as="pin-bottom-left"` |
| bottom | `as="pin-bottom"` |
| bottom-right | `as="pin-bottom-right"` |

默认 Pin 偏移为 `12px`。

---

## 内容滚动

`scrollable=true` 默认开启。Card 没有高度或最大高度约束时，内容自然撑高，不显示滚动条。

当外部通过 `height` / `max-height` / class 限制 Card 高度，且内容超过可视区域时，内部滚动条自动显示；内容未溢出时滚动条隐藏。

滚动条复用 `useOverlayScrollbar` 与 `scrollbar.css` 的 `.snowui-overlay-scrollbar*` 共享类。组件内只负责轨道定位，禁止重复编写滚动条视觉 CSS。

Pin 内容不参与普通内容滚动流，仍以 Card 根容器为定位参照。

---

## 样式变量

| 变量 | 用途 |
|:---|:---|
| `--snowui-card-background-override` | 背景 |
| `--snowui-card-padding-y-override` | 上下 padding |
| `--snowui-card-padding-x-override` | 左右 padding |
| `--snowui-card-radius-override` | 圆角 |
| `--snowui-card-gap-row-override` | 横向内容 gap |
| `--snowui-card-gap-column-override` | 纵向内容 gap |
| `--snowui-card-pin-offset-override` | Pin 默认偏移 |
| `--snowui-card-hover-border-color-override` | hover 内置边框颜色 |
| `--snowui-card-active-border-color-override` | active 内置边框颜色 |

---

## AI Zone

- [Card.svelte](./Card.svelte) 拥有根表面、普通内容排列、Pin 与滚动宿主；selected/active 只映射视觉状态，不执行页面操作。
- 根节点复用 Frame 处理公开属性、状态与尺寸协议；`useOverlayScrollbar` 和 `resizeManager` 分别拥有共享滚动条与尺寸观察能力，Card 不复制其运行时。
- 内容完全由 children 提供，不生成标题或按钮，也不提供 parts；Pin 子项脱离普通滚动内容流。

## Changelog

### v1.0.1 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

- v1.0.0: 初始版本，支持容器外观、row / column、wrap、active / selected、Pin 与内容溢出滚动。
