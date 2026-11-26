# MenuItem

> **版本**: v1.3.0
> **职责**: 在选项列表或快捷操作面板中呈现一项内容，支持图标、选中状态与禁用反馈。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-20

## 组件介绍

在选项列表或快捷操作面板中呈现一项内容，支持图标、选中状态与禁用反馈。

## 使用选择


作为 Listbox 中的选项使用。普通导航使用 Link 或 SidebarItem；不要把内容列表每行都变成可选择选项。

- 接入 Listbox 时使用 as="item"，同一列表的 value 必须唯一。
- disabled 禁止操作；leading / trailing 放置附件，closeOnSelect 决定选中后是否关闭所属面板。
- 自定义选项的内置删除名称随 LocaleProvider 切换；查询、选项名称和值保持原样，删除仍由所属 Listbox 管理。


## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。


```svelte
<script lang="ts">
	import { MenuItem, Popover, Icon, Text } from '@snowui-design-system/components';
	import { Copy, Check, ArrowCounterClockwise, Upload } from '@snowui-design-system/resource-svelte';
</script>

<Popover size="sm" style="width: min(100%, 22rem);">
    <MenuItem><Icon as="leading"><Copy /></Icon><Text lines={1}>Duplicate example</Text></MenuItem>
    <MenuItem><Icon as="leading"><Check /></Icon><Text lines={1}>Mark reviewed</Text></MenuItem>
    <MenuItem><Icon as="leading"><ArrowCounterClockwise /></Icon><Text lines={1}>Reset sample</Text></MenuItem>
    <MenuItem disabled><Icon as="leading"><Upload /></Icon><Text lines={1}>Publish · owner only</Text></MenuItem>
</Popover>
```


## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| parts | `ComponentPartsOf<{ Button: typeof Button }>` | — | 配置默认内置删除按钮的公开 Props（如 size、class、style）；删除事件、可访问名称和角色仍由组件控制，不影响外置子项。 |
| singleLine | `boolean` | `true` | 普通菜单标签内部复用Frame单行预设，保持附件Hug与最小4 CSS px间距；复杂多行children可显式false并由其内容owner排版。长标签用Text lines=1提供截断和全文。 |
| value | `string` | — | 选项值（通过 as="item" 接入 Listbox 时必填且同一列表内唯一；独立使用时作为选择意图事件的业务标识） |
| selected | `boolean` | `false` | 是否选中（独立使用时有效；使用 as="item" 接入 Listbox 后由宿主覆盖） |
| active | `boolean` | `false` | 是否高亮（独立使用时有效；使用 as="item" 接入 Listbox 后由宿主覆盖） |
| disabled | `boolean` | `false` | 是否禁用（opacity 0.2，阻止点击） |
| showCheck | `boolean` | — | 是否渲染 trailing 勾选槽位；未设置时仅独立 `selected` 项默认开启，Listbox 默认关闭，Select 默认开启 |
| closeOnSelect | `boolean` | — | 点击后是否请求父级浮层关闭；未设置时由父级浮层决定默认策略 |
| children | `Snippet` | — | 无参数的操作项内容；直系 `as="leading"` / `as="trailing"` 子项会参与根级三槽位布局 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="关键字-props"></a>

### 关键字 (Props)

继承 `FrameProps`（排除 `children` / `tag`）。

| 关键字 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `onclick` | `function` | — | 接收 MouseEvent；未禁用且未以 as="item" 接入 Listbox 时触发，返回值忽略。调用 preventDefault 或 stopPropagation 可阻止后续选择意图派发；Listbox 内选择由宿主接管 |
| `class` | `string` | `""` | 自定义 CSS 类名 |
| `enableAutoLayout` | `boolean` | `true` | 内部自动布局协议固定启用；外部传入 `false` 不关闭 MenuItem 的三槽位布局 |
| `enableResponsive` | `boolean` | `false` | 是否开启响应式监听 |
| `enableContext` | `boolean` | `true` | 是否参与上下文能力网络 |
| `enableScaleObserver` | `boolean` | `false` | 是否开启运行时尺寸观察 |

---

<a id="场景行为"></a>

### 场景行为

| 场景 | padding | 状态来源 | 注册 |
| :--- | :--- | :--- | :--- |
| **Listbox 内**（有 `ListboxOwnerContext`） | 8px | context 派生 | 挂载时注册，卸载时注销 |
| **Popover 内 / 独立使用** | 8px | `selected` / `active` Props | 无 |

点击未禁用的 `MenuItem` 后会派发 `snowui-menu-item-select` 选择意图事件，事件携带 `value` 与可选 `closeOnSelect`。`MenuItem` 本身不决定父级浮层是否关闭；`Popover` 等浮层容器按自身默认策略处理，单个 `MenuItem closeOnSelect={...}` 可覆盖容器默认值。`Listbox` 仍由自身选择协议管理关闭行为。

---

<a id="架构"></a>

### 布局模型

主布局模型：**槽位宿主布局**。定义见 ../../../docs/standards/LayoutProtocol.md §12.3。

MenuItem 的根布局固定按 Leading / Label / Trailing 三段组织：

- 根节点是`Frame row singleLine`，并在组件内部固定启用 `enableAutoLayout`；外部传入 `enableAutoLayout={false}` 不关闭 MenuItem 的内部槽位协议。
- 普通文本或 `.snowui-menu-item-label` 是 Content / Fill 槽，负责截断，必须保持 `min-width: 0`。
- 直系 `as="leading"` / `as="trailing"` 支持复杂结构，Leading 与 Trailing 为 Hug。
- `showCheck` 开启时，默认 check / delete 按 Trailing / Hug 处理；关闭时不渲染勾选槽位，也不保留 gap。存在自定义直系 trailing 时默认 check 隐藏。
- Listbox 状态注册、过滤隐藏和 Popover 独立状态是 MenuItem 行为协议，不改变根三槽位布局。

---

<a id="使用示例"></a>


### 在 Popover 中（独立 Props 控制）

```svelte
<Popover>
    <MenuItem onclick={() => alert('通知')}>
        <Icon as="leading"><Bell /></Icon>
        通知
    </MenuItem>
    <MenuItem selected>
        <Icon as="leading"><Bell /></Icon>
        已选中项
    </MenuItem>
    <MenuItem disabled>
        <Icon as="leading"><Bell /></Icon>
        禁用项
    </MenuItem>
</Popover>
```

### 复合 leading / trailing

```svelte
<Popover>
    <MenuItem>
        <Frame as="leading" singleLine>
            <Icon icon={Tag} />
            <Text lines={1}>Tags</Text>
        </Frame>
        <Frame as="trailing" singleLine>
            <Text lines={1}>Multi-Select</Text>
            <Icon icon={CaretRight} />
        </Frame>
    </MenuItem>
</Popover>
```

### 在 Listbox 中（context 自动接管）

```svelte
<Select placeholder="选择城市">
    <Listbox>
        <MenuItem value="shanghai">Shanghai</MenuItem>
        <MenuItem value="beijing">Beijing</MenuItem>
        <MenuItem value="hangzhou">Hangzhou</MenuItem>
    </Listbox>
</Select>
```


---


<a id="连续-hover-宿主"></a>

### 连续 Hover 宿主

MenuItem 在支持连续 hover 的 Listbox / Popover 中由宿主的唯一背景层表达 hover。
独立使用或宿主 `continuousHover={false}` 时仍使用自身即时背景。独立 `active`
背景保持持久，hover 到 active 项时与宿主背景叠加并加深。
