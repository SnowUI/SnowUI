import {
    SIDE_PANEL_APPEAR_MOTION,
    SIDE_PANEL_DISAPPEAR_MOTION,
} from "../motion/presets/effects";
import { resolveMotionCssTiming } from "../motion/spring";

export type SidePanelPlacement = "floating" | "inline";

export const SIDE_PANEL_INLINE_GAP_PX = 16;

const sidePanelLayoutAppearTiming = resolveMotionCssTiming(
    SIDE_PANEL_APPEAR_MOTION,
);
const sidePanelLayoutDisappearTiming = resolveMotionCssTiming(
    SIDE_PANEL_DISAPPEAR_MOTION,
);

/**
 * 页面级内嵌布局 bridge：让常驻 rail 位移与主内容 padding 共用同一 spring。
 * 页面仍负责兄弟结构，SidePanel 不查询或改写兄弟 DOM。
 */
export function createSidePanelLayoutMotionStyle(
    active: boolean,
    panelWidth: number,
    gap = SIDE_PANEL_INLINE_GAP_PX,
) {
    const timing = active
        ? sidePanelLayoutAppearTiming
        : sidePanelLayoutDisappearTiming;
    const layoutSpace = active
        ? Math.max(0, Number(panelWidth) || 0) + Math.max(0, Number(gap) || 0)
        : 0;
    const railTranslateX = active
        ? 0
        : Math.max(0, Number(panelWidth) || 0) + Math.max(0, Number(gap) || 0);

    return [
        `--snowui-side-panel-layout-space: ${layoutSpace}px`,
        `--snowui-side-panel-layout-panel-width: ${Math.max(0, Number(panelWidth) || 0)}px`,
        `--snowui-side-panel-layout-rail-translate-x: ${railTranslateX}px`,
        `--snowui-side-panel-layout-motion-duration: ${timing.duration}ms`,
        `--snowui-side-panel-layout-motion-easing: ${timing.easing}`,
    ].join("; ");
}

export type SidePanelActionRole =
    | "placement"
    | "previous"
    | "next"
    | "copy"
    | "delete"
    | "close"
    | "custom";

export interface SidePanelToolbarAction {
    id?: string;
    role?: SidePanelActionRole;
    label?: string;
    icon?: string;
    ariaLabel?: string;
    variant?: "gray" | "filled" | "outline" | "borderless";
    bare?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    onClick?: (event: MouseEvent) => void | Promise<void>;
}
