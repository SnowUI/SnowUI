/* SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * while-load.ts
 * v1.0.0
 * whileLoad 默认动效：加载中（skeleton 由 Frame 自动处理）。
 */

import type { MotionConfig } from "../logic/motion-config";
import { MOTION_DURATION_BASE_MS } from "./tokens";

export const WHILE_LOAD_DEFAULT_MOTION: MotionConfig = {
    duration: MOTION_DURATION_BASE_MS,
};
