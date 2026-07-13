# frame-scale-resolver.svelte.ts 文档

> **版本**: v1.0.0
> **职责**: 统一解析 Frame 的 Scale 配置，输出 observer 参数与 style 变量注入列表。

## 功能

- `resolveScaleObserverOptions(frameProps)`：
  - 产出 `frameScaleObserver` 所需配置（含默认值）。
- `resolveScaleStyleVars(frameProps)`：
  - 产出 `--snowui-scale-*-prop` 变量注入列表，供 `Frame.svelte` 写入 style。

## 关键字映射

- `scaleHeightVar` / `scaleWidthVar` / `scaleAspectRatioVar` / `scaleSizeVar`
- `scaleObserverTarget` / `scaleBasis`
- `scaleMixHeightWeight` / `scaleAspectBaseRatio`
- `sizeRatio` / `iconSizeRatio` / `avatarSizeRatio`

## 更新日志

### v1.0.0 (2026-02-07)

- 新增 Scale 配置解析器模块，降低 `Frame.svelte` 复杂度。

