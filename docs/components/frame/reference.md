# Frame full reference

Reviewed against Chinese source SHA-256 `39f237cf7540b317081064b954e4b05fffcdc3e22718285e175f25a832e1381b`.

<a id="frame"></a>

# Frame

<a id="组件介绍"></a>

## Overview

Provide shared layout, state, loading, and motion capabilities, with explicit configuration for coordination and styling across components.

<a id="使用选择"></a>

## When to use it

Use Frame as a general host when you need layout, state, Context, loading, Skeleton, or motion. Use semantic HTML for ordinary page structure.

- Row / column / grid select the layout; as declares the combination role, bind:element obtains the root element.
- Use singleLine for one-line labels and row firstLine for graphics with prose that may wrap. Prefer tokens and public class/style for colors, spacing and radius.
- Orchestrate*, target/action and styles are all undertaken by Frame; cross-component Motion uses initMotion() to establish context.
- When styles are not configured and there is no Motion context, no cross-component registry or motion subscription is created.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Frame, Badge, Button, Text } from '@snowui-design-system/components';
</script>

<Frame
	column
	contentFill
	padding={6}
	gap={4}
	radius={5}
	border={1}
	whileHover={{ y: [0, -4], duration: 180 }}
	style="width: min(100%, 30rem); background: var(--background-1);"
>
	<Frame singleLine><Text lines={1} size={20} weight={600}>Build with SnowUI</Text><Badge as="trailing" count="v2.4" color="Indigo" /></Frame>
	<Text>Compose responsive layout, state, interaction, and motion through one public foundation.</Text>
	<Frame row><Button variant="filled" href="/components/quick-start">Quick Start</Button><Button as="trailing" variant="outline" href="/components">Browse components</Button></Frame>
</Frame>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| componentParts | `ComponentParts` | — | The parts inside the composite component propagate the boundary; the ordinary page is used by the public parts through the host component, and this field is not directly configured. |
| enableResponsive | `boolean` | `true` | Responsive listening ability. Control ResizeObserver and breakpoint detection. |
| enableContext | `boolean` | `true` | The ability to provide context. Control FramePerception Context. |
| enableScaleObserver | `boolean` | `false` | Dimensional proportional monitoring ability. Turn on the back CSS variable to write the runtime width and height, height-to-width ratio and unified size. |
| enableDefaultMotion | `boolean` | `true` | **New in v3.6.0** Default dynamic switch. When set to `false`, all `while*` of the Frame are not automatically injected into the default motion of the system. The `while*` configuration explicitly transmitted by the user will not be affected. |
| enableAutoLayout | `boolean` | `true` | Automatic layout protocol switch. When Frame declares the direction of `row` / `column`, it is activated by default, and the `data-auto-layout` attribute is output on the root DOM, inheriting the three-slot perception, first-line alignment, Wrap, Gap and other rules of `auto-layout.css`. Set it to `false` to turn it off. For details, please refer to LayoutProtocol.md. |
| contentFill | `boolean` | `false` | The width of ordinary content sub-items fills the Frame content area; the priority is higher than `contentHug`. |
| contentHug | `boolean` | `false` | The width of ordinary content sub-items shrinks according to the content. |
| pinOffset | `number \| string` | — | Pin layout offset in two directions; numbers press px, and the string is output as it is; the new usage uses the corresponding Token string. |
| pinOffsetX | `number \| string` | — | Pin horizontal offset takes precedence over pinOffset; numbers are output by px, and the string is output as it is. |
| pinOffsetY | `number \| string` | — | Pin vertical offset takes precedence over pinOffset; numbers are output according to px, and the string is output as it is. |
| scaleHeightVar | `string` | `--snowui-scale-height-runtime` | Runtime height variable name |
| scaleWidthVar | `string` | `--snowui-scale-width-runtime` | Runtime width variable name |
| scaleAspectRatioVar | `string` | `--snowui-scale-aspect-ratio-runtime` | Runtime aspect ratio variable name |
| scaleSizeVar | `string` | `--snowui-scale-size-runtime` | Runtime unified size variable name |
| scaleObserverTarget | `"self" \| "parent"` | `'self'` | Monitor the target node |
| scaleBasis | `"height" \| "width" \| "mixed" \| "aspect"` | `'height'` | Proportional calculation based on the model |
| scaleMixHeightWeight | `number` | `0.5` | High weight in `mixed` mode |
| scaleAspectBaseRatio | `number` | `1` | `aspect` mode reference height and width ratio |
| sizeRatio | `number` | `1` | Uniform size ratio (the multiplier of relative basis size; `1`= equal to basis size) |
| iconSizeRatio | `number` | `sizeRatio` | Icon independent proportion |
| avatarSizeRatio | `number` | `sizeRatio` | Avatar independent ratio |
| class | `string` | — | External CSS class name for style overlay or layout adjustment |
| style | `string` | — | Inline style |
| children | `Snippet<[any]>` | — | Sub-content (container component) |
| as | `string` | — | Role declaration, used to declare one's own role in combination mode |
| tag | `string` | `div` | Rendered HTML tag name |
| id | `string` | — | Element ID. **The motion must be manually specified by the user** |
| element | `HTMLElement` | — | Bind the root element (bindable) |
| use | `any[]` | — | Svelte Actions Array |
| size | `number` | — | Logical size of components. Used to pass to subcomponents through Context (such as resource components to select resolution) |
| iconSize | `number` | — | **New** Independently control the size of the internal Icon (Context transmission) |
| avatarSize | `number` | — | **New** Independently control the size of internal Avatar (Context transmission) |
| loading | `boolean` | `false` | Whether to enter the loading state. It only indicates the status, not the specific visual presentation. |
| skeleton | `boolean` | `true` | Whether the loading state renders the skeleton. The parent loading protocol can be inherited. |
| renderHints | `RenderHints` | — | Self-registration for the component root’s Skeleton. The component supplies its final shape, size, corner radius, and line count; callers may override individual fields. |
| currentState | `CoreState` | `"Idle"` | Externally controlled core state. For scenarios where the life cycle is managed by the parent, such as Toast / Portal, the status of `Appear` / `Disappear` / `Active` is handed over to the default dynamic system of Frame. |
| customStates | `string[]` | — | Custom state name array to extend the state machine |
| StartLoad | `StateTransition` | — | Change after loading |
| Load | `StateTransition` | — | Change after loading is completed |
| Reload | `StateTransition` | — | Transform after reloading, call `onReload` callback |
| Appear | `StateTransition` | — | Transformation after the appearance is completed |
| Disappear | `StateTransition` | — | Transformation after disappearing |
| Idle | `StateTransition` | — | Change after free time |
| Active | `StateTransition` | — | Transformation after activation |
| Disabled | `StateTransition` | — | Transition after disabling |
| Validating | `StateTransition` | — | Transition after validation starts |
| Uploading | `StateTransition` | — | Change after uploading |
| Editing | `StateTransition` | — | Change after editing |
| onReload | `() => Promise<void>` | — | The callback performed when entering the Reload state is used for data refresh. |
| stateVars | `Record<string, StateValueMap<any>>` | — | General state variable mapping (arbitrary variable name -> take values according to state) |
| stateClass | `StateValueMap<string>` | — | Add class by status |
| stateStyle | `StateValueMap<string \| Record<string, string \| number>>` | — | Add style by status |
| stateContent | `StateValueMap<any>` | — | **New in v3.6.0** Switch sub-content by status (Snippet), Frame automatically handles cross-fade inter-complement motion (Crossfade) |
| Click | `EventTrigger` | — | Triggered when clicking |
| Drag | `EventTrigger` | — | Triggered when dragging |
| Hover | `EventTrigger` | — | Triggered when hovering |
| Focus | `EventTrigger` | — | Triggered when focusing |
| Key | `\| { key: string; state: CoreState } \| { key: string; target: string; action: string; reverse?: boolean; } \| { key: string; run: (e?: any) => void }` | — | Triggered when specifying keyboard keys |
| Scroll | `EventTrigger` | — | Triggered when scrolling to the component |
| collapsed | `boolean` | — | The declaration closes the form and is consumed by the form and state ability; the trigger button is not automatically provided. |
| expanded | `boolean` | — | The declaration unfolds the form and is consumed by the form and state ability; no additional content is automatically created. |
| responsive | `FrameResponsiveProps \| false` | — | Content adaptation configuration or false based on container width; when the response ability is enabled, the direction and content shrinkage are parsed according to the public FrameResponsiveProps. |
| xs | `"row" \| "column" \| "grid" \| "row-reverse" \| "column-reverse"` | — | Legacy xs breakpoint direction. With `enableResponsive`, it cascades mobile-first. Prefer page-level responsive utilities in new pages. |
| sm | `"row" \| "column" \| "grid" \| "row-reverse" \| "column-reverse"` | — | Legacy sm breakpoint direction. With `enableResponsive`, it cascades mobile-first. Prefer page-level responsive utilities in new pages. |
| md | `"row" \| "column" \| "grid" \| "row-reverse" \| "column-reverse"` | — | Legacy md breakpoint direction. With `enableResponsive`, it cascades mobile-first. Prefer page-level responsive utilities in new pages. |
| lg | `"row" \| "column" \| "grid" \| "row-reverse" \| "column-reverse"` | — | Legacy lg breakpoint direction. With `enableResponsive`, it cascades mobile-first. Prefer page-level responsive utilities in new pages. |
| xl | `"row" \| "column" \| "grid" \| "row-reverse" \| "column-reverse"` | — | Legacy xl breakpoint direction. With `enableResponsive`, it cascades mobile-first. Prefer page-level responsive utilities in new pages. |
| 2xl | `"row" \| "column" \| "grid" \| "row-reverse" \| "column-reverse"` | — | Legacy 2xl breakpoint direction. With `enableResponsive`, it cascades mobile-first. Prefer page-level responsive utilities in new pages. |
| singleLine | `boolean` | `false` | Explicit single-line graphics or text composition: horizontal centering, no wrapping, at least 4 CSS px spacing, stable leading/trailing attachments and shrinkable content. Takes priority over direction breakpoints and responsive structural fallback. It does not identify children or generate text or tooltips. Text lines=1 owns truncation and full-text access. Disabled when enableAutoLayout=false. |
| firstLine | `boolean` | `false` | Explicit first-line alignment for graphics with prose that may wrap. Use singleLine for one-line labels; Frame does not identify content automatically. In row or row-reverse three-slot layout, center leading/trailing attachments on the first text line. Text inherits the host line height. No enhancement without row, attachments or auto layout; compatible with Pin. |
| row | `boolean` | — | Set the horizontal layout; row takes priority when declaring column or grid at the same time. |
| column | `boolean` | — | Set the vertical layout; it will take effect when row is not enabled, and change the direction with reverse. |
| grid | `boolean` | — | Set the basic layout of the grid; it will take effect when row and column are not enabled, and the grid column is configured by public class/style. |
| reverse | `boolean` | — | Whether to reverse execution |
| morph | `boolean` | — | Enable your own layout change transition; do not replace the professional timeline inside the chart, table or text. |
| whileLoad | `MotionConfig \| boolean` | — | Motion configuration of Load state or trigger stage; object expression explicit motion, boolean controls the default ability of this stage. Do not actively create business status, and do not take over the professional internal timeline of subcomponents. |
| whileReload | `MotionConfig \| boolean` | — | The motion configuration of the Reload state or trigger stage; the object expresses the explicit motion, and boolean controls the default ability of this stage. Do not actively create business status, and do not take over the professional internal timeline of subcomponents. |
| whileAppear | `MotionConfig \| boolean` | — | The motion configuration of the Appear state or trigger stage; the object expresses the explicit motion, and boolean controls the default ability of this stage. Do not actively create business status, and do not take over the professional internal timeline of subcomponents. |
| whileDisappear | `MotionConfig \| boolean` | — | The motion configuration of the Disappear state or trigger stage; the object expresses explicit motion, and boolean controls the default ability of this stage. Do not actively create business status, and do not take over the professional internal timeline of subcomponents. |
| whileIdle | `MotionConfig \| boolean` | — | Motion configuration of Idle state or trigger stage; object expression explicit motion, boolean controls the default ability of this stage. Do not actively create business status, and do not take over the professional internal timeline of subcomponents. |
| whileActive | `MotionConfig \| boolean` | — | Active status or the motion configuration of the trigger stage; the object expresses the explicit motion, and boolean controls the default ability of this stage. Do not actively create business status, and do not take over the professional internal timeline of subcomponents. |
| whileDisabled | `MotionConfig \| boolean` | — | Motion configuration of Disabled state or trigger stage; object expression explicit motion, boolean controls the default ability of this stage. Do not actively create business status, and do not take over the professional internal timeline of subcomponents. |
| whileClick | `MotionConfig \| boolean` | — | Motion configuration of Click state or trigger stage; object expression explicit motion, boolean controls the default ability of this stage. Do not actively create business status, and do not take over the professional internal timeline of subcomponents. |
| whileDrag | `MotionConfig \| boolean` | — | Motion configuration of Drag status or trigger stage; object expression explicit motion, boolean controls the default ability of this stage. Do not actively create business status, and do not take over the professional internal timeline of subcomponents. |
| whileHover | `MotionConfig \| boolean` | — | Hover state or the motion configuration of the trigger stage; the object expresses the explicit motion, and boolean controls the default ability of this stage. Do not actively create business status, and do not take over the professional internal timeline of subcomponents. |
| whileFocus | `MotionConfig \| boolean` | — | Focus state or the motion configuration of the trigger stage; the object expresses explicit motion, and boolean controls the default ability of this stage. Do not actively create business status, and do not take over the professional internal timeline of subcomponents. |
| whileKey | `MotionConfig \| boolean` | — | The motion configuration of the Key state or trigger stage; the object expresses the explicit motion, and boolean controls the default ability of this stage. Do not actively create business status, and do not take over the professional internal timeline of subcomponents. |
| whileScroll | `MotionConfig \| boolean` | — | Scroll state or the motion configuration of the trigger stage; the object expresses the explicit motion, and boolean controls the default ability of this stage. Do not actively create business status, and do not take over the professional internal timeline of subcomponents. |
| whileValidating | `MotionConfig \| boolean` | — | Motion configuration of Validating state or trigger stage; object expresses explicit motion, and boolean controls the default ability of this stage. Compatible with migration capabilities, the new page does not expand the use. |
| whileUploading | `MotionConfig \| boolean` | — | The motion configuration of the Uploading status or trigger stage; the object expresses the explicit motion, and boolean controls the default ability of this stage. Compatible with migration capabilities, the new page does not expand the use. |
| whileEditing | `MotionConfig \| boolean` | — | The motion configuration of the Editing status or trigger stage; the object expresses the explicit motion, and boolean controls the default ability of this stage. Compatible with migration capabilities, the new page does not expand the use. |
| whileCollapsed | `MotionConfig` | — | Motion configuration of Collapsed state or trigger stage; object expression explicit motion. Compatible with migration capabilities, the new page does not expand the use. |
| whileExpanded | `MotionConfig` | — | Motion configuration of Expanded state or trigger stage; object expression explicit motion. Compatible with migration capabilities, the new page does not expand the use. |
| whileXs | `MotionConfig` | — | Motion configuration of Xs state or trigger stage; object expression explicit motion. Compatible with migration capabilities, the new page does not expand the use. |
| whileSm | `MotionConfig` | — | Motion configuration of Sm state or trigger stage; object expression explicit motion. Compatible with migration capabilities, the new page does not expand the use. |
| whileMd | `MotionConfig` | — | Explicit motion for the Md state or trigger. A compatibility feature; avoid introducing it in new pages. |
| whileLg | `MotionConfig` | — | Explicit motion for the Lg state or trigger. A compatibility feature; avoid introducing it in new pages. |
| whileXl | `MotionConfig` | — | Motion configuration of Xl state or trigger stage; object expression explicit motion. Compatible with migration capabilities, the new page does not expand the use. |
| while2xl | `MotionConfig` | — | 2xl motion configuration of state or trigger stage; object expression explicit motion. Compatible with migration capabilities, the new page does not expand the use. |
| variants | `Record<string, MotionConfig>` | — | Dynamic variant attributes |
| delay | `number` | `0` | Delayed execution time (ms) |
| loopMotion | `LoopMotionConfig` | — | Loop animation configuration. By default, write `duration / easing / iteration / direction / playState` to Frame's `--snowui-frame-loop-motion-motion-*` variable; when `preset="rotateClockwise"`, the Frame root node directly enables the built-in continuous rotation. |
| scroll | `ScrollConfig` | — | Rolling linkage configuration |
| layoutId | `string` | — | Shared element transfer ID |
| itemId | `string` | — | Element replacement anchor ID (recommended; semantics is the same as `layoutId`) |
| scope | `FrameScope` | — | Context ability scope: self, children, descendants, explicit; no additional restrictions on the dissemination of non-transmission. |
| access | `FrameAccess` | — | Context operation permission; readonly is read-only, and writeable allows operations within the scope of the public agreement. |
| timeline | `string` | — | Timeline statement: `timeline:[ID]:[Order]` |
| orchestrate | `boolean` | — | Enable the motion arrangement of the parent Frame for sub-items. |
| orchestrateMode | `"sequential" \| "random" \| "parallel"` | — | Sequential arranges sub-items in order, random and parallel at the same time. |
| orchestrateDelay | `number` | — | The interval of sub-item arrangement is in milliseconds; the duration of each sub-item is not changed. |
| orchestrateOrder | `\| "visual-row" \| "visual-column" \| "visual-row-reverse" \| "visual-column-reverse" \| "dom"` | — | Sub-items are sorted in the order of visual rows, visual columns and their reverse or dom. |
| orchestrateGroup | `string` | — | Arrange group identifiers to distinguish collaborative sub-items. |
| orchestrateTrigger | `"appear" \| "hover" \| "click" \| "scroll" \| "none"` | — | Arrange trigger: appear, hover, click, scroll or none; none does not trigger automatically. |
| orchestrateTarget | `string` | — | Arrange target selectors and restrict participating sub-items. |
| styles | `Record<string, Record<string, string \| number>>` | — | Configure the cross-Frame style arrangement according to the target ID; the key is #id, and the value is the style field and value, not the CSS selector of any descendants. |
| padding | `number` | — | Legacy scalar visual field. New pages should use a padding token and public `class`/`style`, without adding a dependency on this compatibility prop. |
| gap | `number` | — | Compatible spacing number, direct layout path mapping --gap-N; the new page has priority to correspond to gap Token, do not fill in the unregistered file. |
| radius | `number \| "full"` | — | Legacy corner radius field. New pages should use a radius token or a component’s public corner radius prop, without adding a dependency on the old scalar field. |
| border | `number` | — | Compatible border fields; the new page uses border Token or component public border entrance. |
| innerBorder | `boolean \| string` | — | Compatible with the inner border field; the new page uses the component public entrance and registered Token, and the inner border can be created without any input. |
| fontSize | `number \| string` | — | Compatible font size fields; new page pairing uses --text-* and --leading-*, and does not use size Token to express the font size. |
| minWidth | `number \| string` | — | Minimum width; numbers are converted to px, and strings are used as CSS values; design restoration uses Token or applicable layout expressions. |
| minHeight | `number \| string` | — | Compatible with the minimum height field; ordinary pages are expressed through root style and size Token, and do not rely on unclear scalar parsing paths. |
| width | `number \| string` | — | Width; numbers are converted to px, and strings are used as CSS values; new usage priority components API and Token. |
| height | `number \| string` | — | Compatible with height fields; ordinary pages are expressed through root style and size Token. |
| opacity | `number` | — | Transparency |

This table is the shared API of Frame; the field is only valid in Frame.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="布局模型与单行组合"></a>

### Layout model and single-line composition

Primary layout model: **slot host layout**. Declaring `row` or `column` with `enableAutoLayout={true}` emits `data-auto-layout="true"`, treating `as="leading"` / `as="trailing"` as Hug slots, ordinary children as Content (`min-width: 0`), and `as="pin-*"` as nine-anchor absolute positioning.

- **Single-line composition (`singleLine`)**: Implies `row`, prevents wrapping, preserves accessory dimensions, and enforces at least `4 CSS px` effective gap; truncation and full-text access belong to `Text lines={1}`.
- **First-line alignment (`row firstLine`)**: Vertically centers `leading` and `trailing` accessories against the first line box of wrapping prose that inherits host line height.
- **Size context**: `size`, `iconSize`, and `avatarSize` propagate through `SIZE_CONTEXT_KEY`; a child that sets `size` explicitly establishes a new baseline.

```svelte
<script lang="ts">
	import { Frame, Icon, Text } from '@snowui-design-system/components';
	import { Calendar } from '@snowui-design-system/resource-svelte';
</script>

<Frame singleLine style="width: 12rem;">
	<Icon as="leading" icon={Calendar} size={20} />
	<Text lines={1}>Last updated just now</Text>
</Frame>
```

<a id="状态加载与动效"></a>

### States, loading, and motion

- **States and loading**: Triggers accept a target state, state map, `{ target, action }`, or callback; `[NextState, 'auto']` advances automatically after motion completes, and `stateContent` cross-fades state snippets. Root `loading` drives descendant `renderHints` skeletons via context unless `skeleton={false}` preserves real content.
- **Motion and transitions**: `while*` objects declare full visual channels while inheriting default timing, and `false` disables default motion; matching `layoutId` / `itemId` pairs run automatic FLIP transitions, with imperative access via `getController().captureFlip` / `playFlipTo`.

```svelte
<ScrollArea axis="horizontal" ariaLabel="Profile actions" width="100%">
<Frame singleLine minWidth="max-content" loading={pageLoading}>
    <Avatar as="leading" src={user.avatar} />
    <Text lines={1}>{user.name}</Text>
    <Button as="trailing">Submit</Button>
</Frame>
</ScrollArea>
```

<a id="跨组件协调"></a>

### Cross-component coordination

After calling `initMotion()`, coordinate child motion with `orchestrate*` or reactive `#id` style expressions via `styles`; no global subscriptions are created when unused.

<a id="site-guide-frame"></a>

### Site guide: frame

<a id="when-to-use-frame-when-to-use"></a>

### When to use Frame {#when-to-use}

Frame is the shared host for layout, state, loading, motion, and explicit coordination between components. Use semantic HTML when a page only needs ordinary structure.

<a id="import-import"></a>

### Import {#import}

```ts
import { Frame, initMotion } from '@snowui-design-system/components';
```

<a id="layout-and-content-layout-and-content"></a>

### Layout and content {#layout-and-content}

Use singleLine with leading/trailing attachments and Text lines={1} for one-line labels. Use row firstLine for wrapping prose; row, column, grid, and as compose other layouts. Use public tokens and class/style for visual values. loading and skeleton share the same inherited context.

<a id="coordination-coordination"></a>

### Coordination {#coordination}

Call initMotion() during parent component initialization when using cross-component motion. Frame supports orchestrate*, target/action triggers, and styles rules. These capabilities use the same Frame implementation and context as ordinary layout.

<a id="api-and-examples-api-and-examples"></a>

### API and examples {#api-and-examples}

[API reference](../frame.md) · [Complete manual](./reference.md) · [Quick Start](https://snowui.dev/components/quick-start)

<a id="next-steps-next-steps"></a>

### Next steps {#next-steps}

- [Quick Start](https://snowui.dev/components/quick-start)
- [ScrollArea](../scroll-area.md)

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
