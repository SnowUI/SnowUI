/* SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { CoreState, StateValueMap } from "./frame-types";

export interface ParentFrameStateContext {
    currentState?: CoreState;
}

export function resolveStateValue<T>(
    map: StateValueMap<T> | undefined,
    state: CoreState | undefined,
    fallback?: T,
): T | undefined {
    if (!map || typeof map !== "object") return fallback;

    const currentState = state ?? "Idle";
    if (Object.prototype.hasOwnProperty.call(map, currentState)) {
        return map[currentState];
    }
    if (Object.prototype.hasOwnProperty.call(map, "Idle")) {
        return map.Idle;
    }
    return fallback;
}

export function resolveParentStateValue<T>(
    map: StateValueMap<T> | undefined,
    parentContext: ParentFrameStateContext | undefined,
    fallback?: T,
): T | undefined {
    return resolveStateValue(map, parentContext?.currentState, fallback);
}
