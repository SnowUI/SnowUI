# Card

> **版本**: v1.0.1
> **职责**: 为相关内容提供统一的卡片表面，可自由组合文字、媒体和操作，支持固定子项与内容滚动。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

为相关内容提供统一的卡片表面，可自由组合文字、媒体和操作，支持固定子项与内容滚动。

## 使用选择


用于有独立信息层级的内容容器。普通页面网格和留白由页面布局负责；不要给每层嵌套内容重复添加卡片外壳。

- 用 row / column 选择主要布局，contentFill / contentHug 控制内容占位。
- selected、active 和 interactive 分别表达选择、激活与交互；内容由 children 提供，Card 不生成业务信息。


## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。


```svelte
<script lang="ts">
	import { Card, Frame, Text } from '@snowui-design-system/components';
</script>

<div style="display: flex; justify-content: center; width: 100%;">
	<Card style="background-color: var(--background-1);" padding={4} radius={5} width={286} height={84}>
		<Frame singleLine>
			<Text lines={1} style="font-size: var(--text-14); line-height: var(--leading-14); color: var(--black-100);">Component views</Text>
			<Text lines={1} as="trailing" style="font-size: var(--text-14); line-height: var(--leading-14); color: var(--black-100);">+11.01%</Text>
		</Frame>
		<Text style="font-size: var(--text-18); line-height: var(--leading-18); font-weight: 600; color: var(--black-100);">7,265</Text>
	</Card>
</div>
```


## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| row | `boolean` | `false` | 横向排列直系普通内容。与 Frame 写法一致 |
| column | `boolean` | — | 纵向排列普通内容，未传时取 row 的反值；row 与 column 同时为 true 时 row 优先。 |
| wrap | `boolean` | `false` | 普通内容是否允许换行；默认不换行 |
| contentFill | `boolean` | `false` | 普通内容子项宽度填满 Card 内容区；优先级高于 `contentHug` |
| contentHug | `boolean` | `false` | 普通内容子项宽度按内容收缩 |
| selected | `boolean` | `false` | 激活态语义别名；作用和效果与 `active` 相同 |
| active | `boolean` | `false` | 是否使用激活态外观 |
| interactive | `boolean` | `false` | 使容器具备交互外观、指针和 hover 边框；点击副作用仍由调用方事件负责，不自动导航、选择或生成按钮键盘行为。 |
| scrollable | `boolean` | `true` | 内容溢出时是否启用内部滚动；无高度约束时内容自然撑高 |
| children | `Snippet` | — | 任意自定义内容 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="关键字速查"></a>

### 外观

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

<a id="布局"></a>

### 布局

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
- `contentFill` 强制内容 viewport 和普通内容填满 Card 内容区，避免 viewport 本身按内容收缩。
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

<a id="三槽内容"></a>

### 三槽内容

Card 不提供 `CardItem` 子组件。需要 leading / content / trailing 三槽内容时，使用现有 Frame：

```svelte
<Card>
  <Frame singleLine>
    <Icon as="leading">...</Icon>
    <Text lines={1}>标题</Text>
    <Button as="trailing" bare>...</Button>
  </Frame>
</Card>
```

这样可以复用 SnowUI 现有的三槽位、Fill / Hug、gap、wrap 与外置槽位替换协议。单行名称、日期、状态或独立文字组合使用 `singleLine`，缩窄及缩放后间距仍至少4 CSS px；附件声明 leading / trailing 保留尺寸，文字用 `Text lines={1}` 缩略并保留全文访问。地址、说明正文、统计列组和外部卡片换行仍由各自布局负责，不将整张 Card 强制为单行。

---

<a id="pin"></a>

### Pin

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

<a id="内容滚动"></a>

### 内容滚动

`scrollable=true` 默认开启。Card 没有高度或最大高度约束时，内容自然撑高，不显示滚动条。

当外部通过 `height` / `max-height` / class 限制 Card 高度，且内容超过可视区域时，内部滚动条自动显示；内容未溢出时滚动条隐藏。

滚动条复用 `useOverlayScrollbar` 与 `scrollbar.css` 的 `.snowui-overlay-scrollbar*` 共享类。组件内只负责轨道定位，禁止重复编写滚动条视觉 CSS。

Pin 内容不参与普通内容滚动流，仍以 Card 根容器为定位参照。

---

<a id="样式变量"></a>
