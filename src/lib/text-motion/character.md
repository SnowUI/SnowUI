# Text Motion 字符重组运行时

`character.ts` 负责普通文字和数字文本共用的字符差异识别、节点重组、自然排版与生命周期管理，不定义具体组件的字符视觉。

空字符区段不参与布局，避免没有文字的区段提供合成基线，使 NumericText 和 FlowText 与普通文字产生垂直偏移。

## 公共逻辑

1. 使用 grapheme 级 LCP/LCS 拆出不变前缀、变化中段和不变后缀。
2. 新中段按最终字体自然排版；旧中段移入独立绝对定位退场层。
3. 不变前缀和后缀依据变化前后的边缘位置执行区段 FLIP，避免文字宽度变化时突然跳位。
4. 通过 `TextMotionCharacterAnimator` 将元素、进入 / 退出状态、趋势、delay、duration 与 easing 交给组件。
5. 监听组件返回的 Animation；旧字符完成后删除节点和临时退出层。未返回 Animation 时按公共时长兜底清理。
6. 普通文本变化中段按节点索引从左到右启动；数字运算变化按低位到高位启动。delay 使用 `duration * 0.3 / 非空变化字符数` 的参考项目公式。
7. 变化字符在主要动效期间保持 `motionColor`，结束后以共享 `280ms linear` 回到最终颜色。
8. NumericText 路径显式 `trend` 优先；否则复用 `numeric.ts` 判断数字增加 / 减少、负数、计时器与倒计时，无法解析的普通文字默认使用正向进入语义。

## 视觉边界

`character.ts` 不得包含缩放、旋转、模糊、透明度或具体位移幅度等组件视觉。`NumericText` 与 `FlowText` 的非数字路径必须复用该运行时，但各自在组件文件中定义 animator。NumericText 的字符出现 / 消失视觉完整复刻 `numeric-text-main`，包含垂直位移、缩放、旋转、模糊与可见性淡入淡出。
