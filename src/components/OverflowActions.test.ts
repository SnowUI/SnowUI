export const examples = [
    {name:"OA-数量上限",code:`<OverflowActions overflow="progressive" maxVisible={1} items={[{id:'edit',label:'编辑'},{id:'copy',label:'复制'},{id:'more',label:'详情'}]} />`,expected:{render:"最多直出一个操作，其余进入More。",interaction:"More保留原操作顺序，菜单关闭后更新布局。"},logic:["MaxVisible","Progressive"]},
    {
        name: "OA-01:默认数据与完整操作",
        code: `OA-01
<OverflowActions
    items={[
        { id: "translate", label: "翻译", icon: "translate" },
        { id: "theme", label: "切换主题", icon: "sun" },
        { id: "github", label: "GitHub", icon: "github-logo" },
    ]}
/>`,
        expected: { render: "宽度足够时三个 Icon + Text Button 完整显示。", layout: "操作按 8px gap 单行排列。", interaction: "每个按钮保持真实 Button 行为。", performance: "自测量模式复用全局 ResizeObserver。", responsive: "跟随真实容器宽度依次进入 compact 与 More 菜单。" },
        logic: ["Items", "Full", "AutoWidth", "Responsive"],
    },
    {
        name: "OA-02:统一收起文字",
        code: `OA-02
<OverflowActions
    availableWidth={96}
    items={[
        { id: "edit", label: "编辑", icon: "pencil-simple" },
        { id: "copy", label: "复制", icon: "copy" },
        { id: "delete", label: "删除", icon: "trash" },
    ]}
/>`,
        expected: { render: "全部操作统一显示为 Icon-only。", layout: "不会混合 Icon + Text 与 Icon-only 两种密度。", interaction: "aria-label 与 title 沿用 label。", performance: "完整与紧凑宽度由隐藏测量副本一次读取。", responsive: "完整状态放不下时先统一 compact。" },
        logic: ["Compact", "AccessibleName", "Measure"],
    },
    {
        name: "OA-03:从左到右隐藏",
        code: `OA-03
<OverflowActions
    compact="none"
    overflow="progressive"
    overflowFrom="start"
    items={[
        { id: "edit", label: "编辑", icon: "pencil-simple" },
        { id: "copy", label: "复制", icon: "copy" },
        { id: "delete", label: "删除", icon: "trash" },
    ]}
/>`,
        expected: { render: "初始完整显示三个 Icon + Text Button；宽度不足时按编辑、复制、删除的顺序从左向右转入 More。", layout: "compact=none 禁止先统一变成 Icon-only。", interaction: "More 菜单保持被隐藏操作的原顺序。", performance: "只复用既有测量结果。", responsive: "跟随效果区域实际宽度响应，overflowFrom=start 从左侧开始逐个隐藏。" },
        logic: ["Progressive", "Start", "IconText", "NoCompact"],
    },
    {
        name: "OA-04:从右到左隐藏",
        code: `OA-04
<OverflowActions
    compact="none"
    overflow="progressive"
    overflowFrom="end"
    items={[
        { id: "edit", label: "编辑", icon: "pencil-simple" },
        { id: "copy", label: "复制", icon: "copy" },
        { id: "delete", label: "删除", icon: "trash" },
    ]}
/>`,
        expected: { render: "初始完整显示三个按钮；宽度不足时按删除、复制、编辑的顺序从右向左转入 More。", layout: "剩余操作保持原有视觉顺序。", interaction: "More 菜单按原始数据顺序显示被隐藏操作。", performance: "只复用既有测量结果。", responsive: "跟随效果区域实际宽度响应，overflowFrom=end 从右侧开始逐个渐隐后收纳；连续反向拖动按宽度恢复，停留 1s 后保留按钮恢复原透明度，再次缩窄从当前透明度接续；背景与 More 不渐隐。" },
        logic: ["Progressive", "End", "NoCompact"],
    },
    {
        name: "OA-05:分割线不进入菜单",
        code: `OA-05
<OverflowActions overflow="all">
    <OverflowAction as="item" id="copy" label="复制" icon="copy" />
    <Separator as="separator" column />
    <OverflowAction as="item" id="delete" label="删除" icon="trash" />
</OverflowActions>`,
        expected: { render: "初始显示两个 Action 与 Separator；宽度不足时 Listbox 连续显示复制与删除，不显示 Separator。", layout: "Separator 只属于主操作区域。", interaction: "菜单项仍执行原 Action。", performance: "Separator 仍参与主区域宽度计算。", responsive: "跟随效果区域实际宽度响应，全部 Action 转入菜单时忽略分割线。" },
        logic: ["All", "Separator", "Listbox"],
    },
    {
        name: "OA-06:全局按钮样式与子项覆盖",
        code: `OA-06
<OverflowActions
    overflow="progressive"
    overflowFrom="end"
    buttonProps={{ variant: "outline", size: "md" }}
>
    <OverflowAction as="item" id="edit" label="编辑" icon="pencil-simple" variant="filled" />
    <OverflowAction as="item" id="copy" label="复制" icon="copy" />
    <OverflowAction as="item" id="delete" label="删除" icon="trash" />
</OverflowActions>`,
        expected: { render: "初始完整显示三个 Action；宽度不足时先统一隐藏文字，再按删除、复制、编辑的顺序从右向左逐个进入 More。组级 outline/md 应用于所有普通 Action 与 More，编辑显式 variant=filled 覆盖组级 outline。", layout: "完整、Icon-only 与 More 三阶段保持同一组级样式；More 默认与 Button 一样使用 gray，本例由 buttonProps 改为 outline。", interaction: "显式子项行为不变。", performance: "完整、紧凑与 More 测量使用同一 buttonProps。", responsive: "跟随效果区域实际宽度响应，先统一 compact，再由 overflowFrom=end 逐个隐藏。" },
        logic: ["ButtonProps", "ExplicitOverride", "Compact", "Progressive", "More", "Measure"],
    },
    {
        name: "OA-07:More 单独样式覆盖",
        code: `OA-07
<OverflowActions
    availableWidth={160}
    buttonProps={{ variant: "outline", size: "md" }}
    parts={{ SelectButton: { variant: "filled", size: "lg" } }}
    items={[
        { id: "edit", label: "编辑", icon: "pencil-simple" },
        { id: "copy", label: "复制", icon: "copy" },
        { id: "delete", label: "删除", icon: "trash" },
    ]}
/>`,
        expected: { render: "普通 Action 使用组级 outline/md，More 单独使用 filled/lg。", layout: "More 的可见实例与隐藏测量副本使用同一套最终样式，响应式计算包含单独指定后的实际宽度。", interaction: "More 仍保持 action 模式与完整菜单行为。", performance: "单独覆盖不新增独立测量链。", responsive: "More 样式改变后仍按真实宽度进入溢出状态。" },
        logic: ["ButtonProps", "MoreOverride", "SelectButtonPart", "Measure"],
    },
    {
        name: "OA-08:外置 Action 不推断 More 样式",
        code: `OA-08
<OverflowActions availableWidth={160} compact="none" overflow="progressive">
    <OverflowAction as="item" id="edit" label="编辑" icon="pencil-simple" variant="outline" size="md" />
    <OverflowAction as="item" id="copy" label="复制" icon="copy" variant="outline" size="md" />
    <OverflowAction as="item" id="delete" label="删除" icon="trash" variant="outline" size="md" />
</OverflowActions>`,
        expected: { render: "三个显式外置 Action 各自使用 outline/md；父级未提供组级样式，因此 More 使用 Button 默认 gray/sm。", layout: "父组件不读取显式子项的直接 Props 推断 More 样式。", interaction: "外置 Action 与 More 保持各自的真实 Button 行为。", performance: "不增加对子项 DOM 或 Props 的反向扫描。", responsive: "More 使用默认样式的真实宽度参与溢出计算。" },
        logic: ["ExplicitComposition", "DirectProps", "MoreDefault", "NoReverseInference"],
    },
] as const;
