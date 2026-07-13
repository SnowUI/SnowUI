/**
 * Dialog.test.ts
 * v1.0.0
 *
 * 覆盖:
 * - DL-01~DL-03: Template 模式
 * - DL-20~DL-22: Panel 模式
 * - DL-30~DL-31: Inline 模式
 */

export const examples = [
    {
        name: "DL-01:模版模式基础对话框",
        code: `DL-01
<Dialog template id="dialog-basic">
    <Button as="pin-top-right" variant="borderless" bare data-dialog-close aria-label="关闭">
        <XCircle size={16} />
    </Button>
    <Text class="text-18 text-black-100">编辑资料</Text>
    <Text class="text-black-40">Dialog 会锁定背景滚动,并把键盘焦点限制在面板内部。</Text>
    <Frame row class="justify-end gap-8 pt-12">
        <Button variant="gray" data-dialog-close>取消</Button>
        <Button variant="filled" data-dialog-close>保存</Button>
    </Frame>
</Dialog>
<Button data-dialog-target="dialog-basic">打开 Dialog</Button>`,
        expected: {
            render: "点击按钮后显示 opaque backdrop 与居中 md Dialog 面板,右上角 Pin 关闭按钮定位在面板内",
            interaction: "默认点击 backdrop 不关闭;Escape / data-dialog-close 可关闭;Tab 焦点在面板内循环",
        },
        logic: ["Template", "Backdrop", "FocusTrap", "Pin"],
    },
    {
        name: "DL-02:三种尺寸与 backdrop 变体",
        code: `DL-02
<Frame row class="gap-8">
    <Dialog template id="dialog-sm" size="sm" backdrop="transparent">
        <Text>sm / transparent</Text>
        <Button data-dialog-close>关闭</Button>
    </Dialog>
    <Dialog template id="dialog-md" size="md" backdrop="opaque">
        <Text>md / opaque</Text>
        <Button data-dialog-close>关闭</Button>
    </Dialog>
    <Dialog template id="dialog-lg" size="lg" backdrop="blur">
        <Text>lg / blur</Text>
        <Button data-dialog-close>关闭</Button>
    </Dialog>
    <Button data-dialog-target="dialog-sm">Small</Button>
    <Button data-dialog-target="dialog-md">Medium</Button>
    <Button data-dialog-target="dialog-lg">Large</Button>
</Frame>`,
        expected: {
            render: "sm/max 320px、md/max 448px、lg/max 640px;backdrop 分别为透明、10% 黑色、20px 模糊",
        },
        logic: ["Size", "Backdrop"],
    },
    {
        name: "DL-03:禁止外部点击关闭",
        code: `DL-03
<Dialog template id="dialog-manual" closeOnOutside={false}>
    <Text class="text-18 text-black-100">需要明确关闭</Text>
    <Text class="text-black-40">点击遮罩不会关闭,Escape 仍按 Dialog 默认策略关闭。</Text>
    <Frame row class="justify-end pt-12">
        <Button variant="filled" data-dialog-close>知道了</Button>
    </Frame>
</Dialog>
<Button data-dialog-target="dialog-manual">打开</Button>`,
        expected: {
            interaction: "点击 backdrop 不关闭;点击内部按钮或 Escape 关闭",
        },
        logic: ["CloseOnOutside"],
    },
    {
        name: "DL-20:面板模式 open",
        code: `DL-20
<Dialog open>
    <Text class="text-18 text-black-100">本地状态</Text>
    <Text class="text-black-40">面板模式通过 open 直接显示,也支持 bind:open 与页面状态联动。</Text>
    <Frame row class="justify-end pt-12">
        <Button data-dialog-close>关闭</Button>
    </Frame>
</Dialog>`,
        expected: {
            interaction: "open 为 true 时直接渲染;关闭按钮可请求关闭当前面板",
        },
        logic: ["Panel", "Open"],
    },
    {
        name: "DL-21:Panel 尺寸全覆盖",
        code: `DL-21
<Frame row class="gap-8">
    <Dialog open size="sm">
        <Text>Small</Text>
    </Dialog>
    <Dialog open size="md">
        <Text>Medium</Text>
    </Dialog>
    <Dialog open size="lg">
        <Text>Large</Text>
    </Dialog>
</Frame>`,
        expected: {
            render: "三档 Dialog 均能按 size 输出对应 max-width、padding 与 radius",
        },
        logic: ["Panel", "Size"],
    },
    {
        name: "DL-30:内嵌模式自动绑定宿主",
        code: `DL-30
<Button variant="filled">
    打开内嵌 Dialog
    <Dialog as="dialog">
        <Text class="text-18 text-black-100">内嵌 Dialog</Text>
        <Text class="text-black-40">Dialog 作为 Button 子节点,自动绑定父元素 click。</Text>
        <Frame row class="justify-end pt-12">
            <Button data-dialog-close>关闭</Button>
        </Frame>
    </Dialog>
</Button>`,
        expected: {
            render: "无需 id 即可打开 Dialog;实际面板 Portal 到 body",
            interaction: "点击父 Button 打开;关闭后焦点回到父 Button",
        },
        logic: ["Inline", "Portal", "FocusReturn"],
    },
    {
        name: "DL-31:内嵌模式 Pin 关闭按钮",
        code: `DL-31
<Button>
    快速设置
    <Dialog as="dialog" size="sm">
        <Button as="pin-top-right" variant="borderless" bare data-dialog-close aria-label="关闭">
            <XCircle size={16} />
        </Button>
        <Text class="text-18 text-black-100">快速设置</Text>
        <Text class="text-black-40">Pin 元素使用 Dialog 默认 12px 偏移。</Text>
    </Dialog>
</Button>`,
        expected: {
            layout: "右上角关闭按钮通过 pin-top-right 固定,不影响内容流",
        },
        logic: ["Inline", "Pin"],
    },
] as const;
