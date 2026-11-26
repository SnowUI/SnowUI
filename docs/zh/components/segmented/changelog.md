# Segmented 更新日志

### v1.3.0 (2026-09-21)

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

### v1.2.2 (2026-08-14)

- `icon-toggle` 变体同步继承 Tab 的 20px 背景模糊。

### v1.2.1 (2026-08-14)

- 默认 `pill` 变体继承 Tab 与 SearchBox 同级的 20px 背景模糊及公开 override。

### v1.2.0 (2026-07-05)

#### 架构调整
- 正式改为 Tab 宿主组件特化模式，兼容 Tab Props 从宿主类型推导并平铺。
- 移除 `parts.Tab`；默认内置 Button 继续使用 `parts.Button`，显式 Button 直接配置 Props。
- 修复 items 模式被空 children snippet 截断、导致 Tab 不生成内置 Button 的问题。
- Form hidden input 移到 Tab 根之后，保持 Tab 作为主要宿主。

### v1.1.1 (2026-06-23)

#### 与 Tab 同步
- Item 尺寸样式优先级同步为 `style > class > Button size > Tab size`。

### v1.1.0 (2026-06-23)

#### 与 Tab 同步
- 继承 `variant="bare"`、12/16/20px gap、无 indicator 视觉及文字 / Icon 内容支持。
- 继承 Tab size → Button Item size context；Segmented 不复制 Button 尺寸定义。

### v1.0.5 (2026-06-21)

#### 动效与组合契约
- 继承 Tab icon-toggle indicator 移动修复；尺寸变化统一消费 Frame 默认 size motion bridge。
- 显式透传 `enableDefaultMotion`，默认开启。
- 所有 Test 示例的 Button 子项补齐 `as="item"`。

### v1.0.4 (2026-06-18)

#### 动效还原
- 当时随 Tab 使用专用 Tabs sliding 时序；v1.0.5 起已迁移到 Frame transform / size motion bridge。

### v1.0.3 (2026-05-31)

#### 样式调整
- 继承 Tab v1.0.3：active Text / Icon 在 pill / icon-toggle 使用 `--static-black-100`，在 underline 使用 `--primary`，在 solid 保持 Button 默认颜色链；inactive 统一使用 `--black-100 × opacity: 0.4`。
- 背景滑块复用 Tab 的 transitions.dev Tabs sliding 时序：位置与宽高均使用 250ms、`cubic-bezier(0.22, 1, 0.36, 1)`，首次定位与 resize 不播放动效。
- 四种 variant 测试展示示例均补充 Icon，便于观察与 Tab 一致的颜色继承。

### v1.0.2 (2026-05-31)

#### 样式调整
- 继承 Tab v1.0.2：inactive Text / Icon 保持 Button 默认 `--black-100`，active Text / Icon 使用 `--static-black-100`；inactive 的 40% 视觉仍由整体 `opacity: 0.4` 表达。

### v1.0.1 (2026-05-31)

#### 样式调整
- 继承 Tab v1.0.1：移除 inactive Item 的 40% 颜色值路径，改用 `opacity: 0.4`，hover / active 使用 `opacity: 1`。

### v1.0.0 (2026-05-20)

#### 新功能
- 初始实现:基于 Tab 的薄封装,固定 `role="radiogroup"` / `itemRole="radio"` / `selectionFollowsFocus=true`
- 支持 `name` 属性接入 Form,内部渲染 hidden input 暴露 value 给原生表单提交
- 支持 `fill` Figma fill 宽度,与 Tab 共享等宽子项样式
