# primitives.ts

> 版本：v1.0.0  
> 职责：提供可组合的 Frame 原子动效构建器。

## 导出

| 导出 | 说明 |
| :--- | :--- |
| `composeMotionConfigs(...configs)` | 合并多个 `MotionConfig`，供使用方在页面侧自由组合原子动效 |
| `createFadeMotion(opacity, timing?)` | 构建透明度动效 |
| `createScaleMotion(scale, timing?)` | 构建缩放动效 |
| `createSlideYMotion(y, timing?)` | 构建垂直位移动效 |
| `createStackTranslateMotion(y, timing?)` | 构建堆叠位移动效；语义上等同于 `slideY`，但用于多层堆叠场景 |

## 设计约束

- 原子动效只描述单个 Frame 自身的动作，不负责跨 Frame 编排。
- 原子动效不强行写死 Toast 数值；具体参数由使用方传入。
- 复杂效果由使用方通过 `composeMotionConfigs(...)` 叠加完成。
- 原子动效组合为并行播放；当多个原子动效默认时长相同时，组合后的持续时间不叠加。
- 显式组合 `fadeIn + scaleIn` 时默认并行时长为 `250ms`；Frame generic `whileAppear` 默认只使用 fadeIn。
