# FlowText 更新日志归档

### v2.0.2 (2026-09-08)

- 默认主动画缩短至 550ms，逐位时序与 NumericText 一致；演示页正常速度直接使用组件默认值。
- 修复从零进入负数、静止后切换方向时沿用旧数字轴的问题；加减一不再绕行九格。
- 同步 TextMotion-Demo 输入值处理，手动输入后加减按钮继续执行数值计算。

### v2.0.1 (2026-09-08)

- 数字滚轮和文字进退场支持连续重定向；保留当前轨迹与方向，批量测量遮罩并取消逐位轮询。

### v2.0.0 (2026-06-16)

- 删除数字和普通字符两套运行时，所有内容统一接入公共字符重组能力。
- 字符出现 / 消失统一复刻 `number-flow-main` 的纵向数位流与 AnimatePresence opacity 视觉。
- `scaleY` 变形从位移开始时立即触发，并新增 `transition.deformDuration` / `transition.deformEasing` 独立控制变形速度与缓动。
- 字符遮罩改为每个动效字符一个临时静止窗口，复用 NumberFlow 的 mask 渐变、宽度与位置；窗口绝对定位，不改变字符占位宽度，静态字符不常驻 mask。
- 滚动距离改为 `100% - 0.22em overlap` 负间距试验方案；遮罩使用不参与布局的扩展 viewport，glyph offset 回真实字符原点，避免窄字符直接承载 NumberFlow mask 时被横向/纵向渐变吃掉。
- 数字、计时器和倒计时保留公共趋势、顺序和 modulo 语义；变化数字由 FlowText animator 临时渲染连续 wheel，复刻 NumberFlow 的 `--wheel-v` 轨道，并使用更强的先快后慢 ease-out 推进。
- TextMotion-Demo Slow Mode 可通过 `transition` 等比放慢 FlowText 的纵向 flow、opacity 与 stagger。
