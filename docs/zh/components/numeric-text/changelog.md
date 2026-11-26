# NumericText 更新日志

### v1.7.2 (2026-09-09)

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

- `motionColor` 覆盖所有目标字符，保留字符和格式符号也参加统一的逐字颜色回落序列；完整时序遵循 TextMotionSpec §2.1。
- 字符变化效果保持原有规则；未设置颜色、关闭动画（适用时）或减少动效生效时显示最终原色。连续更新重新编排颜色序列，卸载清理颜色动画。


### v1.7.1 (2026-09-08)

- 保持现有数位替换和中断方式；复用数字格式化器，批量读取几何并及时释放替换动画与清理计时器。

### v1.7.0 (2026-06-15)

- 完整复刻 `numeric-text-main` 的字符视觉与时序：恢复 `scale(0.6)`、`rotateZ(2deg)`，stagger 改为 `duration * 0.3 / 非空变化字符数`。
- `transition` 与 `respectMotionPreference` 默认值对齐参考项目，TextMotion-Demo Slow Mode 改为通过延长 `transition.duration` 实现。
- 数字趋势重新接入共享 `numeric.ts`，确保数字增加上翻、数字减小下翻。

### v1.6.2 (2026-06-15)

- 与 `numeric-text-main` 核对并恢复垂直位移 / 模糊的原始 WAAPI keyframe 结构。
- 保持缩放和旋转关闭；透明度继续负责真正的字符出现 / 消失。

### v1.6.1 (2026-06-15)

- 恢复字符进入 / 退出的透明度变化，修复新旧字符在主动画期间同时保持实色造成的重影。
- 继续保持垂直位移 + 模糊，不恢复缩放与旋转。

### v1.6.0 (2026-06-15)

- 数字内容标准化下沉到 `../lib/text-motion/format.ts`。
- `character.ts` 改为可注入 animator 的纯字符重组运行时；NumericText 自己维护垂直位移 + 模糊的出现 / 消失动效。
- 移除 NumericText 字符缩放与旋转；透明度在 v1.6.1 恢复用于完成出现 / 消失。

### v1.1.0 (2026-06-15)

- 将字符 diff、不变区段边缘 FLIP、字符进退场与变化色生命周期提炼到 `../lib/text-motion/character.ts`，NumericText 改为共享引擎的薄封装。

### v1.5.0 (2026-06-15)

- `motionColor` 默认改为 `undefined`，未显式设置时不改变文字颜色。

### v1.4.0 (2026-06-14)

- 新增 `motionRole` 数字语义定性，支持普通数字、计时器和倒计时；乘除等运算按结果变大 / 变小决定 Up / Down。

### v1.3.0 (2026-06-14)

- 数字趋势解析支持负数增减、完整时间文本的计时器 / 倒计时环形判断；加使用 Up，减使用 Down。

### v1.2.0 (2026-06-14)

- 根 `Frame` 默认启用 Frame 默认动效，内部字符 diff 与组件级 `while*` / 父级编排并行工作。

### v1.1.0 (2026-06-14)

- 统一六项排版 Props、`motionColor` 和 `as="label"`。
- 移除公开动效细节 Props。
- `respectMotionPreference` 默认 `false`。

### v1.0.0

- 新增 NumericText 组件。
