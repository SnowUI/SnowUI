<!--
  Pagination 组件：页码导航容器
  v1.6.0

  职责：
  - 读取直系 Button 作为 current / page / prev / next 角色样式模板。
  - 根据 page / total 生成真实页码、ellipsis 与默认 prev / next。
  - 管理当前页、边界页与整体 disabled 的可点击状态。

  文档: ./Pagination.md
-->

<script lang="ts">
    import { onDestroy, setContext, tick, type Snippet } from "svelte";
    import { ComponentIcon } from "../internal/component-icon/index";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Button from "./Button.svelte";
    import Listbox from "./Listbox.svelte";
    import MenuItem from "./MenuItem.svelte";
    import { type ListboxOptionRegistration, type ListboxOwnerContext } from "../context";
    import { BUTTON_COLLECTION_CONTEXT_KEY, LISTBOX_OWNER_CONTEXT_KEY } from "../keys";
    import { resizeManager } from "../logic/observer.svelte";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";

    type PageToken = number | "ellipsis";
    type PaginationRole = "current" | "page" | "prev" | "next" | "pageSize";
    type PaginationLayoutToken = "pages" | "prev" | "next" | "pageSize";
    export type PaginationWidthMode = "auto" | "hug" | "fill";
    export type PaginationVariant = "outline" | "gray" | "borderless";
    export type PaginationResponsive = "auto" | "none";

    interface Props extends Omit<FrameProps, "children" | "gap"> {
        page?: number;
        total?: number;
        disabled?: boolean;
        disabledPages?: number[];
        ariaLabel?: string;
        /** 普通页按钮样式；当前页自动映射为 outline→gray、gray→filled、borderless→gray。 */
        variant?: PaginationVariant;
        /** 根据容器宽度自动在完整页码、省略页码与最小前后页之间切换。 */
        responsive?: PaginationResponsive;
        widthMode?: PaginationWidthMode;
        gap?: string | number;
        pageSize?: number;
        pageSizeOptions?: number[];
        pageSizeGap?: string | number;
        pageSizeAriaLabel?: string;
        onPageChange?: (page: number) => void;
        onPageSizeChange?: (pageSize: number) => void;
        children?: Snippet;
        parts?: ComponentPartsOf<{
            Button: typeof Button;
            Listbox: typeof Listbox;
            MenuItem: typeof MenuItem;
        }>;
        [key: string]: any;
    }

    let {
        page = 1,
        total = 1,
        disabled = false,
        disabledPages = [],
        ariaLabel = "Pagination",
        variant = "outline",
        responsive = "auto",
        widthMode = "fill",
        gap = undefined,
        pageSize = $bindable(20),
        pageSizeOptions = [],
        pageSizeGap = 16,
        pageSizeAriaLabel = "每页条数",
        onPageChange = undefined,
        onPageSizeChange = undefined,
        children,
        parts = undefined,
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        class: userClass = "",
        style: userStyle = "",
        renderHints: userRenderHints = undefined,
        ...rest
    }: Props = $props();

    setContext(BUTTON_COLLECTION_CONTEXT_KEY, { scaleOnHover: false });

    let templatesEl = $state<HTMLElement | undefined>(undefined);
    let itemsEl = $state<HTMLElement | undefined>(undefined);
    let pageSizeEl = $state<HTMLElement | undefined>(undefined);
    let pageSizeIconTemplateEl = $state<HTMLElement | undefined>(undefined);
    let previousIconTemplateEl = $state<HTMLElement | undefined>(undefined);
    let nextIconTemplateEl = $state<HTMLElement | undefined>(undefined);
    let controlsEl: HTMLElement | undefined;
    let pageSizeTriggerEl = $state<HTMLElement | undefined>(undefined);
    let pageSizeOpen = $state(false);
    let previousPageSizeOpen = false;
    let pageSizeActiveIndex = $state(-1);
    let registeredPageSizeOptions = $state<ListboxOptionRegistration[]>([]);
    let layoutFrame = 0;
    let observedRootWidth: number | undefined;
    const pageSizeUid = Math.random().toString(36).slice(2, 9);
    const pageSizeListboxId = `snowui-pagination-page-size-listbox-${pageSizeUid}`;
    const pageSizeTriggerId = `snowui-pagination-page-size-trigger-${pageSizeUid}`;

    const resolvedTotal = $derived(Math.max(1, Math.floor(Number(total) || 1)));
    const resolvedPage = $derived(
        Math.min(Math.max(1, Math.floor(Number(page) || 1)), resolvedTotal),
    );
    const disabledPageSet = $derived.by(
        () =>
            new Set(
                (Array.isArray(disabledPages) ? disabledPages : [])
                    .map((pageNumber) => Math.floor(Number(pageNumber) || 0))
                    .filter((pageNumber) => pageNumber >= 1),
            ),
    );
    const resolvedPageSize = $derived(Math.max(1, Math.floor(Number(pageSize) || 20)));
    const resolvedPageSizeOptions = $derived.by(() => {
        const options = Array.from(
            new Set(
                (Array.isArray(pageSizeOptions) ? pageSizeOptions : [])
                    .map((option) => Math.floor(Number(option) || 0))
                    .filter((option) => option > 0),
            ),
        );
        return options.includes(resolvedPageSize) ? options : [resolvedPageSize, ...options];
    });
    const showPageSize = $derived(Array.isArray(pageSizeOptions) && pageSizeOptions.length > 0);
    const resolvedGap = $derived(resolveGapValue(gap));
    const resolvedPageSizeGap = $derived(resolveGapValue(pageSizeGap));
    const resolvedCurrentVariant = $derived(variant === "gray" ? "filled" : "gray");

    const pageSizeOwnerContext: ListboxOwnerContext = {
        get open() {
            return pageSizeOpen;
        },
        get selectedValue() {
            return String(resolvedPageSize);
        },
        get activeIndex() {
            return pageSizeActiveIndex;
        },
        get triggerEl() {
            return pageSizeTriggerEl ?? null;
        },
        get anchorEl() {
            return pageSizeEl ?? pageSizeTriggerEl ?? null;
        },
        listboxId: pageSizeListboxId,
        triggerId: pageSizeTriggerId,
        get options() {
            return registeredPageSizeOptions;
        },
        get filterText() {
            return "";
        },
        get customOptions() {
            return [];
        },
        registerOption(option) {
            if (registeredPageSizeOptions.some((item) => item.value === option.value)) return;
            registeredPageSizeOptions = [...registeredPageSizeOptions, option];
        },
        unregisterOption(value) {
            registeredPageSizeOptions = registeredPageSizeOptions.filter(
                (item) => item.value !== value,
            );
        },
        selectOption(value) {
            pageSizeOpen = false;
            pageSizeTriggerEl?.focus();
            const nextPageSize = Number(value);
            if (Number.isFinite(nextPageSize) && nextPageSize !== resolvedPageSize) {
                pageSize = nextPageSize;
                onPageSizeChange?.(nextPageSize);
            }
        },
        setActiveIndex(index) {
            pageSizeActiveIndex = index;
        },
        setOpen(open) {
            if (!open) {
                pageSizeOpen = false;
                return;
            }
            openPageSizeListbox();
        },
        setFilterText() {},
        addCustomOption() {},
        removeCustomOption() {},
    };
    setContext(LISTBOX_OWNER_CONTEXT_KEY, pageSizeOwnerContext);

    const paginationRenderHints = $derived.by(() => ({
        variant: userRenderHints?.variant ?? "line",
        width: userRenderHints?.width ?? "12rem",
        height: userRenderHints?.height ?? "1.5rem",
        radius: userRenderHints?.radius ?? "var(--radius-3)",
    }));

    function resolveGapValue(value: string | number | undefined) {
        if (typeof value === "number") return `${Math.max(0, value)}px`;
        return value;
    }

    function range(start: number, end: number) {
        if (end < start) return [];
        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    }

    function getPageTokens(sibling = 1, boundary = 1): PageToken[] {
        const totalPages = resolvedTotal;
        const currentPage = resolvedPage;
        const fullCount = boundary * 2 + sibling * 2 + 3;

        if (totalPages <= fullCount) {
            return range(1, totalPages);
        }

        const startWindowEnd = Math.min(totalPages, boundary + sibling * 2 + 1);
        const endWindowStart = Math.max(1, totalPages - boundary - sibling * 2);

        if (currentPage <= boundary + sibling + 1) {
            return [...range(1, startWindowEnd), "ellipsis", totalPages];
        }

        if (currentPage >= totalPages - boundary - sibling) {
            return [1, "ellipsis", ...range(endWindowStart, totalPages)];
        }

        return [
            ...range(1, boundary),
            "ellipsis",
            ...range(currentPage - sibling, currentPage + sibling),
            "ellipsis",
            ...range(totalPages - boundary + 1, totalPages),
        ];
    }

    function getCollapsedPageTokenCandidates(): PageToken[][] {
        const candidates: PageToken[][] = [];
        const seen = new Set<string>();
        const add = (tokens: PageToken[]) => {
            const key = tokens.join(",");
            if (seen.has(key)) return;
            seen.add(key);
            candidates.push(tokens);
        };

        add(getPageTokens(1, 1));
        add(getPageTokens(0, 1));

        const contextual: PageToken[] = [];
        if (resolvedPage > 1) contextual.push("ellipsis");
        contextual.push(resolvedPage);
        if (resolvedPage < resolvedTotal) contextual.push("ellipsis");
        add(contextual);
        return candidates;
    }

    function getTemplate(role: PaginationRole) {
        if (!templatesEl) return undefined;
        return Array.from(templatesEl.children).find(
            (child): child is HTMLElement =>
                child instanceof HTMLElement && child.dataset.as === role,
        );
    }

    function cloneTemplate(role: PaginationRole, label?: string) {
        const template = getTemplate(role);
        if (!template) return undefined;

        const node = template.cloneNode(true) as HTMLElement;
        node.removeAttribute("id");
        node.removeAttribute("aria-hidden");
        node.classList.add("snowui-pagination-template-clone");
        if (label !== undefined) node.textContent = label;
        return node;
    }

    function hasTemplateContent(node: HTMLElement) {
        return node.textContent?.trim() || node.children.length > 0;
    }

    function appendDefaultControlIcon(node: HTMLElement, role: "prev" | "next") {
        if (hasTemplateContent(node)) return;
        const iconTemplate =
            role === "prev"
                ? previousIconTemplateEl?.firstElementChild
                : nextIconTemplateEl?.firstElementChild;
        if (iconTemplate) node.append(iconTemplate.cloneNode(true));
        else node.textContent = "▧";
    }

    function createDefaultButton(role: PaginationRole, label: string) {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.as = role;
        button.className = [
            "snowui-pagination-default",
            "snowui-rounded-rectangle",
            `snowui-pagination-default-${role}`,
        ].join(" ");

        if (role === "prev" || role === "next") {
            button.setAttribute("aria-label", role === "prev" ? "上一页" : "下一页");
            const iconTemplate =
                role === "prev"
                    ? previousIconTemplateEl?.firstElementChild
                    : nextIconTemplateEl?.firstElementChild;
            if (iconTemplate) button.append(iconTemplate.cloneNode(true));
            else button.textContent = "▧";
        } else {
            button.textContent = label;
        }

        return button;
    }

    function createEllipsis() {
        const ellipsis = document.createElement("span");
        ellipsis.className = "snowui-pagination-ellipsis snowui-rounded-rectangle";
        ellipsis.dataset.as = "ellipsis";
        ellipsis.setAttribute("aria-hidden", "true");
        ellipsis.textContent = "...";
        return ellipsis;
    }

    function createPageButton(token: number) {
        const isCurrent = token === resolvedPage;
        const role: PaginationRole = isCurrent ? "current" : "page";
        const button =
            cloneTemplate(role, String(token)) ?? createDefaultButton(role, String(token));
        button.dataset.page = String(token);
        button.dataset.as = role;
        button.classList.add("snowui-pagination-item", "snowui-rounded-rectangle");
        if (isCurrent) {
            button.classList.add("snowui-pagination-current");
            button.setAttribute("aria-current", "page");
            button.setAttribute("data-current", "page");
            button.setAttribute("aria-disabled", "true");
            button.setAttribute("tabindex", "-1");
            if (disabled) markUnavailable(button);
        } else {
            button.classList.add("snowui-pagination-page");
            button.setAttribute("aria-label", `第 ${token} 页`);
            if (disabled || disabledPageSet.has(token)) markUnavailable(button);
            else bindClick(button, token);
        }
        return button;
    }

    function createControl(role: "prev" | "next") {
        const target = role === "prev" ? resolvedPage - 1 : resolvedPage + 1;
        const isUnavailable =
            disabled ||
            (role === "prev" && resolvedPage <= 1) ||
            (role === "next" && resolvedPage >= resolvedTotal) ||
            disabledPageSet.has(target);
        const control =
            cloneTemplate(role) ?? createDefaultButton(role, role === "prev" ? "上一页" : "下一页");

        control.dataset.as = role;
        control.classList.add("snowui-pagination-item", "snowui-rounded-rectangle");
        control.classList.add(`snowui-pagination-${role}`);
        control.setAttribute("aria-label", role === "prev" ? "上一页" : "下一页");
        appendDefaultControlIcon(control, role);

        if (isUnavailable) {
            markUnavailable(control);
        } else {
            bindClick(control, target);
        }
        return control;
    }

    function compactControl(control: HTMLElement) {
        const graphicSelector = "svg, img, .snowui-icon, .snowui-icon-wrapper";
        const hasGraphic = !!control.querySelector(graphicSelector);
        const directTextNodes = Array.from(control.childNodes).filter(
            (node): node is Text => node.nodeType === Node.TEXT_NODE && !!node.textContent?.trim(),
        );
        const fallbackTextElements = Array.from(control.children).filter(
            (element): element is HTMLElement =>
                element instanceof HTMLElement &&
                !element.matches(".snowui-text") &&
                !element.matches(graphicSelector) &&
                !element.querySelector(graphicSelector) &&
                !!element.textContent?.trim(),
        );
        const hasText =
            !!control.querySelector(".snowui-text")?.textContent?.trim() ||
            directTextNodes.length > 0 ||
            fallbackTextElements.length > 0;
        if (!hasGraphic || !hasText) return;
        for (const textNode of directTextNodes) {
            const text = document.createElement("span");
            text.className = "snowui-pagination-responsive-text";
            text.textContent = textNode.textContent;
            textNode.replaceWith(text);
        }
        for (const element of fallbackTextElements) {
            element.classList.add("snowui-pagination-responsive-text");
        }
        control.setAttribute("data-composition-content", "hidden");
        control.setAttribute("data-responsive-compact", "true");
        control.setAttribute("data-icon-only", "true");
        control.classList.add("snowui-button-icon-only");
    }

    function createPageSizeSelector() {
        const template = cloneTemplate("pageSize", String(resolvedPageSize));
        if (!template || !showPageSize) return undefined;

        const wrapper = document.createElement("label");
        wrapper.className = "snowui-pagination-page-size";
        wrapper.dataset.as = "pageSize";

        template.classList.add("snowui-pagination-page-size-template");
        template.id = pageSizeTriggerId;
        template.setAttribute("role", "combobox");
        template.setAttribute("aria-label", pageSizeAriaLabel);
        template.setAttribute("aria-haspopup", "listbox");
        template.setAttribute("aria-expanded", String(pageSizeOpen));
        template.setAttribute("aria-controls", pageSizeListboxId);
        if (pageSizeOpen && pageSizeActiveIndex >= 0) {
            template.setAttribute(
                "aria-activedescendant",
                `${pageSizeListboxId}-opt-${pageSizeActiveIndex}`,
            );
        }
        if (disabled) markUnavailable(template);
        else {
            template.addEventListener("click", handlePageSizeTriggerClick);
            template.addEventListener("keydown", handlePageSizeTriggerKeydown);
        }

        const iconTemplate = pageSizeIconTemplateEl?.firstElementChild;
        if (iconTemplate) {
            const icon = iconTemplate.cloneNode(true) as HTMLElement;
            icon.classList.add("snowui-pagination-page-size-icon");
            template.append(icon);
        }

        wrapper.append(template);
        pageSizeEl = wrapper;
        pageSizeTriggerEl = template;
        return wrapper;
    }

    function openPageSizeListbox() {
        const selectedIndex = registeredPageSizeOptions.findIndex(
            (option) => option.value === String(resolvedPageSize),
        );
        pageSizeActiveIndex = selectedIndex >= 0 ? selectedIndex : 0;
        pageSizeOpen = true;
    }

    function handlePageSizeTriggerClick() {
        if (disabled) return;
        if (pageSizeOpen) pageSizeOpen = false;
        else openPageSizeListbox();
    }

    function handlePageSizeTriggerKeydown(event: KeyboardEvent) {
        if (disabled) return;
        const optionCount = registeredPageSizeOptions.length;
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                if (!pageSizeOpen) openPageSizeListbox();
                else pageSizeActiveIndex = Math.min(pageSizeActiveIndex + 1, optionCount - 1);
                break;
            case "ArrowUp":
                event.preventDefault();
                if (!pageSizeOpen) openPageSizeListbox();
                else pageSizeActiveIndex = Math.max(pageSizeActiveIndex - 1, 0);
                break;
            case "Enter":
            case " ":
                event.preventDefault();
                if (!pageSizeOpen) openPageSizeListbox();
                else if (pageSizeActiveIndex >= 0) {
                    const option = registeredPageSizeOptions[pageSizeActiveIndex];
                    if (option && !option.disabled) {
                        pageSizeOwnerContext.selectOption(option.value);
                    }
                }
                break;
            case "Escape":
                if (pageSizeOpen) {
                    event.preventDefault();
                    pageSizeOpen = false;
                }
                break;
            case "Tab":
                pageSizeOpen = false;
                break;
        }
    }

    function getLayoutTokens(): PaginationLayoutToken[] {
        if (!templatesEl) return ["pages", "prev", "next"];

        const tokens: PaginationLayoutToken[] = [];
        let hasPages = false;
        for (const child of Array.from(templatesEl.children)) {
            if (!(child instanceof HTMLElement)) continue;
            if (children && child.dataset.paginationVariantFallback === "true") continue;
            const role = child.dataset.as as PaginationRole | undefined;
            if (role === "current" || role === "page") {
                if (!hasPages) {
                    tokens.push("pages");
                    hasPages = true;
                }
                continue;
            }
            if (
                (role === "prev" || role === "next" || role === "pageSize") &&
                !tokens.includes(role)
            ) {
                tokens.push(role);
            }
        }

        if (!hasPages) tokens.unshift("pages");
        const pagesIndex = tokens.indexOf("pages");
        const hasPrev = tokens.includes("prev");
        const hasNext = tokens.includes("next");
        if (!hasPrev && !hasNext) {
            tokens.splice(pagesIndex + 1, 0, "prev", "next");
        } else if (!hasPrev) {
            const nextIndex = tokens.indexOf("next");
            tokens.splice(nextIndex >= 0 ? nextIndex : pagesIndex + 1, 0, "prev");
        } else if (!hasNext) {
            const prevIndex = tokens.indexOf("prev");
            tokens.splice(prevIndex + 1, 0, "next");
        }
        return tokens;
    }

    function markUnavailable(element: HTMLElement) {
        element.setAttribute("aria-disabled", "true");
        element.setAttribute("data-disabled", "true");
        element.setAttribute("tabindex", "-1");
        element.classList.add("snowui-pagination-unavailable");
        if (element instanceof HTMLButtonElement) element.disabled = true;
    }

    function bindClick(element: HTMLElement, targetPage: number) {
        element.addEventListener("click", (event) => {
            if (disabled || targetPage < 1 || targetPage > resolvedTotal) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            if (disabledPageSet.has(targetPage)) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            onPageChange?.(targetPage);
        });
        element.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            if (
                disabled ||
                targetPage < 1 ||
                targetPage > resolvedTotal ||
                disabledPageSet.has(targetPage)
            ) {
                event.preventDefault();
                event.stopPropagation();
            }
        });
    }

    function renderPaginationItems(
        pageTokens = getPageTokens(),
        compactControls = false,
        scheduleLayout = true,
        includePageSize = showPageSize,
    ) {
        if (!itemsEl) return;
        itemsEl.replaceChildren();
        const root = itemsEl.closest(".snowui-pagination");
        const inlineGap =
            root instanceof HTMLElement
                ? root.style.columnGap || root.style.gap || undefined
                : undefined;
        const controlsGap = (!includePageSize ? inlineGap : undefined) ?? resolvedGap;
        const effectivePageSizeGap =
            (includePageSize ? inlineGap : undefined) ?? resolvedPageSizeGap ?? resolvedGap;

        if (controlsGap) {
            itemsEl.style.setProperty("--snowui-pagination-controls-gap", controlsGap);
        } else {
            itemsEl.style.removeProperty("--snowui-pagination-controls-gap");
        }
        if (effectivePageSizeGap) {
            itemsEl.style.setProperty("--snowui-pagination-page-size-gap", effectivePageSizeGap);
        } else {
            itemsEl.style.removeProperty("--snowui-pagination-page-size-gap");
        }
        pageSizeEl = undefined;
        pageSizeTriggerEl = undefined;

        const fragment = document.createDocumentFragment();
        const layoutTokens = getLayoutTokens();
        const controls = document.createElement("div");
        controls.className = "snowui-pagination-controls";
        controlsEl = controls;
        const pageSizeBeforeControls =
            layoutTokens.indexOf("pageSize") < layoutTokens.indexOf("pages");

        for (const layoutToken of layoutTokens) {
            if (layoutToken === "pages") {
                for (const token of pageTokens) {
                    controls.append(
                        token === "ellipsis" ? createEllipsis() : createPageButton(token),
                    );
                }
                continue;
            }
            if (layoutToken === "pageSize") {
                continue;
            }
            const control = createControl(layoutToken);
            if (compactControls) compactControl(control);
            controls.append(control);
        }

        const selector = includePageSize ? createPageSizeSelector() : undefined;
        if (selector && pageSizeBeforeControls) fragment.append(selector);
        fragment.append(controls);
        if (selector && !pageSizeBeforeControls) fragment.append(selector);
        itemsEl.append(fragment);
        if (scheduleLayout) requestLayout();
    }

    function requestLayout() {
        if (layoutFrame) return;
        layoutFrame = requestAnimationFrame(() => {
            layoutFrame = 0;
            updateResponsiveLayout();
        });
    }

    function gridTrackTokens(template: string) {
        let depth = 0;
        const tokens: string[] = [];
        let token = "";
        let inTrack = false;
        for (const character of template.trim()) {
            if (character === "(") depth += 1;
            if (character === ")") depth = Math.max(0, depth - 1);
            if (/\s/.test(character) && depth === 0) {
                if (inTrack) tokens.push(token);
                token = "";
                inTrack = false;
            } else {
                token += character;
                inTrack = true;
            }
        }
        if (inTrack) tokens.push(token);
        return tokens;
    }

    function getResponsiveMeasureElement(root: HTMLElement) {
        if (widthMode === "fill") return root;
        const parent = root.parentElement;
        if (!parent) return root;
        const parentStyle = getComputedStyle(parent);
        if (parentStyle.display.includes("grid")) {
            return parent;
        }
        if (parentStyle.display.includes("flex")) {
            return parent;
        }
        return parent;
    }

    function getGridAreaWidth(root: HTMLElement, parent: HTMLElement, style: CSSStyleDeclaration) {
        const tracks = gridTrackTokens(style.gridTemplateColumns);
        if (tracks.length <= 1) return getElementContentWidth(parent);
        const widths = tracks.map((track) => Number.parseFloat(track));
        if (widths.some((width) => !Number.isFinite(width))) return root.getBoundingClientRect().width;

        const explicitColumn = Number.parseInt(getComputedStyle(root).gridColumnStart, 10);
        const childIndex = Array.from(parent.children).indexOf(root);
        const columnIndex = Number.isFinite(explicitColumn)
            ? Math.min(tracks.length - 1, Math.max(0, explicitColumn - 1))
            : Math.max(0, childIndex) % tracks.length;
        return widths[columnIndex] ?? root.getBoundingClientRect().width;
    }

    function getFlexAreaWidth(root: HTMLElement, parent: HTMLElement, style: CSSStyleDeclaration) {
        if (style.flexDirection.startsWith("column")) return getElementContentWidth(parent);
        const siblings = Array.from(parent.children).filter(
            (child): child is HTMLElement =>
                child instanceof HTMLElement && child !== root && getComputedStyle(child).display !== "none",
        );
        const siblingsWidth = siblings.reduce(
            (width, sibling) => width + sibling.getBoundingClientRect().width,
            0,
        );
        const visibleItemCount = siblings.length + 1;
        const gap = Number.parseFloat(style.columnGap) || 0;
        return Math.max(
            0,
            getElementContentWidth(parent) - siblingsWidth - Math.max(0, visibleItemCount - 1) * gap,
        );
    }

    function getElementContentWidth(element: HTMLElement) {
        const style = getComputedStyle(element);
        return Math.max(
            0,
            element.clientWidth -
                (Number.parseFloat(style.paddingLeft) || 0) -
                (Number.parseFloat(style.paddingRight) || 0),
        );
    }

    function availableControlsWidth(controlsWidth: number) {
        if (!itemsEl) return 0;
        const root = itemsEl.closest(".snowui-pagination");
        if (!(root instanceof HTMLElement)) return 0;
        const measureElement = getResponsiveMeasureElement(root);
        const measureStyle = getComputedStyle(measureElement);
        const rootWidth =
            measureElement === root
                ? root.getBoundingClientRect().width
                : measureElement === root.parentElement && measureStyle.display.includes("grid")
                  ? getGridAreaWidth(root, measureElement, measureStyle)
                  : measureElement === root.parentElement && measureStyle.display.includes("flex")
                    ? getFlexAreaWidth(root, measureElement, measureStyle)
                  : getElementContentWidth(measureElement);
        const pageSizeWidth = pageSizeEl?.getBoundingClientRect().width ?? 0;
        const gap =
            pageSizeWidth > 0 ? Number.parseFloat(getComputedStyle(itemsEl).columnGap) || 0 : 0;
        if (responsive === "auto" && pageSizeWidth > 0) {
            return Math.max(0, rootWidth - pageSizeWidth - gap);
        }
        return pageSizeWidth > 0 && pageSizeWidth + gap + controlsWidth <= rootWidth + 0.5
            ? Math.max(0, rootWidth - pageSizeWidth - gap)
            : rootWidth;
    }

    function controlsFit() {
        if (!controlsEl) return true;
        const controlsWidth = controlsEl.scrollWidth;
        return controlsWidth <= availableControlsWidth(controlsWidth) + 0.5;
    }

    function getAllPageTokensIfPotentiallyFits() {
        if (!controlsEl) return undefined;
        if (resolvedTotal === 1) return [1];

        const children = Array.from(controlsEl.children).filter(
            (child): child is HTMLElement => child instanceof HTMLElement,
        );
        const pageItems = children.filter((child) => child.dataset.page !== undefined);
        const minimumPageWidth = Math.min(
            ...pageItems.map((child) => child.getBoundingClientRect().width),
        );
        if (!Number.isFinite(minimumPageWidth) || minimumPageWidth <= 0) return undefined;

        const controls = children.filter(
            (child) => child.dataset.page === undefined && child.dataset.as !== "ellipsis",
        );
        const controlWidth = controls.reduce(
            (sum, child) => sum + child.getBoundingClientRect().width,
            0,
        );
        const gap = Number.parseFloat(getComputedStyle(controlsEl).columnGap) || 0;
        const estimatedWidth =
            resolvedTotal * minimumPageWidth +
            controlWidth +
            Math.max(0, resolvedTotal + controls.length - 1) * gap;
        if (estimatedWidth > availableControlsWidth(estimatedWidth) + 0.5) return undefined;
        return range(1, resolvedTotal);
    }

    function layoutName(tokens: PageToken[]) {
        if (tokens.length === 0) return "controls";
        if (tokens.some((token) => token === "ellipsis")) return "ellipsis";
        if (tokens.length === resolvedTotal) return "all";
        return "current";
    }

    function updateResponsiveLayout() {
        if (!itemsEl) return;
        const root = itemsEl.closest(".snowui-pagination");
        if (!(root instanceof HTMLElement)) return;
        if (pageSizeOpen) {
            syncWidthMode();
            return;
        }

        root.classList.remove("snowui-pagination-fill");
        itemsEl.classList.remove("snowui-pagination-items-fill");

        const candidates = getCollapsedPageTokenCandidates();
        let selectedTokens = candidates[0] ?? [resolvedPage];
        let compactControls = false;
        let includePageSize = showPageSize;

        renderPaginationItems(selectedTokens, false, false, includePageSize);
        const allPageTokens = getAllPageTokensIfPotentiallyFits();
        if (allPageTokens) {
            selectedTokens = allPageTokens;
            renderPaginationItems(selectedTokens, false, false, includePageSize);
        }

        if (responsive === "auto" && !controlsFit()) {
            renderPaginationItems(selectedTokens, true, false, includePageSize);
            compactControls = true;
            if (!controlsFit()) {
                for (const candidate of candidates) {
                    selectedTokens = candidate;
                    renderPaginationItems(selectedTokens, true, false, includePageSize);
                    if (controlsFit()) break;
                }
            }
            if (!controlsFit() && includePageSize) {
                includePageSize = false;
                for (const candidate of candidates) {
                    selectedTokens = candidate;
                    renderPaginationItems(selectedTokens, true, false, false);
                    if (controlsFit()) break;
                }
            }
            if (!controlsFit()) {
                selectedTokens = [resolvedPage];
                renderPaginationItems(selectedTokens, true, false, includePageSize);
            }
            if (!controlsFit()) {
                selectedTokens = [];
                renderPaginationItems(selectedTokens, true, false, includePageSize);
            }
        }

        root.dataset.responsiveControls = compactControls ? "compact" : "full";
        root.dataset.responsiveLayout = layoutName(selectedTokens);
        root.dataset.responsivePages = String(
            selectedTokens.filter((token) => typeof token === "number").length,
        );
        root.dataset.responsivePageSize = includePageSize ? "visible" : "hidden";
        syncWidthMode();
    }

    function syncWidthMode() {
        if (!itemsEl) return;
        const root = itemsEl.closest(".snowui-pagination");
        if (!(root instanceof HTMLElement)) return;

        root.classList.remove("snowui-pagination-fill");
        itemsEl.classList.remove("snowui-pagination-items-fill");
        const controlsWidth = controlsEl?.scrollWidth ?? itemsEl.scrollWidth;
        const availableWidth = availableControlsWidth(controlsWidth);
        const showsAllPages =
            controlsEl?.querySelectorAll(".snowui-pagination-current, .snowui-pagination-page")
                .length === resolvedTotal && !controlsEl?.querySelector('[data-as="ellipsis"]');
        const shouldFill =
            widthMode === "fill"
                ? showsAllPages
                : widthMode === "hug"
                  ? false
                  : showsAllPages && availableWidth - controlsWidth > 1;
        root.classList.toggle("snowui-pagination-fill", shouldFill);
        itemsEl.classList.toggle("snowui-pagination-items-fill", shouldFill);
    }

    $effect(() => {
        resolvedPage;
        resolvedTotal;
        disabled;
        disabledPageSet;
        onPageChange;
        resolvedPageSize;
        resolvedPageSizeOptions;
        pageSizeAriaLabel;
        onPageSizeChange;
        showPageSize;
        resolvedGap;
        resolvedPageSizeGap;
        responsive;
        userStyle;
        if (!itemsEl || !templatesEl) return;
        tick().then(() => renderPaginationItems());
    });

    $effect(() => {
        pageSizeOpen;
        pageSizeActiveIndex;
        const shouldRefreshLayout = previousPageSizeOpen && !pageSizeOpen;
        previousPageSizeOpen = pageSizeOpen;
        if (!pageSizeTriggerEl) return;
        pageSizeTriggerEl.setAttribute("aria-expanded", String(pageSizeOpen));
        const activeOption = registeredPageSizeOptions[pageSizeActiveIndex];
        if (pageSizeOpen && activeOption) {
            pageSizeTriggerEl.setAttribute(
                "aria-activedescendant",
                `${pageSizeListboxId}-opt-${pageSizeActiveIndex}`,
            );
        } else {
            pageSizeTriggerEl.removeAttribute("aria-activedescendant");
        }
        if (shouldRefreshLayout) requestLayout();
    });

    $effect(() => {
        widthMode;
        showPageSize;
        resolvedPageSize;
        resolvedPageSizeOptions;
        responsive;
        if (!itemsEl) return;
        tick().then(requestLayout);
    });

    $effect(() => {
        if (responsive !== "auto" && widthMode !== "auto") return;
        if (!itemsEl) return;
        const root = itemsEl.closest(".snowui-pagination");
        if (!(root instanceof HTMLElement)) return;
        const measureElement = getResponsiveMeasureElement(root);
        observedRootWidth = getElementContentWidth(measureElement);
        const unwatch = resizeManager.watch(measureElement, (entry) => {
            const width = entry.contentRect.width;
            if (observedRootWidth !== undefined && Math.abs(width - observedRootWidth) < 0.5)
                return;
            observedRootWidth = width;
            requestLayout();
        });
        return () => unwatch();
    });

    onDestroy(() => {
        if (layoutFrame) cancelAnimationFrame(layoutFrame);
    });
</script>

<Frame
    tag="nav"
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    enableAutoLayout={false}
    aria-label={ariaLabel}
    data-disabled={disabled ? "true" : undefined}
    data-responsive={responsive}
    data-width-mode={widthMode}
    class={[
        "snowui-pagination",
        `snowui-pagination-width-${widthMode}`,
        showPageSize ? "snowui-pagination-has-page-size" : "",
        userClass,
    ]
        .filter(Boolean)
        .join(" ")}
    style={userStyle || undefined}
    renderHints={paginationRenderHints}
    componentParts={parts}
    {...rest}
>
    <div class="snowui-pagination-templates" bind:this={templatesEl} aria-hidden="true">
        {#if children}
            {@render children()}
        {:else}
            <Button as="pageSize" variant="borderless" />
        {/if}
        <Button
            as="current"
            variant={resolvedCurrentVariant}
            data-pagination-variant-fallback="true"
        />
        <Button as="page" {variant} data-pagination-variant-fallback="true" />
        <Button
            as="prev"
            {variant}
            iconOnly
            aria-label="上一页"
            data-pagination-variant-fallback="true"
        >
            <ComponentIcon name="arrow-line-left" size="var(--size-4)" aria-hidden="true" />
        </Button>
        <Button
            as="next"
            {variant}
            iconOnly
            aria-label="下一页"
            data-pagination-variant-fallback="true"
        >
            <ComponentIcon name="arrow-line-right" size="var(--size-4)" aria-hidden="true" />
        </Button>
        <span bind:this={previousIconTemplateEl}>
            <ComponentIcon
                name="arrow-line-left"
                class="snowui-pagination-default-icon"
                size="var(--size-4)"
                aria-hidden="true"
            />
        </span>
        <span bind:this={nextIconTemplateEl}>
            <ComponentIcon
                name="arrow-line-right"
                class="snowui-pagination-default-icon"
                size="var(--size-4)"
                aria-hidden="true"
            />
        </span>
        <span class="snowui-pagination-page-size-icon-template" bind:this={pageSizeIconTemplateEl}>
            <ComponentIcon name="arrow-line-down" size="var(--size-4)" aria-hidden="true" />
        </span>
    </div>
    <div class="snowui-pagination-items" bind:this={itemsEl}></div>
    {#if showPageSize}
        <Listbox matchTriggerWidth={false}>
            {#each resolvedPageSizeOptions as option (option)}
                <MenuItem as="item" value={String(option)} showCheck={false} />
            {/each}
        </Listbox>
    {/if}
</Frame>

<style>
    :global(:where(.snowui-pagination)) {
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
        min-width: 0;
        max-width: 100%;
        box-sizing: border-box;
        row-gap: var(
            --snowui-pagination-row-gap-override,
            var(--snowui-pagination-row-gap, var(--gap-1))
        );
        column-gap: var(
            --snowui-pagination-column-gap-override,
            var(--snowui-pagination-column-gap, var(--gap-1))
        );
    }

    :global(:where(.snowui-pagination-width-hug)) {
        width: fit-content;
    }

    :global(:where(.snowui-pagination-width-fill)) {
        width: 100%;
    }

    :global(:where(.snowui-pagination-templates)) {
        display: none;
    }

    :global(:where(.snowui-pagination-items)) {
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(
            --snowui-pagination-page-size-gap,
            var(
                --snowui-pagination-column-gap-override,
                var(--snowui-pagination-column-gap, var(--gap-1))
            )
        );
        max-width: 100%;
    }

    :global(:where(.snowui-pagination[data-responsive="auto"] .snowui-pagination-items)) {
        flex-wrap: nowrap;
        width: 100%;
    }

    :global(:where(.snowui-pagination-controls)) {
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(
            --snowui-pagination-controls-gap,
            var(
                --snowui-pagination-column-gap-override,
                var(--snowui-pagination-column-gap, var(--gap-1))
            )
        );
        min-width: 0;
    }

    :global(:where(.snowui-pagination[data-responsive="auto"] .snowui-pagination-controls)) {
        flex-wrap: nowrap;
        max-width: 100%;
        white-space: nowrap;
    }

    :global(:where(.snowui-pagination-responsive-text)) {
        display: none;
    }

    :global(:where(.snowui-pagination-items-fill)) {
        display: flex;
        flex: 1 1 100%;
        width: 100%;
    }

    :global(:where(.snowui-pagination-items-fill > .snowui-pagination-controls)) {
        flex: 1 1 0;
        min-width: 0;
    }

    :global(:where(.snowui-pagination-page-size)) {
        position: relative;
        display: inline-flex;
        flex: 0 0 auto;
        align-items: center;
        cursor: var(--snowui-state-cursor, pointer);
    }

    :global(:where(.snowui-pagination-page-size-template)) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        flex: 0 0 auto;
    }

    :global(:where(.snowui-pagination-page-size-icon)) {
        width: var(
            --snowui-pagination-icon-size-override,
            var(--snowui-pagination-icon-size, var(--size-4))
        );
        height: var(
            --snowui-pagination-icon-size-override,
            var(--snowui-pagination-icon-size, var(--size-4))
        );
        min-width: var(
            --snowui-pagination-icon-size-override,
            var(--snowui-pagination-icon-size, var(--size-4))
        );
        min-height: var(
            --snowui-pagination-icon-size-override,
            var(--snowui-pagination-icon-size, var(--size-4))
        );
        flex: 0 0
            var(
                --snowui-pagination-icon-size-override,
                var(--snowui-pagination-icon-size, var(--size-4))
            );
        pointer-events: none;
        opacity: var(
            --snowui-pagination-idle-opacity-override,
            var(--snowui-pagination-idle-opacity, 0.4)
        );
        transition: opacity var(--snowui-frame-color-motion-duration, 0.15s)
            var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-pagination-page-size-icon > .snowui-icon)) {
        --snowui-icon-width-override: 100%;
        --snowui-icon-height-override: 100%;
        --snowui-icon-min-width-override: 0;
        --snowui-icon-min-height-override: 0;
    }

    :global(:where(.snowui-pagination-page-size-icon > .snowui-icon .snowui-icon-content)) {
        width: 100%;
        height: 100%;
    }

    :global(
        :where(
            .snowui-pagination-page-size-template:hover:not(:disabled):not([aria-disabled="true"])
                .snowui-pagination-page-size-icon
        )
    ) {
        opacity: var(
            --snowui-pagination-hover-opacity-override,
            var(--snowui-pagination-hover-opacity, 1)
        );
    }

    :global(
        :where(
            .snowui-pagination-items-fill > .snowui-pagination-controls > .snowui-pagination-item
        )
    ) {
        flex: 1 1 0;
    }

    :global(
        :where(
            .snowui-pagination-items-fill
                > .snowui-pagination-controls
                > .snowui-pagination-ellipsis
        )
    ) {
        flex: 0 0 auto;
    }

    :global(:where(.snowui-pagination-item, .snowui-pagination-ellipsis)) {
        box-sizing: border-box;
    }

    :global(:where(.snowui-pagination-default, .snowui-pagination-ellipsis)) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 0;
        margin: 0;
        color: var(
            --snowui-pagination-color-override,
            var(--snowui-pagination-color, var(--black-100, #000000ff))
        );
        font: inherit;
        font-size: var(
            --snowui-pagination-font-size-override,
            var(--snowui-pagination-font-size, var(--text-12))
        );
        line-height: var(
            --snowui-pagination-line-height-override,
            var(--snowui-pagination-line-height, var(--leading-12))
        );
        border-radius: var(
            --snowui-pagination-radius-override,
            var(--snowui-pagination-radius, var(--radius-3))
        );
        padding: var(
                --snowui-pagination-padding-y-override,
                var(--snowui-pagination-padding-y, var(--padding-1))
            )
            var(
                --snowui-pagination-padding-x-override,
                var(--snowui-pagination-padding-x, var(--padding-2))
            );
        background: transparent;
        background-image: none;
        text-decoration: none;
        user-select: none;
        transition: opacity var(--snowui-frame-color-motion-duration, 0.15s)
            var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-pagination-default)) {
        cursor: var(--snowui-state-cursor, pointer);
    }

    :global(
        :where(
            .snowui-pagination-default-page,
            .snowui-pagination-default-prev,
            .snowui-pagination-default-next
        )
    ) {
        opacity: var(
            --snowui-pagination-idle-opacity-override,
            var(--snowui-pagination-idle-opacity, 0.4)
        );
    }

    :global(
        :where(
            .snowui-pagination-default-page:hover:not(:disabled):not([aria-disabled="true"]),
            .snowui-pagination-default-prev:hover:not(:disabled):not([aria-disabled="true"]),
            .snowui-pagination-default-next:hover:not(:disabled):not([aria-disabled="true"])
        )
    ) {
        opacity: var(
            --snowui-pagination-hover-opacity-override,
            var(--snowui-pagination-hover-opacity, 1)
        );
        background-image: none;
    }

    :global(:where(.snowui-pagination-default-current)) {
        opacity: 1;
        cursor: default;
    }

    :global(:where(.snowui-pagination-unavailable)) {
        cursor: default;
        pointer-events: none;
        opacity: var(--snowui-state-opacity, 0.2);
    }

    :global(:where(.snowui-pagination-current)) {
        cursor: default;
        pointer-events: none;
    }

    :global(:where(.snowui-pagination-ellipsis)) {
        color: var(
            --snowui-pagination-ellipsis-color-override,
            var(--snowui-pagination-ellipsis-color, var(--black-40, rgba(0, 0, 0, 0.4)))
        );
        pointer-events: none;
    }

    :global(:where(.snowui-pagination-default-icon)) {
        width: var(
            --snowui-pagination-icon-size-override,
            var(--snowui-pagination-icon-size, var(--size-4))
        );
        height: var(
            --snowui-pagination-icon-size-override,
            var(--snowui-pagination-icon-size, var(--size-4))
        );
        min-width: var(
            --snowui-pagination-icon-size-override,
            var(--snowui-pagination-icon-size, var(--size-4))
        );
        min-height: var(
            --snowui-pagination-icon-size-override,
            var(--snowui-pagination-icon-size, var(--size-4))
        );
        flex: 0 0
            var(
                --snowui-pagination-icon-size-override,
                var(--snowui-pagination-icon-size, var(--size-4))
            );
        display: block;
    }
</style>
