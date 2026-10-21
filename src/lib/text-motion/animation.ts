/* SnowUI source notice | LICENSE 2.3.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/** 内部连续重定向：逻辑终点与仍在播放的差值分离。 */
export function animateTextMotionDelta(
    element: HTMLElement,
    property: string,
    from: number,
    to: number,
    timing: KeyframeAnimationOptions,
) {
    const previous = Number.parseFloat(element.style.getPropertyValue(property));
    element.style.setProperty(property, String(to));
    return element.animate(
        { [property]: [(Number.isFinite(previous) ? previous : from) - to, 0] },
        { ...timing, fill: "backwards", composite: "accumulate" },
    );
}

const opacityAnimations = new WeakMap<HTMLElement, Animation>();
export function animateTextMotionOpacity(
    element: HTMLElement,
    to: number,
    timing: KeyframeAnimationOptions,
    initial?: number,
) {
    const from = initial ?? Number.parseFloat(getComputedStyle(element).opacity);
    opacityAnimations.get(element)?.cancel();
    element.style.opacity = String(to);
    const animation = element.animate({ opacity: [from, to] }, { ...timing, fill: "backwards" });
    opacityAnimations.set(element, animation);
    const release = () => { if (opacityAnimations.get(element) === animation) opacityAnimations.delete(element); };
    animation.onfinish = release;
    animation.oncancel = release;
    return animation;
}

// 槽位位移使用合成线程支持的transform 属性，不逐帧传播 CSS 变量。
export function animateTextMotionFace(
    element: HTMLElement,
    fromY: number,
    toY: number,
    fromAngle: number,
    toAngle: number,
    timing: KeyframeAnimationOptions,
) {
    const previousY = Number.parseFloat(element.style.transform.match(/translateY\(([-\d.]+)em\)/)?.[1] ?? "");
    const previousAngle = Number.parseFloat(element.style.transform.match(/rotate\(([-\d.]+)deg\)/)?.[1] ?? "");
    element.style.transform = `translateY(${toY}em) rotate(${toAngle}deg)`;
    return element.animate({
        transform: [
            `translateY(${(Number.isFinite(previousY) ? previousY : fromY) - toY}em) rotate(${(Number.isFinite(previousAngle) ? previousAngle : fromAngle) - toAngle}deg)`,
            "translateY(0em) rotate(0deg)",
        ],
    }, { ...timing, fill: "backwards", composite: "accumulate" });
}
