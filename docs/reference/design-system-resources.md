# SnowUI design-system resources and relationships

Relationship fingerprint: `6fa5e2a1bc25c170`; component source baseline: `1.2.4`. Regenerate and check this directory, mappings, and source download links whenever the component package version changes. Source fingerprints identify the authoritative source; summary pages may include only consumer-facing excerpts.

## Resource directory

| Resource | Responsibility | Authority | Read or obtain | Source fingerprint |
| --- | --- | --- | --- | --- |
| Figma component and variable mapping | Maps original file identities, components, and variables to code tokens; relocate in your copy. | verified reference | [Read](./figma-map.md) · [JSON](https://snowui.dev/llms/figma-map.json) | `d755f579d91e41e8` |
| Figma to SnowUI | Translates Figma properties, styles, and variables to public component entries or tokens. | mapping rule | [Read](../guides/figma.md) | `5fa56d0e5ed8558f` |
| Natural language to SnowUI | Consumer summary for natural language and component selection; see the source document for full guidance. | consumer summary | [Read](../guides/component-selection.md) | `08b604a6e3064cd6` |
| Style recommendations | Consumer summary of optional style suggestions; exact values remain in CSS and the design input. | consumer summary | [Read](../guides/styling.md) | `0ed39937b70372c3` |
| Page utilities CSS | Actual optional page utility declarations; active only when imported by the application. | CSS implementation | [Read](https://snowui.dev/design-system/snowui-utilities.d5a8d46f5bc18b9b.css) | `d5a8d46f5bc18b9b` |
| Responsive utilities CSS | Actual optional responsive declarations; import separately when needed. | CSS implementation | [Read](https://snowui.dev/design-system/snowui-responsive.55c150e2bf51516d.css) | `55c150e2bf51516d` |
| Component tokens and themes | Component declarations and theme conditions; the versioned source ZIP contains the original CSS. | CSS implementation | [Read](./tokens.md) · [JSON](https://snowui.dev/llms/tokens.json) · [Source ZIP](https://snowui.dev/downloads/source/v1.2.4/snowui-source-1.2.4-license-2.4.0.zip) | `2a6eba2ca0cc2df3` |
| Public component APIs | Component directory, APIs, composition, and styles; verify against the installed version. | public API | [Read](../components/index.md) · [JSON](https://snowui.dev/component-catalog.json) · [Source ZIP](https://snowui.dev/downloads/source/v1.2.4/snowui-source-1.2.4-license-2.4.0.zip) | `1a300982b9e398b9` |
| Figma Community resource | Obtain design resources from Figma Community. | external resource | [Read](https://www.figma.com/community/file/1388431032861751537) | `external` |

## Relationship and change path

- Obtain the Community resource → locate the matching page or collection, name, type, mode, and current value in your own copy → read the [public mapping](./figma-map.md) → [Figma guide](../guides/figma.md) → [token declarations](./tokens.md) → the affected component API. Original node IDs and Code Connect bindings do not automatically transfer to copies.
- For a component change, read only the relevant [component directory entry](../components/index.md), mapping, and design node. Verify variants and interactions; do not mistake a local override for a global token change.
- For a geometry baseline change, check Standard and derived Figma modes, the matching token, optional [utilities](https://snowui.dev/design-system/snowui-utilities.d5a8d46f5bc18b9b.css) and [responsive utilities](https://snowui.dev/design-system/snowui-responsive.55c150e2bf51516d.css), and consuming components. CSS scale does not replace the Figma mode rule. Record manual Figma steps when editing access is unavailable.
- Online AI tools should fetch only relevant HTTPS resources. A pasted copy does not update automatically; compare fingerprints and fetch again.

[Machine-readable relationships](https://snowui.dev/llms/design-system-resources.json) · [Figma mapping data](https://snowui.dev/llms/figma-map.json)
