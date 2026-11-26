# Badge 更新日志

### v1.3.3 (2026-09-02)

- 2026-10-05：原 Indigo 默认配色改为 Brand（`--brand`），保留原有透明度、状态与覆盖机制。
- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。
- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.3.2 (2026-08-28)

- 内容层改由 Grid 以自然宽度直接居中，并允许在 16px / 12px 固定 Badge 中围绕几何中心对称溢出，修复文本标签的光学偏移与小尺寸数字向右偏移。

### v1.3.1 (2026-07-30)

- Border 变体内部文字层改为继承 16px 行高，避免通用 morph-item 将实际高度压缩到 12px；New 标签现在与 Kbd 默认 border 高度一致。

### v1.3.0 (2026-07-30)

#### 新功能
- 新增 `variant="border"`，复用 Kbd 默认描边视觉的 Token、padding、圆角、字号与行高，用于 New、updated 等状态/分类标签；默认 `filled` 行为不变。

- **Badge-Motion.2026-06-18** 按 transitions.dev Notification badge 的双层结构还原默认动效：Frame 根层执行左下偏移进场，完整视觉 surface 执行中心 scale / opacity / blur；退场时 surface 整体缩小，而不是只缩放数字内容。
- **Badge-Motion.2026-06-30** 统一 `while*` 完整视觉通道语义：显式对象不再浅合并 Badge 默认 x / y / scale / opacity，只继承默认时序 / 动力学参数。

- **Badge-Docs.2026-05-25** 源码顶部历史更新日志已归档；后续新增变更统一写入本文档 更新日志，源码顶部只保留职责、当前关键架构与文档路径。

### v1.2.8 (2026-06-18)

#### 动效还原
- **BD-Motion.1** 采用定位根层 + 视觉 surface 双层结构，匹配 Notification badge 的并行 slide / pop 动效。
- **BD-Motion.2** 进场使用 260ms 位移、500ms scale/blur、400ms opacity；退场使用 180ms scale/opacity/blur，并以中心点缩小整个 Badge。
- **BD-Color.1** 新增 `color` Prop，接入公共 SnowUI PascalCase 语意色解析器并用于数字、文本和 Dot 模式填充色。

### v1.2.7 (2026-04-28)

#### 调整
- **BD-Layout.1** 按内联外壳布局协议移除组件内部 `margin` 链，点模式外部留白改由父级布局管理。

### v1.2.6 (2026-03-07)

#### 架构重构
- 释放 `whileLoad` 关键字：Badge 改用 `loading` 作为本地加载态入口，并将 `whileLoad` 透传回 `Frame` 作为加载态动效配置。

### v1.2.4 (2026-02-18)

#### 调整
- **BD-Typography.1** 组件内行高统一改为 `line-height: 1`（基础样式与 morph item）。

### v1.2.3 (2026-02-05)

#### 样式优化
- **BD-Style.2** 将数字颜色固定为白色 (`--static-white-100`)。
- **BD-Doc.1** 将组件内所有样式定义迁移至文档 `UserDefined` 区域。

### v1.2.3 (2026-02-05)

#### 修复
- **BD-Fix.2** 修复了在大尺寸下数字未居中的问题（移除强制 `line-height`）。

### v1.2.2 (2026-02-05)

#### 架构重构
- **Size Context**: 支持从 `Frame` 上下文读取 `size`。实现了角色感知（Role-aware）的继承逻辑，确保徽标在不同使用场景下均能保持正确的视觉比例。

### v1.2.0 (Initial)
- 初始版本
