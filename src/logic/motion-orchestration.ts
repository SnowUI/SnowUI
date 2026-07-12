/**
 * Motion Orchestration
 * 负责编排组的播放、反向播放和重置逻辑
 */

import type { MotionRegistration } from "@snowui-design-system/components/logic/motion-types";
import { getWhileAppearConfig, applyAppearAnimation, applyReverseAnimation, getAnimationConfig } from "@snowui-design-system/components/logic/motion-engine";
import { getCachedRect } from "@snowui-design-system/components/logic/geometry-cache";

/**
 * 正向播放编排组
 */
export function playForward(
    id: string,
    registry: Map<string, MotionRegistration>
) {
    // 首先检查是否有直接匹配的组件 ID
    const reg = registry.get(id);
    if (reg && reg.element) {
        const element = reg.element;

        // 尝试从元素获取 whileAppear 配置（单个元素的联动控制）
        const appearConfig = getWhileAppearConfig(element);

        if (appearConfig) {
            // 应用 whileAppear 动效
            applyAppearAnimation(element, appearConfig);
        } else {
            // 检查是否是编排容器
            // 根据 scope 决定查找范围
            let allChildren: NodeListOf<Element> | HTMLElement[] = [];
            const scope = reg.scope || 'descendants'; // 默认为 descendants (全局传播)

            // === orchestrateTarget 支持 ===
            // 如果指定了 orchestrateTarget (CSS 选择器)，则只编排匹配的元素
            const orchestrateTarget = element.dataset.orchestrateTarget;

            if (orchestrateTarget) {
                // 使用 CSS 选择器查找目标元素
                try {
                    allChildren = element.querySelectorAll(orchestrateTarget);
                } catch (e) {
                    console.warn(`[Motion] Invalid orchestrateTarget selector: ${orchestrateTarget}`);
                    allChildren = [];
                }
            } else if (scope === 'children') {
                // 仅直接子元素
                allChildren = Array.from(element.children) as HTMLElement[];
            } else if (scope === 'descendants' || scope === undefined) {
                // 所有后代
                allChildren = element.querySelectorAll('*');
            } else if (scope === 'self') {
                // 仅自身 (不编排子元素)
                allChildren = [];
            }

            const childrenWithAppear: HTMLElement[] = [];

            allChildren.forEach((child) => {
                if (child instanceof HTMLElement) {
                    const config = getWhileAppearConfig(child);
                    if (config) {
                        childrenWithAppear.push(child);
                    }
                }
            });

            if (childrenWithAppear.length > 0) {
                // 获取编排配置 (从 data-orchestrate-* 属性读取)
                const orchestrateDelay = parseInt(element.dataset.orchestrateDelay || '100');
                const orchestrateMode = element.dataset.orchestrateMode || 'sequential';
                const orchestrateOrder = element.dataset.orchestrateOrder || 'dom';

                // 根据排序方式处理子元素顺序
                let orderedChildren = [...childrenWithAppear];

                if (orchestrateOrder === 'visual-row' || orchestrateOrder === 'visual-column') {
                    // 获取每个元素的位置（使用缓存优化）
                    const childrenWithPos = orderedChildren.map(child => {
                        const rect = getCachedRect(child);
                        return { child, x: rect.left, y: rect.top };
                    });

                    if (orchestrateOrder === 'visual-row') {
                        // 从左到右，从上到下 (先按 y 排序，再按 x 排序)
                        childrenWithPos.sort((a, b) => {
                            const yDiff = a.y - b.y;
                            if (Math.abs(yDiff) > 5) return yDiff; // 允许 5px 误差
                            return a.x - b.x;
                        });
                    } else if (orchestrateOrder === 'visual-column') {
                        // 从上到下，从左到右 (先按 x 排序，再按 y 排序)
                        childrenWithPos.sort((a, b) => {
                            const xDiff = a.x - b.x;
                            if (Math.abs(xDiff) > 5) return xDiff; // 允许 5px 误差
                            return a.y - b.y;
                        });
                    }

                    orderedChildren = childrenWithPos.map(item => item.child);
                }

                // 根据模式处理
                if (orchestrateMode === 'random') {
                    // 随机打乱顺序
                    orderedChildren = orderedChildren.sort(() => Math.random() - 0.5);
                }

                // 第一步：同步设置所有子元素的初始状态（隐藏）
                // 确保所有卡片先一起隐藏，再按序出现，而不是逐个闪烁
                orderedChildren.forEach((child) => {
                    const childConfig = getWhileAppearConfig(child);
                    if (!childConfig) return;
                    child.style.transition = 'none';
                    if (childConfig.opacity !== undefined) {
                        const from = Array.isArray(childConfig.opacity) ? childConfig.opacity[0] : 0;
                        child.style.opacity = String(from);
                    }
                    if (childConfig.scale !== undefined) {
                        const [from] = Array.isArray(childConfig.scale) ? childConfig.scale : [0.5, childConfig.scale];
                        child.style.transform = `scale(${from})`;
                    } else if (childConfig.y !== undefined) {
                        const [from] = Array.isArray(childConfig.y) ? childConfig.y : [0, childConfig.y];
                        child.style.transform = `translateY(${from}px)`;
                    } else if (childConfig.x !== undefined) {
                        const [from] = Array.isArray(childConfig.x) ? childConfig.x : [0, childConfig.x];
                        child.style.transform = `translateX(${from}px)`;
                    }
                });

                // 第二步：等一帧确保初始状态渲染，然后按序播放
                requestAnimationFrame(() => {
                    orderedChildren.forEach((child, index) => {
                        const delay = orchestrateMode === 'parallel' ? 0 : index * orchestrateDelay;
                        setTimeout(() => {
                            const childConfig = getWhileAppearConfig(child);
                            if (childConfig) {
                                applyAppearAnimation(child, childConfig);
                            }
                        }, delay);
                    });
                });
            }
        }
    }
}

/**
 * 反向播放编排组
 */
export function playReverse(
    id: string,
    registry: Map<string, MotionRegistration>,
    notify: (id: string, event: any, payload: any) => void
) {
    // 首先检查是否有直接匹配的组件 ID
    const reg = registry.get(id);
    if (reg && reg.element) {
        const element = reg.element;

        // 优先检查元素自身是否有动效配置（与 playForward 保持对称）
        const selfConfig = getAnimationConfig(element);
        if (selfConfig) {
            applyReverseAnimation(element, selfConfig);
            return;
        }

        // 使用 querySelectorAll 查找所有带有动画配置的子元素
        const allChildren = element.querySelectorAll('*');
        const childrenWithConfig: HTMLElement[] = [];

        allChildren.forEach((child) => {
            if (child instanceof HTMLElement) {
                const config = getAnimationConfig(child);
                if (config) {
                    childrenWithConfig.push(child);
                }
            }
        });

        if (childrenWithConfig.length > 0) {
            // 获取编排配置
            const orchestrateDelay = parseInt(element.dataset.orchestrateDelay || '100');

            // 从后往前播放
            const reversedChildren = [...childrenWithConfig].reverse();
            reversedChildren.forEach((child, index) => {
                setTimeout(() => {
                    const config = getAnimationConfig(child);
                    if (config) {
                        applyReverseAnimation(child, config);
                    }
                }, index * orchestrateDelay);
            });
        }
    } else {
        // 否则按 timeline 查找
        registry.forEach((reg, nodeId) => {
            if (reg.timeline?.includes(id)) {
                notify(nodeId, 'whileIdle', { active: false, reverse: true });
            }
        });
    }
}

/**
 * 重置编排组到初始状态
 */
export function resetGroup(
    id: string,
    registry: Map<string, MotionRegistration>,
    notify: (id: string, event: any, payload: any) => void
) {
    const initialHeightKey = 'snowuiMotionInitialHeight';
    const resetElement = (node: HTMLElement) => {
        node.style.opacity = '';
        node.style.transform = '';
        node.style.transition = '';
        const initialHeight = node.dataset[initialHeightKey];
        if (initialHeight) {
            node.style.height = initialHeight;
            delete node.dataset[initialHeightKey];
        }
    };

    // 首先检查是否有直接匹配的组件 ID
    const reg = registry.get(id);
    if (reg && reg.element) {
        const element = reg.element;
        // 重置容器样式
        resetElement(element);

        // 使用 querySelectorAll 查找所有子元素（与 playForward 保持一致）
        const allChildren = element.querySelectorAll('*');
        allChildren.forEach(child => {
            if (child instanceof HTMLElement) {
                resetElement(child);
            }
        });
    } else {
        // 否则按 timeline 查找
        registry.forEach((reg, nodeId) => {
            if (reg.timeline?.includes(id)) {
                notify(nodeId, 'whileIdle', { reset: true });
            }
        });
    }
}
