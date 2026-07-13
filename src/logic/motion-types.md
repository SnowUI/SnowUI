# motion-types.ts 文档

> **版本**: v1.3.0
> **职责**: 定义动效系统的核心类型接口，作为各模块间的契约。

## 1. 核心类型

### MotionExecutionParams
动效执行参数，适用于所有 `while*` 触发器。

```typescript
export interface MotionExecutionParams {
    delay?: number;          // 延迟 (ms)
    duration?: number;       // 持续时间 (ms)
    easing?: EasingFunction; // 缓动函数
    type?: "tween" | "spring"; // 动效类型
    stiffness?: number;      // 弹簧刚度
    damping?: number;        // 弹簧阻尼
    mass?: number;           // 弹簧质量
}
```

### MotionEvent
动效事件类型，涵盖事件驱动、形态驱动和响应式驱动。

```typescript
export type MotionEvent =
    | "whileLoad" | "whileReload" | "whileAppear" | ...
    | "whileCollapsed" | "whileExpanded"
    | "whileXs" | ... | "while2xl";
```

### MotionRegistration
动效注册接口，描述一个可被编排的动效节点。

```typescript
export interface MotionRegistration {
    id: string;
    element?: HTMLElement;
    timeline?: string;
    scroll?: Record<string, any>;
    layoutId?: string;
    scope?: "self" | "children" | "descendants" | "explicit";
    params?: MotionExecutionParams;
    onEvent?: (event: MotionEvent, payload?: any) => void;
}
```
