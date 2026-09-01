import { resizeManager } from "@snowui-design-system/components";
import { toNumber } from "./geometry";

export interface CartesianChartSize {
    width: number;
    height: number;
}

export function watchCartesianChartSize(
    element: HTMLElement,
    onChange: (size: CartesianChartSize) => void,
) {
    const update = () => {
        const rect = element.getBoundingClientRect();
        onChange({
            width: Math.max(1, rect.width),
            height: Math.max(1, rect.height),
        });
    };
    update();
    return resizeManager.watch(element, update);
}

export function resolveCartesianChartSize(
    measured: number,
    declared: number | string,
    fallback: number,
) {
    return measured > 0 ? measured : toNumber(declared, fallback);
}
