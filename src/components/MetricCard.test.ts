export const examples = [
 { name: 'A1: 指标主次', code: `A1
<Frame row gap={4}>
  <MetricCard label="Users" value="694" change="+22.41%" trend="positive" />
  <MetricCard label="Revenue" value="$2,318" change="-2.01%" trend="negative" emphasis="value" />
</Frame>`, expected: { render: '展示变化优先和数值优先两种指标卡。', layout: '背景为Background/3；默认变化值在左，当前值在右。', interaction: '无交互。', performance: '不计算业务数据。', responsive: '由外层决定排列。' }, logic: ['Default', 'Emphasis'] },
 { name: 'A2: 无比较值', code: `A2
<MetricCard label="Orders" value="0" />`, expected: { render: '无变化文本时仅突出当前值。', layout: '内容填充卡片。', interaction: '无交互。', performance: '不读取外部数据。', responsive: '由外层决定宽度。' }, logic: ['NoChange'] }
 ,{ name: 'A3: 缺失与真实零值', code: `A3
<MetricCard label="Missing" value="" change="-" trend="positive" />
<MetricCard label="Zero" value="0" change="0%" />`, expected: { render: '缺失显示中性-；真实0和0%保留；缺失变化仍在左侧。' }, logic: ['MissingData', 'Zero'] }
];
