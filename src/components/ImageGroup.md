# ImageGroup.svelte 文档

> **版本**: v1.1.2
> **变更记录 (2026-04-28)**: 标注主布局模型为复合管理布局，明确 row / column / grid 是媒体集合布局。
> **职责**: 图片组容器，统一控制组内图片尺寸与基础布局，并为页面级 `ImageViewer` 提供组列表快照。

用于将多个 `Image` 以线性或网格形式组合展示，并向子图片透传统一尺寸上下文。

## 组件介绍

统一组织多张图片的尺寸与排列，并提供成组预览，适合图库、附件和图片集合。

## 布局模型

主布局模型：复合管理布局。

- ImageGroup 的区域结构为 group root / media item collection / preview registration。
- 子项 Image 保持内禀原子布局；ImageGroup 只管理 row / column / grid 排列、统一尺寸上下文和 Viewer 注册。
- `previewMode` 是集合预览策略，不改变子项 Image 的内部布局模型。
- ImageGroup 不内嵌 ImageViewer；页面级 Viewer 作为独立复合管理组件消费组列表。

## 功能概览 (User)

- 统一组内图片尺寸
- 支持 `row / column / grid` 布局
- 固定默认间距 4px
- 与页面级 `ImageViewer` 配合承载多图预览索引
- 组内可自动收集 `Image` 媒体并向页面级 Viewer 提供组列表

## API 参考 (User)

### 1. 核心属性

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `size` | `12\|16\|20\|24\|28\|32\|40\|48\|56\|64\|72\|80` | `undefined` | 统一控制组内图片尺寸 |
| `layout` | `"row" \| "column" \| "grid"` | `"row"` | 布局模式 |
| `previewMode` | `"viewer" \| "window" \| "none"` | `undefined` | 作为组内 Image 的显式预览模式；省略时由页面共享 Viewer 是否存在自动决定 |
| `enableContext` | `boolean` | `true` | 是否向 Frame 子组件提供通用上下文；Image 的组尺寸和预览策略仍通过专属组上下文提供。 |
| `enableResponsive` | `boolean` | `true` | 启用 Frame 响应式能力，按公开响应式配置调整集合布局。 |
| `children` | `Snippet` | `undefined` | 组内图片内容；Image 自动注册媒体并继承组尺寸与预览策略，显式子项设置优先。 |

### 2. 视觉规则

1. `row / column / grid` 三种布局的默认间距都固定为 `4px`，对应 `var(--gap-1)`，不提供 `gap` prop。
2. 不支持 `stack` 布局；布局职责仅限线性排列与网格排列。
3. 组内图片默认继承统一 `size`，子图片显式 `size` 优先。
4. `grid` 布局默认使用两列模板，避免在无额外列定义时视觉上退化为单行排列。
5. 组内 `Image` 会自动注册自己的 `src/alt`，供页面中的单一 `ImageViewer` 打开与切换。
6. 组列表快照在打开 Viewer 时直接按稳定引用传递，不再额外复制数组。
7. 组内媒体注册表使用原地 `push/splice` 维护，减少挂载/卸载时的短期数组分配。
8. `previewMode` 会作为组内 `Image` 的默认值向下透传；子图片显式 `previewMode` 优先。组与图片均省略时，页面存在共享 Viewer 即自动接入，否则回退 window。

### 3. 使用示例

```svelte
<ImageGroup size={48}>
    <Image src={Image01} />
    <Image src={Image01} />
    <Image />
</ImageGroup>
```

```svelte
<ImageGroup layout="grid" size={80}>
    <Image src={Image01} />
    <Image src={Image01} />
    <Image src={Image01} />
    <Image src={Image01} />
</ImageGroup>
```


- 该组件当前不开放 `gap` prop；固定间距为 4px。
- 若后续扩展图库选择能力，应继续保持“尺寸统一由 Group 下发”的主链路。
- `ImageGroup` 不内嵌 `ImageViewer`；页面根部声明一个自动模式 Viewer 后，未显式设置 previewMode 的组会自动共享该服务。


---

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 模块索引 (Module Index)

- **ImageGroup 组件**: [./ImageGroup.svelte](./ImageGroup.svelte)
- **页面级预览总线**: [../logic/image-preview.ts](../logic/image-preview.ts)

### 关键字映射 (Keyword Handling)

| 关键字 | 处理模块/文件 | 逻辑说明 |
| :--- | :--- | :--- |
| `size` | `ImageGroup.svelte` | 作为组内默认图片尺寸向下透传 |
| `layout` | `ImageGroup.svelte` | 控制 `row / column / grid` 布局 |
| `previewMode` | `ImageGroup.svelte` | 作为组内 `Image` 的默认预览模式 |
| `gap` | `ImageGroup.svelte` | 不暴露为 prop；`row / column / grid` 三种布局都固定为 `var(--gap-1)` |
| `previewItems` | `ImageGroup.svelte` | 组内自动收集 `Image` 注册的媒体项，供页面级 `ImageViewer` 打开与切换 |

### 关联关系

- **父组件**: [Frame.svelte](./Frame.svelte)
- **核心子组件**: [Image.svelte](./Image.svelte)
- **预览联动**: [ImageViewer.svelte](./ImageViewer.svelte)
- **预览状态**: [../logic/image-preview.ts](../logic/image-preview.ts)

---

## 更新日志 (Changelog)

- **ImageGroup-Docs.2026-05-25** 源码顶部历史变更记录已归档；后续新增变更统一写入本文档 Changelog，源码顶部只保留职责、当前关键架构与文档路径。

### v1.1.2 (2026-03-13)

#### 调整
- **IG-Adjust.8** 组内图片尺寸梯度扩展为 `12/16/20/24/28/32/40/48/56/64/72/80`，与 `Image` 保持一致。

### v1.1.1 (2026-03-13)

#### 调整
- **IG-Adjust.7** 移除 `disableImageViewer` 兼容属性；组内默认预览模式只由 `previewMode` 控制。

### v1.1.0 (2026-03-12)

#### 调整
- **IG-Adjust.5** 新增 `previewMode="viewer" | "window" | "none"`，作为组内 `Image` 的默认预览模式。

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
