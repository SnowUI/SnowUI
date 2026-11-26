# SidebarItem 更新日志

### v1.7.0 (2026-10-23)

- 主操作与标签／updated 之间的有效间距至少为 4 CSS px，缩小根字号或 gap scale 时仍保留；较大首选间距保持不变。长文字先缩略，Link 与 Button 都遵守可用宽度；末尾操作独立预留空间，不覆盖状态标签。leading 槽不小于内置图标既有的 12px 下限，默认 20px 与层级连接线对齐保持不变。

- 2026-10-20：内置updated圆点的名称随LocaleProvider更新；label、tags及actions仍属调用方内容。折叠态的装饰与可访问树结构保持原有契约。

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

### v1.6.2 (2026-09-01)

#### 修复
- 将二级 Item 连接线由长虚线收紧为密集的 1px 点线，保持原有 9px × 9px 等长双臂与 4px 圆角。

### v1.6.1 (2026-09-01)

#### 修复
- 将二级 Item 的 L 形层级连接线收敛为等长双臂；默认视觉线长为 9px × 9px，并继续保持父级 Icon / 子级文字双轴对齐。

### v1.6.0 (2026-09-01)

#### 新功能
- 新增 `depth={0 | 1}`；二级 Item 内置 1px Black/40%、4px 圆角的 L 形层级连接线，并保持父级 Icon / 子级文字双轴对齐。

### v1.4.1 (2026-08-09)

#### 修复
- Link 主操作显式继承 SidebarItem 固定 gap，避免 Link 默认 2px 覆盖 Item 的 8px leading/content 间距；Link 与 Button 路径现在一致。

### v1.4.0 (2026-08-06)

#### 变更
- 输出稳定的 `data-sidebar-item-id`，供 Sidebar 在持久化恢复后识别 active item、展开所属 Section 并完成滚动定位。

### v1.3.0 (2026-07-30)

#### 新功能
- 新增外部 `tags` Snippet，固定渲染在 label 与内置 updated 之间。
- 标签位置规则归入 SidebarItem；`updated` 在展开态与折叠态均保持 Badge dot 视觉。

### v1.2.1 (2026-07-28)

#### 修复
- 主操作固定为单行布局，折叠态裁切渐隐后的文字节点，避免隐藏内容换行把默认 Item 从 36px 撑高。

### v1.2.0 (2026-07-28)

#### 动效优化
- Sidebar 整体折叠时保留 Item content 节点并使用 Frame color bridge 渐隐；leading Icon 不再因切换居中布局而横向移动。

### v1.1.0 (2026-07-28)

#### 变更
- Item action Tooltip 与折叠态 label Tooltip 统一显示在对应元素右侧。

### v1.0.1 (2026-07-28)

#### 变更
- 折叠态 label Tooltip 默认显示在 Icon 右侧。

### v1.0.0 (2026-07-23)

#### 新功能
- 初始版本：Link/Button 主操作、active、更新 Badge、折叠态与 hover/focus actions。
