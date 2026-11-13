/* SnowUI source notice | LICENSE 2.3.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
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
