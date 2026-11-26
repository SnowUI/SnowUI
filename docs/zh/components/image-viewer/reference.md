# ImageViewer

> **版本**: v1.4.1
> **职责**: 在页面级预览中查看图片或视频，提供前后切换与关闭操作，适合媒体详情浏览。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

在页面级预览中查看图片或视频，提供前后切换与关闭操作，适合媒体详情浏览。

## 使用选择


用于图片的放大查看与组间导航。页面内普通图片展示用 Image；不要重写组件已有的缩放、关闭与键盘操作。

- open / items / index 一起省略时使用页面级自动模式；手动模式显式提供预览列表与当前项。
- children 替换全部默认控制按钮；只调整内置按钮外观时使用 parts，避免误删关闭与前后导航。


## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。


```svelte
<script lang="ts">
	import { Button, Image, ImageGroup } from '@snowui-design-system/components';
	import { ImageViewer } from '@snowui-design-system/components';
	import cover01 from '@snowui-design-system/resource-base/assets/backgrounds/gradient-01-1024.jpg';
	import cover02 from '@snowui-design-system/resource-base/assets/backgrounds/gradient-02-1024.jpg';
	import cover03 from '@snowui-design-system/resource-base/assets/backgrounds/gradient-03-1024.jpg';
</script>

<ImageGroup size={80}>
<Image src={cover01} alt="SnowUI resource cover 1" />
<Image src={cover02} alt="SnowUI resource cover 2" />
<Image src={cover03} alt="SnowUI resource cover 3" />
</ImageGroup>
<ImageViewer />
```


## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| open | `boolean` | — | 手动模式下控制 Viewer 显示；与 `items/index` 一起省略时进入页面级自动模式 |
| items | `ImageViewerItem[]` | — | 手动模式下提供预览项列表；省略时自动消费页面级预览状态 |
| index | `number` | — | 手动模式下提供当前显示项索引；省略时自动消费页面级预览状态 |
| dismissMode | `"button" \| "backdrop"` | `"backdrop"` | 关闭策略：backdrop 隐藏关闭按钮并允许点击媒体外空白关闭；button 显示关闭按钮且禁用空白关闭 |
| backdrop | `BackdropVariant` | `"opaque"` | 与 Dialog 共用遮罩视觉：opaque 为 10% 黑色遮罩，blur 在其上模糊背景，transparent 透明；不改变关闭策略。 |
| children | `Snippet` | — | 显式组合控制按钮；提供后替换全部默认内置按钮 |
| parts | `ComponentPartsOf<{ Button: typeof Button }>` | — | 批量配置默认内置的 prev / next / close Button |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="控制按钮双模式"></a>

### 控制按钮双模式

- **默认内置模式**：省略 children 时自动生成三个真实 `Button`，分别使用 `ArrowLineLeft`、`ArrowLineRight`、SnowUI `Close`；默认 `size="md"`、`variant="gray"`、`backgroundBlur={true}`。
- **parts 批量配置**：`parts.Button` 配置全部内置控制按钮的可配置 Props；`as`、ARIA、点击动作和图标由 ImageViewer 接管。
- **显式组合模式**：传入 children 后不生成内置按钮；调用方使用 `Button as="prev|next|close"` 并直接配置 Button Props。

当前主路径是：**在页面根布局声明一个自动模式 `ImageViewer` 作为共享服务**。页面中的 Image / ImageGroup 未显式设置 previewMode 时会自动接入；若误声明多个自动 Viewer，仅注册顺序中的第一个 owner 响应和渲染。

<a id="布局模型"></a>

### 布局模型

主布局模型：复合管理布局。

- ImageViewer 的区域结构为 portal overlay / viewport / media stage / media visual / controls。
- 媒体子项由 Image 或原生媒体请求提供；默认控制键由 ImageViewer 内置，显式组合时使用 Button / Icon 并通过 `as="prev" / "next" / "close"` 声明角色。
- Viewer 只管理预览层、焦点恢复、键盘切换和媒体显示，不把内部控制区抽象为三槽位宿主。
- ImageGroup 负责集合注册，ImageViewer 负责打开后的单一预览层。

<a id="关键字-keyword"></a>

### 关键字 (Keyword)

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `parts.Button` | `Button Props` | `undefined` | 配置全部内置控制按钮；默认 md / gray / backgroundBlur |
| `as` | `'prev' \| 'next' \| 'close'` | - | 控制按钮角色 |

<a id="使用示例"></a>

### 使用示例

```svelte
<ImageViewer open={viewerOpen} items={items} index={currentIndex} />
```

```svelte

<ImageGroup size={80}>
    <Image src="https://example.com/a.png" alt="A" />
    <Image src="https://example.com/b.png" alt="B" />
    <Image src="https://example.com/c.mp4" alt="C" />
</ImageGroup>

<ImageViewer />
```

```svelte

<Image
    src="https://example.com/single.png"
    alt="Single"
    previewMode="viewer"
/>

<ImageViewer />
```

```svelte

<Image
    src="https://example.com/single.png"
    alt="Single"
    previewMode="window"
/>

<ImageViewer />
```

```svelte

<Image
    src="https://example.com/single.png"
    alt="Single"
    previewMode="none"
/>

<ImageViewer />
```

```svelte

<img
    data-snowui-image-viewer-mode="viewer"
    src="https://example.com/a.png"
    alt="A"
/>

<ImageViewer />
```

```svelte

<img
    data-snowui-image-viewer-mode="window"
    src="https://example.com/a.png"
    alt="A"
/>

<ImageViewer />
```

```svelte

<div data-snowui-image-viewer-scope>
    <img
        data-snowui-image-viewer-mode="viewer"
        src="https://example.com/a.png"
        alt="A"
    />
    <img
        data-snowui-image-viewer-mode="viewer"
        src="https://example.com/b.png"
        alt="B"
    />
    <Image01
        data-snowui-image-viewer-mode="viewer"
        alt="C"
    />
</div>

<ImageViewer />
```

### 运行模式与交互规则

- **页面级自动模式（推荐）**：省略 `open / items / index` 时注册为全局预览服务（多实例并存时仅首个注册 owner 响应并挂载到 `document.body`，卸载后自动顺位接管）。页面中未显式指定 `previewMode` 的 `Image` / `ImageGroup` 自动接入；`Image` 位于 `ImageGroup` 内时自动获得组内前后切换列表。
- **手动受控模式**：显式传入 `open / items / index` 时不拦截页面级图片点击，适合外部状态机受控预览。
- **原生与资源图片接入**：自动模式下，原生 `<img data-snowui-image-viewer-mode="viewer" />` 与透传该属性的 `resource-svelte` 图片组件可直接进入 Viewer（`"window"` 改走新窗口）；外层包裹 `[data-snowui-image-viewer-scope]` 时按作用域内 DOM 顺序建立切换组，无作用域时按单图打开。
- **媒体展示与安全边距**：媒体在四边 `10%` 安全边距（`80vw × 80vh`）内按 `object-fit: contain` 等比最大化居中展示；控制按钮距屏幕边缘 `3%`。支持图片 URL、`resource-svelte` 组件与视频 URL（`mp4 / webm / ogg / mov / m4v` 自动 `autoplay + muted + playsinline + loop`）；前后相邻字符串图片自动去重预取。
- **关闭、键盘与遮罩**：`dismissMode="backdrop"`（默认）隐藏关闭按钮并允许点击媒体与按钮外的空白区域关闭；`dismissMode="button"` 显示关闭按钮并忽略空白点击。自动模式支持 `Escape` 关闭、`A / W / ArrowLeft / ArrowUp` 上一张、`S / D / ArrowRight / ArrowDown` 下一张（首尾边界停止，不循环）。遮罩视觉由 `backdrop` 独立控制，复用 共享 Backdrop。
