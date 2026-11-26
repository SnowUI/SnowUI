# Breadcrumb changelog

Reviewed against Chinese source SHA-256 `0823c13011889dc03c5fb8b04b2644acc480713a5cb0f367737191c3e59c6475`. For version differences, check the installed package as well.

<a id="v120-2026-10-23"></a>

### v1.2.0 (2026-10-23)

- Path elements reuse shared gap-token resolution with at least 4 CSS px effective row/column spacing, including zero and font/gap scaling.
- Preserve ordinary path wrapping, child Button ownership, current-page event protection and separator accessibility. Correct the stale documentation claim that separator is not a prop; the existing API is unchanged.

<a id="v113-2026-10-20"></a>

### v1.1.3 (2026-10-20)

- The default navigation name follows LocaleProvider; an explicit ariaLabel takes priority. Path labels and business content remain unchanged.

<a id="v112-2026-10-14"></a>

### v1.1.2 (2026-10-14)

- Explicit children no longer inherit `parts.Button` or `parts.Text`; default children in items mode still use parts.

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

<a id="v111-2026-09-02"></a>

### v1.1.1 (2026-09-02)

- Expanded per-Prop descriptions, default fallbacks, and usage boundaries based on the current source. Runtime behavior is unchanged.

<a id="v110-2026-08-19"></a>

### v1.1.0 (2026-08-19)

- Breadcrumb items now disable Button hover enlargement by default in this composite navigation control; a child Button can explicitly re-enable it.

<a id="v101-2026-08-16"></a>

### v1.0.1 (2026-08-16)

- Item opacity and hover-overlay transitions no longer depend on the injection order of shared styles.

<a id="v100-2026-05-25"></a>

### v1.0.0 (2026-05-25)

<a id="新功能"></a>

#### New features

- Added Breadcrumb with a container-based composition API.
- The last item can automatically represent the current page.
- Noncurrent items use 40% opacity, rising to 100% on hover.

[Component guide](../breadcrumb.md) · [Full reference](./reference.md)
