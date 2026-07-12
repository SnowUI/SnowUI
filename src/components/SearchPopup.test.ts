/**
 * SearchPopup.test.ts
 * v2.0.0(2026-05-15)
 *
 * SearchPopup 源码组件已删除,合并入 Popover 中尺寸(size="md")。
 * 本文件仅保留 SP-02 示例作为"搜索浮层组合"参考,展示 PRO 资源(头像 / SearchInput)
 * 与 Popover size="md" 静态模式的复杂组合用法。
 *
 * 等价迁移:<SearchPopup> → <Popover size="md">,其余结构与 padding / radius 完全一致。
 */
export const examples = [
    {
        name: "SP-02:自定义内容(Popover size=md 静态模式)",
        code: `SP-02
<Popover size="md" class="p-16 rounded-24" style="width: 30rem;">
    <SearchInput autofocus placeholder="Search" showSearchIcon={false} class="w-full pt-4 px-8 pb-16 rounded-0 shadow-none border-b-black-10 bg-transparent text-18">
        <Icon as="leading" size={24}><Resource.MagnifyingGlass /></Icon>
    </SearchInput>

    <Frame column class="w-full pb-8 gap-4">
        <Text class="text-black-40 px-8 py-4">Recent search</Text>
        <MenuItem value="landing" class="w-full p-8 rounded-12">
            <Icon as="leading"><Resource.MagnifyingGlass /></Icon>
            Landing page design
        </MenuItem>
        <MenuItem value="byewind" active class="w-full p-8 rounded-12">
            <Avatar src={AvatarByewind} size={24} as="leading" />
            ByeWind
            <Text as="trailing" class="text-black-40">↩︎</Text>
        </MenuItem>
        <MenuItem value="recent-text" class="w-full p-8 rounded-12">
            <Icon as="leading"><Resource.MagnifyingGlass /></Icon>
            Text
        </MenuItem>
    </Frame>

    <Frame column class="w-full pb-8 gap-4">
        <Text class="text-black-40 px-8 py-4">Recently visited</Text>
        <MenuItem value="overview" class="w-full p-8 rounded-12">
            <Icon as="leading"><Resource.MagnifyingGlass /></Icon>
            Overview
        </MenuItem>
        <MenuItem value="visited-text-1" class="w-full p-8 rounded-12">
            <Icon as="leading"><Resource.MagnifyingGlass /></Icon>
            Text
        </MenuItem>
        <MenuItem value="visited-text-2" class="w-full p-8 rounded-12">
            <Icon as="leading"><Resource.MagnifyingGlass /></Icon>
            Text
        </MenuItem>
    </Frame>

    <Frame column class="w-full gap-4">
        <Text class="text-black-40 px-8 py-4">Contacts</Text>
        <MenuItem value="contact-byewind" class="w-full p-8 rounded-12">
            <Avatar src={AvatarByewind} size={24} as="leading" />
            ByeWind
        </MenuItem>
        <MenuItem value="contact-emma" class="w-full p-8 rounded-12">
            <Avatar src={Resource.Avatar3d04} size={24} as="leading" />
            Emma Smith
        </MenuItem>
        <MenuItem value="contact-melody" class="w-full p-8 rounded-12">
            <Avatar src={Resource.AvatarFemale05} size={24} as="leading" />
            Melody Macy
        </MenuItem>
    </Frame>
</Popover>`,
        logic: ["Composition", "MenuItem", "Avatar", "Icon", "MediumSize"],
    },
] as const;
