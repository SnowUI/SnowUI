<!-- SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!--
  SearchBox 搜索框触发器
  v1.2.0

  文档: ./SearchBox.md

  布局对齐 Select / Input:
  - 根 Frame 声明 row,自动注入 data-auto-layout(默认 enableAutoLayout=true)
  - 三槽位 grid 模板由 components/src/styles/auto-layout.css 统一接管
  - 组件 CSS 只负责视觉(背景/padding/gap/radius/clear-btn 视觉)
  - 颜色、hover、focus、清除 X 显示规则参考 Input / field-bordered 工具类
-->

<script lang="ts">
    import {contentLineGap} from "../logic/content-line";
    import { useLocale } from "../i18n/locale.svelte";
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";
    import { Button } from "../index";
    import type { Snippet } from "svelte";
    import { ComponentIcon } from "../internal/component-icon/index";
    import {
        Frame,
        resizeManager,
        type FrameProps,
    } from "../index";

    const localeContext = useLocale();

    interface Props extends Omit<FrameProps, "children" | "tag"> {
        /** 内置图标按钮配置；事件与角色由所属组件控制。 */
        parts?: ComponentPartsOf<{ Button: typeof Button }>;
        variant?: "gray" | "outline";
        gap?: number;
        value?: string | number;
        placeholder?: string;
        open?: boolean;
        disabled?: boolean;
        readonly?: boolean;
        showSearchIcon?: boolean;
        collapseBelow?: number;
        clearable?: boolean;
        children?: Snippet;
        onOpenChange?: (open: boolean) => void;
        onClear?: () => void;
        onclick?: (event: MouseEvent) => void;
        onkeydown?: (event: KeyboardEvent) => void;
        [key: string]: any;
    }

    let {
        variant = "gray",
        gap = undefined,
        value = $bindable(),
        placeholder = undefined,
        open = $bindable(false),
        disabled = false,
        readonly = false,
        showSearchIcon = true,
        collapseBelow = undefined,
        clearable = true,
        parts = undefined,
        children,
        onOpenChange = undefined,
        onClear = undefined,
        onclick: userOnClick = undefined,
        onkeydown: userOnKeyDown = undefined,
        enableAutoLayout = true,
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        class: userClass = "",
        style: userStyle = "",
        renderHints: userRenderHints = undefined,
        element = $bindable(),
        ...rest
    }: Props = $props();

    const internalAutoLayout = $derived(enableAutoLayout === false ? true : enableAutoLayout);
    const rootStyle = $derived([
        gap !== undefined ? `--snowui-search-box-gap-override: ${contentLineGap(gap)}` : "",
        userStyle,
    ].filter(Boolean).join("; ") || undefined);

    const hasValue = $derived(
        value !== undefined && value !== null && String(value) !== "",
    );
    const displayText = $derived(hasValue ? String(value) : (placeholder ?? localeContext.t("searchBox.placeholder")));

    const searchBoxRenderHints = $derived({
        variant: userRenderHints?.variant ?? "line",
        width: userRenderHints?.width ?? "10rem",
        height: userRenderHints?.height ?? "var(--leading-14)",
        radius: userRenderHints?.radius ?? "var(--radius-4)",
    });

    function setOpenState(next: boolean) {
        if (disabled || readonly) return;
        open = next;
        onOpenChange?.(next);
    }

    function handleClick(event: MouseEvent) {
        if (!disabled && !readonly) {
            setOpenState(true);
        }
        userOnClick?.(event);
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape" && open) {
            event.preventDefault();
            setOpenState(false);
        }
        if ((event.key === "Enter" || event.key === " ") && !open) {
            event.preventDefault();
            setOpenState(true);
        }
        userOnKeyDown?.(event);
    }

    function handleClear(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        value = "";
        onClear?.();
    }

    $effect(() => {
        const node = element;
        const threshold = collapseBelow;
        if (!node) return;

        const update = (width: number) => {
            if (
                typeof threshold === "number" &&
                threshold > 0 &&
                width <= threshold
            ) {
                node.dataset.responsiveCollapse = "icon";
            } else {
                delete node.dataset.responsiveCollapse;
            }
        };

        update(node.getBoundingClientRect().width);
        const unwatch = resizeManager.watch(node, (entry) =>
            update(entry.contentRect.width),
        );

        return () => {
            unwatch();
            delete node.dataset.responsiveCollapse;
        };
    });
</script>

<Frame
    bind:element
    tag="div"
    role="button"
    tabindex={disabled ? -1 : 0}
    row
    {disabled}
    data-disabled={disabled ? "true" : undefined}
    data-readonly={readonly ? "true" : undefined}
    data-open={open ? "true" : undefined}
    data-has-value={hasValue ? "true" : undefined}
    data-variant={variant}
    aria-disabled={disabled ? "true" : undefined}
    aria-haspopup="dialog"
    aria-expanded={open ? "true" : "false"}
    aria-label={rest["aria-label"] ?? displayText}
    class={[
        "snowui-search-box",
        "snowui-rounded-rectangle",
        "snowui-field-bordered",
        `snowui-search-box-${variant}`,
        userClass,
    ]
        .filter(Boolean)
        .join(" ")}
    style={rootStyle}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    renderHints={searchBoxRenderHints}
    onclick={handleClick}
    onkeydown={handleKeydown}
    {...rest}
    enableAutoLayout={internalAutoLayout}
    singleLine
>
    {#if showSearchIcon}
        <ComponentIcon
            name="search"
            as="leading"
            class="snowui-search-box-default-icon"
            size="var(--size-4)"
            aria-hidden="true"
        />
    {/if}

    <span
        class={`snowui-search-box-content${hasValue ? "" : " snowui-search-box-placeholder"}`}
    >
        {displayText}
    </span>

    {@render children?.()}

    {#if clearable && hasValue && !disabled && !readonly}
        <Button bare emphasis="muted" size="sm" {...parts?.Button}
            type="button"
            class={`snowui-clear-icon-btn snowui-search-box-clear-btn${parts?.Button?.class ? ` ${parts.Button.class}` : ""}`}
            as="trailing"
            aria-label={localeContext.t("searchBox.clear")}
            onclick={handleClear}
            onmousedown={(event: MouseEvent) => event.preventDefault()}
            tabindex={-1}
        >
            <ComponentIcon name="x-circle" weight="fill" aria-hidden="true" />
        </Button>
    {/if}
</Frame>

<style>
    /* ─── 根节点变量与视觉 ─────────────────────────────────────
     * 布局(grid-template-columns / 槽位落列)由 auto-layout.css 接管,
     * 组件层不重复声明,只负责视觉与 token. */

    :global(:where(.snowui-search-box)) {
        --snowui-search-box-padding-y: var(--padding-1);
        --snowui-search-box-padding-x: var(--padding-2);
        --snowui-search-box-gap: var(--gap-2);
        --snowui-search-box-radius: var(--radius-4);
        --snowui-search-box-font-size: var(--text-14);
        --snowui-search-box-line-height: var(--leading-14);
        --snowui-search-box-background: var(--black-4, #0000000a);
        --snowui-search-box-border-color: transparent;
        --snowui-search-box-hover-border-color: transparent;
        /* StyleSpec §2.4.2: --black-4 / --surface-1 等浅色背景 hover-opacity 4% */
        --snowui-search-box-hover-opacity: 4%;
        --snowui-hover-overlay-opacity: 0%;
        /* placeholder 文本色:对齐 Input 的 --snowui-input-placeholder-color */
        --snowui-search-box-placeholder-color: var(--black-20, #00000033);
        /* 默认搜索图标色:静止 Black/20%,hover 加深到 Black/40% */
        --snowui-search-box-icon-color: var(--black-20, #00000033);
        --snowui-search-box-icon-hover-color: var(--black-40, #00000066);
        --snowui-search-box-trailing-color: var(--black-20, #00000033);

        width: var(--snowui-search-box-width-override, auto);
        min-width: 0;
        flex-wrap: nowrap;
        padding: var(
            --snowui-search-box-padding-override,
            var(--snowui-search-box-padding-y)
                var(--snowui-search-box-padding-x)
        );
        gap: max(4px, var(--snowui-search-box-gap-override, var(--snowui-search-box-gap)));
        border-radius: var(
            --snowui-search-box-radius-override,
            var(--snowui-search-box-radius)
        );
        background-color: var(
            --snowui-search-box-background-override,
            var(--snowui-search-box-background)
        );
        -webkit-backdrop-filter: blur(
            var(--snowui-search-box-background-blur-override, 1.25rem)
        );
        backdrop-filter: blur(
            var(--snowui-search-box-background-blur-override, 1.25rem)
        );
        /* StyleSpec §2.4.1 显式渐变 hover overlay 自行声明 */
        background-image: linear-gradient(
            color-mix(
                in srgb,
                currentColor var(--snowui-hover-overlay-opacity),
                transparent
            ),
            color-mix(
                in srgb,
                currentColor var(--snowui-hover-overlay-opacity),
                transparent
            )
        );
        color: inherit;
        font-size: var(
            --snowui-search-box-font-size-override,
            var(--snowui-search-box-font-size)
        );
        line-height: var(
            --snowui-search-box-line-height-override,
            var(--snowui-search-box-line-height)
        );
        cursor: var(--snowui-field-cursor, pointer);
        box-sizing: border-box;
        user-select: none;
        overflow: hidden;
        --snowui-field-cursor: pointer;
        --snowui-field-border-color: var(--snowui-search-box-border-color);
        --snowui-field-hover-border-color: var(
            --snowui-search-box-hover-border-color
        );
        /* SearchBox 不需要焦点态:让 field-bordered 的 focus-within 视觉与静止态一致 */
        --snowui-field-focus-border-color: var(
            --snowui-search-box-border-color
        );
        --snowui-field-focus-ring-width: 0;
        --snowui-field-focus-ring-color: transparent;
        /* StyleSpec §2.4.7: hover overlay 必须显式过渡 --snowui-hover-overlay-opacity */
        transition:
            --snowui-hover-overlay-opacity
                var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            background-color
                var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            color var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(
            :where(
                    .snowui-search-box[data-responsive-collapse="icon"]
                )
        ) {
        grid-template-columns: auto;
        justify-content: center;
        min-width: max-content;
        gap: 0;
    }

    :global(
            :where(
                    .snowui-search-box[data-responsive-collapse="icon"]
                        > :not([data-as="leading"])
                )
        ) {
        display: none;
    }

    :global(
            :where(
                    .snowui-search-box[data-responsive-collapse="icon"]
                        > [data-as="leading"]
                )
        ) {
        grid-column: 1;
        grid-row: 1;
        justify-self: center;
    }

    /* outline 变体:透明底 + 可见边框,hover 时边框加深(参 Button outline) */
    :global(:where(.snowui-search-box[data-variant="outline"])) {
        --snowui-search-box-background: var(--surface-1, #ffffffcc);
        --snowui-search-box-border-color: var(--black-20, #00000033);
        --snowui-search-box-hover-border-color: var(--black-40, #00000066);
    }

    /* SearchBox 是搜索浮层触发器，不显示焦点外圈；Esc 等键盘操作不应恢复全局 focus-visible outline。 */
    :global(:where(.snowui-search-box:focus, .snowui-search-box:focus-visible)) {
        outline: none;
    }

    /* hover:激活渐变 overlay(适用所有 variant);disabled 排除 */
    :global(
            :where(.snowui-search-box):hover:not([data-disabled="true"])
        ) {
        --snowui-hover-overlay-opacity: var(
            --snowui-search-box-hover-opacity
        );
    }

    /* Dark mode:浅色背景 hover-opacity 提升到 10%(StyleSpec §2.4.2) */
    :global(
            :where([theme="dark"]) :where(.snowui-search-box)
        ) {
        --snowui-search-box-hover-opacity: 10%;
    }

    :global(:where(.snowui-search-box[data-disabled="true"])) {
        pointer-events: none;
    }

    /* ─── Content(占位/文本)截断 ─────────────────────────── */

    :global(:where(.snowui-search-box-content)) {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    :global(:where(.snowui-search-box-placeholder)) {
        color: var(
            --snowui-search-box-placeholder-color-override,
            var(--snowui-search-box-placeholder-color)
        );
    }

    /* ─── 默认搜索图标:静止 Black/20%、hover Black/40%、外部 leading 隐藏 ─── */

    :global(:where(.snowui-search-box-default-icon)) {
        color: var(
            --snowui-search-box-icon-color-override,
            var(--snowui-search-box-icon-color)
        );
        transition:
            color var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    /* ComponentIcon 直出图标元素；hover / has-value 仍用后代选择器。 */
    :global(
            .snowui-search-box:hover:not([data-disabled="true"])
                .snowui-search-box-default-icon,
            .snowui-search-box[data-has-value="true"]
                .snowui-search-box-default-icon
        ) {
        color: var(
            --snowui-search-box-icon-hover-color-override,
            var(--snowui-search-box-icon-hover-color)
        );
    }

    /* LayoutProtocol §4.1.5: 外置 leading 存在时隐藏直系默认 Search。 */
    :global(
            :where(.snowui-search-box):has(
                    > [data-as="leading"] ~ [data-as="leading"]
                )
                > .snowui-search-box-default-icon[data-as="leading"]
        ) {
        display: none;
    }

    /* 外置 trailing 默认使用 Black/20%；内建清除 X 保留共享按钮颜色。 */
    :global(
            :where(
                    .snowui-search-box
                        > [data-as="trailing"]:not(
                            .snowui-search-box-clear-btn
                        )
                )
        ) {
        color: var(--snowui-search-box-trailing-color);
    }

    /* ─── Clear (X) 按钮 ─────────────────────────────────────────
     * 视觉/交互复用 Button bare。
     * 此处仅保留 SearchBox 专属的默认隐藏；focus-within 显示规则在下方。
     * grid 落列由 auto-layout.css 通过 [data-as="trailing"] 接管。 */

    :global(:where(.snowui-search-box-clear-btn)) {
        display: none;
    }

    /* 有值 + focus-within → 显示 X */
    :global(
            .snowui-search-box[data-has-value="true"]:focus-within
                .snowui-search-box-clear-btn
        ) {
        display: inline-flex;
    }

    /* X 可见时隐藏外置 trailing(如 Kbd),与 Input 一致 */
    :global(
            .snowui-search-box[data-has-value="true"]:focus-within
                > [data-as="trailing"]:not(.snowui-search-box-clear-btn)
        ) {
        display: none;
    }
</style>
