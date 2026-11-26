# AccordionItem full reference

Reviewed against Chinese source SHA-256 `03754d432119d73116527d2ec37309aa8466ed0ef9d4d51c90934fcc625b1457`.

<a id="accordionitem"></a>

# AccordionItem

<a id="组件介绍"></a>

## Overview

Defines one collapsible item inside Accordion, pairing its title and content while the parent manages expansion state.

<a id="使用选择"></a>

## When to use it

Use it as one expandable item in an Accordion. The parent coordinates expansion; AccordionItem is not a standalone page container.

- Give each item a unique `value` within its parent Accordion. Accordion manages the expanded state.
- Use direct `Frame as="title"` and `Frame as="content"` children for the title and body. A direct `as="trailing"` child inside the title can replace the expand icon.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Accordion, AccordionItem, Frame, Icon, Link, Text } from '@snowui-design-system/components';
	import { BookOpen, Code, Package, Palette, ShieldCheck } from '@snowui-design-system/resource-svelte';
</script>

<Accordion defaultValue="installation" style="width: min(100%, 36rem);">
	<AccordionItem value="installation">
		<Frame as="title" singleLine><Icon as="leading"><Package /></Icon><Text lines={1}>Install the component package</Text></Frame>
		<Frame as="content" column><Text>Add Components and Resource packages with your package manager.</Text><Link variant="arrow" href="/components/quick-start">Open Quick Start</Link></Frame>
	</AccordionItem>
	<AccordionItem value="catalog"><Frame as="title" singleLine><Icon as="leading"><BookOpen /></Icon><Text lines={1}>Explore the component catalog</Text></Frame><Frame as="content" row>Review live previews, public APIs, and copy-ready examples for every component.</Frame></AccordionItem>
	<AccordionItem value="themes"><Frame as="title" singleLine><Icon as="leading"><Palette /></Icon><Text lines={1}>Apply a SnowUI theme</Text></Frame><Frame as="content" row>Use the shared semantic color contract across light and dark interfaces.</Frame></AccordionItem>
	<AccordionItem value="compose"><Frame as="title" singleLine><Icon as="leading"><Code /></Icon><Text lines={1}>Compose title and content slots</Text></Frame><Frame as="content" row>Build each item with title and content Frames, including optional leading or trailing content.</Frame></AccordionItem>
	<AccordionItem value="quality"><Frame as="title" singleLine><Icon as="leading"><ShieldCheck /></Icon><Text lines={1}>Verify interaction quality</Text></Frame><Frame as="content" row>Confirm keyboard control, focus state, motion, and responsive layout in the browser.</Frame></AccordionItem>
</Accordion>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| value | `string` | `— (required)` | A stable identifier for this item. It must be unique within the same Accordion and match the parent `value` / `defaultValue`; it is not an independently bindable expanded boolean. |
| disabled | `boolean` | `false` | Disables interaction on this item’s title and content. A disabled parent Accordion also disables the item; setting this Prop to `false` cannot override the parent. |
| children | `Snippet` | — | Declare direct `Frame as="title"` and `Frame as="content"` children. A direct `as="trailing"` child in the title can replace the default expand icon. Use AccordionItem only inside Accordion. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="api-参考"></a>

<a id="api-参考-1"></a>

### API reference

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `never` | - | Not supported. Only the parent Accordion controls item size. |
| `...rest` | `FrameProps` | - | Passed through to the internal root Frame. |

`AccordionItem` does not set its own size. Its font size, line height, padding, radius, and built-in icon size inherit the variables produced by the parent `Accordion size`. `value` only matches the parent `value` / `defaultValue` to determine expansion.

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Primary layout model: **one child item within a parent-managed composite layout**.

- The outer root is `Frame tag="div" column`; it owns the item background, radius, dividers, and expanded state.
- A direct `Frame as="title" row` child is the title trigger and always uses three slots. Direct `as="leading"`, ordinary content, and direct `as="trailing"` children occupy those slots.
- A direct `Frame as="content" row` child is the content region and also uses three slots. During collapse it keeps its width while its height contracts downward and its opacity fades out.
- The title inherits the parent Accordion or container `color`; content defaults to the parent Accordion’s `--snowui-accordion-content-color`, using theme-aware `Black/100%`.
- By default, ComponentIcon renders a plus icon that rotates 45° into an × when expanded. The parent Accordion’s `indicatorVariant="minus"` keeps the plus/minus replacement and half-turn motion. An explicit trailing child takes precedence.
- There is no hover background. By default, only the indicator icon changes color on title hover.
- Only the title toggles expansion; clicking the content does not collapse it. By default, the content uses the same font size and line height as the title at every size.

<a id="样式变量链"></a>

<a id="样式变量链-1"></a>

### Style variable chain

| Variable | Default | Use |
| --- | --- | --- |
| `--snowui-accordion-item-content-block-size-override` | `--snowui-accordion-content-max-block-size-override` / measured height | Per-item override for the maximum expanded content height |
| `--snowui-accordion-content-color-override` | `var(--black-100)` | Locally overrides content text color without affecting the title |

<a id="使用示例"></a>

<a id="使用示例-1"></a>

### Usage examples

```svelte
<Accordion defaultValue="profile">
    <AccordionItem value="profile">
        <Frame as="title" singleLine>
            <Text lines={1}>Profile</Text>
            <Icon as="trailing"><Resource.Plus /></Icon>
        </Frame>
        <Frame as="content" row>Profile content</Frame>
    </AccordionItem>
</Accordion>
```

---

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
