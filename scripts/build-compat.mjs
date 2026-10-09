import fs from 'node:fs';
fs.mkdirSync('dist',{recursive:true});
const source='export * from "@snowui-design-system/components/compat";\n';
fs.writeFileSync('dist/index.js',source);fs.writeFileSync('dist/index.d.ts',source);
console.log('兼容包只转发统一组件包，不拥有组件或 Context。');
