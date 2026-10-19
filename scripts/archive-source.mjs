import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const scriptRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
let sourceRoot=scriptRoot,outArgument,taggedRelease=false;
const args=process.argv.slice(2);
for(let index=0;index<args.length;index++){
 const argument=args[index];
 if(argument==='--source-root'){
  if(!args[index+1])throw Error('--source-root 需要目录');
  sourceRoot=path.resolve(args[++index]);
 }else if(argument==='--tagged-release')taggedRelease=true;
 else if(!argument.startsWith('-')&&outArgument===undefined)outArgument=argument;
 else throw Error('用法：node scripts/archive-source.mjs [输出目录] [--source-root 检出目录] [--tagged-release]');
}
const root=fs.realpathSync(sourceRoot);process.chdir(root);
execFileSync(process.execPath,['scripts/source-notices.mjs','--check'],{stdio:'inherit'});
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const licenseText=fs.readFileSync('LICENSE','utf8');
const licenseVersion=licenseText.match(/许可版本：v([\d.]+)/)?.[1];
if(!licenseVersion)throw Error('LICENSE 缺少明确的许可版本');
const sourceRevision=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const sourceDirty=Boolean(execFileSync('git',['status','--porcelain','--untracked-files=normal'],{encoding:'utf8'}).trim());
let sourceTag;
if(taggedRelease){
 sourceTag=`v${pkg.version}`;
 let tagRevision;
 try{tagRevision=execFileSync('git',['rev-parse','--verify',`refs/tags/${sourceTag}^{commit}`],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}
 catch{throw Error(`正式归档缺少 ${sourceTag} tag`);}
 if(sourceDirty||tagRevision!==sourceRevision)throw Error('正式归档必须从匹配包版本的干净 tag 检出目录生成');
}
const out=path.resolve(outArgument??'artifacts');
if(taggedRelease){
 const relative=path.relative(root,out);
 if(relative===''||(relative!=='..'&&!relative.startsWith(`..${path.sep}`)&&!path.isAbsolute(relative)))throw Error('正式归档输出目录必须位于源码检出目录之外');
}
fs.mkdirSync(out,{recursive:true});
const archiveName=`snowui-source-${pkg.version}-license-${licenseVersion}`;
const stage=fs.mkdtempSync(path.join(out,'.source-'));const folder=path.join(stage,archiveName);fs.mkdirSync(folder);
const allowed=['src','tests','scripts','package.json','pnpm-lock.yaml','pnpm-workspace.yaml','tsconfig.json','tsconfig.node.json','svelte.config.js','vite.config.ts','LICENSE','THIRD_PARTY_NOTICES.md','README.md','AGENTS.md','llms.txt','OWNER_IDENTITY.md','owner-identity.public.json','component-discovery.json','component-catalog.json'];
// 允许清单中包含递归源码目录；其中的本机所有者材料仍须独立拒绝。
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
 // 也检查 JS／HTML 内嵌的结构化记录，不扫描任意 24 个英文词。
 const text=content.replace(/\\(["'])/g,'$1');
 for(const [literal] of text.matchAll(/\{[^{}]{0,65536}\}/g)){
  if(!/(?:["']?(?:format|version)["']?\s*:\s*["']snowui-owner-ed25519-entropy-v1["']|["']?ownerId["']?\s*:\s*["']snowui:byewind["'])/.test(literal))continue;
  for(const match of literal.matchAll(/["']?(mnemonic|words|recoveryWords|entropy|entropyHex|seed|seedHex)["']?\s*:\s*(?:"([^"]*)"|'([^']*)'|\[([^\]]*)\])/g))if(recoveryMaterial(match[2]??match[3]??(match[4]?.match(/["'][^"']+["']/g)?.map(word=>word.slice(1,-1))??[])))return true;
 }
 return false;
}
const publicFile=p=>{
 const relative=path.relative(root,path.resolve(p)).split(path.sep).join('/');
 if(/(?:^|\/)(?:node_modules|\.git|\.DS_Store|\.env(?:\..*)?)(?:\/|$)/.test(relative)||/^src\/(?:demo|test|playground)(?:\/|$)/.test(relative))return false;
 if(privateOwnerPath.test(relative))throw Error('源码归档禁止所有者私钥、备份、挑战或证明状态：'+relative);
 const info=fs.lstatSync(p);
 if(info.isSymbolicLink()||(!info.isDirectory()&&!info.isFile()))throw Error('源码归档仅接受普通文件和目录：'+relative);
 if(info.isFile()){
  const content=fs.readFileSync(p,'utf8');
  if(privateKeyContent.test(content))throw Error('源码归档禁止私钥内容：'+relative);
  if(privateOwnerState(content))throw Error('源码归档禁止所有者挑战或证明状态：'+relative);
  if(privateOwnerRecovery(content))throw Error('源码归档禁止所有者助记词或恢复材料：'+relative);
 }
 return true;
};
try{
 for(const name of allowed){if(!fs.existsSync(name))throw Error('缺少源码交付项 '+name);fs.cpSync(name,path.join(folder,name),{recursive:true,filter:publicFile});}
const buildNote=taggedRelease?'此归档来自与组件版本匹配的干净发布 tag，仍是待上传候选；正式公开下载、校验值和发布日期须在上传及外网验收后公布。':'此归档为本地交付候选，不代表公开下载或新 npm 版本已发布。';
fs.writeFileSync(path.join(folder,'SOURCE_BUILD.md'),`# 免费源码构建\n\n先阅读本归档 LICENSE；AI 入口见 AGENTS.md。Free 范围无需公钥、账户、签名许可或中心登记。Node 24 与 pnpm 10.20；运行 pnpm install --frozen-lockfile，然后 pnpm build、pnpm catalog:check、pnpm pack:check。无需兄弟源码仓库；构建输出为 dist/client 和 dist/server。\n\nnpm 与源码按同一用途、项目和人数许可；允许授权用途内修改样式、交互与框架移植。真实产品上线或交付需 Pro / Team，纯 Demo 可免费线上展示。官方维护规范只约束官方工作区，使用者的源码适配权限以本归档 LICENSE 为准。\n\n所有者身份与官方维护核验见 OWNER_IDENTITY.md 和 owner-identity.public.json。公开登记可以复制，但不是当前持钥证明或法律著作权认证；验证方须先独立确认官方公钥指纹，再发起本次任务的新挑战。作者可用专用 24 词在可信本机工具中离线恢复原密钥，GitHub 仅参与首次登记；恢复仍须匹配可信注册记录。核验实现、私钥、助记词、恢复文件、加密备份和挑战使用状态不在本归档中，也不提供给 AI。正式工具分发与官方 HTTPS 身份锚点尚未上线，缺少可信核验能力时记录 unknown，不自行写入已通过。\n\n${buildNote} SOURCE_MANIFEST.json 记录除清单自身外全部文件的路径、字节数和SHA-256，以及组件版本、许可版本、来源提交、工作区状态与公开身份文件摘要。清单与归档自带摘要不证明官方来源；如需核对完整性，应从独立可信来源固定清单摘要并用可信独立工具核对；这不是Free使用前置。正式发行签名与可信分发仍未完成。正常修改并不自动构成侵权；相同组件版本但许可不同不代表已发布的旧包变更。正式公开交付须经过干净来源与独立构建验证并记录发布日期。源码下载不要求付款；付费设计资源与许可凭证由独立交付服务提供。\n`);
// 清单覆盖最终候选的全部普通文件；排除清单自身以避免循环摘要。
const files=[];
function inventory(directory,prefix=''){
 for(const name of fs.readdirSync(directory).sort()){
  const absolute=path.join(directory,name),relative=prefix+name,stat=fs.lstatSync(absolute);
  if(stat.isDirectory())inventory(absolute,relative+'/');
  else if(stat.isFile()){
   const bytes=fs.readFileSync(absolute);files.push({path:relative,size:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
  }else throw Error('源码清单仅接受普通文件和目录：'+relative);
 }
}
inventory(folder);files.sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
fs.writeFileSync(path.join(folder,'SOURCE_MANIFEST.json'),JSON.stringify({schemaVersion:1,files,package:pkg.name,packageVersion:pkg.version,licenseVersion,licenseSha256:createHash('sha256').update(licenseText).digest('hex'),sourceRevision,sourceDirty,...(sourceTag?{sourceTag}:{}),ownerIdentity:{path:'owner-identity.public.json',sha256:createHash('sha256').update(fs.readFileSync(path.join(folder,'owner-identity.public.json'))).digest('hex')},releaseState:taggedRelease?'tagged-release-candidate':'candidate'},null,2)+'\n');
const basename=`${archiveName}.zip`;const dest=path.join(out,basename);fs.rmSync(dest,{force:true});execFileSync('zip',['-qr',dest,path.basename(folder)],{cwd:stage});
const checksum=createHash('sha256').update(fs.readFileSync(dest)).digest('hex');fs.writeFileSync(dest+'.sha256',`${checksum}  ${basename}\n`);console.log(dest+'\nSHA256 '+checksum);
}finally{fs.rmSync(stage,{recursive:true,force:true});}
