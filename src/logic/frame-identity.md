# identity.svelte.ts 文档

> **版本**: v2.1.0
> **职责**: 管理组件的身份标识属性。

**需求**: 提供组件的身份标识和基础配置能力，包括样式注入、角色声明、标签控制和属性透传。

## 关键字

| 关键字 | 类型 | 描述 |
| :--- | :--- | :--- |
| class | `string \| LinkageControl` | 外部 CSS 类名，支持联动控制 |
| style | `string \| LinkageControl` | 行内样式，支持联动控制 |
| as | `string` | 角色声明，用于在组合模式下声明自身在父容器中的角色 |
| tag | `string \| LinkageControl` | 渲染的 HTML 标签名，支持联动控制 |
| id | `string` | 元素 ID。若未提供且组件涉及动效编排，则自动生成唯一 ID |

## ID 自动生成 [Updated in v2.1]

当组件需要参与动效编排但用户未提供 `id` 时，系统会自动生成确定性 ID。

```typescript
// 使用模块级计数器确保 ID 唯一且可预测
let idCounter = 0;

// 生成格式: snowui-auto-1, snowui-auto-2, ...
const autoId = `snowui-auto-${++idCounter}`;
```

> **SSR 兼容**: 使用确定性计数器替代 `Math.random()`，确保服务端渲染与客户端 hydration 的 ID 一致。

## 联动控制

所有关键字都支持 `{ target, action }` 语法控制其他组件。详见 [frame-perception.md](./frame-perception.md)。

## Svelte 原生能力

以下能力由 Svelte 原生机制处理：

| 关键字 | 描述 | 处理方式 |
| :--- | :--- | :--- |
| children | 默认插槽，用于接收子内容 | Svelte 原生 (`Snippet`) |
| element | 绑定根元素的 HTMLElement | Svelte 原生 (`$bindable`) |
| use | Svelte Actions 数组 | Svelte 原生 (`use:action`) |
| ...rest | 属性透传 | 组件模板透传 |

## 上报数据

| 属性 | 描述 |
| :--- | :--- |
| role | 角色值 (即 `as` 的值) |
| tag | 最终渲染的 HTML 标签名 |
| id | 最终使用的元素 ID (自动生成或用户提供) |
| class | 合并后的 CSS 类名 |
| style | 合并后的行内样式 |

---

## 更新日志 (Changelog)

### v2.1.0 (2026-01-20)
- **修复**: ID 生成使用确定性计数器 (`idCounter`) 替代 `Math.random()`
- **改进**: SSR hydration 兼容，确保服务端和客户端 ID 一致

### v1.3.0
- 新增联动控制支持


