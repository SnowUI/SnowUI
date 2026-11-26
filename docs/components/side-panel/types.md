# SidePanel types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="sidepanel-类型与状态"></a>

# SidePanel type and status

Required Props: no named required Props.

Bidirectional binding: `bind:open`, `bind:placement`, `bind:width`.

Inheritance statement: `Omit<FrameProps, "children" | "width">`. The inheritance ability is subject to the public document of the base class; the fields in Omit have been excluded and cannot be used as they are according to the base class.

[Share Frame API](../frame/reference.md#api) · [Return API](../side-panel.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="sidepanelplacement"></a>

## SidePanelPlacement

Source: src/lib/side-panel.ts

```ts
export type SidePanelPlacement = "floating" | "inline";
```

<a id="sidepaneltoolbaraction"></a>

## SidePanelToolbarAction

Source: src/lib/side-panel.ts

```ts
export interface SidePanelToolbarAction {
    id?: string;
    role?: SidePanelActionRole;
    label?: string;
    icon?: string;
    ariaLabel?: string;
    variant?: "gray" | "filled" | "outline" | "borderless";
    bare?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    onClick?: (event: MouseEvent) => void | Promise<void>;
}
```

<a id="sidepanelactionrole"></a>

## SidePanelActionRole

Source: src/lib/side-panel.ts

```ts
export type SidePanelActionRole =
    | "placement"
    | "previous"
    | "next"
    | "copy"
    | "delete"
    | "close"
    | "custom";
```

<a id="dialogbackdrop"></a>

## DialogBackdrop

Source: src/logic/dialog.svelte.ts

```ts
export type DialogBackdrop = import("../lib/backdrop").BackdropVariant;
```

<a id="componentpartsof"></a>

## ComponentPartsOf

Source: src/logic/component-parts.svelte.ts

```ts
export type ComponentPartsOf<
    T extends Record<string, Component<any>>,
> = {
    [K in keyof T]?: ConfigurableComponentPartProps<T[K]>;
};
```

<a id="configurablecomponentpartprops"></a>

## ConfigurableComponentPartProps

Source: src/logic/component-parts.svelte.ts

```ts
export type ConfigurableComponentPartProps<C extends Component<any>> = Partial<
    Omit<ComponentProps<C>, ComponentPartControlledKey>
>;
```

<a id="componentpartcontrolledkey"></a>

## ComponentPartControlledKey

Source: src/logic/component-parts.svelte.ts

```ts
export type ComponentPartControlledKey =
    | "children"
    | "as"
    | "value"
    | "defaultValue"
    | "open"
    | "selected"
    | "checked"
    | "disabled"
    | "readonly"
    | "id"
    | `on${string}`
    | `aria-${string}`;
```

[API](./api.md) · [Full reference](./reference.md)
