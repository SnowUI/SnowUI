/* SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * Frame Action 组装与挂载
 * - 统一组装用户 action + 内部能力 action
 * - 提供统一挂载/销毁逻辑
 */

type ActionTuple = [any, any?];
type ActionLike = ActionTuple | ((node: HTMLElement) => any);

export interface FrameActionBuildOptions {
    userActions?: any[];
    scaleAction?: ActionTuple | null;
    responsiveAction?: ((node: HTMLElement) => any) | null;
}

export function buildFrameActions(options: FrameActionBuildOptions): ActionLike[] {
    const actions: ActionLike[] = [...(options.userActions || [])];
    if (options.scaleAction) {
        actions.push(options.scaleAction);
    }
    if (options.responsiveAction) {
        actions.push(options.responsiveAction);
    }
    return actions;
}

export function mountFrameActions(node: HTMLElement, actions: ActionLike[]) {
    const instances = actions
        .map((a) => {
            if (Array.isArray(a) && a.length > 0) {
                const [action, params] = a;
                return action(node, params);
            }
            if (typeof a === "function") {
                return a(node);
            }
            return null;
        })
        .filter(Boolean);

    return {
        update() {
            // 当前版本无参数热更新需求
        },
        destroy() {
            instances.forEach((i: any) => i.destroy?.());
        },
    };
}
