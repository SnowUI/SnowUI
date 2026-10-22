/**
 * Input.test.ts
 * v1.2.0
 * 变更记录 (2026-04-20): 新增 I-39/I-40 覆盖 Input as="search" 在 Listbox 内的过滤与自定义值功能。
 * 变更记录 (2026-03-30): 将 Input-Demo 的 I-00 ~ I-38（保留现存编号）迁入 test 项目，后续输入框与 Figma 的样式比对统一在 test 中进行。
 * 变更记录 (2026-03-29): 删除 `Input type="file"` 示例；该类型不再作为组件支持范围。
 * 变更记录 (2026-03-28): 删除 `Input type="range"` 示例；该类型不再作为组件支持范围。
 * 变更记录 (2026-03-17): temporal 输入统一为 segmented editor，补充 month / week / time / datetime-local 的占位、默认 icon 与 trailing 组合示例。
 * 变更记录 (2026-03-17): 更新日期输入示例，补充当前 segmented date 行为、月日两位显示规则与 trailing 组合示例。
 * 变更记录 (2026-03-16): `text` / `date` 改为自定义编辑层，示例保持 API 不变，继续覆盖默认文本输入与日期输入场景。
 * 变更记录 (2026-03-14): 同步 Input 默认样式更新，Frame 态示例中的默认背景为 Background/3。
 * 变更记录 (2026-03-13): 新增 Input 组件示例，覆盖原生输入属性/事件透传、外部 form 归属与 Frame 通用能力。
 */
export const examples = [
    {
        name: "I-00：Figma 颜色输入复刻",
        code: `I-00
<div class="flex-col gap-8" style="width: 20rem;">
    <Input type="color" value="#007AFF" title="Color picker" />
    <Text class="text-12 text-black-40">默认样式会展示色点与 HEX 值。</Text>
</div>`,
        logic: ["Color"],
    },
    {
        name: "I-01：空态占位符",
        code: `I-01
<Input
    class="relative"
    placeholder="请输入内容"
    style="width: 20rem;"
/>

<style>
    :global(.snowui-input.relative::before) {
        content: "";
        position: absolute;
        inset-block: var(--snowui-input-padding-y);
        inset-inline-start: var(--snowui-input-padding-x);
        inset-inline-end: var(--snowui-input-padding-x);
        border: 1px solid red;
        pointer-events: none;
        z-index: 3;
    }

    :global(.snowui-input.relative > .snowui-input-clear-btn) {
        outline: 1px solid red;
        outline-offset: 1px;
    }
</style>`,
        logic: ["Basic"],
    },
    {
        name: "I-02：默认值展示",
        code: `I-02
<Input defaultValue="SnowUI" style="width: 20rem;" />`,
        logic: ["Value"],
    },
    {
        name: "I-03：disabled 禁用态",
        code: `I-03
<Input disabled placeholder="Disabled" style="width: 20rem;" />`,
        logic: ["Disabled"],
    },
    {
        name: "I-04：readonly 只读态",
        code: `I-04
<Input readonly value="Readonly value" style="width: 20rem;" />`,
        logic: ["Readonly"],
    },
    {
        name: "I-05：默认文本输入",
        code: `I-05
<Input placeholder="请输入内容" style="width: 20rem;" />`,
        logic: ["Basic"],
    },
    {
        name: "I-06：默认外壳样式",
        code: `I-06
<Input placeholder="请输入内容" style="width: 20rem;" />`,
        logic: ["Basic"],
    },
    {
        name: "I-07：type=text",
        code: `I-07
<Input type="text" placeholder="Text" style="width: 20rem;" />`,
        logic: ["Type"],
    },
    {
        name: "I-08：type=email",
        code: `I-08
<Input type="email" placeholder="name@example.com" autocomplete="email" style="width: 20rem;" />`,
        logic: ["Type", "Autocomplete"],
    },
    {
        name: "I-09：type=password",
        code: `I-09
<Input type="password" placeholder="Password" style="width: 20rem;" />`,
        logic: ["Type"],
    },
    {
        name: "I-10：type=search",
        code: `I-10
<Input type="search" placeholder="Search..." value="snowui" style="width: 20rem;" />`,
        logic: ["Type", "Value"],
    },
    {
        name: "I-11：type=url",
        code: `I-11
<Input type="url" placeholder="https://snowui.design" style="width: 20rem;" />`,
        logic: ["Type"],
    },
    {
        name: "I-12：type=tel + inputmode",
        code: `I-12
<Input type="tel" placeholder="+86 138 0000 0000" inputmode="tel" style="width: 20rem;" />`,
        logic: ["Type", "NativeProps"],
    },
    {
        name: "I-13：type=number + stepper",
        code: `I-13
<Input
    type="number"
    placeholder="0"
    min={0}
    max={100}
    step={5}
    defaultValue={20}
    style="width: 20rem;"
/>`,
        logic: ["Type", "Validation"],
    },
    {
        name: "I-14：type=date",
        code: `I-14
<Input type="date" style="width: 20rem;" />`,
        logic: ["Type", "Date"],
    },
    {
        name: "I-14b：type=date + 外置 Icon",
        code: `I-14b
<Field style="width: 20rem;">
    <Input type="date" />
    <Button as="trailing" type="button" variant="borderless" bare iconOnly emphasis="muted" aria-label="打开日期选择器">
        <CalendarBlank size={16} />
    </Button>
</Field>`,
        logic: ["Type", "Date"],
    },
    {
        name: "I-14c：type=date + 前置外置 Icon",
        code: `I-14c
<Field style="width: 20rem;">
    <Icon as="leading"><CalendarBlank /></Icon>
    <Input type="date" />
</Field>`,
        logic: ["Type", "Date"],
    },
    {
        name: "I-15：type=time",
        code: `I-15
<Input type="time" style="width: 20rem;" />`,
        logic: ["Type", "Date"],
    },
    {
        name: "I-15b：type=time + 外置 Icon",
        code: `I-15b
<Field style="width: 20rem;">
    <Input type="time" />
    <Button as="trailing" type="button" variant="borderless" bare iconOnly emphasis="muted" aria-label="打开时间选择器">
        <Clock size={16} />
    </Button>
</Field>`,
        logic: ["Type", "Date"],
    },
    {
        name: "I-15c：type=time + 前置外置 Icon",
        code: `I-15c
<Field style="width: 20rem;">
    <Icon as="leading"><Clock /></Icon>
    <Input type="time" />
</Field>`,
        logic: ["Type", "Date"],
    },
    {
        name: "I-16：type=datetime-local",
        code: `I-16
<Input type="datetime-local" style="width: 20rem;" />`,
        logic: ["Type", "Date"],
    },
    {
        name: "I-17：type=month",
        code: `I-17
<Input type="month" style="width: 20rem;" />`,
        logic: ["Type", "Date"],
    },
    {
        name: "I-18：type=week",
        code: `I-18
<Input type="week" style="width: 20rem;" />`,
        logic: ["Type", "Date"],
    },
    {
        name: "I-19：type=color",
        code: `I-19
<Input type="color" value="#007AFF" title="Color picker" style="width: 20rem;" />`,
        logic: ["Type", "Color"],
    },
    {
        name: "I-22：id / title / placeholder",
        code: `I-22
<div class="flex-col gap-8" style="width: 20rem;">
    <label for="input-demo-account" class="text-12 text-black-40">id + title + placeholder</label>
    <Input
        id="input-demo-account"
        placeholder="Account name"
        title="用于展示 id / title 透传"
    />
    <Text class="text-12 text-black-40">原生 input 对照</Text>
    <label for="native-input-demo-account" class="text-12 text-black-40">id + title + placeholder</label>
    <input
        id="native-input-demo-account"
        placeholder="Account name"
        title="用于展示 id / title 透传"
    />
</div>`,
        logic: ["NativeProps"],
    },
    {
        name: "I-23：required / minlength / maxlength / pattern",
        code: `I-23
<div class="flex-col gap-8" style="width: 20rem;">
    <Input
        placeholder="3~12 位字母数字下划线"
        minlength={3}
        maxlength={12}
        pattern="[A-Za-z0-9_]+"
        title="仅允许字母、数字和下划线"
        required
    />
    <Text class="text-12 text-black-40">原生 input 对照</Text>
    <input
        placeholder="3~12 位字母数字下划线"
        minlength="3"
        maxlength="12"
        pattern="[A-Za-z0-9_]+"
        title="仅允许字母、数字和下划线"
        required
    />
</div>`,
        logic: ["Validation", "NativeProps"],
    },
    {
        name: "I-24：name / autocomplete / enterkeyhint / spellcheck",
        code: `I-24
<div class="flex-col gap-8" style="width: 20rem;">
    <Input
        placeholder="username"
        name="username"
        autocomplete="username"
        enterkeyhint="next"
        spellcheck={false}
    />
    <Text class="text-12 text-black-40">原生 input 对照</Text>
    <input
        placeholder="username"
        name="username"
        autocomplete="username"
        enterkeyhint="next"
        spellcheck="false"
    />
</div>`,
        logic: ["NativeProps", "Autocomplete"],
    },
    {
        name: "I-25：list / aria-describedby",
        code: `I-25
<div class="flex-col gap-8" style="width: 20rem;">
    <Input
        list="input-demo-cities"
        placeholder="datalist 示例"
        aria-describedby="input-demo-city-help"
    />
    <Text class="text-12 text-black-40">原生 input 对照</Text>
    <input
        list="input-demo-cities"
        placeholder="datalist 示例"
        aria-describedby="input-demo-city-help"
    />
    <datalist id="input-demo-cities">
        <option value="Shanghai"></option>
        <option value="Hangzhou"></option>
        <option value="Shenzhen"></option>
    </datalist>
    <Text id="input-demo-city-help" class="text-12 text-black-40">
        该输入展示 list / aria-describedby 的透传效果。
    </Text>
</div>`,
        logic: ["NativeProps", "Accessibility"],
    },
    {
        name: "I-26：aria-invalid 错误态",
        code: `I-26
<div class="flex-col gap-8" style="width: 20rem;">
    <Input
        placeholder="仅数字键盘"
        inputmode="numeric"
        aria-invalid="true"
    />
    <Text class="text-12 text-black-40">错误态不自动进入 focus。</Text>
</div>`,
        logic: ["NativeProps", "Accessibility"],
    },
    {
        name: "I-27：tabindex=2",
        code: `I-27
<div class="flex-col gap-8" style="width: 20rem;">
    <Input tabindex={2} placeholder="TabIndex 2" />
    <Text class="text-12 text-black-40">原生 input 对照</Text>
    <input tabindex="2" placeholder="TabIndex 2" />
</div>`,
        logic: ["NativeProps"],
    },
    {
        name: "I-28：tabindex=1",
        code: `I-28
<div class="flex-col gap-8" style="width: 20rem;">
    <Input tabindex={1} placeholder="TabIndex 1" />
    <Text class="text-12 text-black-40">原生 input 对照</Text>
    <input tabindex="1" placeholder="TabIndex 1" />
</div>`,
        logic: ["NativeProps"],
    },
    {
        name: "I-29：受控值展示",
        code: `I-29
<div class="flex-col gap-8" style="width: 20rem;">
    <Input value="snowui" placeholder="受控输入" />
    <Text class="text-12 text-black-40">当前受控值：snowui</Text>
</div>`,
        logic: ["Value"],
    },
    {
        name: "I-30：autofocus 自动聚焦",
        code: `I-30
<Input autofocus placeholder="我会在挂载后自动聚焦" style="width: 20rem;" />`,
        logic: ["Autofocus"],
    },
    {
        name: "I-31：form submit + reset",
        code: `I-31
<form class="flex-col gap-12" style="width: 20rem;">
    <Input
        name="project"
        placeholder="Project name"
        autocomplete="organization-title"
        required
    />
    <Input
        name="slug"
        placeholder="project_slug"
        pattern="[a-z0-9-]+"
        title="仅允许小写字母、数字和短横线"
        required
    />
    <Input
        name="budget"
        type="number"
        min={100}
        max={10000}
        step={100}
        defaultValue={500}
    />
    <div class="flex gap-8">
        <Button type="submit" variant="filled">提交表单</Button>
        <Button type="reset" variant="outline">重置</Button>
    </div>
</form>`,
        logic: ["Form"],
    },
    {
        name: "I-32：表单内字段",
        code: `I-32
<form id="input-demo-external-form" class="flex-col gap-12" style="width: 20rem;">
    <Input
        name="inlineField"
        placeholder="form 内部字段"
        defaultValue="inside"
    />
</form>`,
        logic: ["Form"],
    },
    {
        name: "I-33：form 外部归属",
        code: `I-33
<div class="flex-col gap-12" style="width: 20rem;">
    <form id="input-demo-external-form"></form>
    <Input
        form="input-demo-external-form"
        name="externalField"
        placeholder="通过 form 属性归属到上面的表单"
        defaultValue="outside"
    />
    <div class="flex gap-8">
        <Button form="input-demo-external-form" type="submit" variant="filled">提交外部归属表单</Button>
        <Button form="input-demo-external-form" type="reset" variant="outline">重置</Button>
    </div>
</div>`,
        logic: ["Form"],
    },
    {
        name: "I-34：click / keyboard / copy-paste 事件",
        code: `I-34
<Input
    value="尝试点击、双击、键盘、复制粘贴"
    placeholder="尝试点击、双击、键盘、复制粘贴"
    style="width: 20rem;"
    onclick={() => {}}
    ondblclick={() => {}}
    oninput={() => {}}
    onchange={() => {}}
    onfocus={() => {}}
    onblur={() => {}}
    onkeydown={() => {}}
    onkeyup={() => {}}
    onkeypress={() => {}}
    onpaste={() => {}}
    oncopy={() => {}}
    oncut={() => {}}
/>`,
        logic: ["Events"],
    },
    {
        name: "I-35：loading / skeleton",
        code: `I-35
<Input loading placeholder="loading + skeleton" style="width: 20rem;" />`,
        logic: ["Frame", "Loading"],
    },
    {
        name: "I-36：Click 状态切换 + 无按压位移",
        code: `I-36
<Input
    value="点击输入框切换到无边框态"
    style="width: 20rem;"
    Click={{ Idle: "Active", Active: "Idle" }}
    whileClick={false}
    whileActive={false}
    stateStyle={{
        Idle: "--snowui-input-background: var(--surface-1, #ffffffcc); --snowui-field-border-width: var(--border-1); --snowui-field-hover-border-color: var(--black-20, #00000033); --snowui-field-focus-border-color: var(--black-40, #00000066); --snowui-field-focus-ring-width: 0.25rem; --snowui-field-cursor: text;",
        Active: "--snowui-input-background: var(--surface-2, #00000008); --snowui-field-border-width: 0rem; --snowui-field-hover-border-color: transparent; --snowui-field-focus-border-color: transparent; --snowui-field-focus-ring-width: 0rem; --snowui-field-cursor: default;",
    }}
/>`,
        logic: ["Frame", "StateStyle"],
    },
    {
        name: "I-37：responsive 宽度",
        code: `I-37
<Input
    enableResponsive={true}
    responsive={{
        sm: { width: "100%" },
        lg: { width: "20rem" },
    }}
    placeholder="responsive width"
/>`,
        logic: ["Frame", "Responsive"],
    },
    {
        name: "I-38：whileAppear / layoutId",
        code: `I-38
<Input
    whileAppear
    layoutId="input-demo-shared"
    placeholder="whileAppear / layoutId"
    style="width: 20rem;"
/>`,
        logic: ["Frame", "Motion"],
    },
    {
        name: 'I-39：as="search" 嵌套在 Listbox 内（过滤模式）',
        code: `I-39
<Select placeholder="请选择国家" style="width: 20rem;">
    <Listbox>
        <Input as="search" placeholder="搜索..." />
        <MenuItem as="item" value="china">China</MenuItem>
        <MenuItem as="item" value="usa">United States</MenuItem>
        <MenuItem as="item" value="japan">Japan</MenuItem>
        <MenuItem as="item" value="germany">Germany</MenuItem>
        <MenuItem as="item" value="france">France</MenuItem>
        <MenuItem as="item" value="uk">United Kingdom</MenuItem>
        <MenuItem as="item" value="canada">Canada</MenuItem>
        <MenuItem as="item" value="australia">Australia</MenuItem>
        <MenuItem as="item" value="brazil">Brazil</MenuItem>
        <MenuItem as="item" value="india">India</MenuItem>
        <MenuItem as="item" value="korea">South Korea</MenuItem>
        <MenuItem as="item" value="italy">Italy</MenuItem>
        <MenuItem as="item" value="spain">Spain</MenuItem>
    </Listbox>
</Select>`,
        logic: ["Search", "Filter"],
    },
    {
        name: 'I-40：as="search" + allowCustomValue 自定义选项',
        code: `I-40
<Select placeholder="选择或输入职位" style="width: 20rem;">
    <Listbox>
        <Input as="search" allowCustomValue placeholder="搜索或输入新职位..." />
        <MenuItem as="item" value="designer">Designer</MenuItem>
        <MenuItem as="item" value="engineer">Engineer</MenuItem>
        <MenuItem as="item" value="pm">Product Manager</MenuItem>
    </Listbox>
</Select>`,
        logic: ["Search", "Filter", "CustomValue"],
    },
    {
        name: "I-41：输入触发错误动效与错误文字",
        code: `I-41
<Input
    type="email"
    placeholder="输入内容后按回车触发错误"
    error="请输入有效邮箱。"
    style="width: 20rem;"
    oninput={(event) => {
        const input = event.currentTarget as HTMLInputElement;
        const host = input.closest(".snowui-input");
        host?.removeAttribute("data-invalid");
        input.removeAttribute("aria-invalid");
    }}
    onkeydown={(event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const input = event.currentTarget as HTMLInputElement;
            const host = input.closest(".snowui-input");
            host?.setAttribute("data-invalid", "true");
            input.setAttribute("aria-invalid", "true");
        }
    }}
/>`,
        logic: ["Validation", "Frame", "Motion"],
    },
    {
        name: "I-Center：固定高度附件居中",
        code: `I-Center
<Input placeholder="Search" style="width: 20rem; height: var(--size-12);">
    <Icon as="leading" size={16}>S</Icon>
</Input>`,
        expected: { render: "输入文字与 leading 在 48px 输入表面内垂直居中，上下剩余空间对称。" },
        logic: ["Layout", "Leading", "Height"],
    },
    {
        name: "I-42：只读输入保留复制附件",
        code: `I-42
<Input readonly value="https://snowui.dev/llms.txt" aria-label="只读链接" style="width: 20rem;">
    <CopyButton as="trailing" text="https://snowui.dev/llms.txt" bare emphasis="muted" showText={false} />
</Input>`,
        expected: { render: "点击或 Tab 聚焦只读输入后，复制按钮仍可见且可操作，不出现清除按钮。" },
        logic: ["Readonly", "Trailing", "Focus"],
    },
    {
        name: "I-43：窄宽度图文输入与零间距下限",
        code: `I-43
<Input gap={0} aria-label="Search entries" value="A complete editable query" style="width: 8rem; max-width: 100%;">
    <Icon as="leading" icon={Resource.Check} />
</Input>`,
        expected: {render: "图标保持固有宽度，原生文字可编辑，附件间距至少 4 CSS px。"},
        logic: ["ContentLine", "Narrow", "Ownership"],
    },
] as const;
