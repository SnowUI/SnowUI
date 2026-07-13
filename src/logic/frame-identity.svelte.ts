import type { FrameProps } from "./frame-types";
import { hasMotionConfig } from "./frame-utils";

// 确定性 ID 计数器，避免 SSR hydration 不匹配
let idCounter = 0;

export class Identity {
    #props: FrameProps;

    constructor(props: FrameProps) {
        this.#props = props;
    }

    get id() {
        if (this.#props.id) return this.#props.id;

        // 如果包含动效配置，则需要生成 ID
        if (hasMotionConfig(this.#props)) {
            // 使用确定性计数器，避免 SSR/hydration 不匹配
            return `snowui-auto-${++idCounter}`;
        }

        return undefined;
    }
}
