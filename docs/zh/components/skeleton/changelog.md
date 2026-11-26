# Skeleton 更新日志

### v1.4.0 (2026-08-15)

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

- 组件通过根 Frame `renderHints` 自注册，不再要求维护集中 class mapping。
- Frame 首层 probe 只收集 `data-skeleton-registered="true"` 的 child。
- `renderHints.radius` 进入 DOM bridge、probe 与 Skeleton 最终样式。
- 旧 `COMPONENT_CLASS_MAPPING` 保留兼容，但不再接受新 SnowUI 组件登记。

### v1.3.9 (2026-07-30)

- Gradient 完全重写后，默认骨架回退尺寸同步调整为 `360 × 360`；显式 `renderHints` 仍优先。

### v1.3.8 (2026-07-21)

- Gradient 默认骨架回退尺寸同步调整为 `355 × 355` 正方形；显式 `renderHints` 仍优先。

### v1.3.7 (2026-07-20)

- 登记 Gradient 根类名与默认矩形布局；实际 loading 尺寸由 Gradient 的 `renderHints` 覆盖。

### v1.3.6 (2026-03-14)

#### 样式
- Input Skeleton 默认高度同步为 `1.25rem` (20px)，代表内容区域高度。配合 Frame 的 12px 上下 padding，总高度维持在 44px。

### v1.3.5 (2026-03-07)

#### 文档
- 系统补齐 Skeleton 当前全部规则文档，明确：
  - 形状别名
  - 默认尺寸
  - 圆角与动画规则
  - 组件映射表
  - `Text` 多条骨架布局与尾行宽度规则
  - 第一层组件渲染规则
  - `renderHints` 与尺寸继承规则

### v1.3.4 (2026-03-07)

#### 文本骨架布局
- `Text` 多条 Skeleton 改为上下排列，不再并排显示。
- `Text` 多条 Skeleton 中，前置行默认宽度占满文本容器，最后一条固定为文本容器宽度的 `30%`。

#### 尺寸约束
- 圆角矩形 Skeleton 继续优先跟随组件通过 `renderHints` 提供的最终宽高，不额外压缩为通用短宽样式。

### v1.3.3 (2026-03-07)

#### 渲染逻辑
- 骨架渲染规则收敛为“只看第一层组件”。
- `Frame` 在骨架态下优先渲染第一层直接子组件的 Skeleton；只有当第一层没有组件时才回退为自身文字骨架。
- `Text` 在骨架态下新增第一层段落统计逻辑：按第一层块级段落节点数量生成多条文字 Skeleton，并默认占满文本容器宽度。

### v1.3.2 (2026-03-07)

#### 样式调整
- 除圆形骨架外，其他 Skeleton 默认圆角统一为 `12`。
- `text / line` Skeleton 默认高度调整为 `20px`（`1.25rem`）。

### v1.3.1 (2026-03-07)

#### 样式调整
- 矩形骨架默认圆角明确为 `12`（`--radius-3`，fallback `0.75rem`）。

### v1.3.0 (2026-03-07)

#### 架构重构
- 释放 `whileLoad` 关键字：Skeleton 改用 `loading` 控制显隐，配合 Frame 的 `loading / skeleton / whileLoad` 协议分层。

### v1.2.1 (2026-03-07)

#### 新功能
- 补齐 `frame / test` 的 Skeleton 映射与布局声明，配合 standards 检查实现组件目录 Skeleton 覆盖完整性校验。

### v1.2.0 (2026-03-07)

#### 架构重构
- Skeleton 改为不依赖 `Frame` 的独立骨架原语组件，供 `Frame` 默认加载协议与测试示例共同复用。
- 骨架形状收敛为 `line / circle / rect` 三类。
- 新增基于组件根类名的集中骨架分配逻辑。
