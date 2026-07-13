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
