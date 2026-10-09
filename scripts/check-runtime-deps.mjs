import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
// 所有组件可互相消费公开能力；禁止依赖已退役的独立组件包或目录。
const retired = /(?:@(?:snowui|snowui-design-system)\/components-pro(?:\/|$)|(?:^|\/)pro\/src(?:\/|$))/;
const imports = /(?:\bfrom\s*|\bimport\s*(?:\(\s*)?|\brequire\s*\(\s*)['"]([^'"]+)['"]/g;
const failures = [];
for (const file of walk(path.join(root, 'src'))) {
  if (!/\.(ts|svelte|js)$/.test(file)) continue;
  for (const match of readFileSync(file, 'utf8').matchAll(imports)) {
    if (retired.test(match[1])) failures.push(`${path.relative(root, file)}: ${match[1]}`);
  }
}
if (failures.length) throw new Error(failures.join('\n'));
console.log('统一组件依赖边界检查通过。');
