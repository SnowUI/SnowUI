<!-- SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!--
 Skeleton 骨架屏组件
 v1.4.0

 变更记录 (2026-08-15):
 - `renderHints` 成为组件自注册协议并优先于 class 映射；集中 class 映射仅保留兼容用途
 - 完整消费 `renderHints.radius`，Frame 首层探测可保留组件声明的圆角

 变更记录 (2026-03-14):
 - Input 骨架高度同步到 44px，和 Input 默认 14 字号 + 12/16 padding 样式保持一致

 变更记录 (2026-03-07):
 - Docs: 同步补齐 Skeleton 规则文档，明确形状、默认尺寸、布局、组件映射与第一层渲染规则
 - Text 多条骨架改为上下布局；前置行宽度占满文本容器，最后一行固定为容器宽度的 30%
 - 非圆形骨架默认圆角统一为 12；text/line 骨架默认高度调整为 20
 - 矩形骨架默认圆角明确为 12（`--radius-3`, fallback `0.75rem`）
 - 释放 whileLoad 关键字：Skeleton 改用 loading 控制显隐，配合 Frame 的 loading / skeleton 协议
 - 补齐 Skeleton 组件覆盖清单：新增 frame / test 映射，供 standards 校验与运行时协议统一识别
 - 重构为不依赖 Frame 的通用骨架渲染器，供 Frame 加载协议与测试示例共同复用
 - 骨架形状收敛为三类：line / circle / rect
 - 新增基于组件根类名的集中映射分配，Frame 加载态可直接按组件类型渲染骨架

 I. 骨架加载规范 (Skeleton Loading Standard)
 所有在页面初始载入时即显示的组件必须支持骨架加载，用于数据加载过程中的视觉占位。

 II. 核心功能:
    - 支持三种形状: line, circle, rect
    - 支持根据组件根类名自动匹配骨架布局
    - 支持显式宽高与响应式宽高
-->

<script module lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import type { RenderHints } from "../logic/frame-types";

    export type SkeletonVariant =
        | "line"
        | "circle"
        | "rect"
        | "text"
        | "circular"
        | "rectangular";

    export interface SkeletonItem {
        shape: "line" | "circle" | "rect";
        width?: string;
        height?: string;
        radius?: string;
        className?: string;
    }

    export interface SkeletonLayout {
        key: string;
        known: boolean;
        items: SkeletonItem[];
    }

    const COMPONENT_CLASS_MAPPING: Array<[RegExp, string]> = [
        [/\bsnowui-accordion-item\b/, "accordion-item"],
        [/\bsnowui-accordion\b/, "accordion"],
        [/\bsnowui-field\b/, "field"],
        [/\bsnowui-search-input\b/, "search-input"],
        [/\bsnowui-search-box\b/, "search-box"],
        [/\bsnowui-search-popup\b/, "search-popup"],
        [/\bsnowui-input\b/, "input"],
        [/\bsnowui-textarea\b/, "textarea"],
        [/\bsnowui-select\b/, "select"],
        [/\bsnowui-listbox\b/, "listbox"],
        [/\bsnowui-image-viewer\b/, "image-viewer"],
        [/\bsnowui-image-group\b/, "image-group"],
        [/\bsnowui-image\b/, "image"],
        [/\bsnowui-gradient\b/, "gradient"],
        [/\bsnowui-snow-ui-logo\b/, "snow-uilogo"],
        [/\bsnowui-avatar-group\b/, "avatar-group"],
        [/\bsnowui-avatar\b/, "avatar"],
        [/\bsnowui-flow-text\b/, "flow-text"],
        [/\bsnowui-circular-chart\b/, "circular-chart"],
        [/\bsnowui-gauge-chart\b/, "gauge-chart"],
        [/\bsnowui-chart-group\b/, "chart-group"],
        [/\bsnowui-line-chart\b/, "line-chart"],
        [/\bsnowui-bar-chart\b/, "bar-chart"],
        [/\bsnowui-button-group\b/, "button-group"],
        [/\bsnowui-breadcrumb\b/, "breadcrumb"],
        [/\bsnowui-card\b/, "card"],
        [/\bsnowui-scroll-area\b/, "scroll-area"],
        [/\bsnowui-pagination\b/, "pagination"],
        [/\bsnowui-progress\b/, "progress"],
        [/\bsnowui-separator\b/, "separator"],
        [/\bsnowui-button\b/, "button"],
        [/\bsnowui-text\b/, "text"],
        [/\bsnowui-badge\b/, "badge"],
        [/\bsnowui-chip\b/, "chip"],
        [/\bsnowui-link\b/, "link"],
        [/\bsnowui-tag\b/, "tag"],
        [/\bsnowui-copy-link\b/, "copy-link"],
        [/\bsnowui-code-block\b/, "code-block"],
        [/\bsnowui-kbd\b/, "kbd"],
        [/\bsnowui-switch\b/, "switch"],
        [/\bsnowui-spinner\b/, "spinner"],
        [/\bsnowui-radio\b/, "radio"],
        [/\bsnowui-icon\b/, "icon"],
        [/\bsnowui-checkbox\b/, "checkbox"],
        [/\bsnowui-tooltip\b/, "tooltip"],
        [/\bsnowui-popover\b/, "popover"],
        [/\bsnowui-dialog\b/, "dialog"],
        [/\bsnowui-menu-item\b/, "menu-item"],
        [/\bsnowui-quick-action\b/, "quick-action"],
        [/\bsnowui-toast\b/, "toast"],
        [/\bsnowui-segmented\b/, "segmented"],
        [/\bsnowui-tab\b/, "tab"],
        [/\bsnowui-frame\b/, "frame"],
        [/\bsnowui-test\b/, "test"],
    ];

    function toCssLength(value?: string | number): string | undefined {
        if (value === undefined || value === null || value === "") {
            return undefined;
        }
        if (typeof value === "number") {
            return `${value / 16}rem`;
        }
        return value;
    }

    function fit(length: string): string {
        return length; // min(100%, length) 会导致在 flex/auto 容器中宽度收缩为 0。改在 CSS 中加 max-width兜底
    }

    function normalizeVariant(
        variant?: SkeletonVariant,
    ): "line" | "circle" | "rect" {
        if (variant === "text") return "line";
        if (variant === "circular") return "circle";
        if (variant === "rectangular") return "rect";
        return variant ?? "rect";
    }

    export function getSkeletonComponentKey(
        componentClass?: string,
    ): string | undefined {
        if (!componentClass) return undefined;
        for (const [pattern, key] of COMPONENT_CLASS_MAPPING) {
            if (pattern.test(componentClass)) {
                return key;
            }
        }
        return undefined;
    }

    function createSingleLayout(
        key: string,
        shape: "line" | "circle" | "rect",
        width?: string,
        height?: string,
        radius?: string,
    ): SkeletonLayout {
        return {
            key,
            known: true,
            items: [{ shape, width, height, radius }],
        };
    }

    function createTextLayout(
        key: string,
        rows: number,
        width?: string,
        height?: string,
        radius?: string,
    ): SkeletonLayout {
        const safeRows = Math.max(1, Math.floor(rows));
        const fullWidth = width ?? "100%";
        return {
            key,
            known: true,
            items: Array.from({ length: safeRows }, (_, index) => ({
                shape: "line" as const,
                width:
                    safeRows > 1 && index === safeRows - 1
                        ? "30%"
                        : fullWidth,
                height,
                radius,
            })),
        };
    }

    function applyRenderHints(
        layout: SkeletonLayout,
        hints?: RenderHints,
        explicit?: {
            variant?: SkeletonVariant;
            width?: string | number;
            height?: string | number;
        },
    ): SkeletonLayout {
        const variant = explicit?.variant ?? hints?.variant;
        const width = toCssLength(explicit?.width ?? hints?.width);
        const height = toCssLength(explicit?.height ?? hints?.height);
        const radius = toCssLength(hints?.radius);
        const rows = hints?.rows;

        if (!variant && !width && !height && !radius && rows === undefined) {
            return layout;
        }

        return {
            ...layout,
            items:
                rows !== undefined && rows > 1
                    ? createTextLayout(
                          layout.key,
                          rows,
                          width ?? layout.items[0]?.width,
                          height ?? layout.items[0]?.height,
                          radius ?? layout.items[0]?.radius,
                      ).items
                    : layout.items.map((item) => ({
                          ...item,
                          shape: variant
                              ? normalizeVariant(variant)
                              : item.shape,
                          width: width ?? item.width,
                          height: height ?? item.height,
                          radius: radius ?? item.radius,
                      })),
        };
    }

    function createRegisteredLayout(options: {
        renderHints: RenderHints;
        variant?: SkeletonVariant;
        width?: string | number;
        height?: string | number;
    }): SkeletonLayout {
        const variant = options.variant ?? options.renderHints.variant;
        const width = toCssLength(
            options.width ?? options.renderHints.width,
        );
        const height = toCssLength(
            options.height ?? options.renderHints.height,
        );
        const radius = toCssLength(options.renderHints.radius);
        const rows = options.renderHints.rows;

        if (rows !== undefined && rows > 1) {
            return createTextLayout(
                "registered",
                rows,
                width ?? "100%",
                height ?? "1.25rem",
                radius,
            );
        }

        return createSingleLayout(
            "registered",
            normalizeVariant(variant),
            width ?? "6rem",
            height ?? "3rem",
            radius,
        );
    }

    export function resolveSkeletonLayout(
        options: {
            componentClass?: string;
            renderHints?: RenderHints;
            variant?: SkeletonVariant;
            width?: string | number;
            height?: string | number;
        } = {},
    ): SkeletonLayout {
        if (options.renderHints) {
            return createRegisteredLayout({
                renderHints: options.renderHints,
                variant: options.variant,
                width: options.width,
                height: options.height,
            });
        }

        const componentKey = getSkeletonComponentKey(options.componentClass);
        if (
            !componentKey &&
            (options.variant || options.width !== undefined || options.height !== undefined)
        ) {
            return createSingleLayout(
                "explicit",
                normalizeVariant(options.variant),
                toCssLength(options.width),
                toCssLength(options.height),
            );
        }

        switch (componentKey) {
            case "accordion":
            case "accordion-item":
                return applyRenderHints(
                    createTextLayout(
                        componentKey,
                        3,
                        fit("100%"),
                        fit("var(--leading-14)"),
                    ),
                    options.renderHints,
                    options,
                );
            case "text":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "line",
                        fit("100%"),
                        fit("1.25rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "card":
            case "scroll-area":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("100%"),
                        fit("6rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "flow-text":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "line",
                        fit("4rem"),
                        fit("1rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "circular-chart":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "circle",
                        fit("15rem"),
                        fit("15rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "gauge-chart":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("20rem"),
                        fit("10rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "line-chart":
            case "bar-chart":
            case "chart-group":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("50rem"),
                        fit("25rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "button":
            case "button-group":
            case "breadcrumb":
            case "pagination":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "line",
                        fit("5rem"),
                        fit("1rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "separator":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "line",
                        fit("100%"),
                        fit("var(--border-1)"),
                    ),
                    options.renderHints,
                    options,
                );
            case "progress":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "line",
                        fit("100%"),
                        fit("calc(var(--size-4) / 4)"),
                    ),
                    options.renderHints,
                    options,
                );
            case "input":
            case "search-input":
            case "search-box":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "line",
                        fit("100%"),
                        fit("1.25rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "search-popup":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("37.5rem"),
                        fit("48rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "field":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("100%"),
                        fit("1.25rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "textarea":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("100%"),
                        fit("calc((var(--leading-14) * 4) + var(--padding-3) + var(--padding-6))"),
                    ),
                    options.renderHints,
                    options,
                );
            case "select":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "line",
                        fit("100%"),
                        fit("1.25rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "listbox":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("10rem"),
                        fit("8rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "badge":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "line",
                        fit("2.5rem"),
                        fit("1rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "chip":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "line",
                        fit("3rem"),
                        fit("1rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "link":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "line",
                        fit("4rem"),
                        fit("1.25rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "tag":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "line",
                        fit("3rem"),
                        fit("1.25rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "copy-link":
                return applyRenderHints(
                    createSingleLayout(componentKey, "rect", fit("100%"), fit("2.75rem")),
                    options.renderHints,
                    options,
                );
            case "code-block":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("100%"),
                        fit("12rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "kbd":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "line",
                        fit("3rem"),
                        fit("1.25rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "switch":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "line",
                        fit("2.5rem"),
                        fit("1.5rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "avatar":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "circle",
                        fit("2.5rem"),
                        fit("2.5rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "spinner":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "circle",
                        fit("1.5rem"),
                        fit("1.5rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "radio":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "circle",
                        fit("1.25rem"),
                        fit("1.25rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "icon":
                return applyRenderHints(
                    {
                        key: componentKey,
                        known: true,
                        items: [
                            {
                                shape: "rect",
                                width: fit("1.25rem"),
                                height: fit("1.25rem"),
                                radius: "50%",
                            },
                        ],
                    },
                    options.renderHints,
                    options,
                );
            case "checkbox":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("1.25rem"),
                        fit("1.25rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "tooltip":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("4.5rem"),
                        fit("2rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "toast":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("12rem"),
                        fit("2.25rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "tab":
            case "segmented":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("12rem"),
                        fit("1.5rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "popover":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("7rem"),
                        fit("5rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "dialog":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("20rem"),
                        fit("10rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "frame":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "line",
                        fit("100%"),
                        fit("1.25rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "test":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("5rem"),
                        fit("2rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "anchor":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "line",
                        fit("4rem"),
                        fit("1rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "avatar-group":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "circle",
                        fit("1rem"),
                        fit("1rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "image":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("2.5rem"),
                        fit("2.5rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "gradient":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("calc(var(--size-4) * 45 / 2)"),
                        fit("calc(var(--size-4) * 45 / 2)"),
                    ),
                    options.renderHints,
                    options,
                );
            case "snow-uilogo":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("calc(var(--size-4) * 105 / 16)"),
                        fit("calc(var(--size-4) * 28 / 16)"),
                    ),
                    options.renderHints,
                    options,
                );
            case "image-group":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("5rem"),
                        fit("2.5rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "image-viewer":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("7rem"),
                        fit("5rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "quick-action":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "rect",
                        fit("10rem"),
                        fit("6rem"),
                    ),
                    options.renderHints,
                    options,
                );
            case "menu-item":
                return applyRenderHints(
                    createSingleLayout(
                        componentKey,
                        "line",
                        fit("100%"),
                        fit("2rem"),
                    ),
                    options.renderHints,
                    options,
                );
            default:
                return applyRenderHints(
                    {
                        key: "fallback",
                        known: false,
                        items: [
                            {
                                shape: "rect",
                                width: fit("6rem"),
                                height: fit("3rem"),
                            },
                        ],
                    },
                    options.renderHints,
                    options,
                );
        }
    }
</script>

<script lang="ts">
    import type { Snippet } from "svelte";
    import type { RenderHints as FrameRenderHints } from "../logic/frame-types";
    import {
        ResponsiveController,
        type ResponsiveConfig,
    } from "../logic/responsive.svelte";

    interface Props {
        variant?: SkeletonVariant;
        width?: string | number;
        height?: string | number;
        componentClass?: string;
        renderHints?: FrameRenderHints;
        loading?: boolean;
        responsive?: ResponsiveConfig;
        class?: string;
        style?: string;
        children?: Snippet;
        [key: string]: any;
    }

    let {
        variant = undefined,
        width,
        height,
        componentClass = undefined,
        renderHints = undefined,
        loading = true,
        responsive = undefined,
        class: className = "",
        style = "",
        children,
        ...rest
    }: Props = $props();

    function createResponsiveController() {
        return new ResponsiveController(responsive ?? {});
    }

    const responsiveController = createResponsiveController();

    $effect(() => {
        responsiveController.updateConfig(responsive ?? {});
    });

    const responsiveWidth = $derived(
        responsiveController.props?.width ?? width,
    );
    const responsiveHeight = $derived(
        responsiveController.props?.height ?? height,
    );
    const layout = $derived(
        resolveSkeletonLayout({
            componentClass,
            renderHints,
            variant,
            width: responsiveWidth,
            height: responsiveHeight,
        }),
    );

    const containerClass = $derived.by(() => {
        return [
            "snowui-skeleton-layout",
            `snowui-skeleton-layout-${layout.key}`,
            layout.items.length === 1 ? "snowui-skeleton-layout-single" : "",
            layout.items.length > 1 ? "snowui-skeleton-layout-text" : "",
            layout.items.length > 1 ? className : "",
        ]
            .filter(Boolean)
            .join(" ");
    });

    const containerStyle = $derived.by(() => {
        if (layout.items.length === 1) return undefined;
        return (
            [
                layout.items[0]?.width
                    ? `--snowui-skeleton-layout-width: ${layout.items[0].width}`
                    : "",
                style,
                responsiveController.style,
            ]
                .filter(Boolean)
                .join(";") ||
            undefined
        );
    });

    function getItemStyle(
        item: SkeletonItem,
        isSingle: boolean,
    ): string | undefined {
        return (
            [
                item.width ? `--snowui-skeleton-width: ${item.width}` : "",
                item.height ? `--snowui-skeleton-height: ${item.height}` : "",
                item.radius ? `--snowui-skeleton-radius: ${item.radius}` : "",
                isSingle ? style : "",
                isSingle ? responsiveController.style : "",
            ]
                .filter(Boolean)
                .join(";") || undefined
        );
    }

    function getItemClass(item: SkeletonItem, isSingle: boolean): string {
        return [
            "snowui-skeleton",
            `snowui-skeleton-${item.shape}`,
            item.shape === "rect" ? "snowui-rounded-rectangle" : "",
            item.className,
            isSingle ? className : "",
        ]
            .filter(Boolean)
            .join(" ");
    }
</script>

{#if loading}
    <div
        {...rest}
        use:responsiveController.connect
        class={containerClass}
        style={containerStyle}
        data-skeleton-registered={renderHints !== undefined ? "true" : undefined}
        data-render-hint-variant={renderHints?.variant}
        data-render-hint-width={toCssLength(renderHints?.width)}
        data-render-hint-height={toCssLength(renderHints?.height)}
        data-render-hint-radius={toCssLength(renderHints?.radius)}
        data-render-hint-rows={renderHints?.rows}
        aria-busy="true"
        aria-hidden="true"
    >
        {#each layout.items as item, index}
            <div
                data-slot="skeleton"
                data-index={index}
                class={getItemClass(item, layout.items.length === 1)}
                style={getItemStyle(item, layout.items.length === 1)}
            ></div>
        {/each}
    </div>
{:else if children}
    {@render children()}
{/if}

<style>
    @keyframes snowui-skeleton-pulse {
        50% {
            opacity: 0.5;
        }
    }

    :global(:where(.snowui-skeleton-layout)) {
        --snowui-skeleton-gap: var(--gap-2);
        --snowui-skeleton-font-size: var(--text-14);
        --snowui-skeleton-line-height: var(--leading-14);
        display: flex;
        align-items: center;
        gap: var(--snowui-skeleton-gap-override, var(--snowui-skeleton-gap));
        font-size: var(
            --snowui-skeleton-font-size-override,
            var(--snowui-skeleton-font-size)
        );
        line-height: var(
            --snowui-skeleton-line-height-override,
            var(--snowui-skeleton-line-height)
        );
    }

    :global(:where(.snowui-skeleton-layout-single)) {
        display: block;
    }

    :global(:where(.snowui-skeleton-layout-avatar-group)) {
        gap: 0;
    }

    :global(:where(.snowui-skeleton-layout-text)) {
        width: var(--snowui-skeleton-layout-width, 100%);
        max-width: 100%;
        flex-direction: column;
        align-items: stretch;
    }

    :global(
            :where(.snowui-skeleton-layout-avatar-group)
                > .snowui-skeleton
                + .snowui-skeleton
        ) {
        translate: calc(var(--padding-2) * -1) 0;
    }

    :global(:where(.snowui-skeleton)) {
        --snowui-skeleton-background: var(--black-10, #0000001a);
        user-select: none;
        pointer-events: none;
        display: block;
        background-color: var(
            --snowui-skeleton-background-override,
            var(--snowui-skeleton-background)
        );
        animation: snowui-skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1)
            infinite;
    }

    :global(:where(.snowui-skeleton-line)) {
        --snowui-skeleton-line-radius: var(--radius-3, 0.75rem);
        width: var(
            --snowui-skeleton-width-override,
            var(--snowui-skeleton-width, 6rem)
        );
        height: var(
            --snowui-skeleton-height-override,
            var(--snowui-skeleton-height, 1.25rem)
        );
        max-width: 100%;
        max-height: 100%;
        border-radius: var(
            --snowui-skeleton-radius-override,
            var(
                --snowui-skeleton-radius,
                var(
                    --snowui-skeleton-line-radius-override,
                    var(--snowui-skeleton-line-radius)
                )
            )
        );
    }

    :global(:where(.snowui-skeleton-circle)) {
        width: var(
            --snowui-skeleton-width-override,
            var(--snowui-skeleton-width, 2.5rem)
        );
        height: var(
            --snowui-skeleton-height-override,
            var(--snowui-skeleton-height, 2.5rem)
        );
        max-width: 100%;
        max-height: 100%;
        border-radius: var(--radius-full, 9999px);
        flex-shrink: 0;
    }

    :global(:where(.snowui-skeleton-rect)) {
        --snowui-skeleton-rect-radius: var(--radius-3, 0.75rem);
        width: var(
            --snowui-skeleton-width-override,
            var(--snowui-skeleton-width, 6rem)
        );
        height: var(
            --snowui-skeleton-height-override,
            var(--snowui-skeleton-height, 3rem)
        );
        max-width: 100%;
        max-height: 100%;
        border-radius: var(
            --snowui-skeleton-radius-override,
            var(
                --snowui-skeleton-radius,
                var(
                    --snowui-skeleton-rect-radius-override,
                    var(--snowui-skeleton-rect-radius)
                )
            )
        );
    }
</style>
