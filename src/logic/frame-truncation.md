# frame-truncation.svelte.ts 文档

> **版本**: v1.4.0
> **职责**: 通过 `TruncationController` 管理 Text、Link 与 TableCell 共用的文本截断和可展开能力（历史文件名保留）。

**需求**: 提供多行截断检测、单行溢出检测、可展开/收起状态管理，并向子组件提供截断状态上下文。

## 1. 关键字

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| lines | `0 \| 1 \| 2 \| 3` | - | 截断行数 |
| onTruncate | `(isTruncated: boolean) => void` | - | 截断状态变化回调 |

### lines 值说明

| 值 | 模式 | 描述 |
|:---|:---|:---|
| `0` | 可展开模式 | 显示完整内容，支持收起/展开切换 |
| `1` | 单行截断 | 使用 scrollWidth 检测溢出 |
| `2` / `3` | 多行截断 | 使用 collapse action 实现 |

## 2. 状态属性

| 属性 | 类型 | 描述 |
|:---|:---|:---|
| isTruncated | `boolean` | 内容是否被截断 |
| isExpanded | `boolean` | 是否已展开 (仅 lines=0 时有效) |
| fullText | `string` | 完整文本内容 |
| availableWidth | `number` | 单行截断内容当前可用宽度，供边界截断算法复用 |
| collapseStyles | `Record<string, string>` | collapse action 生成的样式 |

## 3. Context 提供

通过 `TRUNCATION_CONTEXT_KEY` 向子组件提供截断状态：

```typescript
interface TruncationContext {
    isTruncated: boolean;    // 是否被截断
    isCollapsed: boolean;    // 是否处于收起状态
    isExpanded: boolean;     // 是否已展开
    fullText: string;        // 完整文本
    handleExpand: () => void;   // 展开方法
    handleCollapse: () => void; // 收起方法
}
```

### 使用示例

```svelte
<script>
    import { getContext } from 'svelte';
    import { TRUNCATION_CONTEXT_KEY } from '../keys';
    
    const truncation = getContext(TRUNCATION_CONTEXT_KEY);
</script>

{#if truncation?.isTruncated}
    <Tooltip>{truncation.fullText}</Tooltip>
{/if}
```

## 4. CSS 类名

| 类名 | 条件 | 描述 |
|:---|:---|:---|
| `snowui-truncate-container` | lines=0 | 可展开容器 |
| `snowui-truncate-mask` | lines=0 且未展开 | 渐变遮罩 |
| `snowui-truncate-collapsed` | lines=0 且未展开 | 收起状态 |
| `snowui-line-clamp-{n}` | lines>0 | 固定行数截断 |

## 5. 依赖模块

- [text-collapse.svelte.ts](./text-collapse.svelte.ts) - 多行截断 action
- [keys.ts](./../keys.ts) - Context Key 定义

<!-- @UserDefined -->
<!-- 用户自定义内容 -->
<!-- /@UserDefined -->

---
---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 开发者关键字

| 类别 | 关键字 | 描述 |
|:---|:---|:---|
| Context Key | `TRUNCATION_CONTEXT_KEY` | 截断上下文标识符 |
| 派生状态 | `shouldCollapse` | 是否需要 collapse action |
| 派生状态 | `collapseOptions` | collapse action 配置 |
| CSS 类名 | `snowui-truncate-*` | 截断相关类名 |
| CSS 类名 | `snowui-line-clamp-*` | 固定行数类名 |

### 关键字映射

| 关键字 | 处理方式 | 说明 |
|:---|:---|:---|
| lines=0 | 可展开模式 | 使用 collapse action，支持展开/收起 |
| lines=1 | scrollWidth 检测 | ResizeObserver 监听溢出 |
| lines=2/3 | collapse action | 多行截断，无展开功能 |
| onTruncate | 回调触发 | isTruncated 变化时调用 |

### 关联关系

- **消费组件**: [Text.svelte](./../components/Text.svelte)、[Link.svelte](./../components/Link.svelte)、[TableCell.svelte](./../components/TableCell.svelte)
- **依赖**: [text-collapse.svelte.ts](./text-collapse.svelte.ts)
- **Context**: [keys.ts](./../keys.ts)

---

## 更新日志 (Changelog)

### v1.4.0 (2026-06-23)

- 单行检测同步公开 `availableWidth`，让消费组件可复用通用的单词 / Unicode 字素边界拟合算法。

### v1.3.0 (2026-06-23)

- Link 接入共享控制器；单行截断状态、完整文字与尺寸监听继续由同一通用入口管理。

### v1.2.0 (2026-06-19)

- 通用类名改为 `TruncationController`，保留 `TextTruncation` / `FrameTruncation` 兼容导出。
- Text、Link 与 TableCell 共用控制器，单行尺寸监听统一使用 `resizeManager`。

### v1.1.0 (2026-02-23)

#### 架构重构
- 截断能力从 `Frame` 迁移至 `Text`，模块职责改为服务 Text 组件。
- 导出类名更新为 `TextTruncation`，并保留 `FrameTruncation` 兼容导出。

### v1.0.0 (2026-01-21)

#### 新功能
- 初始版本，从 Text 组件独立出截断能力
- 支持 lines=0/1/2/3 四种模式
- 提供 TruncationContext 给子组件
