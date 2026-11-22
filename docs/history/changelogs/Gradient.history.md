# Gradient 更新日志归档

### v2.12.1 (2026-08-15)

- 将六组固定 SVG palette、中心色与 Avatar 模式多色 Overlay 正式登记为专业艺术色例外，并明确例外不扩展到 Gradient 的其他样式契约。

### v2.12.0 (2026-08-06)

- 为 Avatar 内部协议提供共享静态图源与受控 hover 生命周期；默认头像常态由 Avatar 直接渲染静态图，Gradient 只在 hover 或常驻 motion 时实例化。
- 受控 hover effect 只追踪 Avatar 传入的激活值；实例内部的 profile、挂载状态与退出计时更新不参与 effect 依赖，避免循环更新。
- 静态 Avatar 图片增加 lazy loading、异步解码与低请求优先级，减少长列表首屏解码竞争。

### v2.11.0 (2026-08-03)

- 四层 transform 从2–3个姿态扩展为各自七个不等时、非镜像途经点，闭环末段不再沿上一段原路返回。
- 新增六组相位 / 方向组合；每次 Avatar hover 随机选择且避开上一次组合，使相同头像重复进入时也不会从同一状态、同一方向开始。
- 随机只发生在 hover 边界；活动图层数量、filter 数量、CSS逐帧执行方式和退出回收策略保持不变。

### v2.10.0 (2026-08-02)

- 默认 Gradient Avatar 常态继续使用缓存静态图，hover 时才按需挂载一份实时 SVG；离开以0.5秒淡出并连同四组 filter 与 Overlay 一起释放。
- 四个内部图层改用 `6.4s / 7.2s / 8.4s / 6.8s` 独立线性周期与负延迟错峰，hover 幅度提升到18%位移、30度旋转和32%缩放 / 形变，消除同步缓动造成的长停顿感。
- 修正按需 hover 生命周期接入 Frame 支持的 `mouseenter / mouseleave`，同时保留外部 pointer 回调透传。

### v2.9.0 (2026-08-02)

- Gradient Avatar 每种候选色的 Overlay 从四层降为两层，入口缓冲由0.5秒延长为1秒，退出保持0.5秒；颜色、`overlay` 混合、10秒循环和单层58%峰值不变。
- 默认静态 Avatar 改为复用六份包内 SVG 图片资源，移除200头像场景中的800个实例级 filter 节点并消除重复 data URI；与原实时 SVG 的24px截图像素完全一致。
- 保留 hover 按需挂载和 `content-visibility`，单头像 hover 现在只创建10个 pass与10个颜色层。

### v2.8.6 (2026-08-02)

- 保留认可版本 hover 的五色 × 四层 Overlay、`overlay` 混合、10s 循环、0.5s 缓冲与颜色参数，只将完整结构改为 hover 按需挂载、离开淡出后卸载。
- Avatar 模式增加原生 `content-visibility: auto` 与绘制 containment，长列表视口外不绘制静态 SVG；不使用逐头像 IntersectionObserver。

### v2.8.5 (2026-08-02)

- 新增 `motion` 基础形变开关：普通 Gradient 默认开启，Avatar fallback 默认关闭。
- 关闭基础形变时不挂载 transform animation 与 `will-change`；Avatar hover 的认可版本多色 Overlay 保持不变。

### v2.8.4 (2026-08-02)

- 修复 Avatar hover 颜色层在循环边界反复闪烁：关键帧 `100%` opacity 从错误的 `1` 恢复为与 `0%` 相同的 `0.58`。
- 五组错峰颜色层现在均以完全相同的起止状态闭环，相邻颜色仍保持连续交叉淡化。

### v2.8.3 (2026-08-02)

- 修复 SVG clip / filter 合成上下文导致 `mix-blend-mode: overlay` 退化为近似纯色染色的问题。
- 双层颜色 Overlay 从 SVG `<g>` 移到完整 SVG 上方的 HTML 合成层，使每次混合都以原 Gradient 图形作为 backdrop，保留其明暗与渐变纹理。

### v2.8.2 (2026-08-02)

- 修复双层纯色峰值为 100% 时压平原 Gradient 纹理的问题：两层改为独立 Overlay pass，单层峰值限制为 58%。
- 根据“颜色变化太快”将五色循环时长由 `5s` 增加为 `10s`；每个相邻颜色拥有更长的交叉淡化时间，不发生离散跳色。

### v2.8.1 (2026-08-02)

- Avatar hover Overlay 的显现时长由 `0.15s` 调整为 `0.5s`，使用标准 ease-in-out 缓动，让双层颜色强度与 5s 循环运动自然渐入。
- 动画仍在 hover 时直接以目标速度运行，但由合成层渐显遮蔽启动跳变，不增加 JavaScript 调速、计时器或逐帧计算。

### v2.8.0 (2026-08-02)

- Avatar 每个候选色从单层 Overlay 改为两层完全同步的同色 Overlay，每层分别使用 `overlay` 混合，增强色调变化。
- 五色循环由 `10s` 缩短为 `5s`，颜色过渡速度提高至 2 倍。
- 单个头像仅增加到十个纯色 opacity 层，仍不复制 Gaussian Blur 图形。

### v2.7.0 (2026-08-02)

- Avatar 继续统一提供 hover 状态，Gradient 改为自行管理颜色变化：排除当前 variant 后，将其余五色按实例打乱并持续交叉过渡。
- 删除旋转 / 缩放的 `screen` 渐变带，改用六种 Gradient 的中心主色作为固定 `overlay` 叠加色。
- 为避免复制完整静态 Gradient 带来的 Gaussian Blur 开销，候选色只渲染为五个 80px 纯色矩形且仅动画 opacity。

### v2.6.0 (2026-08-02)

- GD-04 改为六个 `80 × 80` Avatar，逐一展示 blue、cyan、green、red、orange、purple 六种 Gradient fallback。
- Gradient 在 Avatar fallback 模式下按 seed 稳定选择配色；显式 variant 仍拥有最高优先级。
- Avatar hover 新增持续的 `screen` 颜色叠加带，只动画小尺寸叠加层的 transform；reduced-motion 下停止循环并保留静态颜色反馈。

### v2.5.0 (2026-08-02)

- 将 GD-05 全部 19 项动效参数初始化为各自可调范围上限：基础时长 `60s`、整体速度 `4×`、缓动坐标均为 `1`，位移 `12%`、旋转 `20deg`、缩放 / 形变 `25%`。
- Gradient 公开 CSS fallback 同步为上述上限组合；基础时长与速度换算后的默认实际循环时长为 `15s`。

### v2.4.0 (2026-07-30)

- 底色矩形改为始终静止，删除整张 SVG 的统一 transform 动画。
- 四个有色模糊图层分别采用位移 / 旋转、位移 / 缩放、位移 / 非等比形变、位移 / 旋转 / 缩放，并错开关键帧节奏。
- 为控制性能，颜色、混合模式、路径与 Gaussian Blur 全部保持静态；GD-05 更新为四列排列的 19 项控制。

### v2.3.0 (2026-07-30)

- 增强 A/B/C 默认位移，并将默认旋转幅度调整为 `±3deg`、缩放幅度调整为 `5%`，使 `4×` 速度下仍能清楚辨认持续动效。
- Rotate / Scale 从逐关键帧绝对值改为整体变化幅度；时间线自动生成对应的负幅度、中心值与正幅度。
- GD-05 精简为 14 条控制条，以固定四列网格排列在图形下方。

### v2.2.1 (2026-07-30)

- GD-05 新增唯一一条整体速度倍率 Slider，默认 `1×`、范围 `0.1×–4×`。
- 整体速度只换算最终循环时长，不增加第二条动画或 Gradient 运行时脚本。

### v2.2.0 (2026-07-30)

- 将时长、缓动和 A/B/C 三个关键帧的 X、Y、Scale、Rotate 全部落成 CSS override。
- GD-05 通过 Test 专用 `GradientMotionController` 增加 17 条控制条，可实时调整全部动效参数；控制状态不进入 Gradient 运行时。

### v2.1.0 (2026-07-30)

- 增加持续柔和的低频漂移动效。
- 单实例只动画 SVG 根层 `transform`，不逐帧重算 Gaussian Blur、路径或颜色。
- 默认循环时长为 `24s`，支持 `--snowui-gradient-motion-duration-override` 外部覆盖。
- `prefers-reduced-motion: reduce` 下停止循环并恢复静态设计基线。

### v2.0.1 (2026-07-30)

- 根层增加纯 alpha mask，修复带 SVG filter 的内容在圆角 `overflow` 边缘出现有色毛边的问题。

### v2.0.0 (2026-07-30)

#### 破坏性重写

- 删除旧版 Workshop 图层 `c` PNG 渲染与 `355 × 355` 静态裁切方案。
- 按 Workshop Frame 200 重绘六种 `360 × 360` SVG 矢量配色。
- 新增 `variant="blue|cyan|green|red|orange|purple"`。
- 默认尺寸调整为 `360 × 360`，默认圆角调整为 `0`。
- 删除无视觉作用的 `seed` 兼容参数。
- SVG 模糊随 viewBox 几何同步缩放。
- 静态阶段显式关闭 Frame 默认动效。
