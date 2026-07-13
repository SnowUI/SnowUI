# image-preview.ts 文档

> **职责**: 页面级图片预览事件总线，负责协调 `Image` / `ImageGroup` / `ImageViewer` 之间的打开指令。

## 核心职责

1. 维护页面自动模式 `ImageViewer` 注册表、存在状态与唯一 owner。
2. 通过浏览器自定义事件把 `Image` / `ImageGroup` 的打开请求只交给 owner `ImageViewer`。
3. 在无 `ImageViewer` 或显式禁用时，提供新窗口打开字符串媒体的回退能力。
4. 打开请求直接透传稳定媒体列表引用，不再在总线层复制数组。

## 输出能力

- `getImagePreviewOpenEventName()`
- `registerImageViewer()`
- `hasImageViewer()`
- `openImagePreview(items, index)`
- `openImageMediaInNewWindow(src)`

## 关联组件

- [../components/Image.svelte](../components/Image.svelte)
- [../components/ImageGroup.svelte](../components/ImageGroup.svelte)
- [../components/ImageViewer.svelte](../components/ImageViewer.svelte)

## 单例所有权

- 自动模式 ImageViewer 按注册顺序选取第一个实例作为 owner。
- 只有 owner 响应打开事件、DOM 图片点击并渲染 Portal。
- owner 卸载后，注册表中的下一个实例自动接管；其余实例保持无视觉注册态。
- presence 仍表示“页面至少有一个可用 Viewer”，供 Image 在未显式声明 previewMode 时自动选择 viewer；注册表为空时回退 window。
