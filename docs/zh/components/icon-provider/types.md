# IconProvider 类型与状态

必填属性：无具名必填属性。

可双向绑定：本组件未声明具名双向绑定属性；状态更新通过公开回调或所属宿主处理。

继承声明：无接口继承。继承能力以基类公开文档为准；Omit 中的字段已排除，不能按基类原样使用。

[共享 Frame API](../frame/api.md) · [返回 API](./api.md)

以下为公开属性实际引用的类型声明，来自源码；Svelte Snippet 表示内容片段，ComponentProps 表示对应组件的 Props。

## ComponentIconMap

来源：src/logic/component-icon.ts

```ts
export type ComponentIconMap = Record<string, ComponentIconComponent | undefined>;
```

## ComponentIconComponent

来源：src/logic/component-icon.ts

```ts
export type ComponentIconComponent = Component<ComponentIconRenderProps>;
```

## ComponentIconRenderProps

来源：src/logic/component-icon.ts

```ts
export interface ComponentIconRenderProps {
    size?: number | string;
    color?: string;
    weight?: ComponentIconWeight;
    class?: string;
    [key: string]: unknown;
}
```

## ComponentIconWeight

来源：src/logic/component-icon.ts

```ts
export type ComponentIconWeight =
    | "regular"
    | "thin"
    | "light"
    | "bold"
    | "fill"
    | "duotone";
```

## ComponentIconResolver

来源：src/logic/component-icon.ts

```ts
export type ComponentIconResolver = (
    request: ComponentIconRequest,
) => ComponentIconComponent | undefined;
```

## ComponentIconRequest

来源：src/logic/component-icon.ts

```ts
export interface ComponentIconRequest {
    name: string;
    weight: ComponentIconWeight;
    /** 既有显式资源 API 的可选提示；组件内置功能图标不得依赖它。 */
    collection?: string;
}
```
