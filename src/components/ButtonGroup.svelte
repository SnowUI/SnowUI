<!--
  ButtonGroup 组件：按钮分组容器
  v1.1.0

  作为多个嵌入态 Button + Separator 的分组外壳。Button 负责单元格交互，ButtonGroup 负责统一外壳视觉与间距。
-->

<script lang="ts">
    import { setContext, type Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import { getSize } from "../context";
    import { BUTTON_COLLECTION_CONTEXT_KEY, BUTTON_GROUP_CONTEXT_KEY } from "../keys";

    type ButtonGroupVariant = "gray" | "filled" | "outline" | "borderless";
    type ButtonGroupSize = "sm" | "md" | "lg";

    interface Props extends Omit<FrameProps, "size"> {
        variant?: ButtonGroupVariant;
        size?: ButtonGroupSize;
        disabled?: boolean;
        children?: Snippet;
        [key: string]: any;
    }

    let {
        variant = "gray",
        size = undefined,
        disabled = false,
        class: className = "",
        style: userStyle = "",
        renderHints: userRenderHints = undefined,
        use: userUse = [],
        children,
        ...rest
    }: Props = $props();

    function markButtonGroupCells(node: HTMLElement) {
        const update = () => {
            const styles = getComputedStyle(node);
            const setHostPadding = (name: string, value: string) => {
                if (node.style.getPropertyValue(name) !== value) {
                    node.style.setProperty(name, value);
                }
            };
            setHostPadding(
                "--snowui-button-group-host-padding-top",
                styles.paddingTop,
            );
            setHostPadding(
                "--snowui-button-group-host-padding-right",
                styles.paddingRight,
            );
            setHostPadding(
                "--snowui-button-group-host-padding-bottom",
                styles.paddingBottom,
            );
            setHostPadding(
                "--snowui-button-group-host-padding-left",
                styles.paddingLeft,
            );

            const cells = Array.from(node.children).filter(
                (child): child is HTMLElement =>
                    child instanceof HTMLElement &&
                    child.dataset.as === "item",
            );

            cells.forEach((cell, index) => {
                const position =
                    cells.length === 1
                        ? "only"
                        : index === 0
                          ? "first"
                          : index === cells.length - 1
                            ? "last"
                            : "middle";

                cell.classList.remove(
                    "snowui-button-group-cell-only",
                    "snowui-button-group-cell-first",
                    "snowui-button-group-cell-middle",
                    "snowui-button-group-cell-last",
                );
                cell.classList.add(`snowui-button-group-cell-${position}`);
            });
        };

        update();

        const observer = new MutationObserver(update);
        observer.observe(node, {
            childList: true,
            subtree: false,
            attributes: true,
            attributeFilter: ["class", "style"],
        });

        return {
            destroy() {
                observer.disconnect();
            },
        };
    }

    const contextSize = getSize();
    const resolvedSize = $derived.by(() => {
        if (size) return size;
        if (contextSize === undefined) return "sm";
        if (typeof contextSize === "number") {
            if (contextSize <= 16) return "sm";
            if (contextSize <= 28) return "md";
            return "lg";
        }
        return "sm";
    });

    setContext(BUTTON_GROUP_CONTEXT_KEY, {
        present: true,
        get size() {
            return resolvedSize;
        },
        get variant() {
            return variant;
        },
        get disabled() {
            return disabled;
        },
    });
    setContext(BUTTON_COLLECTION_CONTEXT_KEY, { scaleOnHover: false });

    const buttonGroupRenderHints = $derived.by(() => {
        const base =
            resolvedSize === "lg"
                ? {
                      variant: "line",
                      width: "10rem",
                      height: "3rem",
                      radius: "var(--radius-5)",
                  }
                : resolvedSize === "md"
                  ? {
                        variant: "line",
                        width: "9rem",
                        height: "2.25rem",
                        radius: "var(--radius-4)",
                    }
                  : {
                        variant: "line",
                        width: "8rem",
                        height: "1.5rem",
                        radius: "var(--radius-3)",
                    };
        return {
            variant: userRenderHints?.variant ?? base.variant,
            width: userRenderHints?.width ?? base.width,
            height: userRenderHints?.height ?? base.height,
            radius: userRenderHints?.radius ?? base.radius,
        };
    });
</script>

<Frame
    tag="div"
    row
    class={[
        "snowui-button-group",
        "snowui-rounded-rectangle",
        `snowui-button-group-${variant}`,
        `snowui-button-group-${resolvedSize}`,
        className,
    ]
        .filter(Boolean)
        .join(" ")}
    data-variant={variant}
    data-disabled={disabled ? "true" : undefined}
    {disabled}
    style={userStyle || undefined}
    enableAutoLayout={false}
    enableResponsive={false}
    enableContext={true}
    enableScaleObserver={false}
    renderHints={buttonGroupRenderHints}
    use={[markButtonGroupCells, ...userUse]}
    {...rest}
>
    {@render children?.()}
</Frame>

<style>
    :global(:where(.snowui-button-group)) {
        display: inline-flex;
        width: max-content;
        max-width: 100%;
        align-self: flex-start;
        align-items: stretch;
        justify-content: center;
        flex-wrap: nowrap;
        box-sizing: border-box;
        border: none;
        outline: none;
        text-decoration: none;
        cursor: var(--snowui-state-cursor, pointer);
        overflow: hidden;
        --snowui-frame-component-transition:
            color var(--snowui-frame-color-motion-duration, 0.15s) var(--snowui-frame-color-motion-easing, ease-out),
            background-color var(--snowui-frame-color-motion-duration, 0.15s) var(--snowui-frame-color-motion-easing, ease-out),
            --snowui-hover-overlay-opacity var(--snowui-frame-color-motion-duration, 0.15s) var(--snowui-frame-color-motion-easing, ease-out),
            border-color var(--snowui-frame-color-motion-duration, 0.15s) var(--snowui-frame-color-motion-easing, ease-out),
            box-shadow var(--snowui-frame-color-motion-duration, 0.15s) var(--snowui-frame-color-motion-easing, ease-out);

        --snowui-button-group-padding-block: var(
            --snowui-button-padding-block,
            var(--padding-1)
        );
        --snowui-button-group-padding-inline-outer: var(
            --snowui-button-padding-inline,
            var(--padding-3)
        );
        --snowui-button-group-gap: var(
            --snowui-button-group-gap-override,
            var(--gap-2)
        );
        --snowui-button-group-padding-inline-inner: var(
            --snowui-button-group-gap
        );
        --snowui-button-group-radius: var(
            --snowui-button-radius,
            var(--radius-3)
        );
        --snowui-button-group-font-size: var(
            --snowui-button-font-size,
            var(--text-12)
        );
        --snowui-button-group-line-height: var(
            --snowui-button-line-height,
            var(--leading-12)
        );
        --snowui-button-group-cell-gap: var(
            --snowui-button-gap,
            var(--gap-1)
        );
        --snowui-button-group-background: var(
            --snowui-button-background,
            var(--black-4, color-mix(in srgb, currentColor 4%, transparent))
        );
        --snowui-button-group-color: var(
            --snowui-button-color,
            currentColor
        );
        --snowui-button-group-border-color: var(
            --snowui-button-border-color,
            transparent
        );
        --snowui-button-group-border-width: var(
            --snowui-button-border-width,
            var(--border-1)
        );
        --snowui-button-group-separator-length: var(--size-3);
        --snowui-button-group-separator-color: var(--black-10, #0000001a);
        --snowui-button-group-separator-filled-color: var(--static-white-20, #ffffff33);
        --snowui-button-group-host-padding-top: 0px;
        --snowui-button-group-host-padding-right: 0px;
        --snowui-button-group-host-padding-bottom: 0px;
        --snowui-button-group-host-padding-left: 0px;
        padding: 0;
        gap: 0;
        border-radius: var(
            --snowui-button-group-radius-override,
            var(--snowui-button-group-radius)
        );
        font-size: var(
            --snowui-button-group-font-size-override,
            var(--snowui-button-group-font-size)
        );
        line-height: var(
            --snowui-button-group-line-height-override,
            var(--snowui-button-group-line-height)
        );
        background-color: var(
            --snowui-button-group-background-override,
            var(--snowui-button-group-background)
        );
        color: var(
            --snowui-button-group-color-override,
            var(--snowui-button-group-color)
        );
        box-shadow: inset 0 0 0
            var(
                --snowui-button-group-border-width-override,
                var(--snowui-button-group-border-width)
            )
            var(
                --snowui-button-group-border-color-override,
                var(--snowui-button-group-border-color)
            );
    }

    :global(:where(.snowui-button-group).snowui-button-group-md) {
        --snowui-button-group-padding-block: var(
            --snowui-button-padding-block,
            var(--padding-2)
        );
        --snowui-button-group-padding-inline-outer: var(
            --snowui-button-padding-inline,
            var(--padding-4)
        );
        --snowui-button-group-gap: var(
            --snowui-button-group-gap-override,
            var(--gap-3)
        );
        --snowui-button-group-padding-inline-inner: var(
            --snowui-button-group-gap
        );
        --snowui-button-group-radius: var(
            --snowui-button-radius,
            var(--radius-4)
        );
        --snowui-button-group-font-size: var(
            --snowui-button-font-size,
            var(--text-14)
        );
        --snowui-button-group-line-height: var(
            --snowui-button-line-height,
            var(--leading-14)
        );
        --snowui-button-group-cell-gap: var(
            --snowui-button-gap,
            calc((var(--gap-1) + var(--gap-2)) / 2)
        );
        --snowui-button-group-separator-length: var(--size-4);
    }

    :global(:where(.snowui-button-group).snowui-button-group-lg) {
        --snowui-button-group-padding-block: var(
            --snowui-button-padding-block,
            var(--padding-3)
        );
        --snowui-button-group-padding-inline-outer: var(
            --snowui-button-padding-inline,
            var(--padding-5)
        );
        --snowui-button-group-gap: var(
            --snowui-button-group-gap-override,
            var(--gap-4)
        );
        --snowui-button-group-padding-inline-inner: var(
            --snowui-button-group-gap
        );
        --snowui-button-group-radius: var(
            --snowui-button-radius,
            var(--radius-5)
        );
        --snowui-button-group-font-size: var(
            --snowui-button-font-size,
            var(--text-16)
        );
        --snowui-button-group-line-height: var(
            --snowui-button-line-height,
            var(--leading-16)
        );
        --snowui-button-group-cell-gap: var(
            --snowui-button-gap,
            var(--gap-2)
        );
        --snowui-button-group-separator-length: var(--size-5);
    }

    :global(:where(.snowui-button-group)[data-variant="filled"]) {
        --snowui-button-group-background: var(
            --snowui-button-background,
            var(--primary, #000000)
        );
        --snowui-button-group-color: var(
            --snowui-button-color,
            var(--static-white-100, #ffffff)
        );
        --snowui-button-group-border-color: var(
            --snowui-button-border-color,
            transparent
        );
    }

    :global(
            :where(.snowui-button-group):hover:not(.snowui-disabled):not([data-disabled="true"])
        ) {
        --snowui-hover-overlay-opacity: 0%;
    }

    :global(:where(.snowui-button-group)[data-variant="outline"]) {
        --snowui-button-group-background: var(
            --snowui-button-background,
            transparent
        );
        --snowui-button-group-border-color: var(
            --snowui-button-border-color,
            var(
                --black-10,
                color-mix(in srgb, currentColor 10%, transparent)
            )
        );
    }

    :global(:where(.snowui-button-group)[data-variant="borderless"]) {
        --snowui-button-group-background: var(
            --snowui-button-background,
            transparent
        );
        --snowui-button-group-border-color: var(
            --snowui-button-border-color,
            transparent
        );
    }

    :global(:where(.snowui-button-group) > [data-as="item"]) {
        flex: 0 1 auto;
        --snowui-button-group-cell-padding: var(
                --snowui-button-group-padding-block
            )
            var(--snowui-button-group-padding-inline-inner);
        --snowui-button-group-cell-extend-top: var(
            --snowui-button-group-host-padding-top,
            0px
        );
        --snowui-button-group-cell-extend-right: 0px;
        --snowui-button-group-cell-extend-bottom: var(
            --snowui-button-group-host-padding-bottom,
            0px
        );
        --snowui-button-group-cell-extend-left: 0px;
    }

    /* 外壳已经统一降到 20%；继承 disabled 的嵌入 Button 及其内容不再重复衰减。 */
    :global(
            .snowui-button-group[data-disabled="true"]
                > [data-as="item"].snowui-disabled
        ) {
        --snowui-button-group-content-opacity: 1;
        opacity: 1;
    }

    :global(
            :where(.snowui-button-group)
                > [data-as="item"].snowui-button-group-cell-only
        ) {
        --snowui-button-group-cell-padding: var(
                --snowui-button-group-padding-block
            )
            var(--snowui-button-group-padding-inline-outer);
        --snowui-button-group-cell-extend-right: var(
            --snowui-button-group-host-padding-right,
            0px
        );
        --snowui-button-group-cell-extend-left: var(
            --snowui-button-group-host-padding-left,
            0px
        );
    }

    :global(
            :where(.snowui-button-group)
                > [data-as="item"].snowui-button-group-cell-first
        ) {
        --snowui-button-group-cell-padding: var(
                --snowui-button-group-padding-block
            )
            var(--snowui-button-group-padding-inline-inner)
            var(--snowui-button-group-padding-block)
            var(--snowui-button-group-padding-inline-outer);
        --snowui-button-group-cell-extend-left: var(
            --snowui-button-group-host-padding-left,
            0px
        );
    }

    :global(
            :where(.snowui-button-group)
                > [data-as="item"].snowui-button-group-cell-last
        ) {
        --snowui-button-group-cell-padding: var(
                --snowui-button-group-padding-block
            )
            var(--snowui-button-group-padding-inline-outer)
            var(--snowui-button-group-padding-block)
            var(--snowui-button-group-padding-inline-inner);
        --snowui-button-group-cell-extend-right: var(
            --snowui-button-group-host-padding-right,
            0px
        );
    }

    :global(:where(.snowui-button-group) > [data-as="separator"]) {
        align-self: center;
    }
</style>
