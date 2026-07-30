<!--
  Button 组件：基础交互按钮
  v2.3.2

 1. 核心能力 (Capabilities):
    - 继承 Frame 组件的所有通用能力 (交互、动效、响应式等)
    - 多态渲染: 支持渲染为 button 或 a 标签 (通过 Frame 的 as 属性)
    - 角色化组合: 支持 `as="more"` (需配合 Text 组件)
    - 样式扩展: 仅负责 Button 特有的样式定义

 2. 交互集成 (Interaction):
    - 逻辑委托给 Frame 组件
    - 内部仅处理 Button 特有的内容布局 (Grid Stacking)

 3. 布局稳定性 (Layout Stability):
    - 使用 Grid Stacking 确保状态切换时尺寸不跳动
 -->

<script lang="ts">
  import { onDestroy, setContext, type Snippet } from "svelte";
  import { RESOURCE_ICON_CONTEXT_KEY } from "@snowui-design-system/resource-svelte";
  import Frame, { type FrameProps } from "./Frame.svelte";
  import {
    mergeComponentPartProps,
    useComponentPart,
  } from "../logic/component-parts.svelte";
  import {
    getImage,
    getImageViewer,
    getText,
    getSize,
    getButtonGroup,
    getButtonSize,
    getBreadcrumb,
  } from "../context";

  interface Props extends Omit<FrameProps, "size"> {
    variant?: "gray" | "filled" | "outline" | "borderless";
    size?: "sm" | "md" | "lg";
    bare?: boolean;
    /** 是否启用背景内容模糊；默认 false。 */
    backgroundBlur?: boolean;
    /**
     * Toggle 模式：内部自动注入 `Click={{Idle:"Active",Active:"Idle"}}` 与 `whileClick=false` 默认值，
     * 配合 Frame 自动暴露的 `data-state="Active"` 让根节点在激活态自动套用 Secondary/Indigo 配色。
     * `aria-pressed` 也由 Frame 自动输出。
     * 消费方可继续传 `Click` / `whileClick` 覆盖默认行为。
     */
    toggle?: boolean;
    holdRepeat?: boolean;
    holdRepeatDelay?: number;
    holdRepeatInterval?: number;
    children?: Snippet;
    [key: string]: any;
  }

  // 跨独立仓库源码检查时，Svelte 的 Snippet nominal symbol 可能来自不同物理安装。
  // 此处只归一化传给 Frame 的类型身份，不改变 snippet 本身或运行时调用。
  function normalizeFrameSnippet(snippet: unknown): Snippet<[any]> {
    return snippet as Snippet<[any]>;
  }

  const inheritedButtonPart = useComponentPart<Props>("Button");
  let explicitProps: Props = $props();
  let {
    variant = undefined,
    size = undefined,
    bare = false,
    backgroundBlur = false,
    toggle = false,
    href = undefined,
    target = undefined,
    rel = undefined,
    disabled = false,
    holdRepeat = false,
    holdRepeatDelay = 260,
    holdRepeatInterval = 80,
    onclick: userOnClick,
    onpointerdown: userOnPointerDown,
    onpointerup: userOnPointerUp,
    onpointerleave: userOnPointerLeave,
    onpointercancel: userOnPointerCancel,
    Click: clickProp = undefined,
    style: userStyle = "",
    class: className = "",
    renderHints: userRenderHints = undefined,
    as = undefined,
    children,
    ...rest // Pass everything else to Frame
  }: Props = $derived(
    mergeComponentPartProps(inheritedButtonPart.current, explicitProps),
  );

  // toggle 模式默认值注入：消费方未传 Click 时注入 toggle 状态机，未传 whileClick 时关闭 press 反馈。
  // 任一已显式传入则尊重消费方意图。
  const toggleDefaults = $derived.by(() => {
    if (!toggle) return undefined;
    const out: Record<string, any> = {};
    if (clickProp === undefined) out.Click = { Idle: "Active", Active: "Idle" };
    if (rest.whileClick === undefined) out.whileClick = false;
    return out;
  });

  // 上下文感知
  const contextSize = getSize();
  const buttonGroupCtx = getButtonGroup();
  const buttonSizeCtx = getButtonSize();
  const breadcrumbCtx = getBreadcrumb();
  const isButtonGroupEmbedded = $derived(
    as === "item" && buttonGroupCtx?.present === true,
  );
  const resolvedVariant = $derived.by(() => {
    if (variant !== undefined) return variant;
    if (isButtonGroupEmbedded && buttonGroupCtx?.variant !== undefined) return buttonGroupCtx.variant;
    if (as === "item" && breadcrumbCtx?.variant !== undefined) {
      return breadcrumbCtx.variant;
    }
    return "gray";
  });
  const resolvedDisabled = $derived(
    disabled || (isButtonGroupEmbedded && buttonGroupCtx?.disabled === true),
  );
  // 计算最终尺寸：优先使用 prop size，其次映射上下文尺寸
  const resolvedSize = $derived.by(() => {
    if (size) return size;
    if (isButtonGroupEmbedded && buttonGroupCtx?.size) return buttonGroupCtx.size;
    if (as === "item" && buttonSizeCtx?.present) return buttonSizeCtx.size;
    if (contextSize === undefined) return "sm";
    if (typeof contextSize === "number") {
      if (contextSize <= 16) return "sm";
      if (contextSize <= 28) return "md";
      return "lg";
    }
    return "sm";
  });

  // 响应式的单个图标状态
  let isIconOnly = $state(false);
  let buttonElement = $state<HTMLElement | undefined>(undefined);

  const defaultButtonIconSize = $derived.by(() => {
    if (resolvedSize === "lg") return 20;
    if (resolvedSize === "md") return 16;
    return 12;
  });

  // 传递给 Frame Context 的尺寸（供 Icon/Avatar 等子组件继承）
  const contextPixelSize = $derived.by(() => {
    if (bare && isIconOnly) return defaultButtonIconSize;
    if (isIconOnly) {
      if (resolvedSize === "lg") return 24;
      if (resolvedSize === "md") return 20;
      return 16;
    } else {
      if (resolvedSize === "lg") return 20;
      if (resolvedSize === "md") return 16;
      return 12;
    }
  });
  const buttonRenderHints = $derived.by(() => {
    if (bare && isIconOnly) {
      return {
        variant: userRenderHints?.variant ?? "circle",
        width: userRenderHints?.width ?? `${defaultButtonIconSize}px`,
        height: userRenderHints?.height ?? `${defaultButtonIconSize}px`,
        radius: userRenderHints?.radius ?? "0",
      };
    }
    const base =
      resolvedSize === "lg"
        ? {
            variant: "line",
            width: "7rem",
            height: "3rem",
            radius: "var(--radius-5)",
          }
        : resolvedSize === "md"
          ? {
              variant: "line",
              width: "6rem",
              height: "2.25rem",
              radius: "var(--radius-4)",
            }
          : {
              variant: "line",
              width: "5rem",
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

  // 资源图标直接放在 Button 内时，注入默认尺寸上下文（与 <Icon> 包裹一致）
  setContext(RESOURCE_ICON_CONTEXT_KEY, {
    get size() {
      return contextPixelSize;
    },
  });

  // 上下文感知 (用于 as="more" 逻辑)
  const textCtx = getText();
  const imageCtx = getImage();
  const imageViewerCtx = getImageViewer();

  // 角色化逻辑：as="more" 即作为 Text 展开按钮样式角色。
  // 是否存在 TextContext 仅影响点击联动，不影响按钮本身渲染与定位样式。
  const isExpandButton = $derived(as === "more");
  const hostStyle = $derived.by(() => {
    if (as === "more") return "--pin-offset: 4px;";
    if (as === "badge" && imageCtx) return imageCtx.badgeStyle || "";
    if (as === "icon" && imageCtx) return imageCtx.iconStyle || "";
    // ImageViewer 角色仅保留显隐控制，布局定位已回归架构代理
    if (imageViewerCtx) {
      if (as === "prev") return imageViewerCtx.prevStyle || "";
      if (as === "next") return imageViewerCtx.nextStyle || "";
      if (as === "close") return imageViewerCtx.closeStyle || "";
    }
    return "";
  });
  const buttonStyle = $derived.by(() => {
    const styles = [hostStyle, userStyle]
      .filter(Boolean)
      .join("; ");
    return styles || undefined;
  });
  const clickProps = $derived.by(() => {
    if (isExpandButton || clickProp === undefined) return {};
    return { Click: clickProp };
  });
  const frameRestProps = $derived.by(() => {
    const next = { ...rest };
    delete next.Click;
    return next;
  });
  const layoutAs = $derived.by(() => {
    if (as === "more") return "pin-bottom-right";
    if (as === "badge" && imageCtx) return imageCtx.badgeAs || as;
    if (as === "icon" && imageCtx) return imageCtx.iconAs || as;
    if (imageViewerCtx) {
      if (as === "prev") return imageViewerCtx.prevAs || as;
      if (as === "next") return imageViewerCtx.nextAs || as;
      if (as === "close") return imageViewerCtx.closeAs || as;
    }
    return as;
  });

  // 计算最终的标签
  let tag = $derived(href ? "a" : "button");

  let holdStartTimer = $state<ReturnType<typeof setTimeout> | null>(null);
  let holdRepeatTimer = $state<ReturnType<typeof setInterval> | null>(null);
  let holdNativeClickSuppressed = $state(false);
  let holdSuppressResetTimer = $state<ReturnType<typeof setTimeout> | null>(
    null,
  );

  function clearHoldTimers() {
    if (holdStartTimer) {
      clearTimeout(holdStartTimer);
      holdStartTimer = null;
    }
    if (holdRepeatTimer) {
      clearInterval(holdRepeatTimer);
      holdRepeatTimer = null;
    }
  }

  function clearHoldSuppressResetTimer() {
    if (holdSuppressResetTimer) {
      clearTimeout(holdSuppressResetTimer);
      holdSuppressResetTimer = null;
    }
  }

  function findDirectTemporalHost(scope: HTMLElement | null): HTMLElement | null {
    if (!scope) return null;
    const candidates = Array.from(scope.children).filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement &&
        child.matches(".snowui-input[data-temporal-input='true']"),
    );
    if (candidates.length !== 1) return null;
    return candidates[0];
  }

  function resolveDateTriggerBinding(node: HTMLElement) {
    if (as !== "trailing") return null;

    const fieldRoot =
      node.closest(".snowui-field") instanceof HTMLElement
        ? (node.closest(".snowui-field") as HTMLElement)
        : null;

    let scope = node.parentElement;
    while (scope) {
      const host = findDirectTemporalHost(scope);
      if (host) {
        const input = host.querySelector(".snowui-input-control-native");
        if (input instanceof HTMLInputElement) {
          return { host, input };
        }
      }
      if (scope === fieldRoot) break;
      scope = scope.parentElement;
    }

    return null;
  }

  function tryOpenDatePicker(
    node: HTMLElement | undefined,
    event?: MouseEvent,
  ) {
    if (!node || resolvedDisabled) return false;

    const binding = resolveDateTriggerBinding(node);
    if (!binding) return false;

    event?.preventDefault();

    const input = binding.input as HTMLInputElement & {
      showPicker?: () => void;
    };

    // 某些浏览器（Safari / 旧版 Chrome）对 opacity:0 的元素拒绝 showPicker / click()，
    // 临时覆盖 opacity 为极小非零值，完成调用后立即还原。
    input.style.setProperty("opacity", "0.001", "important");
    let opened = false;
    try {
      if (typeof input.showPicker === "function") {
        input.showPicker();
      } else {
        input.click();
      }
      opened = true;
    } catch {
      try {
        input.click();
        opened = true;
      } catch {
        // ignore
      }
    } finally {
      input.style.removeProperty("opacity");
    }
    return opened;
  }

  function dispatchRepeatClick(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return;
    target.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        composed: true,
      }),
    );
  }

  // 处理点击 (Button 特有逻辑: 展开)
  function handleClick(event?: MouseEvent) {
    if (buttonElement?.getAttribute("aria-current") === "page") {
      event?.preventDefault();
      event?.stopPropagation();
      return;
    }

    // holdRepeat 模式下，按下已主动触发 click，这里丢弃随后浏览器的原生 trusted click，避免重复计算
    if (holdRepeat && holdNativeClickSuppressed && event?.isTrusted) {
      holdNativeClickSuppressed = false;
      clearHoldSuppressResetTimer();
      return;
    }

    if (isExpandButton && textCtx) {
      const currentTarget =
        event?.currentTarget instanceof HTMLElement
          ? event.currentTarget
          : buttonElement;
      const expandDelay = Number(textCtx.handleExpand() ?? 0);
      const expandClick = clickProp;
      if (
        expandClick &&
        typeof expandClick === "object" &&
        "run" in expandClick &&
        typeof expandClick.run === "function"
      ) {
        window.setTimeout(() => {
          expandClick.run({
            currentTarget,
            target: currentTarget,
            originalEvent: event,
          });
        }, Math.max(0, expandDelay));
      }
    }
    userOnClick?.(event);
    if (event?.defaultPrevented || userOnClick) return;
    const triggerNode =
      event?.currentTarget instanceof HTMLElement
        ? event.currentTarget
        : buttonElement;
    if (tryOpenDatePicker(triggerNode, event)) return;
    if (as === "prev") {
      imageViewerCtx?.showPrev?.();
      return;
    }
    if (as === "next") {
      imageViewerCtx?.showNext?.();
      return;
    }
    if (as === "close") {
      imageViewerCtx?.close?.();
    }
  }

  function handlePointerDown(event: PointerEvent) {
    userOnPointerDown?.(event);
    if (!holdRepeat) return;
    if (resolvedDisabled) return;
    if (tag !== "button") return;
    if (event.button !== 0) return;

    event.preventDefault();
    clearHoldTimers();
    clearHoldSuppressResetTimer();
    holdNativeClickSuppressed = true;

    const target = event.currentTarget;
    dispatchRepeatClick(target);

    holdStartTimer = setTimeout(
      () => {
        holdRepeatTimer = setInterval(
          () => {
            dispatchRepeatClick(target);
          },
          Math.max(1, holdRepeatInterval),
        );
      },
      Math.max(0, holdRepeatDelay),
    );
  }

  function handlePointerUp(event: PointerEvent) {
    userOnPointerUp?.(event);
    clearHoldTimers();
    if (!holdRepeat || !holdNativeClickSuppressed) return;
    clearHoldSuppressResetTimer();
    holdSuppressResetTimer = setTimeout(() => {
      holdNativeClickSuppressed = false;
      holdSuppressResetTimer = null;
    }, 40);
  }

  function handlePointerLeave(event: PointerEvent) {
    userOnPointerLeave?.(event);
    clearHoldTimers();
    if (!holdRepeat || !holdNativeClickSuppressed) return;
    clearHoldSuppressResetTimer();
    holdSuppressResetTimer = setTimeout(() => {
      holdNativeClickSuppressed = false;
      holdSuppressResetTimer = null;
    }, 40);
  }

  function handlePointerCancel(event: PointerEvent) {
    userOnPointerCancel?.(event);
    clearHoldTimers();
    holdNativeClickSuppressed = false;
    clearHoldSuppressResetTimer();
  }

  // 精确识别“仅 1 个图标且无文本节点”的场景，避免 icon + text 误判
  function detectIconOnly(node: HTMLElement) {
    const iconSelector =
      ".snowui-icon-wrapper, .snowui-icon, .snowui-avatar, svg, img";

    const update = () => {
      const elementChildren = Array.from(node.children).filter(
        (child) => !child.classList.contains("snowui-tooltip-placeholder"),
      );
      const hasSingleIconElement =
        elementChildren.length === 1 &&
        elementChildren[0]?.matches?.(iconSelector);
      const hasTextNode = Array.from(node.childNodes).some(
        (child) =>
          child.nodeType === Node.TEXT_NODE && !!child.textContent?.trim(),
      );

      node.classList.toggle(
        "snowui-button-icon-only",
        hasSingleIconElement && !hasTextNode,
      );
      isIconOnly = hasSingleIconElement && !hasTextNode;
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(node, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return {
      destroy() {
        observer.disconnect();
      },
    };
  }

  onDestroy(() => {
    clearHoldTimers();
    clearHoldSuppressResetTimer();
  });
</script>

{#snippet buttonChildren()}
  {@render children?.()}
{/snippet}

<Frame
  bind:element={buttonElement}
  enableResponsive={false}
  enableContext={true}
  enableScaleObserver={false}
  size={contextPixelSize}
  {tag}
  as={layoutAs}
  {href}
  {target}
  {rel}
  data-variant={bare ? undefined : resolvedVariant}
  data-embedded={isButtonGroupEmbedded ? "button-group" : undefined}
  data-leading={as === "leading" ? "true" : undefined}
  data-trailing={as === "trailing" ? "true" : undefined}
  type={tag === "button" ? rest.type || "button" : undefined}
  disabled={resolvedDisabled}
  class={[
    "snowui-button",
    "snowui-hoverable",
    `snowui-button-${resolvedVariant}`,
    `snowui-button-${resolvedSize}`,
    isExpandButton ? "snowui-text-expand-button" : "",
    as === "badge" ? "snowui-button-role-badge" : "",
    as === "icon" ? "snowui-button-role-icon" : "",
    as === "prev" ? "snowui-button-role-prev" : "",
    as === "next" ? "snowui-button-role-next" : "",
    as === "close" ? "snowui-button-role-close" : "",
    as === "item" ? "snowui-button-role-item" : "",
    bare ? "snowui-button-bare" : "",
    backgroundBlur ? "snowui-button-background-blur" : "",
    isButtonGroupEmbedded ? "snowui-button-embedded-button-group" : "",
    bare && isIconOnly
      ? "snowui-button-bare-icon-only"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")}
  style={buttonStyle}
  onclick={handleClick}
  onpointerdown={handlePointerDown}
  onpointerup={handlePointerUp}
  onpointerleave={handlePointerLeave}
  onpointercancel={handlePointerCancel}
  renderHints={buttonRenderHints}
  {...toggleDefaults}
  {...clickProps}
  {...frameRestProps}
  use={[detectIconOnly]}
  children={normalizeFrameSnippet(buttonChildren)}
/>

<style>
  /* Button 样式 */
  /* Level 2: Component Base (降权为 0) */
  :global(:where(.snowui-button)) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-direction: row;
    transition:
      color var(--snowui-frame-color-motion-duration, 0.15s) var(--snowui-frame-color-motion-easing, ease-out),
      background-color var(--snowui-frame-color-motion-duration, 0.15s) var(--snowui-frame-color-motion-easing, ease-out),
      --snowui-hover-overlay-opacity var(--snowui-frame-color-motion-duration, 0.15s) var(--snowui-frame-color-motion-easing, ease-out),
      border-color var(--snowui-frame-color-motion-duration, 0.15s) var(--snowui-frame-color-motion-easing, ease-out),
      box-shadow var(--snowui-frame-color-motion-duration, 0.15s) var(--snowui-frame-color-motion-easing, ease-out);
    border: none;
    cursor: var(--snowui-state-cursor, pointer);
    outline: none;
    box-sizing: border-box;
    text-decoration: none;
    white-space: nowrap;
    transform: translate(var(--snowui-drag-x, 0), var(--snowui-drag-y, 0));
    opacity: var(--snowui-button-opacity-override, var(--snowui-button-opacity));

    /* 内部计算层（internal） */
    --snowui-button-border-width: var(--border-1);
    --snowui-button-padding-block: var(--padding-1);
    --snowui-button-padding-inline: var(--padding-3);
    --snowui-button-padding: var(--snowui-button-padding-block)
      var(--snowui-button-padding-inline);
    --snowui-button-icon-only-padding: var(--padding-1);
    --snowui-button-gap: var(--gap-1);
    --snowui-button-radius: var(--radius-3);
    --snowui-button-font-size: var(--text-12);
    --snowui-button-line-height: var(--leading-12);
    --snowui-button-min-width: max-content;
    --snowui-button-min-height: 0;
    --snowui-button-width: auto;
    --snowui-button-height: auto;
    --snowui-button-opacity: var(
      --snowui-state-opacity,
      var(--snowui-parallax-opacity, 1)
    );
    --snowui-button-background: var(
      --black-4,
      color-mix(in srgb, currentColor 4%, transparent)
    );
    --snowui-button-color: currentColor;
    --snowui-button-border-color: transparent;

    /* 三层桥接（override -> internal） */
    width: var(--snowui-button-width-override, var(--snowui-button-width));
    height: var(--snowui-button-height-override, var(--snowui-button-height));
    min-width: var(
      --snowui-button-min-width-override,
      var(--snowui-button-min-width)
    );
    min-height: var(
      --snowui-button-min-height-override,
      var(--snowui-button-min-height)
    );
    padding: var(
      --snowui-button-padding-override,
      var(--snowui-button-padding)
    );
    gap: var(--snowui-button-gap-override, var(--snowui-button-gap));
    border-radius: var(
      --snowui-button-radius-override,
      var(--snowui-button-radius)
    );
    font-size: var(
      --snowui-button-font-size-override,
      var(--snowui-button-font-size)
    );
    line-height: var(
      --snowui-button-line-height-override,
      var(--snowui-button-line-height)
    );
    background-color: var(
      --snowui-button-background-override,
      var(--snowui-button-background)
    );
    color: var(--snowui-button-color-override, var(--snowui-button-color));
    box-shadow: inset 0 0 0
      var(
        --snowui-button-border-width-override,
        var(--snowui-button-border-width)
      )
      var(
        --snowui-button-border-color-override,
        var(--snowui-button-border-color)
      );
  }

  :global(:where(.snowui-button-background-blur)) {
    backdrop-filter: blur(
      var(--snowui-button-background-blur-override, 1.25rem)
    );
    -webkit-backdrop-filter: blur(
      var(--snowui-button-background-blur-override, 1.25rem)
    );
  }

  :global(:where(.snowui-button[data-as^="pin-"])) {
    position: absolute;
  }

  :global(:where(.snowui-button) > :not(.snowui-disabled)) {
    cursor: pointer;
  }

  :global(
      :where(.snowui-button):disabled,
      :where(.snowui-button)[aria-disabled="true"],
      :where(.snowui-button).snowui-disabled
    ) {
    cursor: default;
  }

  :global(:where(.snowui-button) svg),
  :global(:where(.snowui-button) img),
  :global(:where(.snowui-button) .snowui-icon-wrapper) {
    color: inherit;
    fill: currentColor;
    object-fit: cover;
  }

  /* 组合容器只能通过根属性请求内容显隐；Button 自己拥有内部 Text。 */
  :global(:where(.snowui-button[data-composition-content="hidden"]) .snowui-text) {
    display: none;
    opacity: 0;
  }

  /* Sizes (Level 4 - compound selector ensures 0,2,0 specificity) */
  :global(:where(.snowui-button).snowui-button-md) {
    --snowui-button-padding-block: var(--padding-2);
    --snowui-button-padding-inline: var(--padding-4);
    --snowui-button-padding: var(--snowui-button-padding-block)
      var(--snowui-button-padding-inline);
    --snowui-button-icon-only-padding: var(--padding-2);
    --snowui-button-gap: calc((var(--gap-1) + var(--gap-2)) / 2);
    --snowui-button-radius: var(--radius-4);
    --snowui-button-font-size: var(--text-14);
    --snowui-button-line-height: var(--leading-14);
    --snowui-button-min-width: max-content;
    --snowui-button-min-height: 0;
  }

  :global(:where(.snowui-button).snowui-button-lg) {
    --snowui-button-padding-block: var(--padding-3);
    --snowui-button-padding-inline: var(--padding-5);
    --snowui-button-padding: var(--snowui-button-padding-block)
      var(--snowui-button-padding-inline);
    --snowui-button-icon-only-padding: var(--padding-3);
    --snowui-button-gap: var(--gap-2);
    --snowui-button-radius: var(--radius-5);
    --snowui-button-font-size: var(--text-16);
    --snowui-button-line-height: var(--leading-16);
    --snowui-button-min-width: max-content;
    --snowui-button-min-height: 0;
  }

  /* 单图标按钮 (Level 2 Extension) */
  :global(:where(.snowui-button).snowui-button-icon-only) {
    padding: var(
      --snowui-button-icon-only-padding-override,
      var(--snowui-button-icon-only-padding)
    );
  }

  /* Level 4: Component Variants (标准权重，不使用 :where) */
  :global(:where(.snowui-button)[data-variant="filled"]) {
    --snowui-button-background: var(--primary, #000000);
    --snowui-button-color: var(--static-white-100, #ffffff);
    --snowui-button-border-color: transparent;
  }

  :global(
      :where(.snowui-button)[data-variant="filled"]:hover:not(.snowui-disabled)
    ) {
    --snowui-hover-opacity: 20%;
  }

  :global(:where(.snowui-button)[data-variant="outline"]) {
    --snowui-button-background: transparent;
    --snowui-button-border-color: var(
      --black-10,
      color-mix(in srgb, currentColor 10%, transparent)
    );
  }

  /* Outline Hover: 边框加深 (参照 StyleGuide 7.5) */
  :global(
      :where(.snowui-button)[data-variant="outline"]:hover:not(.snowui-disabled)
    ) {
    --snowui-button-border-color: var(
      --black-40,
      color-mix(in srgb, currentColor 25%, transparent)
    );
  }

  :global(:where(.snowui-button)[data-variant="borderless"]) {
    --snowui-button-background: transparent;
    --snowui-button-border-color: transparent;
  }

  /* Toggle / 瞬时反馈：Active 状态由 Frame 自动暴露的 data-state="Active" 触发，
     无需消费方手写 stateClass，配色与 Tag variant="active" 一致（Secondary/Indigo）。 */
  :global(:where(.snowui-button)[data-state="Active"]:not([data-variant="filled"])) {
    --snowui-button-background: color-mix(
      in srgb,
      var(--secondary-indigo, #adadfb) 10%,
      transparent
    );
    --snowui-button-color: var(--secondary-indigo, #adadfb);
    --snowui-button-border-color: transparent;
  }

  :global(:where(.snowui-button).snowui-button-bare) {
    --snowui-button-background: transparent;
    --snowui-button-border-color: transparent;
    --snowui-button-opacity: var(--snowui-state-opacity, 0.4);
    background-image: none;
    transition:
      opacity var(--snowui-frame-color-motion-duration, 0.15s) var(--snowui-frame-color-motion-easing, ease-out);
  }

  :global(:where(.snowui-button).snowui-button-bare) {
    --snowui-button-padding: 0;
    --snowui-button-icon-only-padding: 0;
    --snowui-button-radius: 0;
  }

  :global(:where(.snowui-button).snowui-button-bare-icon-only)::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: var(--snowui-button-bare-hit-size, var(--size-4));
    height: var(--snowui-button-bare-hit-size, var(--size-4));
    transform: translate(-50%, -50%);
    background: transparent;
  }

  :global(:where(.snowui-button).snowui-button-role-item[aria-current="page"]) {
    --snowui-button-opacity: var(--snowui-state-opacity, 1);
    --snowui-hover-overlay-opacity: 0%;
    cursor: default;
    pointer-events: none;
    background-image: none;
  }

  :global(
      :where(.snowui-button).snowui-button-bare:hover:not(.snowui-disabled):not(:disabled)
    ) {
    --snowui-button-opacity: var(--snowui-state-opacity, 1);
    background-image: none;
  }

  :global(:where(.snowui-button).snowui-button-embedded-button-group) {
    --snowui-button-background: transparent;
    --snowui-button-border-color: transparent;
    --snowui-button-border-width: 0;
    --snowui-button-color: inherit;
    --snowui-button-group-cell-hover-opacity: 0%;
    --snowui-button-padding: var(
      --snowui-button-group-cell-padding-override,
      var(--snowui-button-group-cell-padding, 0)
    );
    --snowui-button-icon-only-padding: var(
      --snowui-button-group-cell-padding-override,
      var(--snowui-button-group-cell-padding, 0)
    );
    --snowui-button-gap: var(
      --snowui-button-group-cell-gap-override,
      var(--snowui-button-group-cell-gap, var(--gap-1))
    );
    --snowui-button-radius: 0;
    padding: var(
      --snowui-button-group-cell-padding-override,
      var(--snowui-button-group-cell-padding, 0)
    );
    background-image: none;
    isolation: isolate;
    overflow: visible;
    align-self: stretch;
    box-shadow: none;
  }

  :global(:where(.snowui-button).snowui-button-embedded-button-group)::before {
    content: "";
    position: absolute;
    top: calc(var(--snowui-button-group-cell-extend-top, 0px) * -1);
    right: calc(var(--snowui-button-group-cell-extend-right, 0px) * -1);
    bottom: calc(var(--snowui-button-group-cell-extend-bottom, 0px) * -1);
    left: calc(var(--snowui-button-group-cell-extend-left, 0px) * -1);
    background-image: linear-gradient(
      color-mix(
        in srgb,
        var(--snowui-hover-color, currentColor)
          var(--snowui-button-group-cell-hover-opacity),
        transparent
      ),
      color-mix(
        in srgb,
        var(--snowui-hover-color, currentColor)
          var(--snowui-button-group-cell-hover-opacity),
        transparent
      )
    );
    pointer-events: auto;
  }

  :global(
      :where(.snowui-button).snowui-button-embedded-button-group:hover:not(.snowui-disabled):not(:disabled)
    ) {
    --snowui-button-group-cell-hover-opacity: var(
      --snowui-hover-opacity,
      var(--snowui-frame-hover-opacity, 4%)
    );
  }
</style>
