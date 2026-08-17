# observer.svelte.ts 文档

> **版本**: v1.3.0
> **职责**: 统一管理 ResizeObserver 实例。

## 依赖关系

- **被依赖**: responsive.svelte.ts, text-collapse.svelte.ts

## 导出

| 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| resizeManager | Object | ResizeObserver 管理器单例 |

## 功能

- 首次 `watch()` 时延迟创建单例 ResizeObserver，模块导入和 SSR 不访问浏览器 API
- watch/unwatch 回调注册
- 同一帧的尺寸通知合并后在下一动画帧交付，避免回调同步写布局形成 Observer 循环
- 浏览器能力缺失或初始化失败时退化为无操作 cleanup
- 最后一个监听移除后自动 disconnect，并取消待交付回调
