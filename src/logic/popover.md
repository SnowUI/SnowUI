# popover.svelte.ts

> **版本**: v1.0.1
> **职责**: Popover 模版注册 + 命令式 API + 声明式触发委托。
> **依赖方**: [`../components/Popover.svelte`](../components/Popover.svelte)

---

## 公开 API

### 类型

| 类型 | 说明 |
| :--- | :--- |
| `PopoverPlacement` | `'top' \| 'bottom' \| 'left' \| 'right'` |
| `PopoverTrigger` | `'click' \| 'hover'` |
| `PopoverSize` | `'sm' \| 'md' \| 'lg'` |
| `PopoverCloseMode` | `'outside' \| 'manual'` |
| `PopoverTemplateConfig` | 模版配置(trigger / placement / offset / size / closeOn / closeOnEscape / closeOnSelect / content / class / style) |
| `ActivePopover` | `{ id, anchorEl }` |

### 常量

| 常量 | 值 | 说明 |
| :--- | :--- | :--- |
| `POPOVER_HOVER_SHOW_DELAY_MS` | `450` | hover 触发出现延迟,与 Tooltip 首次 hover 延迟统一 |
| `POPOVER_HOVER_CLOSE_DELAY_MS` | `80` | hover 触发关闭延迟,用于鼠标过渡到浮层本体 |

### 函数

| 函数 | 说明 |
| :--- | :--- |
| `registerPopoverTemplate(id, config)` | 注册模版;由 `<Popover template id="...">` 自动调用 |
| `unregisterPopoverTemplate(id)` | 注销模版,同时清理活跃实例与计时器 |
| `getPopoverTemplate(id)` | 获取模版配置 |
| `showPopover(id, anchorEl)` | 显示 Popover;hover 模式带 450ms 延迟 |
| `hidePopover(id)` | 关闭 Popover;hover 模式带 80ms 延迟 |
| `togglePopover(id, anchorEl)` | 切换显隐(click 触发常用),立即生效 |
| `cancelHidePopover(id)` | 取消计划中的 hide(鼠标进入浮层本体时调用) |
| `scheduleHidePopover(id)` | 调度 hover 延迟关闭(浮层本体 mouseleave 时调用) |
| `isPopoverOpen(id)` | 检查是否活跃 |
| `initPopoverDelegate()` | 初始化全局 `[data-popover-target]` 委托;模块首次 import 自动调用 |

### Store

```ts
export const popoverStore: { active: ActivePopover[] }
```

供 `<Popover template>` 订阅;新增 / 替换 / 移除元素都会触发响应式渲染。

---

## 声明式触发

任意元素加上 `data-popover-target="<id>"` 即可成为触发器:

- 模版 `trigger="click"` → click 切换显隐
- 模版 `trigger="hover"` → mouseenter 显示(450ms 延迟),mouseleave 关闭(80ms 延迟)

```svelte
<Popover template id="pop-01">...</Popover>
<Button data-popover-target="pop-01">Click</Button>
```

---

## 命令式触发(完全控制)

```svelte
<Popover template id="pop-01">...</Popover>
<Button onclick={(e) => showPopover("pop-01", e.currentTarget)}>Click</Button>
```

---

## 设计要点

- 模版注册采用模块级 `Map<id, config>`,与 Toast 模板保持一致风格
- 活跃状态采用 `$state` 数组而非 Map,便于 Svelte 5 响应式追踪
- hover 计时器按 id 维度独立管理,多个 Popover 互不干扰
- 浮层本体的 mouseenter 调用 `cancelHidePopover`,mouseleave 调用 `scheduleHidePopover`,实现"鼠标可移动到浮层"的体验

---

## 更新日志

### v1.0.0 (2026-05-15)
- 初始实现,配合 Popover.svelte v3.0.0 上线
