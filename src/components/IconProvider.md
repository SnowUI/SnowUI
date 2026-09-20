# IconProvider

> **版本**: v1.0.0
> **职责**: 为 SnowUI 组件自己拥有的内置功能图标提供应用级图标库替换，同时保留 Components 随包默认回退。

## 组件介绍

为应用或局部区域统一替换 SnowUI 内置功能图标，未配置的图标继续使用组件默认样式。

## 概览与选择边界

`IconProvider` 是无视觉 Context Provider。没有 Provider 时，组件使用 Components 包内置的默认功能图标；提供 `icons` 或 `resolver` 后，未被组件实例 Snippet / 具名角色明确替换的内置图标会在当前子树统一改用外部图标库。

它不接管调用方显式书写的 `<Icon>`、资源图标或普通 children。需要替换单个组件实例时，继续使用该组件公开的 Icon Snippet 或具名角色；需要整棵应用切换图标库时使用本组件。

## Import

```svelte
<script lang="ts">
    import { IconProvider } from "@snowui-design-system/components";
</script>
```

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `icons` | `Record<string, Component>` | `{}` | 稳定语义名到外部 Svelte 图标组件的映射 |
| `resolver` | `(request) => Component \| undefined` | — | 按 `{ name, weight }` 解析图标；优先于同层 `icons` |
| `children` | `Snippet` | — | 原样渲染的子树 |

同层解析顺序为 `resolver → icons`；未命中时继续查询外层 Provider，最后由组件内置默认图标回退。切换 `resolver` 或 `icons` Prop 会更新当前子树。外部图标组件接收 `size`、`color`、`weight`、`class`、`data-as` 和 ARIA 等标准化渲染参数。

## 示例

```svelte
<script lang="ts">
    import { IconProvider, CopyButton } from "@snowui-design-system/components";
    import { Copy, Check } from "my-icon-library";

    const appIcons = { copy: Copy, check: Check };
</script>

<IconProvider icons={appIcons}>
    <CopyButton text="SnowUI" />
</IconProvider>
```

## 无障碍与组合边界

Provider 不生成 DOM。功能名称、Button 的 `aria-label`、交互命中区和状态仍由拥有该功能的组件负责；外部图标只替换图形，不接管事件或可访问名称。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## AI Zone

### 模块与所有权

- `IconProvider.svelte`：公开 Context Provider，负责 resolver 链和嵌套回退。
- `logic/component-icon.ts`：公开结构类型与 `createComponentIconResolver()`。
- `internal/component-icon/ComponentIcon.svelte`：SnowUI 组件与 PRO 的内部语义消费入口。
- `internal/component-icon/builtin-icon-data.ts`：随 Components 发布的默认图标快照。

### 输出协议

Provider 不输出 wrapper。内置图标解析优先级固定为组件逐实例明确替换 → 最近至最远 Provider → Components 默认集合；不得让 `resource-svelte` 成为 Components peer dependency。

## 更新日志

- **v1.0.0 (2026-08-16)**：新增应用级组件内置图标替换与嵌套 resolver 协议。
