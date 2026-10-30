# LocaleProvider

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.0.0
> **职责**: 为应用或局部区域统一设置 SnowUI 内置界面文案的语言，支持按需覆盖消息内容。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

为应用或局部区域统一设置 SnowUI 内置界面文案的语言，支持按需覆盖消息内容。

## 使用选择

<!-- usage-guide:start -->
为后代组件设置内置文案语言或局部消息覆盖；业务标题和数据仍由应用处理。组件显式文案优先于 Provider，Provider 不产生可见外壳。

- locale 选择内置语言，messages 覆盖局部组件文案；组件显式文案优先。
- children 在原位置渲染，Provider 不增加外壳；业务标题、数据翻译仍由应用管理。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
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
<!-- /quick-start:generated -->

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

## Site guide: locale-provider

<!-- site-guide:locale-provider -->

### How LocaleProvider works {#overview}

LocaleProvider supplies language context to descendant components. It adds no HTML wrapper, visual style, or layout of its own. Place it around the part of your application that should share a language.

It translates supported built-in messages, such as dialog close labels and color-scheme controls. Your page titles, content, and application messages remain owned by your application.

### Import {#import}

LocaleProvider is included in the publicly downloadable Components package under the SnowUI license. Follow Quick Start to install the package and load the shared stylesheet.

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

## AI Zone

<a id="ai-zone"></a>

### AI Zone

- 实现位于 `components/src/components/LocaleProvider.svelte`，Context 解析复用 `../i18n/locale.svelte.ts`，完整协议见 [LocalizationSpec.md](../../../docs/standards/LocalizationSpec.md)。
- LocaleProvider 是无视觉 Provider：不渲染 Frame、DOM 外壳或样式，不参与 LayoutProtocol / ComponentStyleSheet / Skeleton；只设置 `LOCALE_CONTEXT_KEY` 并渲染 children。
- Context 优先级：组件显式文案 Prop > `messages` > 当前 locale catalog > `zh-CN` catalog > key。
- 内置 catalog 当前含 `zh-CN` 与 `en-US`；未知 locale 先回退语言主标签，再回退 `zh-CN`。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 开发者关键字

| 类别 | 关键字 | 描述 |
| --- | --- | --- |
| Context Key | `LOCALE_CONTEXT_KEY` | 后代组件读取最近 locale Context 的唯一协议。 |
| Context API | `useLocale()` | 返回 `locale` 与 `t(key, values?)`。 |
| 文案覆盖 | `messages` | 只覆盖当前 Provider 子树中的内置 key。 |

### 模块索引

| 模块 | 文件 | 职责 |
| --- | --- | --- |
| LocaleProvider | [LocaleProvider.svelte](LocaleProvider.svelte) | 设置 locale Context 并透传 children。 |
| Locale 解析 | [locale.svelte.ts](../i18n/locale.svelte.ts) | catalog 回退、插值与 Context 读取。 |
| Message catalog | [messages.ts](../i18n/messages.ts) | 内置 key、默认语言与各 locale 文案。 |

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- 2026-07-13 v1.0.0：新增无视觉 locale Context Provider。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**
