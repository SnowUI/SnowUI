<!-- SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- CopyButton：以真实 Button 为宿主的剪贴板复制按钮。 -->
<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import { onDestroy, type ComponentProps, type Snippet } from "svelte";
    import { ComponentIcon } from "../internal/component-icon/index";
    import Button from "./Button.svelte";
    import { CONTROL_BUTTON_REPLACEMENT_MOTION, CONTROL_BUTTON_MOTION_DURATION_MS, controlButtonMotionStyle } from "../motion/presets/replacement";
    import Frame from "./Frame.svelte";
    import { writeClipboardText } from "../lib/clipboard";
    import { useLocale } from "../i18n/locale.svelte";
    import {
        mergeComponentPartProps,
        useComponentPart,
    } from "../logic/component-parts.svelte";

    type ButtonProps = ComponentProps<typeof Button>;
    interface Props extends Omit<
        ButtonProps,
        | "children"
        | "onclick"
        | "disabled"
        | "currentState"
        | "stateContent"
        | "whileActive"
        | "Click"
        | "Active"
    > {
        text?: string;
        getText?: () => string | Promise<string>;
        writeText?: (text: string) => void | Promise<void>;
        feedbackDuration?: number;
        showText?: boolean;
        ariaLabel?: string;
        disabled?: boolean;
        children?: Snippet;
        icon?: Snippet;
        successIcon?: Snippet;
        successContent?: Snippet;
        onCopy?: (text: string) => void;
        onCopyError?: (error: unknown) => void;
        onclick?: (event: MouseEvent) => void;
        [key: string]: any;
    }

    const inheritedCopyButtonPart = useComponentPart<Props>("CopyButton");
    const localeContext = useLocale();
    let explicitProps: Props = $props();
    let {
        text = undefined,
        getText = undefined,
        writeText = writeClipboardText,
        feedbackDuration = 1600,
        showText = true,
        ariaLabel = undefined,
        disabled = false,
        children,
        icon,
        successIcon,
        successContent,
        onCopy,
        onCopyError,
        onclick,
        whileClick: userWhileClick = undefined,
        style: userStyle = "",
        ...rest
    }: Props = $derived(
        mergeComponentPartProps(
            inheritedCopyButtonPart.current,
            explicitProps,
        ),
    );

    let status = $state<"idle" | "pending" | "success" | "error">("idle");
    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    const iconFrameProps = { "aria-hidden": "true" as const };

    async function handleClick(event: MouseEvent) {
        if (disabled || status !== "idle") {
            event.preventDefault();
            return;
        }
        onclick?.(event);
        status = "pending";
        try {
            const resolvedText = getText ? await getText() : (text ?? "");
            await writeText(resolvedText);
            status = "success";
            onCopy?.(resolvedText);
        } catch (error) {
            status = "error";
            onCopyError?.(error);
        }
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
            status = "idle";
        }, Math.max(0, feedbackDuration));
    }

    onDestroy(() => clearTimeout(resetTimer));
</script>

{#snippet idleIcon()}
    {#if icon}
        {@render icon()}
    {:else}
        <ComponentIcon name="copy" aria-hidden="true" />
    {/if}
{/snippet}

{#snippet copiedIcon()}
    {#if successIcon}
        {@render successIcon()}
    {:else if successContent}
        {@render successContent()}
    {:else}
        <ComponentIcon name="check" aria-hidden="true" />
    {/if}
{/snippet}

<Button
    {...rest}
    style={`${controlButtonMotionStyle(`var(--snowui-copy-button-motion-duration-override, ${CONTROL_BUTTON_MOTION_DURATION_MS}ms)`)} ${userStyle}`}
    iconOnly={!rest.bare && !showText}
    {disabled}
    data-copy-button
    data-copy-status={status}
    aria-label={ariaLabel ??
        (showText ? undefined : localeContext.t(status === "success" ? "copyButton.copied" : "copyButton.copy"))}
    aria-live="polite"
    aria-busy={status === "pending" ? "true" : undefined}
    whileClick={status === "idle" ? userWhileClick : false}
    onclick={handleClick}
>
    {#key status === "success"}
        <Frame
            {...iconFrameProps}
            tag="span"
            enableResponsive={false}
            enableContext={false}
            enableScaleObserver={false}
            currentState="Appear" whileAppear={CONTROL_BUTTON_REPLACEMENT_MOTION}
        >
            {#if status === "success"}
                {@render copiedIcon()}
            {:else}
                {@render idleIcon()}
            {/if}
        </Frame>
    {/key}
    {#if showText}
        {#if children}
            {@render children()}
        {:else}
            {localeContext.t("copyButton.copy")}
        {/if}
    {/if}
</Button>

<style>
    /* CopyButton 自己管理 bare 状态的透明度与交互光标。反馈期内即使仍被
       hover，也保持当前 emphasis 的常态透明度，避免复制成功时按钮突然闪亮。 */
    :global(:where(.snowui-button)[data-copy-button]) {
        cursor: pointer;
    }

    :global(
        :where(.snowui-button.snowui-button-bare)[data-copy-button][data-copy-status]:not(
                [data-copy-status="idle"]
            )
    ) {
        opacity: var(
            --snowui-copy-button-feedback-opacity,
            var(
                --snowui-state-opacity,
                var(--snowui-button-bare-idle-opacity, 1)
            )
        );
    }
</style>
