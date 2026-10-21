/* SnowUI source notice | LICENSE 2.3.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import { arc } from "d3-shape";
import { clamp, formatPoint, normalizePositiveAngle } from "./geometry";

export function buildArcPath(
    cx: number,
    cy: number,
    outer: number,
    inner: number,
    start: number,
    end: number,
    corner: number,
    separator = 0,
) {
    const outerRadius = Math.max(outer, inner, 0);
    const innerRadius = Math.max(0, Math.min(outer, inner));
    const padRadius = Math.sqrt(
        outerRadius * outerRadius + innerRadius * innerRadius,
    );
    const padAngle =
        separator > 0 && padRadius > 0
            ? 2 *
              Math.asin(
                  clamp(separator / (2 * padRadius), 0, 1),
              )
            : 0;
    const path = new SvgArcPath(cx, cy);
    const generator = arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius)
        .startAngle(start + Math.PI / 2)
        .endAngle(end + Math.PI / 2)
        .cornerRadius(Math.max(0, corner))
        .padAngle(padAngle)
        .padRadius(padRadius)
        .context(path as unknown as CanvasRenderingContext2D);
    generator({} as never);
    return path.toString();
}

class SvgArcPath {
    private readonly commands: string[] = [];
    private current?: { x: number; y: number };

    constructor(
        private readonly offsetX: number,
        private readonly offsetY: number,
    ) {}

    moveTo(x: number, y: number) {
        this.current = { x, y };
        this.commands.push(`M ${formatPoint(this.absolute(x, y))}`);
    }

    lineTo(x: number, y: number) {
        this.current = { x, y };
        this.commands.push(`L ${formatPoint(this.absolute(x, y))}`);
    }

    arc(
        cx: number,
        cy: number,
        radius: number,
        start: number,
        end: number,
        anticlockwise: boolean,
    ) {
        if (radius <= 0.0001) return;
        const startPoint = {
            x: cx + radius * Math.cos(start),
            y: cy + radius * Math.sin(start),
        };
        const endPoint = {
            x: cx + radius * Math.cos(end),
            y: cy + radius * Math.sin(end),
        };
        if (!this.current) {
            this.moveTo(startPoint.x, startPoint.y);
        } else if (
            Math.abs(this.current.x - startPoint.x) > 0.0001 ||
            Math.abs(this.current.y - startPoint.y) > 0.0001
        ) {
            this.lineTo(startPoint.x, startPoint.y);
        }

        const angle = anticlockwise
            ? normalizePositiveAngle(start - end)
            : normalizePositiveAngle(end - start);
        if (angle <= 0.0001) return;
        const sweep = anticlockwise ? 0 : 1;
        if (angle >= Math.PI * 2 - 0.0001) {
            const middle = anticlockwise ? start - Math.PI : start + Math.PI;
            this.arc(cx, cy, radius, start, middle, anticlockwise);
            this.arc(cx, cy, radius, middle, end, anticlockwise);
            return;
        }
        this.commands.push(
            `A ${radius.toFixed(3)} ${radius.toFixed(3)} 0 ${angle > Math.PI ? 1 : 0} ${sweep} ${formatPoint(this.absolute(endPoint.x, endPoint.y))}`,
        );
        this.current = endPoint;
    }

    closePath() {
        this.commands.push("Z");
    }

    toString() {
        return this.commands.join(" ");
    }

    private absolute(x: number, y: number) {
        return { x: this.offsetX + x, y: this.offsetY + y };
    }
}
