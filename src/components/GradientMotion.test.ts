/**
 * GradientMotion.test.ts
 * v4.0.0
 *
 * 覆盖 glimm palette、随机默认头像、速度控制、裁切与背景扫光组合。
 */
export const examples = [
    {
        name: "A1: glimm 六种 palette",
        code: `A1
<Frame row class="gap-12 items-center" style="flex-wrap: wrap;">
    <GradientMotion variant="prism" size={72} radius="9999px" />
    <GradientMotion variant="berry" size={72} radius="9999px" />
    <GradientMotion variant="lagoon" size={72} radius="9999px" />
    <GradientMotion variant="citrus" size={72} radius="9999px" />
    <GradientMotion variant="azure" size={72} radius="9999px" />
    <GradientMotion variant="ember" size={72} radius="9999px" />
</Frame>`,
        expected: {
            render: "显示 6 个圆形 glimm sweep 渐变动效图，扫光带循环穿过画布",
            layout: "每个实例为 72px 圆形内禀原子，横向排列",
            performance: "使用单 canvas WebGL shader 渲染；WebGL 不可用时显示 CSS 降级扫光带",
        },
        logic: ["Variant", "Shader", "Glimm"],
    },
    {
        name: "A1.5: 头像无空白变体",
        code: `A1.5
<script lang="ts">
    let avatarWave = $state(6);
    let avatarSpeed = $state(3);
    let avatarColorSpeed = $state(2);
    let avatarIntensity = $state(1.2);
    let avatarHighlight = $state(2);
    let avatarBandTight = $state(3);
    let avatarRipple = $state(5);
    let avatarBrightness = $state(1.2);
    let avatarDirection = $state<"ltr" | "rtl" | "ttb" | "btt">("ttb");
    let avatarPaused = $state(false);
    let avatarColor1 = $state("#feee33");
    let avatarColor2 = $state("#29FF1A");
    let avatarColor3 = $state("#7866FF");
    let avatarColor4 = $state("#ff0000");
</script>

<Frame column class="gap-12" style="width: min(100%, 36rem);">
    <GradientMotion
        variant="avatar"
        seed="Ada Lovelace"
        width={160}
        height={160}
        radius={200}
        waveAmount={avatarWave}
        speed={avatarSpeed}
        colorSpeed={avatarColorSpeed}
        intensity={avatarIntensity}
        highlightIntensity={avatarHighlight}
        bandTight={avatarBandTight}
        rippleAmount={avatarRipple}
        brightness={avatarBrightness}
        direction={avatarDirection}
        paused={avatarPaused}
        colors={[avatarColor1, avatarColor2, avatarColor3, avatarColor4]}
    />

    <Frame row class="gap-4 items-center">
        <Text class="text-14" style="width: 7rem;">晃动 {avatarWave.toFixed(1)}x</Text>
        <Slider bind:value={avatarWave} minValue={0} maxValue={20} step={0.1} aria-label="头像渐变晃动幅度" />
    </Frame>
    <Frame row class="gap-4 items-center">
        <Text class="text-14" style="width: 7rem;">速度 {avatarSpeed.toFixed(1)}x</Text>
        <Slider bind:value={avatarSpeed} minValue={0.2} maxValue={20} step={0.1} aria-label="头像渐变动效速度" />
    </Frame>
    <Frame row class="gap-4 items-center">
        <Text class="text-14" style="width: 7rem;">颜色 {avatarColorSpeed.toFixed(1)}x</Text>
        <Slider bind:value={avatarColorSpeed} minValue={0} maxValue={20} step={0.1} aria-label="头像渐变颜色变化速度" />
    </Frame>
    <Frame row class="gap-4 items-center">
        <Text class="text-14" style="width: 7rem;">强度 {avatarIntensity.toFixed(1)}x</Text>
        <Slider bind:value={avatarIntensity} minValue={0} maxValue={20} step={0.1} aria-label="头像渐变强度" />
    </Frame>
    <Frame row class="gap-4 items-center">
        <Text class="text-14" style="width: 7rem;">高光 {avatarHighlight.toFixed(1)}x</Text>
        <Slider bind:value={avatarHighlight} minValue={0} maxValue={20} step={0.1} aria-label="头像渐变高光强度" />
    </Frame>
    <Frame row class="gap-4 items-center">
        <Text class="text-14" style="width: 7rem;">色带 {avatarBandTight.toFixed(1)}</Text>
        <Slider bind:value={avatarBandTight} minValue={1} maxValue={20} step={0.1} aria-label="头像渐变色带宽度" />
    </Frame>
    <Frame row class="gap-4 items-center">
        <Text class="text-14" style="width: 7rem;">波纹 {avatarRipple.toFixed(1)}x</Text>
        <Slider bind:value={avatarRipple} minValue={0} maxValue={20} step={0.1} aria-label="头像渐变波纹强度" />
    </Frame>
    <Frame row class="gap-4 items-center">
        <Text class="text-14" style="width: 7rem;">亮度 {avatarBrightness.toFixed(1)}x</Text>
        <Slider bind:value={avatarBrightness} minValue={0} maxValue={20} step={0.1} aria-label="头像渐变亮度" />
    </Frame>
    <Frame row class="gap-4 items-center">
        <Text class="text-14" style="width: 7rem;">方向</Text>
        <Segmented bind:value={avatarDirection} variant="pill">
            <Button as="item" value="ltr">横向</Button>
            <Button as="item" value="ttb">纵向</Button>
            <Button as="item" value="rtl">横向反转</Button>
            <Button as="item" value="btt">纵向反转</Button>
        </Segmented>
    </Frame>
    <Frame row class="gap-4 items-center">
        <Text class="text-14" style="width: 7rem;">暂停</Text>
        <Switch bind:checked={avatarPaused} aria-label="暂停头像渐变动效" />
    </Frame>
    <Frame row class="gap-8" style="flex-wrap: wrap;">
        <Input type="color" bind:value={avatarColor1} title="颜色 1" style="width: 8rem;" />
        <Input type="color" bind:value={avatarColor2} title="颜色 2" style="width: 8rem;" />
        <Input type="color" bind:value={avatarColor3} title="颜色 3" style="width: 8rem;" />
        <Input type="color" bind:value={avatarColor4} title="颜色 4" style="width: 8rem;" />
    </Frame>
</Frame>`,
        expected: {
            render: "显示一个 200x200 头像渐变实验台，可调整所有视觉参数与四个颜色，且始终不闪白",
            layout: "单个预览位于参数控制器上方",
        },
        logic: ["AvatarVariant", "NoBlank", "SlowMotion"],
    },
    {
        name: "A2: 头像默认图",
        code: `A2
<Frame row class="gap-12 items-center">
    <Avatar fallback={GradientMotion} data-name="Ada Lovelace" size={48} />
    <Avatar fallback={GradientMotion} data-name="Grace Hopper" size={48} />
    <Avatar fallback={GradientMotion} data-name="Katherine Johnson" size={48} />
</Frame>`,
        expected: {
            render: "三个 Avatar 在无 src 时显示稳定随机 glimm sweep 默认头像",
            layout: "GradientMotion 由 Avatar fallback 渲染为头像视觉层",
        },
        logic: ["Avatar", "Fallback"],
    },
    {
        name: "A2.5: 全部可选颜色与速度控制",
        code: `A2.5
<script lang="ts">
    let motionSpeed = $state(1);
    const colors = ["prism", "berry", "lagoon", "citrus", "azure", "ember"] as const;
</script>

<Frame column class="gap-16" style="width: min(100%, 44rem);">
    <Frame row class="gap-12 items-center" style="width: 24rem; max-width: 100%;">
        <Text class="text-14" style="width: 4rem;">速度 {motionSpeed.toFixed(1)}x</Text>
        <Slider bind:value={motionSpeed} minValue={0.2} maxValue={2} step={0.1} aria-label="GradientMotion 动效速度" />
    </Frame>

    <Frame row class="gap-12" style="flex-wrap: wrap;">
        {#each colors as color}
            <Frame column class="gap-6">
                <GradientMotion variant={color} width={200} height={120} radius={20} speed={motionSpeed} />
                <Text class="text-12 text-black-60">{color}</Text>
            </Frame>
        {/each}
    </Frame>
</Frame>`,
        expected: {
            render: "显示 glimm.dev 截图中 6 种可选颜色，每个预览为 200x120、20px 圆角，并由同一个速度滑动条控制动效速度",
            layout: "色卡自动换行排列，控制器位于色卡上方",
        },
        logic: ["Variant", "Palette", "SpeedControl", "Slider"],
    },
    {
        name: "A3: as 头像图片角色",
        code: `A3
<Avatar size={80}>
    <GradientMotion as="avatar-image" variant="random" seed="profile-card" />
    <Badge as="badge" dot />
</Avatar>`,
        expected: {
            render: "Avatar 内部显示 glimm sweep 动效图，并保留角标",
            layout: "GradientMotion 通过 as=avatar-image 作为头像图片层覆盖默认回退",
        },
        logic: ["As", "Composition"],
    },
    {
        name: "A4: 背景扫光与速度",
        code: `A4
<Frame column class="gap-8 text-white" style="width: 20rem; height: 10rem; overflow: hidden; border-radius: 1.5rem; padding: 1rem; position: relative; background: #050509;">
    <GradientMotion as="pin-center" variant="prism" speed={0.7} class="w-full h-full" radius="1.5rem" />
    <Frame as="pin-bottom-left" column class="gap-4" style="padding: 1rem;">
        <Text class="text-20 font-semibold">Prism Sweep</Text>
        <Text class="text-14">背景图模式，还原 glimm.dev 的 shader sweep 渐变。</Text>
    </Frame>
</Frame>`,
        expected: {
            render: "深色卡片背景上显示 prism 扫光带，并叠加文字",
            layout: "GradientMotion 填满父容器并被圆角裁切",
        },
        logic: ["Background", "Speed"],
    },
    {
        name: "A5: 大矩形 Sweep 背景",
        code: `A5
<Frame column class="gap-12 text-white" style="width: min(100%, 44rem); height: 18rem; overflow: hidden; border-radius: 2rem; padding: 1.5rem; position: relative; background: #07070A;">
    <GradientMotion as="pin-center" variant="berry" speed={0.8} class="w-full h-full" radius="2rem" intensity={1.15} />
    <Frame as="pin-bottom-left" column class="gap-4" style="padding: 1.5rem;">
        <Text class="text-24 font-semibold">Berry Sweep</Text>
        <Text class="text-14">较大矩形场景，用于检查 glimm band 的 gaussian falloff、wave 与高光。</Text>
    </Frame>
</Frame>`,
        expected: {
            render: "大矩形区域显示 glimm 风格扫光带、虹彩与高光",
            layout: "GradientMotion 填满 44rem x 18rem 容器并被 2rem 圆角裁切",
        },
        logic: ["Large", "Glimm", "Background"],
    },
    {
        name: "A6: 方向与自由裁切",
        code: `A6
<Frame row class="gap-16 items-center">
    <GradientMotion variant="lagoon" size={80} radius="1rem" direction="rtl" />
    <GradientMotion variant="azure" width="8rem" height="4rem" radius="9999px" direction="ttb" />
    <GradientMotion variant="ember" width="10rem" height="5rem" radius="0.5rem" speed={1.4} direction="btt" />
</Frame>`,
        expected: {
            render: "显示圆角方形、胶囊形与矩形三种裁切，并分别使用不同扫光方向",
            layout: "组件尺寸由 size 或 width/height 控制",
        },
        logic: ["Clip", "Size", "Direction"],
    },
] as const;
