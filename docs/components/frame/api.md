# Frame API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `componentParts` | `ComponentParts` | — | Internal parts-propagation boundary for a composite component. Ordinary pages configure public parts through the hosting component rather than this field. |
| `enableResponsive` | `boolean` | true | Enable responsive observation, including ResizeObserver and breakpoint detection. |
| `enableContext` | `boolean` | true | Provide FramePerception context to descendants. |
| `enableScaleObserver` | `boolean` | false | Observe proportional size. Writes runtime CSS variables for width, height, aspect ratio, and unified size. |
| `enableDefaultMotion` | `boolean` | true | Default motion switch. false prevents Frame from injecting system default motion into while* stages; explicit user while* configuration still applies. |
| `enableAutoLayout` | `boolean` | true | Enable the automatic layout protocol when row or column is declared. Emits data-auto-layout and provides three-slot perception, first-line alignment, wrapping, and gap rules from auto-layout.css. Set false to disable; see LayoutProtocol.md. |
| `contentFill` | `boolean` | false | Make ordinary child content fill the Frame content width; takes priority over contentHug. |
| `contentHug` | `boolean` | false | Shrink ordinary child content width to its contents. |
| `pinOffset` | `number \| string` | — | Pin offset on both axes. Numbers become pixels; strings pass through. Prefer the relevant token string in new code. |
| `pinOffsetX` | `number \| string` | — | Horizontal pin offset, taking precedence over pinOffset. Numbers become pixels; strings pass through. |
| `pinOffsetY` | `number \| string` | — | Vertical pin offset, taking precedence over pinOffset. Numbers become pixels; strings pass through. |
| `scaleHeightVar` | `string` | --snowui-scale-height-runtime | CSS variable name receiving runtime height. |
| `scaleWidthVar` | `string` | --snowui-scale-width-runtime | CSS variable name receiving runtime width. |
| `scaleAspectRatioVar` | `string` | --snowui-scale-aspect-ratio-runtime | CSS variable name receiving runtime aspect ratio. |
| `scaleSizeVar` | `string` | --snowui-scale-size-runtime | CSS variable name receiving runtime unified size. |
| `scaleObserverTarget` | `"self" \| "parent"` | 'self' | Element observed for size changes. |
| `scaleBasis` | `"height" \| "width" \| "mixed" \| "aspect"` | 'height' | Basis model for proportional calculations. |
| `scaleMixHeightWeight` | `number` | 0.5 | Height weighting in mixed scale mode. |
| `scaleAspectBaseRatio` | `number` | 1 | Reference height-to-width ratio in aspect mode. |
| `sizeRatio` | `number` | 1 | Unified size ratio relative to the basis; 1 equals the basis size. |
| `iconSizeRatio` | `number` | sizeRatio | Independent ratio for icon size. |
| `avatarSizeRatio` | `number` | sizeRatio | Independent ratio for avatar size. |
| `class` | `string` | — | External CSS class for public styling or layout adjustments. |
| `style` | `string` | — | Inline style on the root. |
| `children` | `Snippet<[any]>` | — | Container child content. |
| `as` | `string` | — | Role declared by this Frame in a composition. |
| `tag` | `string` | div | HTML tag rendered for the root. |
| `id` | `string` | — | Element ID. For motion identity, the caller must provide it explicitly. |
| `element` | `HTMLElement` | — | Bindable root element reference. |
| `use` | `any[]` | — | Array of Svelte actions. |
| `size` | `number` | — | Logical size passed through context to descendants, including resource components that select a resolution. |
| `iconSize` | `number` | — | Set the internal Icon size independently through context. |
| `avatarSize` | `number` | — | Set the internal Avatar size independently through context. |
| `loading` | `boolean` | false | Enter loading state. This indicates state without prescribing its visual presentation. |
| `skeleton` | `boolean` | true | Render a skeleton for loading state; may inherit the parent loading protocol. |
| `renderHints` | `RenderHints` | — | Skeleton registration hints for root shape, size, radius, and line count. Caller fields override component hints individually. |
| `currentState` | `CoreState` | "Idle" | Externally controlled core state for a parent-managed lifecycle such as Toast or Portal. Transfers Appear, Disappear, or Active state to Frame default motion. |
| `customStates` | `string[]` | — | Additional custom state names for the state machine. |
| `StartLoad` | `StateTransition` | — | Transition after loading begins. |
| `Load` | `StateTransition` | — | Transition after loading completes. |
| `Reload` | `StateTransition` | — | Transition after a reload and call onReload. |
| `Appear` | `StateTransition` | — | Transition after appearing. |
| `Disappear` | `StateTransition` | — | Transition after disappearing. |
| `Idle` | `StateTransition` | — | Transition after becoming idle. |
| `Active` | `StateTransition` | — | Transition after activation. |
| `Disabled` | `StateTransition` | — | Transition after disabling. |
| `Validating` | `StateTransition` | — | Transition after validation begins. |
| `Uploading` | `StateTransition` | — | Transition after uploading begins. |
| `Editing` | `StateTransition` | — | Transition after editing begins. |
| `onReload` | `() => Promise<void>` | — | Callback when entering Reload, used to refresh data. |
| `stateVars` | `Record<string, StateValueMap<any>>` | — | Map arbitrary CSS variable names to values by state. |
| `stateClass` | `StateValueMap<string>` | — | Add classes according to state. |
| `stateStyle` | `StateValueMap<string \| Record<string, string \| number>>` | — | Add styles according to state. |
| `stateContent` | `StateValueMap<any>` | — | Switch child Snippets by state; Frame supplies cross-fade motion between them. |
| `Click` | `EventTrigger` | — | Trigger a state transition on click. |
| `Drag` | `EventTrigger` | — | Trigger a state transition on drag. |
| `Hover` | `EventTrigger` | — | Trigger a state transition on hover. |
| `Focus` | `EventTrigger` | — | Trigger a state transition on focus. |
| `Key` | `\| { key: string; state: CoreState } \| { key: string; target: string; action: string; reverse?: boolean; } \| { key: string; run: (e?: any) => void }` | — | Trigger a state transition for specified keys. |
| `Scroll` | `EventTrigger` | — | Trigger a state transition when scrolled to the component. |
| `collapsed` | `boolean` | — | Declare a collapsed form for form and state capabilities; does not create a trigger button. |
| `expanded` | `boolean` | — | Declare an expanded form for form and state capabilities; does not create content automatically. |
| `responsive` | `FrameResponsiveProps \| false` | — | Content adaptation settings based on container width, or false. With responsive capability enabled, public FrameResponsiveProps controls direction and content shrinkage. |
| `xs` | `"row" \| "column" \| "grid" \| "row-reverse" \| "column-reverse"` | — | Compatibility direction at the xs breakpoint using a mobile-first cascade when enableResponsive is on. New pages should prefer page responsive utilities. |
| `sm` | `"row" \| "column" \| "grid" \| "row-reverse" \| "column-reverse"` | — | Compatibility direction at the sm breakpoint using a mobile-first cascade when enableResponsive is on. New pages should prefer page responsive utilities. |
| `md` | `"row" \| "column" \| "grid" \| "row-reverse" \| "column-reverse"` | — | Compatibility direction at the md breakpoint using a mobile-first cascade when enableResponsive is on. New pages should prefer page responsive utilities. |
| `lg` | `"row" \| "column" \| "grid" \| "row-reverse" \| "column-reverse"` | — | Compatibility direction at the lg breakpoint using a mobile-first cascade when enableResponsive is on. New pages should prefer page responsive utilities. |
| `xl` | `"row" \| "column" \| "grid" \| "row-reverse" \| "column-reverse"` | — | Compatibility direction at the xl breakpoint using a mobile-first cascade when enableResponsive is on. New pages should prefer page responsive utilities. |
| `2xl` | `"row" \| "column" \| "grid" \| "row-reverse" \| "column-reverse"` | — | Compatibility direction at the 2xl breakpoint using a mobile-first cascade when enableResponsive is on. New pages should prefer page responsive utilities. |
| `row` | `boolean` | — | Set horizontal layout. Takes priority if row, column, and grid are all declared. |
| `firstLine` | `boolean` | false | Explicit first-line alignment for graphics with prose that may wrap; use singleLine for one-line labels. In a row or row-reverse three-slot layout, center leading and trailing attachments on the first text line. Text must inherit host line height. No effect without row layout, attachments, or auto layout; compatible with Pin. |
| `singleLine` | `boolean` | false | Explicit single-line composition: horizontal alignment, no wrapping, stable attachments and at least 4 CSS px of effective spacing. It takes priority over responsive direction changes. Text lines=1 owns truncation and full-text access. Disabled when enableAutoLayout=false. |
| `column` | `boolean` | — | Set vertical layout when row is not active; reverse can flip direction. |
| `grid` | `boolean` | — | Set basic grid layout when row and column are inactive. Configure columns through public class or style. |
| `reverse` | `boolean` | — | Reverse the selected layout direction. |
| `morph` | `boolean` | — | Animate Frame’s own layout changes. It does not replace chart, table, or text component timelines. |
| `whileLoad` | `MotionConfig \| boolean` | — | Motion for the Load state or trigger. An object defines explicit motion; a boolean controls this stage’s default motion. It does not create business state or take over a child component’s specialized timeline. |
| `whileReload` | `MotionConfig \| boolean` | — | Motion for the Reload state or trigger. An object defines explicit motion; a boolean controls this stage’s default motion. It does not create business state or take over a child component’s specialized timeline. |
| `whileAppear` | `MotionConfig \| boolean` | — | Motion for the Appear state or trigger. An object defines explicit motion; a boolean controls this stage’s default motion. It does not create business state or take over a child component’s specialized timeline. |
| `whileDisappear` | `MotionConfig \| boolean` | — | Motion for the Disappear state or trigger. An object defines explicit motion; a boolean controls this stage’s default motion. It does not create business state or take over a child component’s specialized timeline. |
| `whileIdle` | `MotionConfig \| boolean` | — | Motion for the Idle state or trigger. An object defines explicit motion; a boolean controls this stage’s default motion. It does not create business state or take over a child component’s specialized timeline. |
| `whileActive` | `MotionConfig \| boolean` | — | Motion for the Active state or trigger. An object defines explicit motion; a boolean controls this stage’s default motion. It does not create business state or take over a child component’s specialized timeline. |
| `whileDisabled` | `MotionConfig \| boolean` | — | Motion for the Disabled state or trigger. An object defines explicit motion; a boolean controls this stage’s default motion. It does not create business state or take over a child component’s specialized timeline. |
| `whileClick` | `MotionConfig \| boolean` | — | Motion for the Click state or trigger. An object defines explicit motion; a boolean controls this stage’s default motion. It does not create business state or take over a child component’s specialized timeline. |
| `whileDrag` | `MotionConfig \| boolean` | — | Motion for the Drag state or trigger. An object defines explicit motion; a boolean controls this stage’s default motion. It does not create business state or take over a child component’s specialized timeline. |
| `whileHover` | `MotionConfig \| boolean` | — | Motion for the Hover state or trigger. An object defines explicit motion; a boolean controls this stage’s default motion. It does not create business state or take over a child component’s specialized timeline. |
| `whileFocus` | `MotionConfig \| boolean` | — | Motion for the Focus state or trigger. An object defines explicit motion; a boolean controls this stage’s default motion. It does not create business state or take over a child component’s specialized timeline. |
| `whileKey` | `MotionConfig \| boolean` | — | Motion for the Key state or trigger. An object defines explicit motion; a boolean controls this stage’s default motion. It does not create business state or take over a child component’s specialized timeline. |
| `whileScroll` | `MotionConfig \| boolean` | — | Motion for the Scroll state or trigger. An object defines explicit motion; a boolean controls this stage’s default motion. It does not create business state or take over a child component’s specialized timeline. |
| `whileValidating` | `MotionConfig \| boolean` | — | Motion for the Validating state or trigger. An object defines explicit motion. This is a migration compatibility entry; avoid expanding its use on new pages. |
| `whileUploading` | `MotionConfig \| boolean` | — | Motion for the Uploading state or trigger. An object defines explicit motion. This is a migration compatibility entry; avoid expanding its use on new pages. |
| `whileEditing` | `MotionConfig \| boolean` | — | Motion for the Editing state or trigger. An object defines explicit motion. This is a migration compatibility entry; avoid expanding its use on new pages. |
| `whileCollapsed` | `MotionConfig` | — | Motion for the Collapsed state or trigger. An object defines explicit motion. This is a migration compatibility entry; avoid expanding its use on new pages. |
| `whileExpanded` | `MotionConfig` | — | Motion for the Expanded state or trigger. An object defines explicit motion. This is a migration compatibility entry; avoid expanding its use on new pages. |
| `whileXs` | `MotionConfig` | — | Motion for the Xs state or trigger. An object defines explicit motion. This is a migration compatibility entry; avoid expanding its use on new pages. |
| `whileSm` | `MotionConfig` | — | Motion for the Sm state or trigger. An object defines explicit motion. This is a migration compatibility entry; avoid expanding its use on new pages. |
| `whileMd` | `MotionConfig` | — | Motion for the Md state or trigger. An object defines explicit motion. This is a migration compatibility entry; avoid expanding its use on new pages. |
| `whileLg` | `MotionConfig` | — | Motion for the Lg state or trigger. An object defines explicit motion. This is a migration compatibility entry; avoid expanding its use on new pages. |
| `whileXl` | `MotionConfig` | — | Motion for the Xl state or trigger. An object defines explicit motion. This is a migration compatibility entry; avoid expanding its use on new pages. |
| `while2xl` | `MotionConfig` | — | Motion for the 2xl state or trigger. An object defines explicit motion. This is a migration compatibility entry; avoid expanding its use on new pages. |
| `variants` | `Record<string, MotionConfig>` | — | Motion variant attributes. |
| `delay` | `number` | 0 | Execution delay in milliseconds. |
| `loopMotion` | `LoopMotionConfig` | — | Looped animation settings. By default, write duration, easing, iteration, direction, and playState to Frame loop-motion CSS variables. preset="rotateClockwise" activates continuous rotation on the root. |
| `scroll` | `ScrollConfig` | — | Scroll-linked motion configuration. |
| `layoutId` | `string` | — | Shared-element transition ID. |
| `itemId` | `string` | — | Element replacement anchor ID, recommended with the same semantics as layoutId. |
| `scope` | `FrameScope` | — | Context capability reach: self, children, descendants, or explicit. Does not impose new limits on unrelated context propagation. |
| `access` | `FrameAccess` | — | Context operation permission: readonly permits reads; writeable permits operations allowed by the public contract. |
| `timeline` | `string` | — | Timeline declaration in the form timeline:[ID]:[Order]. |
| `orchestrate` | `boolean` | — | Enable parent Frame motion sequencing for child items. |
| `orchestrateMode` | `"sequential" \| "random" \| "parallel"` | — | Arrange child items sequentially, randomly, or in parallel. |
| `orchestrateDelay` | `number` | — | Interval between arranged child items in milliseconds; does not change each child duration. |
| `orchestrateOrder` | `\| "visual-row" \| "visual-column" \| "visual-row-reverse" \| "visual-column-reverse" \| "dom"` | — | Order children by visual rows, visual columns, their reverse orders, or DOM order. |
| `orchestrateGroup` | `string` | — | Group identifier distinguishing cooperating children. |
| `orchestrateTrigger` | `"appear" \| "hover" \| "click" \| "scroll" \| "none"` | — | Start arrangement on appear, hover, click, or scroll; none disables automatic triggering. |
| `orchestrateTarget` | `string` | — | Target selector limiting which children participate. |
| `styles` | `Record<string, Record<string, string \| number>>` | — | Cross-Frame style arrangement keyed by target #id; values are style fields, not selectors for arbitrary descendants. |
| `padding` | `number` | — | Legacy scalar visual field. Prefer padding tokens and public class or style on new pages. |
| `gap` | `number` | — | Legacy numeric spacing mapped directly to a registered --gap-N token. Prefer the corresponding gap token on new pages. |
| `radius` | `number \| "full"` | — | Legacy scalar radius. Prefer radius tokens or component public radius controls on new pages. |
| `border` | `number` | — | Legacy border field. Prefer border tokens or a component public border control. |
| `innerBorder` | `boolean \| string` | — | Legacy inner-border field. Prefer public component controls and registered tokens; an inner border may be created without this input. |
| `fontSize` | `number \| string` | — | Legacy font-size field. New pages pair --text-* with --leading-* instead of using size tokens for typography. |
| `minWidth` | `number \| string` | — | Minimum width. Numbers become pixels; strings are CSS values. Prefer tokens or suitable layout expressions in new designs. |
| `minHeight` | `number \| string` | — | Legacy minimum height. Express ordinary page sizing through root style and size tokens rather than unclear scalar parsing. |
| `width` | `number \| string` | — | Width. Numbers become pixels; strings are CSS values. Prefer the component API and tokens in new code. |
| `height` | `number \| string` | — | Legacy height field. Use root style and size tokens for ordinary page layout. |
| `opacity` | `number` | — | Root opacity. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
