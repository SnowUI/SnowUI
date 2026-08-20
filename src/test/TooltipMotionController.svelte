<!--
  Tooltip Test 专用连续裁切动效控制台
  v2.0.0

  仅供 Playground Test 沙箱使用，不属于 Tooltip 公开组件结构。
-->

<script lang="ts">
    import Button from "../components/Button.svelte";
    import Frame from "../components/Frame.svelte";
    import Slider from "../components/Slider.svelte";
    import Text from "../components/Text.svelte";
    import Tooltip from "../components/Tooltip.svelte";

    let motion = $state({
        baseDuration: 180,
        minDuration: 200,
        maxDuration: 320,
        durationPerPixel: 0.5,
        contentLag: 0.12,
    });

    const motionStyle = $derived(
        [
            `--snowui-tooltip-test-base-duration: ${motion.baseDuration}`,
            `--snowui-tooltip-test-min-duration: ${motion.minDuration}`,
            `--snowui-tooltip-test-max-duration: ${motion.maxDuration}`,
            `--snowui-tooltip-test-duration-per-pixel: ${motion.durationPerPixel}`,
            `--snowui-tooltip-test-content-lag: ${motion.contentLag}`,
        ].join("; "),
    );
</script>

<Frame column class="tooltip-motion-controller gap-16">
    <Frame column class="gap-8">
        <Text class="text-12" style="color: var(--black-60);">
            先停留第一个按钮，Tooltip 显示后在相邻按钮间切换。
        </Text>
        <Frame class="tooltip-motion-controller-preview gap-4">
            <Button data-tooltip-motion-trigger="short">
                保存
                <Tooltip variant="dark" style={motionStyle}>保存当前配置</Tooltip>
            </Button>
            <Button data-tooltip-motion-trigger="medium">
                复制
                <Tooltip variant="dark" style={motionStyle}>复制分享链接</Tooltip>
            </Button>
            <Button data-tooltip-motion-trigger="long">
                归档
                <Tooltip variant="dark" style={motionStyle}>
                    移动到团队归档区，稍后仍可恢复
                </Tooltip>
            </Button>
        </Frame>
    </Frame>

    <Frame column class="gap-12">
        <Frame class="tooltip-motion-controller-grid">
            <Frame column class="gap-4">
                <Text class="text-12">基础时长 {motion.baseDuration.toFixed(0)}ms</Text>
                <Slider
                    bind:value={motion.baseDuration}
                    minValue={80}
                    maxValue={260}
                    step={10}
                    aria-label="Tooltip 基础时长"
                />
            </Frame>
            <Frame column class="gap-4">
                <Text class="text-12">最短时长 {motion.minDuration.toFixed(0)}ms</Text>
                <Slider
                    bind:value={motion.minDuration}
                    minValue={120}
                    maxValue={280}
                    step={10}
                    aria-label="Tooltip 最短时长"
                />
            </Frame>
        </Frame>

        <Frame class="tooltip-motion-controller-grid">
            <Frame column class="gap-4">
                <Text class="text-12">最长时长 {motion.maxDuration.toFixed(0)}ms</Text>
                <Slider
                    bind:value={motion.maxDuration}
                    minValue={motion.minDuration}
                    maxValue={500}
                    step={10}
                    aria-label="Tooltip 最长时长"
                />
            </Frame>
            <Frame column class="gap-4">
                <Text class="text-12">距离增量 {motion.durationPerPixel.toFixed(2)}ms/px</Text>
                <Slider
                    bind:value={motion.durationPerPixel}
                    minValue={0.05}
                    maxValue={1.5}
                    step={0.05}
                    aria-label="Tooltip 距离时长增量"
                />
            </Frame>
        </Frame>

        <Frame column class="gap-4">
            <Text class="text-12">内容相位滞后 {(motion.contentLag * 100).toFixed(0)}%</Text>
            <Slider
                bind:value={motion.contentLag}
                minValue={0}
                maxValue={0.5}
                step={0.02}
                aria-label="Tooltip 内容相位滞后"
            />
        </Frame>
    </Frame>
</Frame>

<style>
    :global(:where(.tooltip-motion-controller)) {
        width: min(100%, 48rem);
    }

    :global(:where(.tooltip-motion-controller-preview)) {
        align-items: center;
        min-height: calc(var(--size-16) * 2);
        padding: var(--padding-8);
        box-sizing: border-box;
        border-radius: var(--radius-5);
        background: var(--black-4);
    }

    :global(:where(.tooltip-motion-controller-grid)) {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--gap-12);
        width: 100%;
    }

    :global(:where(.tooltip-motion-controller-grid) .snowui-slider) {
        width: 100%;
    }
</style>
