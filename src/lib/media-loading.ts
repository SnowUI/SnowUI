/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import { getContext, setContext } from "svelte";
import { MEDIA_LOADING_CONTEXT_KEY } from "../keys";

export type MediaLoading = "lazy" | "eager";
type MediaLoadingGetter = () => MediaLoading;

/** 在组件初始化时为后代 Image 设置默认策略；传 getter 可响应状态变化。 */
export function provideMediaLoading(value: MediaLoading | MediaLoadingGetter): void {
    setContext<MediaLoadingGetter>(MEDIA_LOADING_CONTEXT_KEY,
        typeof value === "function" ? value : () => value);
}

/** 仅供组件内部消费；没有 Provider 时保留原生懒加载默认值。 */
export function useMediaLoading(): MediaLoadingGetter {
    return getContext<MediaLoadingGetter | undefined>(MEDIA_LOADING_CONTEXT_KEY) ?? (() => "lazy");
}
