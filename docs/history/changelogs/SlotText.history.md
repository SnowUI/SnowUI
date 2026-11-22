# SlotText 更新日志归档

### v1.10.0 (2026-06-16)

- 补齐 `slot-text-main` 的 `isTail` 尾部删除规则：超出新文本长度的旧字符缩短为 `0.75` 倍时长，并从整行中段加入退场波次。

### v1.9.0 (2026-06-16)

- 默认退出方向改为向上，与 NumericText 默认文字方向一致。
- 字符进入和退出加入与 NumericText 一致的透明度变化：进入 `0 -> 1`，退出 `1 -> 0`。

### v1.8.0 (2026-06-15)

- 接入 NumericText 同源公共时间轴，将自然宽度提交、保留字符 FLIP 与变化字符进退场统一到同一重组时机；修复宽度变化挤压尚未退出字符的问题。
- 布局 FLIP 不再叠加 `exitOffset`，普通文字 stagger 改为变化中段局部顺序，避免长前缀造成进退场延迟。

### v1.7.0 (2026-06-15)

- 按 `slot-text-main` 复刻 SlotText：默认方向改为 `down`，默认 `interrupt=true`、`playOnMount=false`，恢复 `45ms` stagger 与 wobble；字符处理切到 NumericText 同源 LCP / LCS + FLIP，SlotText 只保留垂直槽位滚动视觉。
- `replayKey` 改为只在文字未变化时触发整行重播；正常 text 变化保持参考项目的相同字符静止策略。
- 支持 TextMotion-Demo Slow Mode 的 `transition` 覆盖，并收紧混合文案判断，避免含数字的普通文本误走数字右到左顺序。

### v1.6.0 (2026-06-15)

- `motionColor` 默认改为 `undefined`，未显式设置时不改变文字颜色。

### v1.5.0 (2026-06-14)

- 新增 `motionRole` 数字语义定性，支持普通数字、计时器和倒计时；乘除等运算按结果变大 / 变小决定 Up / Down。

### v1.4.0 (2026-06-14)

- 数字趋势解析支持负数增减、完整时间文本的计时器 / 倒计时环形判断；加向上、减向下。

### v1.3.0 (2026-06-14)

- 当时默认值按确认截图调整为物理向上滚动、`stagger=45ms`、`duration=300ms`、`bounce=0.6`、`skipUnchanged=true`、`interrupt=false`；该中断策略已在 v1.7.0 按 `slot-text-main` 覆盖为 `interrupt=true`。
- 新增 `trend` 数字趋势语义；数字增加向上、减少向下，变化数位从低位到高位启动；后续方向 API 已收敛为 `normal` / `reverse` 语义。

### v1.2.0 (2026-06-14)

- 根 `Frame` 默认启用 Frame 默认动效，内部槽位动画与组件级 `while*` / 父级编排并行工作。

### v1.1.0 (2026-06-14)

- 统一六项排版 Props 与 `motionColor`。
- 移除公开动效细节 Props。
- `respectMotionPreference` 默认 `false`。
