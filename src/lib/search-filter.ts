/* SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * 搜索过滤工具 (Search Filter Utilities)
 * v1.0.0
 * 2026-04-21: 初始版本，从 Select.svelte 的 filteredOptions 逻辑提取为通用能力。
 *
 * 职责：提供统一的搜索匹配策略，供 Select、CommandPalette、AutoComplete 等
 * 所有需要字符串过滤的组件复用。
 *
 * 文档: ./search-filter.md
 */

/**
 * 判断一个字符串 label 是否匹配 query。
 *
 * 匹配顺序（任意一条命中即返回 true）：
 * 1. **子串匹配**：label 中包含 query（大小写不敏感）。
 *    "nited" → "United States" ✓
 * 2. **首字母缩写前缀匹配**：将 label 每个单词的首字母拼成缩写串，
 *    判断是否以 query 开头（大小写不敏感）。
 *    "us" → initials("united states") = "us" ✓
 *    "usa" → initials("united states of america") = "usoa" — 不以 "usa" 开头 ✗
 *
 * @param label  候选项的显示文本
 * @param query  用户输入的搜索词
 * @returns 是否匹配
 */
export function matchesSearch(label: string, query: string): boolean {
    if (!query) return true;
    const lowerLabel = label.toLowerCase();
    const lowerQuery = query.toLowerCase();

    // 1. 子串匹配
    if (lowerLabel.includes(lowerQuery)) return true;

    // 2. 首字母缩写前缀匹配
    const initials =
        lowerLabel
            .match(/(?:^|\s)([a-z0-9])/g)
            ?.map((m) => m.trim())
            .join("") ?? "";
    return initials.startsWith(lowerQuery);
}

/**
 * 从候选项列表中过滤出匹配的项目。
 *
 * @param items   候选项数组（每项必须含 `label` 字段）
 * @param query   用户输入的搜索词；为空字符串或 undefined 时返回全量
 * @returns 匹配的候选项子数组（保持原始顺序）
 */
export function filterBySearch<T extends { label: string }>(
    items: T[],
    query: string | undefined,
): T[] {
    if (!query) return items;
    return items.filter((item) => matchesSearch(item.label, query));
}
