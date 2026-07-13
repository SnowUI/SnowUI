# frame-utils.ts 文档

> **版本**: v1.0.0
> **职责**: 提供 Frame 组件逻辑所需的通用工具函数。

## 1. hasMotionConfig

检查 Props 对象是否包含任何动效相关的配置。

```typescript
export function hasMotionConfig(props: FrameProps): boolean
```

**用途**:
- 决定是否需要自动生成组件 ID（如果用户未提供）。
- 决定是否需要将组件注册到 `Motion` 编排器。

**检查的属性**:
- `orchestrate`
- 所有 `while*` 触发器 (如 `whileHover`, `whileAppear`)
- `timeline`
- `variants`

## 2. motionConfigToStyle

将 `MotionConfig` 转为 Frame 可消费的内联 CSS 变量与 keyframe 声明。数组形式的 `blur` 输出 `--snowui-frame-blur-from/to`，与 opacity、transform 在同一 keyframe 中并行执行；数字 blur 按 px 处理。
