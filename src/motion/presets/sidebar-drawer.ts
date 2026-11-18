import { PANEL_EXIT_TIMING } from "./effects";
import { resolveMotionCssTiming } from "../spring";

const closeTiming = resolveMotionCssTiming(PANEL_EXIT_TIMING);

// PANEL_EXIT_TIMING is shared with SidePanel; CSS is only an execution adapter.
// Preserve Sidebar entrance timing and its own slide geometry.
export const SIDEBAR_DRAWER_STYLE = [
    "--snowui-sidebar-drawer-duration: 220ms",
    "--snowui-sidebar-drawer-easing: ease",
    `--snowui-sidebar-drawer-close-duration: ${closeTiming.duration}ms`,
    `--snowui-sidebar-drawer-close-easing: ${closeTiming.easing}`,
].join("; ");
/*! @license SnowUI-Commercial-2.4.0 https://snowui.dev/LICENSE (../../../LICENSE) */
