<!--
  Tooltip Test 专用连续裁切动效控制台
  v1.0.0

  仅供 Playground Test 沙箱使用，不属于 Tooltip 公开组件结构。
-->

<script lang="ts">
    import Button from "../components/Button.svelte";
    import Frame from "../components/Frame.svelte";
    import Slider from "../components/Slider.svelte";
    import Text from "../components/Text.svelte";
    import Tooltip from "../components/Tooltip.svelte";

    let motion = $state({
        shellSpeed: 0.5,
        contentSpeed: 0.3,
        decelerateFrom: 0.9,
        contentEndSpeed: 0.05,
    });

    const motionStyle = $derived(
        [
            `--snowui-tooltip-test-shell-speed: ${motion.shellSpeed}`,
            `--snowui-tooltip-test-content-speed: ${motion.contentSpeed}`,
            `--snowui-tooltip-test-content-decelerate-from: ${motion.decelerateFrom}`,
            `--snowui-tooltip-test-content-end-speed: ${motion.contentEndSpeed}`,
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
                <Text class="text-12">外框速度 {motion.shellSpeed.toFixed(2)}px/ms</Text>
                <Slider
                    bind:value={motion.shellSpeed}
                    minValue={0.1}
                    maxValue={1}
                    step={0.05}
                    aria-label="Tooltip 外框速度"
                />
            </Frame>
            <Frame column class="gap-4">
                <Text class="text-12">内容速度 {motion.contentSpeed.toFixed(2)}px/ms</Text>
                <Slider
                    bind:value={motion.contentSpeed}
                    minValue={0.1}
                    maxValue={1}
                    step={0.05}
                    aria-label="Tooltip 内容速度"
                />
            </Frame>
        </Frame>

        <Frame class="tooltip-motion-controller-grid">
            <Frame column class="gap-4">
                <Text class="text-12">
                    开始减速时间 {(motion.decelerateFrom * 100).toFixed(0)}%
                </Text>
                <Slider
                    bind:value={motion.decelerateFrom}
                    minValue={0.1}
                    maxValue={0.95}
                    step={0.05}
                    aria-label="Tooltip 内容开始减速时间"
                />
            </Frame>
            <Frame column class="gap-4">
                <Text class="text-12">
                    最终速度 {motion.contentEndSpeed.toFixed(2)}px/ms
                </Text>
                <Slider
                    bind:value={motion.contentEndSpeed}
                    minValue={0.05}
                    maxValue={motion.contentSpeed}
                    step={0.05}
                    aria-label="Tooltip 内容最终速度"
                />
            </Frame>
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
