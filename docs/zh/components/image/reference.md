# Image

> **版本**: v1.5.0
> **职责**: 展示图片及其占位状态，支持组合角标、操作与预览入口，适合内容图片和媒体缩略图。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-20

## 组件介绍

展示图片及其占位状态，支持组合角标、操作与预览入口，适合内容图片和媒体缩略图。

## 使用选择


用于展示图片与其公开加载/预览能力。头像优先 Avatar，多张图片组合用 ImageGroup，专业查看用 ImageViewer。

- 提供 src 与有意义的 alt；附属内容用 as="icon" 或 as="badge"，不会替换图片。
- 通过 previewMode 配置预览；ImageGroup 可统一组尺寸和预览策略，查看器由 ImageViewer 承载。


## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。


```svelte
<script lang="ts">
	import { Image } from '@snowui-design-system/components';
	import { ImageViewer } from '@snowui-design-system/components';
	import cover01 from '@snowui-design-system/resource-base/assets/backgrounds/gradient-01-1024.jpg';
</script>

<Image src={cover01} alt="SnowUI gradient resource 1" size={80} />
<ImageViewer />
```


## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| src | `string \| Component` | — | 图片 / 视频 URL，或 `resource-svelte` 图片组件 |
| size | `ImageSize` | — | 图片尺寸。未显式设置时自动继承 `ImageGroup` 提供的尺寸上下文。 |
| alt | `string` | — | 图片替代文本 |
| mediaLoading | `MediaLoading` | 继承或 `"lazy"` | 字符串图片的原生加载策略；显式值优先于最近的 `provideMediaLoading()` 默认值。与 Frame 的视觉 `loading` 无关。 |
| previewMode | `PreviewMode` | — | 显式控制预览方式；未声明时，页面存在共享 ImageViewer 则接入 Viewer，否则字符串媒体回退为新窗口 |
| onOpen | `(event?: MouseEvent \| KeyboardEvent) => void` | — | 点击或键盘触发打开时调用；提供后接管默认 Viewer / 新窗口动作，调用方负责处理打开行为。 |
| badgePosition | `"top" \| "bottom"` | `"top"` | 角标位置：top 为右上，bottom 为右下。 |
| children | `Snippet` | — | 媒体挂件；子组件通过 as="icon" 居中或 as="badge" 定位，不替换媒体内容。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="布局模型"></a>

### 图片加载策略

默认保持 `lazy`。需要首屏外图片立即请求时，单项使用 `<Image mediaLoading="eager" ... />`；完整示例墙等子树可在宿主组件初始化时调用公开 `provideMediaLoading('eager')`。嵌套 Provider 取最近值，单项显式 Prop 优先；传入 `() => policy` 可响应状态变化，SSR 与客户端使用同一默认值。

```svelte
<script lang="ts">
    import { Image, provideMediaLoading } from '@snowui-design-system/components';
    provideMediaLoading('eager');
</script>
<Image src="/cover.jpg" alt="封面" />
<Image src="/secondary.jpg" alt="次要图片" mediaLoading="lazy" />
```

`eager` 会提前消耗网络和解码资源，不承诺图片下载成功或固定完成时限；真实加载期间仍显示 Skeleton。仅影响字符串图片的 `<img loading>`，不改视频的 `preload="metadata"`、资源组件自身的加载协议、预览器中尚未打开的媒体或动画播放时机。详见 通用加载策略。

### 布局模型

主布局模型：内禀原子布局。

- Image 的根节点只暴露一个由 `size`、媒体资源与圆角映射决定的媒体盒，作为 Button、MenuItem、Field 等外部布局的子项时表现为 Hug。
- 媒体裁切、真实加载 Skeleton、hover 视觉遮罩、中央 icon 与角标定位都属于 Image 私有布局，不对外暴露通用槽位。
- 子组件的 `as="icon"` / `as="badge"` 只用于 Image 内部定位，不改变子组件自己的布局模型。
- 外部需要排列多张图片时应使用 `ImageGroup`，不要把 Image 改造成集合布局。

<a id="关键字-keyword"></a>

### 使用示例

```svelte

<Image src="/demo.png" size={48} alt="示例图片" />


<Image src={Image01} size={80} alt="资源图片" />


<Image size={40} />


<Image src={Image01} size={48}>
    <Icon as="icon">
        <Play />
    </Icon>
</Image>


<Image src={Image01} size={48}>
    <Radio as="badge" checked />
</Image>
```

<a id="智能行为"></a>

### 智能行为

1. **素材兼容**: `src` 同时支持字符串图片地址、字符串视频地址与 `resource-svelte` 图片组件。
2. **默认占位**: 未传素材时展示单一 `--black-4` 占位背景，不输出额外文案。
3. **尺寸圆角联动**: `size` 会同步驱动固定圆角档位，`12/16/20→4px`，`24/28/32→8px`，`40/48→12px`，`56→16px`，`64/72/80→20px`。
4. **角色化组合**: 子组件声明 `as="badge"` 时自动定位到右上角；声明 `as="icon"` 时自动居中，但 `Image` 只负责定位，不接管子组件尺寸。
5. **Hover 视觉**: 与 Avatar 共用 `components/src/styles/layout.css` 的 `.snowui-media-hoverable` 工具类家族。只要当前 Image 具备**点击交互意图**(`resolvedInteractive`,即 `src` 存在 + 未 `disabled` + `previewMode !== "none"` 或显式有 `onclick`)就挂 `.snowui-media-hoverable` 获得手形指针;有图态(`hasLoadedMedia`)再挂 `.snowui-media-hoverable-has-visual`,hover 时 `.snowui-image-visual` 层应用 `filter: brightness(0.92)`(媒体本身压暗);无图占位态根不挂 `-has-visual`,hover 时 `.snowui-image-background` 层从 `--black-4` 过渡到 `--black-10`。覆盖入口:`--snowui-media-hover-brightness`。
6. **交互意图 vs 实际打开**: `resolvedInteractive`(决定 hover 视觉)与 `resolvedCanOpen`(决定点击是否真打开)分离。默认 `previewMode="window"` 下,**所有有 src 的 Image 都视为有交互意图**(获得 hover + cursor),但**只有字符串图片/视频能在新窗口打开**(Component src 因为无法获取 URL,点击无实际动作);传 `previewMode="none"` 且没有 `onclick / onOpen` 时显式 opt-out,不提供 hover 变色、手形指针或键盘 button 语义。
7. **视频缩略态**: 当 `src` 为字符串视频地址时，组件改为渲染 `<video>`；hover 时自动播放，离开后暂停并回到起始帧。
8. **字符串图片加载**: 字符串图片不再通过额外的 JS 预加载器探测，而是直接交给原生 `<img>` 加载；组件只通过 `load/error` 事件更新内部状态。
9. **真实加载骨架**: 当 `src` 是字符串图片或字符串视频时，从初始渲染起在媒体真实加载阶段自动显示 `Skeleton` 占位；加载完成后 Skeleton 消失，媒体再显示出来。已在交互初始化前完成加载的媒体会根据实际状态退出占位，失败时显示回退。
10. **Viewer 模式**: 页面存在自动模式 `ImageViewer` 且未显式声明 previewMode 时，自动接入页面级 Viewer；显式 `previewMode="viewer"` 仍可强制表达该意图。
11. **Window 模式**: `previewMode="window"` 时，字符串图片/视频会直接在新窗口打开。
12. **None 模式**: `previewMode="none"` 时，当前 `Image` 不提供打开动作。
13. **组内切换**: 当 `Image` 位于 `ImageGroup` 中且组或当前项使用 `previewMode="viewer"` 时，会使用组内注册列表作为 Viewer 的 `items`，从而支持上一张/下一张。
14. **事件透传**: 组件内部的视频 hover 播放逻辑不会吞掉外部 `mouseenter / mouseleave` 回调。
15. **焦点策略**: `Image` 与 `Avatar` 一样保持 `Surface` 语义，但默认不显示额外 focus ring，避免预览缩略图出现按钮式焦点描边。
16. **组合子渲染**: 传入的 `children` 会在媒体容器外层渲染，继续通过 `as="icon"` / `as="badge"` 使用定位上下文，不会再被 `Image` 内部的媒体模板吞掉。
