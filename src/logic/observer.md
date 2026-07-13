# observer.svelte.ts 文档

> **版本**: v1.2.0
> **职责**: 统一管理 ResizeObserver 实例。

## 依赖关系

- **被依赖**: responsive.svelte.ts, text-collapse.svelte.ts

## 导出

| 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| resizeManager | Object | ResizeObserver 管理器单例 |

## 功能

- 单例 ResizeObserver 复用
- watch/unwatch 回调注册
- 自动 disconnect
