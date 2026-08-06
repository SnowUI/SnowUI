import type { TableContext } from "./table-context.svelte";
import {
    createProgressiveBlurStyles,
    createUniformBlurStyles,
    type ProgressiveBlurDirection,
} from "./progressive-blur";

const MAX_CACHE_ENTRIES = 32;
const cache = new Map<string, ReturnType<typeof createProgressiveBlurStyles>>();

/** Reuses the immutable CSS layer description shared by every role cell. */
export function getTableRoleBlurStyles(
    table: TableContext,
    direction: ProgressiveBlurDirection,
) {
    const mode = table.getRoleOverlayBlurMode();
    const layerCount = table.getRoleOverlayLayers();
    const edgeFeatherRatio = table.getRoleOverlayUniformFeather();
    const key = `${mode}:${layerCount}:${edgeFeatherRatio}:${direction}`;
    const cached = cache.get(key);
    if (cached) return cached;

    const options = {
        direction,
        layerCount,
        width: "var(--snowui-table-role-overlay-width-override, calc((var(--size-12, 3rem) + var(--size-14, 3.5rem)) / 3))",
        sampleExtension: "var(--snowui-table-role-overlay-sample-extension-override, 4rem)",
        maxBlur: "var(--snowui-table-role-overlay-blur-override, 0rem)",
        minBlur: "0rem",
        leadWidthRatio: 0.1,
        endRatio: 0.72,
        featherRatio: 2.8,
        tailOpacity: 0,
        edgeFeatherRatio,
        tintColor: "#ffffff",
        tintOpacity: "var(--snowui-table-role-overlay-tint-opacity-override, 0%)",
    };
    const styles = mode === "uniform"
        ? createUniformBlurStyles(options)
        : createProgressiveBlurStyles(options);
    cache.set(key, styles);
    if (cache.size > MAX_CACHE_ENTRIES) {
        cache.delete(cache.keys().next().value as string);
    }
    return styles;
}
