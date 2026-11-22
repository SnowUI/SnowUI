# ImageGroup 更新日志归档

### v1.0.7 (2026-03-10)

#### 新功能
- **IG-Feat.5** 新增 `disableImageViewer` 属性，可强制组内 `Image` 回退为新窗口打开。

#### 调整
- **IG-Adjust.2** 组内预览联动改为页面级单一 `ImageViewer` 模式；`ImageGroup` 仅负责媒体注册与列表快照，不再要求内嵌 Viewer。

### v1.0.8 (2026-03-11)

#### 调整
- **IG-Adjust.3** `getPreviewItems()` 现在直接返回当前稳定快照引用，避免打开 Viewer 时额外复制组媒体数组。

### v1.0.9 (2026-03-11)

#### 调整
- **IG-Adjust.4** 组内媒体注册表改为原地 `push/splice` 维护，进一步减少图片挂载与销毁时的短期数组分配。

### v1.0.4 (2026-03-10)

#### 新功能
- **IG-Feat.4** 新增组内预览上下文：`Image` 可自动注册自身媒体，`ImageViewer` 在组内可自动消费 `items/open/index`。

### v1.0.3 (2026-03-10)

#### 修复
- **IG-Fix.2** 修复 `layout="grid"` 默认无列规则导致仍像一行排列的问题；现在 `grid` 模式默认使用两列模板。

### v1.0.2 (2026-03-10)

#### 修复
- **IG-Fix.1** 修复 `layout` 不生效：`ImageGroup` 现在会把 `layout="row" | "column" | "grid"` 正确映射到 `Frame` 的 `row / column / grid` 关键字，并移除组件内对 `display` 的错误覆盖。

### v1.0.1 (2026-03-10)

#### 调整
- **IG-Adjust.1** 明确 `row / column / grid` 三种布局都固定使用 `4px` 间距，并在组件样式层补齐 `gap: var(--gap-1)` 兜底。

### v1.0.0 (2026-03-10)

#### 新功能
- **IG-Feat.1** 新增 ImageGroup，支持统一组内图片尺寸。
- **IG-Feat.2** 提供 `row / column / grid` 布局，不支持 `stack`。
- **IG-Feat.3** 固定默认间距为 `var(--gap-1)`，不开放 `gap` prop。
