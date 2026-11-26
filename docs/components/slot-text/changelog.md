# SlotText changelog

Reviewed against Chinese source SHA-256 `8a2bd3ec142c431937e7d34fb4b335c139cd4242a3a16cb28816d6f43e8740fd`. For version differences, check the installed package as well.

<a id="v1112-2026-09-09"></a>

### v1.11.2 (2026-09-09)

- 2026-09-21: Unified the usage guide, source property table, and Site / AI reading entry points. Documentation only; component behavior is unchanged.

- `motionColor` now covers every target character. Retained characters and formatting marks also join the unified per-character color return sequence; the full timing follows TextMotionSpec §2.1.
- Character-change effects retain their existing rules. Without a color setting, with animation disabled where applicable, or when reduced motion applies, the final original color is shown. Continuous updates reschedule the color sequence, and unmounting cleans up color animations.

<a id="v1111-2026-09-08"></a>

### v1.11.1 (2026-09-08)

- Continuous updates now continue from the current slot appearance, retaining movement already in progress while reducing per-character timers and repeated layout reads. `interrupt=false` still waits for the current playback to finish before applying the latest target.

<a id="v1110-2026-06-16"></a>

### v1.11.0 (2026-06-16)

- Moved SlotText-specific `isTail` handling ahead of shared LCP / LCS: old characters beyond the new text length are extracted by original index before the remaining characters use shared reassembly.

<a id="v1100-2026-06-16"></a>

### v1.10.0 (2026-06-16)

- Completed the `isTail` end-deletion rule from `slot-text-main`: old characters beyond the new text length use `0.75` times the duration and join the exit wave from the middle of the line.

<a id="v190-2026-06-16"></a>

### v1.9.0 (2026-06-16)

- The default exit direction changed to upward, matching NumericText’s default text direction.
- Character entrance and exit gained the same opacity changes as NumericText: `0 -> 1` on entrance and `1 -> 0` on exit.

<a id="v180-2026-06-15"></a>

### v1.8.0 (2026-06-15)

- Adopted the shared timeline used by NumericText, unifying natural-width commits, retained-character FLIP, and changed-character entrance/exit at the same reassembly point. This fixes width changes squeezing characters that have not exited yet.
- Layout FLIP no longer adds `exitOffset`. Ordinary-text stagger now follows local ordering in the changed middle span, preventing long prefixes from delaying entrance and exit.

<a id="v170-2026-06-15"></a>

### v1.7.0 (2026-06-15)

- Recreated SlotText from `slot-text-main`: default direction changed to `down`, with `interrupt=true` and `playOnMount=false` by default, and 45ms stagger and wobble restored. Character processing moved to the LCP / LCS + FLIP shared with NumericText; SlotText retains only the vertical slot-scroll appearance.
- `replayKey` now triggers whole-line replay only when text is unchanged. Normal text changes preserve unchanged characters as in the reference project.
- Added TextMotion-Demo Slow Mode support through `transition` overrides and tightened mixed-content detection so ordinary text containing digits does not accidentally use right-to-left numeric ordering.

<a id="v160-2026-06-15"></a>

### v1.6.0 (2026-06-15)

- `motionColor` now defaults to `undefined`, leaving text color unchanged unless explicitly set.

<a id="v150-2026-06-14"></a>

### v1.5.0 (2026-06-14)

- Added numeric semantic classification through `motionRole` for ordinary numbers, timers, and countdowns. Multiplication and division choose Up or Down according to whether the result grows or shrinks.

<a id="v140-2026-06-14"></a>

### v1.4.0 (2026-06-14)

- Numeric trend parsing now handles increasing and decreasing negative numbers plus cyclic timer/countdown comparisons of full time strings. Addition rolls upward; subtraction rolls downward.

<a id="v130-2026-06-14"></a>

### v1.3.0 (2026-06-14)

- At that time, defaults were updated to match the confirmed screenshot: physical upward rolling, `stagger=45ms`, `duration=300ms`, `bounce=0.6`, `skipUnchanged=true`, and `interrupt=false`. The interruption policy was superseded by `interrupt=true` in v1.7.0 to match `slot-text-main`.
- Added numeric-trend semantics through `trend`: increasing numbers roll up, decreasing numbers roll down, and changed digits start from least to most significant. The direction API was later consolidated around `normal` / `reverse` semantics.

<a id="v120-2026-06-14"></a>

### v1.2.0 (2026-06-14)

- Root `Frame` now enables default Frame motion by default. Internal slot animation runs alongside component-level `while*` and parent choreography.

<a id="v110-2026-06-14"></a>

### v1.1.0 (2026-06-14)

- Unified six typography Props and `motionColor`.
- Removed public Props that exposed motion implementation details.
- `respectMotionPreference` defaults to `false`.

[Component guide](../slot-text.md) · [Full reference](./reference.md)
