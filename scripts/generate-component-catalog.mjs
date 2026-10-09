import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const unified = JSON.parse(fs.readFileSync(path.join(root, '../components/component-catalog.json'), 'utf8'));
const components = unified.components.filter(c => c.name !== 'Frame').map(c => ({...c, package: '@snowui/components-pro', import: `import { ${c.name} } from '@snowui/components-pro';`, sourcePackage: unified.package}));
const frame = components.find(c => c.name === 'FramePro');
components.push({...frame, name:'Frame', canonical:'FramePro', import: "import { Frame } from '@snowui/components-pro';"});
const output = JSON.stringify({...unified, package:'@snowui/components-pro', components}, null, 2)+'\n';
const file=path.join(root,'component-catalog.json');
if(process.argv.includes('--check')) { if(fs.readFileSync(file,'utf8')!==output) throw new Error('兼容 catalog 过期'); }
else fs.writeFileSync(file,output);
