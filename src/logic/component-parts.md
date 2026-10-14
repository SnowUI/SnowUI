# component-parts

> **职责**：为复合组件提供 `parts.ComponentName` 的直接所有权边界、父级默认 Props 读取，以及 class/style 合并。

## API

### `provideComponentParts(getParts)`

在复合组件边界提供 parts。通常由根 Frame 的 `componentParts` 内部入口调用；没有显式 parts 时也会建立空边界，阻止祖先配置递归穿透。

### `useComponentPart(ComponentName)`

子组件读取最近父级同名 part。名称必须使用 SnowUI 公开组件名 PascalCase。

显式内容（包括 Frame 的 `stateContent` Snippet）应在无 DOM 的 `ComponentPartsBoundary` 内渲染，建立空 parts 边界；父级生成的默认子项仍可从父级 Context 读取 part，或由父级直接传入对应 Props。边界只隔离 parts，不阻断其他组合 Context。若默认子项位于多层 Frame 内，拥有者须在最后一层直接承载该子项的 Frame 显式传入 `componentParts`；不能仅在外层 `provideComponentParts` 后假定它会穿透 Frame。

### `mergeComponentPartProps(part, explicitProps)`

合并顺序：

```text
实例显式 Props > part
```

- class：保留 part class 与实例 class。
- style：part style 在前、实例 style 在后。
- 其他字段：实例显式值覆盖 part。

## 边界

- 本模块只解析输入，不拥有业务 value/open/ARIA/事件。
- 受控字段由父组件类型和实现排除。
- 不扫描 DOM 或组件 class。
- 正式规范见 `../../../specs/maintainers/ComponentGuidelines.md §2.6.8` 与 `../../../specs/maintainers/StyleSpec.md §2.6`。
