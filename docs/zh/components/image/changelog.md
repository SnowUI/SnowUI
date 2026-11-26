# Image 更新日志

### v1.5.0 (2026-10-20)

- 修正外部 children 与 Frame 内部同名 Snippet 在 SSR 编译时相互遮蔽造成递归；媒体挂件行为保持。
- 新增 `mediaLoading` 与公开 `provideMediaLoading()` 作用域默认值；默认 lazy，单项覆盖优先，保持视频及资源组件原行为。

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

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
