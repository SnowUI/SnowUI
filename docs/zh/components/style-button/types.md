# StyleButton 类型与状态

必填属性：无具名必填属性。

可双向绑定：`bind:mode`。

继承声明：`Omit< ButtonProps, "children" | "onclick" | "disabled" | "aria-pressed" >`。继承能力以基类公开文档为准；Omit 中的字段已排除，不能按基类原样使用。

[共享 Frame API](../frame/api.md) · [返回 API](./api.md)

以下为公开属性实际引用的类型声明，来自源码；Svelte Snippet 表示内容片段，ComponentProps 表示对应组件的 Props。

## SnowUIStyleMode

来源：src/components/StyleButton.svelte

```ts
export type SnowUIStyleMode = "snowui" | "apple";
```

## ButtonProps

来源：src/components/StyleButton.svelte

```ts
type ButtonProps = ComponentProps<typeof Button>;
```
