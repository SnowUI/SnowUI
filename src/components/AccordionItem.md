# AccordionItem.svelte 文档

> **版本**: v1.3.2
> **职责**: 作为 Accordion 内部的单个折叠项容器。
> **包归属**: OSS

AccordionItem 必须放在 [Accordion.svelte](./Accordion.svelte) 内使用，通过 AccordionContext 读取展开状态与切换方法。

## API 参考

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `value` | `string` | —（必填） | 当前折叠项的稳定标识，在同一 Accordion 内应唯一；与父级 value/defaultValue 匹配，不是可独立绑定的展开布尔值。 |
| `disabled` | `boolean` | `false` | 禁用当前项的标题和正文收起交互；父级 Accordion.disabled 也会禁用此项，不能由此处 false 解除。 |
| `size` | `never` | - | 不支持；尺寸只允许由父级 Accordion 控制。 |
| `children` | `Snippet` | — | 声明直系 Frame as="title" 与 Frame as="content"；标题内直系 as="trailing" 可替换默认展开图标。必须在 Accordion 内使用。 |
| `...rest` | `FrameProps` | - | 透传到内部根 Frame。 |

`AccordionItem` 不控制尺寸。字号、行高、padding、圆角、内置图标尺寸等视觉密度全部继承父级 `Accordion size` 生成的变量；`value` 只用于和父级 `value/defaultValue` 匹配展开状态。

## 布局模型

主布局模型：**复合管理布局的局部单项容器**。

- AccordionItem 外层根为 `Frame tag="div" column`，负责整项背景、圆角、分隔线与展开状态。
- 直系 `Frame as="title" row` 作为标题触发器，固定启用三槽位布局；直系 `as="leading"`、普通内容与直系 `as="trailing"` 分别落入三槽位。
- 直系 `Frame as="content" row` 作为内容区，同样固定启用三槽位布局；折叠时保持宽度，使用向下高度收起与透明度渐隐。
- title 继承父级 Accordion 或外层容器的 `color`；content 默认消费父 Accordion 的 `--snowui-accordion-content-color`，使用主题自适应 `Black/40%` 次要文字色。
- title 默认渲染内置 `+ / -` trailing 图标；图标由两条线绘制，展开 / 收起时整颗图标容器旋转半圈，竖线淡入 / 淡出，动效时序消费 Frame motion bridge。外部在 title 内提供直系 `as="trailing"` 子项时，默认图标隐藏。
- hover 背景由父级 Accordion 的唯一 Continuous Hover Background 表达：收起时覆盖 title，展开时覆盖整个 item。`continuousHover=false` 时 title 恢复普通 hover overlay。
- 展开 content 的非交互区域点击会收起当前项；Link、Button、表单控件、交互 role 与可编辑内容不触发父项收起。

## 样式变量链

| 变量 | 默认值 | 用途 |
| :--- | :--- | :--- |
| `--snowui-accordion-item-content-block-size-override` | `--snowui-accordion-content-max-block-size-override` / 测量高度 | 单个 content 展开最大高度覆盖入口 |
| `--snowui-accordion-content-color-override` | `var(--black-40)` | 局部覆盖 content 文字颜色，不影响 title |

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
| 展开 content 点击 | Item 事件委托 | 非交互区域收起；交互后代保持自身行为 |

---

## 更新日志 (Changelog)

### v1.3.2 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.3.1 (2026-08-28)

- content 默认文字颜色改为主题自适应 `var(--black-40)`；title 继续继承宿主前景色。
- 支持通过 `--snowui-accordion-content-color-override` 局部覆盖正文颜色。

### v1.3.0 (2026-08-28)

- title 的逐项 hover 改为父 Accordion 所有的唯一 Continuous Hover Background；展开状态覆盖完整 item，并随 content 高度同步变化。
- 展开 content 的非交互区域新增点击收起；Link、Button、表单控件、交互 role 与可编辑内容明确排除。
- 保留 `continuousHover=false` 时的 title 普通 hover fallback。

### v1.2.5 (2026-08-28)

- 恢复 title 的规范化背景 hover，使用共享 `snowui-hoverable` overlay，在 Light / Dark 下分别采用 4% / 10%，并排除 disabled；该实现自 v1.3.0 起仅作为 `continuousHover=false` 的 fallback。

### v1.2.4 (2026-08-17)

- 三槽 title/content Host 依赖共享 layer 的固定结构顺序：Frame 方向基座低于 Auto Layout，保证 trailing 指示器占据最右侧独立轨道，同时组件自有 gap 仍可覆盖共享默认。

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
