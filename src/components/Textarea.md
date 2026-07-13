# Textarea.svelte 文档

## 内置组件双模式

- `parts.Indicator`：统一配置 resize 模式下的内置 Indicator。
- Textarea value、invalid、disabled 与输入事件属于父组件受控协议。

> **版本**: v1.0.1
> **变更记录 (2026-04-28)**: 标注主布局模型为复合管理布局，并同步代码版本。
> **职责**: 基础多行文本输入宿主，负责承接原生 `<textarea>` 能力与 Frame 通用能力。

**2026-04-04 补充**: 参考 Figma `10109:19152`，`Textarea` 是表单系列里的单独例外：单独使用时默认内容留白为 `top 12 / right 16 / bottom 24 / left 16`。进入 `Field` 后，只看有没有 `as="segment"`；未标 `segment` 时由外层 `Field` 处理默认 `12 / 16` 与 `gap = 8`，`Textarea` 去掉组件自身 padding，但保留自身 gap；标了 `segment` 时保留 `Textarea` 自身的 padding 与 gap。右下角使用统一 `Indicator appearance="corner"`；字符计数器默认不显示，传入 `maxCount` 后在字符数达到上限 80% 时自动出现。
**2026-04-09 补充**: `Textarea` 右下角保留区（含缩放图标与计数器）始终存在；默认要求是 `right = 16px`、`bottom = 0`，不得贴边。
**2026-04-24 补充**: `Textarea` 使用与 `Listbox` 一致的自定义浮层滚动条：原生滚动条隐藏，thumb 覆盖在内容之上，不占布局宽度；默认宽 4px，hover 到 thumb 后从右向左变为 8px，右边缘距容器右边框 4px，轨道透明并支持拖拽。
**2026-05-26 补充**: `Textarea` 的顶部/底部滚动渐隐改为复用 `layout.css` 的 `.snowui-scroll-mask` 通用能力（即「内容渐隐层」OSS 通用能力的 CSS 静态形态，能力总览见 [`../lib/edge-fade.md`](../lib/edge-fade.md)），在原生 `<textarea>` 上通过 `data-scroll-mask` 驱动 `mask-image`，不再绘制可见渐变色块。

**继承**: 复用 Frame.svelte 的所有通用能力（状态、动效、响应式、Skeleton、样式编排）。
**推荐容器**: `Field.svelte`。
**默认能力开关**: `enableResponsive=false`, `enableContext=true`, `enableScaleObserver=false`。

## 布局模型

主布局模型：复合管理布局。

- Textarea 的区域结构为 root host / native control / footer / Indicator corner / counter / overlay scrollbar。
- 进入 Field 时，Textarea 只作为多行输入宿主参与 Field 的槽位宿主布局；自身 footer、计数器、resize 与 scrollbar 仍由 Textarea 私有管理。
- `as="segment"` 只影响 Textarea 与 Field 的连续字段表面关系，不把 Textarea 改造成通用槽位容器。
- footer 使用内部 Pin 布局固定到 `pin-bottom-right`。独立模式偏移为 `var(--padding-1)`；嵌入 Field 时通过 `--pin-offset-x/y` 负值补偿 Field padding。
- 自定义浮层滚动条复用 `useOverlayScrollbar`，但滚动条定位和右下角保留区属于 Textarea 私有区域结构。

## 2026-04-04 表单样式规则

- 基础节奏统一：`Field` 默认 `padding = 12 / 16`，`gap = 8`
- `Textarea` 单独使用时：组件自身默认内容留白为 `top 12 / right 16 / bottom 24 / left 16`
- 放进 `Field` 后，先看有没有 `as="segment"`
- 没有 `as="segment"`：由外层 `Field` 负责 `12 / 16` padding 与 `8` gap；`Textarea` 去掉组件自身 padding，但保留自身 gap
- 有 `as="segment"`：这是连续字段表面的一段；保留 `Textarea` 自身的 padding 与 gap
- `segment` 之间才有分割线：横向是左右分割线，纵向是上下分割线
- 相邻 `segment` 之间只能有一条分割线，不能重复画线
- `label / description / error` 不负责 padding、gap、分割线，它们只是内容元素
- 普通 `label + host + error`：不作为 padding、gap 的判断依据，只负责文字内容
- `Field row` 或 `Field column` 里，如果是连续输入段，子项要显式写 `as="segment"`

## 组件定位

`Textarea` 的推荐用法是作为 `Field` 容器中的多行宿主：

- 单独使用时可保持兼容性的默认输入框表现
- 进入 `Field` 上下文后，未标 `segment` 时由外层 `Field` 接管 padding；标了 `segment` 时保留 `Textarea` 自身留白
- 适合与 `Text as="label" / "error"`、`Frame as="row"` 等角色组合

## Frame 能力继承

`Textarea` 仍然基于 `Frame`，因此继续支持：

- `responsive / stateStyle / customStates / variants / styles`
- `Hover / Click / Focus / whileAppear / timeline / orchestrate`
- `loading / skeleton / renderHints`
- `as / use / layoutId / itemId / scope / access`

组件负责的是多行文本宿主，不是放弃 `Frame` 通用能力。

### 错误反馈 Shake

`Textarea invalid / aria-invalid` 默认自动播放错误 shake。单独使用时由 `Textarea` 自身反馈；进入 `Field` 后，嵌入态 `Textarea` 不单独抖动，由外层 `Field` 汇总后整体反馈。

错误态与 shake 不会自动聚焦，也不会模拟 `focus-within`；焦点态只来自用户真实聚焦、显式 `autofocus` 或业务代码主动调用 `focus()`。

## 组件特有属性 (Component-Specific Props)

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| value | `string` | - | 当前值，支持 `bind:value` |
| defaultValue | `string` | - | 初始值；未绑定 `value` 时作为初始展示值 |
| placeholder | `string` | - | 占位提示 |
| maxCount | `number` | - | 最大可输入字符数；字符数达到 `maxCount` 的 80% 时计数器出现，超出时变红 |
| exceeded | `boolean` | `false` | 是否超出 `maxCount`；支持 `bind:exceeded` 接收超出通知 |
| name | `string` | - | 表单提交字段名 |
| disabled | `boolean` | `false` | 禁用输入 |
| readonly | `boolean` | `false` | 只读输入 |
| required | `boolean` | `false` | 必填输入 |
| invalid | `boolean` | `false` | 组件级无效态 |
| rows | `number` | `4` | 原生 rows |
| cols | `number` | - | 原生 cols |
| resize | `"none" \| "vertical" \| "horizontal" \| "both"` | `"vertical"` | 文本域拖拽缩放方向 |

## 宿主协议

`Textarea` 和 `Input / Select` 一样，进入 `Field` 后会退化成 host：

- 根节点带 `.snowui-field-host`
- 根节点从 `.snowui-field-bordered` 切回 `.snowui-field-host`
- 外壳视觉、focus ring 和分隔线由容器负责
- 未标 `segment` 时，`Textarea` 去掉自身 padding（由外层 `Field` 统一负责 `12 / 16` padding 与 `8` gap），但保留自身 gap
- 标了 `segment` 时，保留 `Textarea` 自身的 padding 与 gap，作为连续字段表面的一段
- 多行输入的值同步、placeholder、readonly、resize 规则仍由宿主自身负责
- `Indicator appearance="corner"` 是统一尺寸手柄，随 footer 通过 `pin-bottom-right` 固定在右下角；Textarea 不再私有维护 pointer capture、方向键或 clamp 算法
- 右下角保留区（含缩放图标与计数器）固定在右下角，默认右侧留白为 `16px`
- 字符计数器属于 `Textarea` 组件自身逻辑，不属于通用表单样式规则；传入 `maxCount` 后自动驱动

## 关键字 (Keyword)

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| value | `string` | - | 当前值，支持 `bind:value` |
| defaultValue | `string` | - | 初始值 |
| placeholder | `string` | - | 占位提示 |
| disabled | `boolean` | `false` | 禁用态 |
| readonly | `boolean` | `false` | 只读态 |
| required | `boolean` | `false` | 必填态 |
| invalid | `boolean` | `false` | 组件级无效态 |
| rows | `number` | `4` | 原生 rows |
| cols | `number` | - | 原生 cols |
| minlength | `number` | - | 最小长度 |
| maxlength | `number` | - | 最大长度 |
| wrap | `"soft" \| "hard" \| "off"` | - | 自动换行策略 |
| spellcheck | `boolean` | - | 拼写检查 |
| autocomplete | `string` | - | 浏览器自动填充提示 |
| enterkeyhint | `string` | - | 移动端回车键文案提示 |
| inputmode | `string` | - | 软键盘输入模式 |
| autofocus | `boolean` | `false` | 首次渲染自动聚焦 |
| tabindex | `number` | - | Tab 顺序 |
| title | `string` | - | 原生提示 |
| id | `string` | - | 原生 id |
| resize | `"none" \| "vertical" \| "horizontal" \| "both"` | `"vertical"` | 文本域缩放方向 |
| onclick / ondblclick / oninput / onchange / onfocus / onblur / onkeydown / onkeyup / onkeypress / onpaste / oncopy / oncut | `function` | - | 原生事件透传 |

## 原生能力边界

`Textarea` 负责：

- 原生 `<textarea>` 属性透传
- `value / defaultValue` 解析
- `bind:value` 同步
- `resize` 方向控制
- `invalid` 与 `aria-invalid` 汇总

`Textarea` 不负责：

- 富文本编辑
- markdown 语法增强
- 自动高度计算
- 业务级校验提示

## 使用示例

```svelte
<!-- 推荐：放入 Field -->
<Field>
  <Textarea placeholder="请输入更多说明" />
</Field>

<!-- 带标题与错误提示 -->
<Field invalid>
  <Text as="label">问题描述</Text>
  <Textarea rows={6} placeholder="请详细描述问题" />
  <Text as="error">至少需要 20 个字符。</Text>
</Field>

<!-- 多行表单字段 -->
<Textarea
  name="description"
  rows={6}
  minlength={20}
  maxlength={200}
  maxCount={200}
  placeholder="请描述你的问题"
/>

<!-- 继承 Frame 能力 -->
<Textarea
  Click={{ Idle: "Active", Active: "Idle" }}
  stateStyle={{
    Idle: "--snowui-textarea-background: var(--surface-1, #ffffffcc);",
    Active:
      "--snowui-textarea-background: color-mix(in srgb, var(--primary, #000000) 8%, var(--surface-1, #ffffffcc));",
  }}
  defaultValue="点击切换状态"
/>
```

## 与通用逻辑的关系

`Textarea` 当前优先复用：

- [../logic/frame-prop-filter.ts](../logic/frame-prop-filter.ts)
- [../logic/frame-field-control.ts](../logic/frame-field-control.ts)
- [../lib/overlay-scrollbar.svelte.ts](../lib/overlay-scrollbar.svelte.ts)
- [../context.ts](../context.ts)

因此它的宿主分发和值同步链路，与 `Input / Select` 保持一致。

## 样式规范 (Style Spec)

### 1. 基础几何

| 项目 | 值 |
| :--- | :--- |
| 默认最小高度 | `calc(var(--leading-14) * 4 + var(--padding-3) + var(--padding-6))`（默认 4 行文字行高 + 上下内边距） |
| 圆角 | `var(--radius-4)` |
| 左侧内边距 | `var(--padding-4)` |
| 右侧内边距 | `var(--padding-4)` |
| 顶部内边距 | `var(--padding-3)` |
| 底部内边距 | `var(--padding-6)` |
| 字号 | `var(--text-14)` |
| 行高 | `var(--leading-14)` |
| 默认背景 | `var(--surface-1)` |
| 默认边框 | `inset 0 0 0 var(--border-1) var(--black-20)` |
| placeholder 颜色 | `var(--black-20)` |
| 右下角尺寸手柄 | `Indicator appearance="corner"`，16px，随 footer 固定在右下角 |
| 计数器右侧留白 | `var(--padding-4)` |
| 计数器文本 | `Text 12/16`，字符数达到 `maxCount` 80% 时出现，超出时变红 |
| 滚动条 | 自定义浮层滚动条，隐藏原生滚动条；默认 4px / hover 8px，右边缘距容器右边框 4px，透明轨道 |
| 滚动渐隐 | `.snowui-scroll-mask` + `data-scroll-mask="top\|bottom\|both"`，默认 32px，可用 `--snowui-textarea-scroll-mask-size-override` 覆盖 |

## 无障碍与表单建议

- 需要明确标签时，优先在 `Field` 中显式渲染 `label`
- 错误提示建议通过 `aria-describedby` 关联到宿主
- 如果要做聊天输入框、评论框、带工具栏的富输入区，建议在 `Field` 容器里继续组合，而不是把所有 UI 堆进 `Textarea` 本体

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 模块索引 (Module Index)

- **Textarea 组件**: [./Textarea.svelte](./Textarea.svelte)

### 关联关系

- **父组件**: [Frame.svelte](./Frame.svelte)
- **共享逻辑**: [../logic/frame-field-control.ts](../logic/frame-field-control.ts)
- **Props 分发**: [../logic/frame-prop-filter.ts](../logic/frame-prop-filter.ts)
- **字段上下文**: [../context.ts](../context.ts)
- **关联规范**: [../../../specs/HTMLSpec.md](../../../specs/HTMLSpec.md)

---

## 更新日志 (Changelog)

- **Textarea-Docs.2026-06-22** 右下角私有 RoundedCorner 拖拽迁移到统一 Indicator；保留 vertical / horizontal / both 与宽 120px、高 60px 的独立最小尺寸。
- **Textarea-Docs.2026-05-25** 源码顶部历史变更记录已归档；后续新增变更统一写入本文档 Changelog，源码顶部只保留职责、当前关键架构与文档路径。

### v1.0.1 (2026-04-28)

#### 文档
- 标注主布局模型为复合管理布局，并同步组件代码版本。

### v1.0.0 (2026-03-15)

#### 新功能
- **TXT-Feat.1** 新增基于 `Frame` 的多行文本输入组件，支持原生 `<textarea>` 属性透传、`bind:value`、Skeleton 与响应式能力。
