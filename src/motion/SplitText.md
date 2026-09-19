# SplitText.svelte 文档

> **版本**: v2.0.0
> **职责**: 文字拆分工具，**只负责拆分**，编排和动效由 Motion 系统控制。

## 架构定位

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          动效系统架构                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────┐                                                   │
│   │   SplitText     │                                                   │
│   │   (纯拆分)       │──→ 输出: { chars: Element[], words: Element[] }  │
│   └─────────────────┘                                                   │
│            ↓ 注册元素                                                    │
│   ┌─────────────────┐                                                   │
│   │     Motion      │                                                   │
│   │  (编排+生命周期) │──→ 控制: 顺序、延迟、onStart/onComplete          │
│   └─────────────────┘                                                   │
│            ↓ 触发动效                                                    │
│   ┌─────────────────┐                                                   │
│   │   动效定义       │                                                   │
│   │ (CSS/组件/JS)   │──→ 执行: 渐隐、位移、变形...                      │
│   └─────────────────┘                                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

| 工具 | 职责 | 不负责 |
| :--- | :--- | :--- |
| **SplitText** | 拆分文本、输出元素数组 | 编排、动效、生命周期 |
| **Motion** | 编排、生命周期、触发 | 拆分、具体视觉效果 |
| **动效组件** | 具体视觉效果 | 拆分、编排 |

---

## Props

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| text | string | - | 要拆分的文本内容 |
| by | "chars" \| "words" \| "lines" | "chars" | 拆分模式声明；当前三个值都生成单词与字符节点，不计算行元素。 |
| class | string | "" | 容器 CSS 类名 |
| charClass | string | "split-char" | 字符元素类名 |
| wordClass | string | "split-word" | 单词元素类名 |
| result | SplitResult | undefined | 支持 bind:result；首次挂载后提供 chars、words 与 container，不随 text 更新重新收集，不生成 lines。 |

---

## 输出 (bind:result)

SplitText 通过 `bind:result` 输出拆分结果，供 Motion 使用：

```ts
interface SplitResult {
    /** 所有字符元素 */
    chars: HTMLElement[];
    /** 所有单词元素 */
    words: HTMLElement[];
    /** 所有行元素 (如果 by="lines") */
    lines?: HTMLElement[];
    /** 容器元素 */
    container: HTMLElement | null;
}
```

---

## CSS 变量输出

| 变量 | 作用域 | 描述 |
| :--- | :--- | :--- |
| `--char-index` | 字符 `<span>` | 字符索引 (0-based) |
| `--char-total` | 容器 | 总字符数 |
| `--word-index` | 单词 `<span>` | 单词索引 (0-based) |
| `--word-total` | 容器 | 总单词数 |

---

## 使用示例

### 基础拆分

```svelte
<SplitText text="Hello World" />
```

### 与 Motion 结合使用

```svelte
<script>
    import { SplitText } from "../motion/SplitText.svelte";
    import { getMotion } from "../logic/motion.svelte";
    
    const motion = getMotion();
    let result = $state();
    
    // 拆分完成后，向 Motion 注册元素组
    $effect(() => {
        if (result?.chars?.length > 0) {
            motion.registerGroup("hero-text", result.chars, {
                orchestrateMode: "sequential",
                orchestrateDelay: 50,
                orchestrateOrder: "ltr",
                whileAppear: { opacity: [0, 1], y: [20, 0] },
                onStart: () => console.log("动效开始"),
                onComplete: () => console.log("动效结束")
            });
        }
    });
</script>

<SplitText text="Welcome" bind:result />
```

### 手动控制播放

```svelte
<script>
    // ... 注册代码同上 ...
    
    function playAnimation() {
        motion.Play("hero-text");
    }
    
    function reverseAnimation() {
        motion.Play("hero-text", { reverse: true });
    }
</script>

<button onclick={playAnimation}>播放</button>
<button onclick={reverseAnimation}>反向播放</button>
```

---

## 输出 HTML 结构

### 输入
```svelte
<SplitText text="Hi" by="chars" />
```

### 输出
```html
<span class="split-text" style="--char-total: 2; --word-total: 1">
    <span class="split-word" style="--word-index: 0">
        <span class="split-char" style="--char-index: 0">H</span>
        <span class="split-char" style="--char-index: 1">i</span>
    </span>
</span>
```

---

## Action 模式 (use:splitText)

对于已有组件（如 Text），提供 Action 模式：

```svelte
<script>
    import { splitText } from "../motion/splitText.ts";
</script>

<Text use:splitText={{ by: "chars" }}>
    这是一段文字
</Text>
```

Action 会在 DOM 挂载后拆分文本，通过 onSplit 回调输出结果；不会自动向 Motion 注册。Action 应挂载到原生 DOM 元素，不使用组件上的 use 指令。

---

## 注意事项

1. **职责单一**: SplitText **不处理编排和动效**，只输出拆分结果
2. **与 Motion 配合**: 使用 `motion.registerGroup()` 注册元素
3. **生命周期**: 由 Motion 的 `onStart/onComplete` 回调控制
4. **Unicode 支持**: 按 Unicode 码点拆分；组合字符和多码点 emoji 不保证作为一个完整字素保留
5. **无障碍**: 保留 `aria-label` 确保屏幕阅读器可读


## Site guide: split-text

<!-- site-guide:split-text -->
Split text into character and word elements for custom motion.

### When to use SplitText {#when-to-use}

Use SplitText when you need direct access to character or word elements. It does not animate them. Use FlowText for ready-made text transitions, or FramePro to coordinate motion.

### Import {#import}

SplitText is available from the PRO package.

```ts
import { SplitText } from '@snowui/components-pro';
```

### Split text {#split-text}

Pass plain text. The component creates word wrappers containing character spans, and keeps the original text in aria-label. Whitespace is normalized to a single space between words.

```svelte
<script lang="ts">
  import { SplitText } from '@snowui/components-pro';
</script>

<SplitText text="Build with SnowUI" />
```

### Read the elements {#result}

Bind result to access chars, words, and container after mounting. Register the elements with your motion system and clean up its animations when the content unmounts.

```svelte
<script lang="ts">
  import { SplitText } from '@snowui/components-pro';

  let result = $state<{
    chars: HTMLElement[];
    words: HTMLElement[];
    lines?: HTMLElement[];
    container: HTMLElement | null;
  }>();
</script>

<SplitText text="Build with SnowUI" bind:result />
```

### Element indices {#indices}

Character spans expose --char-index and word wrappers expose --word-index, both starting at zero. The container exposes --char-total and --word-total. These values describe the split; they do not start an animation.

### Current limits {#limits}

The by property accepts chars, words, and lines, but currently all three produce the same character and word structure. Line measurement and result.lines are not implemented.

The component collects result once after mounting. If the text changes and you need fresh element references, remount it with a Svelte keyed block. Splitting uses Unicode code points, not grapheme clusters, so combined emoji and accented sequences may be separated.

```svelte
{#key text}
  <SplitText {text} bind:result />
{/key}
```

### Next steps {#next-steps}

- [Animate text with FlowText](/components/flow-text)
- [Coordinate motion with FramePro](/components/frame-pro)
- [Quick Start](/components/quick-start)

<!-- /site-guide:split-text -->
