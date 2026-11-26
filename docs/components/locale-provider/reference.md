# LocaleProvider full reference

Reviewed against Chinese source SHA-256 `8cd0df2362ffc730c2ef0d322359b71ad0f915ecad08074c1668dd935772f6fa`.

<a id="localeprovider"></a>

# LocaleProvider

<a id="组件介绍"></a>

## Overview

Set the language of built-in SnowUI interface labels for an application or subtree, with optional message overrides.

<a id="使用选择"></a>

## When to use it

Set the language or override built-in labels for descendant components. The application remains responsible for translating its own titles and data. Explicit component labels take precedence over the provider, which renders no visible wrapper.

- `locale` selects the built-in language; `messages` overrides labels in the provider subtree. Explicit component labels take precedence.
- `children` render in place without an added wrapper. The application still manages translation of its own titles and data.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { LocaleProvider, Frame, Pagination, Text } from '@snowui-design-system/components';
</script>

<LocaleProvider locale="en-US">
	<Frame column style="align-items: stretch; gap: var(--gap-2); width: min(100%, 32rem);">
		<Text weight={600}>English documentation controls</Text>
		<Pagination page={2} total={6} widthMode="hug" ariaLabel="Component documentation pages" />
	</Frame>
</LocaleProvider>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| locale | `string` | `"zh-CN"` | The current locale. Built-in locales are `zh-CN` and `en-US`; an unknown locale falls back by primary language tag, then to `zh-CN`. |
| messages | `SnowUIMessageOverrides` | `{}` | Overrides built-in message keys only in this provider subtree. |
| children | `Snippet` | — | The subtree where the current `locale` and `messages` apply. Takes no arguments; the provider adds no DOM wrapper. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="示例"></a>

<a id="示例-1"></a>

### Examples

```svelte
<LocaleProvider locale="en-US">
    <SidePanel open editable />
</LocaleProvider>
```

<a id="site-guide-locale-provider"></a>

### Site guide: locale-provider

<a id="how-localeprovider-works-overview"></a>

### How LocaleProvider works {#overview}

LocaleProvider supplies language context to descendant components. It adds no HTML wrapper, visual style, or layout of its own. Place it around the part of your application that should share a language.

It translates supported built-in messages, such as dialog close labels and color-scheme controls. Your page titles, content, and application messages remain owned by your application.

<a id="import-import"></a>

### Import {#import}

Import LocaleProvider from the Components package as shown below.

```ts
import { LocaleProvider } from '@snowui-design-system/components';
```

<a id="choose-a-language-locale"></a>

### Choose a language {#locale}

The default language is zh-CN. Set locale="en-US" for the built-in English catalog. The following color-scheme control receives its accessible label from the surrounding provider.

```svelte
<script lang="ts">
  import { ColorSchemeButton, LocaleProvider } from "@snowui-design-system/components";
</script>

<LocaleProvider locale="en-US">
  <ColorSchemeButton />
</LocaleProvider>
```

<a id="change-language-at-runtime-switch-language"></a>

### Change language at runtime {#switch-language}

Pass reactive state to locale to update supported built-in messages without recreating the provider. Store the selected language in your application if it should persist between visits.

```svelte
<script lang="ts">
  import { ColorSchemeButton, LocaleProvider } from "@snowui-design-system/components";
  let locale = $state("en-US");
</script>

<label>
  Interface language
  <select bind:value={locale}>
    <option value="en-US">English</option>
    <option value="zh-CN">Simplified Chinese</option>
  </select>
</label>

<LocaleProvider {locale}>
  <ColorSchemeButton />
</LocaleProvider>
```

<a id="customize-built-in-messages-messages"></a>

### Customize built-in messages {#messages}

Use messages to override specific catalog keys inside the provider. Omitted keys continue to use the selected language. Use the component’s explicit label property when the wording belongs to just one instance.

This example changes the two accessible labels used by ColorSchemeButton. Message keys are specific to the component; arbitrary application translation keys are not part of this catalog.

```svelte
<script lang="ts">
  import { ColorSchemeButton, LocaleProvider } from "@snowui-design-system/components";
</script>

<LocaleProvider locale="en-US" messages={{
  "colorSchemeButton.toLight": "Use light appearance",
  "colorSchemeButton.toDark": "Use dark appearance"
}}>
  <ColorSchemeButton />
</LocaleProvider>
```

<a id="scope-and-nested-providers-scope"></a>

### Scope and nested providers {#scope}

Each component reads the nearest LocaleProvider. A nested provider establishes its own locale and messages; it does not merge overrides from its parent. Declare the nested locale explicitly to make that boundary clear.

Here, the first control uses English and the second uses Chinese. Neither setting changes components outside its provider.

```svelte
<script lang="ts">
  import { ColorSchemeButton, LocaleProvider } from "@snowui-design-system/components";
</script>

<LocaleProvider locale="en-US">
  <ColorSchemeButton />
  <LocaleProvider locale="zh-CN">
    <ColorSchemeButton />
  </LocaleProvider>
</LocaleProvider>
```

<a id="overrides-and-fallbacks-fallbacks"></a>

### Overrides and fallbacks {#fallbacks}

Messages resolve in this order: an explicit component label, provider messages, the selected language catalog, the default zh-CN catalog, and finally the message key.

The current built-in catalogs are zh-CN and en-US. Resolution tries the exact locale, then a registered language-only catalog, then zh-CN. No language-only catalogs are currently registered: use en-US rather than assuming en or en-GB will resolve to English.

<a id="application-content-and-formatting-application-content"></a>

### Application content and formatting {#application-content}

LocaleProvider does not translate arbitrary children or change the document’s lang or dir attributes. Keep those attributes and your application translations in sync with the language selected by your application.

Use the documented locale and formatting options of date and number components for formatted values. This provider’s public contract covers built-in UI messages; it does not promise to reformat every date or number in the application.

<a id="next-steps-next-steps"></a>

### Next steps {#next-steps}

- [Quick Start](https://snowui.dev/components/quick-start)
- [ColorSchemeButton](../color-scheme-button.md)
- [Dialog](../dialog.md)

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
