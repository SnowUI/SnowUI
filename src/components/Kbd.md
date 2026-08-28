# Kbd (键盘快捷键)

> **版本**: v1.0.0
> **职责**: 显示键盘按键或快捷键标识的内联标签组件

用于展示键盘按键名称或组合键，如 `⌘K`、`Ctrl+C`、`Enter` 等。支持两种视觉样式：描边（样式 A）和实心底色（样式 B）。

## 功能概览

- 两种视觉样式：描边（`border`）与实心底色（`solid`），通过 `variant` 切换
- 语义化 `<kbd>` 元素输出
- 内联行内元素，可嵌入任何文本流中

---

## API 参考

### 核心属性

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| variant | `"border" \| "solid"` | `"border"` | 样式 A（描边）或样式 B（实心底色） |
| children | `Snippet` | — | 按键内容 |

### 使用示例

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

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

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

## 更新日志 (Changelog)

### v1.0.0 (2026-04-29)

#### 新功能

- 初始版本，支持 `variant` 样式切换（`border` / `solid`）
