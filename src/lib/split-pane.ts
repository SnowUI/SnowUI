/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * 分割面板 Action (Split Pane Action)
 *
 * 该文件实现了一个 Svelte Action，用于创建可拖拽的分割面板布局。
 * 支持：
 * 1. 水平和垂直方向分割。
 * 2. 最小尺寸限制。
 * 3. 键盘交互（箭头键调整）。
 * 4. 自动创建或绑定现有的分割手柄 (Handle)。
 */

import { clampResizableSize } from "../index";

type Direction = "horizontal" | "vertical";

type SplitPaneOptions = {
	direction?: Direction;
	minPrimaryPx?: number;
	minSecondaryPx?: number;
	initialPrimaryPx?: number;
	onChange?: (primaryPx: number) => void;
};

type SplitPaneController = {
	setPrimaryPx: (px: number) => void;
	getPrimaryPx: () => number;
};

type SplitPaneAction = {
	destroy: () => void;
	update?: (next: SplitPaneOptions) => void;
};

function getRectSize(rect: DOMRect, direction: Direction) {
	return direction === "horizontal" ? rect.width : rect.height;
}

function getEventOffset(e: PointerEvent, rect: DOMRect, direction: Direction) {
	return direction === "horizontal" ? e.clientX - rect.left : e.clientY - rect.top;
}

/**
 * splitPane Svelte Action
 * @param node 容器节点
 * @param options 配置项
 */
export function splitPane(
	node: HTMLElement,
	options: SplitPaneOptions = {},
): SplitPaneAction {
	let handleEl: HTMLElement | null = null;
	let primaryEl: HTMLElement | null = null;
	let secondaryEl: HTMLElement | null = null;
	let mountedHandleEl: HTMLElement | null = null;
	let createdHandleEl: HTMLElement | null = null;
	let isDragging = false;
	let pendingDrag = false;
	let dragStartClient = 0;
	let lastPrimaryPx = 0;

	let direction: Direction = options.direction ?? "horizontal";
	let minPrimaryPx = options.minPrimaryPx ?? 100;
	let minSecondaryPx = options.minSecondaryPx ?? 100;
	let initialPrimaryPx = options.initialPrimaryPx;
	let onChange = options.onChange;

	function ensureHandle() {
		if (handleEl) return;
		if (!primaryEl || !secondaryEl) return;
		const el = document.createElement("div");
		el.setAttribute("data-split-handle", "");
		el.setAttribute("aria-label", "调整分割");
		createdHandleEl = el;
		primaryEl.insertAdjacentElement("afterend", el);
		handleEl = el;
	}

	function cleanupCreatedHandle() {
		if (!createdHandleEl) return;
		createdHandleEl.remove();
		createdHandleEl = null;
	}

	function readParts() {
		// 只匹配当前容器的直接子元素，避免嵌套 splitPane 时外层误绑定到内层 handle。
		primaryEl = node.querySelector<HTMLElement>(":scope > [data-split-primary]");
		secondaryEl = node.querySelector<HTMLElement>(":scope > [data-split-secondary]");
		handleEl = node.querySelector<HTMLElement>(":scope > [data-split-handle]");
		ensureHandle();
	}

	function detachHandleEvents() {
		if (!mountedHandleEl) return;
		mountedHandleEl.removeEventListener("pointerdown", startDrag);
		mountedHandleEl.removeEventListener("keydown", onKeyDown);
		mountedHandleEl = null;
	}

	function attachHandleEvents() {
		if (!handleEl) return;
		mountedHandleEl = handleEl;
		handleEl.style.touchAction = "none";
		handleEl.style.pointerEvents = "auto";
		handleEl.style.display = "block";
		if (createdHandleEl === handleEl) {
			if (direction === "horizontal") {
				handleEl.style.width = "1px";
				handleEl.style.cursor = "col-resize";
				handleEl.style.flex = "0 0 1px";
			} else {
				handleEl.style.height = "1px";
				handleEl.style.cursor = "row-resize";
				handleEl.style.flex = "0 0 1px";
			}
			handleEl.style.background = "transparent";
			handleEl.style.boxSizing = "border-box";
			handleEl.style.border = "0";
			if (direction === "horizontal") {
				handleEl.style.borderLeft = "1px solid var(--black-10, #0000001A)";
			} else {
				handleEl.style.borderTop = "1px solid var(--black-10, #0000001A)";
			}
			handleEl.style.position = "relative";
			handleEl.style.zIndex = "10";
		}
		handleEl.addEventListener("pointerdown", startDrag);
		handleEl.addEventListener("keydown", onKeyDown);
		if (!handleEl.hasAttribute("tabindex")) {
			handleEl.setAttribute("tabindex", "0");
		}
		if (!handleEl.hasAttribute("role")) {
			handleEl.setAttribute("role", "separator");
		}
		handleEl.setAttribute(
			"aria-orientation",
			direction === "horizontal" ? "vertical" : "horizontal",
		);
	}

	function applyPrimaryPx(px: number) {
		if (!primaryEl) return;
		lastPrimaryPx = px;
		if (direction === "horizontal") {
			primaryEl.style.width = `${px}px`;
		} else {
			primaryEl.style.height = `${px}px`;
		}
		onChange?.(px);
	}

	function applyLayoutConstraints() {
		if (!primaryEl || !secondaryEl) return;
		// splitPane 只显式写 primary 的 width/height。
		// 为避免 flex 布局在交互/重排时重新分配尺寸，强制：
		// - secondary 占用剩余空间且允许被压缩
		// - primary 不参与剩余空间分配
		if (direction === "horizontal") {
			primaryEl.style.flex = "0 0 auto";
			secondaryEl.style.flex = "1 1 0";
			primaryEl.style.minWidth = "0";
			secondaryEl.style.minWidth = "0";
		} else {
			primaryEl.style.flex = "0 0 auto";
			secondaryEl.style.flex = "1 1 0";
			primaryEl.style.minHeight = "0";
			secondaryEl.style.minHeight = "0";
		}
		if (handleEl) {
			handleEl.style.flex = "0 0 1px";
		}
	}

	function computeNextPrimaryPx(e: PointerEvent) {
		const rect = node.getBoundingClientRect();
		const total = getRectSize(rect, direction);
		const handleSize = handleEl ? getRectSize(handleEl.getBoundingClientRect(), direction) : 0;
		const maxPrimary = Math.max(minPrimaryPx, total - minSecondaryPx - handleSize);
		const offset = getEventOffset(e, rect, direction);
		return clampResizableSize(offset, minPrimaryPx, maxPrimary);
	}

	function onPointerMove(e: PointerEvent) {
		if (!isDragging && !pendingDrag) return;
		const client = direction === "horizontal" ? e.clientX : e.clientY;
		if (pendingDrag) {
			const delta = Math.abs(client - dragStartClient);
			if (delta < 3) return;
			pendingDrag = false;
			isDragging = true;
			if (handleEl) {
				handleEl.classList.add("is-dragging");
			}
		}
		if (!isDragging) return;
		const next = computeNextPrimaryPx(e);
		if (next === lastPrimaryPx) return;
		applyPrimaryPx(next);
	}

	function endDrag() {
		if (!isDragging && !pendingDrag) return;
		isDragging = false;
		pendingDrag = false;
		window.removeEventListener("pointermove", onPointerMove);
		window.removeEventListener("pointerup", endDrag);
		window.removeEventListener("pointercancel", endDrag);
		if (handleEl) {
			handleEl.classList.remove("is-dragging");
		}
	}

	function startDrag(e: PointerEvent) {
		if (e.button !== 0) return;
		if (!handleEl) return;
		pendingDrag = true;
		dragStartClient = direction === "horizontal" ? e.clientX : e.clientY;
		try {
			handleEl.setPointerCapture(e.pointerId);
		} catch {
			// ignore
		}
		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", endDrag);
		window.addEventListener("pointercancel", endDrag);
		e.preventDefault();
	}

	function onKeyDown(e: KeyboardEvent) {
		if (!handleEl) return;
		const isH = direction === "horizontal";
		if (isH && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		if (!isH && e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
		e.preventDefault();

		const step = e.shiftKey ? 40 : 20;
		const dir = isH
			? e.key === "ArrowLeft"
				? -1
				: 1
			: e.key === "ArrowUp"
				? -1
				: 1;

		const rect = node.getBoundingClientRect();
		const total = getRectSize(rect, direction);
		const handleSize = handleEl ? getRectSize(handleEl.getBoundingClientRect(), direction) : 0;
		const maxPrimary = Math.max(minPrimaryPx, total - minSecondaryPx - handleSize);
		applyPrimaryPx(clampResizableSize(lastPrimaryPx + dir * step, minPrimaryPx, maxPrimary));
	}

	function mount() {
		readParts();
		if (!handleEl || !primaryEl || !secondaryEl) return;
		applyLayoutConstraints();

		// 初始化宽度/高度
		if (typeof initialPrimaryPx === "number") {
			applyPrimaryPx(initialPrimaryPx);
		} else {
			const rect = primaryEl.getBoundingClientRect();
			lastPrimaryPx = getRectSize(rect, direction);
			// 写回显式尺寸，避免 primary 以 auto 撑满导致 handle 无法命中/拖动。
			applyPrimaryPx(lastPrimaryPx);
		}

		attachHandleEvents();
	}

	mount();

	const controller: SplitPaneController = {
		setPrimaryPx(px: number) {
			applyLayoutConstraints();
			applyPrimaryPx(px);
		},
		getPrimaryPx() {
			return lastPrimaryPx;
		},
	};

	(node as any).__splitPaneController = controller;

	return {
		update(next: SplitPaneOptions) {
			direction = next.direction ?? direction;
			minPrimaryPx = next.minPrimaryPx ?? minPrimaryPx;
			minSecondaryPx = next.minSecondaryPx ?? minSecondaryPx;
			initialPrimaryPx = next.initialPrimaryPx;
			onChange = next.onChange;

			readParts();
			applyLayoutConstraints();
			attachHandleEvents();

			if (!primaryEl) return;
			if (typeof initialPrimaryPx === "number") {
				applyPrimaryPx(initialPrimaryPx);
			}
		},
		destroy() {
			endDrag();
			detachHandleEvents();
			cleanupCreatedHandle();
			delete (node as any).__splitPaneController;
		},
	};
}
