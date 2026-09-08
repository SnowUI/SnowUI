# ScrambleText 代码文字动效

> **版本**: v1.3.0  
> **组件路径**: `pro/src/components/ScrambleText.svelte`  
> **包归属**: PRO

`ScrambleText` 提供字符扰动、循环并归位到目标文字的动效。默认使用 `cascade`，动效速度和字符错峰由组件内部统一维护。

## 关键字

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `text` | `string \| number` | `""` | 最终文字 |
| `charset` | `"glyphs" \| "symbols" \| "numbers"` | `"glyphs"` | 预设替换字符集 |
| `customSequence` | `string` | `undefined` | 自定义替换序列，最多 64 个 grapheme |
| `mode` | `"scramble" \| "cascade"` | `"cascade"` | 离散动效模式 |
| `respectMotionPreference` | `boolean` | `false` | 显式开启后才遵循系统减少动效设置 |
| `font` | `string` | `undefined` | 字体 |
| `size` | `string \| number` | `undefined` | 字号 |
| `weight` | `string \| number` | `undefined` | 字重 |
| `lineHeight` | `string \| number` | `undefined` | 行高 |
| `color` | `SnowUIColor \| string` | `undefined` | 最终文字颜色 |
| `align` | `"left" \| "center" \| "right" \| "justify"` | `undefined` | 对齐；默认继承父级 |
| `motionColor` | `SnowUIColor \| string` | `undefined` | 扰动阶段的临时颜色；默认不改变颜色 |
| `...rest` | `FrameProps` | - | 透传到根 `FramePro`，包括 `as="label"` |

```svelte
<ScrambleText
    text="DEPLOY READY"
    charset="glyphs"
    font="--font-mono"
    size="--text-24"
    weight={600}
    color="Primary"
    motionColor="Indigo"
/>
```

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 实现约束

- 排版默认继承容器，基线与同字体、字号的普通文字对齐；滚动层和裁切边界遵循 [TextMotionSpec §2](../../../specs/TextMotionSpec.md#2-统一排版与颜色)。

- 主布局模型为内禀原子布局，根层为 `FramePro`。
- 根 `FramePro` 的 `enableDefaultMotion` 默认保持 `true`；扰动动画只更新内部输出层，显式 `while*` 与父级编排可继续控制组件整体。
- 排版、语意色、变化色与减少动效判断复用 `../lib/text-motion/`。
- `cascadeSpeed`、`cascadeDelay`、`duration`、`settleDuration` 等时序不得公开。
- `customSequence` 是内容语义，不是动效速度调参，可以保留。

## 更新日志

### v1.3.0 (2026-06-15)

- `motionColor` 默认改为 `undefined`，未显式设置时不改变文字颜色。

### v1.2.0 (2026-06-14)

- 根 `FramePro` 默认启用 Frame 默认动效，内部扰动动画与组件级 `while*` / 父级编排并行工作。

### v1.1.0 (2026-06-14)

- 统一六项排版 Props 与 `motionColor`。
- 将 cascade 时序完全内部化。
- `respectMotionPreference` 默认 `false`。

### v1.0.0 (2026-06-11)

- 新增 ScrambleText PRO 组件。
