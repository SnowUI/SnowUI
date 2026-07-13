# CodeBlock.svelte

## 内置组件双模式

- `parts.Indicator`：配置内置 resize Indicator。
- 需要替换手柄结构时使用文档既有 Indicator `as` 职责；外置显式 Props 高于 part。

> **版本**: v1.4.7
> **更新**: 2026-07-08
> **布局模型**: 复合管理布局（Composite Management Layout）
> **文档**: ./CodeBlock.md

代码块组件，支持语法显示、基础语法着色、行号、复制到剪贴板与全屏放大。全屏放大/缩小使用 Frame controller 的共享元素 FLIP 布局转场；图标切换动效使用 `REPLACEMENT_APPEAR_MOTION`，避免继承浮层类动效语义。


> **以下内容供 AI 阅读，用户可忽略。**

---

## 关键字速查

| 类别 | 关键字 |
|:---|:---|
| **内容** | `code`, `language`, `children` |
| **功能开关** | `showLanguage`, `showLineNumbers`, `showCopyButton`, `showExpandButton` |
| **布局** | `visibleLines`, 拖拽高度 |
| **行为** | `copyTimeout`；复制能力由默认内置 CopyButton 承担 |
| **默认内置组件** | `parts.CopyButton` 配置内置 bare CopyButton；`parts.ExpandButton` 配置内置 bare ExpandButton；`parts.Indicator` 配置缩放手柄 |
| **外置 Icon 槽位** | `as="trailing"`；兼容 `data-as="copy-icon"`, `data-as="copied-icon"`, `data-as="expand-icon"`, `data-as="collapse-icon"`，前两者映射到 CopyButton icon/successIcon |
| **Frame 透传** | `class`, `style`, `...rest` |

---

## Props

| 关键字 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| `code` | `string` | `""` | 要显示的代码字符串 |
| `language` | `string` | — | 语言标识，显示在工具栏（如 `"tsx"`, `"css"`） |
| `showLanguage` | `boolean` | `true` | 是否显示语言标识 |
| `showLineNumbers` | `boolean` | `false` | 是否显示代码行号。全屏模式下强制显示 |
| `showCopyButton` | `boolean` | `true` | 是否显示复制按钮 |
| `showExpandButton` | `boolean` | `true` | 是否显示全屏放大按钮 |
| `visibleLines` | `number` | `15` | 默认状态最多显示几行代码；内容不足时自适应高度，超出后滚动；全屏模式不受此限制 |
| `copyTimeout` | `number` | `2000` | 复制成功图标（Check）的停留时长（ms），超时后恢复 Copy 图标 |
| `children` | `Snippet` | — | 代码内容或附件源；纯文本会作为代码，`as="trailing"` 会替换右侧动作区 |
| `...rest` | — | — | 透传至根 Frame（class、style、动效关键字等） |

---

## 语法着色

当使用 `code` prop 时，组件内置轻量语法着色规则，覆盖 JS / TS / JSON / HTML / CSS 常见 token。规则来自参考仓库中 `shiki` / `rehype-pretty-code` 的高亮分层思路，但当前实现不新增依赖。

颜色按 Figma 设计稿固定写死，并已在 `scripts/check-standards.js` 中登记为 `CodeBlock.svelte` 例外：

| token | 颜色 |
|:---|:---|
| 背景 | `--background-2` |
| 默认文本 / 标点 | `--black-100` |
| 行号 | `--black-20` |
| 注释 / 灰色代码 | `--black-40` |
| 语言标识 | `--black-40` |
| 按钮区 | `--black-100` × `opacity: 0.4`（视觉等同 `--black-40`） |
| 关键字 / 数字 / literal | `#ff32c6` |
| 函数 / 调用对象 | `#ffac60` |
| 属性 / 方法 | `#1ac69c` |
| 字符串 | `#3fa4ff` |
| 变量 | `#c478ff` |

代码块根容器默认设置 `font-size: var(--text-12)` 与 `line-height: var(--leading-12)`；内部行号、`pre`、`code`、代码行全部继承根容器排版。`font-family` 默认继承外部上下文，不设置具体字体族，忽略设计稿中的字体设置。

按钮 hover 对齐 Button `bare` 模式：关闭背景叠加，默认 `opacity: 0.4`，hover 提升到 `1`，并使用 Frame color motion 变量过渡。

工具栏使用内部 Pin 布局固定到 `pin-top-right`，偏移为 `var(--padding-2)`；右下角尺寸手柄复用 `Indicator axis="height" appearance="corner"`，宿主 hover 时以 1px / Black/20% 显示，自身 hover、focus 或 dragging 时变为 2px / Black/40%。

---

## 内置 Icon

组件内置 SVG 图标，无需外部 Icon 组件依赖：

| 图标 | 用途 |
|:---|:---|
| Copy | 复制按钮默认状态 |
| Check | 复制成功后短暂显示 |
| ArrowsOutSimple | 放大按钮默认状态（进入全屏） |
| ArrowsInSimple | 全屏状态下的缩小按钮 |

---

## 外置 Icon 替换

推荐使用与 Input 一致的 `as="trailing"` 写法替换右侧默认动作区：

```svelte
<CodeBlock code="console.log('hello')">
    <Icon as="trailing"><Lightning /></Icon>
</CodeBlock>
```

也保留精确替换单个内置图标的兼容入口：

| `data-as` 值 | 替换的内置图标 |
|:---|:---|
| `copy-icon` | 复制图标（Copy） |
| `copied-icon` | 复制成功图标（Check） |
| `expand-icon` | 放大图标（ArrowsOutSimple） |
| `collapse-icon` | 缩小图标（ArrowsInSimple） |

---

## Icon 动效行为

| 场景 | 动效 |
|:---|:---|
| 点击复制 | Copy 消失 → Check 进入（`REPLACEMENT_APPEAR_MOTION` 内容替换进入 preset），停留 `copyTimeout` ms |
| 复制超时 | Check 消失 → Copy 出现（同上） |
| 点击放大 | ArrowsOutSimple 消失 → ArrowsInSimple 出现（同上） |
| 点击缩小 / Esc | ArrowsInSimple 消失 → ArrowsOutSimple 出现（同上） |
| 全屏进入 | 根 Frame 先 `captureLayout` 普通态位置，全屏覆盖层以相同 `layoutId` 挂载，Frame 共享元素 FLIP 动效放大到视口尺寸 |
| 全屏退出 | 全屏覆盖层调用 `playLayoutTo(rootElement)`，Frame 共享元素 FLIP 动效缩回普通态位置后卸载 |

图标替换进入动效引用 `REPLACEMENT_APPEAR_MOTION`。具体 duration / easing / scale 以 motion preset catalog 为准，Frame appear 桥接变量名仅作为兼容入口保留。

---

## 滚动条与高度

默认代码区高度由代码内容和 `visibleLines` 共同控制：内容不足 `visibleLines` 时按内容自适应（hug 高度），内容超过后固定到 `visibleLines` 行并滚动。默认 `visibleLines={15}`，与 Textarea 的自动高度上限保持一致。右下角提供与 Textarea 一致的拖拽手柄；拖拽后进入手动高度，代码区占满容器剩余高度并滚动。

消费方可通过 `style` 提供初始高度；首次拖拽后，交互产生的手动高度优先于初始 `style` 中的 `height`，避免外部初始值持续覆盖拖拽写回。其余用户样式仍保持最高合并优先级。

当代码区发生垂直滚动时，顶部和尾部会显示透明渐隐。渐隐复用 `layout.css` 的 `.snowui-scroll-mask` 通用能力（即「内容渐隐层」OSS 通用能力的 CSS 静态形态，能力总览见 [`../lib/edge-fade.md`](../lib/edge-fade.md)），通过 `mask-image` 只改变内容 alpha，不绘制可见色块。滚动条复用 `scrollbar.css` 的通用浮层滚动条：

| 结构 | 说明 |
|:---|:---|
| `.snowui-overlay-scrollbar-viewport` | 可滚动 viewport，隐藏原生滚动条 |
| `.snowui-overlay-scrollbar` | 自定义轨道，不占布局宽度 |
| `.snowui-overlay-scrollbar-thumb` | Thumb 视觉与拖拽逻辑由通用样式 / hook 统一管理 |
| `.snowui-scroll-mask` + `data-scroll-mask` | 顶部 / 尾部滚动透明渐隐 |
| `.snowui-indicator-corner` | 右下角通用 Indicator 高度手柄；位置由 Indicator 默认规则统一管理 |

CodeBlock 只声明轨道定位，滚动条尺寸、显隐、hover 形态与鼠标拖拽由共享样式和 `useOverlayScrollbar` 承接。

---

## Frame 能力接入说明

| Frame 能力 | 接入层 | 说明 |
|:---|:---|:---|
| 普通 Frame | 根 Frame | 容器不触发默认 hover 动效 |
| `enableResponsive` | 根 Frame | 默认 `false`（代码块本身不需要容器断点响应） |
| `enableContext` | 根 Frame | 默认 `false` |
| `enableScaleObserver` | 根 Frame | 默认 `false` |
| `enableDefaultMotion` | 根 Frame | 默认 `true` |
| `stateContent` | 复制按钮内部 Frame | 驱动 Copy ↔ Check 图标交叉淡化 |
| `layoutId` | 根 Frame / 全屏覆盖层 Frame | 全屏放大与缩小共享元素转场 |
| `Appear` | 全屏覆盖层 Frame | 提供布局转场时序桥接变量 |
| Icon 按钮 | `<button>` 直接渲染 | 不使用 Button 组件（内置 Icon 规范 §2.7） |

---

## 使用示例

### 基础用法

```svelte
<CodeBlock code={`const x = 1;`} language="ts" />
```

### children 直接写代码

```svelte
<CodeBlock language="ts">
{`const x = 1;
console.log(x);`}
</CodeBlock>
```

### 显示行号

```svelte
<CodeBlock code={codeStr} language="tsx" showLineNumbers />
```

### 设置显示行数

```svelte
<CodeBlock code={codeStr} language="tsx" visibleLines={8} />
```

### 隐藏按钮

```svelte
<CodeBlock code={codeStr} showCopyButton={false} showExpandButton={false} />
```

### 隐藏语言标识

```svelte
<CodeBlock code={codeStr} language="tsx" showLanguage={false} />
```

### 自定义复制超时

```svelte
<CodeBlock code={codeStr} copyTimeout={3000} />
```

### 外置 trailing Icon

```svelte
<CodeBlock language="bash">
    <Icon as="trailing"><Lightning /></Icon>
    {`pnpm install
pnpm build`}
</CodeBlock>
```

---

## 布局模型

主布局模型：**复合管理布局**（参见 [LayoutProtocol.md §12.6](../../../specs/LayoutProtocol.md)）

组件内部包含：
- 工具栏区域（固定在顶部，不随代码滚动）
- 可滚动代码区域（overflow-x: auto）
- 全屏覆盖层（position: fixed，按需渲染）

---

## 更新日志

| 日期 | 版本 | 说明 |
|:---|:---|:---|
| 2026-07-08 | v1.4.7 | 顶部操作按钮容器的 `pin-top-right` 偏移从 `--padding-2`（8px）调整为 `--padding-3`（12px），普通态与全屏态保持一致 |
| 2026-07-08 | v1.4.6 | 顶部复制 / 放大操作按钮统一使用 Button bare 默认 16×16 尺寸；移除 CodeBlock 私有按钮外壳尺寸，按钮组间距改为 `--gap-2`（8px）并接入 `--snowui-code-block-gap-override` |
| 2026-06-21 | v1.4.4 | 右下角私有 resize icon 与 pointer 算法迁移到统一 Indicator corner；复用宿主 hover、1px→2px、颜色、键盘和 ARIA 协议 |
| 2026-06-22 | v1.4.5 | 修复 Indicator action 创建 effect 订阅受控高度，导致首次 pointermove 写回后销毁拖拽会话；保持与旧版 CodeBlock、Textarea 相同的连续 pointer capture 语义 |
| 2026-05-02 | v1.4.1 | 全屏放大/缩小改为调用 Frame controller 的共享元素 FLIP 布局转场，进入从普通态位置放大，退出缩回普通态位置 |
| 2026-05-01 | v1.4.0 | 默认高度改为内容自适应到最多 15 行；新增右下角拖拽高度手柄；新增顶部/尾部滚动遮罩 |
| 2026-05-01 | v1.3.6 | 新增 `showLanguage` 控制语言标识显示；工具栏间距调整为 language 与按钮组 8px、按钮之间 4px |
| 2026-05-01 | v1.3.5 | 按钮 hover 对齐 Button `bare`：关闭背景叠加，默认透明度 0.4，hover 透明度 1 |
| 2026-05-01 | v1.3.4 | 按钮区颜色统一为 `--black-40`；按钮 hover 改为规范要求的 `currentColor` 叠加层 |
| 2026-05-01 | v1.3.3 | 新增 `visibleLines` 控制默认状态显示几行代码；行号列与代码列间距改为 `--gap-3`（12px） |
| 2026-05-01 | v1.3.2 | 隔离 `snowui-base.css` 全局 `code` 样式对 CodeBlock 内部 `<code>` 的 padding/margin/font 影响；排版统一由根容器继承控制 |
| 2026-05-01 | v1.3.1 | 修复行号列与代码列的行盒对齐；移除组件内残留 `font-family` 设置 |
| 2026-05-01 | v1.3.0 | 支持 `<CodeBlock>代码</CodeBlock>` children 直接写代码；外置动作槽改为与 Input 一致的 `as="trailing"`；代码字号/行高改为 `--text-12` / `--leading-12` |
| 2026-05-01 | v1.2.0 | 代码区默认显示 5 行并接入通用浮层滚动条；全屏退出改为 Frame `whileAppear` 反向播放；整体背景统一为 Background/2；语法 token 色直接写死到选择器 |
| 2026-05-01 | v1.1.0 | 按 Figma Code block 设计还原浅色代码块样式；新增内置轻量语法着色；代码文字不再设置字号、行高与字体 |
| 2026-04-30 | v1.0.0 | 初始创建：代码块显示、行号、复制、全屏放大，Frame 默认动效驱动图标切换 |
