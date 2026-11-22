# SnowUI 可复用区块

`components/src/blocks/` 存放面向产品区域场景的可复用区块。区块由基础组件、复合组件、布局协议和区域级逻辑组合而成；页面继续负责路由、数据请求、权限与业务副作用。

使用、修改或交付前请阅读 [LICENSE](../../LICENSE)。全部组件与区块统一通过 `@snowui-design-system/components` 导入。

## 使用入口

- [Sidebar](Sidebar.md)：应用导航外壳，支持折叠、抽屉与宽度调整。
- [SidebarSection](SidebarSection.md)：侧边栏导航分组与可选标题操作。
- [SidebarItem](SidebarItem.md)：侧边栏导航条目，支持激活态、图标、二级层级线与状态提示。
- [SearchPopup](SearchPopup.md)：可组合搜索面板，统一搜索输入、可选标题、结果分组与间距。

使用这些真实导出的区块组合导航与搜索区域；不要按分类示例推断不存在的导出。统一从 `@snowui-design-system/components` 导入，调用公开 Props、Snippets、events 与 `parts`。

## AI Zone

### 放置规则

- 每个区块使用 PascalCase 命名。
- 源码、文档、测试同目录放置：`<Name>.svelte`、`<Name>.md`、`<Name>.test.ts`。
- 文档头说明包归属、区块类型与职责。

### 技术分类

| 类型 | 说明 | 示例 |
| --- | --- | --- |
| 导航区块 | 提供稳定导航区域，路由与业务内容由页面拥有 | Sidebar、SidebarSection、SidebarItem |
| 通用组合区块 | 组合公开组件并提供可跨产品复用的区域契约 | SearchPopup |

## 更新日志

- 2026-11-22：登记 `SearchPopup` 公开入口，移除与技术职责无关的商业档位叙述（Owner 2026-11-07）。
- 2026-09-21：列出实际组件入口，将仓库维护规则归入 AI Zone。
