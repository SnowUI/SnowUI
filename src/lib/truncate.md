# truncate.ts 文档

> **版本**: v1.3.0
> **职责**: 文本截断 Svelte Action。

## 依赖关系

- **被依赖**: Link.svelte、frame-truncation.svelte.ts（以及后续需要边界拟合的文字组件）

## 导出

| 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| truncate | Svelte Action | 文本截断 action |
| fitTextToElement | Function | 按目标元素实际字体宽度返回不拆单词 / Unicode 字素的最长可见前缀 |
| measureTextForElement | Function | 按目标元素字体与字距测量文本宽度，供截断内容与相邻配件紧密布局 |

## 配置项

| 属性 | 类型 | 描述 |
| :--- | :--- | :--- |
| lines | number | 截断行数 |

## 功能

- CSS line-clamp 应用
- 截断状态检测
- 语言感知的边界截断：优先使用 `Intl.Segmenter` 的 word 分段；单个英文等字母单词放不下时只显示省略符，中日韩文字可降级为 grapheme 分段
- 字体宽度测量：使用 Canvas `measureText()`，并计入元素 `letter-spacing`
- 返回值不包含省略符，消费组件可独立渲染 `…`，避免焦点态原生 ellipsis 绘制差异
