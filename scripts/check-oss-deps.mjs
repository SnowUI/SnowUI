import { readFileSync, readdirSync } from 'node:fs';
// 统一包允许专业能力；只阻止反向依赖旧兼容包与兄弟仓库。
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(`${dir}/${e.name}`):[`${dir}/${e.name}`]);}
const failures=walk('src').filter(f=>/\.(ts|svelte|js)$/.test(f)&&!f.includes('.test.')).filter(f=>/from\s*['"][^'"]*(?:@snowui\/components-pro|\/pro\/src)/.test(readFileSync(f,'utf8')));
if(failures.length)throw Error(failures.join('\n'));
console.log('统一运行包未反向依赖旧兼容仓库。');
