# Text Motion 自然字宽布局

`layout.ts` 提供文字动效组件统一的 grapheme 拆分、LCP/LCS 三段 diff、DOM 几何捕获与水平 FLIP。

- 新字符先按最终字体进入自然文档流。
- 共享层只对区段或槽位承载元素做 `translateX` 补偿，不设置或动画单字符 `width`。
- `TEXT_MOTION_LAYOUT_TRANSITION` 还原 NumericText 参考源码的 `550ms` 布局过渡。
- `character.ts` 负责调用组件注入的字符 animator；纵向位移、模糊、缩放、旋转和透明度等具体视觉均不属于公共布局模块。

- 同批几何先读取后写入。SlotText / FlowText 显式启用差值叠加，NumericText 保留原有布局替换模式。

- 绝对退出层以宿主的左边缘（RTL 为右边缘）为定位原点，不使用可能为空、隐藏或执行 FLIP 的前缀区段；整段替换与清空也须保持退场文字的原有屏幕位置。
