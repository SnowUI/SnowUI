# Accordion 更新日志

### v1.7.0 (2026-10-23)

- 默认items标题复用Frame单行组合与Text单行缩略／全文名称，新增强类型parts.Text以保留内置文字配置入口；显式children仍自行配置，不读取默认parts。
- 标题与默认指示器宿主复用AccordionItem的4px／12px下限，正文与原有展开状态不变。

- 2026-10-23：显式标题示例接入Frame单行组合与Text单行全文；展开正文与默认状态保持，仅文档和示例修订。

- 2026-09-28：取消 hover 背景与正文点击收起；默认加号旋转为 ×，新增 indicatorVariant="minus" 保留旧模式；各尺寸正文与标题字号一致。continuousHover 保留为无效兼容参数。

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

### v1.6.2 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.6.1 (2026-08-28)

- 展开正文的默认文字颜色改为主题自适应 `var(--black-40)`；标题仍继承宿主前景色。
- 新增 `--snowui-accordion-content-color-override`，允许调用方局部覆盖正文颜色。

### v1.6.0 (2026-08-28)

- Accordion 接入容器级唯一 Continuous Hover Background，在 Item 间以 60ms 专项时序连续移动和变形；展开项覆盖 title 与完整 content，并随展开高度同步重测。
- 新增 `continuousHover`，默认开启；关闭后恢复 title 的普通 hover overlay。
- 展开项的非交互 content 区域可点击收起；Link、Button、表单控件、交互 role 与可编辑内容保持自身行为。
- disabled item 作为连续 hover 阻断区，不显示背景，也不回退点亮相邻项。

### v1.5.0 (2026-08-17)

- 将默认视觉形态从原 `variant="default"` 调整为 `variant="filled"`。
- 将原分割线形态重命名为 `variant="divided"`，与 DataTable 命名统一；彻底移除 `variant="default"`，不提供兼容别名。
- 将默认 `filled` 形态的 item 背景从 `Background/2` 调整为 `Black/4%`。

### v1.4.0 (2026-07-04)

- 新增默认内置模式：`items` 每项只接受 `title` 与 `content`。
- 内部自动生成 AccordionItem 与 title/content Frame，并提供 `parts.AccordionItem` / `parts.Frame`。
- 保留显式 children 组合模式；children 存在时替换内置 items。

### v1.3.1 (2026-06-18)

#### 动效调整
- Accordion 根注入 `RESIZE_MOTION`，展开 / 收起使用 transitions.dev resize 时序，并尊重系统减少动效偏好。

### v1.3.0 (2026-05-25)

#### 破坏性变更
- `AccordionItem` 改为单项容器；标题与内容改由内部直系 `Frame as="title"` / `Frame as="content"` 声明。

#### 样式调整
- 背景、圆角与分隔线归属外层 `AccordionItem`，content 折叠时只负责高度与透明度动画，避免背景残留。

### v1.2.0 (2026-05-25)

#### 破坏性变更
- 移除 `bordered` 视觉形态，Accordion 仅保留设计稿中的 `default` 与 `filled`。

#### 样式调整
- 根据 Workshop 设计稿同步两种视觉形态、三档尺寸的 padding、radius、gap、字号与默认图标尺寸。
- 默认 `+ / -` 图标改为组件内部线条绘制；hover 仅提升图标颜色，不改变标题底色。

### v1.1.0 (2026-05-24)

#### 破坏性变更
- 从 `items` 数据渲染模式改为组合式模式。

### v1.0.0 (2026-05-23)

#### 新功能
- 新增 Accordion 组件，支持单开 / 多开、受控 / 非受控、禁用项、视觉形态与三档尺寸。
