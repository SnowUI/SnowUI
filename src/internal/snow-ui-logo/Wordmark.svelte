<!-- SnowUI source notice | LICENSE 2.3.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- Logo 专用字标；不公开文字组件 API，不依赖通用文字动效模块。 -->
<script lang="ts">
  import { onMount } from "svelte";
  import type { TransitionConfig } from "svelte/transition";
  let { greeting = null, formIndex = -1, variantMotion = false, align = "center", id, onmotionstart, onmotionend }: {
    greeting?: string | null;
    formIndex?: number;
    variantMotion?: boolean;
    align?: "left" | "center";
    id: string;
    onmotionstart?: () => void;
    onmotionend?: () => void;
  } = $props();
  const brand = [
    {
      label: "s",
      path: "M35.9106 98C47.385 98 56.522 95.6097 63.3217 90.6301C70.1213 85.6504 73.5211 78.878 73.5211 69.9146C73.5211 62.1463 70.7588 56.3699 65.4466 52.187C59.9218 48.0041 52.6972 44.4187 43.5602 41.2317C37.398 38.8415 32.0858 36.6504 28.0485 34.6585C24.0112 32.6667 21.8864 29.6789 21.8864 25.6951C21.8864 22.1098 23.3738 19.3211 26.5611 17.5285C29.7484 15.7358 33.9982 14.939 39.3104 14.939C43.3477 14.939 47.385 15.5366 51.2098 16.7317C54.8221 17.9268 58.6469 19.5203 62.6842 21.7114L69.2714 8.16667C64.8091 5.37804 59.9218 3.38618 54.8221 1.99187C49.7224 0.597559 44.6227 0 39.3104 0C28.686 0 20.1864 2.19106 13.5993 6.77235C7.01213 11.3537 3.8248 17.7276 4.03729 25.8943C4.24978 33.4634 7.01213 39.2398 12.5368 43.2236C17.8491 47.2073 25.0737 50.7927 34.2107 53.9797C40.3729 56.1707 45.4726 58.3618 49.5099 60.5528C53.5472 62.7439 55.4596 66.1301 55.4596 70.5122C55.4596 74.4959 53.7597 77.4837 50.3599 79.6748C46.7475 81.8658 41.8603 82.8618 35.2731 82.8618C30.8109 82.8618 26.1361 82.065 21.4614 80.6707C16.7866 79.2764 11.8994 77.0854 6.58715 73.6992L0 87.8415C5.31222 91.0284 11.0494 93.4187 16.7866 95.2114C22.5238 97.004 28.8985 98 35.9106 98Z",
      x: 0,
      width: 73.5211,
      advance: 98.0283,
      brand: false,
    },
    {
      label: "n",
      path: "M163.38 98V40.8333C163.38 27.3024 152.408 16.3333 138.873 16.3333C125.339 16.3333 114.366 27.3024 114.366 40.8333V98H98.0283V40.8333C98.0283 18.2817 116.315 0 138.873 0C161.431 0 179.718 18.2817 179.718 40.8333V98H163.38Z",
      x: 98.0283,
      width: 81.6897,
      advance: 106.1977,
      brand: false,
    },
    {
      label: "o",
      path: "M253.24 81.6667C271.286 81.6667 285.916 67.0413 285.916 49C285.916 30.9587 271.286 16.3333 253.24 16.3333C235.193 16.3333 220.564 30.9587 220.564 49C220.564 67.0413 235.193 81.6667 253.24 81.6667ZM253.24 98C280.309 98 302.254 76.0619 302.254 49C302.254 21.938 280.309 0 253.24 0C226.17 0 204.226 21.938 204.226 49C204.226 76.0619 226.17 98 253.24 98Z",
      x: 204.226,
      width: 98.028,
      advance: 114.366,
      brand: false,
    },
    {
      label: "w",
      path: "M318.592 0L333.989 84.5377C337.183 102.074 360.605 102.642 364.549 85.2792L373.676 37.0915C374.012 35.3213 376.385 35.3574 376.673 37.1371L384.354 84.5634C387.763 102.072 411.22 102.297 414.926 84.8568L432.958 0H417.101L401.234 81.3433C400.893 83.092 398.554 83.069 398.243 81.3139L383.832 0H367.87L350.992 81.5825C350.632 83.3252 348.296 83.2741 348.003 81.5171L334.375 0H318.592Z",
      x: 318.592,
      width: 114.366,
      advance: 138.873,
      brand: false,
    },
    {
      label: "U",
      path: "M16.338 1.91777e-06L16.338 57.1667C16.338 70.6976 27.3102 81.6667 40.8451 81.6667C54.3799 81.6667 65.3521 70.6976 65.3521 57.1667L65.3521 6.20149e-06L81.6901 7.62939e-06L81.6901 57.1667C81.6901 79.7183 63.4032 98 40.8451 98C18.287 98 1.5987e-06 79.7183 3.57079e-06 57.1667L8.5699e-06 4.89869e-07L16.338 1.91777e-06Z",
      x: 0,
      width: 81.6901,
      advance: 106.197,
      brand: true,
    },
    {
      label: "I",
      path: "M106.197 98V0H122.535V98H106.197Z",
      x: 106.197,
      width: 16.338,
      advance: 16.338,
      brand: true,
    },
  ];
  // 品牌专用几何：六个字母与原字标使用同一画布，不依赖系统字形。
  const forms = ["round", "pixel", "outline", "italic", "stripe", "bold"] as const;
  const roundPaths = [
    "M88 15 C65 0 12 0 12 28 C12 50 88 48 88 72 C88 100 35 100 12 85",
    "M12 92 V40 C12 0 88 0 88 40 V92",
    "M50 8 C-6 8 -6 92 50 92 C106 92 106 8 50 8 Z",
    "M8 8 L26 92 L50 30 L74 92 L92 8",
    "M12 8 V62 C12 104 88 104 88 62 V8",
    "M50 8 V92",
  ];
  const pixels = [
    ["01111","10000","10000","01110","00001","00001","11110"],
    ["00000","00000","11110","10001","10001","10001","10001"],
    ["00000","00000","01110","10001","10001","10001","01110"],
    ["00000","00000","10001","10001","10101","10101","01010"],
    ["10001","10001","10001","10001","10001","10001","01110"],
    ["11111","00100","00100","00100","00100","00100","11111"],
  ];
  function pixelPath(index: number) {
    return pixels[index].flatMap((row, y) => Array.from(row, (cell, x) =>
      cell === "1" ? `M${x * 20} ${y * 14}h17v12h-17Z` : "")).join("");
  }
  type Letter = { key: number; label: string; glyph?: (typeof brand)[number]; form?: typeof forms[number] };
  let serial = 6;
  let letters = $state<Letter[]>(
    brand.map((glyph, key) => ({ key, label: glyph.label, glyph })),
  );
  let previous: string | null = null;
  let previousForm = -1;
  let host = $state<HTMLSpanElement>();
  // 用实际字形高度校准，所有几何用字标高度的 em 比例保存。
  let metrics = $state({
    ratio: 1,
    baseline: 1,
    context: null as CanvasRenderingContext2D | null,
  });
  onMount(() => {
    let disposed = false;
    const measure = () => {
      if (disposed || !host) return;
      const style = getComputedStyle(host);
      const context = document.createElement("canvas").getContext("2d");
      if (!context) return;
      context.font = `${style.fontWeight} 100px ${style.fontFamily}`;
      const reference = context.measureText("snowui");
      const height =
        reference.actualBoundingBoxAscent + reference.actualBoundingBoxDescent;
      const ratio = height > 0 ? 100 / height : 1;
      metrics = {
        ratio,
        baseline:
          0.5 +
          ((reference.actualBoundingBoxAscent -
            reference.actualBoundingBoxDescent) *
            ratio) /
            200,
        context,
      };
    };
    measure();
    void document.fonts.ready.then(measure);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      disposed = true;
      document.fonts.removeEventListener("loadingdone", measure);
    };
  });
  const layout = $derived.by(() => {
    const widths = letters.map((letter) =>
      letter.glyph
        ? letter.glyph.advance / 98
        : ((metrics.context?.measureText(letter.label).width ?? 60) *
            metrics.ratio) /
          100,
    );
    const total = widths.reduce((sum, width) => sum + width, 0);
    const rtl = greeting !== null && /[\u0600-\u06ff]/u.test(greeting);
    const start = align === "left" ? 0 : -total / 2;
    let cursor = rtl ? start + total : start;
    return letters.map((letter, index) => {
      if (rtl) cursor -= widths[index];
      const left = cursor;
      if (!rtl) cursor += widths[index];
      return { ...letter, left, width: widths[index] };
    });
  });
  let prefix = 0;
  let changedCount = 6;
  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  const reduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // 与指定文字动效相同的曲线采样；不依赖通用文字动效运行时。
  const stops = [
    0, 0.1052, 0.3155, 0.532, 0.7112, 0.8414, 0.9265, 0.9765, 1.0023, 1.013,
    1.0151, 1.0133, 1.01, 1.0068, 1.0041, 1.0022, 1.001, 1,
  ];
  function easing(t: number) {
    const position = t * (stops.length - 1),
      index = Math.min(Math.floor(position), stops.length - 2);
    return (
      stops[index] + (stops[index + 1] - stops[index]) * (position - index)
    );
  }
  $effect(() => {
    if (greeting === previous && formIndex === previousForm) return;
    const next: Omit<Letter, "key">[] =
      greeting === null
        ? brand.map((glyph) => ({ label: glyph.label, glyph, form: formIndex < 0 ? undefined : forms[formIndex % forms.length] }))
        : Array.from(segmenter.segment(greeting), (part) => ({
            label: part.segment,
          }));
    const same = (a: Letter, b: Omit<Letter, "key">) =>
      a.label === b.label && Boolean(a.glyph) === Boolean(b.glyph) && a.form === b.form;
    prefix = 0;
    while (
      prefix < Math.min(letters.length, next.length) &&
      same(letters[prefix], next[prefix])
    )
      prefix++;
    let suffix = 0;
    while (
      suffix < Math.min(letters.length, next.length) - prefix &&
      same(letters[letters.length - 1 - suffix], next[next.length - 1 - suffix])
    )
      suffix++;
    changedCount = Math.max(
      1,
      letters.length - prefix - suffix,
      next.length - prefix - suffix,
    );
    letters = next.map((part, index) => ({
      ...part,
      key:
        index < prefix
          ? letters[index].key
          : index >= next.length - suffix
            ? letters[letters.length - next.length + index].key
            : serial++,
    }));
    previous = greeting;
    previousForm = formIndex;
  });
  function character(
    node: HTMLElement,
    _: unknown,
    { direction }: { direction: "in" | "out" | "both" },
  ): TransitionConfig {
    const rank = Math.max(0, Number(node.dataset.index) - prefix);
    if (variantMotion) return {
      duration: reduced() ? 0 : 220,
      delay: reduced() ? 0 : rank * 24,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      css: (t, u) => `opacity:${t};transform:scaleX(${1 - .3 * u}) scaleY(${1 - .12 * u});filter:blur(calc(${.045 * u} * var(--snowui-snow-ui-logo-wordmark-drawing-height)))`,
    };
    return {
      duration: reduced() ? 0 : 550,
      delay: reduced() ? 0 : (rank * 550 * 0.3) / changedCount,
      easing,
      css: (t, u) =>
        `opacity:${Math.max(0, Math.min(1, t))};transform:translateY(calc(${(direction === "out" ? -0.35 : 0.35) * u} * var(--snowui-snow-ui-logo-wordmark-drawing-height))) scale(${1 - 0.4 * u}) rotate(${2 * u}deg);filter:blur(calc(${Math.max(0, 0.1 * u)} * var(--snowui-snow-ui-logo-wordmark-drawing-height)))`,
    };
  }
</script>

<span
  bind:this={host}
  class="snowui-logo-letters"
  dir={greeting ? "auto" : "ltr"}
  aria-hidden="true"
>
  {#each layout as letter, index (letter.key)}
    <span
      class="snowui-logo-letter"
      data-index={index}
      data-letter={letter.label}
      data-brand={Boolean(letter.glyph)}
      data-form={letter.form ?? "brand"}
      data-letter-key={letter.key}
      in:character
      out:character
      onintrostart={onmotionstart}
      onoutrostart={onmotionstart}
      onintroend={onmotionend}
      onoutroend={onmotionend}
      style:left={`calc(${align === "left" ? "0%" : "50%"} + ${letter.left} * var(--snowui-snow-ui-logo-wordmark-drawing-height))`}
      style:width={`calc(${letter.width} * var(--snowui-snow-ui-logo-wordmark-drawing-height))`}
    >
      {#if letter.glyph}
        <svg
          viewBox={`${letter.glyph.x} 0 ${letter.glyph.width} 98`}
          style:width={`calc(${letter.glyph.width / 98} * var(--snowui-snow-ui-logo-wordmark-drawing-height))`}
          style:height="var(--snowui-snow-ui-logo-wordmark-drawing-height)"
          overflow="visible"
          fill="none"
        >
          <defs>
            <linearGradient
              id={`${id}-letter-${letter.key}`}
              x1="0%"
              y1="0%"
              x2={letter.glyph.brand ? "0%" : "100%"}
              y2={letter.glyph.brand ? "100%" : "0%"}
            >
              <stop
                stop-color={letter.glyph.brand
                  ? "#FFFFFF"
                  : "var(--white-10, #FFFFFF1A)"}
                stop-opacity={letter.glyph.brand ? 0 : 1}
              />
              <stop
                offset="1"
                stop-color="#FFFFFF"
                stop-opacity={letter.glyph.brand ? 0.4 : 0}
              />
            </linearGradient>
          </defs>
          {#if letter.form === "round" && letter.label === "I"}
            <!-- I 画布较窄，直接在品牌坐标中绘制，避免笔画随字宽压缩。 -->
            <path d={`M${letter.glyph.x + letter.glyph.width / 2} 7.84V90.16`}
              fill="none" stroke="var(--brand, #33D1FF)"
              stroke-width={12 * brand[4].width / 100} stroke-linecap="round" />
          {:else if letter.form === "round" || letter.form === "pixel"}
            <svg x={letter.glyph.x} y="0" width={letter.glyph.width} height="98" viewBox="0 0 100 100" preserveAspectRatio="none" overflow="visible">
              <path d={letter.form === "round" ? roundPaths[index] : pixelPath(index)}
                fill={letter.form === "round" ? "none" : (letter.glyph.brand ? "var(--brand, #33D1FF)" : "var(--black-100, #000000)")}
                stroke={letter.form === "round" ? (letter.glyph.brand ? "var(--brand, #33D1FF)" : "var(--black-100, #000000)") : "none"}
                stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          {:else}
            {#if letter.form === "stripe"}
              <defs><pattern id={`${id}-stripe-${letter.key}`} width="1" height="12" patternUnits="userSpaceOnUse">
                <rect width="1" height="7" fill={letter.glyph.brand ? "var(--brand, #33D1FF)" : "var(--black-100, #000000)"} />
              </pattern></defs>
            {/if}
            <g transform={letter.form === "italic" ? `translate(10 0) skewX(-12)` : undefined}>
              <path
                d={letter.glyph.path}
                fill={letter.form === "outline" ? "none" : letter.form === "stripe" ? `url(#${id}-stripe-${letter.key})` : letter.glyph.brand ? "var(--brand, #33D1FF)" : "var(--black-100, #000000)"}
                stroke={letter.form === "outline" || letter.form === "bold" ? (letter.glyph.brand ? "var(--brand, #33D1FF)" : "var(--black-100, #000000)") : "none"}
                stroke-width={letter.form === "outline" ? 3 : 6}
                stroke-linejoin="round"
                fill-rule="evenodd"
              />
              {#if !letter.form || letter.form === "italic" || letter.form === "bold"}
                <path d={letter.glyph.path} fill={`url(#${id}-letter-${letter.key})`} fill-rule="evenodd" />
              {/if}
            </g>
          {/if}
        </svg>
      {:else}
        <svg
          viewBox={`0 0 ${letter.width * 100} 100`}
          style:width={`calc(${letter.width} * var(--snowui-snow-ui-logo-wordmark-drawing-height))`}
          style:height="var(--snowui-snow-ui-logo-wordmark-drawing-height)"
          overflow="visible"
        >
          <text
            x={/^[\u0600-\u06ff]/u.test(letter.label) ? letter.width * 100 : 0}
            y={metrics.baseline * 100}
            font-size={metrics.ratio * 100}
            fill="currentColor"
            direction={/^[\u0600-\u06ff]/u.test(letter.label) ? "rtl" : "ltr"}
            >{letter.label}</text
          >
        </svg>
      {/if}
    </span>
  {/each}
</span>

<style>
  .snowui-logo-letters {
    display: block;
    width: 100%;
    height: var(--snowui-snow-ui-logo-wordmark-drawing-height);
    position: relative;
    white-space: pre;
    color: var(--black-100);
  }
  .snowui-logo-letter {
    position: absolute;
    top: 0;
    display: inline-flex;
    align-items: center;
    flex: none;
    height: var(--snowui-snow-ui-logo-wordmark-drawing-height);
    line-height: 1;
    transform-origin: center;
    transition: left 550ms
      linear(
        0,
        0.1052,
        0.3155,
        0.532,
        0.7112,
        0.8414,
        0.9265,
        0.9765,
        1.0023,
        1.013,
        1.0151,
        1.0133,
        1.01,
        1.0068,
        1.0041,
        1.0022,
        1.001,
        1
      );
  }
  .snowui-logo-letter[data-brand="true"] { transition: none; }
  @media (prefers-reduced-motion: reduce) {
    .snowui-logo-letter {
      transition: none;
    }
  }
  svg {
    display: block;
    flex: none;
  }
</style>
