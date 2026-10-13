# component-parts

> **职责**：为复合组件提供 `parts.ComponentName` 的直接所有权边界、父级默认 Props 读取，以及 class/style 合并。

## API

### `provideComponentParts(getParts)`

在复合组件边界提供 parts。通常由根 Frame 的 `componentParts` 内部入口调用；没有显式 parts 时也会建立空边界，阻止祖先配置递归穿透。

### `useComponentPart(ComponentName)`

子组件读取最近父级同名 part。名称必须使用 SnowUI 公开组件名 PascalCase。

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
