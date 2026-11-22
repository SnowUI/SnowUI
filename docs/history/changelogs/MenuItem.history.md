# MenuItem 更新日志归档

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
