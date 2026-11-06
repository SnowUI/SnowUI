# CodeBlock

> **版本**: v1.8.2
> **职责**: 清晰展示可复制的代码，支持语法着色、行号、全屏查看和尺寸调整，适合文档与开发工具。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

清晰展示可复制的代码，支持语法着色、行号、全屏查看和尺寸调整，适合文档与开发工具。

## 使用选择

<!-- usage-guide:start -->
用于展示可复制的代码；使用其内置复制与展开能力。需要编辑代码时先核对支持范围，不假定展示组件是编辑器。

- 通过 code 提供代码；默认显示复制与展开按钮，visibleLines 控制初始可见行数。
- singleLine 是单行展示，没有语言、行号、展开面板或纵向滚动；`as="trailing"` 替换右侧动作区。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { CodeBlock } from '@snowui-design-system/components';
	const exampleCode = ["import { Button } from '@snowui-design-system/components';", '', "const launchLabel = 'Explore components';", '', '<Button variant="filled" href="/components">', '  {launchLabel}', '</Button>'].join('\n');
</script>

<CodeBlock style="background-color: var(--background-1);" code={exampleCode} language="svelte" showLineNumbers visibleLines={7} />
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| variant | `"default" \| "singleLine"` | `"default"` | `singleLine` 使用 Input 同类 Leading / Content / Trailing 三槽布局；固定为单行展示，不生成高度拖拽、语言、行号、全屏或纵向滚动结构 |
| code | `string` | `""` | 要显示的代码字符串 |
| language | `string` | `""` | 语言标识，同时选择格式化解析器；支持 svelte、js/javascript、jsx、ts/typescript、tsx、html、css/scss/less、json/jsonc、yaml/yml、markdown/md、graphql/gql。空值根据代码识别 Svelte/HTML、JSON 或 JS/TS；未知的显式语言保留原文。 |
| format | `boolean` | `true` | 默认按 language 格式化代码；普通态、全屏、行号与复制共享格式化结果。设为 false 保留原文；singleLine 始终保留原文。解析失败、未知语言或输入超过 200,000 字符时保留原文。 |
| showLanguage | `boolean` | `true / prompt: false` | 默认显示语言标识；`language="prompt"` 默认隐藏，显式传值可覆盖。 |
| showLineNumbers | `boolean` | `false` | 是否显示代码行号；普通态与全屏态保持一致，避免切换末帧发生代码横向跳变 |
| showCopyButton | `boolean` | `true` | 是否显示复制按钮 |
| showExpandButton | `boolean` | `true` | 是否显示全屏放大按钮 |
| horizontalScrollbarVisibility | `"always" \| "hover"` | `"always"` | 横向滚动条在内容溢出时常显，或仅在鼠标移入代码块时显示 |
| visibleLines | `number` | `5` | 默认状态最多显示几行代码；内容不足时自适应高度，超出后滚动；全屏模式不受此限制 |
| copyTimeout | `number` | `2000` | 复制成功图标（Check）的停留时长（ms），超时后恢复 Copy 图标 |
| children | `Snippet` | — | 代码内容或附件源；纯文本会作为代码，`as="trailing"` 会替换右侧动作区 |
| parts | `ComponentPartsOf<{ Indicator: typeof Indicator; CopyButton: typeof CopyButton; ExpandButton: typeof ExpandButton; }>` | — | 仅配置内置 CopyButton、ExpandButton、Indicator；显式 children 配件不继承，操作按钮可通过 emphasis 配置强调程度。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="内置组件双模式"></a>

### 内置组件双模式

- `parts.Indicator`：配置内置 resize Indicator。
- 需要替换手柄结构时使用文档既有 Indicator `as` 职责；外置显式 Props 高于 part。

> **版本**: v1.8.2
> **更新**: 2026-10-23
> **职责**: 展示代码、基础语法着色与行号，并提供复制、全屏和可选尺寸调整能力。
> **布局模型**: 默认态为复合管理布局；`singleLine` 为槽位宿主布局
> **文档**: ./CodeBlock.md

代码块组件，支持语法显示、基础语法着色、行号、复制到剪贴板与全屏放大。全屏放大/缩小使用共享元素转场的 `layout` 策略：实际过渡位置与尺寸，不缩放代码字形；图标切换动效使用 `REPLACEMENT_APPEAR_MOTION`，避免继承浮层类动效语义。



---

<a id="关键字速查"></a>

### 关键字速查

| 类别 | 关键字 |
|:---|:---|
| **内容** | `code`, `language`, `children` |
| **功能开关** | `format`, `showLanguage`, `showLineNumbers`, `showCopyButton`, `showExpandButton` |
| **布局** | `variant="default\|singleLine"`, `visibleLines`, 默认态拖拽高度 |
| **行为** | `copyTimeout`；复制能力由默认内置 CopyButton 承担 |
| **默认内置组件** | `parts.CopyButton` 配置内置 bare CopyButton；`parts.ExpandButton` 配置内置 bare ExpandButton；`parts.Indicator` 配置缩放手柄 |
| **外置配件槽位** | `singleLine` 支持 `as="leading"`；全部变体支持 `as="trailing"`；兼容 `data-as="copy-icon"`, `data-as="copied-icon"`, `data-as="expand-icon"`, `data-as="collapse-icon"`，前两者映射到 CopyButton icon/successIcon |
| **Frame 透传** | `class`, `style`, `...rest` |

---

<a id="props"></a>


---

<a id="singleline-单行变体"></a>

### `singleLine` 单行变体

`variant="singleLine"` 面向 import、install command、短配置值等独占一行的只读代码条。它仍使用 `<pre><code>`、内置轻量语法着色和 CopyButton，不改用 Input，也不引入表单语义。

布局参考 Input 的三槽协议：

| 槽位 | 尺寸 | 内容 |
|:---|:---|:---|
| Leading | Hug | 可选外置 `as="leading"` 配件 |
| Content | Fill / `min-width: 0` | 单行高亮代码；超宽时仅横向滚动 |
| Trailing | Hug | 外置 `as="trailing"`，否则为默认内置 CopyButton |

单行态固定隐藏语言、行号和全屏按钮；`visibleLines`、`showLanguage`、`showLineNumbers`、`showExpandButton` 在该变体中不产生对应结构。根层不生成 Indicator，不接受拖拽高度，也不创建纵向 scrollbar / fade；内容横向溢出时默认常显 Overlay 横向滚动条，也可通过 `horizontalScrollbarVisibility="hover"` 改为仅在鼠标移入代码块时显示。默认 padding 与 Input 标准态一致：上下 `--padding-3`（12px）、左右 `--padding-4`（16px）；gap 首选 `--gap-2`（8px），有效间距至少4 CSS px并保留更大覆盖；复用Frame singleLine保持方向，Content继续Fill，附件不压缩；显式开启响应式时，继续按Frame原协议压缩／恢复首选间距。圆角为 `--radius-4`（16px）。

```svelte
<CodeBlock
    variant="singleLine"
    code="import { Button } from '@snowui-design-system/components';"
/>
```

需要 Leading 配件时：

```svelte
<CodeBlock variant="singleLine" code="pnpm add @snowui-design-system/components">
    <Icon as="leading"><Package /></Icon>
</CodeBlock>
```

---

<a id="自动代码格式化"></a>

### 自动代码格式化

默认 `format={true}`。使用 Prettier 的浏览器入口与官方 Svelte 插件，按需加载解析器；统一 Tab 缩进（宽度 4）、80 字符目标行宽、JS 单引号、分号、无尾逗号和多属性逐行排版。保留 Svelte 区块顺序和文本空白语义；长字符串不会强制截断。HTML/Markdown 中的空白和代码内容由对应解析器处理，不使用正则改写源码。

- `code` 或 children 文本是只读输入；只格式化展示副本，不修改调用方的数据或示例执行代码。
- 普通态、全屏、行号、高亮和复制共享同一份可见文本。
- `format={false}`、`variant="singleLine"`、不支持的显式语言、无效语法或超过 200,000 字符的输入保持原文；格式化不是 lint，不执行代码或补全缺失逻辑。
- SSR 先输出原文，客户端加载解析器后更新显示；加载期间原文仍可读可复制。异步结果仅提交到对应的当前输入，切换代码、语言或开关不会应用过期结果。依赖加载失败时保留原文。
- 解析器来自随包声明的 MIT 依赖 `prettier` / `prettier-plugin-svelte`；运行时不向格式化服务发送代码。格式化模块位于 `internal/code-block/format.ts`，由 CodeBlock 拥有，未新增 Frame 能力或公共格式化 API。

```svelte
<CodeBlock language="svelte" code={exampleSource} />
<CodeBlock language="svelte" code={exampleSource} format={false} />
```

<a id="语法着色"></a>

### 语法着色

`language="text"`（别名 plain、plaintext、txt）保留原文与换行；英文标识和数字使用关键字粉色，http/https URL 使用注释灰色，其余正文使用默认文字色。文本中的 `//` 不启动注释；字体、字号和行高与其他语言共用同一套继承规则。仅保留复制操作时，传入 `showLanguage={false}` 和 `showExpandButton={false}`；默认开关不变。

当使用 `code` prop 时，组件内置轻量语法着色规则，覆盖 JS / TS / JSON / HTML / CSS 常见 token。规则来自参考仓库中 `shiki` / `rehype-pretty-code` 的高亮分层思路，但当前实现不新增依赖。

颜色按 Figma 设计稿固定写死，并已在 `scripts/check-standards.js` 中登记为 `CodeBlock.svelte` 例外：

| token | 颜色 |
|:---|:---|
| 背景 | `--background-2` |
| 默认文本 / 标点 | `--black-100` |
| 行号 | `--black-20` |
| 注释 / 灰色代码 | `--black-40` |
| 语言标识 | `--black-40` |
| 按钮区 | 内置操作显式使用 `Button bare emphasis="muted"`：`--black-100` × `opacity: 0.4`（视觉等同 `--black-40`） |
| 关键字 / 数字 / literal | `#ff32c6` |
| 函数 / 调用对象 | `#ffac60` |
| 属性 / 方法 | `#1ac69c` |
| 字符串 | `#3fa4ff` |
| 变量 | `#c478ff` |

`language="prompt"` 用于提示词：正文使用默认前景色，HTTP(S) 链接使用 `--black-40`，不将普通英文单词识别为关键字；默认不显示语言标签，显式 `showLanguage` 可覆盖。提示词原文和复制内容不因着色改变。

外置 `style` 的 `background` / `background-*` 声明在普通态、全屏进入、全屏展示和退出期间保持生效。全屏层同步这些声明及其依赖的外置 CSS 变量，保留 Token 解析与动态更新；普通态的宽高、定位和内边距不随之带入全屏。未设置外置背景时继续使用默认 Background/2。

代码块根容器默认设置 `font-size: var(--text-12)` 与 `line-height: var(--leading-12)`；内部行号、`pre`、`code`、代码行全部继承根容器排版。`font-family` 默认继承外部上下文，不设置具体字体族，忽略设计稿中的字体设置。

默认态与全屏态的右上 CopyButton / ExpandButton 仍使用 `bare emphasis="muted"` 的图标强调与复制反馈；工具栏整体使用透明背景模糊，按钮保持 bare 外观，hover 时继续由 Button 将强调度提升到 100%。键盘焦点有可见轮廓。`singleLine` 的行内 trailing 复制按钮不使用这组右上视觉。

代码异步格式化期间，根节点输出 `data-formatting="true"`，完成后移除；宿主可据此避免显示尚未格式化的正文。原始代码与格式化结果仍由 CodeBlock 处理。

语言标签与动作组之间的有效间距至少4 CSS px；普通态与全屏态一致，纯图标组和代码字符／行号间距不由本规则改写。工具栏固定到 `pin-top-right`，工具栏距上边缘 8px、右边缘 4px，内部上下 4px、左右 8px；最右侧图标距上边缘和右边缘均为 12px，不随按钮数量变化。过长语言标签在可用宽度内省略。代码内容可从工具栏后方滚动，工具栏模糊后方内容；滚动条位于工具栏之上，纵向轨道上下边距相等。右下角尺寸手柄复用 `Indicator appearance="corner"`，仅角点附近可拖动，默认同时调整宽高；常态 2px / Black/10，自身 hover、focus 或 dragging 时变为 4px / Black/20。

---

<a id="内置-icon"></a>

### 内置 Icon

默认图标由真实CopyButton／ExpandButton子组件拥有并经内部ComponentIcon解析；调用方无需额外import这些内部依赖：

| 图标 | 用途 |
|:---|:---|
| Copy | 复制按钮默认状态 |
| Check | 复制成功后短暂显示 |
| ArrowsOutSimple | 放大按钮默认状态（进入全屏） |
| ArrowsInSimple | 全屏状态下的缩小按钮 |

---

<a id="外置-icon-替换"></a>

### 外置 Icon 替换

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

<a id="icon-动效行为"></a>

### Icon 动效行为

| 场景 | 动效 |
|:---|:---|
| 点击复制 | Copy 消失 → Check 进入（`REPLACEMENT_APPEAR_MOTION` 内容替换进入 preset），停留 `copyTimeout` ms |
| 复制超时 | Check 消失 → Copy 出现（同上） |
| 点击放大 | ArrowsOutSimple 消失 → ArrowsInSimple 出现（同上） |
| 点击缩小 / Esc | ArrowsInSimple 消失 → ArrowsOutSimple 出现（同上） |
| 全屏进入 | 先捕获普通态位置；全屏覆盖层使用共享元素 `layout` 策略实际过渡 `top / left / width / height`，代码字号和行高保持不变 |
| 全屏退出 | 全屏覆盖层以同一 `layout` 策略缩回普通态位置后卸载；普通态代码结构始终保持最终布局，不在末帧增删行号 |

图标替换进入动效引用 `REPLACEMENT_APPEAR_MOTION`。具体 duration / easing / scale 以 motion preset catalog 为准，Frame appear 桥接变量名仅作为兼容入口保留。

---

<a id="滚动条与高度"></a>

### 滚动条与高度

默认代码区高度由代码内容和 `visibleLines` 共同控制：内容不足 `visibleLines` 时按内容自适应（hug 高度），内容超过后固定到 `visibleLines` 行并滚动。默认 `visibleLines={5}`，与 Textarea 的自动高度上限保持一致。右下角提供与 Textarea 一致的拖拽手柄；拖拽后进入手动高度，代码区占满容器剩余高度并滚动。

消费方可通过 `style` 提供初始高度；首次拖拽后，交互产生的手动高度优先于初始 `style` 中的 `height`，避免外部初始值持续覆盖拖拽写回。其余用户样式仍保持最高合并优先级。

普通态和全屏态的右上角工具栏使用透明背景模糊后方内容；按钮距上、右边缘为 12px，模糊层与工具栏区域同尺寸。当代码区发生垂直滚动时，顶部和尾部会显示透明渐隐。渐隐复用 `layout.css` 的 `.snowui-scroll-mask` 通用能力（即「内容渐隐层」基础共享能力的 CSS 静态形态，能力总览见 [`../lib/edge-fade.md`](../lib/edge-fade.md)），通过 `mask-image` 只改变内容 alpha，不绘制可见色块。滚动条复用 `scrollbar.css` 的通用浮层滚动条：

| 结构 | 说明 |
|:---|:---|
| `.snowui-overlay-scrollbar-viewport` | 可滚动 viewport，隐藏原生滚动条 |
| `.snowui-overlay-scrollbar` | 自定义纵向 / 横向轨道，不占布局尺寸；横向溢出时默认常显，可按宿主 hover 显隐 |
| `.snowui-overlay-scrollbar-thumb` | Thumb 视觉与拖拽逻辑由通用样式 / hook 统一管理 |
| `.snowui-scroll-mask` + `data-scroll-mask` | 顶部 / 尾部滚动透明渐隐 |
| `.snowui-indicator-corner` | 右下角通用 Indicator 双轴手柄；位置由 Indicator 默认规则统一管理 |

CodeBlock 的默认态、全屏态和 `singleLine` 都由 `useOverlayScrollbar` 管理横向溢出；默认态和全屏态同时管理纵向溢出。组件只声明轨道定位，滚动条尺寸、显隐、hover 形态与鼠标拖拽由共享样式承接。纵向条随宿主 hover 显隐；横向条默认在内容溢出时始终显示，`horizontalScrollbarVisibility="hover"` 时随宿主 hover 显隐。

---

<a id="frame-能力接入说明"></a>

### Frame 能力接入说明

| Frame 能力 | 接入层 | 说明 |
|:---|:---|:---|
| 普通 Frame | 根 Frame | 容器不触发默认 hover 动效；`singleLine` 固定复用 Frame singleLine + Auto Layout 三槽协议 |
| `enableResponsive` | 根 Frame | 默认 `false`（代码块本身不需要容器断点响应） |
| `enableContext` | 根 Frame | 默认 `false` |
| `enableScaleObserver` | 根 Frame | 默认 `false` |
| `enableDefaultMotion` | 根 Frame | 默认 `true` |
| `stateContent` | 复制按钮内部 Frame | 驱动 Copy ↔ Check 图标交叉淡化 |
| 共享元素布局转场 | 根 Frame / 全屏覆盖层 Frame | 捕获普通态矩形，并使用 `strategy: "layout"` 实际过渡位置和尺寸；避免 `scale()` 缩放代码 |
| `Appear` | 全屏覆盖层 Frame | 提供布局转场时序桥接变量 |
| Icon 按钮 | CopyButton／ExpandButton的真实Button宿主 | 通过公开Props与parts配置，显式配件保持自身输入（内置Icon规范§2.7） |

---

<a id="使用示例"></a>


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

<a id="布局模型"></a>

### 布局模型

默认态主布局模型：**复合管理布局**（参见 [LayoutProtocol.md §12.6](../../../docs/standards/LayoutProtocol.md)）。`singleLine` 改用**槽位宿主布局**，根层直接管理 Leading / Content / Trailing，且不生成下列默认态的滚动、全屏与 resize 子树。

组件内部包含：
- 工具栏区域（固定在顶部，不随代码滚动）
- 可滚动代码区域（overflow-x: auto）
- 全屏覆盖层（position: fixed，按需渲染）

---



## AI Zone

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../docs/standards/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。

## 更新日志

### v1.8.2 (2026-10-23)

- 单行代码与附件、普通／全屏语言标签与动作组保持至少4 CSS px；更大首选覆盖依原响应式协议压缩／恢复。单行变体复用Frame singleLine并标记Fill内容槽，防止响应方向改为列或短代码使trailing丢失位置。代码、行号、原滚动／复制／格式化和全屏行为保持。

- 2026-09-28：同步 Indicator 的统一命中与状态视觉；Corner 默认同时调整宽高，显式单轴配置继续生效。

- 2026-09-27：text/plain/plaintext/txt 独立文本着色，英文标识及数字复用关键字粉色，URL 复用注释灰色；不再把 URL 后正文误判为注释。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

| 日期 | 版本 | 说明 |
|:---|:---|:---|
| 2026-09-18 | v1.8.0 | 新增 `horizontalScrollbarVisibility`，允许横向滚动条仅在代码块 hover 时显示；默认仍为溢出时常显。 |
| 2026-09-03 | v1.7.0 | 新增默认开启的 format，按语言格式化展示及复制内容；支持显式关闭、异步竞态保护、原文回退与单行变体保留。 |
| 2026-08-17 | v1.6.3 | 默认态、全屏态与 `singleLine` 接入共享 Overlay 横向滚动条；代码横向溢出时常显并支持拖拽，不再隐藏原生条后缺少可见滚动反馈 |
| 2026-08-15 | v1.6.2 | 内部 `pre` / `code` 显式使用 `border-box`，与既有 padding、margin、font reset 一起隔离可选 `snowui-base.css` 的元素级影响 |
| 2026-08-12 | v1.6.1 | `singleLine` 的 padding、gap 与圆角对齐 Input 标准态：上下 12px、左右 16px、gap 8px、圆角 16px |
| 2026-08-12 | v1.6.0 | 新增 `variant="singleLine"`；参考 Input 实现 Leading / Content / Trailing 三槽布局，保留高亮与复制，移除语言、行号、全屏、纵向滚动及高度拖拽结构 |
| 2026-08-09 | v1.5.1 | Button bare 默认改为 100% 后，内置复制 / 放大操作显式使用 `emphasis="muted"` 保留原 40% → hover 100% 的次级操作视觉 |
| 2026-07-30 | v1.5.0 | 全屏展开/收起改用共享元素 `layout` 策略，实际过渡位置与尺寸，代码字形不参与缩放；普通态与全屏态统一遵循 `showLineNumbers`，消除退出末帧横向突变 |
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
