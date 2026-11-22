# ScrambleText 更新日志归档

### v1.3.1 (2026-09-08)

- 连续更新延续正在运行的字符进度；无颜色时复用文本节点；有颜色时复用逐字符节点，仅在实际换字时更新画面。

### v1.3.0 (2026-06-15)

- `motionColor` 默认改为 `undefined`，未显式设置时不改变文字颜色。

### v1.2.0 (2026-06-14)

- 根 `Frame` 默认启用 Frame 默认动效，内部扰动动画与组件级 `while*` / 父级编排并行工作。

### v1.1.0 (2026-06-14)

- 统一六项排版 Props 与 `motionColor`。
- 将 cascade 时序完全内部化。
- `respectMotionPreference` 默认 `false`。

### v1.0.0 (2026-06-11)

- 新增 ScrambleText 组件。
