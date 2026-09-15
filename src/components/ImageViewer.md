# ImageViewer.svelte 文档

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../specs/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。


> **版本**: v1.4.1
> **变更记录 (2026-04-28)**: 标注主布局模型为复合管理布局，明确 overlay / media / controls 的区域关系。
> **职责**: 页面级媒体预览组件，负责显示当前图片/视频与组合式控制按钮。

`ImageViewer` 是独立组件，不并入 `Image`。它承载“打开后的预览层”，默认内置上一张、下一张与关闭 Button；需要自定义结构时仍可通过 children 显式组合控制键。

## 控制按钮双模式

- **默认内置模式**：省略 children 时自动生成三个真实 `Button`，分别使用 `ArrowLineLeft`、`ArrowLineRight`、SnowUI `Close`；默认 `size="md"`、`variant="gray"`、`backgroundBlur={true}`。
- **parts 批量配置**：`parts.Button` 配置全部内置控制按钮的可配置 Props；`as`、ARIA、点击动作和图标由 ImageViewer 接管。
- **显式组合模式**：传入 children 后不生成内置按钮；调用方使用 `Button as="prev|next|close"` 并直接配置 Button Props。

当前主路径是：**在页面根布局声明一个自动模式 `ImageViewer` 作为共享服务**。页面中的 Image / ImageGroup 未显式设置 previewMode 时会自动接入；若误声明多个自动 Viewer，仅注册顺序中的第一个 owner 响应和渲染。

## 布局模型

主布局模型：复合管理布局。

- ImageViewer 的区域结构为 portal overlay / viewport / media stage / media visual / controls。
- 媒体子项由 Image 或原生媒体请求提供；默认控制键由 ImageViewer 内置，显式组合时使用 Button / Icon 并通过 `as="prev" / "next" / "close"` 声明角色。
- Viewer 只管理预览层、焦点恢复、键盘切换和媒体显示，不把内部控制区抽象为三槽位宿主。
- ImageGroup 负责集合注册，ImageViewer 负责打开后的单一预览层。

## 组件特有属性 (Component-Specific Props)

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `open` | `boolean` | `undefined` | 手动模式下控制 Viewer 显示；与 `items/index` 一起省略时进入页面级自动模式 |
| `items` | `Array<{ src?: string \| Component; alt?: string }>` | `undefined` | 手动模式下提供预览项列表；省略时自动消费页面级预览状态 |
| `index` | `number` | `undefined` | 手动模式下提供当前显示项索引；省略时自动消费页面级预览状态 |
| `backdrop` | `"opaque" \| "blur" \| "transparent"` | `"opaque"` | 与 Dialog 共用遮罩视觉：opaque 为 10% 黑色遮罩，blur 在其上模糊背景，transparent 透明；不改变关闭策略。 |
| `dismissMode` | `"button" \| "backdrop"` | `"backdrop"` | 关闭策略：backdrop 隐藏关闭按钮并允许点击媒体外空白关闭；button 显示关闭按钮且禁用空白关闭 |
| `children` | `Snippet` | `undefined` | 显式组合控制按钮；提供后替换全部默认内置按钮 |
| `parts` | `{ Button? }` | `undefined` | 批量配置默认内置的 prev / next / close Button |

## 关键字 (Keyword)

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `open` | `boolean` | `undefined` | 手动模式显隐控制；与 `items/index` 一起省略时进入自动模式 |
| `items` | `Array<{ src?: string \| Component; alt?: string }>` | `undefined` | 手动模式媒体列表 |
| `index` | `number` | `undefined` | 手动模式当前预览项索引 |
| `dismissMode` | `"button" \| "backdrop"` | `"backdrop"` | 以交互策略统一决定关闭按钮视觉与空白点击行为 |
| `parts.Button` | `Button Props` | `undefined` | 配置全部内置控制按钮；默认 md / gray / backgroundBlur |
| `as` | `'prev' \| 'next' \| 'close'` | - | 控制按钮角色 |

## 使用示例

```svelte
<ImageViewer open={viewerOpen} items={items} index={currentIndex} />
```

```svelte
<!-- 推荐：页面级单一自动模式 Viewer + ImageGroup -->
<ImageGroup size={80}>
    <Image src="https://example.com/a.png" alt="A" />
    <Image src="https://example.com/b.png" alt="B" />
    <Image src="https://example.com/c.mp4" alt="C" />
</ImageGroup>

<ImageViewer />
```

```svelte
<!-- 单图通过页面级 Viewer 打开 -->
<Image
    src="https://example.com/single.png"
    alt="Single"
    previewMode="viewer"
/>

<ImageViewer />
```

```svelte
<!-- 单图不进入 Viewer，直接新窗口打开 -->
<Image
    src="https://example.com/single.png"
    alt="Single"
    previewMode="window"
/>

<ImageViewer />
```

```svelte
<!-- 单图完全不参与预览 -->
<Image
    src="https://example.com/single.png"
    alt="Single"
    previewMode="none"
/>

<ImageViewer />
```

```svelte
<!-- 原生 HTML 图片单图通过 Viewer 打开 -->
<img
    data-snowui-image-viewer-mode="viewer"
    src="https://example.com/a.png"
    alt="A"
/>

<ImageViewer />
```

```svelte
<!-- 原生 HTML 图片单图不通过 Viewer -->
<img
    data-snowui-image-viewer-mode="window"
    src="https://example.com/a.png"
    alt="A"
/>

<ImageViewer />
```

```svelte
<!-- 原生 HTML 与 resource-svelte 图片成组接入 Viewer -->
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

## 智能行为

1. **独立组件**: 预览态与展示态拆分，避免 `Image` 承担弹层、导航和组索引状态。
2. **全页面共享服务**: 页面根部声明一个自动模式 ImageViewer；所有未显式指定 previewMode 的 Image / ImageGroup 自动共享它。
3. **自动模式与 owner**: `open/items/index` 全部省略时注册到页面服务；首个注册实例成为 owner，只有 owner 响应请求并渲染 Portal，owner 卸载后自动顺位接管。
4. **手动模式**: 当显式传入 `open/items/index` 时，`ImageViewer` 不再接管页面级点击，但仍会基于传入值建立本地预览状态，支持默认上一张 / 下一张 / 关闭动作。
5. **默认内置控制**: 省略 children 时自动生成真实 Button 控制键；prev / next 根据边界显隐；close 仅在 `dismissMode="button"` 时生成。
6. **显式组合控制**: 外部 `Button as="prev" / "next" / "close"` 若未显式传入自己的 `onclick`，会自动调用 Viewer 的上一张、下一张、关闭动作；自动模式与手动模式都适用。
7. **资源兼容**: `items` 同时支持字符串图片地址、字符串视频地址与 `resource-svelte` 图片组件。
8. **视频预览**: 视频项在 Viewer 中自动播放；实现上使用 `autoplay + muted + playsinline + loop`，保证预览层打开后立即可见。
9. **单图预览**: 当 `Image` 不在 `ImageGroup` 中时，自动模式 Viewer 会按单项列表打开当前点击的媒体。
10. **组内切换**: 当 `Image` 位于 `ImageGroup` 中时，自动模式 Viewer 会消费整组媒体列表，因此上一张/下一张可以工作。
11. **组件接入链路**: 页面存在共享 Viewer 时，未显式声明 previewMode 的 Image / ImageGroup 自动进入 Viewer；显式 `viewer / window / none` 始终优先。
12. **原生图片接入**: 自动模式下，原生 HTML `<img data-snowui-image-viewer-mode="viewer" />` 也会被 `ImageViewer` 捕获并打开。
13. **资源图片接入**: `resource-svelte` 图片组件会把 `data-snowui-image-viewer-mode="viewer"` 透传到根 `<img>`，因此也能直接接入页面级 Viewer。
14. **DOM 分组**: 当原生 `<img>` 或 `resource-svelte` 图片位于 `[data-snowui-image-viewer-scope]` 容器内时，Viewer 会按该作用域内 DOM 顺序建立上一张 / 下一张列表；没有 scope 时按单图打开。
15. **Window DOM 链路**: 自动模式下，原生 `<img data-snowui-image-viewer-mode="window" />` 会直接在新窗口打开，不进入 Viewer。
16. **无动效**: 打开、切换、关闭均不注入额外动效。
17. **前后项轻量预取**: 打开 Viewer 后，会对上一张和下一张字符串图片做轻量预取，降低切换等待感；视频不参与这条预取链。
18. **预取去重**: 同一轮打开周期内，相同字符串图片 URL 只预取一次，避免切换时反复创建加载器。
19. **轻量事件总线**: 自动模式不依赖全局 Svelte store，而是通过浏览器自定义事件 + Viewer 本地状态接收打开请求，降低运行时耦合与崩溃风险。
20. **DOM 点击适配**: 自动模式还会监听浏览器点击事件，识别原生 `<img>` / `resource-svelte` 根 `<img>` 上的 `data-snowui-image-viewer-mode` 属性。
21. **全页浮层**: Viewer 现在使用固定定位覆盖整个页面，并通过更高的 `z-index` 浮在页面元素之上。
22. **媒体最大化**: 媒体壳层不再铺满灰色背景，而是改为透明容器；图片和视频在可用显示区域内按最大尺寸 `contain` 展示。
23. **边距规则**: 媒体最大显示区域与屏幕上下左右边缘保持 `10%` 距离；控制按钮与屏幕边缘保持 `3%` 距离。
24. **比例规则**: 媒体始终保持原始比例，并保证完整显示在可视区域内；当高度先触边时宽度自适应，当宽度先触边时高度自适应。
25. **点击空白关闭**: 仅 `dismissMode="backdrop"` 时，点击媒体以外的预览层区域关闭 `ImageViewer`。
26. **键盘控制**: 自动模式下，`Esc` 关闭 Viewer，`A / W / ArrowLeft / ArrowUp` 切换上一张，`S / D / ArrowRight / ArrowDown` 切换下一张。
27. **边界停止**: 当当前项是第一张时，不显示上一张按钮，上一张键盘操作也无效；当当前项是最后一张时，不显示下一张按钮，下一张键盘操作也无效。
28. **Portal 挂载**: `ImageViewer` 直接挂载到 `document.body`，避免祖先层的 `transform / filter / contain` 干扰固定定位。
29. **三层 Overlay 结构**: Viewer 现在拆成独立 `viewport`、独立 `media-hitbox` 和独立 `controls` 三块，媒体布局、空白关闭、按钮点击互不抢事件。
30. **10% 硬边距**: `viewport` 直接使用 `inset: 10vh 10vw`，媒体只能在剩余的 `80vw / 80vh` 可视框内居中显示。
31. **根层点击委托关闭**: backdrop 模式由根层判断点击目标是否落在媒体或按钮内；不在两者内时关闭 Viewer。button 模式不处理空白点击。
32. **按钮单独层**: 控制按钮放在独立 `controls` 层，层本身 `pointer-events: none`，只有按钮自身恢复 `pointer-events: auto`。
33. **关闭策略**: `dismissMode="button"` 显示内置/显式 close Button 并禁止点击空白关闭；`dismissMode="backdrop"` 隐藏 close Button，并允许点击媒体与控制按钮之外的空白区域关闭。Escape 键仍作为自动模式的无障碍退出入口。

## 实现逻辑

### 1. 运行模式

- `ImageViewer` 有两种运行模式：
  - **自动模式**：`open/items/index` 全部省略，由页面级事件总线驱动。
  - **手动模式**：显式传入 `open/items/index`，不接管页面级事件，但内部仍会镜像这些值用于默认导航与关闭。
- 自动模式下，组件会调用 [image-preview.ts](../logic/image-preview.ts) 中的 `registerImageViewer()` 注册当前页面存在可用 Viewer。
- 自动模式下，组件会监听 `snowui:image-preview:open` 事件，并在收到事件后写入本地状态：
  - `autoItems`
  - `autoIndex`
  - `autoOpen`
- 自动模式下，组件还会在捕获阶段监听 `window.click`：
  - 命中 `.snowui-image` 时跳过，由 `Image` 自己处理
  - 命中原生 `<img data-snowui-image-viewer-mode="viewer">` 或 `resource-svelte` 根 `<img data-snowui-image-viewer-mode="viewer">` 时，直接构建 DOM 预览请求
  - 命中 `<img data-snowui-image-viewer-mode="window">` 时，直接在新窗口打开字符串图片

### 2. 数据解析

- 当前预览项统一由以下派生值计算：
  - `resolvedItems`
  - `resolvedOpen`
  - `resolvedIndex`
- `clampedIndex` 会把索引约束在合法范围内，避免上一张/下一张时越界。
- `currentItem` 是当前真正渲染的媒体项。
- 媒体类型通过字符串后缀判断：
  - 图片：普通字符串 URL 或 `resource-svelte` 组件
  - 视频：`mp4 / webm / ogg / mov / m4v`
- DOM 图片适配时：
  - 作用域优先读取最近的 `[data-snowui-image-viewer-scope]`
  - scope 内所有 `img[data-snowui-image-viewer-mode="viewer"]` 会按 DOM 顺序组成 `items`
  - 没有 scope 时按单图打开

### 3. 交互逻辑

- `showPrev()` / `showNext()`：
  - 自动模式与手动模式共用
  - 要求 `itemCount > 1`
  - 基于当前 `clampedIndex` 做边界停止切换
  - 第一张不再向前循环到最后一张，最后一张也不再向后循环到第一张
- `close()`：
  - 自动模式下会先调用 [image-preview.ts](../logic/image-preview.ts) 的 `markImageViewerClosed()`，再将 `autoOpen = false`
  - 手动模式下仅关闭内部镜像的 `manualOpen`
- 根层 `onclick` 统一交给 `handleRootClick()`：
  - 如果命中真实媒体节点（`img / video / .snowui-image-viewer-media`），不关闭
  - 如果命中控制按钮层 `controlsEl`，不关闭
  - 其余区域点击统一关闭
- 键盘控制仅自动模式生效：
  - `Escape` -> `close()`
  - `A / W / ArrowLeft / ArrowUp` -> `showPrev()`
  - `S / D / ArrowRight / ArrowDown` -> `showNext()`

### 4. 预取逻辑

- 当 Viewer 打开且媒体数量大于 1 时，会对上一项和下一项做轻量预取。
- 预取只针对**字符串图片 URL**：
  - 视频不参与预取
  - `resource-svelte` 组件不参与预取
- `prefetchedUrls` 用于同一轮打开周期内去重，避免重复创建 `window.Image()`。

### 5. 宿主上下文

- 组件会通过 `IMAGE_VIEWER_CONTEXT_KEY` 向子组件暴露控制协议。
- 对外提供 3 个角色样式入口：
  - `prevStyle`
  - `nextStyle`
  - `closeStyle`
- 对外提供 3 个 Pin 方位入口：
  - `prevAs` → `pin-left`
  - `nextAs` → `pin-right`
  - `closeAs` → `pin-bottom`
- 对外提供 3 个默认动作入口：
  - `showPrev`
  - `showNext`
  - `close`
- 因此 [Button.svelte](./Button.svelte) / [Icon.svelte](./Icon.svelte) 可以通过 `as="prev" / "next" / "close"` 自动接入 Viewer。

### 6. Portal 与根节点

- Viewer 根层仍然使用 [Frame.svelte](./Frame.svelte) 承接：
  - 普通 Frame
  - `enableResponsive / enableContext / enableScaleObserver` 显式透传
- 浮层并不在原始页面树中就地渲染，而是通过 `use={[portalToBody]}` 挂到 `document.body`。
- 同时保留 `bind:element`，让 portal host 仍然维持在 `Frame` 体系内，避免脱离现有 portal 组件约束。

## 样式实现

### 1. 根层

- 根类名：`.snowui-image-viewer`
- 职责：
  - 固定全屏浮层
  - 设置 `z-index`
  - 提供排版基准 `font-size / line-height`
  - 声明内部变量：
    - `--snowui-image-viewer-viewport-padding`
    - `--snowui-image-viewer-control-margin`
    - `--snowui-image-viewer-background`

### 2. 视口层

- `.snowui-image-viewer-viewport`
- 采用 `position: fixed`
- 通过 `inset: var(--snowui-image-viewer-viewport-padding)` 提供四边 `10%` 安全边距
- `pointer-events: none`
- 只负责提供媒体可用显示区域，不负责接收点击

### 3. 媒体层

- `.snowui-image-viewer-media-shell`
  - 占满可用视口
  - 负责媒体居中
  - 不接收指针事件
- `.snowui-image-viewer-media-hitbox`
  - 与媒体布局同层
  - 当前只作为媒体命中判断的包裹层
  - 不主动接收指针事件
- `.snowui-image-viewer-media`
  - 才是实际媒体节点
  - `pointer-events: auto`
  - `object-fit: contain`
  - `max-width / max-height: 100%`
  - 因此图片和视频都会在 `10%` 安全边距内按原始比例尽可能放大

### 4. 控制层

- `.snowui-image-viewer-controls`
  - 全屏覆盖
  - `pointer-events: none`
  - 只作为角色按钮的定位容器
- 角色按钮代理选择器：
  - `[class*="-role-prev"]`
  - `[class*="-role-next"]`
  - `[class*="-role-close"]`
- 这些按钮会恢复 `pointer-events: auto`
- 定位规则：
  - `prev`: 左侧垂直居中
  - `next`: 右侧垂直居中
  - `close`: 底部水平居中
- 三者都使用 `--snowui-image-viewer-control-margin`，对应屏幕边缘 `3%`

### 5. 默认关闭按钮

- 未传入自定义 children 且 `dismissMode="button"` 时，渲染内置 `Button as="close"` + SnowUI `Close`。
- `dismissMode="backdrop"` 不创建内置 close Button；显式组合的 `Button as="close"` 也由 Context 隐藏。
- 内置关闭按钮沿用 ImageViewer 的 Button 默认配置：md / gray / backgroundBlur。

## 使用方式定义

### 1. 推荐用法：页面级自动模式

- 一个页面里只放一个 `ImageViewer`
- 不传 `open/items/index`
- `Image` 通过 `previewMode="viewer"` 接入它
- 原生 HTML `<img data-snowui-image-viewer-mode="viewer" />` 与 `resource-svelte` 图片也可直接接入
- `ImageGroup` 负责提供组列表，`ImageViewer` 负责显示

这是当前对话里最终确定的主用法。

### 2. 手动受控模式

- 当页面不想使用全局自动接管时，可以显式传 `open/items/index`
- 这时 `ImageViewer` 只是普通的受控预览组件
- 适合 demo、特殊业务态或外部已有状态机的页面

### 3. 和 Image 的关系

- `Image` 上的 `src` 定义媒体来源
- `ImageViewer` 不要求把媒体链接再写一遍到组件内部
- 自动模式下，只有 `previewMode="viewer"` 的 `Image` 才会把点击请求送入 Viewer
- 如果该 `Image` 不在组内，则按单图打开
- `previewMode="window"`：始终新窗口打开，不进入 Viewer
- `previewMode="none"`：完全不参与预览

### 4. 和 ImageGroup 的关系

- `ImageGroup` 统一控制组内 `Image` 尺寸与布局
- 同时维护组内媒体列表快照
- 点击组内 `Image` 后，`ImageViewer` 会收到整组媒体列表和当前索引
- 因此 `prev / next` 只在组场景下真正有完整意义

### 5. 回退行为

- `Image` 组件是否进入 Viewer，由它自己的 `previewMode` 决定。
- 原生 HTML `<img>` 和 `resource-svelte` 图片是否进入 Viewer，由 `data-snowui-image-viewer-mode` 决定。
- `previewMode="window"`：即使页面里存在 Viewer，也强制改走新窗口。
- `previewMode="none"`：当前图片完全不参与预览。
- `data-snowui-image-viewer-mode="window"`：原生 HTML / `resource-svelte` 图片直接新窗口打开。

### 6. 完整使用方式

#### 6.1 `Image` 组件

- `previewMode="viewer"`：接入页面级 `ImageViewer`
- `previewMode="window"`：新窗口打开
- `previewMode="none"`：不参与预览

```svelte
<Image src="https://example.com/a.png" alt="A" previewMode="viewer" />
<Image src="https://example.com/b.png" alt="B" previewMode="window" />
<Image src="https://example.com/c.png" alt="C" previewMode="none" />
<ImageViewer />
```

#### 6.2 `ImageGroup` 组件

- `ImageGroup previewMode="viewer"`：组内 `Image` 默认接入 `ImageViewer`
- `ImageGroup previewMode="window"`：组内 `Image` 默认新窗口打开
- 组内某个 `Image` 也可以单独覆写自己的 `previewMode`

```svelte
<ImageGroup size={80} previewMode="viewer">
    <Image src="https://example.com/a.png" alt="A" />
    <Image src="https://example.com/b.png" alt="B" />
    <Image src="https://example.com/c.mp4" alt="C" />
</ImageGroup>

<ImageViewer />
```

#### 6.3 原生 HTML 与 `resource-svelte`

- `data-snowui-image-viewer-mode="viewer"`：接入 `ImageViewer`
- `data-snowui-image-viewer-mode="window"`：新窗口打开
- `data-snowui-image-viewer-scope`：把作用域内媒体按 DOM 顺序组成一组

### 7. DOM 分组示例

**没有 scope：按单图打开**

```html
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
```

- 点第一张，只打开第一张。
- 点第二张，只打开第二张。
- 两张图不会互相形成上一张 / 下一张。

**有 scope：同一作用域内按 DOM 顺序分组**

```html
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
    <Image01 data-snowui-image-viewer-mode="viewer" alt="C" />
</div>
```

- 点击第一张，会打开这 3 张里的第 1 张。
- 点击第二张，会打开这 3 张里的第 2 张。
- 点击 `Image01`，会打开这 3 张里的第 3 张。
- 上一张 / 下一张只在这个 `scope` 内切换，不会跳到页面其他图片。

### 8. 视频定义

- `ImageViewer` 支持图片和视频混合预览
- 视频在 Viewer 中默认自动播放
- 缩略图阶段的视频行为不由 `ImageViewer` 负责，而由 `Image` 负责 hover 播放

## 本轮新增需求

- 媒体和屏幕四边保持 `10%` 距离。
- 按钮和屏幕边缘保持 `3%` 距离。
- 默认 backdrop 模式点击媒体外空白区域关闭；button 模式必须使用关闭按钮。
- `Esc` 关闭 `ImageViewer`。
- `ArrowLeft / ArrowRight` 切换上一张 / 下一张。

## 样式规范 (Style Spec)

- 预览层默认覆盖当前界面，不切路由。
- 预览层是原位放大的媒体显示，不跳转新页面。
- 预览层使用固定定位，浮在页面所有元素之上。
- 左右按钮位于左右居中，并与屏幕边缘保持 `3%` 距离。
- button 模式的关闭按钮位于底部居中，并与屏幕边缘保持 `3%` 距离；backdrop 模式不显示关闭按钮。
- 按钮定位通过宿主 Context 提供，不依赖 DOM 属性选择器。
- 图片与视频共用同一预览层结构：媒体放在中心透明 shell 中，使用 `object-fit: contain`，在显示区域内尽量放大。
- `viewport` 通过 `inset: 10vh 10vw` 提供硬性安全边距，因此媒体与屏幕上下左右边缘都至少保持 `10%` 距离。
- 媒体壳层只负责在安全框内居中，媒体本体使用 `max-width: 100% / max-height: 100% + object-fit: contain` 保持原始比例并完整显示。
- backdrop 模式通过根层点击委托关闭：只有媒体实际显示尺寸包裹出的 `media-hitbox` 和 `controls` 会被排除；button 模式忽略空白点击。
- `viewport` 独立接管媒体布局，`controls` 独立接管按钮层，按钮默认仍浮在媒体之上。
- `ImageViewer` 通过 portal 直接挂载到 `document.body`，保证浮层真正相对整个视口，而不是受页面原始渲染树祖先样式影响。
- 控制按钮浮在媒体之上，不再占用媒体下方额外布局空间。
- 视频预览不额外做动效，也不在 `ImageViewer` 内注入 hover 播放逻辑。
- 去除媒体壳层默认灰色背景，避免预览态出现与媒体无关的底色块。
- 仅 backdrop 模式可点击媒体外区域关闭 Viewer。
- 自动模式下支持 `Esc / ArrowLeft / ArrowRight` 键盘控制。


---

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 模块索引 (Module Index)

- **ImageViewer 组件**: [./ImageViewer.svelte](./ImageViewer.svelte)
- **页面级预览总线**: [../logic/image-preview.ts](../logic/image-preview.ts)

### 关键字映射 (Keyword Handling)

| 关键字 | 处理模块/文件 | 逻辑说明 |
| :--- | :--- | :--- |
| `open` | `ImageViewer.svelte` | 控制预览层显隐 |
| `items` | `ImageViewer.svelte` | 提供当前可预览图片列表 |
| `index` | `ImageViewer.svelte` | 解析当前展示项 |
| `items/open/index`(省略) | `ImageViewer.svelte` + `../logic/image-preview.ts` | 进入页面级自动模式，消费页面中的 `Image` / `ImageGroup` 打开请求 |
| `previewMode="viewer"` | `Image.svelte` / `ImageGroup.svelte` + `ImageViewer.svelte` | 组件链路接入页面级 Viewer |
| `previewMode="window"` | `Image.svelte` / `ImageGroup.svelte` | 组件链路改走新窗口 |
| `previewMode="none"` | `Image.svelte` | 组件不参与预览 |
| `data-snowui-image-viewer-mode="viewer"` | `ImageViewer.svelte` + `../logic/image-preview.ts` | 原生 HTML / `resource-svelte` 图片接入页面级 Viewer |
| `data-snowui-image-viewer-mode="window"` | `ImageViewer.svelte` + `../logic/image-preview.ts` | 原生 HTML / `resource-svelte` 图片改走新窗口 |
| `data-snowui-image-viewer-scope` | `ImageViewer.svelte` + `../logic/image-preview.ts` | DOM 作用域内媒体按 DOM 顺序组成上一张 / 下一张列表 |
| `as="prev"` | `ImageViewer.svelte` + 子组件 | 左侧中部控制按钮定位 |
| `as="next"` | `ImageViewer.svelte` + 子组件 | 右侧中部控制按钮定位 |
| `as="close"` | `ImageViewer.svelte` + 子组件 | 底部中部控制按钮定位 |
| 自动模式按钮默认动作 | `ImageViewer.svelte` + `Button.svelte` / `Icon.svelte` | `prev / next / close` 在未自定义点击事件时自动接管控制动作 |

### 关联关系

- **配套组件**: [Image.svelte](./Image.svelte), [ImageGroup.svelte](./ImageGroup.svelte)
- **典型子组件**: [Button.svelte](./Button.svelte), [Icon.svelte](./Icon.svelte)
- **预览状态**: [../logic/image-preview.ts](../logic/image-preview.ts)
- **打开来源**: [Image.svelte](./Image.svelte) 负责单图打开请求，[ImageGroup.svelte](./ImageGroup.svelte) 负责组媒体列表快照

### 运行时定义

1. 自动模式下，`ImageViewer` 通过 [image-preview.ts](../logic/image-preview.ts) 注册为页面级可用 Viewer。
2. `Image` 点击后根据 `previewMode` 决定是发送 Viewer 打开请求、新窗口打开，还是不参与预览。
3. 若 `previewMode="viewer"`，则发送打开请求：
   - 组外 `Image`：发送单图列表
   - 组内 `Image`：发送组媒体列表 + 当前索引
4. `ImageViewer` 接收事件后，用本地状态维护 `open/items/index`。
5. 自动模式下会额外监听 `Esc / A / W / ArrowLeft / ArrowUp / S / D / ArrowRight / ArrowDown` 键盘事件。
6. 原生 HTML / `resource-svelte` 图片则通过 `data-snowui-image-viewer-mode` 和 `data-snowui-image-viewer-scope` 进入相同的自动预览链。

---

## 更新日志 (Changelog)

- **ImageViewer-Docs.2026-05-25** 源码顶部历史变更记录已归档；后续新增变更统一写入本文档 Changelog，源码顶部只保留职责、当前关键架构与文档路径。

### v1.4.1 (2026-07-05)

#### 调整
- `dismissMode` 默认值由 `button` 改为 `backdrop`：默认隐藏关闭按钮并允许点击媒体外空白关闭。
- 需要可见关闭按钮时显式声明 `dismissMode="button"`。

### v1.4.0 (2026-07-05)

#### 新功能
- 新增 `dismissMode="button|backdrop"`，以关闭交互策略统一派生关闭按钮视觉。
- button：显示关闭按钮，点击空白不关闭；backdrop：隐藏关闭按钮，点击媒体外空白关闭。

### v1.3.1 (2026-07-05)

#### 调整
- 自动模式 Viewer 接入页面级 owner 选举；多个实例同时存在时仅首个 owner 响应事件并渲染 Portal。
- 页面存在共享 Viewer 时，未显式声明 previewMode 的 Image / ImageGroup 自动接入；服务不存在时回退 window。
- owner 卸载后由下一个已注册 Viewer 自动接管。

### v1.3.0 (2026-07-05)

#### 新功能
- 上一张、下一张、关闭控制键升级为默认内置 Button，分别使用 `ArrowLineLeft`、`ArrowLineRight` 与 SnowUI `Close`。
- 内置 Button 默认 `size="md"`、`variant="gray"`、`backgroundBlur={true}`，并开放 `parts.Button` 批量配置。
- 保留 children + `as="prev|next|close"` 显式组合模式。

### v1.2.1 (2026-03-15)

#### 修复
- **IV-Docs.1** 统一代码头、文档头与 changelog 版本号为 `v1.2.1`。
- **IV-Skeleton.1** 为字符串图片/视频资源补充真实加载态骨架桥接：媒体切换加载期间渲染 `Skeleton` 覆盖层，加载完成或失败后退出。
- **IV-Docs.2** 完整补齐 `ImageViewer` 的所有使用方式文档，包含 `previewMode="viewer" / "window" / "none"`、`ImageGroup previewMode`、原生 HTML / `resource-svelte` 图片的 `data-snowui-image-viewer-mode`、`data-snowui-image-viewer-scope` 以及单图 / 成组 / 回退行为示例。

### v1.2.0 (2026-03-12)

#### 调整
- **IV-Adjust.16** 自动模式新增 DOM 图片接入：原生 HTML `<img data-snowui-image-viewer-mode="viewer" />` 与 `resource-svelte` 根 `<img data-snowui-image-viewer-mode="viewer" />` 现在都能直接接入页面级 `ImageViewer`。
- **IV-Adjust.17** 新增 `[data-snowui-image-viewer-scope]` 作用域分组；定义 scope 时，作用域内 DOM 图片会按 DOM 顺序形成上一张 / 下一张列表。
- **IV-Adjust.18** 原生 HTML `<img data-snowui-image-viewer-mode="window" />` 在自动模式下会直接改走新窗口，不进入 Viewer。

### v1.1.24 (2026-03-12)

#### 调整
- **IV-Nav.24** 将上一张 / 下一张从首尾循环改为边界停止：第一张隐藏上一张且键盘无效，最后一张隐藏下一张且键盘无效；按钮与键盘行为一致。

### v1.1.23 (2026-03-12)

#### 调整
- **IV-Nav.23** 将上一张 / 下一张 / 关闭收口到自动模式与手动模式共用；第一张可循环到最后一张，最后一张可循环回第一张，按钮和键盘行为保持一致。

### v1.1.22 (2026-03-12)

#### 调整
- **IV-Key.22** 收回空格键切到下一张的映射；自动模式下下一张仅保留 `S / D / ArrowRight / ArrowDown`。

### v1.1.21 (2026-03-12)

#### 调整
- **IV-Key.21** 扩展自动模式键盘导航：`A / W / ArrowUp` 映射为上一张，`S / D / Space / ArrowDown` 映射为下一张；保留 `Escape` 关闭。

### v1.1.20 (2026-03-12)

#### 文档
- **IV-Doc.20** 将当前源码中的实现逻辑与样式结构完整同步到文档，包括自动/手动模式、事件总线、预取逻辑、根层点击关闭、宿主上下文协议、portal 挂载方式以及根层/视口层/媒体层/控制层的样式分层。

### v1.1.19 (2026-03-12)

#### 修复
- **IV-Fix.1** 显式传递 `Frame` 三个能力开关，并为 portal host 补上 `bind:element`，对齐现有 portal 组件约束。
- **IV-Fix.2** 默认关闭控件移除页面 utilities 类依赖，改为组件内部 `snowui-image-viewer-default-close` 样式。
- **IV-Fix.3** 收口内部变量命名、角色代理选择器和占位尺寸单位，修复 standards 中的命名与样式规则问题。

### v1.1.18 (2026-03-11)

#### 文档
- **IV-Doc.18** 将本轮明确确认的交互与布局需求写入文档：媒体与屏幕四边保持 `10%`、按钮与屏幕边缘保持 `3%`、点击媒体外空白区域关闭、`Esc` 关闭以及左右方向键切换。

### v1.1.17 (2026-03-11)

#### 调整
- **IV-Adjust.17** `ImageViewer` 将空白关闭从独立 backdrop 命中改为根层点击委托，只有媒体命中区和按钮层会被排除；同时把 `10%` 安全边距从 `padding` 改为 `viewport inset: 10vh 10vw`，确保媒体显示区域直接受屏幕四边硬约束。

### v1.1.16 (2026-03-11)

#### 调整
- **IV-Adjust.16** `ImageViewer` 移除外层 `Frame` 浮层根，改成纯 DOM 的 `backdrop / viewport / controls` 三层 overlay；`viewport` 直接使用 `padding: 10vh 10vw` 提供硬边距，媒体外空白区域交给 backdrop 关闭，控制按钮单独位于独立层并恢复自身点击命中。

### v1.1.4 (2026-03-11)

#### 文档
- **IV-Doc.1** 补全本轮对话中关于 `ImageViewer` 的全部定义：页面级单一 Viewer 主路径、自动/手动模式、与 `Image` / `ImageGroup` 的联动、禁用与回退链路、按钮 `as` 用法、视频定义以及当前性能实现。

### v1.1.5 (2026-03-11)

#### 调整
- **IV-Adjust.5** `ImageViewer` 改为固定全页浮层并提升层级；媒体壳层移除灰色背景，图片/视频在显示区域内按最大尺寸展示。

### v1.1.6 (2026-03-11)

#### 调整
- **IV-Adjust.6** 预览布局按屏幕边缘比例重新定义：媒体最大显示区域距屏幕边缘 `5%`，控制按钮距屏幕边缘 `3%`，并统一浮在媒体之上。

### v1.1.7 (2026-03-11)

#### 调整
- **IV-Adjust.7** 媒体显示区域改为通过统一 `5%` 容器内边距约束，确保上下左右边缘一致；同时新增点击媒体外区域关闭 Viewer 的交互。

### v1.1.8 (2026-03-11)

#### 调整
- **IV-Adjust.8** 预览层新增 `Esc` 关闭、左右方向键切换；点击关闭命中从整块媒体容器收口为背景层，避免媒体周围空白区无法关闭。

### v1.1.9 (2026-03-11)

#### 调整
- **IV-Adjust.9** 将 `5%` 视口框改为仅负责布局约束、不拦截指针事件；媒体壳层填满整个视口框，确保媒体完整落在 `5%` 安全边距内，同时点击媒体外区域稳定关闭 Viewer。

### v1.1.10 (2026-03-11)

#### 调整
- **IV-Adjust.10** 将媒体安全边距从 `5%` 调整为 `10%`；同时把阻止关闭的命中区域从整块媒体壳层收缩到媒体本体，修复点击媒体外空白区域仍无法关闭的问题。

### v1.1.11 (2026-03-11)

#### 调整
- **IV-Adjust.11** 将媒体本体改为直接占满 `10%` 安全框的宽高，再由 `object-fit: contain` 约束比例，确保 `10%` 屏幕边距成为稳定硬约束，而不是依赖媒体自然尺寸计算。

### v1.1.12 (2026-03-11)

#### 调整
- **IV-Adjust.12** 将 `10%` 安全边距从媒体节点自身收回到 `stage` 的 `padding`，同时恢复独立 `media-hitbox` 命中区域，确保既能稳定保持 `10%` 屏幕边距，也能继续点击媒体外空白区域关闭 Viewer。

### v1.1.13 (2026-03-11)

#### 调整
- **IV-Adjust.13** 参考成熟 modal/lightbox 结构，将关闭命中与媒体布局拆为独立 `backdrop` 与 `viewport` 两层：`backdrop` 单独负责点击关闭，`viewport` 单独负责 `10%` 安全边距与媒体居中显示。

### v1.1.14 (2026-03-11)

#### 调整
- **IV-Adjust.14** 为媒体壳层、媒体命中区和媒体本体同时增加 `80vw / 80vh` 视口上限，使“屏幕四边至少保留 `10%` 空间”不再只依赖父层布局链，而是由媒体自身直接受限。

### v1.1.15 (2026-03-11)

#### 调整
- **IV-Adjust.15** 将 `ImageViewer` 改为 portal 到 `document.body`：这样浮层不再受原页面祖先节点的 `transform / filter / contain` 影响，`fixed` 与 `10%` 屏幕边距才会真正相对整个视口生效。

### v1.1.1 (2026-03-11)

#### 调整
- **IV-Adjust.2** 页面级自动模式改为浏览器事件总线 + Viewer 本地状态，移除对全局 Svelte store 的运行时依赖，降低页面崩溃风险。

### v1.1.2 (2026-03-11)

#### 调整
- **IV-Adjust.3** 自动模式下不再复制打开请求中的 `items` 数组；Viewer 直接消费稳定列表引用，并为前后两张字符串图片做轻量预取。

### v1.1.3 (2026-03-11)

#### 调整
- **IV-Adjust.4** 前后项轻量预取增加 URL 去重缓存，同一轮预览中不会对同一字符串图片重复创建预取加载器。

### v1.1.0 (2026-03-10)

#### 新功能
- **IV-Feat.5** 新增页面级自动模式：省略 `open/items/index` 时，`ImageViewer` 自动接管页面中的 `Image` / `ImageGroup` 点击。

#### 调整
- **IV-Adjust.1** 页面中存在自动模式 `ImageViewer` 时，`Image` 默认通过 Viewer 打开；Viewer 不存在时由 `Image` 回退为新窗口打开。

### v1.0.2 (2026-03-10)

#### 新功能
- **IV-Feat.4** 新增字符串视频资源支持；Viewer 现在可直接预览 mp4/webm/ogg/mov。
- **IV-Behavior.1** 预览层中的视频默认自动播放，并使用 `muted + playsinline + loop` 保证浏览器可执行自动播放。

### v1.0.1 (2026-03-10)

#### 修复
- **IV-Fix.1** 修复 `resource-svelte` 图片在 Viewer 中未按放大尺寸显示的问题；预览层不再向资源组件传入错误的百分比 `width/height` props，改由 Viewer 自身样式负责放大展示。

### v1.0.0 (2026-03-10)

#### 新功能
- **IV-Feat.1** 新增独立的 ImageViewer 组件，承载图片预览态。
- **IV-Feat.2** 提供 `prev / next / close` 的宿主组合协议。
- **IV-Feat.3** 保持无动效切换，满足图片打开、切换、关闭的即时反馈要求。

### 共享遮罩

通过 `backdrop` 选择视觉，通过 `dismissMode` 选择点击关闭策略，两者独立。默认从旧的主题背景 92% 覆盖改为与 Dialog 相同的 opaque；背景覆盖变量仍兼容。实现边界见 [backdrop](../../../components/src/lib/backdrop.md)。
