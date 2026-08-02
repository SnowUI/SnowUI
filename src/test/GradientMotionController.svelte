<!--
  Gradient Test 专用动效参数控制台
  v3.1.0

  仅供 Playground Test 沙箱使用，不属于 Gradient 公开组件结构。
-->

<script lang="ts">
    import {
        Frame,
        Gradient,
        Slider,
        Text,
    } from "@snowui-design-system/components";

    let motion = $state({
        duration: 60,
        speedTenths: 40,
        easingX1: 1,
        easingY1: 1,
        easingX2: 1,
        easingY2: 1,
        vector4X: 12,
        vector4Y: 12,
        vector4Rotate: 20,
        vector3X: 12,
        vector3Y: 12,
        vector3Scale: 25,
        subtractX: 12,
        subtractY: 12,
        subtractDeform: 25,
        subtract2X: 12,
        subtract2Y: 12,
        subtract2Rotate: 20,
        subtract2Scale: 25,
    });

    let motionStyle = $derived(
        [
            `--snowui-gradient-motion-duration-override: ${motion.duration / (motion.speedTenths / 10)}s`,
            `--snowui-gradient-motion-easing-override: cubic-bezier(${motion.easingX1}, ${motion.easingY1}, ${motion.easingX2}, ${motion.easingY2})`,
            `--snowui-gradient-motion-vector-4-x-amplitude-override: ${motion.vector4X}%`,
            `--snowui-gradient-motion-vector-4-y-amplitude-override: ${motion.vector4Y}%`,
            `--snowui-gradient-motion-vector-4-rotate-amplitude-override: ${motion.vector4Rotate}deg`,
            `--snowui-gradient-motion-vector-3-x-amplitude-override: ${motion.vector3X}%`,
            `--snowui-gradient-motion-vector-3-y-amplitude-override: ${motion.vector3Y}%`,
            `--snowui-gradient-motion-vector-3-scale-amplitude-override: ${motion.vector3Scale / 100}`,
            `--snowui-gradient-motion-subtract-x-amplitude-override: ${motion.subtractX}%`,
            `--snowui-gradient-motion-subtract-y-amplitude-override: ${motion.subtractY}%`,
            `--snowui-gradient-motion-subtract-deform-amplitude-override: ${motion.subtractDeform / 100}`,
            `--snowui-gradient-motion-subtract-2-x-amplitude-override: ${motion.subtract2X}%`,
            `--snowui-gradient-motion-subtract-2-y-amplitude-override: ${motion.subtract2Y}%`,
            `--snowui-gradient-motion-subtract-2-rotate-amplitude-override: ${motion.subtract2Rotate}deg`,
            `--snowui-gradient-motion-subtract-2-scale-amplitude-override: ${motion.subtract2Scale / 100}`,
        ].join("; "),
    );
</script>

<Frame
    column
    class="gap-16 items-center"
    style="width: min(100%, 64rem);"
>
    <Frame column class="gap-8 items-center">
        <Gradient
            variant="cyan"
            size={360}
            radius={72}
            style={motionStyle}
        />
        <Text class="text-12">
            固定底色 · 四个独立 transform 图层
        </Text>
    </Frame>

    <Frame column class="gap-12" style="width: 100%;">
        <Text class="text-14">整体</Text>
        <Frame
            style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; width: 100%;"
        >
            <Frame column class="gap-4">
                <Text class="text-12">
                    基础时长 {motion.duration.toFixed(0)}s
                </Text>
                <Slider
                    bind:value={motion.duration}
                    minValue={4}
                    maxValue={60}
                    step={1}
                    aria-label="Gradient 动效时长"
                />
            </Frame>
            <Frame column class="gap-4">
                <Text class="text-12">
                    整体速度 {(motion.speedTenths / 10).toFixed(1)}×
                </Text>
                <Slider
                    bind:value={motion.speedTenths}
                    minValue={1}
                    maxValue={40}
                    step={1}
                    aria-valuetext={`${(motion.speedTenths / 10).toFixed(1)}×`}
                    aria-label="Gradient 整体运行速度"
                />
            </Frame>
        </Frame>

        <Text class="text-14">缓动</Text>
        <Frame
            style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; width: 100%;"
        >
            <Frame column class="gap-4">
                <Text class="text-12">Easing X1 {motion.easingX1.toFixed(2)}</Text>
                <Slider bind:value={motion.easingX1} minValue={0} maxValue={1} step={0.01} aria-label="Gradient Easing X1" />
            </Frame>
            <Frame column class="gap-4">
                <Text class="text-12">Easing Y1 {motion.easingY1.toFixed(2)}</Text>
                <Slider bind:value={motion.easingY1} minValue={0} maxValue={1} step={0.01} aria-label="Gradient Easing Y1" />
            </Frame>
            <Frame column class="gap-4">
                <Text class="text-12">Easing X2 {motion.easingX2.toFixed(2)}</Text>
                <Slider bind:value={motion.easingX2} minValue={0} maxValue={1} step={0.01} aria-label="Gradient Easing X2" />
            </Frame>
            <Frame column class="gap-4">
                <Text class="text-12">Easing Y2 {motion.easingY2.toFixed(2)}</Text>
                <Slider bind:value={motion.easingY2} minValue={0} maxValue={1} step={0.01} aria-label="Gradient Easing Y2" />
            </Frame>
        </Frame>

        <Text class="text-14">Vector 4 · 位移与旋转</Text>
        <Frame
            style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; width: 100%;"
        >
            <Frame column class="gap-4">
                <Text class="text-12">X 幅度 {motion.vector4X.toFixed(1)}%</Text>
                <Slider bind:value={motion.vector4X} minValue={0} maxValue={12} step={0.1} aria-label="Gradient Vector 4 X 幅度" />
            </Frame>
            <Frame column class="gap-4">
                <Text class="text-12">Y 幅度 {motion.vector4Y.toFixed(1)}%</Text>
                <Slider bind:value={motion.vector4Y} minValue={0} maxValue={12} step={0.1} aria-label="Gradient Vector 4 Y 幅度" />
            </Frame>
            <Frame column class="gap-4">
                <Text class="text-12">旋转幅度 ±{motion.vector4Rotate.toFixed(1)}°</Text>
                <Slider bind:value={motion.vector4Rotate} minValue={0} maxValue={20} step={0.1} aria-label="Gradient Vector 4 旋转幅度" />
            </Frame>
        </Frame>

        <Text class="text-14">Vector 3 · 位移与缩放</Text>
        <Frame
            style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; width: 100%;"
        >
            <Frame column class="gap-4">
                <Text class="text-12">X 幅度 {motion.vector3X.toFixed(1)}%</Text>
                <Slider bind:value={motion.vector3X} minValue={0} maxValue={12} step={0.1} aria-label="Gradient Vector 3 X 幅度" />
            </Frame>
            <Frame column class="gap-4">
                <Text class="text-12">Y 幅度 {motion.vector3Y.toFixed(1)}%</Text>
                <Slider bind:value={motion.vector3Y} minValue={0} maxValue={12} step={0.1} aria-label="Gradient Vector 3 Y 幅度" />
            </Frame>
            <Frame column class="gap-4">
                <Text class="text-12">缩放幅度 ±{motion.vector3Scale.toFixed(1)}%</Text>
                <Slider bind:value={motion.vector3Scale} minValue={0} maxValue={25} step={0.5} aria-label="Gradient Vector 3 缩放幅度" />
            </Frame>
        </Frame>

        <Text class="text-14">Subtract · 位移与形变</Text>
        <Frame
            style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; width: 100%;"
        >
            <Frame column class="gap-4">
                <Text class="text-12">X 幅度 {motion.subtractX.toFixed(1)}%</Text>
                <Slider bind:value={motion.subtractX} minValue={0} maxValue={12} step={0.1} aria-label="Gradient Subtract X 幅度" />
            </Frame>
            <Frame column class="gap-4">
                <Text class="text-12">Y 幅度 {motion.subtractY.toFixed(1)}%</Text>
                <Slider bind:value={motion.subtractY} minValue={0} maxValue={12} step={0.1} aria-label="Gradient Subtract Y 幅度" />
            </Frame>
            <Frame column class="gap-4">
                <Text class="text-12">形变幅度 ±{motion.subtractDeform.toFixed(1)}%</Text>
                <Slider bind:value={motion.subtractDeform} minValue={0} maxValue={25} step={0.5} aria-label="Gradient Subtract 形变幅度" />
            </Frame>
        </Frame>

        <Text class="text-14">Subtract 2 · 位移、旋转与缩放</Text>
        <Frame
            style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; width: 100%;"
        >
            <Frame column class="gap-4">
                <Text class="text-12">X 幅度 {motion.subtract2X.toFixed(1)}%</Text>
                <Slider bind:value={motion.subtract2X} minValue={0} maxValue={12} step={0.1} aria-label="Gradient Subtract 2 X 幅度" />
            </Frame>
            <Frame column class="gap-4">
                <Text class="text-12">Y 幅度 {motion.subtract2Y.toFixed(1)}%</Text>
                <Slider bind:value={motion.subtract2Y} minValue={0} maxValue={12} step={0.1} aria-label="Gradient Subtract 2 Y 幅度" />
            </Frame>
            <Frame column class="gap-4">
                <Text class="text-12">旋转幅度 ±{motion.subtract2Rotate.toFixed(1)}°</Text>
                <Slider bind:value={motion.subtract2Rotate} minValue={0} maxValue={20} step={0.1} aria-label="Gradient Subtract 2 旋转幅度" />
            </Frame>
            <Frame column class="gap-4">
                <Text class="text-12">缩放幅度 ±{motion.subtract2Scale.toFixed(1)}%</Text>
                <Slider bind:value={motion.subtract2Scale} minValue={0} maxValue={25} step={0.5} aria-label="Gradient Subtract 2 缩放幅度" />
            </Frame>
        </Frame>
    </Frame>
</Frame>
