export const examples = [
 { name: 'A1: 密码强度', code: `A1
<Frame column gap={4}>
  <PasswordStrength password="" />
  <PasswordStrength password="short" />
  <PasswordStrength password="Example123!Example" />
</Frame>`, expected: { render: '展示空、弱、强三个等级。', layout: '四段强度条及说明纵向排列。', interaction: '由调用方更新密码。', performance: '即时计算，不持久保存。', responsive: '宽度由容器决定。' }, logic: ['Default', 'Levels'] },
 { name: 'A2: 输入并实时评估', code: `A2
<PasswordStrengthController />`, expected: { render: '显示密码输入框、强度条和对应文案。', layout: '输入框与四段强度条纵向排列。', interaction: '输入或删除字符时即时更新等级。', performance: '不持久保存或发送密码。', responsive: '宽度由外层容器决定。' }, logic: ['Input', 'LiveEvaluation', 'Accessibility'] },
 { name: 'A3: 覆盖评估和文案', code: `A3
<PasswordStrength password="example" minimumLength={6} evaluate={(value) => value.length >= 6 ? 4 : 1} labels={['Empty', 'Short', 'Fair', 'Good', 'Accepted']} />`, expected: { render: '显示自定义标准对应的四段和 Accepted 文案。', layout: '使用默认四段结构。', interaction: '评估函数由调用方提供。', performance: '不发起网络请求。', responsive: '宽度由容器决定。' }, logic: ['Evaluator', 'Labels'] },
 { name: 'A4: 密码设定要求', code: `A4
<PasswordStrength password="abcdefgh" requireLowercase requireUppercase requireSymbol />`, expected: { render: '达到长度后提示缺少大写字母和特殊字符，并提供示例。', layout: '沿用四段指示器与说明文字。', interaction: '使用方配置要求并管理输入值。', performance: '不持久保存密码。', responsive: '宽度由容器决定。' }, logic: ['Requirements'] }
];
