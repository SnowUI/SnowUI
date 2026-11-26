# Toaster changelog

Reviewed against Chinese source SHA-256 `973a6949571651365122244b56d81585b68eb0a4066caf7b5a8645cb1393484b`. For version differences, check the installed package as well.

<a id="v103-2026-10-23"></a>

### v1.0.3 (2026-10-23)

- Imperative text strings reuse single-line composition and Text truncation with full-text hints. Configure generated labels through parts.Text. Custom children retain their layout and own configuration; queue, timers, positions, and stacking are unchanged.

<a id="v102-2026-10-22"></a>

### v1.0.2 (2026-10-22)

- Replace the queue array when adding or removing entries, preventing stale exit nodes and missing later notifications. Preserve notification IDs, durations, positions, visible limits and dismissal callbacks.

- 2026-10-22: Clarified the shared queue and single application host. Documentation only; component behavior is unchanged.

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

<a id="v101-2026-09-20"></a>

### v1.0.1 (2026-09-20)

- Fixed horizontal centering of top and bottom notifications and their stacks at the default content width.

[Component guide](../toaster.md) · [Full reference](./reference.md)
