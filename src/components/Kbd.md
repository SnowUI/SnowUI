# Kbd

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；旧 OSS / PRO 标签仅表示迁移期技术来源。

> **版本**: v1.0.0
> **职责**: 以紧凑的按键标签展示快捷键或键盘操作提示，帮助用户快速识别可用操作。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

以紧凑的按键标签展示快捷键或键盘操作提示，帮助用户快速识别可用操作。

## 使用选择

<!-- usage-guide:start -->
用于展示键盘按键或快捷键提示。它不注册快捷键；实际键盘处理由拥有该操作的组件或页面负责。

- children 只表示按键文字，variant 选择 border 或填充外观。
- 将快捷键提示放在对应操作旁；快捷键事件由页面或拥有该操作的组件注册。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Kbd } from '@snowui-design-system/components';
</script>

<div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: var(--gap-4) var(--gap-3);">
	<Kbd variant="border">⌘K</Kbd>
	<Kbd variant="solid">⌘K</Kbd>
	<div aria-label="Shift plus K" style="display: flex; align-items: center; gap: var(--gap-1);">
		<Kbd style="font-size: var(--text-18); line-height: var(--leading-18);">Shift</Kbd>
		<span aria-hidden="true">+</span>
		<Kbd style="font-size: var(--text-18); line-height: var(--leading-18);">K</Kbd>
	</div>
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| variant | `"border" \| "solid"` | `"border"` | 样式 A（描边）或样式 B（实心底色） |
| children | `Snippet` | — | 按键内容 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="功能概览"></a>

### 功能概览

- 两种视觉样式：描边（`border`）与实心底色（`solid`），通过 `variant` 切换
- 语义化 `<kbd>` 元素输出
- 内联行内元素，可嵌入任何文本流中

---

<a id="api-参考"></a>





#### 基础用法（样式 A — 描边）

```svelte
<Kbd>⌘K</Kbd>
<Kbd>Ctrl</Kbd>
<Kbd>Enter</Kbd>
```

#### 样式 B（实心底色）

```svelte
<Kbd variant="solid">⌘K</Kbd>
<Kbd variant="solid">Ctrl</Kbd>
```

#### 组合键

```svelte
<Kbd>⌘</Kbd>
<span>+</span>
<Kbd>K</Kbd>
```


> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---




## AI Zone

用于展示键盘按键名称或组合键，如 `⌘K`、`Ctrl+C`、`Enter` 等。支持两种视觉样式：描边（样式 A）和实心底色（样式 B）。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 布局模型

主布局模型：**内联外壳布局（Inline Shell Layout）**

根为 `inline-flex` 外壳；内容整体 Hug；padding 决定可见面积；不接入三槽位协议。文字由 flex 在外壳内严格几何居中，不应用额外光学偏移。

### 开发者关键字

| 类别 | 关键字 | 描述 |
|:---|:---|:---|
| CSS 类名 | `snowui-kbd` | 根元素类名 |
| 变体类名 | `snowui-kbd-solid` | 实心底色变体（`variant="solid"` 时添加） |

### 模块索引

| 模块 | 文件 | 职责 |
|:---|:---|:---|
| Kbd | [Kbd.svelte](./Kbd.svelte) | 主组件 |

### 关键字映射

| 关键字 | 处理方式 | 说明 |
|:---|:---|:---|
| variant | CSS 类 | `"solid"` → `.snowui-kbd-solid`；`"border"` 为默认，无额外类 |

### 关联关系

- **父组件**: 无
- **依赖**: Frame

---

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.0.0 (2026-04-29)

#### 新功能

- 初始版本，支持 `variant` 样式切换（`border` / `solid`）
