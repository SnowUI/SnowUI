# MetricCard

> **职责**: 展示调用方提供的指标值和可选变化信息。
> **版本**：v1.0.0；**包归属**：`@snowui-design-system/components`。

## 组件介绍

用于展示仪表盘中的单项指标及可选变化信息。组件不获取数据或计算变化率。

## 使用选择

<!-- usage-guide:start -->
需要一组指标时由页面安排多个 MetricCard；一般内容容器使用 Card。`emphasis` 决定当前值或变化值的主次，`trend` 表示变化方向，具体业务含义由使用方决定。

<!-- usage-guide:end -->

## 快速开始

```svelte
<script lang="ts">
  import { MetricCard } from '@snowui-design-system/components';
</script>

<MetricCard label="Orders" value="694" change="+22.41%" trend="positive" />
<MetricCard label="Orders" value="694" change="+22.41%" trend="positive" emphasis="value" />
```

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| label | `string` | 必填 | 指标名称 |
| value | `string` | 必填 | 已格式化的当前值 |
| change | `string` | — | 已格式化的变化值；省略时突出当前值 |
| emphasis | `'value' \| 'change'` | `"change"` | 选择主要显示当前值或变化值 |
| trend | `'positive' \| 'negative' \| 'neutral'` | `"neutral"` | 变化值首位正负号的视觉状态；数值及其含义由调用方提供 |

其他兼容属性继承 [Card](Card.md)。`children`、`contentFill`、`contentHug` 和 `scrollable` 由组件接管，不是可配置属性。

## 使用边界与详细说明

Card 为真实宿主，内容填充卡片宽度；卡片和多卡布局的宽度由使用方决定。组件不计算环比或处理缺失数据，使用方应传入可理解的文本。颜色不是方向的唯一表达，应在变化文本中提供正负号或文字说明。组件无自有交互和动效，可在服务端渲染。

## AI 对话使用

可用公开的 `label`、`value`、`change`、`emphasis` 和 `trend` 展示调用方提供的指标；组件不读取数据源、不派发业务动作。宿主须能运行该组件与随包样式；不能运行时可退化为文字。真实对话宿主尚未验收，不声称已兼容特定平台。

## AI Zone

- 入口：[MetricCard.svelte](MetricCard.svelte)；真实宿主是 Card，标题、主值及辅助值由组件渲染。
- 颜色仅用于变化文本开头的正负号；没有 Context、`parts` 或内部业务状态。维护时保持无障碍文本与可见数值一致。
- 示例：[MetricCard.test.ts](MetricCard.test.ts)。真实对话宿主与发布包证据尚无。

## 更新日志

- 2026-11-04：新增指标展示组件。
