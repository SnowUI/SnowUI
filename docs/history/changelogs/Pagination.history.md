# Pagination 更新日志归档

### v1.6.1 (2026-09-18)

- prev / next 会跳过连续禁用页并导航到该方向最近的可用页；只有该方向不存在可用页时才禁用。

### v1.6.0 (2026-09-17)

- 新增默认 `responsive="auto"` 容器宽度策略：优先展示全部页码；空间不足时压缩前后页文字并自动生成省略窗口，不提供手动页码窗口参数。
- 省略状态按钮保持 Hug；继续变窄时依次隐藏 pageSize、省略符和当前页，上一页与下一页始终存在。
- pageSize Listbox 打开时冻结当前响应阶段，关闭后再按最新容器宽度刷新，避免操作中的浮层锚点重建。
- 新增 `responsive="none"` 静态回退；尺寸测量复用共享 `resizeManager`。

### v1.5.0 (2026-09-17)

- 新增 `variant="outline" | "gray" | "borderless"`，分别内置 gray、filled、gray 当前页搭配；默认保持 outline 常态与 gray 当前页。
- 显式角色 Button 模板继续优先，缺失角色由所选 variant 的内置模板补齐。

### v1.4.0 (2026-08-19)

- Pagination 内部 Button 作为复合导航项默认关闭 hover 放大，模板可显式重新开启；其余 hover 颜色和视觉 Props 保持由 Button 拥有。

### v1.3.3 (2026-07-08)

- 修复空 `Button as="prev"` / `Button as="next"` 模板只渲染空按钮的问题；prev / next 模板为空时自动注入 Pagination 默认箭头，已有文字、SVG 或 Icon 的自定义模板保持不变。

### v1.3.2 (2026-07-08)

- 移除 fill 模式下分页项的 `min-width: 0` 压缩规则；自定义 Button 模板保留自身 intrinsic 最小宽度，避免文字 nowrap 后视觉上吞掉默认 padding。空间足够时仍按 fill 变宽，空间不足时由 Pagination 换行承接。

### v1.3.1 (2026-07-08)

- 移除默认项与 pageSize trigger 的最小尺寸约束；默认尺寸由内容、padding 或外部 Button 模板决定。
- 清理文档示例中 prev / next bare Button 的内联尺寸外壳。
- 移除默认项最小宽高覆盖入口。

### v1.3.0 (2026-07-04)

- 默认内置 Button 模板改为 Table-Demo 表格二样式：pageSize 左置 Hug，当前页 gray，普通页与前后页 outline。
- 默认 `widthMode="fill"`，current/page/prev/next 等宽填充；默认 `pageSizeGap=16px`。
- 显式 children 继续作为自定义模板入口。

### v1.2.0 (2026-06-30)

- 新增 `pageSize`、`pageSizeOptions`、`pageSizeAriaLabel` 与 `onPageSizeChange`。
- 新增 `Button as="pageSize"` 视觉模板；模板声明顺序控制选择器位于页码左侧或右侧。
- 使用内置 Listbox 承接选项、键盘、Portal 和选择交互，Button 模板负责视觉。
- 默认箭头通过 `ComponentIcon name="arrow-line-down"` 解析；内置回退随 Components 交付，应用可通过 IconProvider 切库，Icon 透明度沿用 Pagination 左右箭头的 `0.4 → 1` hover 规则。
- 新增 `pageSizeGap`，独立控制 pageSize 与分页按钮组的间距；组内 Pagination gap 保持不变。
- 新增普通 `gap` Prop，直接控制页码、prev、next 的组内间距；公开数字按 px 处理。
- 根节点 `style="gap:…"` 按是否存在 pageSize 映射到 pageSize 外层间距或普通组内间距，并保持 inline style 高于对应 Prop。
- pageSize Icon 尺寸改为复用左右箭头的 `--snowui-pagination-icon-size`，Button 负责文字与 Icon 的居中及内容 gap。
- 修正 ArrowLineDown 仅约束外层 wrapper、内部 Icon Frame 仍使用默认尺寸的问题；三个 Pagination 箭头现在共享同一最终边界尺寸。
- 三个箭头统一设为不可 flex shrink，避免 Fill 模式在 pageSize 与外层 gap 占用空间后压缩 prev / next SVG。
- pageSize Listbox 选项使用 MenuItem 的默认 label 槽渲染数值，确保 label 与选中 check 之间消费 MenuItem 默认 8px gap。

### v1.1.0 (2026-06-20)

- 新增 `widthMode="auto | hug | fill"`。
- Fill 模式只让可点击按钮等宽填充，省略符始终保持 Hug。

### v1.0.0 (2026-05-26)

#### 新功能
- 新增 Pagination 组件，采用角色样式模板 API。
- 支持自动页码窗口和省略符。
- 支持缺省 prev / next 内置箭头。
- 支持自动 Hug / Fill 宽度模式。
- 支持指定页禁用。
