import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');process.chdir(root);
const [pack]=JSON.parse(execFileSync('npm',['pack','--dry-run','--json','--ignore-scripts','--cache','./node_modules/.cache/npm'],{encoding:'utf8'}));
const errors=[];
for(const {path:p} of pack.files){
 if(!/^(dist\/(client|server)\/|package\.json$|component-catalog\.json$|README\.md$|LICENSE$|THIRD_PARTY_NOTICES\.md$)/.test(p))errors.push(p);
 if(/\.svelte$|(?<!\.d)\.ts$|\.map$|\.test\.|(?:^|\/)src\//.test(p))errors.push(p);
 if(/\.(js|json)$/.test(p)&&/sourcesContent|sourceMappingURL/.test(fs.readFileSync(p,'utf8')))errors.push(p);
}
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
if(JSON.stringify(pkg.exports).includes('./src/'))errors.push('源码 exports');
for(const f of ['LICENSE','THIRD_PARTY_NOTICES.md','dist/client/index.js','dist/server/index.js','dist/client/index.d.ts'])if(!pack.files.some(x=>x.path===f))errors.push('缺少 '+f);
if(errors.length)throw Error('运行包门禁失败:\n'+errors.join('\n'));
console.log(`运行包允许清单通过：${pack.files.length} 个文件；无原始 Svelte、实现 TS、测试或 source map。`);
