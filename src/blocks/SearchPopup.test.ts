/** SearchPopup 公共搜索区块；Site 和 Test 共享间距。 */
export const examples = [
    {
        name: "SP-01:默认数据与无分组",
        code: `SP-01
<SearchPopup showGroupTitles={false} items={[{ value: "button", label: "Button", href: "/test/Button" }, { value: "input", label: "Input", href: "/test/Input" }]} parts={{ SearchInput: { placeholder: "Search", "aria-label": "Search components" } }} />`,
        expected: { layout: "分隔线下方至首项为 16px，相邻 item 间距为 4px，无分组标题。", interaction: "原生链接支持键盘与新标签页。" },
        logic: ["BuiltIn", "Parts", "Keyboard"],
    },
    {
        name: "SP-02:自定义分组内容",
        code: `SP-02
<SearchPopup style="width: 30rem;" parts={{ SearchInput: { placeholder: "Search", autofocus: true } }}>

        <Text as="group-title">Recent search</Text>
        <MenuItem as="item" value="landing" class="w-full p-8 rounded-12">
            <Icon as="leading"><Resource.MagnifyingGlass /></Icon>
            Landing page design
        </MenuItem>
        <MenuItem as="item" value="byewind" active class="w-full p-8 rounded-12">
            <Avatar src={AvatarByewind} size={24} as="leading" />
            ByeWind
            <Text as="trailing" class="text-black-40">↩︎</Text>
        </MenuItem>
        <MenuItem as="item" value="recent-text" class="w-full p-8 rounded-12">
            <Icon as="leading"><Resource.MagnifyingGlass /></Icon>
            Text
        </MenuItem>

        <Text as="group-title">Recently visited</Text>
        <MenuItem as="item" value="overview" class="w-full p-8 rounded-12">
            <Icon as="leading"><Resource.MagnifyingGlass /></Icon>
            Overview
        </MenuItem>
        <MenuItem as="item" value="visited-text-1" class="w-full p-8 rounded-12">
            <Icon as="leading"><Resource.MagnifyingGlass /></Icon>
            Text
        </MenuItem>
        <MenuItem as="item" value="visited-text-2" class="w-full p-8 rounded-12">
            <Icon as="leading"><Resource.MagnifyingGlass /></Icon>
            Text
        </MenuItem>

        <Text as="group-title">Contacts</Text>
        <MenuItem as="item" value="contact-byewind" class="w-full p-8 rounded-12">
            <Avatar src={AvatarByewind} size={24} as="leading" />
            ByeWind
        </MenuItem>
        <MenuItem as="item" value="contact-emma" class="w-full p-8 rounded-12">
            <Avatar src={Resource.Avatar3d04} size={24} as="leading" />
            Emma Smith
        </MenuItem>
        <MenuItem as="item" value="contact-melody" class="w-full p-8 rounded-12">
            <Avatar src={Resource.AvatarFemale05} size={24} as="leading" />
            Melody Macy
        </MenuItem>
</SearchPopup>`,
        logic: ["Composition", "MenuItem", "Avatar", "Icon", "MediumSize"],
    },
    ...["opaque", "blur", "transparent"].map((backdrop) => ({
        name: `共享遮罩: ${backdrop}`,
        code: `<Button data-dialog-target="search-${backdrop}">搜索</Button>
<SearchPopup template id="search-${backdrop}" backdrop="${backdrop}" aria-label="搜索组件" items={[{value:"button",label:"Button",href:"#button"}]} />`,
        logic: ["Backdrop", "Dialog", "Keyboard"],
    })),
] as const;
