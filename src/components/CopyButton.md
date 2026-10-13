# CopyButton

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.0.2
> **职责**: 将文字或代码复制到剪贴板，并提供短暂的成功反馈，适合链接、标识符和安装命令。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

将文字或代码复制到剪贴板，并提供短暂的成功反馈，适合链接、标识符和安装命令。

## 使用选择

<!-- usage-guide:start -->
用于复制内容并显示复制反馈。复用其公开 getText / writeText 入口，不在页面再维护重复的成功状态。

- 静态内容使用 text，动态内容使用 getText；writeText 可替换实际复制实现。
- onCopy / onCopyError 处理业务反馈；showText=false 隐藏文字，成功反馈时间由 feedbackDuration 控制。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { CopyButton } from '@snowui-design-system/components';
</script>

<CopyButton text="pnpm add @snowui-design-system/components">Copy</CopyButton>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| text | `string` | — | 要复制的静态文本；getText 存在时优先使用其返回值，两者均未提供时复制空字符串。 |
| getText | `() => string \| Promise<string>` | — | 点击时读取复制内容，可返回 Promise；优先于 text。求值与写入剪贴板均在 pending 阶段，失败进入 onCopyError。 |
| writeText | `(text: string) => void \| Promise<void>` | `writeClipboardText` | 替换实际复制操作；Promise 完成后显示成功，抛出错误进入失败反馈。用于已有业务复制回调，避免重复写入剪贴板。 默认行为：内置剪贴板写入。 |
| feedbackDuration | `number` | `1600` | 复制成功或失败后恢复 idle 的等待时间，单位 ms，负值按 0 处理；pending 与反馈期都忽略重复点击。 |
| showText | `boolean` | `true` | 显示图标后的 children 或默认“复制”文字；false 时仅显示状态图标；bare 模式无外壳，其余模式启用 Button.iconOnly。 |
| ariaLabel | `string` | — | 覆盖可访问名称；纯图标模式默认按成功状态使用“已复制”或“复制”，带文字模式默认由内容命名。 |
| disabled | `boolean` | `false` | 阻止新的复制操作；已开始的异步复制不会因此取消。 |
| children | `Snippet` | `—（复制）` | showText=true 时替换图标后的文字，成功时仍保持该内容；false 时忽略。 |
| icon | `Snippet` | `—（Copy 图标）` | 替换非成功状态的图标；pending 和 error 仍使用该图标。 |
| successIcon | `Snippet` | `—（Check 图标）` | 复制成功时的图标内容；优先于 successContent，通过内部状态内容替换显示。 |
| successContent | `Snippet` | — | 成功图标区域的替代内容，仅在未提供 successIcon 时使用；不会替换按钮文字。 |
| onCopy | `(text: string) => void` | — | 剪贴板写入成功后接收实际复制的文本；此时组件已进入 success 状态。 |
| onCopyError | `(error: unknown) => void` | — | 动态内容读取或剪贴板写入失败时接收错误，组件进入 error 并等待反馈期复位。 |
| onclick | `(event: MouseEvent) => void` | — | 仅 idle 且未禁用时，在读取文本和复制前调用；preventDefault() 不会取消复制，反馈期内不调用。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="使用"></a>

### 使用

```svelte
<script lang="ts">
  import { CopyButton } from "@snowui-design-system/components";
</script>

<CopyButton text="SnowUI" variant="outline" />
```

平铺 Button 兼容 Props。`text` 提供静态内容，`getText` 提供同步或异步动态内容；复制成功触发 `onCopy`，失败触发 `onCopyError`。从复制开始到成功反馈结束的整个非 idle 阶段禁止重复触发；此时不设置 disabled，不改变按钮视觉，只关闭 Button 点击反馈并忽略后续点击。成功反馈在 `feedbackDuration` 后复位。不提供 parts。

`showText={false}` 启用无文字模式，只显示 Copy / Check 图标，并自动提供复制状态的 `aria-label`。图标变化使用内部 Frame 的 150ms replacement appear：复制成功显示 Check，反馈结束恢复 Copy；Button 本身不进入 Active/toggle 视觉。带文字模式下文字始终保持“复制”，只有图标执行内容替换动效。

<a id="api"></a>

### API

其他兼容视觉、链接与事件入口参见 [Button](Button.md)。CopyButton 接管 children、onclick、disabled、currentState、stateContent、whileActive、Click 和 Active，不能用这些宿主字段替代复制状态。

> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---




## AI Zone

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../specs/maintainers/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

| 关键字 | 说明 |
| --- | --- |
| text / getText | 静态或动态复制内容 |
| feedbackDuration | 成功反馈复位时间 |
| showText | `false` 时仅显示状态图标 |

- 主布局模型：宿主组件特化。
- 宿主：Button。
- Clipboard 能力复用 `../lib/clipboard.ts`。
- 默认 copy/check 由 Components 自有 `ComponentIcon` 解析；应用级 `IconProvider` 可统一替换，未命中时回退包内默认。
- Copy/Check 变化使用 Button → Frame 的 `stateContent`，与 CodeBlock 复制按钮采用同一协议。
- pending / success 反馈期保持正常 Button 样式，但 `whileClick=false` 且业务点击被忽略，避免 Check 缩小和按钮闪动。

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.0.2 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.0.1 (2026-08-11)

- `showText=false` 时主动向 Button 声明 `iconOnly=true`，保持纯图标复制按钮的尺寸与命中区域。

### v1.0.0 (2026-07-03)

- 首次实现异步复制、成功/失败事件和反馈复位。

### 状态按钮动效时长

默认图标切换以及 Button 宿主的 hover / 点击缩放统一为 150ms，与 Checkbox、Switch 的默认主要状态切换时长对齐；遵守 reduced-motion。外置显式动效配置仍按既有公开入口生效。复制成功的停留时间由 `feedbackDuration` 单独控制，不等于动效时长。
