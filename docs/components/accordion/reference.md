# Accordion full reference

Reviewed against Chinese source SHA-256 `3a8ddf29545ab97cb4db679bf153ac73df0ba540f0e50e7ec93975065d5ff97c`.

<a id="accordion"></a>

# Accordion

<a id="组件介绍"></a>

## Overview

Expand or collapse content sections to scan dense information while keeping the page compact.

<a id="使用选择"></a>

## When to use it

Suitable for FAQ, setting grouping and foldable instructions. Use Tab when you need to switch the content panel of the same area; AccordionItem should be placed in Accordion.

- `type="single"` uses string values, `multiple` uses arrays; `bind:value` expands items synchronously, and `defaultValue` only provides the initial state.
- items mode uses stringified indices as values. Generated titles truncate on one line while retaining their complete accessible name; parts.Text configures that title text. Explicit children replace items and configure themselves rather than reading generated-child parts.
- The `Icon as="leading"` in Accordion inherits the Accordion icon size when `size` is not explicitly specified: sm/md/lg are 16/20/24 respectively; Icon that does not declare leading does not participate in this inheritance, and the explicit `size` takes precedence.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Accordion, AccordionItem, Frame, Icon, Text } from '@snowui-design-system/components';
	import { BookOpen, Package, Palette, Rocket, ShieldCheck } from '@snowui-design-system/resource-svelte';
</script>

<Accordion type="multiple" defaultValue={['installation', 'themes']} variant="filled" size="md" style="width: min(100%, 36rem);">
	<AccordionItem value="installation">
		<Frame as="title" singleLine><Icon as="leading"><Package /></Icon><Text lines={1}>How do I install SnowUI?</Text></Frame>
		<Frame as="content" row>Install @snowui-design-system/components and import its styles. The Resource package is optional for examples that use its icons.</Frame>
	</AccordionItem>
	<AccordionItem value="components">
		<Frame as="title" singleLine><Icon as="leading"><BookOpen /></Icon><Text lines={1}>Where can I explore every component?</Text></Frame>
		<Frame as="content" row>Open the Components catalog for live previews, copy-ready code, API details, and source links.</Frame>
	</AccordionItem>
	<AccordionItem value="themes">
		<Frame as="title" singleLine><Icon as="leading"><Palette /></Icon><Text lines={1}>Does SnowUI support light and dark themes?</Text></Frame>
		<Frame as="content" row>Yes. Components use the same semantic theme contract in applications and isolated documentation previews.</Frame>
	</AccordionItem>
	<AccordionItem value="quality">
		<Frame as="title" singleLine><Icon as="leading"><ShieldCheck /></Icon><Text lines={1}>How are components verified?</Text></Frame>
		<Frame as="content" row>Public behavior is checked with type validation, accessibility coverage, and real browser previews.</Frame>
	</AccordionItem>
	<AccordionItem value="pro">
		<Frame as="title" singleLine><Icon as="leading"><Rocket /></Icon><Text lines={1}>How can I customize a component?</Text></Frame>
		<Frame as="content" row>Use public properties to choose a suitable appearance and adapt it to your interface.</Frame>
	</AccordionItem>
</Accordion>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| type | `AccordionType` | `"single"` | Single can only expand one item at a time; multiple can expand multiple at the same time. Determine the value form of value/defaultValue and onValueChange. |
| value | `AccordionValue` | — | The current expansion value supports bind:value; it takes precedence over the internal state. Single uses strings, multiple uses arrays; single empty string means all are put away. |
| defaultValue | `AccordionValue` | — | Uncontrolled initial expansion value; only read when initializing the internal state, value takes precedence. The items mode uses the index string, and the explicit AccordionItem uses its value. |
| collapsible | `boolean` | `true` | In the single-open mode, click whether the expanded item is allowed to be closed. |
| variant | `AccordionVariant` | `"filled"` | Filled is an independent folded item with a background; divided uses a dividing line between items. The two share the deployment status and interaction. |
| size | `AccordionSize` | — | Dimensional density; explicit value takes precedence, followed by the parent size context, and then md. Control the title, body, spacing and sub-item size in a unified way. |
| disabled | `boolean` | `false` | Disable the entire Accordion. |
| continuousHover | `boolean` | `false` | It has been abandoned, and only the call compatibility is reserved; any value no longer shows the hover background. |
| indicatorVariant | `"cross" \| "minus"` | `"cross"` | Cross uses the same plus sign to rotate 45° to become ×; minus keeps the plus sign/minus sign switching and half-circle rotation. Custom trailing replaces the default icon. |
| role | `string` | `"presentation"` | The ARIA role of the root container; by default, it is only grouped for display, and the semantics of the title trigger and content region are still managed by AccordionItem. |
| items | `AccordionEntry[]` | `[]` | Default built-in mode data; internal value uses array index strings. |
| children | `Snippet` | — | Explicit combination of content; replace built-in items when existing. |
| parts | `ComponentPartsOf<{ AccordionItem: typeof AccordionItem; Frame: typeof Frame; Text: typeof Text; }>` | — | Configure generated AccordionItem, title/body Frames and title Text in items mode. Explicit children do not read this generated-child configuration. |
| onValueChange | `(value: AccordionValue) => void` | — | The user switches the expanded item back; single returns the current item string (empty string when all are closed), and multiple returns the expanded item array. It can be combined with bind:value to synchronize the page status. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="功能概览"></a>

<a id="功能概览-1"></a>

### Feature overview

- The built-in mode renders items containing title and content strings. It generates AccordionItem, Frame as="title|content" and title Text. Titles use singleLine and Text lines={1} by default; bodies are not forced onto one line. Configure them through parts.Frame / parts.Text, and prefer explicit composition for complex content.
- Replace the built-in items when explicit children exist, which is used to customize the AccordionItem structure.
- Support single opening and multi-opening modes.
- Support uncontrolled `defaultValue` and controlled `value`.
- Support `variant="filled" | "divided"` two visual forms.
- Support `size="sm" | "md" | "lg"` three-speed density.
- Expanded content defaults to theme-aware `Black/100%`; the title continues to inherit the host foreground color.
- Hover does not display the background, only changes the color of the default indicator icon in the title.
- Only the title can be clicked to expand or close; the body text, blank space and interactive descendants do not trigger switching.
- By default, `indicatorVariant="cross"` reuses the same ComponentIcon plus, and only rotates 45° to get ×; `indicatorVariant="minus"` retains the old plus/minus switch and half-circle rotation. External trailing continues to replace the default icon.

---

<a id="api-参考"></a>

<a id="核心属性"></a>

### Core attributes

The value of the default built-in mode is an array index string, for example, `defaultValue="1"` expands the second item by default. The explicit combination mode still uses the stable value declared by AccordionItem itself. The size is only controlled by `Accordion size`, and `AccordionItem` does not provide independent size attributes.

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Main layout model: **composite management layout**. See the definition.. /.. /../docs/standards/LayoutProtocol.md §12.6.

Structure:

- Root Frame (composite container, providing AccordionContext)
  - AccordionItem (single container, responsible for background, rounded corners, separating lines and unfolding status)
    - Frame as="title" (title trigger)
    - Frame as="content" (expand content region)

Source of local layout:

| Region | Source of layout |
| --- | --- |
| Root | Frame column; container unified management item spacing |
| Item | AccordionItem outer layer `Frame column`; carries the whole item background, rounded corners, separating lines |
| Title | Direct `Frame as="title" row`; Leading / Content / Trailing three slots |
| Content | Direct `Frame as="content" row`; Leading / Content / Trailing three slots |

Padding belongs to: `Frame as="title"` is responsible for the clickable area padding; `Frame as="content"` is responsible for the body padding, Root does not repeat the production of outer padding. Gap attribution: Root manages sub-item spacing through `--snowui-accordion-gap`; Title and Content internal slot spacing is managed by `--snowui-accordion-trigger-gap`. Scrolling attribution: Accordion itself does not create a scrolling area.

Hover attribution: title hover only changes the transparency of the default indication icon, does not create a shared background layer, and does not enable title hover overlay.

Design draft mapping:

| variant / size | Title padding | Content padding | Radius | Gap |
| --- | --- | --- | --- | --- |
| `divided sm` | `8px 8px` | `8px 8px` | `0` | `0` |
| `divided md` | `12px 8px` | `12px 8px` | `0` | `0` |
| `divided lg` | `16px 8px` | `16px 8px` | `0` | `0` |
| `filled sm` | `8px 12px` | `8px 12px` | `12px` | `4px` |
| `filled md` | `12px 16px` | `12px 16px` | `16px` | `4px` |
| `filled lg` | `16px 20px` | `16px 20px` | `24px` | `4px` |

<a id="样式变量链"></a>

<a id="样式变量链-1"></a>

### Style variable chain

See the Accordion section of components.css for the public coverage entrance.

<a id="无障碍"></a>

<a id="无障碍-1"></a>

### Barrier-free

- The root node outputs `role`, and the default is `presentation`; the consumer can be overwritten by `role`.
- `Frame as="title"` is taken over by AccordionItem by button-like semantics, and outputs `role="button"`, `tabindex`, `aria-expanded`, `aria-controls`.
- Title output `aria-expanded`, `aria-controls`.
- Content output `role="region"` and `aria-labelledby`.
- Disable Title output `aria-disabled="true"` and remove it from the tab order.
- The semantics of pointer and keyboard switching only belong to Title; the click of body text, blank space and interactive controls does not change the expansion state.

<a id="使用示例"></a>

<a id="使用示例-1"></a>

### Usage examples

```svelte
<Accordion
    defaultValue="0"
    items={[
        { title: "Basic settings", content: "Basic content." },
        { title: "Advanced settings", content: "Advanced content." },
    ]}
/>

<Accordion defaultValue="basic">
    <AccordionItem value="basic">
        <Frame as="title" singleLine>
            <Text lines={1}>Basic settings</Text>
        </Frame>
        <Frame as="content" row>Basic content.</Frame>
    </AccordionItem>

    <AccordionItem value="advanced">
        <Frame as="title" singleLine>
            <Text lines={1}>Advanced settings</Text>
            <Icon as="trailing"><Resource.Plus /></Icon>
        </Frame>
        <Frame as="content" row>An external trailing icon replaces the default arrow.</Frame>
    </AccordionItem>
</Accordion>
```

---

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
