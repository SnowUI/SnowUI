# Dialog full reference

Reviewed against Chinese source SHA-256 `75d4aeda1f9c951838a33042b9885cba2d0065ff1aee0de2edc8d5f48fc9af66`.

<a id="dialog"></a>

# Dialog

<a id="组件介绍"></a>

## Overview

Present a focused decision or form in a modal layer with title, content, actions, and close behavior.

<a id="使用选择"></a>

## When to use it

Dialog boxes that require independent focus and close the process. Popover is used for small floating layers to anchor a button, and Tooltip is used for short tips; open combination roles are used for titles and buttons.

- Use the `bind:open` control panel; external clicks and Escape are supported by default.
- Only one Dialog stays open on a page at a time: opening a new Dialog automatically closes any open Dialog. Switch content within the same Dialog for multi-step flows; X or Escape closes the entire dialog rather than going back a step.
- By publicizing the title / content / footer / close role combination content; explicit sub-items are self-configured, and parts only affect the default title, separating line and close button.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Dialog, Button, Frame, Text } from '@snowui-design-system/components';
	let publishOpen = $state(false);
	function setPublishOpen(next: boolean) { publishOpen = next; }
</script>

<Button variant="filled" onclick={() => publishOpen = true}>Publish documentation</Button>
<Dialog
	open={publishOpen}
	onOpenChange={setPublishOpen}
	size="md"
>
	<Text as="title" tag="h2">Publish 82 component pages?</Text>
	<Frame as="content">This updates the public documentation index and makes every generated example available to visitors.</Frame>
	<Frame as="footer">
		<Button as="item" variant="outline" data-dialog-close>Cancel</Button>
		<Button as="item" variant="filled" onclick={() => publishOpen = false}>Publish</Button>
	</Frame>
</Dialog>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| id | `string` | — | The unique identification of the template mode |
| template | `boolean` | `false` | Only register the template, not directly displayed. |
| as | `"dialog" \| undefined` | — | Embedded mode mark |
| open | `boolean` | `false` | The panel mode is hidden and supports `bind:open` |
| onOpenChange | `(open: boolean) => void` | — | Panel mode status change callback |
| backdrop | `DialogBackdrop` | `"opaque"` | Masking layer variant; shared background vision with ImageViewer, shutdown and dynamic effect are still managed by Dialog. |
| size | `DialogSize` | `"md"` | Panel size |
| closeOnOutside | `boolean` | `true` | By default, click the mask outside the panel to close; false is prohibited. The blank space inside the panel is not closed. It is recommended to explicitly set the form to false if the form is not saved or the scene must be clearly selected. |
| closeOnEscape | `boolean` | `true` | Is Escape closed? |
| pinOffset | `number` | — | Offset shared by built-in and custom Pins, in px. When omitted, use the token-based default that scales with root font size: 16px for all sizes. |
| pinOffsetX | `number` | — | Cover the horizontal offset of the built-in and external Pin, which takes precedence over pinOffset. |
| pinOffsetY | `number` | — | Overlay the vertical offset of built-in and external Pin, giving priority to pinOffset |
| role | `"dialog" \| string` | `"dialog"` | The panel can access the role. |
| title | `string` | — | Generate a built-in text title; ignore this value when the external as="title" exists |
| separator | `boolean` | — | Control the dividing line below the title; do not generate the default behavior when there is no title: sm is false; md/lg is true. |
| showCloseButton | `boolean` | `true` | Whether to display the built-in close button in the upper right corner; do not hide the external close role |
| closeLabel | `string` | `locale's closing copy` | Accessible name with built-in close button |
| parts | `ComponentPartsOf<{ Button: typeof Button; Text: typeof Text; Separator: typeof Separator }>` | — | Only configure the actual built-in closed Button, title Text and Separator; it does not affect the explicit components in children/footer; the title id, children and ARIA are owned by Dialog |
| children | `Snippet` | — | The content of the dialog box |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="三种模式-modes"></a>

<a id="三种模式-modes-1"></a>

### Three modes (Modes)

| Model | Writing method | Description |
| --- | --- | --- |
| Panel mode | `<Dialog bind:open={state}>...</Dialog>` | Local status control on and off |
| Embedded mode | `<Button>Open <Dialog as="dialog">... </Dialog></Button>` | Automatically bind the parent element to click to trigger |
| Template mode | `<Dialog template id="x">...</Dialog>` + `showDialog("x")` / `data-dialog-target="x"` | Cross-component trigger or multi-trigger sharing |

<a id="单弹窗保证"></a>

<a id="单弹窗保证-1"></a>

### Single-dialog guarantee

Only one Dialog may remain open on a page at any time (SnowUI interaction rule; see `ComponentGuidelines §5.1`). When a Dialog opens in any mode, it closes other open Dialogs through their own closing path: panel mode triggers `onOpenChange(false)` and syncs `bind:open`, while embedded and template modes invoke `hideDialog`. Closing the new Dialog does not reopen the previous Dialog.

- Switch titles and body content inside the same Dialog for multi-step flows (such as continuing an action after identity confirmation) instead of stacking a second Dialog; preserve state needed from previous steps across transitions.
- Clicking X, pressing Escape, or clicking the backdrop (when `closeOnOutside` is true) at any step closes the entire Dialog rather than going back a step; provide an explicit back action inside the body when step navigation is needed.
- Callers that pass one-way `open` without handling `onOpenChange` must reset their local state to false before reopening after replacement.

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Main layout model: composite management layout.

Structure:

```text
Backdrop(portaled to body)
└── Container(centered in viewport)
    └── Panel Frame(.snowui-dialog .snowui-quick-action-panel)
        ├── pin-* slot (optional)
        ├── title Text + optional Separator
        ├── children body
        ├── footer actions
        └── built-in close button
```

- Padding attribution: Panel is responsible for the overall padding.
- Gap attribution: Panel has a built-in 12/16/24px spacing of sm/md/lg; 8px in the body and 8/12/12px in the footer.
- The title is generated by `title`, and the text is carried by `children`; the direct `as="footer"` provides the operation area, and `Button as="item"` reads the default value of the size of the operation area, and the explicit size takes priority.
- Pin Attribution: Panel transmission `pinOffset` / `pinOffsetX` / `pinOffsetY`, the default is 16px for all sizes.
- Scroll ownership: Panel caps `max-height`. When a title or close button is present (across all sizes and activation modes), the title, title separator, and close button stay fixed while only the body viewport scrolls: the built-in body wrapper for plain children, or the direct `as="content"` child when using external roles (pair an external title with `as="content"`, otherwise the Panel scrolls as a whole). The scrollbar reuses the shared overlay scrollbar along the Panel right edge, spanning only the body viewport height within the Panel top/bottom padding and appearing on hover. Without both a title and a close button, Panel-level scrolling is kept to preserve direct Pin compositions.

<a id="关键字-props"></a>

<a id="关键字-props-1"></a>

### Keywords (Props)

The closing operation of the caller uses the `data-dialog-close` declaration:

```svelte
<Button data-dialog-close>Cancel</Button>
```

<a id="尺寸"></a>

<a id="尺寸-1"></a>

### Measurement

| size | max-width | padding | border-radius | gap | Title font size/line height | Close button / icon / upper right offset | Operation area gap / Button size |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `sm` | `320px` | 16px | 20px | 12px | 16/24px，600 | 24 / 16 / 16px | 8px / sm |
| `md` | `448px` | 20px | 24px | 16px | 18/28px，600 | 36 / 20 / 16px | 12px / md |
| `lg` | `640px` | 40px | 32px | 24px | 24/32px，600 | 36 / 20 / 16px | 12px / lg |

Geometry and typesetting use rem Token, and the above is the nominal value of the root font size 16px. The title font-weight is 600; the body is unified 14/20px, and 4px text inset is added to the left and right of the title and the body; the close button distance on the panel and the right edge is 16px for all sizes. The title is reserved for the close button, and the long title can be replaced.

The close button uses the real `Button variant="borderless" iconOnly` and ComponentIcon: the color follows the default color of Button, the normal overall opacity is 0.4, hover / focus-visible restore 1; keep the default button hover background, zoom and click feedback. This is the localization of Dialog, which is clearly required by the current task, and does not change the built-in icon host rules of other components. `parts.Button` only configures the built-in close button, click to close and the accessible name is owned by Dialog. Custom icons are provided with the external as="close" Button; the built-in icon uses IconProvider, and if it is missing, it will be returned to close in the package.

```svelte
<script lang="ts">
  import { Dialog, Text, Frame, Button } from '@snowui-design-system/components';
  let open = $state(true);
</script>

<Dialog bind:open>
    <Text as="title" tag="h2">Exit editing</Text>
    <Frame as="content">Unsaved changes will be lost.</Frame>
    <Frame as="footer">
        <Button as="item" variant="outline" data-dialog-close>Cancel</Button>
        <Button as="item" variant="filled">Save</Button>
    </Frame>
</Dialog>
```

Button commands, copywriting, variants and business callbacks are owned by the caller; Dialog only provides the default size value of `as="item"` through the public Context in the operation area. The non-announced Button keeps its own default, and the explicit size takes precedence. The custom title/close button can be placed in children; the direct close role automatically replaces the built-in close button. When the title is not provided and the built-in close button is turned off, children directly enter the Panel and keep the direct Pin combination; when the title is not provided but the built-in close button is displayed, the top of the text is reserved for the close button space.

<a id="完整角色组合"></a>

<a id="完整角色组合-1"></a>

### Complete role combination

Dialog's external replacement uniformly uses `as`; title / closeIcon / footer named Snippet replacement entrance is not provided. Ordinary `title` strings can still generate default titles, and ordinary children can still carry the text.

| Role | Default and replacement behavior |
| --- | --- |
| `title` | Replace the built-in title, ignore the title string and parts.Text; restore the string title after removal. The default title layout and close button avoidance are provided by Dialog, and tags such as tag="h2" are provided by the caller. |
| `separator` | Replace the default dividing line, ignore the separator switch and parts.Separator; after removal, generate the default dividing line according to the size and separator. The thickness and other direct Props of the external Separator are controlled by the caller. |
| `content` | The explicit body container provides body typesetting and internal gap; the content and direct style are owned by the caller. |
| `footer` | The explicit operation area provides the layout and the size Context of the direct item. |
| `close` | Replace the shutdown button to take over the same shutdown behavior and positioning. |

The five characters are all single cases, and only identify the direct elements of the children rendering host; multiple characters of the same name report errors in the development environment, and only the first one is displayed. External instances do not consume parts. The native node uses data-as. The title, dividing line, body and operation area are arranged in order, and the caller should also write in this order to keep the reading consistent with the keyboard order.

When the external title exists, Dialog's aria-labelledby uses its id; it will be automatically replenished when the id is missing, and the automatically generated id will be cleaned when the role is removed, and the caller's own id will be retained. The explicit aria-label / aria-labelledby is prioritized by the caller configuration. The default dividing line is not generated when there is no title.

```svelte
<script lang="ts">
  import { Dialog, Text, Separator, Frame, Button } from '@snowui-design-system/components';
  let open = $state(true);
</script>

<Dialog bind:open>
    <Text as="title" tag="h2">Exit editing <Text>Additional information</Text></Text>
    <Separator as="separator" />
    <Frame as="content">Unsaved changes will be lost.</Frame>
    <Frame as="footer">
        <Button as="item" variant="outline" data-dialog-close>Cancel</Button>
        <Button as="item" variant="filled">Save</Button>
    </Frame>
    <Button as="close" variant="borderless" iconOnly size="md" aria-label="Close">
        Close
    </Button>
</Dialog>
```

<a id="底部操作区角色"></a>

<a id="底部操作区角色-1"></a>

### The role of the bottom operation area

Declare the action area as a direct `<Frame as="footer">` child, or use `data-as="footer"` on a native element. Dialog supplies right alignment, vertical centering, wrapping, and preferred sm/md/lg gaps of 8/12/12px. Keep at least 4 CSS px between actions; larger `--snowui-dialog-footer-gap-override` values remain effective. Direct Props and inline styles can override the layout and do not consume parts. The footer and body blocks retain the panel gap of 12/16/24px; wrap multiple body blocks in a separate container when an internal 8px gap is needed.

Only the direct `Button as="item"` of the operation area receives sm/md/lg size Context, and the explicit size takes priority; the button content, variant, business events and nested layout are still owned by the caller. The item in the text and nested Frame that has not been contracted does not receive this default value.

The footer is a single case, the identification range is the same as close, and the nested container is not scanned. Multiple direct footers reported errors in the development environment, and only the first one was displayed. No empty operation area will be generated after removing the footer. The button behavior is always generated by the real button, and the role itself does not inject confirmation or cancellation events.

<a id="外置关闭按钮替换"></a>

<a id="外置关闭按钮替换-1"></a>

### External shutdown button replacement

A direct child with `as="close"` (rendered as `data-as="close"`) replaces the built-in close button automatically; no `showCloseButton={false}` or `data-dialog-close` is needed. It shares the built-in button’s panel anchor and `pinOffsetX`/`pinOffsetY`. The internal text wrapper only handles typography. Detection examines direct elements in the children host, not descendants nested inside Frame, footer, or title.

```svelte
<Dialog title="Custom content">
    <Button as="close" variant="borderless" iconOnly size="md" aria-label="Close">
        <Close size={20} />
    </Button>
    Body content
</Dialog>
```

The variant, size, color, opacity, Icon and accessible name of the external button are directly configured by the caller and do not inherit parts.Button; Dialog only has role positioning, replacement and shutdown behaviors. The external button click or keyboard activation goes to the same close link, and the event preventDefault() can prevent the role from closing. Disabled / aria-disabled="true" is not closed. The external role takes precedence over showCloseButton; after removing the external role, press the showCloseButton to restore the built-in button. Nested characters of the same name do not participate in replacement.

This role is a single case: multiple direct external roles report errors in the development environment, and only the first one is displayed and used in production. Icons are also provided through the sub-content in this role.

<a id="backdrop"></a>

<a id="backdrop-1"></a>

### Backdrop

| Variation | Vision |
| --- | --- |
| `opaque` | 10% black mask |
| `blur` | 10% black mask + 20px background blur |
| `transparent` | Transparent mask, only blocking background interaction |

Dialog displays its backdrop and panel at full opacity immediately on opening, so the panel and blur backdrop are blurred from the first visible frame. The backdrop uses the Dialog preset to fade out on close. Reduced-motion preferences show and hide it immediately.

<a id="无障碍"></a>

<a id="无障碍-1"></a>

### Barrier-free

- `role="dialog"`
- `aria-modal="true"`
- When opened, the focus enters the first focusable element in the Dialog.
- Tab / Shift+Tab loops in the Dialog.
- When closed, the focus returns to the trigger element. The inline mode will locate the actual interaction host through the content wrapping layer of the Button, and return the focus to the button or link after closing.

---

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
