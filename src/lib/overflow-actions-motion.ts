/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import { RESIZE_MOTION } from '../motion/presets/resize';

/** 操作组私有布局适配；Flex 决定终点，独立视觉壳只做平移，不缩放 Button。 */
export function createOverflowActionsMotion(root: HTMLElement) {
    let animations: Animation[] = [];
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const nodes = () => Array.from(root.querySelectorAll<HTMLElement>(
        ':scope > .snowui-overflow-action:not([data-overflow-mode="hidden"]) > .snowui-overflow-action-visual, :scope > .snowui-overflow-actions-more-visual, :scope > [data-as="separator"]:not([hidden])',
    ));
    function capture() {
        return new Map(nodes().map(node => [node, node.getBoundingClientRect()]));
    }
    function finish() {
        for (const animation of animations) animation.cancel();
        animations = [];
    }
    function play(before: ReturnType<typeof capture>) {
        if (media.matches || !root.animate) return;
        const after = capture();
        const oldRight = Math.max(...Array.from(before.values(), rect => rect.right));
        for (const [node, to] of after) {
            const from = before.get(node);
            // More 首次出现时从原操作组右缘接入；反向恢复的按钮由宽度驱动渐显。
            const x = from ? from.left - to.left
                : node.classList.contains('snowui-overflow-actions-more-visual') && Number.isFinite(oldRight)
                    ? oldRight - to.right : 0;
            if (Math.abs(x) < .01) continue;
            animations.push(node.animate([{translate:`${x}px 0px`},{translate:'0px 0px'}], {
                duration: RESIZE_MOTION.duration, easing: RESIZE_MOTION.easing as string, fill: 'both',
            }));
        }
        const current = animations;
        Promise.all(current.map(animation => animation.finished)).then(() => {
            if (animations === current) finish();
        }).catch(() => {});
    }
    media.addEventListener('change', finish);
    return {capture, finish, play, destroy() {finish(); media.removeEventListener('change', finish);}};
}
