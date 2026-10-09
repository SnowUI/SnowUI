<!--
  Separator 组件：通用 UI 分割线
  v1.0.1

  继承 Frame.svelte 的通用能力。用于 UI 区域或项目之间的分隔，不承担图表坐标线语义。
-->

<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import type { Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import { getButtonGroup } from "../context";
    import {
        mergeComponentPartProps,
        useComponentPart,
    } from "../logic/component-parts.svelte";

    interface Props extends FrameProps {
        row?: boolean;
        column?: boolean;
        length?: string | number;
        thickness?: string | number;
        rounded?: boolean;
        decorative?: boolean;
        children?: Snippet;
        [key: string]: any;
    }

    const inheritedSeparatorPart = useComponentPart<Props>("Separator");
    let explicitProps: Props = $props();
    let {
        row = false,
        column = false,
        length = undefined,
        thickness = undefined,
        rounded = true,
        decorative = true,
        class: className = "",
        style: userStyle = "",
        children,
        ...rest
    }: Props = $derived(
        mergeComponentPartProps(inheritedSeparatorPart.current, explicitProps),
    );

    const buttonGroupCtx = getButtonGroup();
    const resolvedDirection = $derived(row || !column ? "row" : "column");

    function toCssLength(value: string | number | undefined) {
        if (value === undefined || value === null || value === "") return "";
        if (typeof value === "number") return `${value}px`;
        return value;
    }

    const separatorStyle = $derived.by(() => {
        const buttonGroupLength =
            buttonGroupCtx?.present && resolvedDirection === "column"
                ? buttonGroupCtx.size === "lg"
                    ? "var(--size-5)"
                    : buttonGroupCtx.size === "md"
                      ? "var(--size-4)"
                      : "var(--size-3)"
                : "";
        const buttonGroupColor =
            buttonGroupCtx?.present
                ? buttonGroupCtx.variant === "filled"
                    ? "var(--snowui-button-group-separator-filled-color, var(--static-white-20, #ffffff33))"
                    : "var(--snowui-button-group-separator-color, var(--black-10, #0000001a))"
                : "";
        const styles = [
            buttonGroupLength
                ? `--snowui-separator-length: ${buttonGroupLength}`
                : "",
            buttonGroupColor
                ? `--snowui-separator-color: ${buttonGroupColor}`
                : "",
            length !== undefined
                ? `--snowui-separator-length: ${toCssLength(length)}`
                : "",
            thickness !== undefined
                ? `--snowui-separator-thickness: ${toCssLength(thickness)}`
                : "",
            userStyle,
        ].filter(Boolean);
        return styles.length ? styles.join("; ") : undefined;
    });
</script>

<Frame
    tag="span"
    class={[
        "snowui-separator",
        `snowui-separator-${resolvedDirection}`,
        rounded ? "snowui-separator-rounded" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ")}
    data-direction={resolvedDirection}
    aria-hidden={decorative ? "true" : undefined}
    role={decorative ? undefined : "separator"}
    style={separatorStyle}
    enableResponsive={false}
    enableContext={true}
    enableScaleObserver={false}
    enableDefaultMotion={false}
    {...rest}
    renderHints={{
        variant: rest.renderHints?.variant ?? "line",
        width: rest.renderHints?.width ?? (resolvedDirection === "row" ? "100%" : "var(--border-1)"),
        height: rest.renderHints?.height ?? (resolvedDirection === "row" ? "var(--border-1)" : "100%"),
        radius: rest.renderHints?.radius ?? (rounded ? "var(--radius-full)" : "0"),
        rows: rest.renderHints?.rows,
    }}
>
    {@render children?.()}
</Frame>

<style>
    :global(:where(.snowui-separator)) {
        display: inline-block;
        flex: 0 0 auto;
        box-sizing: border-box;
        background-color: var(
            --snowui-separator-color-override,
            var(--snowui-separator-color, var(--black-10, #0000001a))
        );
        border-radius: var(--snowui-separator-radius, 0);
        pointer-events: none;
    }

    :global(:where(.snowui-separator-rounded)) {
        --snowui-separator-radius: var(--radius-full);
    }

    :global(:where(.snowui-separator-row)) {
        width: var(--snowui-separator-length, 100%);
        height: var(
            --snowui-separator-thickness-override,
            var(--snowui-separator-thickness, 0.03125rem)
        );
    }

    :global(:where(.snowui-separator-column)) {
        width: var(
            --snowui-separator-thickness-override,
            var(--snowui-separator-thickness, 0.03125rem)
        );
        height: var(--snowui-separator-length, 100%);
    }
</style>
