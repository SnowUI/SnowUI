<!--
  CodeBlock 组件：代码块显示，支持行号、复制、全屏放大
  v1.6.1

  布局模型：默认态为复合管理布局；singleLine 变体为槽位宿主布局

  Frame 能力接入：
  - 根层：enableDefaultMotion=true
  - 复制按钮：Frame stateContent 驱动 Copy ↔ Check 图标交叉淡化（内置 150ms crossfade）
  - 全屏按钮：内置 bare ExpandButton 负责图标与内容替换动效
  - 全屏覆盖层：共享元素 layout 布局转场
      进入：captureFlipRect 记录卡片位置，全屏层只过渡位置与尺寸，不缩放代码字形
      退出：applyFlipExit 将全屏层缩回卡片位置后卸载

  外置 Icon 替换（ComponentGuidelines §2.7.1）：
  - singleLine 支持 as="leading" / data-as="leading" 前置配件
  - as="trailing" / data-as="trailing" 替换默认右侧动作区
  - data-as="copy-icon" / "copied-icon" / "expand-icon" / "collapse-icon" 保留为精确图标替换兼容入口

  文档: ./CodeBlock.md
-->

<script module lang="ts">
    let codeBlockInstanceSeed = 0;
</script>

<script lang="ts">
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Indicator from "./Indicator.svelte";
    import CopyButton from "./CopyButton.svelte";
    import { resizeManager } from "../logic/observer.svelte";
    import { useOverlayScrollbar } from "../lib/overlay-scrollbar.svelte";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";
    import {
        captureFlipRect,
        beginFlipEnter,
        applyFlipExit,
    } from "../logic/layout-flip";
    import ExpandButton from "./ExpandButton.svelte";
    import { Icon as ResourceIcon } from "@snowui-design-system/resource-svelte";
    import type { Snippet } from "svelte";

    type CodeTokenKind =
        | "plain"
        | "comment"
        | "keyword"
        | "function"
        | "property"
        | "string"
        | "variable";

    interface CodeToken {
        text: string;
        kind: CodeTokenKind;
    }

    const KEYWORDS = new Set([
        "as",
        "async",
        "await",
        "break",
        "case",
        "catch",
        "class",
        "const",
        "continue",
        "default",
        "delete",
        "do",
        "else",
        "export",
        "extends",
        "false",
        "finally",
        "for",
        "from",
        "function",
        "if",
        "import",
        "in",
        "instanceof",
        "let",
        "new",
        "null",
        "of",
        "return",
        "static",
        "switch",
        "this",
        "throw",
        "true",
        "try",
        "typeof",
        "undefined",
        "var",
        "void",
        "while",
        "with",
        "yield",
    ]);

    const BUILTIN_OBJECTS = new Set([
        "Array",
        "Boolean",
        "Date",
        "JSON",
        "Map",
        "Math",
        "Number",
        "Object",
        "Promise",
        "RegExp",
        "Set",
        "String",
        "console",
        "document",
        "window",
    ]);

    interface Props extends Partial<FrameProps> {
        /** 视觉与布局变体；singleLine 使用三槽单行代码条 */
        variant?: "default" | "singleLine";
        /** 要显示的代码字符串 */
        code?: string;
        /** 语言标识，显示在工具栏 */
        language?: string;
        /** 是否显示语言标识 */
        showLanguage?: boolean;
        /** 是否显示行号；普通态与全屏态保持一致 */
        showLineNumbers?: boolean;
        /** 是否显示复制按钮 */
        showCopyButton?: boolean;
        /** 是否显示全屏放大按钮 */
        showExpandButton?: boolean;
        /** 默认状态最多显示几行代码，内容不足时自适应高度 */
        visibleLines?: number;
        /** 复制成功图标的停留时长（ms） */
        copyTimeout?: number;
        children?: Snippet;
        parts?: ComponentPartsOf<{
            Indicator: typeof Indicator;
            CopyButton: typeof CopyButton;
            ExpandButton: typeof ExpandButton;
        }>;
        [key: string]: any;
    }

    // 归一化跨独立仓库源码检查产生的 Snippet nominal identity。
    // 输入和输出仍是同一个函数，运行时不包装、不重建。
    function normalizeActionSnippet(snippet: unknown): Snippet {
        return snippet as Snippet;
    }

    let {
        variant = "default",
        code = "",
        language = "",
        showLanguage = true,
        showLineNumbers = false,
        showCopyButton = true,
        showExpandButton = true,
        visibleLines = 5,
        copyTimeout = 2000,
        class: className = "",
        style: userStyle = "",
        children,
        parts = undefined,
        enableResponsive = false,
        enableContext = false,
        enableScaleObserver = false,
        ...rest
    }: Props = $props();
    /* ─── 内部状态 ─── */
    const fullscreenMotionId = `code-block-fullscreen-${++codeBlockInstanceSeed}`;
    let isFullscreen = $state(false);
    let isExitingFullscreen = $state(false);
    /** 全屏层 DOM 元素，用于 FLIP 退出动效 */
    let fullscreenElement: HTMLElement | undefined = $state(undefined);
    let codeViewportElement: HTMLElement | undefined = $state(undefined);
    let codeScrollbarElement: HTMLElement | undefined = $state(undefined);
    let fullscreenViewportElement: HTMLElement | undefined = $state(undefined);
    let fullscreenScrollbarElement: HTMLElement | undefined = $state(undefined);
    let showTopFade = $state(false);
    let showBottomFade = $state(false);
    let showFullscreenTopFade = $state(false);
    let showFullscreenBottomFade = $state(false);
    let resizeHeight: number | undefined = $state(undefined);

    /* ─── 外置 Icon 检测状态 ─── */
    let hasCustomCopyIcon = $state(false);
    let hasCustomCopiedIcon = $state(false);
    let hasCustomExpandIcon = $state(false);
    let hasCustomCollapseIcon = $state(false);
    let hasCustomLeading = $state(false);
    let hasCustomTrailing = $state(false);
    let customCopyIconHtml = $state("");
    let customCopiedIconHtml = $state("");
    let customExpandIconHtml = $state("");
    let customCollapseIconHtml = $state("");
    let customLeadingHtml = $state("");
    let customTrailingHtml = $state("");
    let childCode = $state("");
    let hostElement: HTMLElement | undefined = $state(undefined);

    /* ─── 计算属性 ─── */
    const isSingleLine = $derived(variant === "singleLine");
    const resolvedCode = $derived(code || childCode);
    const lines = $derived(resolvedCode ? resolvedCode.split("\n") : []);
    const resolvedVisibleLines = $derived(Math.max(1, visibleLines || 15));
    const autoVisibleLines = $derived(
        Math.min(Math.max(lines.length || 1, 1), resolvedVisibleLines),
    );
    const highlightedLines = $derived(lines.map(highlightLine));
    const highlightedSingleLine = $derived(highlightLine(resolvedCode));
    const rootStyle = $derived(
        [
            `--snowui-code-block-visible-lines: ${autoVisibleLines};`,
            userStyle,
            !isSingleLine && resizeHeight !== undefined
                ? `height:${resizeHeight}px;`
                : "",
        ]
            .filter(Boolean)
            .join(" "),
    );
    const codeScrollbar = useOverlayScrollbar(
        () => codeViewportElement,
        () => codeScrollbarElement,
    );
    const fullscreenScrollbar = useOverlayScrollbar(
        () => fullscreenViewportElement,
        () => fullscreenScrollbarElement,
    );

    function readIdentifier(value: string, start: number) {
        const match = value.slice(start).match(/^[A-Za-z_$][A-Za-z0-9_$-]*/);
        return match?.[0] ?? "";
    }

    function readNumber(value: string, start: number) {
        const match = value.slice(start).match(/^\d+(?:\.\d+)?/);
        return match?.[0] ?? "";
    }

    function readString(value: string, start: number) {
        const quote = value[start];
        let cursor = start + 1;
        while (cursor < value.length) {
            if (value[cursor] === "\\") {
                cursor += 2;
                continue;
            }
            if (value[cursor] === quote) {
                cursor += 1;
                break;
            }
            cursor += 1;
        }
        return value.slice(start, cursor);
    }

    function nextNonSpace(value: string, start: number) {
        let cursor = start;
        while (cursor < value.length && /\s/.test(value[cursor])) cursor += 1;
        return value[cursor] ?? "";
    }

    function previousNonSpace(value: string, start: number) {
        let cursor = start;
        while (cursor >= 0 && /\s/.test(value[cursor])) cursor -= 1;
        return value[cursor] ?? "";
    }

    function highlightLine(line: string): CodeToken[] {
        const tokens: CodeToken[] = [];
        let cursor = 0;

        while (cursor < line.length) {
            const current = line[cursor];
            const rest = line.slice(cursor);

            if (rest.startsWith("//")) {
                tokens.push({ text: rest, kind: "comment" });
                break;
            }

            if (current === '"' || current === "'" || current === "`") {
                const text = readString(line, cursor);
                tokens.push({ text, kind: "string" });
                cursor += text.length;
                continue;
            }

            if (/\d/.test(current)) {
                const text = readNumber(line, cursor);
                tokens.push({ text, kind: "keyword" });
                cursor += text.length;
                continue;
            }

            if (/[A-Za-z_$]/.test(current)) {
                const text = readIdentifier(line, cursor);
                const before = previousNonSpace(line, cursor - 1);
                const after = nextNonSpace(line, cursor + text.length);
                let kind: CodeTokenKind = "variable";

                if (KEYWORDS.has(text)) {
                    kind = "keyword";
                } else if (before === ".") {
                    kind = "property";
                } else if (after === "(" || BUILTIN_OBJECTS.has(text)) {
                    kind = "function";
                }

                tokens.push({ text, kind });
                cursor += text.length;
                continue;
            }

            tokens.push({ text: current, kind: "plain" });
            cursor += 1;
        }

        return tokens.length > 0 ? tokens : [{ text: " ", kind: "plain" }];
    }

    /* ─── 全屏切换（layout-flip.ts 的 layout 策略驱动） ─── */
    function enterFullscreen() {
        /* 捕获普通态矩形；全屏层挂载后只过渡实际位置与尺寸。 */
        if (hostElement) captureFlipRect(fullscreenMotionId, hostElement);
        isFullscreen = true;
    }

    function exitFullscreen() {
        if (!isFullscreen || isExitingFullscreen) return;
        if (!fullscreenElement || !hostElement) {
            isFullscreen = false;
            return;
        }
        isExitingFullscreen = true;
        const done = () => {
            isFullscreen = false;
            isExitingFullscreen = false;
        };
        applyFlipExit(fullscreenElement, hostElement, {
            strategy: "layout",
            onComplete: done,
        });
    }

    function toggleFullscreen() {
        if (isFullscreen) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    }

    /* ─── Esc 退出全屏 ─── */
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape" && isFullscreen) {
            event.preventDefault();
            exitFullscreen();
        }
    }

    function refreshScrollState() {
        codeScrollbar.refresh();
        fullscreenScrollbar.refresh();
    }

    function updateScrollFade() {
        if (codeViewportElement) {
            const { scrollTop, clientHeight, scrollHeight } =
                codeViewportElement;
            showTopFade = scrollTop > 1;
            showBottomFade = scrollTop + clientHeight < scrollHeight - 1;
        }
        if (fullscreenViewportElement) {
            const { scrollTop, clientHeight, scrollHeight } =
                fullscreenViewportElement;
            showFullscreenTopFade = scrollTop > 1;
            showFullscreenBottomFade =
                scrollTop + clientHeight < scrollHeight - 1;
        }
        refreshScrollState();
    }

    function resolveScrollMask(showTop: boolean, showBottom: boolean) {
        if (showTop && showBottom) return "both";
        if (showTop) return "top";
        if (showBottom) return "bottom";
        return undefined;
    }

    function handleResizeHeight(next: number) {
        resizeHeight = next;
        updateScrollFade();
    }

    /* ─── 外置 Icon MutationObserver 检测（ComponentGuidelines §2.7.1） ─── */
    $effect(() => {
        if (!hostElement) return;

        function detect() {
            const copyIcon = hostElement!.querySelector(
                '.snowui-code-block-accessories [data-as="copy-icon"]',
            ) as HTMLElement | null;
            const copiedIcon = hostElement!.querySelector(
                '.snowui-code-block-accessories [data-as="copied-icon"]',
            ) as HTMLElement | null;
            const expandIcon = hostElement!.querySelector(
                '.snowui-code-block-accessories [data-as="expand-icon"]',
            ) as HTMLElement | null;
            const collapseIcon = hostElement!.querySelector(
                '.snowui-code-block-accessories [data-as="collapse-icon"]',
            ) as HTMLElement | null;
            const childPre = hostElement!.querySelector(
                ".snowui-code-block-accessories pre",
            ) as HTMLElement | null;
            const leading = hostElement!.querySelector(
                '.snowui-code-block-accessories [data-as="leading"], .snowui-code-block-accessories .snowui-role-leading',
            ) as HTMLElement | null;
            const trailing = hostElement!.querySelector(
                '.snowui-code-block-accessories [data-as="trailing"], .snowui-code-block-accessories .snowui-role-trailing',
            ) as HTMLElement | null;
            const contentSource = hostElement!.querySelector(
                ".snowui-code-block-accessories",
            ) as HTMLElement | null;
            const contentClone = contentSource?.cloneNode(true) as
                | HTMLElement
                | undefined;
            contentClone
                ?.querySelectorAll(
                    "[data-as], .snowui-role-leading, .snowui-role-trailing",
                )
                .forEach((node) => node.remove());

            hasCustomCopyIcon = !!copyIcon;
            hasCustomCopiedIcon = !!copiedIcon;
            hasCustomExpandIcon = !!expandIcon;
            hasCustomCollapseIcon = !!collapseIcon;
            hasCustomLeading = !!leading;
            hasCustomTrailing = !!trailing;
            customCopyIconHtml = copyIcon?.innerHTML ?? "";
            customCopiedIconHtml = copiedIcon?.innerHTML ?? "";
            customExpandIconHtml = expandIcon?.innerHTML ?? "";
            customCollapseIconHtml = collapseIcon?.innerHTML ?? "";
            customLeadingHtml = leading?.innerHTML ?? "";
            customTrailingHtml = trailing?.innerHTML ?? "";
            childCode =
                childPre?.textContent ??
                contentClone?.textContent?.trim() ??
                "";
        }

        detect();
        const observer = new MutationObserver(detect);
        observer.observe(hostElement, { childList: true, subtree: true });
        return () => observer.disconnect();
    });

    $effect(() => {
        highlightedLines;
        highlightedSingleLine;
        updateScrollFade();
    });

    $effect(() => {
        if (!isSingleLine) return;
        resizeHeight = undefined;
        isFullscreen = false;
        isExitingFullscreen = false;
    });

    $effect(() => {
        const element = fullscreenElement;
        if (!element || !isFullscreen || isExitingFullscreen) return;
        beginFlipEnter(fullscreenMotionId, element, {
            strategy: "layout",
        });
    });

    $effect(() => {
        const el = codeViewportElement;
        if (!el) return;
        updateScrollFade();
        el.addEventListener("scroll", updateScrollFade);
        const unwatch = resizeManager.watch(el, updateScrollFade);
        return () => {
            el.removeEventListener("scroll", updateScrollFade);
            unwatch();
        };
    });

    $effect(() => {
        const el = fullscreenViewportElement;
        if (!el) return;
        updateScrollFade();
        el.addEventListener("scroll", updateScrollFade);
        const unwatch = resizeManager.watch(el, updateScrollFade);
        return () => {
            el.removeEventListener("scroll", updateScrollFade);
            unwatch();
        };
    });
</script>

<!-- stateContent Snippet：Idle → Copy 图标 -->
{#snippet copyIconSnippet()}
    {#if hasCustomCopyIcon}
        <span class="snowui-code-block-icon-custom" data-as="copy-icon"
            >{@html customCopyIconHtml}</span
        >
    {:else}
        <ResourceIcon
            name="copy"
            class="snowui-code-block-icon-builtin"
            as="copy-icon"
            size={16}
            aria-hidden="true"
        />
    {/if}
{/snippet}

<!-- stateContent Snippet：Active → Check 图标 -->
{#snippet copiedIconSnippet()}
    {#if hasCustomCopiedIcon}
        <span class="snowui-code-block-icon-custom" data-as="copied-icon"
            >{@html customCopiedIconHtml}</span
        >
    {:else}
        <ResourceIcon
            name="check"
            class="snowui-code-block-icon-builtin"
            as="copied-icon"
            size={16}
            aria-hidden="true"
        />
    {/if}
{/snippet}

{#snippet expandIconSnippet()}
    <span class="snowui-code-block-icon-custom" data-as="expand-icon"
        >{@html customExpandIconHtml}</span
    >
{/snippet}

{#snippet collapseIconSnippet()}
    <span class="snowui-code-block-icon-custom" data-as="collapse-icon"
        >{@html customCollapseIconHtml}</span
    >
{/snippet}

<svelte:window onkeydown={handleKeydown} />

<!-- 根容器：bind:element 用于 MutationObserver 和 FLIP captureFlipRect 起点记录 -->
<Frame
    {...rest}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    enableDefaultMotion={true}
    enableAutoLayout={isSingleLine}
    row={isSingleLine}
    bind:element={hostElement}
    class={[
        "snowui-code-block",
        !isSingleLine && "snowui-overlay-scrollbar-host",
        className,
    ].filter(Boolean).join(" ")}
    data-variant={variant}
    data-resized={!isSingleLine && resizeHeight !== undefined ? "true" : undefined}
    style={rootStyle}
    renderHints={{
        variant: "rect",
        width: "100%",
        height: "auto",
        radius: "var(--radius-4)",
    }}
    componentParts={parts}
>
    {#if isSingleLine}
        {#if hasCustomLeading}
            <span
                class="snowui-code-block-single-line-leading"
                data-as="leading">{@html customLeadingHtml}</span
            >
        {/if}

        <div class="snowui-code-block-single-line-content">
            <pre class="snowui-code-block-pre"><code
                    class="snowui-code-block-code"
                    >{#each highlightedSingleLine as token}<span
                            class={`snowui-code-block-token snowui-code-block-token-${token.kind}`}
                            >{token.text}</span
                        >{/each}</code
                ></pre
            >
        </div>

        {#if hasCustomTrailing}
            <span
                class="snowui-code-block-trailing-custom"
                data-as="trailing">{@html customTrailingHtml}</span
            >
        {:else if showCopyButton}
            <div
                class="snowui-code-block-actions snowui-code-block-single-line-trailing"
                data-as="trailing"
            >
                <CopyButton
                    text={resolvedCode}
                    bare
                    emphasis={parts?.CopyButton?.emphasis ?? "muted"}
                    showText={false}
                    feedbackDuration={copyTimeout}
                    icon={hasCustomCopyIcon
                        ? normalizeActionSnippet(copyIconSnippet)
                        : undefined}
                    successIcon={hasCustomCopiedIcon
                        ? normalizeActionSnippet(copiedIconSnippet)
                        : undefined}
                    class="snowui-code-block-btn snowui-hoverable"
                    ariaLabel="复制代码"
                />
            </div>
        {/if}
    {:else}
    <!-- 工具栏 -->
    <div
        class="snowui-code-block-toolbar snowui-code-block-default-pin-top-right"
        data-as="pin-top-right"
        style="--pin-offset: var(--padding-3);"
    >
        {#if showLanguage && language}
            <span class="snowui-code-block-lang">{language}</span>
        {/if}

        <div class="snowui-code-block-actions">
            {#if hasCustomTrailing}
                <span
                    class="snowui-code-block-trailing-custom"
                    data-as="trailing">{@html customTrailingHtml}</span
                >
            {:else}
                <!-- 复制按钮：默认内置 bare CopyButton，统一剪贴板与反馈期交互 -->
                {#if showCopyButton}
                    <CopyButton
                        text={resolvedCode}
                        bare
                        emphasis={parts?.CopyButton?.emphasis ?? "muted"}
                        showText={false}
                        feedbackDuration={copyTimeout}
                        icon={hasCustomCopyIcon
                            ? normalizeActionSnippet(copyIconSnippet)
                            : undefined}
                        successIcon={hasCustomCopiedIcon
                            ? normalizeActionSnippet(copiedIconSnippet)
                            : undefined}
                        class="snowui-code-block-btn snowui-hoverable"
                        ariaLabel="复制代码"
                    />
                {/if}

                <!-- 放大/缩小按钮 -->
                {#if showExpandButton}
                    <ExpandButton
                        expanded={isFullscreen}
                        bare
                        emphasis={parts?.ExpandButton?.emphasis ?? "muted"}
                        class="snowui-code-block-btn"
                        ariaLabel="全屏查看"
                        collapseAriaLabel="退出全屏"
                        onclick={toggleFullscreen}
                        icon={hasCustomExpandIcon
                            ? normalizeActionSnippet(expandIconSnippet)
                            : undefined}
                        collapseIcon={hasCustomCollapseIcon
                            ? normalizeActionSnippet(collapseIconSnippet)
                            : undefined}
                    />
                {/if}
            {/if}
        </div>
    </div>

    <!-- 代码区 -->
    <div class="snowui-code-block-scroll-shell">
        <div
            bind:this={codeViewportElement}
            class="snowui-code-block-body snowui-overlay-scrollbar-viewport snowui-scroll-mask"
            data-scroll-mask={resolveScrollMask(showTopFade, showBottomFade)}
        >
            {#if showLineNumbers && lines.length > 0}
                <div class="snowui-code-block-gutter" aria-hidden="true">
                    {#each lines as _, i}
                        <span class="snowui-code-block-line-number"
                            >{i + 1}</span
                        >
                    {/each}
                </div>
            {/if}
            <div class="snowui-code-block-pre-wrap">
                <pre class="snowui-code-block-pre"><code
                        class="snowui-code-block-code"
                        >{#each highlightedLines as line}<span
                                class="snowui-code-block-line"
                                >{#each line as token}<span
                                        class={`snowui-code-block-token snowui-code-block-token-${token.kind}`}
                                        >{token.text}</span
                                    >{/each}</span
                            >{/each}</code
                    ></pre>
            </div>
        </div>
    </div>
    <div
        bind:this={codeScrollbarElement}
        class="snowui-code-block-scrollbar snowui-overlay-scrollbar"
        data-visible={codeScrollbar.hasOverflow ? "true" : undefined}
        aria-hidden="true"
    >
        <div
            class="snowui-overlay-scrollbar-thumb"
            style="height: {codeScrollbar.thumbHeight}px; transform: translate3d(0, {codeScrollbar.thumbY}px, 0);"
        ></div>
    </div>
    <Indicator
        target={hostElement}
        revealTarget={hostElement}
        axis="height"
        edge="bottom"
        appearance="corner"
        value={resizeHeight}
        minSize={60}
        ariaLabel="调整代码块高度"
        onSizeChange={handleResizeHeight}
    />
    {/if}
    {#if children}
        <div class="snowui-code-block-accessories" aria-hidden="true">
            {@render children()}
        </div>
    {/if}
</Frame>

<!-- 全屏覆盖层：手动使用 layout 策略进出，代码字形不参与 scale -->
{#if !isSingleLine && (isFullscreen || isExitingFullscreen)}
    <Frame
        bind:element={fullscreenElement}
        tag="div"
        role="dialog"
        aria-modal="true"
        aria-label="全屏代码查看"
        enableResponsive={false}
        enableContext={false}
        enableScaleObserver={false}
        class="snowui-code-block-fullscreen snowui-overlay-scrollbar-host"
        tabindex={-1}
    >
        <!-- 全屏工具栏 -->
        <div
            class="snowui-code-block-toolbar snowui-code-block-toolbar-fullscreen"
            data-as="pin-top-right"
            style="--pin-offset: var(--padding-3);"
        >
            {#if showLanguage && language}
                <span class="snowui-code-block-lang">{language}</span>
            {/if}
            <div class="snowui-code-block-actions">
                {#if hasCustomTrailing}
                    <span
                        class="snowui-code-block-trailing-custom"
                        data-as="trailing">{@html customTrailingHtml}</span
                    >
                {:else if showCopyButton}
                    <CopyButton
                        text={resolvedCode}
                        bare
                        emphasis={parts?.CopyButton?.emphasis ?? "muted"}
                        showText={false}
                        feedbackDuration={copyTimeout}
                        icon={hasCustomCopyIcon
                            ? normalizeActionSnippet(copyIconSnippet)
                            : undefined}
                        successIcon={hasCustomCopiedIcon
                            ? normalizeActionSnippet(copiedIconSnippet)
                            : undefined}
                        class="snowui-code-block-btn snowui-hoverable"
                        ariaLabel="复制代码"
                    />
                {/if}
                {#if showExpandButton}
                    <!-- 全屏内缩小按钮（直接显示 ArrowsInSimple，不需进场动效） -->
                    <ExpandButton
                        expanded
                        bare
                        emphasis={parts?.ExpandButton?.emphasis ?? "muted"}
                        class="snowui-code-block-btn"
                        ariaLabel="全屏查看"
                        collapseAriaLabel="退出全屏"
                        onclick={exitFullscreen}
                        collapseIcon={hasCustomCollapseIcon
                            ? normalizeActionSnippet(collapseIconSnippet)
                            : undefined}
                    />
                {/if}
            </div>
        </div>

        <!-- 全屏代码区：与普通态共同遵循 showLineNumbers -->
        <div
            class="snowui-code-block-scroll-shell snowui-code-block-scroll-shell-fullscreen"
        >
            <div
                bind:this={fullscreenViewportElement}
                class="snowui-code-block-body snowui-code-block-body-fullscreen snowui-overlay-scrollbar-viewport snowui-scroll-mask"
                data-scroll-mask={resolveScrollMask(
                    showFullscreenTopFade,
                    showFullscreenBottomFade,
                )}
            >
                {#if showLineNumbers && lines.length > 0}
                    <div class="snowui-code-block-gutter" aria-hidden="true">
                        {#each lines as _, i}
                            <span class="snowui-code-block-line-number"
                                >{i + 1}</span
                            >
                        {/each}
                    </div>
                {/if}
                <div class="snowui-code-block-pre-wrap">
                    <pre class="snowui-code-block-pre"><code
                            class="snowui-code-block-code"
                            >{#each highlightedLines as line}<span
                                    class="snowui-code-block-line"
                                    >{#each line as token}<span
                                            class={`snowui-code-block-token snowui-code-block-token-${token.kind}`}
                                            >{token.text}</span
                                        >{/each}</span
                                >{/each}</code
                        ></pre>
                </div>
            </div>
        </div>
        <div
            bind:this={fullscreenScrollbarElement}
            class="snowui-code-block-scrollbar snowui-overlay-scrollbar"
            data-visible={fullscreenScrollbar.hasOverflow ? "true" : undefined}
            aria-hidden="true"
        >
            <div
                class="snowui-overlay-scrollbar-thumb"
                style="height: {fullscreenScrollbar.thumbHeight}px; transform: translate3d(0, {fullscreenScrollbar.thumbY}px, 0);"
            ></div>
        </div>
    </Frame>
{/if}

<style>
    /* ─── Level 2：组件基类（降权 0,0,0） ─── */
    :global(:where(.snowui-code-block)) {
        --snowui-code-block-bg: var(--background-2, #f9f9fa);
        --snowui-code-block-fg: var(--black-100, #000000ff);
        --snowui-code-block-muted-fg: var(--black-40, #00000066);
        --snowui-code-block-gutter-fg: var(--black-20, #00000033);
        --snowui-code-block-btn-fg: var(--black-100, #000000ff);
        --snowui-code-block-keyword-fg: #ff32c6;
        --snowui-code-block-function-fg: #ffac60;
        --snowui-code-block-property-fg: #1ac69c;
        --snowui-code-block-string-fg: #3fa4ff;
        --snowui-code-block-variable-fg: #c478ff;
        --snowui-code-block-radius: var(--radius-4);
        --snowui-code-block-padding-x: var(--padding-5);
        --snowui-code-block-padding-y: var(--padding-5);
        --snowui-code-block-gap: var(--gap-2);
        --snowui-code-block-code-gap: var(--gap-3);
        --snowui-code-block-footer-height: var(--padding-3);
        --snowui-code-block-font-size: var(--text-12);
        --snowui-code-block-line-height: var(--leading-12);
        --snowui-code-block-font-family: inherit;
        --snowui-code-block-visible-lines: 5;
        --snowui-code-block-content-height: calc(
            var(--snowui-code-block-visible-lines) * 1lh
        );

        background-color: var(
            --snowui-code-block-bg-override,
            var(--snowui-code-block-bg)
        );
        color: var(
            --snowui-code-block-fg-override,
            var(--snowui-code-block-fg)
        );
        border-radius: var(
            --snowui-code-block-radius-override,
            var(--snowui-code-block-radius)
        );
        padding: var(
            --snowui-code-block-padding-override,
            var(
                    --snowui-code-block-padding-y-override,
                    var(--snowui-code-block-padding-y)
                )
                var(
                    --snowui-code-block-padding-x-override,
                    var(--snowui-code-block-padding-x)
                )
        );
        font-size: var(--snowui-code-block-font-size);
        line-height: var(--snowui-code-block-line-height);
        font-family: var(--snowui-code-block-font-family);
        overflow: hidden;
        position: relative;
        width: 100%;
    }

    :global(:where(.snowui-code-block[data-variant="default"])) {
        display: flex;
        flex-direction: column;
        gap: var(--gap-2);
    }

    /* singleLine：沿用 Input 的 Leading / Content / Trailing 三槽结构。 */
    :global(:where(.snowui-code-block[data-variant="singleLine"])) {
        --snowui-code-block-padding-x: var(--padding-4);
        --snowui-code-block-padding-y: var(--padding-3);

        gap: var(
            --snowui-code-block-gap-override,
            var(--snowui-code-block-gap)
        );
        box-sizing: border-box;
        height: auto;
    }

    :global(:where(.snowui-code-block-single-line-content)) {
        grid-row: 1;
        min-width: 0;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        scrollbar-width: none;
    }

    :global(:where(.snowui-code-block-single-line-content::-webkit-scrollbar)) {
        display: none;
    }

    :global(
        :where(
            .snowui-code-block[data-variant="singleLine"]
                > [data-as="leading"],
            .snowui-code-block[data-variant="singleLine"]
                > [data-as="trailing"]
        )
    ) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 0;
        white-space: nowrap;
        line-height: inherit;
    }

    :global(:where(.snowui-code-block-fullscreen)) {
        --snowui-code-block-bg: var(--background-2, #f9f9fa);
        --snowui-code-block-fg: var(--black-100, #000000ff);
        --snowui-code-block-muted-fg: var(--black-40, #00000066);
        --snowui-code-block-gutter-fg: var(--black-20, #00000033);
        --snowui-code-block-btn-fg: var(--black-100, #000000ff);
        --snowui-code-block-radius: var(--radius-4);
        --snowui-code-block-padding-x: var(--padding-5);
        --snowui-code-block-padding-y: var(--padding-5);
        --snowui-code-block-gap: var(--gap-2);
        --snowui-code-block-code-gap: var(--gap-3);
        --snowui-code-block-footer-height: var(--padding-3);
        --snowui-code-block-font-size: var(--text-12);
        --snowui-code-block-line-height: var(--leading-12);
        --snowui-code-block-font-family: inherit;
        --snowui-code-block-content-height: 5lh;
    }

    /* ─── 工具栏 ─── */
    :global(:where(.snowui-code-block-toolbar)) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--gap-2);
        z-index: 3;
    }

    :global(:where(.snowui-code-block-lang)) {
        color: var(--snowui-code-block-muted-fg);
        user-select: none;
    }

    :global(:where(.snowui-code-block-actions)) {
        display: flex;
        align-items: center;
        gap: var(
            --snowui-code-block-gap-override,
            var(--snowui-code-block-gap)
        );
    }

    /* ─── 图标按钮：统一使用 CopyButton / ExpandButton 的 bare 默认尺寸 ─── */
    :global(:where(button).snowui-code-block-btn) {
        --snowui-field-focus-ring-width: 0;
        color: var(--snowui-code-block-btn-fg);
        transition:
            color var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(
        :where(button).snowui-code-block-btn:focus,
        :where(button).snowui-code-block-btn:focus-visible
    ) {
        outline: none;
        box-shadow: none;
    }

    :global(:where(button).snowui-code-block-btn:hover:not(:disabled)) {
        background-image: none;
        box-shadow: none;
    }

    /* ─── 代码主体区域 ─── */
    :global(:where(.snowui-code-block-scroll-shell)) {
        position: relative;
        height: var(
            --snowui-code-block-content-height-override,
            var(--snowui-code-block-content-height)
        );
        min-height: 0;
        overflow: clip;
        background: transparent;
    }

    :global(:where(.snowui-code-block[data-resized="true"] .snowui-code-block-scroll-shell)) {
        flex: 1 1 0;
        height: auto;
    }

    /* 上下滚动渐隐：接入「内容渐隐层」通用能力的 CSS 静态形态（.snowui-scroll-mask，见 lib/edge-fade.md）。 */
    :global(:where(.snowui-code-block-body)) {
        --snowui-code-block-scroll-mask-size: var(
            --snowui-code-block-scroll-mask-size-override,
            32px
        );
        display: flex;
        align-items: flex-start;
        gap: var(
            --snowui-code-block-code-gap-override,
            var(--snowui-code-block-code-gap)
        );
        flex: 1 1 0;
        height: 100%;
        overflow-x: auto;
        min-height: 0;
        background: transparent;
    }

    /* ─── 行号槽 ─── */
    :global(:where(.snowui-code-block-gutter)) {
        display: block;
        flex-shrink: 0;
        width: max-content;
        color: var(--snowui-code-block-gutter-fg);
        background: transparent;
        text-align: right;
        user-select: none;
        font: inherit;
    }

    :global(:where(.snowui-code-block-line-number)) {
        display: block;
        line-height: inherit;
    }

    :global(:where(.snowui-code-block-pre-wrap)) {
        flex: 1 1 0;
        min-width: 0;
        overflow: visible;
        background: transparent;
    }

    :global(:where(.snowui-code-block-pre)) {
        margin: 0;
        tab-size: 4;
        white-space: pre;
        overflow: visible;
        background: transparent;
        font: inherit;
    }

    :global(:where(.snowui-code-block-code)) {
        display: block;
        color: inherit;
        background: transparent;
        border-radius: 0;
        font: inherit;
        margin: 0;
        padding: 0;
    }

    :global(
        :where(
            .snowui-code-block[data-variant="singleLine"]
                .snowui-code-block-pre
        )
    ) {
        white-space: nowrap;
    }

    :global(
        :where(
            .snowui-code-block[data-variant="singleLine"]
                .snowui-code-block-code
        )
    ) {
        display: inline;
    }

    :global(:where(.snowui-code-block-line)) {
        display: block;
        line-height: inherit;
    }

    :global(:where(.snowui-code-block-token-comment)) {
        color: var(--black-40, #00000066);
    }

    :global(:where(.snowui-code-block-token-keyword)) {
        color: #ff32c6;
    }

    :global(:where(.snowui-code-block-token-function)) {
        color: #ffac60;
    }

    :global(:where(.snowui-code-block-token-property)) {
        color: #1ac69c;
    }

    :global(:where(.snowui-code-block-token-string)) {
        color: #3fa4ff;
    }

    :global(:where(.snowui-code-block-token-variable)) {
        color: #c478ff;
    }

    /* ─── 全屏覆盖层 ─── */
    :global(:where(.snowui-code-block-fullscreen)) {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        font-size: var(--snowui-code-block-font-size);
        line-height: var(--snowui-code-block-line-height);
        font-family: var(--snowui-code-block-font-family);
        background-color: var(
            --snowui-code-block-bg-override,
            var(--snowui-code-block-bg)
        );
        color: var(
            --snowui-code-block-fg-override,
            var(--snowui-code-block-fg)
        );
        border-radius: 0;
        padding: var(
            --snowui-code-block-padding-override,
            var(
                    --snowui-code-block-padding-y-override,
                    var(--snowui-code-block-padding-y)
                )
                var(
                    --snowui-code-block-padding-x-override,
                    var(--snowui-code-block-padding-x)
                )
        );
    }

    /* 全屏工具栏与普通态保持一致：距上/右 8px。 */
    :global(:where(.snowui-code-block-toolbar-fullscreen)) {
        padding: 0;
    }

    :global(:where(.snowui-code-block-body-fullscreen)) {
        padding-bottom: max(var(--padding-0), env(safe-area-inset-bottom));
    }

    :global(:where(.snowui-code-block-scroll-shell-fullscreen)) {
        flex: 1 1 0;
        height: auto;
    }

    /* 组件只声明轨道定位；视觉样式由 scrollbar.css 的 .snowui-overlay-scrollbar 承接。 */
    /* 滚动条提升到根容器（position:relative），绕开 scroll-shell 的 overflow:clip 裁切。 */
    /* top/bottom 对齐 scroll-shell 上下边缘（即容器 padding-y 处），right: 4px 贴近右边缘。 */
    :global(:where(.snowui-code-block-scrollbar)) {
        top: var(
            --snowui-code-block-padding-y-override,
            var(--snowui-code-block-padding-y)
        );
        right: 4px;
        bottom: var(--snowui-code-block-footer-height);
        z-index: 2;
    }

    :global(:where(.snowui-code-block-accessories)) {
        position: absolute;
        width: 0;
        height: 0;
        overflow: hidden;
        pointer-events: none;
        opacity: 0;
    }

    /* ─── 内置 SVG 图标基础样式 ─── */
    :global(:where(.snowui-code-block-icon-builtin)),
    :global(:where(.snowui-code-block-icon-custom)) {
        display: block;
        flex-shrink: 0;
        color: inherit;
    }

    :global(:where(.snowui-code-block-icon-custom > *)) {
        display: block;
    }

    :global(:where(.snowui-code-block-trailing-custom)) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: inherit;
    }

    :global(:where(.snowui-code-block-trailing-custom > *)) {
        display: inline-flex;
    }
</style>
