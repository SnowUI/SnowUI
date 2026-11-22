# Frame Scale Observer

> **版本**: v1.3.2
> **职责**: 按需监听节点宽高并写入运行时比例 CSS 变量（`DG-06` 实验性／按需兼容能力，不直接覆盖视觉样式）。

## 1. 适用边界与功能概览

- `enableScaleObserver` 默认 `false`（`DG-06`）：仅在显式需要按容器实时尺寸驱动比例变量的兼容／实验场景下按需开启，新建组件不默认挂载该观察器。
- 开启后通过共享 `ResizeObserverManager` 将元素实时尺寸写入运行时变量：`--snowui-scale-height-runtime`、`--snowui-scale-width-runtime`、`--snowui-scale-aspect-ratio-runtime`、`--snowui-scale-size-runtime`。

## 2. 配置参数

| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `heightVar` | `string` | `--snowui-scale-height-runtime` | 运行时高度变量名 |
| `widthVar` | `string` | `--snowui-scale-width-runtime` | 运行时宽度变量名 |
| `aspectRatioVar` | `string` | `--snowui-scale-aspect-ratio-runtime` | 运行时高宽比变量名 |
| `sizeVar` | `string` | `--snowui-scale-size-runtime` | 运行时统一尺寸变量名 |
| `target` | `'self' \| 'parent'` | `'self'` | 监听并写入变量的目标节点 |
| `basis` | `'height' \| 'width' \| 'mixed' \| 'aspect'` | `'height'` | 统一基准尺寸 `B` 的计算依据 |
| `mixHeightWeight` | `number` | `0.5` | `mixed` 模式高度权重 |
| `aspectBaseRatio` | `number` | `1` | `aspect` 模式参考高宽比 |
| `sizeRatio` | `number` | `1` | 统一尺寸倍率 `S = B * sizeRatio` |

## 3. 计算链路与设计约束

- **基准尺寸 `B`**：`height` 取 `H`；`width` 取 `W`；`mixed` 取 `H * mixHeightWeight + W * (1 - mixHeightWeight)`；`aspect` 取 `H * ((W / H) / aspectBaseRatio)`。
- **观察与应用分离**：不直接写入 `--snowui-scale-height` / `--snowui-scale-width`，避免覆盖外部 class；视觉样式仅在 `scale.css` 的 apply 模式下生效（见 [scale.md](../styles/scale.md)）。
- **SSR 与异常降级**：模块导入与 SSR 不创建 `ResizeObserver`；浏览器挂载后首次 `watch()` 延迟创建，同帧合并并在下一帧交付；缺少 API 时降级为无操作。

```ts
use:frameScaleObserver={{
  heightVar: "--snowui-scale-height-runtime",
  widthVar: "--snowui-scale-width-runtime",
  aspectRatioVar: "--snowui-scale-aspect-ratio-runtime",
  sizeVar: "--snowui-scale-size-runtime",
  basis: "height",
  mixHeightWeight: 0.5,
  aspectBaseRatio: 1,
  sizeRatio: 1,
  target: "self"
}}
```

## 更新日志

### v1.3.2 (2026-08-17)

- 共享 `ResizeObserverManager` 改为首次 `watch()` 时延迟创建，保证模块导入与 SSR 不访问浏览器 API；缺失或初始化失败时降级为无操作。

### v1.3.1 (2026-02-07)

- **SOBS.7** 明确 observer 职责为“仅写变量不直接应用样式”，与 apply 模式分层一致。

### v1.3.0 (2026-02-07)

- **SOBS.6** 补充统一计算链路、关键字影响与 `basis size` 说明。

完整历史见 [更新日志归档](../../docs/history/changelogs/logic-frame-scale-observer.history.md)。
