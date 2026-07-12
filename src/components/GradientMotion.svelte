<!--
  GradientMotion 渐变动效图组件
  v4.0.0

  职责：按 glimm.dev / glimm@0.1.4 还原 shader sweep 渐变效果。
  文档：./GradientMotion.md
-->

<script module lang="ts">
    export type GradientMotionVariant =
        | "prism"
        | "berry"
        | "lagoon"
        | "citrus"
        | "azure"
        | "ember"
        | "avatar"
        | "random"
        | "cosmic"
        | "matrix"
        | "electric"
        | "inferno"
        | "mystic"
        | "cyber"
        | "neon"
        | "plasma"
        | "neatBlob";

    export type GradientMotionDirection = "ltr" | "rtl" | "ttb" | "btt";
    export type GradientMotionColors = readonly [string, string, string, string];
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import FramePro, {
        type FrameProps,
        type LoopMotionConfig,
    } from "./FramePro.svelte";

    interface Props extends FrameProps {
        variant?: GradientMotionVariant;
        seed?: string | number;
        speed?: number;
        duration?: number;
        size?: number | string;
        width?: number | string;
        height?: number | string;
        radius?: number | string;
        intensity?: number;
        paused?: boolean;
        decorative?: boolean;
        direction?: GradientMotionDirection;
        bandTight?: number;
        waveAmount?: number;
        rippleAmount?: number;
        brightness?: number;
        colorSpeed?: number;
        highlightIntensity?: number;
        colors?: GradientMotionColors;
        loopMotion?: LoopMotionConfig;
        [key: string]: any;
    }

    type Vec3 = [number, number, number];
    type GlimmPreset = (typeof GLIMM_PRESETS)[number];
    type GlimmPalette = {
        a: Vec3;
        b: Vec3;
        c: Vec3;
        d: Vec3;
    };

    const GLIMM_PRESETS = [
        "prism",
        "berry",
        "lagoon",
        "citrus",
        "azure",
        "ember",
    ] as const;

    const LEGACY_VARIANT_MAP: Record<
        Exclude<GradientMotionVariant, GlimmPreset | "avatar" | "random">,
        GlimmPreset
    > = {
        cosmic: "prism",
        matrix: "lagoon",
        electric: "azure",
        inferno: "ember",
        mystic: "berry",
        cyber: "lagoon",
        neon: "citrus",
        plasma: "berry",
        neatBlob: "ember",
    };

    const PALETTES: Record<GlimmPreset, GlimmPalette> = {
        prism: {
            a: [0.46, 0.88, 0.33],
            b: [0.6, 0.58, 0.74],
            c: [0.5, 0.5, 0.5],
            d: [0.54, 0.22, 0.84],
        },
        berry: {
            a: [0.92, 0.36, 0.56],
            b: [0.1, 0.14, 0.37],
            c: [0.5, 0.5, 0.5],
            d: [0.84, 0.11, 0.5],
        },
        lagoon: {
            a: [0.58, 0.64, 0.52],
            b: [0.64, 0.3, 0.5],
            c: [0.5, 0.5, 0.5],
            d: [0.37, 0.66, 0.89],
        },
        citrus: {
            a: [0.55, 0.61, 0.61],
            b: [0.54, 0.41, 0.63],
            c: [0.5, 0.5, 0.5],
            d: [0.66, 0.92, 0.23],
        },
        azure: {
            a: [0.13, 0.61, 1],
            b: [0.15, 0.14, 0],
            c: [0.5, 0.5, 0.5],
            d: [0.29, 0.98, 0.74],
        },
        ember: {
            a: [0.83, 0.61, 0.6],
            b: [0.2, 0.41, 0.62],
            c: [0.5, 0.5, 0.5],
            d: [0.73, 0.05, 0.36],
        },
    };

    const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

    const FRAGMENT_SHADER = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_progress;
uniform float u_alpha;
uniform float u_band_tight;
uniform float u_pos_start;
uniform float u_pos_end;
uniform float u_hue_shift;
uniform float u_direction;
uniform float u_wave_amount;
uniform float u_ripple_amount;
uniform float u_wave_speed;
uniform float u_brightness;
uniform float u_swell_amount;
uniform float u_continuous_fill;
uniform float u_avatar_mode;
uniform vec3 u_palette_a;
uniform vec3 u_palette_b;
uniform vec3 u_palette_c;
uniform vec3 u_palette_d;
uniform float u_custom_palette;
uniform float u_color_speed;
uniform float u_highlight_intensity;
uniform vec3 u_color_0;
uniform vec3 u_color_1;
uniform vec3 u_color_2;
uniform vec3 u_color_3;

#define PI 3.14159265359

vec3 pal(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
    return a + b * cos(2.0 * PI * (c * t + d));
}

vec3 customPal(in float t) {
    float angle = 2.0 * PI * fract(t);
    vec3 mean = (u_color_0 + u_color_1 + u_color_2 + u_color_3) * 0.25;
    vec3 cosineTerm = (u_color_0 - u_color_2) * 0.5;
    vec3 sineTerm = (u_color_1 - u_color_3) * 0.5;
    return clamp(
        mean + cosineTerm * cos(angle) + sineTerm * sin(angle),
        0.0,
        1.0
    );
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float axis = mix(uv.x, uv.y, u_direction);
    float cross = mix(uv.y, uv.x, u_direction);
    float avatarMix = step(0.5, u_avatar_mode);
    float sweepPos = u_pos_start + u_progress * (u_pos_end - u_pos_start);
    float pos = mix(sweepPos, 0.5, avatarMix);
    float tw = u_time * mix(u_wave_speed, 1.0, avatarMix);

    float waveX =
        sin(cross * 6.0 + tw * 1.3) * 0.020
        + sin(cross * 13.0 - tw * 0.9 + 1.4) * 0.012
        + sin(cross * 21.0 + tw * 1.7 + 2.6) * 0.006;
    waveX *= u_wave_amount;
    waveX += (
        sin(axis * 18.0 - tw * 0.8) * 0.005
        + sin(axis * 31.0 + tw * 1.1 + 0.9) * 0.003
    ) * u_ripple_amount;

    float avatarSway =
        sin(tw * 0.72 + cross * 2.4) * 0.045
        + sin(tw * 0.41 - cross * 3.1 + 1.7) * 0.025;
    avatarSway *= u_wave_amount;
    float d = (axis - pos) - waveX - avatarSway * avatarMix;
    float band = exp(-d * d * u_band_tight);
    float dhDaxis = -2.0 * d * u_band_tight * band;

    vec2 slope;
    slope.x = mix(dhDaxis, 0.0, u_direction);
    slope.y = mix(0.0, dhDaxis, u_direction);
    vec3 normal = normalize(vec3(-slope.x * 0.18, slope.y * 0.18, 1.0));

    float trail = clamp(0.5 - d * 1.3, 0.0, 1.0);
    trail = pow(trail, 2.5) * 0.30;
    float intensity = max(band * 0.95, trail);
    float edgeFade = smoothstep(0.0, 0.015, cross)
        * smoothstep(1.0, 0.985, cross);
    float vfade = mix(edgeFade, 1.0, avatarMix);

    float colorSway =
        sin(tw * 0.53 + 0.8) * 0.035
        + sin(tw * 0.31 + cross * 3.0) * 0.018;
    float hueDrift = mix(u_time * 0.04, colorSway, avatarMix);
    float t = normal.x * 0.45 + normal.y * 0.30
        + axis * 1.4 + cross * 0.35
        + u_hue_shift + hueDrift;
    vec3 cosineColor = pal(t, u_palette_a, u_palette_b, u_palette_c, u_palette_d);
    float customColorPhase = t * 0.5 + u_time * 0.04 * u_color_speed;
    vec3 customColor = customPal(customColorPhase);
    float customLow = min(customColor.r, min(customColor.g, customColor.b));
    float customHigh = max(customColor.r, max(customColor.g, customColor.b));
    vec3 vividCustomColor = (customColor - vec3(customLow))
        / max(customHigh - customLow, 0.001) * customHigh;
    customColor = mix(customColor, vividCustomColor, 0.25);
    vec3 color = mix(cosineColor, customColor, u_custom_palette);
    float customIntensityGain = clamp(0.6 + u_alpha * 0.4, 0.0, 2.0);
    color *= mix(1.0, customIntensityGain, u_custom_palette);
    color *= u_brightness;

    vec3 view = vec3(0.0, 0.0, 1.0);
    vec3 light = normalize(vec3(0.35, 0.55, 0.9));
    vec3 halfVector = normalize(light + view);
    float nDotH = clamp(dot(normal, halfVector), 0.0, 1.0);
    float nDotV = clamp(dot(normal, view), 0.0, 1.0);
    float fresnel = pow(1.0 - nDotV, 3.0);
    float specular = pow(nDotH, 80.0);
    float entryFade = mix(0.2, 1.0, 4.0 * u_progress * (1.0 - u_progress));
    if (u_continuous_fill > 0.5) {
        entryFade = 1.0;
    }

    float bodyAlpha = intensity * vfade * u_alpha * entryFade;
    if (u_continuous_fill > 0.5) {
        bodyAlpha = max(bodyAlpha, vfade * u_alpha);
    }
    bodyAlpha = mix(bodyAlpha, min(bodyAlpha, 1.0), u_custom_palette);
    vec3 body = color * bodyAlpha;
    float highlightMask = band * vfade * u_alpha * entryFade
        * u_swell_amount * u_highlight_intensity;
    vec3 highlight = (color * fresnel * 0.55 + vec3(specular) * 1.1) * highlightMask;
    float highlightAlpha = (fresnel * 0.4 + specular * 0.9) * highlightMask;

    gl_FragColor = vec4(body + highlight, min(bodyAlpha + highlightAlpha, 1.0));
}
`;

    let {
        variant = "prism",
        seed = undefined,
        speed = 1,
        duration = 800,
        size = undefined,
        width = undefined,
        height = undefined,
        radius = "inherit",
        intensity = 1,
        paused = false,
        decorative = true,
        direction = "ltr",
        bandTight = 14,
        waveAmount = 1,
        rippleAmount = 1,
        brightness = 1,
        colorSpeed = 1,
        highlightIntensity = 1,
        colors = undefined,
        loopMotion = undefined,
        class: className = "",
        style = "",
        renderHints: userRenderHints = undefined,
        role = undefined,
        "aria-label": ariaLabel = undefined,
        ...rest
    }: Props = $props();

    let canvasElement = $state<HTMLCanvasElement>();
    let webglReady = $state(true);
    const generatedSeed = Math.floor(Math.random() * 100000);

    function toCssSize(value: number | string | undefined) {
        if (value === undefined || value === null || value === "") return "";
        return typeof value === "number" ? `${value / 16}rem` : value;
    }

    function hashSeed(value: string | number | undefined) {
        if (value === undefined) return generatedSeed;
        const text = String(value);
        let hash = 0;
        for (let i = 0; i < text.length; i += 1) {
            hash = (hash * 31 + text.charCodeAt(i)) | 0;
        }
        return Math.abs(hash);
    }

    function parseHexColor(value: string): Vec3 | null {
        const match = value.trim().match(/^#([0-9a-f]{6})$/i);
        if (!match) return null;
        const hex = match[1];
        return [
            Number.parseInt(hex.slice(0, 2), 16) / 255,
            Number.parseInt(hex.slice(2, 4), 16) / 255,
            Number.parseInt(hex.slice(4, 6), 16) / 255,
        ];
    }

    function createShader(
        gl: WebGLRenderingContext,
        type: number,
        source: string,
    ) {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    function createProgram(gl: WebGLRenderingContext) {
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
        const fragmentShader = createShader(
            gl,
            gl.FRAGMENT_SHADER,
            FRAGMENT_SHADER,
        );
        if (!vertexShader || !fragmentShader) return null;

        const program = gl.createProgram();
        if (!program) return null;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    function resolveDirection(current: GradientMotionDirection) {
        if (current === "rtl") return { axis: 0, start: 1.2, end: -0.2 };
        if (current === "ttb") return { axis: 1, start: -0.2, end: 1.2 };
        if (current === "btt") return { axis: 1, start: 1.2, end: -0.2 };
        return { axis: 0, start: -0.2, end: 1.2 };
    }

    function clampNumber(value: number, fallback: number, min: number, max: number) {
        if (!Number.isFinite(value)) return fallback;
        return Math.min(max, Math.max(min, value));
    }

    const safeSpeed = $derived.by(() => {
        const current = Number(speed);
        if (!Number.isFinite(current) || current <= 0) return 1;
        return current;
    });
    const safeDuration = $derived.by(() => {
        const current = Number(duration);
        if (!Number.isFinite(current) || current <= 0) return 800;
        return current;
    });
    const isAvatarVariant = $derived(
        variant === "avatar" || rest.as === "avatar-image",
    );
    const resolvedVariant = $derived.by<GlimmPreset>(() => {
        if (
            variant === "random" ||
            variant === "avatar" ||
            (rest.as === "avatar-image" && variant === "prism")
        ) {
            return GLIMM_PRESETS[hashSeed(seed) % GLIMM_PRESETS.length];
        }
        if (GLIMM_PRESETS.includes(variant as GlimmPreset)) {
            return variant as GlimmPreset;
        }
        return LEGACY_VARIANT_MAP[
            variant as Exclude<
                GradientMotionVariant,
                GlimmPreset | "avatar" | "random"
            >
        ] ?? "prism";
    });
    const resolvedPalette = $derived(PALETTES[resolvedVariant]);
    const resolvedColors = $derived.by<Vec3[] | null>(() => {
        if (!colors || colors.length !== 4) return null;
        const parsed = colors.map(parseHexColor);
        return parsed.every((color): color is Vec3 => color !== null)
            ? parsed
            : null;
    });
    const resolvedSpeed = $derived(safeSpeed * (isAvatarVariant ? 0.2 : 1));
    const resolvedDuration = $derived(safeDuration / resolvedSpeed);
    const resolvedIntensity = $derived.by(() =>
        clampNumber(Number(intensity), 1, 0, 20),
    );
    const resolvedBandTight = $derived.by(() =>
        clampNumber(Number(bandTight), 14, 1, 60),
    );
    const resolvedWaveAmount = $derived.by(() =>
        clampNumber(Number(waveAmount), 1, 0, 20),
    );
    const resolvedRippleAmount = $derived.by(() =>
        clampNumber(Number(rippleAmount), 1, 0, 20),
    );
    const resolvedBrightness = $derived.by(() =>
        clampNumber(Number(brightness), 1, 0, 20),
    );
    const resolvedColorSpeed = $derived.by(() =>
        clampNumber(Number(colorSpeed), 1, 0, 20),
    );
    const resolvedHighlightIntensity = $derived.by(() =>
        clampNumber(Number(highlightIntensity), 1, 0, 20),
    );
    const resolvedWidth = $derived(toCssSize(width ?? size ?? "100%"));
    const resolvedHeight = $derived(toCssSize(height ?? size ?? "100%"));
    const resolvedRadius = $derived(toCssSize(radius) || "inherit");
    const resolvedDirection = $derived(resolveDirection(direction));

    const resolvedLoopMotion = $derived.by(() => {
        const base: LoopMotionConfig = {
            duration: resolvedDuration,
            easing: "linear",
            iterationCount: "infinite",
            direction: "normal",
            playState: paused ? "paused" : "running",
        };
        if (!loopMotion || typeof loopMotion !== "object") return base;
        return {
            ...base,
            ...loopMotion,
            duration: loopMotion.duration ?? base.duration,
            playState: paused ? "paused" : (loopMotion.playState ?? base.playState),
        };
    });

    const rootStyle = $derived.by(() => {
        const styles = [
            `--snowui-gradient-motion-width: ${resolvedWidth}`,
            `--snowui-gradient-motion-height: ${resolvedHeight}`,
            `--snowui-gradient-motion-radius: ${resolvedRadius}`,
            style,
        ]
            .filter(Boolean)
            .join("; ");
        return styles || undefined;
    });

    const gradientRenderHints = $derived({
        variant: userRenderHints?.variant ?? "rect",
        width: userRenderHints?.width ?? resolvedWidth,
        height: userRenderHints?.height ?? resolvedHeight,
        radius: userRenderHints?.radius ?? resolvedRadius,
    });

    onMount(() => {
        const canvas = canvasElement;
        if (!canvas) return;

        const gl = canvas.getContext("webgl", {
            alpha: true,
            antialias: false,
            depth: false,
            stencil: false,
            premultipliedAlpha: true,
            preserveDrawingBuffer: false,
        });
        const program = gl ? createProgram(gl) : null;
        if (!gl || !program) {
            webglReady = false;
            return;
        }

        const positionLocation = gl.getAttribLocation(program, "a_position");
        const positionBuffer = gl.createBuffer();
        if (!positionBuffer) {
            webglReady = false;
            return;
        }

        const uniforms = {
            resolution: gl.getUniformLocation(program, "u_resolution"),
            time: gl.getUniformLocation(program, "u_time"),
            progress: gl.getUniformLocation(program, "u_progress"),
            alpha: gl.getUniformLocation(program, "u_alpha"),
            bandTight: gl.getUniformLocation(program, "u_band_tight"),
            posStart: gl.getUniformLocation(program, "u_pos_start"),
            posEnd: gl.getUniformLocation(program, "u_pos_end"),
            hueShift: gl.getUniformLocation(program, "u_hue_shift"),
            direction: gl.getUniformLocation(program, "u_direction"),
            waveAmount: gl.getUniformLocation(program, "u_wave_amount"),
            rippleAmount: gl.getUniformLocation(program, "u_ripple_amount"),
            waveSpeed: gl.getUniformLocation(program, "u_wave_speed"),
            brightness: gl.getUniformLocation(program, "u_brightness"),
            swellAmount: gl.getUniformLocation(program, "u_swell_amount"),
            continuousFill: gl.getUniformLocation(program, "u_continuous_fill"),
            avatarMode: gl.getUniformLocation(program, "u_avatar_mode"),
            paletteA: gl.getUniformLocation(program, "u_palette_a"),
            paletteB: gl.getUniformLocation(program, "u_palette_b"),
            paletteC: gl.getUniformLocation(program, "u_palette_c"),
            paletteD: gl.getUniformLocation(program, "u_palette_d"),
            customPalette: gl.getUniformLocation(program, "u_custom_palette"),
            colorSpeed: gl.getUniformLocation(program, "u_color_speed"),
            highlightIntensity: gl.getUniformLocation(program, "u_highlight_intensity"),
            color0: gl.getUniformLocation(program, "u_color_0"),
            color1: gl.getUniformLocation(program, "u_color_1"),
            color2: gl.getUniformLocation(program, "u_color_2"),
            color3: gl.getUniformLocation(program, "u_color_3"),
        };

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            gl.STATIC_DRAW,
        );
        gl.useProgram(program);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        let frame = 0;
        let lastTime = performance.now();
        let elapsed = (hashSeed(seed) % 1000) / 1000;
        let shaderTime = (hashSeed(seed) % 1000) / 1000;
        const hueShift = (hashSeed(seed) % 400) / 1000;

        function resize() {
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
            const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                gl.viewport(0, 0, width, height);
            }
            gl.uniform2f(uniforms.resolution, width, height);
        }

        function render(now: number) {
            resize();
            const deltaSeconds = (now - lastTime) / 1000;
            if (!paused) {
                elapsed += (deltaSeconds * 1000) / resolvedDuration;
                shaderTime += deltaSeconds * resolvedSpeed;
            }
            lastTime = now;

            const progress = elapsed - Math.floor(elapsed);
            const time = shaderTime;
            const palette = resolvedPalette;
            const customColors = resolvedColors;
            const currentDirection = resolvedDirection;

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(program);
            gl.uniform1f(uniforms.time, time);
            gl.uniform1f(uniforms.progress, progress);
            gl.uniform1f(uniforms.alpha, resolvedIntensity);
            gl.uniform1f(uniforms.bandTight, resolvedBandTight);
            gl.uniform1f(uniforms.posStart, currentDirection.start);
            gl.uniform1f(uniforms.posEnd, currentDirection.end);
            gl.uniform1f(uniforms.hueShift, hueShift);
            gl.uniform1f(uniforms.direction, currentDirection.axis);
            gl.uniform1f(uniforms.waveAmount, resolvedWaveAmount);
            gl.uniform1f(uniforms.rippleAmount, resolvedRippleAmount);
            gl.uniform1f(uniforms.waveSpeed, resolvedSpeed);
            gl.uniform1f(uniforms.brightness, resolvedBrightness);
            gl.uniform1f(uniforms.swellAmount, 0.55);
            gl.uniform1f(uniforms.continuousFill, isAvatarVariant ? 1 : 0);
            gl.uniform1f(uniforms.avatarMode, isAvatarVariant ? 1 : 0);
            gl.uniform3f(uniforms.paletteA, palette.a[0], palette.a[1], palette.a[2]);
            gl.uniform3f(uniforms.paletteB, palette.b[0], palette.b[1], palette.b[2]);
            gl.uniform3f(uniforms.paletteC, palette.c[0], palette.c[1], palette.c[2]);
            gl.uniform3f(uniforms.paletteD, palette.d[0], palette.d[1], palette.d[2]);
            gl.uniform1f(uniforms.customPalette, customColors ? 1 : 0);
            gl.uniform1f(uniforms.colorSpeed, resolvedColorSpeed);
            gl.uniform1f(uniforms.highlightIntensity, resolvedHighlightIntensity);
            const fallbackColors: Vec3[] = [palette.a, palette.b, palette.c, palette.d];
            const activeColors = customColors ?? fallbackColors;
            gl.uniform3f(uniforms.color0, activeColors[0][0], activeColors[0][1], activeColors[0][2]);
            gl.uniform3f(uniforms.color1, activeColors[1][0], activeColors[1][1], activeColors[1][2]);
            gl.uniform3f(uniforms.color2, activeColors[2][0], activeColors[2][1], activeColors[2][2]);
            gl.uniform3f(uniforms.color3, activeColors[3][0], activeColors[3][1], activeColors[3][2]);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            frame = requestAnimationFrame(render);
        }

        webglReady = true;
        frame = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(frame);
            gl.deleteBuffer(positionBuffer);
            gl.deleteProgram(program);
        };
    });
</script>

<FramePro
    enableResponsive={false}
    enableContext={false}
    enableScaleObserver={false}
    enableDefaultMotion={false}
    enableAutoLayout={false}
    class={[
        "snowui-gradient-motion",
        `snowui-gradient-motion-${resolvedVariant}`,
        isAvatarVariant ? "snowui-gradient-motion-avatar" : "",
        !webglReady ? "snowui-gradient-motion-fallback-active" : "",
        paused ? "snowui-gradient-motion-paused" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ")}
    style={rootStyle}
    loopMotion={resolvedLoopMotion}
    role={decorative ? undefined : (role ?? "img")}
    aria-label={decorative ? undefined : ariaLabel}
    aria-hidden={decorative ? "true" : undefined}
    renderHints={gradientRenderHints}
    {...rest}
>
    <canvas
        bind:this={canvasElement}
        class="snowui-gradient-motion-canvas"
        aria-hidden="true"
    ></canvas>
    {#if !webglReady}
        <div class="snowui-gradient-motion-fallback" aria-hidden="true"></div>
    {/if}
</FramePro>

<style>
    :global(:where(.snowui-gradient-motion)) {
        position: relative;
        display: inline-flex;
        flex-shrink: 0;
        width: var(
            --snowui-gradient-motion-size-override,
            var(--snowui-gradient-motion-width, 100%)
        );
        height: var(
            --snowui-gradient-motion-size-override,
            var(--snowui-gradient-motion-height, 100%)
        );
        min-width: 0;
        min-height: 0;
        gap: 0;
        overflow: hidden;
        isolation: isolate;
        border-radius: var(
            --snowui-gradient-motion-radius-override,
            var(--snowui-gradient-motion-radius, inherit)
        );
        background: transparent;
        box-sizing: border-box;
        transform: translateZ(0);
    }

    :global(:where(.snowui-gradient-motion-canvas)) {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        border-radius: inherit;
    }

    :global(:where(.snowui-gradient-motion-fallback)) {
        position: absolute;
        inset: -20%;
        border-radius: inherit;
        background:
            linear-gradient(
                90deg,
                transparent 0%,
                rgba(255, 61, 192, 0.55) 38%,
                rgba(31, 200, 255, 0.96) 50%,
                rgba(194, 255, 61, 0.55) 62%,
                transparent 100%
            );
        filter: saturate(1.35) contrast(1.1);
        animation-name: snowui-gradient-motion-fallback;
        animation-duration: var(--snowui-frame-loop-motion-duration, 800ms);
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-play-state: var(
            --snowui-frame-loop-motion-play-state,
            running
        );
    }

    :global(:where(.snowui-gradient-motion-avatar .snowui-gradient-motion-fallback)) {
        inset: -18%;
        background:
            radial-gradient(
                circle at 24% 34%,
                rgba(255, 61, 192, 0.55),
                rgba(255, 61, 192, 0) 42%
            ),
            radial-gradient(
                circle at 72% 42%,
                rgba(31, 200, 255, 0.72),
                rgba(31, 200, 255, 0) 44%
            ),
            linear-gradient(
                90deg,
                rgba(209, 186, 255, 0.86) 0%,
                rgba(255, 207, 102, 0.92) 42%,
                rgba(194, 255, 61, 0.9) 58%,
                rgba(110, 224, 255, 0.88) 100%
            );
        animation-duration: var(--snowui-frame-loop-motion-duration, 4000ms);
        animation-name: snowui-gradient-motion-avatar-fallback;
        animation-timing-function: ease-in-out;
        animation-direction: alternate;
    }

    :global(:where(.snowui-gradient-motion-paused .snowui-gradient-motion-fallback)) {
        animation-play-state: paused;
    }

    @keyframes snowui-gradient-motion-fallback {
        0% {
            transform: translateX(-65%) skewX(-7deg);
        }
        100% {
            transform: translateX(65%) skewX(7deg);
        }
    }

    @keyframes snowui-gradient-motion-avatar-fallback {
        0% {
            transform: translate3d(-3%, -1.5%, 0) scale(1.04) skewX(-2deg);
        }
        100% {
            transform: translate3d(3%, 1.5%, 0) scale(1.04) skewX(2deg);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-gradient-motion-fallback)) {
            animation-duration: 1ms;
            animation-iteration-count: 1;
        }
    }
</style>
