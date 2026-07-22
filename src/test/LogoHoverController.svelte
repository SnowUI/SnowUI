<script lang="ts">
    import Frame from "../components/Frame.svelte";
    import Logo from "../components/Logo.svelte";
    import Slider from "../components/Slider.svelte";
    import Text from "../components/Text.svelte";

    type LogoDebugDirection = "clockwise" | "counterclockwise";

    let speeds = $state([0.3, 0.1, 0.1]);
    let directions = $state<LogoDebugDirection[]>([
        "counterclockwise",
        "clockwise",
        "clockwise",
    ]);
    const layerLabels = [
        "米字",
        "蓝条 1 / 2",
        "蓝条 3 / 4",
    ];
    const debugStyle = $derived([
        `--snowui-logo-test-asterisk-duration-factor: ${1 / speeds[0]}`,
        `--snowui-logo-test-asterisk-turn: ${directions[0] === "clockwise" ? 360 : -360}deg`,
        `--snowui-logo-test-strip-12-duration-factor: ${1 / speeds[1]}`,
        `--snowui-logo-test-strip-12-turn: ${directions[1] === "clockwise" ? 360 : -360}deg`,
        `--snowui-logo-test-strip-34-duration-factor: ${1 / speeds[2]}`,
        `--snowui-logo-test-strip-34-turn: ${directions[2] === "clockwise" ? 360 : -360}deg`,
    ].join("; "));
</script>

<Frame
    column
    class="logo-hover-controller gap-4"
    style="width: min(100%, 48rem);"
>
    <Frame class="logo-hover-controller-preview">
        <Logo
            variant="horizontal"
            scale={2}
            style={debugStyle}
        />
    </Frame>

    <Text class="text-12" style="color: var(--black-60);">
        将指针悬停在 Logo 上查看当前设置。
    </Text>

    {#each layerLabels as label, index}
        <Frame row class="logo-hover-controller-row gap-8 items-center">
            <Text class="text-12 logo-hover-controller-label">
                {label} {speeds[index].toFixed(2)}x
            </Text>
            <Slider
                bind:value={speeds[index]}
                minValue={0.1}
                maxValue={3}
                step={0.05}
                aria-label={label + "旋转速度"}
            />
            <select
                class="logo-hover-controller-direction"
                bind:value={directions[index]}
                aria-label={label + "旋转方向"}
            >
                <option value="clockwise">顺时针</option>
                <option value="counterclockwise">逆时针</option>
            </select>
        </Frame>
    {/each}
</Frame>

<style>
    :global(:where(.logo-hover-controller-preview)) {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: calc(var(--size-16) * 2);
        padding: var(--padding-6);
        box-sizing: border-box;
        border-radius: var(--radius-5);
        background: var(--black-4);
    }

    :global(:where(.logo-hover-controller-row)) {
        width: 100%;
        flex-wrap: wrap;
    }

    :global(:where(.logo-hover-controller-label)) {
        width: calc(var(--size-16) * 2.25);
    }

    :global(:where(.logo-hover-controller-row) .snowui-slider) {
        flex: 1 1 calc(var(--size-16) * 2);
        min-width: calc(var(--size-16) * 2);
    }

    .logo-hover-controller-direction {
        min-height: var(--size-7);
        padding: 0 var(--padding-2);
        border: var(--border-1) solid var(--black-10);
        border-radius: var(--radius-3);
        background: var(--background-1);
        color: var(--black-100);
        font: inherit;
    }
</style>
