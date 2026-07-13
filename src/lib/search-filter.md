# search-filter.ts 文档

> **版本**: v1.0.0
> **日期**: 2026-04-21
> **职责**: 提供统一的搜索匹配策略，供所有需要字符串过滤的组件复用。
> **路径**: `components/src/lib/search-filter.ts`

---

## 1. 背景

需要搜索/过滤能力的组件（Select 内嵌搜索框、CommandPalette、AutoComplete 等）
各自实现过滤逻辑会导致匹配行为不一致。此模块将匹配策略集中定义，
组件只负责"拿到过滤结果后如何渲染"，不重复实现匹配算法。

---

## 2. 导出

### `matchesSearch(label, query): boolean`

判断候选项 label 是否匹配搜索词 query。

| 参数 | 类型 | 说明 |
|:---|:---|:---|
| `label` | `string` | 候选项的显示文本 |
| `query` | `string` | 用户输入的搜索词 |
| 返回值 | `boolean` | 是否匹配 |

**匹配规则**（按优先级，任意一条命中即返回 `true`）：

| 优先级 | 策略 | 示例 |
|:---|:---|:---|
| 1 | **子串匹配**：`label` 包含 `query`（大小写不敏感） | `"nited"` → `"United States"` ✓ |
| 2 | **首字母缩写前缀匹配**：label 各单词首字母拼成缩写，缩写以 `query` 开头 | `"us"` → initials(`"united states"`) = `"us"` ✓ |

> **注意**：缩写匹配使用 `startsWith`（而非 `includes`），避免误匹配缩写中间段。
> `"sa"` 不匹配 `"United States"`（缩写为 `"us"`，不以 `"sa"` 开头）。

### `filterBySearch<T extends { label: string }>(items, query): T[]`

从候选项数组中过滤出匹配项，保持原始顺序。

| 参数 | 类型 | 说明 |
|:---|:---|:---|
| `items` | `T[]` | 候选项数组，每项必须有 `label: string` 字段 |
| `query` | `string \| undefined` | 搜索词；空字符串或 `undefined` 时返回全量 |
| 返回值 | `T[]` | 匹配的子数组 |

---

## 3. 使用示例

```typescript
import { matchesSearch, filterBySearch } from "../lib/search-filter";

// 单项判断
matchesSearch("United States", "us");    // true（首字母缩写）
matchesSearch("United States", "state"); // true（子串）
matchesSearch("United States", "xyz");   // false

// 批量过滤（配合 Svelte $derived）
const filteredOptions = $derived.by(() =>
    filterBySearch(registeredOptions, filterText)
);
```

---

## 4. 依赖关系

- **被依赖**: `components/src/components/Select.svelte`
- 未来接入：CommandPalette、AutoComplete、任何需要搜索过滤的组件

---

## 5. 扩展指南

如需新增匹配策略（如拼音首字母、模糊匹配），在 `matchesSearch` 内追加新的 `if` 分支即可，
调用方无需修改。新策略命中时在已有两条之后执行，不改变现有优先级。

不应在单个组件内自行实现与此模块重复的过滤逻辑。
