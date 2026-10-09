# Segmented

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；旧 OSS / PRO 标签仅表示迁移期技术来源。

> **版本**: v1.3.0
> **职责**: 将少量互斥选项并排展示，便于快速切换筛选条件或参数，并支持键盘与表单交互。
> **包归属**: `@snowui-design-system/components/compat`
> **文档修订**: 2026-09-21

## 组件介绍

将少量互斥选项并排展示，便于快速切换筛选条件或参数，并支持键盘与表单交互。

## 使用选择

<!-- usage-guide:start -->
用于多个互斥参数或过滤条件之间单选，使用 radiogroup 语义。切换不同内容面板或视图时使用 Tab。

- 使用 bind:value 与稳定选项值；缺失或不匹配时只视觉回退到首项，不自动写回绑定值，表单请显式初始化。
- 显式子项使用 Button as="item"；name 非空时提供隐藏表单字段，表单重置由应用恢复业务值。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Segmented } from '@snowui-design-system/components/compat';
</script>

<Segmented size="lg" value="all" aria-label="Filter components by tier" items={[{ value: 'all', label: 'All' }, { value: 'oss', label: 'OSS' }, { value: 'pro', label: 'PRO' }]} />
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | `string` | — | 当前选项的唯一值，支持 `bind:value`；点击或方向键激活选项时更新。未指定或没有匹配项时，视觉回退到首个可用项，但不会自动写回绑定值；表单场景应显式初始化。 |
| name | `string` | — | 非空时输出同名隐藏字段，原生 FormData 读取当前 value；未定义值提交为空字符串。需置于表单内部；业务绑定初值的恢复由调用方在 reset 时处理。 |
| children | `Snippet` | — | 无参数的显式子项内容，使用 Button as="item" 与唯一 value；优先于 items，逐项直接配置 Button Props。 |
| class | `string` | `""` | 合并到真实 Tab 根节点的外部 class，保留 Segmented 自身标识；不作用于隐藏表单字段。 |
| parts | `ComponentPartsOf<{ Button: typeof Button }>` | — | 通过 parts.Button 批量配置 items 模式生成的 Button，例如 scaleOnHover；不覆盖显式 children 子项，不提供 parts.Tab。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="默认内置模式-显式组合模式"></a>

### 默认内置模式 / 显式组合模式

- **Tab 宿主组件特化**：Segmented 实际渲染真实 Tab，全部兼容 Tab Props 在根级平铺；不提供 `parts.Tab`。
- 默认内置模式（推荐）：`items` 交给 Tab 生成 Button；`parts.Button` 沿默认生成链路显式转发。
- 显式组合模式：显式书写 `<Button as="item">`，逐项 Props 直接配置。

> **版本**: v1.3.0
> **状态**: 已实现(PRO)
> **职责**: RadioGroup 的视觉变体,在多个互斥选项之间切换"过滤器/参数"。视觉系统
> 与 [Tab](Tab.md) 完全共享,在 ARIA 语义、键盘行为、Form 接入上区分。
> **设计稿**: Figma node `11838-19967`

---

<a id="1-与-tab-的关系"></a>

### 与 Tab 的关系

| 维度 | Tab | Segmented |
| :--- | :--- | :--- |
| 语义 | "视图/内容区"切换 | "过滤器/参数"单选 |
| ARIA role | `tablist` / 子项 `tab`(隐式 button) | `radiogroup` / 子项 `radio` |
| 方向键 | 仅切焦点(`selectionFollowsFocus=false`),Enter 激活 | 直接切换并激活(`selectionFollowsFocus=true`) |
| 接入 Form | 否 | 是(`name` 属性 + 内部 hidden input) |
| 视觉(variant/size/token) | **完全相同** | **完全相同** |

Segmented 是 Tab 的宿主组件特化：真实 Tab 是主要视觉表面、交互节点和根 DOM；Segmented 只固定 radiogroup 语义、方向键直切行为，并增加 `name` 隐藏表单字段。

Segmented 继承 Tab 的复合控件 hover 规则：item 默认不放大，保留原有颜色与 indicator 反馈；可通过子 Button 或 `parts.Button.scaleOnHover=true` 显式开启。

### 宿主 Props 与所有权

- 类型来源：`ComponentProps<typeof Tab>`。
- 受控字段：`value`、`children`、`role`、`itemRole`、`selectionFollowsFocus`、`class`、`parts`。
- Tab 继续拥有 variant、size、布局、indicator、键盘基础逻辑、Frame Props 与原始 DOM。
- Segmented 拥有 radiogroup/radio ARIA、直切语义、name hidden input 及顶层 class 合并。
- hidden input 是 Tab 根之后的无视觉辅助节点；不复制 Tab 表面。

---

<a id="2-api"></a>


### 2.1 Props

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `variant` | `'pill' \| 'solid' \| 'underline' \| 'icon-toggle' \| 'bare'` | `'pill'` | pill 为带背景滑块，solid 为实色选中项，underline 为下划线，icon-toggle 仅展开选中项文字，bare 仅通过透明度区分。icon-toggle 子项需包含 Icon 与 Text，或在 items 中同时提供 icon 与 label。 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | 控制容器 padding、radius、gap，并作为 Button 子项默认尺寸；子项优先级为 style > class > Button size > Segmented size。 |
| `row` | `boolean` | `false` | 显式横向排列；row 与 column 都未启用时仍按横向显示，两者同时为 true 时 row 优先。 |
| `column` | `boolean` | `false` | 纵向排列，方向键改为上下切换；仅在 row 未启用时生效。 |
| `fill` | `boolean` | `false` | 容器有明确宽度时，让横向子项等宽填满；未限定宽度时按内容布局。 |
| `onChange` | `(value: string) => void` | — | 用户激活不同的可用选项后调用，参数为新 value；与绑定值同步，不可取消选择。重复激活当前项不触发。 |
| `enableDefaultMotion` | `boolean` | `true` | 传递给宿主的默认动效开关；关闭默认 Frame 动效，不改变选择值、键盘或表单语义。 |
| `items` | `TabItem[]` | `[]` | 默认内置选项。每项必填唯一 value 与可读 label，可选 icon 组件与 disabled；禁用项不可选择。提供 children 时改用显式内容，不渲染 items。 |
| 其余兼容 Props | `ComponentProps<typeof Tab>` | 同 Tab | 直接传递给 Tab 宿主；role、itemRole、selectionFollowsFocus 由 Segmented 固定，不可作为普通 Tab 参数改写。 |

### 2.2 子项约定

同 [Tab.md §2.2](Tab.md):子项必须是 `<Button as="item" value="...">`。

---

<a id="3-form-接入"></a>

### Form 接入

```svelte
<Form onSubmit={data => console.log(data)}>
  <Segmented name="device" value="web">
    <Button as="item" value="web">Web</Button>
    <Button as="item" value="mobile">Mobile</Button>
  </Segmented>
</Form>
<!-- 提交后:{ device: "web" } -->
```

实现:当传入 `name` 时,Segmented 在 Tab 根节点之后追加 `<input type="hidden" name={name} value={value}>`,通过原生表单提交机制把当前 value 暴露给 Form。

---

<a id="5-动效"></a>

### 动效

完全继承 Tab。详见 [Tab.md §4](Tab.md)。

---

<a id="6-键盘行为"></a>

### 键盘行为

- `←` / `→`(row)或 `↑` / `↓`(column):**直接切换并激活**(Tab 的 `selectionFollowsFocus=true` 模式)。
- `Home` / `End`:跳到首/末项并激活。
- 焦点行为与 Tab 一致(roving tabindex)。

---

<a id="7-使用示例"></a>

### 使用示例

```svelte
<script lang="ts">
  import { Button, Icon } from '@snowui-design-system/components';
  import { Segmented } from '@snowui-design-system/components/compat';
  import { FourLeafClover, Star } from '@snowui-design-system/resource-svelte';
  let value = $state('web');
</script>

<Segmented bind:value variant="pill" size="md">
  <Button as="item" value="web"><Icon><FourLeafClover /></Icon>Web</Button>
  <Button as="item" value="mobile"><Icon><Star /></Icon>Mobile</Button>
</Segmented>

<!-- Figma fill 宽度 -->
<Segmented fill style="width: calc(var(--size-20) * 4)" value="web">
  <Button as="item" value="web">Web</Button>
  <Button as="item" value="mobile">Mobile</Button>
</Segmented>

<!-- bare -->
<Segmented variant="bare" value="all">
  <Button as="item" value="all">All</Button>
  <Button as="item" value="random" iconOnly aria-label="收藏"><Icon><Star /></Icon></Button>
</Segmented>

<!-- 接入 Form -->
<form>
  <Segmented name="device" value="web" variant="solid">
    <Button as="item" value="web">Web</Button>
    <Button as="item" value="mobile">Mobile</Button>
  </Segmented>
</form>
```

---



## AI Zone

<a id="4-样式-token"></a>

### 样式 Token

完全继承 Tab。详见 [Tab.md §3](Tab.md)。

`--snowui-tab-*-override` 变量同样适用于 Segmented(Segmented 内部包裹 Tab,共享同一组 CSS 变量与类名)。

`pill` 与 `icon-toggle` 变体继承 Tab 的 `blur(1.25rem)`（20px）背景模糊；可通过 `--snowui-tab-background-blur-override` 覆盖。

---

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.2.2 (2026-08-14)

- `icon-toggle` 变体同步继承 Tab 的 20px 背景模糊。

### v1.2.1 (2026-08-14)

- 默认 `pill` 变体继承 Tab 与 SearchBox 同级的 20px 背景模糊及公开 override。

### v1.2.0 (2026-07-05)

#### 架构调整
- 正式改为 Tab 宿主组件特化模式，兼容 Tab Props 从宿主类型推导并平铺。
- 移除 `parts.Tab`；默认内置 Button 继续使用 `parts.Button`，显式 Button 直接配置 Props。
- 修复 items 模式被空 children snippet 截断、导致 Tab 不生成内置 Button 的问题。
- Form hidden input 移到 Tab 根之后，保持 Tab 作为主要宿主。

### v1.1.1 (2026-06-23)

#### 与 Tab 同步
- Item 尺寸样式优先级同步为 `style > class > Button size > Tab size`。

### v1.1.0 (2026-06-23)

#### 与 Tab 同步
- 继承 `variant="bare"`、12/16/20px gap、无 indicator 视觉及文字 / Icon 内容支持。
- 继承 Tab size → Button Item size context；Segmented 不复制 Button 尺寸定义。

### v1.0.5 (2026-06-21)

#### 动效与组合契约
- 继承 Tab icon-toggle indicator 移动修复；尺寸变化统一消费 Frame 默认 size motion bridge。
- 显式透传 `enableDefaultMotion`，默认开启。
- 所有 Test 示例的 Button 子项补齐 `as="item"`。

### v1.0.4 (2026-06-18)

#### 动效还原
- 当时随 Tab 使用专用 Tabs sliding 时序；v1.0.5 起已迁移到 Frame transform / size motion bridge。

### v1.0.3 (2026-05-31)

#### 样式调整
- 继承 Tab v1.0.3：active Text / Icon 在 pill / icon-toggle 使用 `--static-black-100`，在 underline 使用 `--primary`，在 solid 保持 Button 默认颜色链；inactive 统一使用 `--black-100 × opacity: 0.4`。
- 背景滑块复用 Tab 的 transitions.dev Tabs sliding 时序：位置与宽高均使用 250ms、`cubic-bezier(0.22, 1, 0.36, 1)`，首次定位与 resize 不播放动效。
- 四种 variant 测试展示示例均补充 Icon，便于观察与 Tab 一致的颜色继承。

### v1.0.2 (2026-05-31)

#### 样式调整
- 继承 Tab v1.0.2：inactive Text / Icon 保持 Button 默认 `--black-100`，active Text / Icon 使用 `--static-black-100`；inactive 的 40% 视觉仍由整体 `opacity: 0.4` 表达。

### v1.0.1 (2026-05-31)

#### 样式调整
- 继承 Tab v1.0.1：移除 inactive Item 的 40% 颜色值路径，改用 `opacity: 0.4`，hover / active 使用 `opacity: 1`。

### v1.0.0 (2026-05-20)

#### 新功能
- 初始实现:基于 Tab 的薄封装,固定 `role="radiogroup"` / `itemRole="radio"` / `selectionFollowsFocus=true`
- 支持 `name` 属性接入 Form,内部渲染 hidden input 暴露 value 给原生表单提交
- 支持 `fill` Figma fill 宽度,与 Tab 共享等宽子项样式
