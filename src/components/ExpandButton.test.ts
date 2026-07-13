export const examples = [
    {
        name: "EB-01: 默认展开与收起",
        code: `EB-01
<ExpandButton bare />
<ExpandButton expanded bare />`,
        logic: ["HostSpecialization", "Expanded", "ReplacementMotion"],
    },
    {
        name: "EB-02: Button 变体",
        code: `EB-02
<ExpandButton variant="gray" />
<ExpandButton variant="filled" />
<ExpandButton variant="outline" />
<ExpandButton variant="borderless" />`,
        logic: ["HostSpecialization", "Variant"],
    },
] as const;
