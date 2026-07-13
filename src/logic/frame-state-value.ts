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
