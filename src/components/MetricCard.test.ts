export const examples = [
 { name: 'A1: 指标主次', code: `A1
<Frame row gap={4}>
  <MetricCard label="Users" value="694" change="+22.41%" trend="positive" />
  <MetricCard label="Revenue" value="$2,318" change="-2.01%" trend="negative" emphasis="value" />
</Frame>`, expected: { render: '展示变化优先和数值优先两种指标卡。', layout: '指标在卡片内排列。', interaction: '无交互。', performance: '不计算业务数据。', responsive: '由外层决定排列。' }, logic: ['Default', 'Emphasis'] },
 { name: 'A2: 无比较值', code: `A2
<MetricCard label="Orders" value="0" />`, expected: { render: '无变化文本时仅突出当前值。', layout: '内容填充卡片。', interaction: '无交互。', performance: '不读取外部数据。', responsive: '由外层决定宽度。' }, logic: ['NoChange'] }
];
