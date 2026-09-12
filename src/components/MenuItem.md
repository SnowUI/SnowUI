# MenuItem.svelte 文档

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../specs/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。`parts.Button` 配置默认内置操作按钮（包含 size、class、style），功能事件、ARIA和角色仍由父组件控制。


> **版本**: v1.2.3
> **状态**: 已实现
> **职责**: 浮层面板操作项，统一支持 Listbox 选项与 QuickAction 操作项两种场景。有 `ListboxOwnerContext` 时自动注册并从 context 派生状态；无 context 时通过 Props 直接控制。padding 在两种场景中统一为 8px。

---

## 关键字 (Props)

继承 `FrameProps`（排除 `children` / `tag`）。

| 关键字 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `value` | `string` | — | 选项值（Listbox 内使用时必填，同一 Listbox 内唯一） |
| `selected` | `boolean` | `false` | 是否选中（独立使用时有效；Listbox 内由 context 覆盖） |
| `active` | `boolean` | `false` | 是否高亮（独立使用时有效；Listbox 内由 context 覆盖） |
| `disabled` | `boolean` | `false` | 是否禁用（opacity 0.2，阻止点击） |
| `showCheck` | `boolean` | — | 是否渲染 trailing 勾选槽位；未设置时仅独立 `selected` 项默认开启，Listbox 默认关闭，Select 默认开启 |
| `closeOnSelect` | `boolean` | — | 点击后是否请求父级浮层关闭；未设置时由父级浮层决定默认策略 |
| `onclick` | `function` | — | 点击回调（独立使用时有效；Listbox 内由 context 接管） |
| `children` | `Snippet` | — | 操作项内容；直系 `as="leading"` / `as="trailing"` 子项会参与根级三槽位布局 |
| `class` | `string` | `""` | 自定义 CSS 类名 |
| `enableAutoLayout` | `boolean` | `true` | 内部自动布局协议固定启用；外部传入 `false` 不关闭 MenuItem 的三槽位布局 |
| `enableResponsive` | `boolean` | `false` | 是否开启响应式监听 |
| `enableContext` | `boolean` | `true` | 是否参与上下文能力网络 |
| `enableScaleObserver` | `boolean` | `false` | 是否开启运行时尺寸观察 |

---

## 场景行为

| 场景 | padding | 状态来源 | 注册 |
| :--- | :--- | :--- | :--- |
| **Listbox 内**（有 `ListboxOwnerContext`） | 8px | context 派生 | 挂载时注册，卸载时注销 |
| **QuickAction 内 / 独立使用** | 8px | `selected` / `active` Props | 无 |

点击未禁用的 `MenuItem` 后会派发 `snowui-menu-item-select` 选择意图事件，事件携带 `value` 与可选 `closeOnSelect`。`MenuItem` 本身不决定父级浮层是否关闭；`QuickAction` / `SearchPopup` 等浮层容器按自身默认策略处理，单个 `MenuItem closeOnSelect={...}` 可覆盖容器默认值。`Listbox` 仍由自身选择协议管理关闭行为。

---

## 架构

```
Frame row (.snowui-menu-item)
├── children 直系 [data-as="leading"] — 自定义 leading 复合结构
├── children 普通内容 / .snowui-menu-item-label — Content / fill
└── children 直系 [data-as="trailing"] — 自定义 trailing 复合结构
    └── showCheck 开启且存在自定义 trailing 时隐藏默认 <svg> .snowui-menu-item-check
    └── showCheck 开启且未提供自定义 trailing 时显示默认 <svg> .snowui-menu-item-check
    └── 自定义项 hover → 替换为 <button> .snowui-menu-item-delete
```

## 布局模型

主布局模型：**槽位宿主布局**。定义见 [../../../specs/LayoutProtocol.md §12.3](../../../specs/LayoutProtocol.md)。

MenuItem 的根布局固定按 Leading / Label / Trailing 三段组织：

- 根节点是 `Frame row`，并在组件内部固定启用 `enableAutoLayout`；外部传入 `enableAutoLayout={false}` 不关闭 MenuItem 的内部槽位协议。
- 普通文本或 `.snowui-menu-item-label` 是 Content / Fill 槽，负责截断，必须保持 `min-width: 0`。
- 直系 `as="leading"` / `as="trailing"` 支持复杂结构，Leading 与 Trailing 为 Hug。
- `showCheck` 开启时，默认 check / delete 按 Trailing / Hug 处理；关闭时不渲染勾选槽位，也不保留 gap。存在自定义直系 trailing 时默认 check 隐藏。
- Listbox 状态注册、过滤隐藏和 QuickAction 独立状态是 MenuItem 行为协议，不改变根三槽位布局。

---

## 样式规范

| 状态 / 属性 | 值 |
| :--- | :--- |
| padding | `var(--padding-2)` = 8px |
| 圆角 | `var(--radius-3)` = 12px |
| 字号 / 行高 | `var(--text-14)` / `var(--leading-14)` |
| 文字颜色 | `var(--black-80)` |
| hover / active 背景 | 瞬时 `var(--black-4)`；遵循 `StyleSpec.md §2.4` 的菜单/列表项高亮例外 |
| 选中标记 | trailing check，`opacity: 0` → `1` |
| 删除 X | 复用 `.snowui-clear-icon-btn` 与 Components `ComponentIcon name="x-circle" weight="fill"`；应用 Provider 可替换，颜色源保持 `Black/100%`，inactive `opacity: 0.4`，hover `opacity: 1` |
| 禁用 | `opacity: 0.2; pointer-events: none` |
| gap | `var(--gap-2)` = 8px |
| 复合槽位内部 gap | `var(--gap-2)` = 8px；可通过外部 class / style 覆盖 |

`MenuItem` 的直系 `Frame as="leading" row` / `Frame as="trailing" row` 遵循 `LayoutProtocol.md §4.1.3-4.1.6`：leading 为第 1 列，content 为中间 Fill 列，trailing 为最后一列。即使示例只提供 leading + trailing、没有额外 label 节点，中间 Fill 列也会保留，trailing 必须停留在右侧。

---

## 使用示例

### 在 QuickAction 中（独立 Props 控制）

```svelte
<QuickAction>
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
</QuickAction>
```

### 复合 leading / trailing

```svelte
<QuickAction>
    <MenuItem>
        <Frame as="leading" row>
            <Icon icon={Tag} />
            <span>Tags</span>
        </Frame>
        <Frame as="trailing" row>
            <span>Multi-Select</span>
            <Icon icon={CaretRight} />
        </Frame>
    </MenuItem>
</QuickAction>
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

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南（AI）

### 模块索引

| 文件 | 说明 |
| :--- | :--- |
| `MenuItem.svelte` | 统一操作项 — 自动感知 ListboxOwnerContext |
| `../context.ts` | `getListboxOwner()` — 读取可选 context |

### 关联关系

- **父组件（Listbox 场景）**: [Listbox.svelte](./Listbox.svelte) → [Select.svelte](./Select.svelte)
- **父组件（QuickAction 场景）**: [QuickAction.svelte](./QuickAction.svelte)
- **取代组件**: 原 `MenuItem.svelte`（已删除）、原 `QuickActionItem.svelte`（已删除）

---

## 更新日志 (Changelog)

### v1.2.3 (2026-05-31)

#### 样式调整
- 自定义项删除 X 复用 `.snowui-clear-icon-btn` 与 `ComponentIcon name="x-circle" weight="fill"`，统一使用 `Black/100% × opacity: 0.4 -> 1`，并接受应用 IconProvider 替换。
- disabled 透明度从 `0.4` 调整为全局规范值 `0.2`。

### v1.2.2 (2026-05-09)

#### 新增
- 新增 `closeOnSelect` 选择意图字段，并在点击未禁用项时派发 `snowui-menu-item-select`，由父级浮层决定是否关闭。

### v1.2.1 (2026-05-01)

#### 优化
- hover / active 背景保留菜单项瞬时高亮做法，移除 `background-color` 过渡，并对齐 `StyleSpec.md §2.4` 的菜单/列表项例外

### v1.2.0 (2026-04-27)

#### 新增
- 支持 children 直系 `as="leading"` / `as="trailing"` 参与根级三槽位；自定义 `trailing` 存在时替换默认 check 槽，复合槽位默认使用 8px gap

### v1.1.0 (2026-04-25)

#### 破坏性变更
- 移除 `compact` prop 与 `.snowui-menu-item-compact` class 输出；`MenuItem` 在 Listbox 与 QuickAction 中始终使用 8px padding

### v1.0.1 (2026-04-25)

#### 优化
- 精简 check 图标 DOM：由内部 `Icon` 组件改为直接输出 `svg[data-as="trailing"]`，保留三槽位布局与选中态样式
- 精简 label 与 check 的输出属性：label 内部改用组件 CSS 排列内容，不再输出 `data-auto-layout` / `snowui-direction-row`；check SVG 尺寸改由 CSS 控制

### v1.0.0 (2026-04-25)

#### 新增
- 统一 `MenuItem` 与 `QuickActionItem` 为单一 `MenuItem` 组件
- 自动感知 `ListboxOwnerContext`：有 context 时注册并派生状态，无 context 时使用 Props
- Listbox 与 QuickAction 场景统一使用 8px padding
## 连续 Hover 宿主

MenuItem 在支持连续 hover 的 Listbox / Popover 中由宿主的唯一背景层表达 hover。
独立使用或宿主 `continuousHover={false}` 时仍使用自身即时背景。独立 `active`
背景保持持久，hover 到 active 项时与宿主背景叠加并加深。
