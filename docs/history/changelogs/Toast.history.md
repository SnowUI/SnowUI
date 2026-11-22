# Toast 更新日志归档

### v2.2.0 (2026-05-15)

#### 新增

- **内嵌模式 `as="toast"`**:Toast 作为宿主子节点(如 Button),自动发现父元素并绑定 click 事件触发,无需 id 与手动 `showToast`。遵循 [ComponentGuidelines.md §5 浮层组件三激活模式规范](../../../docs/standards/ComponentGuidelines.md)。Toast 三模式齐备:面板 / 内嵌 / 模版。
- 新增 TS-30 / TS-31 示例覆盖 Inline 模式 default / rich 变体。

### v2.1.0 (2026-05-11)

#### 修复
- Toast 可见栈任一层 hover 时暂停同位置所有可见层自动消失计时，离开 hover 后按剩余时间恢复；后层仍不显示 X。
- Toaster measure 层显式承接 `--su-motion-transform` / `--su-motion-opacity`，修复普通退场缺少位移动效的问题。
- Toaster idle 层 rich 背景曾改为不透明 `--background-1`，用于避免后层 Toast 内容透出；该历史策略已在 v2.3.0 撤回。
- 超过 `maxVisible` 时，当前最后一层 Toast 进入 `pushed-out` 状态，沿入场方向继续位移并渐隐，形成“被新层挤出”的专属退出动效。
- Toaster 移除 `document.startViewTransition` 更新包装，避免浏览器级过渡队列在动效过程中阻塞按钮连续触发。
- Toaster 将外层槽位用于堆叠 transform / opacity，内层 Frame 用于出现与退场，避免 appear/disappear transform 覆盖堆叠位移。
- 退场残影修复采用“双层 transform”方案：内层 Frame 保持 `translateY(±100%)` 的稳定退场动效，外层 slot 在 `exiting / pushed-out` 时额外平移 `index * gap + offset + 20px`，不要把 `calc(±100% ± offset ± 20px)` 写进内层 `whileDisappear`。
- 将 Toaster 堆叠槽位从普通 `div + animate:flip` 改为 `Frame/Frame`，堆叠 transform / opacity 过渡统一消费 Frame motion。
- `dismissToast()` 改为先标记 `exiting` 并进入 `Disappear` 状态，退出动效结束后再移除队列项，避免 Toast 瞬间消失。
- Frame 新增 `currentState` 受控状态入口，并让 `Appear` / `Disappear` 状态在 Frame inline motion 中实际输出动效样式。
- 默认停留时长、区域宽度、堆叠 gap、缩放系数、隐藏规则与 top/bottom 滑入滑出方向对齐 HeroUI。
- 新增通用动效原子与组合预设，不使用 Toast 专属命名：`slide` / `fade` / `scale` / `stackTranslate`；Toast 侧按需组合为 `slideFromTop` / `slideToTop` 等具体用法。

### v2.0.0 (2026-05-11)

#### 破坏性变更
- 移除 `<Toast>` 的 `title` / `description` / `icon` 三个 prop；所有文字与槽位结构改为 children 外置
- 新增 `<Toast>` 的 `positive?: boolean` prop:`true`=CheckCircle(积极)、`false`=Warning(问题)、`undefined`=不显示内置图标
- `toast()` 命令式 API 同步:`title`/`description`/`icon` → `text` + `positive`;字符串语法仍可用,等价 `{ text }`
- 移除 `ToastIconKind` 类型导出

#### 修复
- 修复 `.snowui-toast-builtin-icon` 选择器从未匹配的问题:Icon 组件 class 落在内层 `.snowui-icon` 上(不是直接子代),选择器由 `>` 改为后代;且改用 Icon 暴露的 `--snowui-icon-width/height-override` 闭环覆盖默认 1rem 尺寸 → sm/md 现在正确区分(16/20)
- 修复"外置 Icon 替换内置图标"规则失效:按 LayoutProtocol §4.1.5 重写为 `:has(~) + :has(.builtin)` 形式(对齐 SearchInput),精准命中内置 wrapper

### v1.0.0 (2026-05-10)

#### 新功能
- 初始实现：`<Toast>` 视觉单元 + `<Toaster>` 全局 Portal + `toast()` 命令式 API
- 三槽位 Leading / Content / Trailing；内置 CheckCircle / Warning 支持外置 Icon 替换
- default（深色玻璃 pill，sm / md）与 rich（白底卡片，复用 `.snowui-quick-action-panel`）两个变体
- 6 个出现位置（top / top-left / top-right / bottom / bottom-left / bottom-right），默认 top；距边缘 40px
- 自动消失（默认 3 秒）+ 同位置堆叠 + `animate:flip` 平滑前移（历史实现，已在 v2.1.0 被 Frame 槽位方案替代）
- 出入场动效使用显式组合的 `slide + fade + scale`；生命周期状态仍由 Frame 的 `Appear / Disappear` 承接
