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
const allowed=['src','tests','scripts','package.json','pnpm-lock.yaml','pnpm-workspace.yaml','tsconfig.json','tsconfig.node.json','svelte.config.js','vite.config.ts','LICENSE','THIRD_PARTY_NOTICES.md','README.md','AGENTS.md','llms.txt','component-discovery.json','component-catalog.json'];
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
fs.writeFileSync(path.join(folder,'SOURCE_BUILD.md'),`# Build SnowUI from source\n\nUse Node 24 and pnpm 10.20. Run \`pnpm install --frozen-lockfile\`, then \`pnpm build\`. The build produces \`dist/client\` and \`dist/server\`.\n\nThe source archive includes its applicable LICENSE and third-party notices.\n`);
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
fs.writeFileSync(path.join(folder,'SOURCE_MANIFEST.json'),JSON.stringify({schemaVersion:1,files,package:pkg.name,packageVersion:pkg.version,licenseVersion,licenseSha256:createHash('sha256').update(licenseText).digest('hex'),sourceRevision,sourceDirty,...(sourceTag?{sourceTag}:{}),releaseState:taggedRelease?'tagged-release-candidate':'candidate'},null,2)+'\n');
const basename=`${archiveName}.zip`;const dest=path.join(out,basename);fs.rmSync(dest,{force:true});execFileSync('zip',['-qr',dest,path.basename(folder)],{cwd:stage});
const checksum=createHash('sha256').update(fs.readFileSync(dest)).digest('hex');fs.writeFileSync(dest+'.sha256',`${checksum}  ${basename}\n`);console.log(dest+'\nSHA256 '+checksum);
}finally{fs.rmSync(stage,{recursive:true,force:true});}
