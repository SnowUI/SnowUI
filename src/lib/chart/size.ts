import { resizeManager } from "../../index";
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

export interface SectorChartSize extends CartesianChartSize {
    scale: number;
}

/** 用户指定的响应式最小显示宽度，固定为 CSS px。 */
export const SECTOR_CHART_MIN_WIDTH = 40;

/** 本体保留声明尺寸；根布局与浮层使用缩放后的尺寸。 */
export function watchSectorChartSize(
    root: HTMLElement,
    body: HTMLElement,
    onChange: (size: SectorChartSize) => void,
) {
    const update = () => {
        // 不读取 transform 后的本体边界，避免缩放反馈和外层动效重复计入。
        const rootStyle = getComputedStyle(root);
        const bodyStyle = getComputedStyle(body);
        const width = Math.max(0, parseFloat(rootStyle.width) || 0);
        const bodyWidth = parseFloat(bodyStyle.width);
        const bodyHeight = parseFloat(bodyStyle.height);
        if (!(bodyWidth > 0) || !(bodyHeight > 0)) return;
        const scale = width / bodyWidth;
        onChange({ width, height: bodyHeight * scale, scale });
    };
    update();
    const stopRoot = resizeManager.watch(root, update);
    const stopBody = resizeManager.watch(body, update);
    return () => {
        stopRoot();
        stopBody();
    };
}
