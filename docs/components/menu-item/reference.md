# MenuItem full reference

Reviewed against Chinese source SHA-256 `5700e75dbbaa9eb90f76094d00ca40a23d4a310ee10b9a3a694ad15ce3145a51`.

<a id="menuitem"></a>

# MenuItem

<a id="组件介绍"></a>

## Overview

Present an option in a list or shortcut panel with optional icon, selection state, and disabled feedback.

<a id="使用选择"></a>

## When to use it

Use MenuItem for options in Listbox. Use Link or SidebarItem for ordinary navigation; content rows need not all be selectable.

- Use `as="item"` inside Listbox and give each option a unique value within that list.
- Disabled prohibits operation; leading / trailing places attachments, closeOnSelect decides whether to close the panel after selection.
- The built-in action for deleting a custom option follows LocaleProvider. Query text, option names, and values remain unchanged; the owning Listbox still manages deletion.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { MenuItem, Popover, Icon, Text } from '@snowui-design-system/components';
	import { Copy, Check, ArrowCounterClockwise, Upload } from '@snowui-design-system/resource-svelte';
</script>

<Popover size="sm" style="width: min(100%, 22rem);">
    <MenuItem><Icon as="leading"><Copy /></Icon><Text lines={1}>Duplicate example</Text></MenuItem>
    <MenuItem><Icon as="leading"><Check /></Icon><Text lines={1}>Mark reviewed</Text></MenuItem>
    <MenuItem><Icon as="leading"><ArrowCounterClockwise /></Icon><Text lines={1}>Reset sample</Text></MenuItem>
    <MenuItem disabled><Icon as="leading"><Upload /></Icon><Text lines={1}>Publish · owner only</Text></MenuItem>
</Popover>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| parts | `ComponentPartsOf<{ Button: typeof Button }>` | — | Configure public props, such as size, class, or style, on the built-in delete button. MenuItem still controls deletion, the accessible name, and the role. |
| singleLine | `boolean` | `true` | Ordinary menu labels use the shared Frame single-line preset, preserving Hug attachments and at least 4 CSS px spacing. Complex multiline children can explicitly set false and keep their own layout owner. Use Text lines=1 for label truncation and full-text access. |
| value | `string` | — | Option value (required when accessing Listbox through as="item" and unique in the same list; as the business identification of the selection intention event when used independently) |
| selected | `boolean` | `false` | Whether selected (valid for independent use; overwritten by the host after using as="item" to access Listbox) |
| active | `boolean` | `false` | Whether highlighted (valid when used independently; covered by the host after using as="item" to access Listbox) |
| disabled | `boolean` | `false` | Disable the item, apply 0.2 opacity, and block clicks. |
| showCheck | `boolean` | — | Whether to render trailing check the slot; when not set, only the independent `selected` item is turned on by default, Listbox is turned off by default, and Select is turned on by default. |
| closeOnSelect | `boolean` | — | Whether to request the parent floating layer to close after clicking; if it is not set, the default strategy is determined by the parent floating layer. |
| children | `Snippet` | — | The content of the operation item without parameters; the direct `as="leading"` / `as="trailing"` sub-item will participate in the root-level three-slot layout |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="关键字-props"></a>

<a id="关键字-props-1"></a>

### Keywords (Props)

Inherit `FrameProps` (excluding `children` / `tag`).

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| `onclick` | `function` | — | Receive MouseEvent; triggered when not disabled and not connected to Listbox with as="item", the return value is ignored. Calling preventDefault or stopPropagation can prevent subsequent selection intention distribution; the selection in Listbox is taken over by the host. |
| `class` | `string` | `""` | Custom CSS class name |
| `enableAutoLayout` | `boolean` | `true` | Internal auto layout stays enabled; passing `enableAutoLayout={false}` does not disable MenuItem’s three-slot layout. |
| `enableResponsive` | `boolean` | `false` | Whether to turn on responsive listening |
| `enableContext` | `boolean` | `true` | Whether to participate in the context capability network |
| `enableScaleObserver` | `boolean` | `false` | Whether to turn on the runtime size observation |

---

<a id="场景行为"></a>

<a id="场景行为-1"></a>

### Scene behavior

| Scene | padding | Status source | Registration |
| --- | --- | --- | --- |
| **Inside Listbox** (with `ListboxOwnerContext`) | 8px | Context derived | Register on mount and unregister on unmount. |
| **Popover inside / independent use** | 8px | `selected` / `active` Props | None |

After clicking the undisabled `MenuItem`, the `snowui-menu-item-select` selection intention event will be distributed, and the event carries `value` and the optional `closeOnSelect`. `MenuItem` itself does not decide whether the parent floating layer is closed; floating layer containers such as `Popover` are processed according to their own default policies, and a single `MenuItem closeOnSelect={...} ` The default value of the container can be overwritten. `Listbox` is still managed by its own selection protocol to close the behavior.

---

<a id="架构"></a>

<a id="布局模型"></a>

### Layout model

Main layout model: **slot host layout**. See `docs/standards/LayoutProtocol.md` §12.3.

The root layout of MenuItem is fixed according to the three sections of Leading / Label / Trailing:

- The root uses `Frame row singleLine` and always enables its internal auto-layout protocol. Passing enableAutoLayout=false does not disable the three-slot MenuItem layout.
- Plain text or `.snowui-menu-item-label` is a Content / Fill slot, which is responsible for truncation, and must keep `min-width: 0`.
- Direct `as="leading"` and `as="trailing"` children support complex structures; Leading and Trailing hug their contents.
- When `showCheck` is enabled, the default check or delete control occupies Trailing/Hug. When disabled, no check slot or gap remains. A custom direct trailing child hides the default check.
- Listbox status registration, filter hiding and Popover independent status are MenuItem behavior protocols, which do not change the root three-slot layout.

---

<a id="使用示例"></a>

<a id="在-popover-中独立-props-控制"></a>

### In Popover (independent Props control)

```svelte
<Popover>
    <MenuItem onclick={() => alert('Notifications')}>
        <Icon as="leading"><Bell /></Icon>
        Notifications
    </MenuItem>
    <MenuItem selected>
        <Icon as="leading"><Bell /></Icon>
        Selected item
    </MenuItem>
    <MenuItem disabled>
        <Icon as="leading"><Bell /></Icon>
        Disabled item
    </MenuItem>
</Popover>
```

<a id="复合-leading-trailing"></a>

### Compound leading / trailing

```svelte
<Popover>
    <MenuItem>
        <Frame as="leading" singleLine>
            <Icon icon={Tag} />
            <Text lines={1}>Tags</Text>
        </Frame>
        <Frame as="trailing" singleLine>
            <Text lines={1}>Multi-Select</Text>
            <Icon icon={CaretRight} />
        </Frame>
    </MenuItem>
</Popover>
```

<a id="在-listbox-中context-自动接管"></a>

### In Listbox (context automatic takeover)

```svelte
<Select placeholder="Select a city">
    <Listbox>
        <MenuItem value="shanghai">Shanghai</MenuItem>
        <MenuItem value="beijing">Beijing</MenuItem>
        <MenuItem value="hangzhou">Hangzhou</MenuItem>
    </Listbox>
</Select>
```

---

<a id="连续-hover-宿主"></a>

<a id="连续-hover-宿主-1"></a>

### Continuous Hover host

In a Listbox or Popover with continuous hover, the host’s single background layer renders MenuItem hover. Standalone items, or hosts with `continuousHover={false}`, use their own immediate background. An explicit `active` background persists; hovering an active item layers the host background over it and darkens it.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
