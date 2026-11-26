# OverflowActions API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `OverflowActionsItem[]` | [] | Built-in actions and separators with unique IDs. Actions support label, icon, disabled, href, target, rel, onAction, buttonProps, and parts; explicit children replace these items. |
| `compact` | `"auto" \| "none"` | "auto" | auto hides every action label together before moving actions, if width is short and all actions have both icon and label. none skips label hiding and moves actions according to overflow. |
| `overflow` | `"all" \| "progressive"` | — | all moves every action into More when they do not fit. progressive moves actions one by one according to overflowFrom and keeps those that fit. Layout is frozen while the menu is open. |
| `overflowFrom` | `"start" \| "end"` | "end" | In progressive mode, move actions from the start or end of data or composition order. all mode does not distinguish direction. |
| `availableWidth` | `number` | — | Externally supplied width in pixels for the action group. Disables its own size observation; useful when DataTable provides a column width. |
| `maxVisible` | `number` | — | Maximum directly visible actions, excluding More and separators; omitted or non-finite means no limit. Finite values are floored and clamped to zero. Width can overflow more actions; an open menu freezes layout. |
| `moreLabel` | `string` | — | Accessible name of the More button. Defaults to a LocaleProvider message. |
| `align` | `"start" \| "end"` | "end" | Horizontal alignment of the Listbox menu. |
| `disabled` | `boolean` | false | Disable all actions. |
| `tooltip` | `boolean` | — | Group-level default tooltip toggle for child OverflowAction items and the overflow More button. Disabled by default; when enabled, propagates through context to items and descendant Button controls while explicit item or child tooltip props take priority. |
| `buttonProps` | `GlobalButtonProps` | — | Shared default Button Props for actions, More, and hidden measurement copies. Supports variant, size, bare, emphasis, class, and style. The group owns content, role, click, link, disabled, and name fields. |
| `children` | `Snippet` | — | Direct OverflowAction as="item" and Separator as="separator" children in place of items data. Structural separators are not independent overflow candidates. |
| `parts` | `Parts` | — | Configure generated Button, SelectButton, Listbox, MenuItem, Separator, and Tooltip. More uses parts.SelectButton ahead of group-level parts.Button, and parts.Tooltip propagates to items and the More button; the public Parts contract defines the full precedence. |
| `onAction` | `(event: OverflowActionsActionEvent) => void` | — | Called after an action with stable id, source (button or menu), matching built-in item when available, and optional original mouse event. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
