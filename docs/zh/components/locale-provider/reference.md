# LocaleProvider

> **版本**: v1.0.0
> **职责**: 为应用或局部区域统一设置 SnowUI 内置界面文案的语言，支持按需覆盖消息内容。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

为应用或局部区域统一设置 SnowUI 内置界面文案的语言，支持按需覆盖消息内容。

## 使用选择


为后代组件设置内置文案语言或局部消息覆盖；业务标题和数据仍由应用处理。组件显式文案优先于 Provider，Provider 不产生可见外壳。

- locale 选择内置语言，messages 覆盖局部组件文案；组件显式文案优先。
- children 在原位置渲染，Provider 不增加外壳；业务标题、数据翻译仍由应用管理。


## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。


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


## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| locale | `string` | `"zh-CN"` | 当前语言标识；内置 zh-CN、en-US，未知语言按语言主标签再回退 zh-CN。 |
| messages | `SnowUIMessageOverrides` | `{}` | 仅覆盖当前 Provider 子树的内置 message key。 |
| children | `Snippet` | — | 当前 locale 和 messages 生效的子树，无参数；Provider 不添加 DOM 外壳。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="示例"></a>

### 示例

```svelte
<LocaleProvider locale="en-US">
    <SidePanel open editable />
</LocaleProvider>
```

### Site guide: locale-provider



### How LocaleProvider works {#overview}

LocaleProvider supplies language context to descendant components. It adds no HTML wrapper, visual style, or layout of its own. Place it around the part of your application that should share a language.

It translates supported built-in messages, such as dialog close labels and color-scheme controls. Your page titles, content, and application messages remain owned by your application.

### Import {#import}

Import LocaleProvider from the Components package as shown below.

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

- [Quick Start](https://snowui.dev/components/quick-start)
- [ColorSchemeButton](../color-scheme-button.md)
- [Dialog](../dialog.md)
