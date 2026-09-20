# PRO Blocks

PRO Blocks 是 SnowUI PRO 品牌下的付费源码开放组合区块。

它们由 SnowUI 基础组件、PRO 组件、布局协议和区块级逻辑组合而成, 面向真实产品场景, 可直接复用, 也可作为模板二次改造。

## 使用入口

- [Sidebar](./Sidebar.md)：应用导航外壳。
- [SidebarSection](./SidebarSection.md)：导航分组。
- [SidebarItem](./SidebarItem.md)：导航条目。

使用这些导出的组件组合导航，页面继续负责路由与业务内容；不要按分类示例推断不存在的导出。

## AI Zone

### 放置规则

- 每个 Block 使用 PascalCase 命名。
- 源码、文档、测试同目录放置: `<Name>.svelte`、`<Name>.md`、`<Name>.test.ts`。
- 文档头部必须标明包归属、源码策略和区块类型。

### 分类

| 类型 | 说明 | 示例 |
| --- | --- | --- |
| Template Block | 项目相关度高, 更适合作为可改造模板 | Sidebar |
| Composite Block | 通用复合区块, 可跨项目直接复用 | 当前目录未提供此类公开组件 |

### 付费源码开放边界

`pro/src/blocks/` 是 `pro/` 目录内唯一允许同步到私有仓库 `SnowUI/pro-blocks` 并向付费用户开放的源码区域。其他 PRO 源码目录仍保持私有。

## 更新日志

- 2026-09-21（文档）：列出实际组件入口，移除未提供的 SearchPanel 示例，将仓库维护规则归入 AI Zone。
