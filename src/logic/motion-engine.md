# motion-engine.ts 文档

> **版本**: v1.4.0
> **职责**: 负责具体的动画执行逻辑，包括 Tween 和 Spring 动画的计算与应用。它是无状态的，只负责"执行"。

## 1. 核心函数

### applyAppearAnimation
应用生命周期进入动效到元素。

```typescript
function applyAppearAnimation(element: HTMLElement, config: any): void
```
- **职责**: 解析配置，设置初始状态，并在下一帧应用目标状态以触发 CSS Transition。
- **支持**: Opacity, Scale, Translate, Rotate, Height (支持增量)。

### runSpringAnimation
运行物理弹簧动画。

```typescript
function runSpringAnimation(element: HTMLElement, config: any, toTransforms: string[], targetHeight: string | null, baseTransform?: string): void
```
- **职责**: 使用物理公式或模拟算法执行弹簧动画。
- **注意**: 通过 `motion/spring.ts` 将 stiffness / damping / mass 物理公式采样为 CSS `linear()`，无需引入运行时物理库，并保留真实弹簧的轻微越界轨迹。

### applyReverseAnimation
应用反向动效（用于 Reset 或反向播放）。

```typescript
function applyReverseAnimation(element: HTMLElement, config: any): void
```
- **职责**: 将元素从当前状态恢复到初始状态（或反向状态）。

## 2. 工具函数

### getAnimationConfig
从元素获取动效配置。

```typescript
function getAnimationConfig(element: HTMLElement): any
```
- **来源**: 优先读取 `--snowui-frame-while-appear`，其次 `--snowui-frame-while-idle`，再次 `--snowui-frame-while-hover` CSS 变量。
- **解析**: 将 CSS 变量中的 JSON 字符串解析为对象。
