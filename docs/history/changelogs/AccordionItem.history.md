# AccordionItem 更新日志归档

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
