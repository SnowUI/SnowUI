<!--
  Kbd 组件：键盘快捷键标签 v1.0.0

  布局模型：内联外壳布局（Inline Shell Layout）

  两种视觉样式：
    - border（默认/样式 A）：描边，透明底色
    - solid（样式 B）：实心底色，无描边

  详见：./Kbd.md
-->

<script lang="ts">
    import Frame, { type FrameProps } from "./Frame.svelte";
    import type { Snippet } from "svelte";

    interface Props extends FrameProps {
        variant?: "border" | "solid";
        children?: Snippet;
        [key: string]: any;
    }

    let {
        variant = "border",
        class: className = "",
        children,
        ...rest
    }: Props = $props();
</script>

<Frame
    as="kbd"
    enableResponsive={false}
    enableContext={false}
    enableScaleObserver={false}
    class={[
        "snowui-kbd",
        "snowui-rounded-rectangle",
        variant === "solid" ? "snowui-kbd-solid" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ")}
    renderHints={{
        variant: "line",
        height: "var(--size-5)",
        width: "3rem",
        radius: "calc(var(--radius-1) * 1.5)",
    }}
    {...rest}
>
    {@render children?.()}
</Frame>

<style>
    /* Level 2: Component Base（降权为 0） */
    :global(:where(.snowui-kbd)) {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        --snowui-kbd-padding: var(--padding-0) var(--padding-1);
        --snowui-kbd-radius: calc(var(--radius-1) * 1.5);
        --snowui-kbd-font-size: var(--text-12);
        --snowui-kbd-line-height: var(--leading-12);
        --snowui-kbd-bg: transparent;
        /* 描边默认使用 inset box-shadow（内边框，不占布局空间） */
        --snowui-kbd-shadow: inset 0 0 0 var(--border-1)
            var(--black-10, rgba(0, 0, 0, 0.1));

        padding: var(--snowui-kbd-padding-override, var(--snowui-kbd-padding));
        border-radius: var(
            --snowui-kbd-radius-override,
            var(--snowui-kbd-radius)
        );
        font-size: var(
            --snowui-kbd-font-size-override,
            var(--snowui-kbd-font-size)
        );
        line-height: var(
            --snowui-kbd-line-height-override,
            var(--snowui-kbd-line-height)
        );
        background-color: var(
            --snowui-kbd-bg-override,
            var(--snowui-kbd-bg)
        );
        box-shadow: var(
            --snowui-kbd-shadow-override,
            var(--snowui-kbd-shadow)
        );

        font-family: inherit;
        white-space: nowrap;
        user-select: none;
        --snowui-frame-component-transition:
            background-color
                var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            box-shadow
                var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    /* Level 4: Solid 变体确权（仅更新 CSS 变量） */
    :global(:where(.snowui-kbd).snowui-kbd-solid) {
        --snowui-kbd-bg: var(--black-4, rgba(0, 0, 0, 0.04));
        --snowui-kbd-shadow: none;
    }
</style>
