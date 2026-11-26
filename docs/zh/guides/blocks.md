# SnowUI 可复用区块

`components/src/blocks/` 存放面向产品区域场景的可复用区块。区块由基础组件、复合组件、布局协议和区域级逻辑组合而成；页面继续负责路由、数据请求、权限与业务副作用。

使用、修改或交付前请阅读 [LICENSE](../../../LICENSE)。全部组件与区块统一通过 `@snowui-design-system/components` 导入。

## 使用入口

- [Sidebar](../components/sidebar/reference.md)：应用导航外壳，支持折叠、抽屉与宽度调整。
- [SidebarSection](../components/sidebar-section/reference.md)：侧边栏导航分组与可选标题操作。
- [SidebarItem](../components/sidebar-item/reference.md)：侧边栏导航条目，支持激活态、图标、二级层级线与状态提示。
- [SearchPopup](../components/search-popup/reference.md)：可组合搜索面板，统一搜索输入、可选标题、结果分组与间距。

使用这些真实导出的区块组合导航与搜索区域；不要按分类示例推断不存在的导出。统一从 `@snowui-design-system/components` 导入，调用公开 Props、Snippets、events 与 `parts`。
