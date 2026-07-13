# frame-skeleton-runtime.svelte.ts

> **版本**: v1.0.0
> **职责**: 统一处理 Frame 的 Skeleton probe、子骨架探测与加载渲染前判定。

`frame-skeleton-runtime.svelte.ts` 承接 `Frame.svelte` 中与默认加载协议直接相关的运行时逻辑，包括：

- `shouldRenderSkeleton`、`needsSkeletonProbe` 等渲染前判定
- 首层子骨架的探测与 `renderHints` 解析
- `MutationObserver` 驱动的 probe 更新

该模块只负责 Skeleton 运行时判定与探测，不接管 `Frame.svelte` 中最终的模板渲染分支。

---

## 更新日志 (Changelog)

### v1.0.0 (2026-03-09)

- **Init**: 从 `Frame.svelte` 抽离 Skeleton probe、首层子骨架收集、`renderHints` 解析与渲染前判定，保持 `Frame` 模板分支与公开协议不变。
