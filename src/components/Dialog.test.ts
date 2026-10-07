/** Dialog 默认样式与三种激活模式的公开 API 示例。 */
export const examples = [
    {
        "name": "DL-01:默认 sm 样式",
        code: `DL-01
<Dialog template id="dialog-sm" size="sm" title="退出编辑">
    未保存的更改将丢失，是否保存？
    <Frame as="footer">
        <Button as="item" variant="outline" data-dialog-close>取消</Button>
        <Button as="item" variant="filled" data-dialog-close>保存</Button>
    </Frame>
</Dialog>
<Button data-dialog-target="dialog-sm">打开 sm</Button>`,
        "expected": {
            "render": "默认标题、关闭按钮、正文、操作区；sm 无分割线，md/lg 有分割线；opaque 遮罩",
            "interaction": "关闭请求沿用 Dialog 原有状态、焦点与键盘协议"
        },
        "logic": [
            "Dialog",
            "Defaults"
        ]
    },
    {
        "name": "DL-02:默认 md 样式",
        code: `DL-02
<Dialog template id="dialog-md" size="md" title="退出编辑">
    未保存的更改将丢失，是否保存？
    <Frame as="footer">
        <Button as="item" variant="outline" data-dialog-close>取消</Button>
        <Button as="item" variant="filled" data-dialog-close>保存</Button>
    </Frame>
</Dialog>
<Button data-dialog-target="dialog-md">打开 md</Button>`,
        "expected": {
            "render": "默认标题、关闭按钮、正文、操作区；sm 无分割线，md/lg 有分割线；opaque 遮罩",
            "interaction": "关闭请求沿用 Dialog 原有状态、焦点与键盘协议"
        },
        "logic": [
            "Dialog",
            "Defaults"
        ]
    },
    {
        "name": "DL-03:默认 lg 样式",
        code: `DL-03
<Dialog template id="dialog-lg" size="lg" title="退出编辑">
    未保存的更改将丢失，是否保存？
    <Frame as="footer">
        <Button as="item" variant="outline" data-dialog-close>取消</Button>
        <Button as="item" variant="filled" data-dialog-close>保存</Button>
    </Frame>
</Dialog>
<Button data-dialog-target="dialog-lg">打开 lg</Button>`,
        "expected": {
            "render": "默认标题、关闭按钮、正文、操作区；sm 无分割线，md/lg 有分割线；opaque 遮罩",
            "interaction": "关闭请求沿用 Dialog 原有状态、焦点与键盘协议"
        },
        "logic": [
            "Dialog",
            "Defaults"
        ]
    },
    {
        "name": "DL-04:分割线与关闭按钮开关",
        code: `DL-04
<Dialog template id="dialog-no-line" title="自定义操作" closeOnOutside={false} separator={false} showCloseButton={false}>
    标题下方没有分割线。
    <Frame as="footer">
        <Button as="item" variant="outline" data-dialog-close>取消</Button>
        <Button as="item" variant="filled" data-dialog-close>保存</Button>
    </Frame>
</Dialog>
<Button data-dialog-target="dialog-no-line">打开</Button>`,
        "expected": {
            "render": "关闭内置分割线与关闭按钮；显式禁止遮罩关闭，操作区仍可关闭",
            "interaction": "关闭请求沿用 Dialog 原有状态、焦点与键盘协议"
        },
        "logic": [
            "Dialog",
            "Defaults"
        ]
    },
    {
        "name": "DL-05:小号显式分割线",
        code: `DL-05
<Dialog template id="dialog-sm-line" size="sm" title="详细信息" separator>
    sm 也可以显式显示分割线。
</Dialog>
<Button data-dialog-target="dialog-sm-line">打开</Button>`,
        "expected": {
            "render": "sm 显式 separator=true",
            "interaction": "关闭请求沿用 Dialog 原有状态、焦点与键盘协议"
        },
        "logic": [
            "Dialog",
            "Defaults"
        ]
    },
    {
        "name": "DL-20:面板模式",
        code: `DL-20
<Dialog open title="本地状态">
    支持 bind:open 与页面状态联动。
</Dialog>`,
        "expected": {
            "render": "面板模式默认显示；关闭按钮和 Escape 可关闭",
            "interaction": "关闭请求沿用 Dialog 原有状态、焦点与键盘协议"
        },
        "logic": [
            "Dialog",
            "Defaults"
        ]
    },
    {
        "name": "DL-30:内嵌模式",
        code: `DL-30
<Button>打开内嵌 Dialog
    <Dialog as="dialog" title="快速设置">
        自动绑定父按钮，关闭后恢复焦点。
    </Dialog>
</Button>`,
        "expected": {
            "render": "Portal、内嵌触发和焦点恢复",
            "interaction": "关闭请求沿用 Dialog 原有状态、焦点与键盘协议"
        },
        "logic": [
            "Dialog",
            "Defaults"
        ]
    },
    {
        "name": "DL-31:外置关闭按钮替换",
        code: `DL-31
<Dialog template id="dialog-custom" title="自定义内容" separator={false}>
    <Button as="close" variant="borderless" iconOnly size="md" aria-label="关闭"><Close size={20} /></Button>
</Dialog>
<Button data-dialog-target="dialog-custom">自定义 Dialog</Button>`,
        "expected": {
            "render": "外置 close 自动替换内置关闭按钮并共用定位；按钮样式由显式 Props 决定",
            "interaction": "关闭请求沿用 Dialog 原有状态、焦点与键盘协议"
        },
        "logic": [
            "Dialog",
            "Defaults"
        ]
    },
    {
        "name": "DL-40:遮罩变体",
        code: `DL-40
<Frame row class="gap-8">
<Dialog template id="dialog-opaque" title="opaque" backdrop="opaque">点击外部可关闭。</Dialog>
<Button data-dialog-target="dialog-opaque">opaque</Button>
<Dialog template id="dialog-blur" title="blur" backdrop="blur">点击外部可关闭。</Dialog>
<Button data-dialog-target="dialog-blur">blur</Button>
<Dialog template id="dialog-transparent" title="transparent" backdrop="transparent">点击外部可关闭。</Dialog>
<Button data-dialog-target="dialog-transparent">transparent</Button>
</Frame>`,
        "expected": {
            "render": "三种 backdrop 均可用，opaque / blur 从透明渐入，默认点击遮罩可关闭",
            "interaction": "关闭请求沿用 Dialog 原有状态、焦点与键盘协议"
        },
        "logic": [
            "Dialog",
            "Defaults"
        ]
    },
    {
        "name": "DL-41:标题和操作区替换",
        code: `DL-41
<Dialog template id="dialog-roles" size="lg" closeLabel="关闭设置">
    <Text as="title" tag="h2">自定义标题 <Text>补充信息</Text></Text>
    <Button>正文按钮</Button>
    <Frame as="footer">
        <Button as="item" data-dialog-close>默认中号</Button>
        <Button as="item" size="lg" data-dialog-close>显式大号</Button>
    </Frame>
</Dialog>
<Button data-dialog-target="dialog-roles">打开</Button>`,
        "expected": {
            "render": "标题 角色；footer Context 只控制 as=item 默认尺寸，显式 size 优先",
            "interaction": "关闭请求沿用 Dialog 原有状态、焦点与键盘协议"
        },
        "logic": [
            "Dialog",
            "Defaults"
        ]
    }
] as const;
