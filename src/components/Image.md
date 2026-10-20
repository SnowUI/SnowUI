# Image

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.5.0
> **职责**: 展示图片及其占位状态，支持组合角标、操作与预览入口，适合内容图片和媒体缩略图。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-20

## 组件介绍

展示图片及其占位状态，支持组合角标、操作与预览入口，适合内容图片和媒体缩略图。

## 使用选择

<!-- usage-guide:start -->
用于展示图片与其公开加载/预览能力。头像优先 Avatar，多张图片组合用 ImageGroup，专业查看用 ImageViewer。

- 提供 src 与有意义的 alt；附属内容用 as="icon" 或 as="badge"，不会替换图片。
- 通过 previewMode 配置预览；ImageGroup 可统一组尺寸和预览策略，查看器由 ImageViewer 承载。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Image } from '@snowui-design-system/components';
	import { ImageViewer } from '@snowui-design-system/components';
	import cover01 from '@snowui-design-system/resource-base/assets/backgrounds/gradient-01-1024.jpg';
</script>

<Image src={cover01} alt="SnowUI gradient resource 1" size={80} />
<ImageViewer />
```
<!-- /quick-start:generated -->

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

`eager` 会提前消耗网络和解码资源，不承诺图片下载成功或固定完成时限；真实加载期间仍显示 Skeleton。仅影响字符串图片的 `<img loading>`，不改视频的 `preload="metadata"`、资源组件自身的加载协议、预览器中尚未打开的媒体或动画播放时机。详见 [通用加载策略](../lib/media-loading.md)。

### 布局模型

主布局模型：内禀原子布局。

- Image 的根节点只暴露一个由 `size`、媒体资源与圆角映射决定的媒体盒，作为 Button、MenuItem、Field 等外部布局的子项时表现为 Hug。
- 媒体裁切、真实加载 Skeleton、hover 视觉遮罩、中央 icon 与角标定位都属于 Image 私有布局，不对外暴露通用槽位。
- 子组件的 `as="icon"` / `as="badge"` 只用于 Image 内部定位，不改变子组件自己的布局模型。
- 外部需要排列多张图片时应使用 `ImageGroup`，不要把 Image 改造成集合布局。

<a id="关键字-keyword"></a>

### 关键字 (Keyword)

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `as` | `'badge' \| 'icon'` | - | 子组件角色：`badge` 右上角，`icon` 居中 |

<a id="使用示例"></a>

### 使用示例

```svelte
<!-- 基础图片 -->
<Image src="/demo.png" size={48} alt="示例图片" />

<!-- 资源图片 -->
<Image src={Image01} size={80} alt="资源图片" />

<!-- 默认占位态 -->
<Image size={40} />

<!-- 中央图标 -->
<Image src={Image01} size={48}>
    <Icon as="icon">
        <Play />
    </Icon>
</Image>

<!-- 右上角单选角标 -->
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
5. **Hover 视觉**: 与 Avatar 共用 [`components/src/styles/layout.css`](../styles/layout.css) 的 `.snowui-media-hoverable` 工具类家族。只要当前 Image 具备**点击交互意图**(`resolvedInteractive`,即 `src` 存在 + 未 `disabled` + `previewMode !== "none"` 或显式有 `onclick`)就挂 `.snowui-media-hoverable` 获得手形指针;有图态(`hasLoadedMedia`)再挂 `.snowui-media-hoverable-has-visual`,hover 时 `.snowui-image-visual` 层应用 `filter: brightness(0.92)`(媒体本身压暗);无图占位态根不挂 `-has-visual`,hover 时 `.snowui-image-background` 层从 `--black-4` 过渡到 `--black-10`。覆盖入口:`--snowui-media-hover-brightness`。
6. **交互意图 vs 实际打开**: `resolvedInteractive`(决定 hover 视觉)与 `resolvedCanOpen`(决定点击是否真打开)分离。默认 `previewMode="window"` 下,**所有有 src 的 Image 都视为有交互意图**(获得 hover + cursor),但**只有字符串图片/视频能在新窗口打开**(Component src 因为无法获取 URL,点击无实际动作);传 `previewMode="none"` 且没有 `onclick / onOpen` 时显式 opt-out,不提供 hover 变色、手形指针或键盘 button 语义。
7. **视频缩略态**: 当 `src` 为字符串视频地址时，组件改为渲染 `<video>`；hover 时自动播放，离开后暂停并回到起始帧。
8. **字符串图片加载**: 字符串图片不再通过额外的 JS 预加载器探测，而是直接交给原生 `<img>` 加载；组件只通过 `load/error` 事件更新内部状态。
9. **真实加载骨架**: 当 `src` 是字符串图片或字符串视频时，媒体真实加载阶段会在组件内部显示 `Skeleton` 占位；加载完成后 Skeleton 消失，媒体再显示出来。
10. **Viewer 模式**: 页面存在自动模式 `ImageViewer` 且未显式声明 previewMode 时，自动接入页面级 Viewer；显式 `previewMode="viewer"` 仍可强制表达该意图。
11. **Window 模式**: `previewMode="window"` 时，字符串图片/视频会直接在新窗口打开。
12. **None 模式**: `previewMode="none"` 时，当前 `Image` 不提供打开动作。
13. **组内切换**: 当 `Image` 位于 `ImageGroup` 中且组或当前项使用 `previewMode="viewer"` 时，会使用组内注册列表作为 Viewer 的 `items`，从而支持上一张/下一张。
14. **事件透传**: 组件内部的视频 hover 播放逻辑不会吞掉外部 `mouseenter / mouseleave` 回调。
15. **焦点策略**: `Image` 与 `Avatar` 一样保持 `Surface` 语义，但默认不显示额外 focus ring，避免预览缩略图出现按钮式焦点描边。
16. **组合子渲染**: 传入的 `children` 会在媒体容器外层渲染，继续通过 `as="icon"` / `as="badge"` 使用定位上下文，不会再被 `Image` 内部的媒体模板吞掉。



## AI Zone

> **更新日志 (2026-05-20)**: 明确 Image 默认具备点击预览交互；只有具备点击交互时才显示 hover 变色和手形指针，`previewMode="none"` 且无点击回调时不显示交互 hover。
> **更新日志 (2026-04-28)**: 标注主布局模型为内禀原子布局，明确媒体裁切、loading 层与角标/图标定位为组件私有布局。
> **更新日志 (2026-03-13)**: 字符串图片与字符串视频在真实加载阶段新增 Skeleton 占位，媒体加载完成后再显示内容。
> **更新日志 (2026-03-13)**: 扩展尺寸梯度，新增 `56 / 64 / 72`；圆角映射更新为 `56→16px`、`64/72/80→20px`。
> **更新日志 (2026-03-13)**: 移除 `openable / disableImageViewer` 兼容属性；当前预览行为只由 `previewMode="viewer" | "window" | "none"` 控制。


**继承**: 复用 Frame.svelte 的所有通用能力 (交互、动效、响应式)。
**默认能力开关**: `enableResponsive=false`, `enableContext=false`。

<a id="样式规范-style-spec"></a>

### 样式规范 (Style Spec)

### 1. Token 映射

- `4% 灰色背景` → `var(--black-4)`
- `4px 角标偏移` → `var(--padding-1)`
- `固定尺寸` → `--size-3/4/5/6/7/8/10/12/14/16/18/20`
- `尺寸圆角映射` → `12/16/20: --radius-1`, `24/28/32: --radius-2`, `40/48: --radius-3`, `56: --radius-4`, `64/72/80: --radius-5`
- `视频缩略态` → hover 自动播放；离开后暂停并回到 0

### 2. 视觉层级

- 根节点 `.snowui-image` 仅承载交互语义与尺寸链路。
- `.snowui-image-container` 负责裁切、圆角与背景。
- `.snowui-image-visual` 在图片模式下负责 hover 压暗，不直接改写根节点几何。
- 默认占位态只保留 `.snowui-image-background` 这一层 `var(--black-4)` 背景，容器本身不再铺底色，避免重复叠加。
- hover 选择器保留在组件内，避免不规则图片和头像共享遮罩逻辑时产生误伤。

### 3. Hover 规范 (Hover Spec)

**有图模式**
- 命中选择器：
  - `.snowui-image.snowui-image-has-media:hover:not(.snowui-disabled):not([data-disabled="true"]):not(:disabled) .snowui-image-visual::after`
- 实现方式：
  - 通过 `.snowui-image-visual::after` 增加内部黑色遮罩层
  - 当前样式值：`opacity: 0.06`
- 目的：
  - 这是本轮里已经验证过可见的实现
  - `resource-svelte` 图片场景下更稳定
  - 不依赖根节点 hover 背景叠加

**无图模式**
- 命中选择器：
  - `.snowui-image:not(.snowui-image-has-media):hover:not(.snowui-disabled):not([data-disabled="true"]):not(:disabled) .snowui-image-background`
- 实现方式：
  - 仅改变背景层颜色
  - 当前样式值：`background-color: var(--black-10, #0000001a)`
- 结果：
  - 无图占位态从 `--black-4` 过渡到 `--black-10`
  - 不影响角标和图标挂件

### 4. 组合定位

- `as="badge"`: 通过 Pin 布局输出 `pin-top-right` 或 `pin-bottom-right`，偏移为 `var(--padding-1)`
- `as="icon"`: 通过 Pin 布局输出 `pin-center`


---

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 模块索引 (Module Index)

- **Image 组件**: [./Image.svelte](Image.svelte)
- **页面级预览总线**: [../logic/image-preview.ts](../logic/image-preview.ts)

### 关键字映射 (Keyword Handling)

| 关键字 | 处理模块/文件 | 逻辑说明 |
| :--- | :--- | :--- |
| `src` | `Image.svelte` | 解析字符串图片、字符串视频或资源组件，决定媒体层与占位层渲染 |
| `size` | `Image.svelte` | 尺寸映射、圆角映射与 `ImageGroup` 上下文消费 |
| `previewMode` | `Image.svelte` + `../logic/image-preview.ts` | 控制当前 `Image` 的预览模式，并决定是否接入页面级 `ImageViewer` |
| `as="badge"` | `Image.svelte` + 子组件 | 通过 `IMAGE_CONTEXT_KEY` 提供 Pin 方位与偏移样式 |
| `as="icon"` | `Image.svelte` + 子组件 | 通过 `IMAGE_CONTEXT_KEY` 提供 `pin-center` 方位 |

### 关联关系

- **父组件**: [Frame.svelte](Frame.svelte)
- **组合组件**: [ImageGroup.svelte](ImageGroup.svelte), [ImageViewer.svelte](ImageViewer.svelte)
- **典型子组件**: [Icon.svelte](Icon.svelte), [Radio.svelte](Radio.svelte), [Button.svelte](Button.svelte)
- **预览状态**: [../logic/image-preview.ts](../logic/image-preview.ts)

---

## 更新日志

### v1.5.0 (2026-10-20)

- 修正外部 children 与 Frame 内部同名 Snippet 在 SSR 编译时相互遮蔽造成递归；媒体挂件行为保持。
- 新增 `mediaLoading` 与公开 `provideMediaLoading()` 作用域默认值；默认 lazy，单项覆盖优先，保持视频及资源组件原行为。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- **Image-Docs.2026-05-25** 源码顶部历史更新日志已归档；后续新增变更统一写入本文档 更新日志，源码顶部只保留职责、当前关键架构与文档路径。

### v1.4.0 (2026-07-05)

#### 调整
- 未显式声明 `previewMode` 时，页面存在共享 ImageViewer 服务则自动使用 `viewer`；服务不存在时继续回退 `window`。
- 显式 `viewer / window / none` 始终优先于自动路由。

### v1.3.4 (2026-05-20)

#### 调整
- **IM-Behavior.5** 默认字符串图片/视频仍可点击打开；只有具备点击交互的 Image 才显示 hover 变色、手形指针与 button 语义，`previewMode="none"` 且无点击回调时保持静态展示。

### v1.3.3 (2026-03-13)

#### 调整
- **IM-Adjust.9** 字符串图片与字符串视频在真实加载阶段接入组件内 `Skeleton` 占位，媒体加载完成后再显示。

### v1.3.2 (2026-03-13)

#### 调整
- **IM-Adjust.8** 扩展尺寸梯度：新增 `56 / 64 / 72`，并将圆角映射更新为 `56→16px`、`64/72/80→20px`。

### v1.3.1 (2026-03-13)

#### 调整
- **IM-Adjust.7** 移除 `openable / disableImageViewer` 兼容属性；当前打开行为只由 `previewMode` 控制。

### v1.3.0 (2026-03-12)

#### 调整
- **IM-Adjust.5** 新增 `previewMode="viewer" | "window" | "none"`，并将默认打开方式收口为 `window`。
- **IM-Behavior.4** `Image` 不再因页面存在 `ImageViewer` 自动接入页面级预览；只有显式声明 `previewMode="viewer"` 时才进入 Viewer 链路。

### v1.2.2 (2026-03-12)

#### 修复
- **IM-Fix.12** `openable` 新增 `Enter` 键支持，补齐与 `Space` 一致的键盘打开语义。
- **IM-Behavior.3** 页面中存在自动模式 `ImageViewer` 时，`Image` 默认可点击打开，不再要求显式传入 `openable`；`disableImageViewer` 仍可强制改走新窗口。
- **IM-Fix.13** 恢复外部 `mouseenter / mouseleave` 回调透传，避免视频 hover 逻辑吞掉页面层联动。
- **IM-Fix.14** 移除 `!important` 焦点覆盖，改为仅在 `:focus-visible` 下清空默认 outline；同时将内部 hover 覆写变量改为 `--snowui-image-*` 命名。

### v1.2.0 (2026-03-10)

#### 新功能
- **IM-Feat.6** 新增 `disableImageViewer` 属性，可强制当前 `Image` 回退为新窗口打开。
- **IM-Behavior.2** `openable` 在页面存在自动模式 `ImageViewer` 时默认接入页面级单一 Viewer；否则自动回退为新窗口打开。

### v1.2.1 (2026-03-11)

#### 调整
- **IM-Adjust.4** 字符串图片改为直接使用原生 `<img>` 加载并通过 `load/error` 事件更新状态，移除额外的 `window.Image()` 预加载器，降低大图列表下的重复加载开销。

### v1.1.11 (2026-03-10)

#### 新功能
- **IM-Feat.5** 新增字符串视频资源支持；`Image` 现在可渲染 mp4/webm/ogg/mov。
- **IM-Behavior.1** 视频缩略态 hover 时自动播放，离开后暂停并回到起始帧。

### v1.0.6 (2026-03-10)

#### 修复
- **IM-Fix.5** 有图模式 hover 改为内部视觉遮罩层压暗，避免仅依赖 `filter` 时在部分图片场景下视觉效果不明显。

### v1.1.4 (2026-03-10)

#### 调整
- **IM-Adjust.3** 下调 `Image` 图片态 hover 遮罩强度，使 hover 颜色与 `Avatar` 既有 hover 观感保持一致。

### v1.1.3 (2026-03-10)

#### 修复
- **IM-Fix.11** 恢复 `Image` 在本轮中已验证可见的图片态 hover：改回内部视觉遮罩层变暗，不再依赖图片节点 `brightness`。

### v1.1.2 (2026-03-10)

#### 修复
- **IM-Fix.10** 图片态 hover 统一同时命中视觉层与实际 `media` 节点，进一步消除不同图片来源下的 hover 丢失问题。

### v1.1.1 (2026-03-10)

#### 修复
- **IM-Fix.9** 图片态 hover 统一命中实际 `media` 节点，修复有图 `Image` 在资源图片场景下 hover 不生效的问题。

### v1.1.0 (2026-03-10)

#### 调整
- **IM-Adjust.2** `Image` 的 hover 选择器移至 `src/styles/layout.css`，与 `Avatar` 共用统一 hover 规则。

### v1.0.9 (2026-03-10)

#### 修复
- **IM-Fix.8** 为 `resource-svelte` 图片补充轻量 hover 保底层，解决资源图片场景下 hover 视觉丢失的问题。

### v1.0.8 (2026-03-10)

#### 修复
- **IM-Fix.7** 强化图片态 hover 命中：在保留 `brightness(0.85)` 策略的前提下，让图片节点也参与亮度变化，避免部分图片场景下 hover 视觉丢失。

### v1.0.7 (2026-03-10)

#### 修复
- **IM-Fix.6** `Image` 的 hover 实现完全对齐 `Avatar`：移除图片遮罩层，恢复有图模式对视觉层使用 `brightness(0.85)`。

### v1.0.5 (2026-03-10)

#### 修复
- **IM-Fix.4** 对齐 `Avatar` 的 hover 分层：图片模式压暗视觉层；占位态 hover 改为背景层从 `--black-4` 过渡到 `--black-10`。

### v1.0.4 (2026-03-10)

#### 修复
- **IM-Fix.3** `as="icon"` 宿主样式改为仅负责居中定位，不再通过 `inset: 0` 拉伸 `Button` 等子组件尺寸。

### v1.0.3 (2026-03-10)

#### 调整
- **IM-Adjust.1** `Image` 新增尺寸到圆角的固定映射：`12/16/20→4px`，`24/28/32→8px`，`40/48→12px`，`80→20px`。

### v1.0.2 (2026-03-10)

#### 修复
- **IM-Fix.2** 移除容器底色与背景层的重复 `--black-4` 叠加，默认占位态收敛为单一背景层。

### v1.0.1 (2026-03-10)

#### 修复
- **IM-Fix.1** 默认占位态改为单层 `--black-4` 背景，移除重复叠层造成的视觉偏深。

### v1.0.0 (2026-03-10)

#### 新功能
- **IM-Feat.1** 新增 Image 组件，支持字符串图片与 `resource-svelte` 图片组件。
- **IM-Feat.2** 新增默认占位态，未传素材时显示 `--black-4` 背景。
- **IM-Feat.3** 新增 `as="badge"` 与 `as="icon"` 组合定位协议。
- **IM-Feat.4** 新增 `openable` 触发语义，支持点击和空格打开预览。
