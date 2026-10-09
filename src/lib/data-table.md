# DataTable 数据管线

> **版本**: v1.1.1
> **职责**: 提供稳定单列排序与客户端分页纯函数。

| API | 说明 |
| :--- | :--- |
| `sortDataTableRows` | 不修改原数组；稳定排序；空值始终置后 |
| `compareDataTableValues` | 比较 Number、Date 与 String 原始值 |
| `paginateDataTableRows` | 页码归一化和数组切片 |

日期显示不属于 DataTable 数据管线，统一使用 OSS `components/src/lib/date-format.ts`。

`sortDataTableRows(rows, undefined, undefined)` 不会推导第一列或任何默认排序，而是返回保留输入顺序的 rows 浅拷贝。

## Changelog

- 2026-06-22：v1.1.1，明确无 sort 时保留输入 rows 顺序，不隐式按第一列升序。
- 2026-06-19：v1.1.0，同名字段可由 DataTable 自动读取；日期格式化迁移到 OSS 通用能力。
- 2026-06-19：v1.0.0，首次发布。
