/**
 * Select.test.ts
 * v2.0.0
 * 变更记录 (2026-04-18): 适配 Listbox + MenuItem 组合 API，替代 <option> children。
 * 变更记录 (2026-03-30): 将 Select-Demo 的 S-01 ~ S-09 全量迁入 test 项目，后续下拉样式与 Figma 对照统一在 test 中调整。
 * 变更记录 (2026-03-15): 新增 Select 组件示例，覆盖单选、多选、占位项、表单提交与 Frame 通用能力。
 */
export const examples = [
    {
        name: "S-01：占位选择",
        code: `S-01
<Select placeholder="请选择城市" style="width: 20rem;">
    <Listbox>
        <MenuItem as="item" value="shanghai">Shanghai</MenuItem>
        <MenuItem as="item" value="hangzhou">Hangzhou</MenuItem>
        <MenuItem as="item" value="shenzhen">Shenzhen</MenuItem>
    </Listbox>
</Select>`,
        logic: ["Basic", "Placeholder"],
    },
    {
        name: "S-02：默认值",
        code: `S-02
<Select defaultValue="designer" style="width: 20rem;">
    <Listbox>
        <MenuItem as="item" value="designer">Designer</MenuItem>
        <MenuItem as="item" value="engineer">Engineer</MenuItem>
        <MenuItem as="item" value="pm">Product Manager</MenuItem>
    </Listbox>
</Select>`,
        logic: ["Basic", "Value"],
    },
    {
        name: "S-03：disabled 禁用态",
        code: `S-03
<Select disabled defaultValue="archived" style="width: 20rem;">
    <Listbox>
        <MenuItem as="item" value="draft">Draft</MenuItem>
        <MenuItem as="item" value="archived">Archived</MenuItem>
    </Listbox>
</Select>`,
        logic: ["State", "Disabled"],
    },
    {
        name: "S-04：invalid 错误态",
        code: `S-04
<Select invalid defaultValue="high" style="width: 20rem;">
    <Listbox>
        <MenuItem as="item" value="low">Low</MenuItem>
        <MenuItem as="item" value="high">High</MenuItem>
    </Listbox>
</Select>`,
        logic: ["State", "Invalid"],
    },
    {
        name: "S-05：bind:value 对照态",
        code: `S-05
<div class="flex-col gap-8" style="width: 20rem;">
    <Select value="designer">
        <Listbox>
            <MenuItem as="item" value="designer">Designer</MenuItem>
            <MenuItem as="item" value="engineer">Engineer</MenuItem>
            <MenuItem as="item" value="pm">PM</MenuItem>
        </Listbox>
    </Select>
    <Text class="text-12 text-black-40">当前值：designer</Text>
</div>`,
        logic: ["Value"],
    },
    {
        name: "S-06：表单提交",
        code: `S-06
<form class="flex-col gap-12" style="width: 20rem;">
    <Select name="role" required placeholder="请选择岗位">
        <Listbox>
            <MenuItem as="item" value="designer">Designer</MenuItem>
            <MenuItem as="item" value="engineer">Engineer</MenuItem>
            <MenuItem as="item" value="pm">PM</MenuItem>
        </Listbox>
    </Select>
    <Select name="status" defaultValue="active">
        <Listbox>
            <MenuItem as="item" value="active">Active</MenuItem>
            <MenuItem as="item" value="paused">Paused</MenuItem>
        </Listbox>
    </Select>
    <div class="flex gap-8">
        <Button type="submit">提交表单</Button>
        <Button type="reset" variant="outline">重置</Button>
    </div>
</form>`,
        logic: ["Form"],
    },
    {
        name: "S-07：loading 骨架",
        code: `S-07
<Select loading placeholder="Loading..." style="width: 20rem;">
    <Listbox>
        <MenuItem as="item" value="demo">Demo</MenuItem>
    </Listbox>
</Select>`,
        logic: ["Frame", "Loading"],
    },
    {
        name: "S-08：Click 状态切换",
        code: `S-08
<Select
    defaultValue="active"
    style="width: 20rem;"
    Click={{ Idle: "Active", Active: "Idle" }}
    stateStyle={{
        Idle: "--snowui-select-background: var(--surface-1, #ffffffcc);",
        Active: "--snowui-select-background: color-mix(in srgb, var(--primary, #000000) 8%, var(--surface-1, #ffffffcc));",
    }}
>
    <Listbox>
        <MenuItem as="item" value="active">Active</MenuItem>
        <MenuItem as="item" value="paused">Paused</MenuItem>
    </Listbox>
</Select>`,
        logic: ["Frame", "StateStyle"],
    },
    {
        name: "S-09：Select 内嵌搜索框过滤",
        code: `S-09
<Select placeholder="搜索城市..." style="width: 20rem;">
    <Listbox search parts={{ Input: { placeholder: "搜索..." } }}>
        <MenuItem as="item" value="shanghai">Shanghai</MenuItem>
        <MenuItem as="item" value="hangzhou">Hangzhou</MenuItem>
        <MenuItem as="item" value="shenzhen">Shenzhen</MenuItem>
        <MenuItem as="item" value="beijing">Beijing</MenuItem>
        <MenuItem as="item" value="guangzhou">Guangzhou</MenuItem>
    </Listbox>
</Select>`,
        logic: ["Search", "Filter"],
    },
    {
        name: "S-10：parts 配置内置 Button trigger",
        code: `S-10
<Select
    buttonTrigger
    buttonBare={false}
    ariaLabel="选择排序"
    parts={{
        Button: {
            variant: "outline",
            size: "md"
        },
      Listbox: { showCheck: false }
    }}
>
    <Listbox>
        <MenuItem as="item" value="newest">Newest</MenuItem>
        <MenuItem as="item" value="oldest">Oldest</MenuItem>
    </Listbox>
</Select>`,
        logic: ["Parts", "ButtonTrigger"],
    },
    {
        name: "S-11：默认内置 Listbox 与 MenuItem",
        code: `S-11
<Select
    placeholder="选择状态"
    options={[
        { value: "todo", label: "待处理" },
        { value: "doing", label: "处理中" },
        { value: "done", label: "已完成" }
    ]}
/>`,
        logic: ["BuiltInMode", "Listbox", "MenuItem"],
    },
    {
        name: "S-12：Select 默认显示选中勾选",
        code: `S-12
<Select defaultValue="doing" style="width: 20rem;">
    <Listbox search>
        <MenuItem as="item" value="todo">待处理</MenuItem>
        <MenuItem as="item" value="doing">处理中</MenuItem>
        <MenuItem as="item" value="done">已完成</MenuItem>
    </Listbox>
</Select>`,
        logic: ["Selected", "ShowCheck", "ExplicitComposition"],
    },
] as const;
