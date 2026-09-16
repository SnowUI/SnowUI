# LocaleProvider

> **版本**: v1.0.0
> **职责**: 为后代 SnowUI 组件提供内置 UI 文案的 locale Context。

## AI Zone

- 实现位于 `components/src/components/LocaleProvider.svelte`，Context 解析复用 `../i18n/locale.svelte.ts`，完整协议见 [LocalizationSpec.md](../../../specs/LocalizationSpec.md)。
- LocaleProvider 是无视觉 Provider：不渲染 Frame、DOM 外壳或样式，不参与 LayoutProtocol / ComponentStyleSheet / Skeleton；只设置 `LOCALE_CONTEXT_KEY` 并渲染 children。
- Context 优先级：组件显式文案 Prop > `messages` > 当前 locale catalog > `zh-CN` catalog > key。
- 内置 catalog 当前含 `zh-CN` 与 `en-US`；未知 locale 先回退语言主标签，再回退 `zh-CN`。

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `locale` | `string` | `"zh-CN"` | 当前语言。 |
| `messages` | `Partial<Record<SnowUIMessageKey, string>>` | `{}` | 仅覆盖当前 Provider 子树的内置 message key。 |

## 示例

```svelte
<LocaleProvider locale="en-US">
    <SidePanel open editable />
</LocaleProvider>
```

## Changelog

- 2026-07-13 v1.0.0：新增无视觉 locale Context Provider。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 开发者关键字

| 类别 | 关键字 | 描述 |
| --- | --- | --- |
| Context Key | `LOCALE_CONTEXT_KEY` | 后代组件读取最近 locale Context 的唯一协议。 |
| Context API | `useLocale()` | 返回 `locale` 与 `t(key, values?)`。 |
| 文案覆盖 | `messages` | 只覆盖当前 Provider 子树中的内置 key。 |

### 模块索引

| 模块 | 文件 | 职责 |
| --- | --- | --- |
| LocaleProvider | [LocaleProvider.svelte](./LocaleProvider.svelte) | 设置 locale Context 并透传 children。 |
| Locale 解析 | [locale.svelte.ts](../i18n/locale.svelte.ts) | catalog 回退、插值与 Context 读取。 |
| Message catalog | [messages.ts](../i18n/messages.ts) | 内置 key、默认语言与各 locale 文案。 |

## Site guide: locale-provider

<!-- site-guide:locale-provider -->
Set the language of built-in SnowUI interface messages for an application or a specific subtree.

### How LocaleProvider works {#overview}

LocaleProvider supplies language context to descendant components. It adds no HTML wrapper, visual style, or layout of its own. Place it around the part of your application that should share a language.

It translates supported built-in messages, such as dialog close labels and color-scheme controls. Your page titles, content, and application messages remain owned by your application.

### Import {#import}

LocaleProvider is included in the open-source Components package. Follow Quick Start to install the package and load the shared stylesheet.

```ts
import { LocaleProvider } from '@snowui-design-system/components';
```

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
    <option value="zh-CN">简体中文</option>
  </select>
</label>

<LocaleProvider {locale}>
  <ColorSchemeButton />
</LocaleProvider>
```

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

### Overrides and fallbacks {#fallbacks}

Messages resolve in this order: an explicit component label, provider messages, the selected language catalog, the default zh-CN catalog, and finally the message key.

The current built-in catalogs are zh-CN and en-US. Resolution tries the exact locale, then a registered language-only catalog, then zh-CN. No language-only catalogs are currently registered: use en-US rather than assuming en or en-GB will resolve to English.

### Application content and formatting {#application-content}

LocaleProvider does not translate arbitrary children or change the document’s lang or dir attributes. Keep those attributes and your application translations in sync with the language selected by your application.

Use the documented locale and formatting options of date and number components for formatted values. This provider’s public contract covers built-in UI messages; it does not promise to reformat every date or number in the application.

### Next steps {#next-steps}

- [Quick Start](/components/quick-start)
- [ColorSchemeButton](/components/color-scheme-button)
- [Dialog](/components/dialog)

<!-- /site-guide:locale-provider -->
