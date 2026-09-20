# ExpandButton

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../specs/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。


> **版本**: v1.0.2
> **职责**: 以真实 Button 为宿主的展开 / 收起二态按钮。

## 组件介绍

在展开与收起之间切换，用一致的按钮反馈表达状态，适合折叠内容和详情入口。

## 使用

```svelte
<script lang="ts">
  import { ExpandButton } from "@snowui-design-system/components";
  let expanded = $state(false);
</script>

<ExpandButton bind:expanded bare />
```

- `expanded` / `defaultExpanded`：受控值与默认值。
- `onExpandedChange`：值切换回调。
- `icon` / `collapseIcon`：替换默认的放大、收起图标。
- `ariaLabel` / `collapseAriaLabel`：两种状态的辅助文本。
- 默认图标为 `arrows-out-simple` / `arrows-in-simple`，内容替换使用轻量状态按钮的 150ms replacement appear 动效。

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `expanded` | `boolean` | — | 当前展开状态，支持 bind:expanded；未定义时使用 defaultExpanded。点击后写入新布尔值；内容区域由调用方显示或隐藏。 |
| `defaultExpanded` | `boolean` | `false` | expanded 未定义时的回退状态；首次点击后使用组件写入的 expanded，不再由此值驱动。 |
| `ariaLabel` | `string` | `"展开"` | 未展开时按钮的可访问名称，应描述将要执行的展开动作。 |
| `collapseAriaLabel` | `string` | `"收起"` | 已展开时按钮的可访问名称，应描述将要执行的收起动作。 |
| `icon` | `Snippet` | —（arrows-out-simple） | 未展开时的自定义图标；只替换图形，展开状态与 aria-expanded 仍由组件管理。 |
| `collapseIcon` | `Snippet` | —（arrows-in-simple） | 已展开时的自定义图标；使用组件现有内容替换动效。 |
| `children` | `Snippet` | — | 图标后的自定义内容；不提供时启用 Button.iconOnly。组件不自动创建或控制展开面板。 |
| `onExpandedChange` | `(expanded: boolean) => void` | — | 点击切换后接收新状态，先于 onclick 调用；外部赋值不会触发。 |
| `onclick` | `(event: MouseEvent) => void` | — | 状态写入及 onExpandedChange 之后调用，不能取消已经完成的切换；禁用时不调用。 |

其他兼容视觉、链接与事件入口参见 [Button](./Button.md)。ExpandButton 接管 children、onclick 和 aria-expanded；继承 disabled 阻止用户切换。

> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

| 关键字 | 说明 |
| --- | --- |
| expanded / defaultExpanded | 展开状态与默认值 |
| icon / collapseIcon | 两种状态的图标槽 |
| onExpandedChange | 展开状态变更回调 |

- 主布局模型：宿主组件特化。
- 宿主：Button，宿主 Props 平铺。
- 图标属于内部基础设施，不提供 parts。
- 作为父组件的默认内置依赖时，可消费 `parts.ExpandButton`。

## 更新日志 (Changelog)

### v1.0.2 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.0.1 (2026-08-11)

- 无额外 children 时主动向 Button 声明 `iconOnly=true`，保持默认展开图标按钮布局。

### v1.0.0 (2026-07-03)

- 首次实现 Button 宿主特化、展开语义与图标替换动效。

### 状态按钮动效时长

默认图标切换以及 Button 宿主的 hover / 点击缩放统一为 150ms，与 Checkbox、Switch 的默认主要状态切换时长对齐；遵守 reduced-motion。外置显式动效配置仍按既有公开入口生效。
