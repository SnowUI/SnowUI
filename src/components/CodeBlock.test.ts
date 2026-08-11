/**
 * CodeBlock.test.ts
 * v1.3.0
 * 变更记录 (2026-08-12): 增加 singleLine 三槽布局回归示例，验证单行内容、Leading 与默认复制 Trailing。
 */
export const examples = [
    {
        name: "CB-01：基础代码块",
        code: `CB-01
<CodeBlock
    language="js"
    showLineNumbers
    visibleLines={8}
    code={\`// Type some code ->

console.log("oO08 iIlL1 g9qCGQ ~-+=>");
// a e u i o c A E AE oe

function updateGutters(cm) {
    var gutters = cm.display.gutters,
        __specs = cm.options.gutters;

    removeChildren(gutters);

    for (var i = 0; i < specs.length; ++i) {
        var gutterClass = __specs[i];
        var gElt = gutters.appendChild(
            elt(
                "div",
                null,
                "CodeMirror-gutter " + gutterClass
            )
        );
        if (gutterClass == "CodeMirror-linenumbers") {
            cm.display.lineGutter = gElt;
            gElt.style.width = (cm.display.lineNumWidth || 1) + "px";111111111111111111111111111111111111111111111111111
        }
    }
    gutters.style.display = i ? "" : "none";
    updateGutterSpace(cm);

    return false;
}\`}
    style="width: 38rem;"
/>`,
        logic: ["code", "language", "showLineNumbers", "visibleLines"],
    },
    {
        name: "CB-02：行号 + 长代码滚动",
        code: `CB-02
<CodeBlock
    language="js"
    code={\`const theme = "Figma CodeBlock";
console.log(theme);\`}
    style="width: 28rem;"
/>`,
        logic: ["code"],
    },
    {
        name: "CB-03：关闭工具按钮",
        code: `CB-03
<CodeBlock
    language="css"
    showCopyButton={false}
    showExpandButton={false}
    code={\`.demo-card {
    padding: 1rem;
    border-radius: 1rem;
    background: var(--background-2);
}\`}
    style="width: 24rem;"
/>`,
        logic: ["showCopyButton", "showExpandButton"],
    },
    {
        name: "CB-04：children 代码 + 外置 trailing Icon",
        code: `CB-04
<Field column gap={2} style="width: 28rem;">
    <Text as="label">Deployment Script</Text>
    <CodeBlock language="bash" copyTimeout={1200}>
        <Icon as="trailing"><Bell /></Icon>
        {\`pnpm install
pnpm build
pnpm preview\`}
    </CodeBlock>
</Field>`,
        logic: ["copyTimeout", "children", "as"],
    },
    {
        name: "CB-05：Frame 透传 as / stateStyle",
        code: `CB-05
<CodeBlock
    as="segment"
    language="json"
    code={\`{
  "name": "snowui",
  "mode": "demo"
}\`}
    style="width: 24rem;"
    Click={{ Idle: "Active", Active: "Idle" }}
    stateStyle={{
        Idle: "--snowui-code-block-bg: var(--black-100, #000);",
        Active: "--snowui-code-block-bg: color-mix(in srgb, var(--primary, #000000) 28%, #0b1220);",
    }}
/>`,
        logic: ["rest", "as"],
    },
    {
        name: "CB-06：全屏布局转场保持代码字号",
        code: `CB-06
<CodeBlock
    language="ts"
    visibleLines={4}
    code={\`const transition = {
    strategy: "layout",
    preservesGlyphScale: true,
};

function resizeViewport(width: number) {
    return Math.max(320, width);
}\`}
    style="width: 22rem;"
/>`,
        logic: [
            "fullscreenLayoutTransition",
            "showLineNumbers",
            "visibleLines",
        ],
    },

    {
        name: "CB-07：单行三槽代码条",
        code: `CB-07
<CodeBlock
    variant="singleLine"
    code="import { Button } from '@snowui-design-system/components';"
    style="width: 38rem;"
>
    <Icon as="leading"><Bell /></Icon>
</CodeBlock>`,
        logic: [
            "variant",
            "singleLine",
            "leading",
            "content",
            "trailing",
            "showCopyButton",
        ],
    },
    {
        name: "Custom 04-13-42",
        code: `CB-01
<CodeBlock
    language="js"
    showLineNumbers
  showLanguage={false}
  showExpandButton={false}
    style="width: 38rem;"
>
{\`Type some code ->

console.log("oO08 iIlL1 g9qCGQ ~-+=>");
// a e u i o c A E AE oe

function updateGutters(cm) {
    var gutters = cm.display.gutters,
        __specs = cm.options.gutters;

    removeChildren(gutters);

    for (var i = 0; i < specs.length; ++i) {
        var gutterClass = __specs[i];
        var gElt = gutters.appendChild(
            elt(
                "div",
                null,
                "CodeMirror-gutter " + gutterClass
            )
        );
        if (gutterClass == "CodeMirror-linenumbers") {
            cm.display.lineGutter = gElt;
            gElt.style.width = (cm.display.lineNumWidth || 1) + "px";
        }
    }
    gutters.style.display = i ? "" : "none";
    updateGutterSpace(cm);

    return false;
}\`}
</CodeBlock>`,
        logic: ["UserCreated"],
    },
    {
        name: "Custom 10-42-42",
        code: `CB-01
<CodeBlock
    language="js"
    showLineNumbers
    visibleLines={1}
    code={\`// Type some code ->

console.log("oO08 iIlL1 g9qCGQ ~-+=>");
// a e u i o c A E AE oe

function updateGutters(cm) {
    var gutters = cm.display.gutters,
        __specs = cm.options.gutters;

    removeChildren(gutters);

    for (var i = 0; i < specs.length; ++i) {
        var gutterClass = __specs[i];
        var gElt = gutters.appendChild(
            elt(
                "div",
                null,
                "CodeMirror-gutter " + gutterClass
            )
        );
        if (gutterClass == "CodeMirror-linenumbers") {
            cm.display.lineGutter = gElt;
            gElt.style.width = (cm.display.lineNumWidth || 1) + "px";111111111111111111111111111111111111111111111111111
        }
    }
    gutters.style.display = i ? "" : "none";
    updateGutterSpace(cm);

    return false;
}\`}
    style="width: 38rem;"
/>`,
        logic: ["UserCreated"],
    },
    {
        name: "Parts：配置内置操作按钮与 Indicator",
        code: `Parts
<CodeBlock
    code="const ready = true;"
    parts={{
        CopyButton: { ariaLabel: "复制示例代码" },
        ExpandButton: { ariaLabel: "展开示例代码" },
        Indicator: { appearance: "corner" }
    }}
/>`,
        logic: ["Parts", "CopyButton", "ExpandButton", "Indicator"],
    },
] as const;
