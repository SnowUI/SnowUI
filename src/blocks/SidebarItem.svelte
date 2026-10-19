<!-- SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- SidebarItem Block v1.6.3. 文档: ./SidebarItem.md -->
<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import type { Snippet } from "svelte";
    import {Badge, Button, Link, Tooltip, type FrameProps} from "../index";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";
    import {ComponentIcon} from "../internal/component-icon/index";
    import Frame from "../components/Frame.svelte";
    import { useLocale } from "../i18n/locale.svelte";
    import {getSidebarContext, type SidebarActionData} from "./sidebar-context.svelte";

    interface Props extends Omit<FrameProps, "children" | "id"> {
        id: string;
        label: string;
        icon?: string | Snippet;
        iconCollection?: string;
        depth?: 0 | 1;
        href?: string;
        updated?: boolean;
        tags?: Snippet;
        disabled?: boolean;
        actions?: SidebarActionData[] | Snippet;
        onSelect?: (id: string) => void;
        parts?: ComponentPartsOf<{ Badge: typeof Badge; Button: typeof Button }>;
        [key: string]: any;
    }

    let {
        id,
        label,
        icon = undefined,
        iconCollection = undefined,
        depth = 0,
        href = undefined,
        updated = false,
        tags = undefined,
        disabled = false,
        actions = [],
        onSelect = undefined,
        parts = undefined,
        class: userClass = "",
        ...rest
    }: Props = $props();

    const localeContext = useLocale();
    const sidebar = getSidebarContext();
    const collapsed = $derived(sidebar?.collapsed ?? false);
    const active = $derived(sidebar?.activeItemId === id);
    const iconSnippet = $derived(typeof icon === "function" ? icon : undefined);
    const iconName = $derived(typeof icon === "string" ? icon : undefined);
    const nested = $derived(depth === 1);
    const actionList = $derived(Array.isArray(actions) ? actions : []);
    const actionsSnippet = $derived(typeof actions === "function" ? actions : undefined);

    function select(event: MouseEvent) {
        if (disabled) {
            event.preventDefault();
            return;
        }
        onSelect?.(id);
        sidebar?.select(id);
    }

    function runAction(event: MouseEvent, action: SidebarActionData) {
        event.stopPropagation();
        action.onSelect?.(id);
    }
</script>

<Frame
    tag="div"
    row
    enableAutoLayout={false}
    class={["snowui-sidebar-item", "snowui-rounded-rectangle", userClass].filter(Boolean).join(" ")}
    data-active={active ? "true" : "false"}
    data-sidebar-item-id={id}
    data-depth={nested ? "1" : undefined}
    data-collapsed={collapsed ? "true" : "false"}
    data-disabled={disabled ? "true" : undefined}
    {...rest}
>
    {#snippet mainContent()}
        {#if nested || iconSnippet || iconName}
            <span
                data-as="leading"
                data-hierarchy-connector={nested ? "true" : undefined}
                class="snowui-sidebar-item-leading"
                aria-hidden="true"
            >
                {#if nested}
                    <!-- 层级关系是 Sidebar 装饰几何，由伪元素绘制。 -->
                {:else if iconSnippet}
                    {@render iconSnippet()}
                {:else if iconName}
                    <ComponentIcon name={iconName} collection={iconCollection} size="var(--size-5)" />
                {/if}
                {#if updated && collapsed}
                    <Badge
                        {...parts?.Badge}
                        as="badge"
                        dot
                        class="snowui-sidebar-item-badge-collapsed"
                        aria-label={localeContext.t("sidebarItem.updated")}
                    />
                {/if}
            </span>
        {/if}
        <span
            class="snowui-sidebar-item-content"
            aria-hidden={collapsed ? "true" : undefined}
        >
            <span class="snowui-sidebar-item-label">{label}</span>
            {@render tags?.()}
            {#if updated}
                <Badge
                    {...parts?.Badge}
                    as="badge"
                    dot
                    class="snowui-sidebar-item-badge"
                    aria-label={localeContext.t("sidebarItem.updated")}
                />
            {/if}
        </span>
        {#if collapsed}<Tooltip as="tooltip" position="right">{label}</Tooltip>{/if}
    {/snippet}

    {#if href}
        <Link
            href={disabled ? undefined : href}
            disabled={disabled}
            hoverColor={false}
            style="--snowui-link-color: inherit; --snowui-link-gap-override: var(--snowui-sidebar-item-gap-override, var(--gap-2));"
            row
            enableAutoLayout={true}
            contentFill
            wrap={false}
            class="snowui-sidebar-item-main"
            aria-label={collapsed ? label : undefined}
            aria-current={active ? "page" : undefined}
            onclick={select}
        >
            {@render mainContent()}
        </Link>
    {:else}
        <Button
            bare
            scaleOnHover={false}
            size="sm"
            disabled={disabled}
            row
            enableAutoLayout={true}
            contentFill
            wrap={false}
            class="snowui-sidebar-item-main"
            aria-label={collapsed ? label : undefined}
            aria-current={active ? "page" : undefined}
            onclick={select}
        >
            {@render mainContent()}
        </Button>
    {/if}

    {#if actionsSnippet || actionList.length}
        <div
            class="snowui-sidebar-item-actions"
            aria-hidden={collapsed ? "true" : undefined}
            inert={collapsed ? true : undefined}
        >
            {#if actionsSnippet}
                {@render actionsSnippet()}
            {:else}
                {#each actionList as action (action.id)}
                    <Button
                        {...parts?.Button}
                        bare
                        emphasis={parts?.Button?.emphasis ?? "muted"}
                        size="sm"
                        disabled={action.disabled}
                        aria-label={action.label}
                        onclick={(event: MouseEvent) => runAction(event, action)}
                    >
                        <ComponentIcon name={action.icon} collection={action.iconCollection} aria-hidden="true" />
                        <Tooltip as="tooltip" position="right">{action.label}</Tooltip>
                    </Button>
                {/each}
            {/if}
        </div>
    {/if}
</Frame>

<style>
    :global(:where(.snowui-sidebar-item)) {
        position: relative;
        display: flex;
        width: 100%;
        min-width: 0;
        min-height: var(--size-9);
        align-items: center;
        border-radius: var(--snowui-sidebar-item-radius-override, var(--radius-3));
        color: var(--black-100, #000);
        --snowui-sidebar-item-content-opacity: 1;
    }
    :global(:where(.snowui-sidebar-item[data-disabled="true"])) { opacity: 0.2; }
    :global(:where(.snowui-sidebar-item-main)) {
        width: 100%;
        min-width: 0;
        min-height: var(--size-9);
        box-sizing: border-box;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: flex-start;
        gap: var(--snowui-sidebar-item-gap-override, var(--gap-2));
        padding: var(--snowui-sidebar-item-padding-y-override, var(--padding-2))
            var(--snowui-sidebar-item-padding-x-override, var(--padding-2));
        border-radius: inherit;
        corner-shape: inherit;
        color: inherit;
        --snowui-button-opacity-override: 1;
        text-decoration: none;
    }
    :global(:where(.snowui-sidebar-item):not([data-disabled="true"]):hover) {
        background: var(--snowui-sidebar-item-background-override, var(--black-4, #0000000a));
    }
    :global(:where(.snowui-sidebar-navigation[data-continuous-hover-enabled="true"] .snowui-sidebar-item):not([data-disabled="true"]):not([data-active="true"]):hover) {
        background: transparent;
    }
    :global(:where(.snowui-sidebar-item[data-active="true"])) {
        background: var(--snowui-sidebar-item-background-override, var(--black-4, #0000000a));
    }
    :global(:where(.snowui-sidebar-item-leading)) {
        position: relative;
        display: inline-flex;
        width: var(--size-5);
        height: var(--size-5);
        flex: 0 0 var(--size-5);
        align-items: center;
        justify-content: center;
        opacity: 1;
    }
    :global(:where(.snowui-sidebar-item-leading[data-hierarchy-connector="true"]))::before {
        position: absolute;
        bottom: calc(50% - (var(--border-2) / 2));
        left: calc(50% - (var(--border-2) / 2));
        box-sizing: border-box;
        width: 50%;
        height: 50%;
        border-bottom: var(--border-2) dotted var(--black-40, #00000066);
        border-left: var(--border-2) dotted var(--black-40, #00000066);
        border-bottom-left-radius: var(--radius-1);
        content: "";
        pointer-events: none;
    }
    :global(:where(.snowui-sidebar-item-content)) {
        display: inline-flex;
        min-width: 0;
        align-items: center;
        gap: var(--snowui-sidebar-item-gap-override, var(--gap-2));
        opacity: var(--snowui-sidebar-item-content-opacity);
        visibility: visible;
        transition:
            opacity var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            visibility 0s linear;
    }
    :global(:where(.snowui-sidebar-item-label)) {
        display: block;
        min-width: 0;
        overflow: hidden;
        font-size: var(--snowui-sidebar-item-font-size-override, var(--text-14));
        line-height: var(--snowui-sidebar-item-line-height-override, var(--leading-14));
        text-overflow: ellipsis;
        white-space: nowrap;
        color: inherit;
    }
    :global(:where(.snowui-sidebar-item-badge)) {
        flex: 0 0 auto;
        align-self: center;
    }
    :global(:where(.snowui-sidebar-item-badge-collapsed)) {
        position: absolute;
        top: -2px;
        right: -2px;
    }
    :global(:where(.snowui-sidebar-item-actions)) {
        position: absolute;
        right: var(--padding-2);
        display: flex;
        align-items: center;
        gap: var(--gap-1);
        opacity: 0;
        pointer-events: none;
        transition: opacity var(--snowui-frame-color-motion-duration, 0.15s)
            var(--snowui-frame-color-motion-easing, ease-out);
    }
    :global(:where(.snowui-sidebar-item:hover, .snowui-sidebar-item:focus-within) .snowui-sidebar-item-actions) {
        opacity: 1;
        pointer-events: auto;
    }
    :global(:where(.snowui-sidebar-item[data-collapsed="true"] .snowui-sidebar-item-content)) {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition:
            opacity var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            visibility 0s linear
                var(--snowui-frame-color-motion-duration, 0.15s);
    }
    :global(:where(.snowui-sidebar-item[data-collapsed="true"] .snowui-sidebar-item-main)) {
        overflow: hidden;
    }
    :global(:where(.snowui-sidebar-item[data-collapsed="true"] .snowui-sidebar-item-actions)) {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }
</style>
