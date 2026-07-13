# frame-prop-filter.ts 文档

> **版本**: v1.1.0
> **职责**: 统一维护 Frame 内部关键字识别规则，同时提供 DOM 过滤与复合组件 props 分发能力。

## 功能

- `filterFrameDomProps(frameProps)`：
  - 提取原生事件处理器 `eventHandlers`
  - 移除内部关键字后输出 `domProps`
  - 提供 `disabled` 统一布尔值
- `isFrameInternalProp(key, options?)`：
  - 判断某个 prop 名是否属于 Frame 内部关键字
  - 支持附加 `customStates` 对应的动态状态名识别
- `splitFrameHostProps(source, options?)`：
  - 将复合组件收到的 props 拆分为 `frameProps` 和 `hostProps`
  - 适用于 `Input / Textarea / Select` 这类“外层 Frame + 内层原生宿主元素”的组件

## 设计说明

- 将“DOM 透传白/黑名单”集中管理，避免 `Frame.svelte` 里超长解构列表。
- 将“复合组件 props 分发规则”与 “Frame DOM 过滤规则”收敛到同一份关键字真相来源，避免组件侧再维护一套平行白名单。
- 便于后续在 standards 检查脚本中复用关键字集合。

## 更新日志

### v1.1.0 (2026-03-14)

- 新增 `isFrameInternalProp` 与 `splitFrameHostProps`，供 `Input / Textarea` 等复合组件复用。
- Frame DOM 过滤改为复用同一份内部关键字识别逻辑，减少重复维护。

### v1.0.0 (2026-02-07)

- 新增 Frame 属性过滤模块，减少 `Frame.svelte` 内联解构复杂度。
