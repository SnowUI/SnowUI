# ScrollArea changelog

Reviewed against Chinese source SHA-256 `ef1b29d49c37e67bb63abcb301960bf7c852f10d6f0bbc0ba64623982ec337f4`. For version differences, check the installed package as well.

<a id="v141-2026-10-20"></a>

### v1.4.1 (2026-10-20)

- The default scroll viewport name follows LocaleProvider; an explicit ariaLabel takes priority. Children remain caller-owned content.

- 2026-10-08: The entire Overlay track now responds to hover. Clicking empty track space centers the thumb there and can continue into a drag; interaction state is cleaned up on capture cancellation and unmount.

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

<a id="v140-2026-09-18"></a>

### v1.4.0 (2026-09-18)

- Added `horizontalScrollbarVisibility`. The horizontal scrollbar can appear only while hovering over ScrollArea; it still defaults to remaining visible whenever content overflows.

<a id="v130-2026-09-01"></a>

### v1.3.0 (2026-09-01)

- Added `horizontalTrackPosition="viewport"`, keeping the horizontal track reachable as long horizontal content crosses the page viewport while horizontal scrolling remains owned by the current ScrollArea.

<a id="v120-2026-07-22"></a>

### v1.2.0 (2026-07-22)

- The vertical Thumb keeps its normal 4px visual width while its normal hover hit area expands to the 8px hover-state width, making it easier to target with a pointer.

<a id="v110-2026-06-21"></a>

### v1.1.0 (2026-06-21)

- The vertical scrollbar now hides by default and fades in with Frame default motion when the pointer enters ScrollArea, then fades out on exit. The horizontal scrollbar remains visible whenever content overflows.

<a id="v100-2026-06-21"></a>

### v1.0.0 (2026-06-21)

<a id="新功能"></a>

#### New features

- Added SnowUI-managed vertical, horizontal, and two-axis scroll areas.
- Wrapped the viewport, track, Thumb, and drag logic needed by pages and containers in a declarative component.

[Component guide](../scroll-area.md) · [Full reference](./reference.md)
