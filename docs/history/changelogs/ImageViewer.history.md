# ImageViewer 更新日志归档

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
