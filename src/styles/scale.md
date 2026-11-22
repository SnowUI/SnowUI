# Scale 比例计算样式

> **版本**: v1.5.0
> **职责**: 提供实验性／按需启用的容器尺寸比例计算样式（`DG-06`），支持外部 class 覆盖。

## 适用边界（`DG-06`）

- `scale.css` 与 `enableScaleObserver` 属于**实验性／按需兼容能力**，**不是**新建公共组件的默认强制依赖；常规组件优先使用 `tokens.css` 的标准尺寸档位与 `size` Context。
- `.snowui-scale` 默认仅计算变量，不覆盖现有视觉样式；仅当设置 `data-scale-apply="true"`（显式传入 `sizeRatio` / `iconSizeRatio` / `avatarSizeRatio` 时自动写入）或添加 `.snowui-scale-apply` 类时才应用比例样式。
- Scale 输出的文字字号与功能图标画布最小为 `12 CSS px`，不随根字号继续缩小。

## 计算与覆盖规则

1. **计算依据（`scaleBasis`）**：支持 `height`（默认）、`width`、`mixed`（按 `--snowui-scale-mix-height-weight` 加权）与 `aspect`（相对 `--snowui-scale-aspect-base-ratio`）。
2. **可用内容高度**：文字与 gap 按 `容器高度 - 2 × padding-y` 计算；圆角与内边框按容器基准尺寸比例计算。
3. **覆盖优先级**：`外部 class 覆盖变量（--snowui-scale-text-size / --snowui-scale-icon-size / --snowui-scale-padding-x/y / --snowui-scale-gap / --snowui-scale-radius 等） > Frame props 显式比例 > 默认比例计算`。

## 使用示例

```svelte
<!-- Opt-in proportional observation via Frame -->
<Frame
  class="snowui-scale"
  enableScaleObserver={true}
  scaleBasis="height"
/>
```

```css
.button-scale-sm {
  --snowui-scale-height: var(--size-7);
  --snowui-scale-width: 7.5rem;
  --snowui-scale-ratio-text: 0.5;
  --snowui-scale-ratio-icon: 0.5714;
  --snowui-scale-ratio-padding-x: 0.4286;
  --snowui-scale-ratio-padding-y: 0.1429;
}
```

## AI Zone

- 样式实现：[scale.css](scale.css)
- 样式入口：[index.css](index.css)
- 运行时观察器：[frame-scale-observer.md](../logic/frame-scale-observer.md)

## 更新日志

### v1.5.0 (2026-02-07)

- **SC.12** 将 scale 分为“变量计算层”和“样式应用层”，默认仅计算不覆盖视觉样式。
- **SC.13** 新增 apply 模式入口：`data-scale-apply="true"` 或 `.snowui-scale-apply`。

### v1.4.0 (2026-02-07)

- **SC.9** 新增统一尺寸输入：`--snowui-scale-size-runtime` 与 `--snowui-scale-size-ratio`。
- **SC.10** 新增 Icon/Avatar 独立比例：`--snowui-scale-icon-ratio` / `--snowui-scale-avatar-ratio`。

### v1.3.0 (2026-02-07)

- **SC.6** 新增宽度与高宽比输入变量（显式 + 运行时）及四种 `basis` 模式。

完整历史见 [更新日志归档](../../docs/history/changelogs/styles-scale.history.md)。
