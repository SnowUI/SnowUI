# SidebarItem 更新日志归档

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
