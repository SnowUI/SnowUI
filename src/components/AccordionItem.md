# AccordionItem.svelte 文档

> **版本**: v1.2.3
> **职责**: 作为 Accordion 内部的单个折叠项容器。
> **包归属**: OSS

AccordionItem 必须放在 [Accordion.svelte](./Accordion.svelte) 内使用，通过 AccordionContext 读取展开状态与切换方法。

## API 参考

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `value` | `string` | - | 与 Accordion 展开值匹配的唯一值。 |
| `disabled` | `boolean` | `false` | 阻止当前 item 的 title 点击切换。 |
| `size` | `never` | - | 不支持；尺寸只允许由父级 Accordion 控制。 |
| `children` | `Snippet` | - | 标题或内容。 |
| `...rest` | `FrameProps` | - | 透传到内部根 Frame。 |

`AccordionItem` 不控制尺寸。字号、行高、padding、圆角、内置图标尺寸等视觉密度全部继承父级 `Accordion size` 生成的变量；`value` 只用于和父级 `value/defaultValue` 匹配展开状态。

## 布局模型

主布局模型：**复合管理布局的局部单项容器**。

- AccordionItem 外层根为 `Frame tag="div" column`，负责整项背景、圆角、分隔线与展开状态。
- 直系 `Frame as="title" row` 作为标题触发器，固定启用三槽位布局；直系 `as="leading"`、普通内容与直系 `as="trailing"` 分别落入三槽位。
- 直系 `Frame as="content" row` 作为内容区，同样固定启用三槽位布局；折叠时保持宽度，使用向下高度收起与透明度渐隐。
- title 与 content 都不设置独立文字颜色，默认继承父级 Accordion 或外层容器的 `color`。
- title 默认渲染内置 `+ / -` trailing 图标；图标由两条线绘制，展开 / 收起时整颗图标容器旋转半圈，竖线淡入 / 淡出，动效时序消费 Frame motion bridge。外部在 title 内提供直系 `as="trailing"` 子项时，默认图标隐藏。

## 样式变量链

| 变量 | 默认值 | 用途 |
| :--- | :--- | :--- |
| `--snowui-accordion-item-content-block-size-override` | `--snowui-accordion-content-max-block-size-override` / 测量高度 | 单个 content 展开最大高度覆盖入口 |

## 使用示例

```svelte
<Accordion defaultValue="profile">
    <AccordionItem value="profile">
        <Frame as="title" row>
            Profile
            <Icon as="trailing"><Resource.Plus /></Icon>
        </Frame>
        <Frame as="content" row>Profile content</Frame>
    </AccordionItem>
</Accordion>
```


> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 开发者关键字

| 类别 | 关键字 | 描述 |
| :--- | :--- | :--- |
| CSS 类名 | `snowui-accordion-item` | 单项容器根类 |
| CSS 类名 | `snowui-accordion-title-item` | 标题触发器 |
| CSS 类名 | `snowui-accordion-content` | 内容区 |
| Context Key | `ACCORDION_CONTEXT_KEY` | 读取父 Accordion 状态 |

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| AccordionItem | [AccordionItem.svelte](./AccordionItem.svelte) | 单项容器 |
| Accordion | [Accordion.svelte](./Accordion.svelte) | 父级状态容器 |

### 关键字映射

| 关键字 | 处理方式 | 说明 |
| :--- | :--- | :--- |
| `value` | Context 查询 | 与 Accordion 当前展开值匹配 |
| `disabled` | title DOM 属性 | 输出 `aria-disabled` 并阻止 title 交互 |

---

## 更新日志 (Changelog)

### v1.2.3 (2026-08-16)

#### 动效修复
- Frame 根 `transform` / `transition` 改为单一低优先级出口后，AccordionItem 根动效通过组件输入通道接入；Content 的高度、padding、透明度过渡与默认指示器旋转继续由各自节点拥有，不再受 CSS 注入顺序影响。

### v1.2.2 (2026-06-18)

#### 动效调整
- Content 的高度、padding 与透明度变化统一消费父级 Accordion 注入的 `RESIZE_MOTION`，并在系统减少动效时关闭过渡。

### v1.2.1 (2026-05-31)

#### 样式调整
- 默认 `+ / -` trailing 指示器保持 `Black/100%` 颜色源，inactive 使用 `opacity: 0.4`，hover 恢复 `opacity: 1`，对齐 `StyleSpec.md §2.4.5`。

### v1.2.0 (2026-05-25)

#### 破坏性变更
- AccordionItem 改为单项容器，内部通过 `Frame as="title"` / `Frame as="content"` 声明标题与内容。

#### 样式调整
- 背景、圆角与分隔线归属外层 item，content 仅做高度收起与透明度渐隐。

### v1.1.0 (2026-05-25)

#### 样式调整
- 默认 trailing 图标改为内部绘制的 `+ / -`，展开 / 收起时整颗图标旋转，hover 仅改变图标颜色。
- title 与 content 统一使用 Frame row 三槽位布局；content 折叠动画改为高度收起 + 渐隐。

### v1.0.0 (2026-05-24)

#### 新功能
- 新增 AccordionItem，统一承载 Accordion 标题项与内容项。
