# Separator.svelte 文档

> **版本**: v1.0.1
> **职责**: 提供通用 UI 分割线。

**继承**: 复用 Frame.svelte 的通用能力。
**默认能力开关**: `enableResponsive=false`, `enableContext=true`, `enableScaleObserver=false`, `enableDefaultMotion=false`。

## 组件介绍

用水平或垂直分割线划分内容与操作区域，帮助建立清晰的信息层次。

## 关键字 (Keyword)

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| row | `boolean` | `true` | 横向分割线；与 Frame 写法统一 |
| column | `boolean` | `false` | 纵向分割线；与 Frame 写法统一 |
| length | `string \| number` | `undefined` | 主轴长度；数字按 px 处理 |
| thickness | `string \| number` | `undefined` | 线宽；未传时默认 0.5px（等价 `var(--border-1)`） |
| rounded | `boolean` | `true` | 端点是否圆角；默认圆角 |
| decorative | `boolean` | `true` | 是否为装饰分割线；默认输出 `aria-hidden="true"` |
| children | `Snippet` | - | 预留给带文字的分割线场景 |
| ...rest | `FrameProps` | - | 透传 class、style、`data-*` 等 Frame 能力 |

## 命名边界

组件正式名为 `Separator`，不使用 `Line`。`Separator` 表达 UI 区域或项目之间的分隔语义；图表坐标线、网格线、折线图路径等不应复用本组件，未来应在图表域内定义 `ChartLine` / `GridLine` / `AxisLine`。

如果业务代码偏好 `<Line />` 这样的短名，只在业务文件中本地别名 `Separator as Line`，组件库不导出正式 `Line` 组件，避免和图表线、文本行、路径线等概念冲突。

## 布局模型

主布局模型：**内禀原子布局**。定义见 [../../../specs/LayoutProtocol.md §12.7](../../../specs/LayoutProtocol.md)。

Separator 的尺寸由 `row` / `column`、`length`、`thickness` 与父级上下文变量决定，不承担子元素排列。

默认视觉：

- 粗细：0.5px，等价 `var(--border-1)`。
- 颜色：`var(--black-10)`。
- 圆角：开启，使用 `var(--radius-full)`。

ButtonGroup 自 v1.2.0 起自行绘制相邻 Button 之间的装饰性分割线；ButtonGroup 调用方不再需要插入 Separator。现有 ButtonGroup Context 解析仅作为旧代码兼容保留，不是新用法。

## 使用示例

```svelte
<Separator />

<Separator column length="1rem" />

<Separator rounded={false} thickness="1px" />
```


---
---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 模块索引

- **Separator 组件**: [./Separator.svelte](./Separator.svelte)

### 关键 CSS 类

| 类名 | 描述 |
| :--- | :--- |
| `.snowui-separator` | 根元素 |
| `.snowui-separator-row` | 水平分割线 |
| `.snowui-separator-column` | 垂直分割线 |
| `.snowui-separator-rounded` | 圆角分割线 |

### 关联关系

- **父组件**: 可被 Toolbar / Menu / Tabs 等复用；ButtonGroup 仅保留迁移兼容
- **依赖**: Frame

## 更新日志 (Changelog)

### v1.0.1 (2026-08-29)

- ButtonGroup 已拥有自己的内置分割线；Separator 的 ButtonGroup Context 解析仅保留旧代码兼容。

### v1.0.0 (2026-05-19)

#### 新功能
- 初始版本，支持 row / column、length、thickness、rounded、decorative。
