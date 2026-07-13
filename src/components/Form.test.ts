/**
 * Form.test.ts
 * v1.0.3
 * 变更记录 (2026-04-10): 按最新需求文档收敛 FM-01 / FM-02 / FM-05 / FM-15 / FM-19，还原统一外壳、真实日期输入、紧凑消息输入区与 datalist 例外规则。
 * 变更记录 (2026-04-02): FM-03 改为 `label + row + checkbox items` 结构，对齐 Figma `10044:18936` 的通知方式布局。
 * 变更记录 (2026-04-02): FM-05 从 `row` 分段结构改为 `leading + Input + trailing` 宿主结构，去掉不该出现的中间分割线。
 * 变更记录 (2026-03-30): 将 Form-Demo 的 FM-01 ~ FM-19 迁入 test 项目，后续页面化表单的 Figma 对照统一在 test 中完成。
 */
export const examples = [
    {
        name: "FM-01：地址复合字段",
        code: `FM-01
<Field column style="width: 360px; gap: 0;">
    <Select as="segment" defaultValue="us" name="addressCountry">
        <Listbox>
            <MenuItem as="item" value="us">United States</MenuItem>
            <MenuItem as="item" value="cn">China</MenuItem>
            <MenuItem as="item" value="jp">Japan</MenuItem>
        </Listbox>
    </Select>
    <Input as="segment" name="addressLine1" placeholder="Address" />
    <Select as="segment" defaultValue="ca" name="addressState">
        <Listbox>
            <MenuItem as="item" value="ca">State</MenuItem>
            <MenuItem as="item" value="ny">New York</MenuItem>
            <MenuItem as="item" value="tx">Texas</MenuItem>
        </Listbox>
    </Select>
    <Frame as="segment" row>
        <Input as="segment" name="city" placeholder="City" />
        <Input as="segment" name="zip" placeholder="ZIP" />
    </Frame>
</Field>`,
        logic: ["Composition"],
    },
    {
        name: "FM-01b：地址复合字段错误态",
        code: `FM-01b
<Field invalid column style="width: 360px; gap: 0;">
    <Select as="segment" invalid placeholder="Country" name="addressCountryError">
        <Listbox>
            <MenuItem as="item" value="us">United States</MenuItem>
            <MenuItem as="item" value="cn">China</MenuItem>
            <MenuItem as="item" value="jp">Japan</MenuItem>
        </Listbox>
    </Select>
    <Input as="segment" invalid name="addressLine1Error" placeholder="Address" />
    <Select as="segment" invalid placeholder="State" name="addressStateError">
        <Listbox>
            <MenuItem as="item" value="ca">State</MenuItem>
            <MenuItem as="item" value="ny">New York</MenuItem>
            <MenuItem as="item" value="tx">Texas</MenuItem>
        </Listbox>
    </Select>
    <Frame as="segment" row>
        <Input as="segment" invalid name="cityError" placeholder="City" />
        <Input as="segment" invalid name="zipError" placeholder="ZIP" />
    </Frame>
    <Text as="error">请补全地址信息。</Text>
</Field>`,
        logic: ["Composition", "Validation"],
    },
    {
        name: "FM-02：信用卡三段",
        code: `<Field row style="width: 360px;">
    <Input
        as="segment"
        name="cardNumber"
        type="tel"
        placeholder="Card number"
        style="flex: 0 0 201px;"
    >
        <Icon as="leading"><CreditCard /></Icon>
    </Input>
    <Frame as="segment" row style="flex: 0 0 97px; padding: var(--padding-3) var(--padding-4); gap: 0;">
        <Input
            name="cardMonth"
            type="tel"
            placeholder="MM"
            style="width: 1.5rem; min-height: 20px; padding: 0; background: transparent; box-shadow: none; border-radius: 0;"
        />
        <Text
            class="text-14"
            style="padding: 0; display: flex; align-items: center; flex-shrink: 0; color: var(--black-10, rgba(0, 0, 0, 0.1));"
        >/</Text>
        <Input
            name="cardYear"
            type="tel"
            placeholder="YY"
            style="width: 1.5rem; min-height: 20px; padding: 0; background: transparent; box-shadow: none; border-radius: 0;"
        />
    </Frame>
    <Input as="segment" name="cardCvc" type="tel" placeholder="CVC" style="flex: 0 0 62px;" />
</Field>`,
        logic: ["Composition"],
    },
    {
        name: "FM-03：通知方式",
        code: `<Field style="width: 360px;">
    <Text as="label" style="color: var(--black-40, rgba(0, 0, 0, 0.4));">Overuse Notifications</Text>
    <Frame as="row" row gap="2">
        <Checkbox checked>Email</Checkbox>
        <Checkbox>Phone</Checkbox>
    </Frame>
</Field>`,
        logic: ["Checkbox"],
    },
    {
        name: "FM-04：切换状态",
        code: `<Field style="width: 360px;">
    <Text as="label" style="color: var(--black-40, rgba(0, 0, 0, 0.4));">Allow Changes</Text>
    <Switch checked>Allowed</Switch>
</Field>`,
        logic: ["Switch"],
    },
    {
        name: "FM-05：日期输入",
        code: `<Field style="width: 360px;">
    <Text as="label" style="color: var(--black-40, rgba(0, 0, 0, 0.4));">Due Date</Text>
    <Icon as="leading" style="color: var(--black-40, rgba(0, 0, 0, 0.4));"><CalendarBlank /></Icon>
    <Input type="date" name="dueDate" defaultValue="2026-02-01" />
    <Button as="trailing" type="button" variant="borderless" bare aria-label="打开日期选择" style="color: var(--black-40, rgba(0, 0, 0, 0.4));">
        <Icon size={16}><ArrowLineUpDown /></Icon>
    </Button>
</Field>`,
        logic: ["Date", "Composition"],
    },
    {
        name: "FM-10：公司电邮",
        code: `<Field style="width: 360px;">
    <Text as="label" style="color: var(--black-40, rgba(0, 0, 0, 0.4));">Corporate Email</Text>
    <Input defaultValue="support@snowui.com" name="email" />
</Field>`,
        logic: ["Input"],
    },
    {
        name: "FM-17：搜索建议",
        code: `<Field style="width: 360px;">
    <Text as="label" style="color: var(--black-40, rgba(0, 0, 0, 0.4));">Search Components</Text>
    <Input list="comp-list" name="searchComp" placeholder="Search..." />
    <datalist id="comp-list">
        <option value="Field" />
        <option value="Input" />
        <option value="Select" />
    </datalist>
</Field>`,
        logic: ["Datalist"],
    },
    {
        name: "FM-14：个人简介",
        code: `<Field style="width: 360px;">
    <Text as="label" style="color: var(--black-40, rgba(0, 0, 0, 0.4));">Personal Bio</Text>
    <Textarea defaultValue="A snowflake in the digital world." name="bio" />
</Field>`,
        logic: ["Textarea"],
    },
    {
        name: "FM-09：姓名双列",
        code: `<Field row style="width: 360px; ">
    <Input as="segment" name="firstName" placeholder="First Name" />
    <Input as="segment" name="lastName" placeholder="Last Name" />
</Field>`,
        logic: ["Row", "Composition"],
    },
    {
        name: "FM-16：单选组",
        code: `<Field style="width: 360px;">
    <Text as="label" style="color: var(--black-40, rgba(0, 0, 0, 0.4));">Frequency</Text>
    <Frame as="row" row gap="4">
        <Radio checked name="freq">Daily</Radio>
        <Radio name="freq">Weekly</Radio>
    </Frame>
</Field>`,
        logic: ["Radio"],
    },
    {
        name: "FM-11：联系电话",
        code: `<Field style="width: 360px;">
    <Text as="label" style="color: var(--black-40, rgba(0, 0, 0, 0.4));">Contact Phone</Text>
    <Input name="phone" defaultValue="+852 19850622" />
</Field>`,
        logic: ["Basic"],
    },
    {
        name: "FM-12：邮箱错误态",
        code: `<Field invalid style="width: 360px;">
    <Text as="label" style="color: var(--black-40, rgba(0, 0, 0, 0.4));">Email</Text>
    <Input
        type="email"
        name="email"
        placeholder="Please enter your email address."
        invalid
        autocomplete="email"
        required
    />
    <Text as="error">请输入有效邮箱。</Text>
</Field>`,
        logic: ["Validation"],
    },
    {
        name: "FM-13：国家错误态",
        code: `<Field invalid style="width: 360px;">
    <Text as="label" style="color: var(--black-40, rgba(0, 0, 0, 0.4));">Country</Text>
    <Select name="country" invalid required placeholder="请选择国家">
        <Listbox>
            <MenuItem as="item" value="us">United States</MenuItem>
            <MenuItem as="item" value="cn">China</MenuItem>
            <MenuItem as="item" value="jp">Japan</MenuItem>
        </Listbox>
    </Select>
    <Text as="error">请选择国家。</Text>
</Field>`,
        logic: ["Validation", "Select"],
    },
    {
        name: "FM-14：标签 chips",
        code: `<Field style="width: 360px;">
    <Text as="label" style="color: var(--black-40, rgba(0, 0, 0, 0.4));">Title</Text>
    <Frame as="row" row>
        <Text style="display: inline-flex; align-items: center; min-height: 1.5rem; padding: 0.25rem 0.5rem; border-radius: 999rem; background: var(--black-10, rgba(0, 0, 0, 0.04)); color: var(--black-80, rgba(0, 0, 0, 0.8)); font-size: 12px; line-height: 16px;">List Item</Text>
        <Text style="display: inline-flex; align-items: center; min-height: 1.5rem; padding: 0.25rem 0.5rem; border-radius: 999rem; background: var(--black-10, rgba(0, 0, 0, 0.04)); color: var(--black-80, rgba(0, 0, 0, 0.8)); font-size: 12px; line-height: 16px;">Tag</Text>
    </Frame>
</Field>`,
        logic: ["Composition"],
    },
    {
        name: "FM-15：消息输入区",
        code: `<Field column style="width: 360px; padding: var(--padding-3) var(--padding-4);">
    <Text style="font-size: 12px; line-height: 16px; color: var(--black-20, rgba(0, 0, 0, 0.2));">
        Ask a question or request, or type '/' for suggestions
    </Text>
    <Frame as="row" row style="align-items: center; justify-content: space-between;">
        <Frame as="row" row style="gap: var(--gap-1);">
            <Button type="button" variant="borderless" bare aria-label="添加附件">
                <Paperclip size={16} />
            </Button>
            <Button type="button" variant="borderless" bare aria-label="附加第二操作">
                <CalendarBlank size={16} />
            </Button>
        </Frame>
        <Button type="button" variant="borderless" bare aria-label="发送">
            <PaperPlaneRight size={16} />
        </Button>
    </Frame>
</Field>`,
        logic: ["Composition"],
    },
    {
        name: "FM-16：公司网址",
        code: `<Field style="width: 360px;">
    <Text as="label" style="color: var(--black-40, rgba(0, 0, 0, 0.4));">Company Site</Text>
    <Input
        name="site"
        defaultValue="snowui.byewind.com"
        autocomplete="url"
    />
</Field>`,
        logic: ["Autocomplete"],
    },
    {
        name: "FM-17：自动填充姓名",
        code: `<Field style="width: 360px;">
    <Text as="label" style="color: var(--black-40, rgba(0, 0, 0, 0.4));">Model</Text>
    <Select defaultValue="gpt-4" name="model" autocomplete="name">
        <Listbox>
            <MenuItem as="item" value="gpt-4">GPT-4</MenuItem>
            <MenuItem as="item" value="gpt-4.1">GPT-4.1</MenuItem>
            <MenuItem as="item" value="o4-mini">o4-mini</MenuItem>
        </Listbox>
    </Select>
</Field>`,
        logic: ["Autocomplete", "Select"],
    },
    {
        name: "FM-18：organization 自动填充",
        code: `<Field style="width: 360px;">
    <Text as="label" style="color: var(--black-40, rgba(0, 0, 0, 0.4));">Organization</Text>
    <Input
        autocomplete="organization"
        placeholder="autocomplete=organization"
    />
</Field>`,
        logic: ["Autocomplete"],
    },
    {
        name: "FM-19：datalist 建议项",
        code: `<Field style="width: 360px; padding: var(--padding-4) var(--padding-5);">
    <Text as="label">Enabled Plugins</Text>
    <Input
        list="form-demo-skills"
        placeholder="输入技能关键词"
        aria-describedby="form-demo-skill-help"
    />
</Field>
<datalist id="form-demo-skills">
    <option value="Design-GPT"></option>
    <option value="Frontend architecture"></option>
    <option value="Interaction design"></option>
    <option value="Accessibility"></option>
</datalist>
<Text id="form-demo-skill-help" style="font-size: 12px; line-height: 16px; color: var(--black-40, rgba(0, 0, 0, 0.4)); margin-top: 8px;">
    autocomplete 负责浏览器自动填充；datalist 负责原生建议列表。
</Text>`,
        logic: ["Datalist", "Autocomplete"],
    },
];
