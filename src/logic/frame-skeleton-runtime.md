# frame-skeleton-runtime.svelte.ts

> **版本**: v1.1.0
> **职责**: 统一处理 Frame 的 Skeleton probe、子骨架探测与加载渲染前判定。

`frame-skeleton-runtime.svelte.ts` 承接 `Frame.svelte` 中与默认加载协议直接相关的运行时逻辑，包括：

- `shouldRenderSkeleton`、`needsSkeletonProbe` 等渲染前判定
- 首层已自注册子骨架的探测与 `renderHints`（含 radius）解析
- `MutationObserver` 驱动的 probe 更新

该模块只负责 Skeleton 运行时判定与探测，不接管 `Frame.svelte` 中最终的模板渲染分支。

自注册判定以组件根 `renderHints` 为准：Frame DOM runtime 输出 `data-skeleton-registered="true"`，直接以 Skeleton 为加载根的窄例外输出同一标记；父 Frame probe 只收集第一层带该标记的元素。运行时不再依赖 `getSkeletonComponentKey()`；没有直接 hints、也没有已注册 child 时渲染通用 fallback。

---

## 更新日志 (Changelog)

### v1.1.0 (2026-08-15)

- 以 `renderHints` / `data-skeleton-registered` 取代集中 class key 作为内部登记信号。
- probe 新增 `data-render-hint-radius`，并只收集第一层已注册 child。
- 任意 loading + skeleton Frame 均可生成直接或 fallback 骨架。

### v1.0.0 (2026-03-09)

- **Init**: 从 `Frame.svelte` 抽离 Skeleton probe、首层子骨架收集、`renderHints` 解析与渲染前判定，保持 `Frame` 模板分支与公开协议不变。
