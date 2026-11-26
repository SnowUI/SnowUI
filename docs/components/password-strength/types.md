# PasswordStrength types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="passwordstrength-类型与状态"></a>

# PasswordStrength types and states

Required Props: none.

Two-way binding: this component declares no named binding; state updates are handled by its public callbacks or host.

Inherited: `Omit<FrameProps, 'children' | 'column' | 'row' | 'gap' | 'enableAutoLayout'>`. See the base component’s public documentation; omitted fields are excluded.

[Shared Frame API](../frame.md) · [Return to API](../password-strength.md)

The declarations below are referenced by public Props and extracted from source. Svelte Snippet denotes content, and ComponentProps denotes a component’s Props.

<a id="passwordstrengthevaluator"></a>

## PasswordStrengthEvaluator

Source: src/components/PasswordStrength.svelte

```ts
export type PasswordStrengthEvaluator = (password: string) => PasswordStrengthLevel;
```

<a id="passwordstrengthlevel"></a>

## PasswordStrengthLevel

Source: src/components/PasswordStrength.svelte

```ts
export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4;
```

[API](./api.md) · [Full reference](./reference.md)
