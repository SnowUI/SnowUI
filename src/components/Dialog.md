# Dialog.svelte 文档

> **版本**: v1.0.0
> **职责**: 提供通用模态对话框,包含 backdrop、居中面板、焦点陷阱、滚动锁定与三种激活模式。

Dialog 是通用模态容器。面板视觉复用 `.snowui-quick-action-panel`,内容面板出现 / 消失动效使用 `MODAL_DIALOG_APPEAR_MOTION` / `MODAL_DIALOG_DISAPPEAR_MOTION`，遮罩 opacity 使用 `DIALOG_BACKDROP_APPEAR_MOTION` / `DIALOG_BACKDROP_DISAPPEAR_MOTION`。具体 duration / easing / scale 以 motion preset catalog 为准，关闭时保留面板到 disappear preset 完成后再卸载。

## 三种模式 (Modes)

| 模式 | 写法 | 说明 |
| :--- | :--- | :--- |
| 面板模式 | `<Dialog bind:open={state}>...</Dialog>` | 本地状态控制打开关闭 |
| 内嵌模式 | `<Button>打开<Dialog as="dialog">...</Dialog></Button>` | 自动绑定父元素点击触发 |
| 模版模式 | `<Dialog template id="x">...</Dialog>` + `showDialog("x")` / `data-dialog-target="x"` | 跨组件触发或多触发器共享 |

## 布局模型

主布局模型:复合管理布局。

结构:

```
Backdrop(Portal 到 body)
└── Container(视口居中)
    └── Panel Frame(.snowui-dialog .snowui-quick-action-panel)
        ├── pin-* 槽位(可选)
        └── children
```

- padding 归属:Panel 负责整体 padding。
- gap 归属:用户内容自行通过 Frame / 工具类管理。
- Pin 归属:Panel 透传 `pinOffset` / `pinOffsetX` / `pinOffsetY`,默认 `pinOffset=12`。
- 滚动归属:Panel 自身限制 `max-height`,内容溢出时面板内部滚动。

## 关键字 (Props)

| 关键字 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | `string` | — | 模版模式唯一标识 |
| `template` | `boolean` | `false` | 只注册模版,不直接显示 |
| `as` | `"dialog" \| undefined` | — | 内嵌模式标记 |
| `open` | `boolean` | `false` | 面板模式显隐,支持 `bind:open` |
| `onOpenChange` | `(open: boolean) => void` | — | 面板模式状态变化回调 |
| `backdrop` | `"opaque" \| "blur" \| "transparent"` | `"opaque"` | 遮罩层变体 |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 面板尺寸 |
| `closeOnOutside` | `boolean` | `false` | 点击 backdrop 是否关闭 |
| `closeOnEscape` | `boolean` | `true` | Escape 是否关闭 |
| `pinOffset` | `number` | `12` | Pin 统一偏移 |
| `children` | `Snippet` | — | 对话框内容 |

内部关闭按钮使用 `data-dialog-close` 声明:

```svelte
<Button data-dialog-close>取消</Button>
```

## 尺寸

| size | max-width | padding | border-radius |
| :--- | :--- | :--- | :--- |
| `sm` | `320px` | `--padding-4` | `--radius-6` |
| `md` | `448px` | `--padding-6` | `calc(--radius-4 * 2)` |
| `lg` | `640px` | `--padding-6` | `calc(--radius-4 * 2)` |

## Backdrop

| 变体 | 视觉 |
| :--- | :--- |
| `opaque` | 10% 黑色遮罩 |
| `blur` | 10% 黑色遮罩 + 20px 背景模糊 |
| `transparent` | 透明遮罩,仅阻止背景交互 |

## 无障碍

- `role="dialog"`
- `aria-modal="true"`
- 打开时焦点进入 Dialog 内第一个可聚焦元素。
- Tab / Shift+Tab 在 Dialog 内循环。
- 关闭时焦点回到触发元素。


---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## AI Zone

- 源码: `./Dialog.svelte`
- Logic: `../logic/dialog.svelte.ts`
- 主布局模型:复合管理布局,登记于 `../../../specs/LayoutProtocol.md §12.3`
- 样式覆盖入口:`--snowui-dialog-padding-override`、`--snowui-dialog-radius-override`、`--snowui-dialog-font-size-override`、`--snowui-dialog-line-height-override`、`--snowui-dialog-max-width-override`

## Changelog

- v1.0.0: 新增 Dialog 组件,实现 Panel / Inline / Template 三模式、焦点陷阱、滚动锁定和 backdrop 变体。
