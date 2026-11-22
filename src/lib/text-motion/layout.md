# Text Motion 自然字宽布局

`layout.ts` 提供文字动效组件统一的 grapheme 拆分、LCP/LCS 三段 diff、DOM 几何捕获与水平 FLIP。

`split.ts` 提供 `splitTextMotionWords(value, locale?)` 与 `splitTextMotionLines(node)`：分词片段保留分隔符以保证拼接后完整还原原文，在可用时优先使用 `Intl.Segmenter`，否则回退空白字符边界；分行片段在水平书写模式下从已渲染的 `Text` 节点测量，文本、字体或布局变化后需重新测量。渲染、动画、无障碍与测量时机均由调用方负责，两个工具函数不创建额外包装节点或观察器；它们属于内部 `text-motion` 工具模块，不作为包根导出，历史 SplitText action 与组件不保留兼容别名。

- 新字符先按最终字体进入自然文档流。
- 共享层只对区段或槽位承载元素做 `translateX` 补偿，不设置或动画单字符 `width`。
- `TEXT_MOTION_LAYOUT_TRANSITION` 还原 NumericText 参考源码的 `550ms` 布局过渡。
- `character.ts` 负责调用组件注入的字符 animator；纵向位移、模糊、缩放、旋转和透明度等具体视觉均不属于公共布局模块。
- 同批几何先读取后写入。SlotText / FlowText 显式启用差值叠加，NumericText 保留原有布局替换模式。
- 绝对退出层以宿主的左边缘（RTL 为右边缘）为定位原点，不使用可能为空、隐藏或执行 FLIP 的前缀区段；整段替换与清空也须保持退场文字的原有屏幕位置。
