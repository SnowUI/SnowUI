# Select changelog

Reviewed against Chinese source SHA-256 `a2cb45faa555485fd2abcdec5946d7aae692a3609d46debde1771a995a4b6aa2`. For version differences, check the installed package as well.

<a id="v331-2026-11-24"></a>

### v3.3.1 (2026-11-24)

- Added `Tooltip` to `SelectParts` to forward built-in `Tooltip` configuration to the `buttonTrigger` `Button` while keeping explicit `children` and `triggerContent` isolated.

<a id="v330-2026-10-23"></a>

### v3.3.0 (2026-10-23)

- 2026-10-23: Updated complex accessory icon/label examples to reuse Frame `singleLine` and Text truncation; documentation-only update with host, clear, and selection protocols unchanged.
- Field mode uses shared single-line layout and minimum graphics/text spacing. The invisible buttonTrigger host adds no gap; the actual Button retains content ownership.
- Forward ariaLabel to the actual combobox, retaining options, native form values, return focus and custom attachments.

<a id="v325-2026-10-20"></a>

### v3.2.5 (2026-10-20)

- Fixed focus restoration for `buttonTrigger` / SelectButton when closing the list by passing the real trigger button to the shared Listbox while keeping anchor positioning and selection unchanged.

<a id="v324-2026-10-17"></a>

### v3.2.4 (2026-10-17)

- In the default `options` mode, updated option labels are reflected immediately in the selected trigger instead of retaining the previous language. The registration protocol for explicit children is unchanged.

<a id="v323-2026-10-14"></a>

### v3.2.3 (2026-10-14)

- Explicit children and custom trigger-button content no longer inherit parts configured for Select’s default children; options mode keeps its previous configuration entry points.

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

<a id="v322-2026-08-29"></a>

### v3.2.2 (2026-08-29)

- The nonvisual `buttonTrigger` wrapper no longer receives a separate field border, preventing shared Field styling from overriding the real Button host variant.

<a id="v321-2026-07-05"></a>

### v3.2.1 (2026-07-05)

- When `buttonTrigger` has no `triggerContent`, it falls back to the selected option, then placeholder, then ariaLabel, avoiding an invisible empty Button.
- Added a trigger ID to the Button trigger, restoring the Listbox `aria-labelledby` association.

<a id="v320-2026-07-02"></a>

### v3.2.0 (2026-07-02)

- The built-in dropdown indicator uses `ComponentIcon name="arrow-line-up-down"`. Components provides it by default, while an application-level `IconProvider` can switch icon libraries.
- The direct-child trailing-slot contract remains. A custom trailing child still replaces the default indicator.

- **Select-Docs.2026-05-25** Archived the historical changelog from the source header. New changes now belong in this document’s changelog; the source header retains only its role, current key architecture, and documentation path.

<a id="v300-2026-04-18"></a>

### v3.0.0 (2026-04-18)

<a id="架构升级"></a>

#### Architecture upgrade

- **SEL-Break.1** Split Listbox into independent components (`Listbox.svelte` and `MenuItem.svelte`).
- **SEL-Break.2** Changed the API from `<option>` children to `<Listbox>` + `<MenuItem>` composition.
- **SEL-Break.3** Form submission now uses a hidden `<input type="hidden">`; removed the hidden `<select>` and MutationObserver.
- **SEL-Break.4** Child communication now uses `ListboxOwnerContext` through setContext.
- **SEL-Break.5** Removed `multiple`, `nativeSize`, and `autocomplete` Props.
- **SEL-Feat.2** Added `readonly`.

<a id="v200-2026-04-13"></a>

### v2.0.0 (2026-04-13)

<a id="架构升级-1"></a>

#### Architecture upgrade

- **SEL-Feat.1** Replaced the native `<select>` with a fully custom architecture: trigger button plus fixed-position Listbox.

<a id="v100-2026-03-15"></a>

### v1.0.0 (2026-03-15)

<a id="新功能"></a>

#### New features

- **SEL-Feat.0** Added a Frame-based native select component.

[Component guide](../select.md) · [Full reference](./reference.md)
