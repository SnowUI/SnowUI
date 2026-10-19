import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');process.chdir(root);
const [pack]=JSON.parse(execFileSync('npm',['pack','--dry-run','--json','--ignore-scripts','--cache','./node_modules/.cache/npm'],{encoding:'utf8'}));
const errors=[];
const privateOwnerPath=/(?:^|\/)(?:(?:\.snowui|snowui-owner|\.?owner[._-](?:private|secret|recovery|mnemonic|backup|challenge|proof|session|state|key)|(?:challenge|proof|session)[._-]state)(?:[._-]|\/|$)|(?:owner|challenges)(?:\/|$))/i;
const privateKeyContent=/-----BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY-----/;
const privateOwnerState=content=>/"purpose"\s*:\s*"snowui-owner-maintenance"/.test(content)&&/"(?:nonce|signature|used)"\s*:/.test(content);
const recoveryFields=['mnemonic','words','recoveryWords','entropy','entropyHex','seed','seedHex'];
const recoveryMaterial=value=>typeof value==='string'?Boolean(value.trim())&&!/^(?:<[^>]+>|REPLACE_ME|YOUR_[A-Z_]+|\[?redacted\]?)$/i.test(value.trim()):Array.isArray(value)&&value.some(recoveryMaterial);
function privateOwnerRecovery(content){
 const visit=value=>{
  if(typeof value==='string')return /snowui-owner|snowui:byewind/.test(value)&&privateOwnerRecovery(value);
  if(!value||typeof value!=='object')return false;
  const owner=value.format==='snowui-owner-ed25519-entropy-v1'||value.version==='snowui-owner-ed25519-entropy-v1'||value.ownerId==='snowui:byewind';
  return owner&&recoveryFields.some(field=>recoveryMaterial(value[field]))||Object.values(value).some(visit);
 };
 try{return visit(JSON.parse(content));}catch{}
 const text=content.replace(/\\(["'])/g,'$1');
 for(const [literal] of text.matchAll(/\{[^{}]{0,65536}\}/g)){
  if(!/(?:["']?(?:format|version)["']?\s*:\s*["']snowui-owner-ed25519-entropy-v1["']|["']?ownerId["']?\s*:\s*["']snowui:byewind["'])/.test(literal))continue;
  for(const match of literal.matchAll(/["']?(mnemonic|words|recoveryWords|entropy|entropyHex|seed|seedHex)["']?\s*:\s*(?:"([^"]*)"|'([^']*)'|\[([^\]]*)\])/g))if(recoveryMaterial(match[2]??match[3]??(match[4]?.match(/["'][^"']+["']/g)?.map(word=>word.slice(1,-1))??[])))return true;
 }
 return false;
}
for(const {path:p} of pack.files){
 if(!/^(dist\/(client|server)\/|package\.json$|component-catalog\.json$|README\.md$|AGENTS\.md$|llms\.txt$|LICENSE$|THIRD_PARTY_NOTICES\.md$)/.test(p))errors.push(p);
 if(/\.svelte$|(?<!\.d)\.ts$|\.map$|\.test\.|(?:^|\/)src\//.test(p))errors.push(p);
 if(/\.(js|json)$/.test(p)&&/sourcesContent|sourceMappingURL/.test(fs.readFileSync(p,'utf8')))errors.push(p);
 const content=fs.readFileSync(p,'utf8');
 if(privateOwnerPath.test(p)||privateKeyContent.test(content)||privateOwnerState(content)||privateOwnerRecovery(content))errors.push(p+' 含所有者私有材料或私钥');
}
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
if(JSON.stringify(pkg.exports).includes('./src/'))errors.push('源码 exports');
for(const f of ['LICENSE','README.md','AGENTS.md','llms.txt','THIRD_PARTY_NOTICES.md','dist/client/index.js','dist/server/index.js','dist/client/index.d.ts'])if(!pack.files.some(x=>x.path===f))errors.push('缺少 '+f);
for(const {path:file} of pack.files){
 const header=fs.readFileSync(file,'utf8').match(/^\/\* SnowUI source notice \| LICENSE [\d.]+: (.+)\n/);
 if(header&&path.resolve(path.dirname(file),header[1])!==path.join(root,'LICENSE'))errors.push(file+' 许可相对路径失效');
}
if(pkg.license!=='SEE LICENSE IN LICENSE'||pkg.exports['./LICENSE']!=='./LICENSE')errors.push('许可声明或公开定位入口缺失');
for(const file of ['README.md','AGENTS.md','llms.txt'])if(!fs.readFileSync(file,'utf8').includes('(./LICENSE)'))errors.push(file+' 缺少随包完整许可链接');
if(!fs.readFileSync('LICENSE','utf8').includes('不要求注册、登录、公钥、签名许可、激活码或中心登记'))errors.push('Free 无认证门槛条款缺失');
if(errors.length)throw Error('运行包门禁失败:\n'+errors.join('\n'));
console.log(`运行包允许清单通过：${pack.files.length} 个文件；无原始 Svelte、实现 TS、测试或 source map。`);
