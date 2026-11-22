# SearchInput 更新日志归档

### v1.2.0 (2026-07-05)

- 改为 Input 宿主组件特化模式：兼容 Props 从 Input 类型推导并平铺，移除 `parts.Input`；DOM 与样式保持不变。

### v1.1.0 (2026-06-20)

- 新增 `variant="borderless"`，供 Toolbar、面板等已有表面的容器显式使用；组件默认填满剩余宽度，内部内容保持垂直居中。

### v1.0.1 (2026-05-09)

#### 调整

- SearchInput 内置默认 `Search` 在激活态变为 Black/40；样式限定在 SearchInput 组件内，不影响通用 Icon 样式。

### v1.0.0 (2026-05-08)

#### 新功能

- 新增简单搜索输入框，默认内置 `Search`，其余行为继承 `Input`。
