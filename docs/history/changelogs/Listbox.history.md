# Listbox 更新日志归档

### v1.3.5（2026-09-17）

- Listbox Portal 的最终水平位置使用共享浮层夹取能力限制在视口 8px 安全边距内，并限制面板最大宽度，修复靠近左右边缘时选项面板越出视口的问题。

### v1.3.4（2026-09-12）

- 打开期间跟随触发器状态动效更新定位和等宽尺寸，动效结束或取消时同步最终位置；关闭后取消跟踪。避免 Select 点击缩放恢复后，面板仍保留缩小时的宽度。

### v1.3.3（2026-09-12）

- 按用户要求移除横向取整，等宽 Listbox 总宽度增加固定 2px、左右各覆盖 1px；保留背景、模糊与内边框，固定 px 已登记规范例外。

### v1.3.2 (2026-09-12)

- 每次打开时记录选中项对齐位置；搜索、无匹配、清空与自定义项变化不再依据隐藏选项的零尺寸矩形重定位。
- 初始对齐与 active 项滚动只读取当前可见选项，保留完整项高度与视口约束。


### v1.3.1 (2026-09-03)

- Quick Action 与 overlay scrollbar 共享默认进入已登记的低优先级 CSS layer，组件 padding / 轨道定位不再被后加载的共享样式覆盖。
- 轨道定位抵消实际面板 padding；根字号缩放或公开 padding override 后，滚动条右缘仍距面板右缘 4px。

### v1.3.0 (2026-09-01)

#### 调整
- 未显式设置 `maxHeight` 时，面板改为按实际可见 Item 高度完整显示最多 10 项；视口空间不足时按完整项数收窄，并至少保留 2 项高度，避免末项只显示一部分后在 hover / 键盘高亮时触发自动滚动。
- 显式 `maxHeight` 与调用方 inline `max-height` 覆盖保持兼容。

### v1.2.2 (2026-07-05)

#### 修复
- `matchTriggerWidth` 改为“至少与触发器等宽”；当触发器过窄时，Listbox 按最长选项文字、勾选槽、gap 与 padding 的完整宽度扩展，避免文字、勾选重叠或右侧间距消失。

### v1.2.1 (2026-07-05)

#### 修复
- Portal 浮层隔离外层 Field Context，避免 Select 位于 Field 内时，搜索 Input 被误判为 embedded host 而丢失独立背景、边框、padding 与圆角。

### v1.2.0 (2026-04-24)

#### 调整
- 滚动条间距规范化，Listbox 与 QuickAction 对齐 header + scroll body 区域结构。
- 外部点击判断统一使用 `ListboxOwnerContext` 的 `triggerEl` / `anchorEl`，不再依赖 Select 私有 class，因此 Pagination 等其他 owner 也能复用同一套 Listbox。
- 默认出现 / 消失动效与 Popover、Menu 共用 opacity-only dropdown preset，移除 scale 通道。
