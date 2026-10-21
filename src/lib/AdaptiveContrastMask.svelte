<!-- SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- 自适应黑白对比共享渲染：只生成遮罩，宿主拥有形状、命中与状态。 -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { getAdaptiveContrastColor, type AdaptiveContrastSurface } from './adaptive-contrast';
    let { id, width, height, surfaces, overflow = 256 }: { id: string; width: number; height: number; surfaces: AdaptiveContrastSurface[]; overflow?: number } = $props();
    const padding = $derived(Math.max(0, overflow));
    let mask: SVGMaskElement;
    let backgrounds = $state<string[]>(['var(--background-1, #fff)']);
    onMount(() => {
        const ancestors: Element[] = [];
        for (let element = mask.parentElement; element; element = element.parentElement) ancestors.push(element);
        const refresh = () => {
            const next = ancestors.slice().reverse().map(element => getComputedStyle(element).backgroundColor).filter(color => color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent');
            if (JSON.stringify(next) !== JSON.stringify(backgrounds)) backgrounds = next;
        };
        refresh();
        const observer = typeof MutationObserver === 'undefined' ? undefined : new MutationObserver(refresh);
        ancestors.forEach(element => observer?.observe(element, { attributes: true, attributeFilter: ['class', 'style', 'theme', 'mode', 'data-theme', 'data-color-scheme'] }));
        // 背景色带过渡时，属性变更时读到的是起始色；结束后按最终色重新计算。
        const afterTransition = (event: Event) => {
            if ((event as TransitionEvent).propertyName === 'background-color') refresh();
        };
        ancestors.forEach(element => {
            element.addEventListener('transitionend', afterTransition);
            element.addEventListener('transitioncancel', afterTransition);
        });
        const media = typeof matchMedia === 'undefined' ? undefined : matchMedia('(prefers-color-scheme: dark)');
        media?.addEventListener?.('change', refresh);
        return () => {
            observer?.disconnect();
            media?.removeEventListener?.('change', refresh);
            ancestors.forEach(element => {
                element.removeEventListener('transitionend', afterTransition);
                element.removeEventListener('transitioncancel', afterTransition);
            });
        };
    });
</script>
<defs>
    <filter id={`${id}-threshold`} color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%">
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
            <feFuncR type="discrete" tableValues="1 0" />
            <feFuncG type="discrete" tableValues="1 0" />
            <feFuncB type="discrete" tableValues="1 0" />
        </feComponentTransfer>
    </filter>
    <mask bind:this={mask} {id} maskUnits="userSpaceOnUse" x={-padding} y={-padding} width={width + padding * 2} height={height + padding * 2} style="mask-type: luminance;">
        <g filter={`url(#${id}-threshold)`}>
            <rect x={-padding} y={-padding} width={width + padding * 2} height={height + padding * 2} fill={getAdaptiveContrastColor(true)} />
            {#each backgrounds as fill}<rect x={-padding} y={-padding} width={width + padding * 2} height={height + padding * 2} {fill} />{/each}
            {#each surfaces as surface}
                <path d={surface.path} fill={surface.fill} fill-opacity={surface.opacity} />
            {/each}
        </g>
    </mask>
</defs>
