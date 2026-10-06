<script lang="ts">
  import SnowUILogo from "../components/SnowUILogo.svelte";
  import Frame from "../components/Frame.svelte";
  import Slider from "../components/Slider.svelte";
  import LogoWordmark from "../internal/snow-ui-logo/Wordmark.svelte";
  import Text from "../components/Text.svelte";
  let progress = $state(0);
  let logoScale = $state(2);
</script>

<Frame column class="gap-16">
  <Frame class="items-start justify-center" style="width: 240px; height: 200px;">
    <SnowUILogo variant="vertical" compactProgress={progress} scale={logoScale} />
  </Frame>
  <Slider bind:value={progress} minValue={0} maxValue={1} step={0.01} aria-label="Logo compact progress" />
  <Slider bind:value={logoScale} minValue={0.5} maxValue={4} step={0.1} aria-label="Logo scale" />
  <Frame column class="gap-16 items-center">
    <SnowUILogo variant="text" scale={logoScale} />
    <span style={`display:block;position:relative;width:${71 / 16 * logoScale}rem;height:${12 / 16 * logoScale}rem;font-size:calc(var(--text-12) * ${logoScale});`}>
      <LogoWordmark greeting="snowui" id="logo-calibration-reference" />
    </span>
  </Frame>
  <Text>上方为矢量字标，下方为同字体 snowui；比较实际字形高度，字号随缩放同步变化。</Text>
  <Text>拖动滑块查看连续收拢；悬停查看每 1800ms 同步变化的等大表情与逐字问候；移出恢复品牌。</Text>
</Frame>
