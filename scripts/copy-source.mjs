import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {root,sourceFiles,sourceNotice} from './source-notices.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
/** 导出所选文件及完整许可；保留 src 路径，不猜测依赖，不覆盖用户文件。 */
export function copySource(files,out,base=root){
 if(!files.length)throw Error('至少选择一个源码文件');
 const destination=path.resolve(out);
 if(destination===path.resolve(base)||destination.startsWith(path.resolve(base)+path.sep))throw Error('目标必须在来源目录之外');
 if(fs.existsSync(destination))throw Error('目标必须是尚不存在的新目录');
 const allowed=new Set(sourceFiles(base)),selected=[...new Set(files)];
 const entries=selected.map(file=>{
  if(!allowed.has(file))throw Error('仅支持明确的组件或共享源码路径');
  const bytes=fs.readFileSync(path.join(base,file));
  if(!bytes.toString().startsWith(sourceNotice(file,base)))throw Error('所选源码缺少当前许可说明');
  return {file,bytes};
 });
 // 先读取全部材料，任何校验失败均不留下半份交付。
 const materials=['LICENSE','THIRD_PARTY_NOTICES.md','AGENTS.md'].map(file=>{
  const p=path.join(base,file);if(!fs.lstatSync(p).isFile()||fs.lstatSync(p).isSymbolicLink())throw Error('许可材料必须是普通文件');
  return {file,bytes:fs.readFileSync(p)};
 });
 const license=materials[0].bytes,licenseVersion=license.toString().match(/许可版本：v([\d.]+)/)?.[1];
 if(!licenseVersion)throw Error('无效 LICENSE');
 const parent=path.dirname(destination);fs.mkdirSync(parent,{recursive:true});
 const stage=fs.mkdtempSync(path.join(parent,'.snowui-copy-'));
 try{
  for(const {file,bytes} of [...entries,...materials]){const p=path.join(stage,file);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,bytes);}
  fs.writeFileSync(path.join(stage,'SOURCE_SELECTION.json'),JSON.stringify({format:1,licenseVersion,licenseSha256:hash(license),files:entries.map(({file,bytes})=>({path:file,sha256:hash(bytes)})),note:'来源记录，不是购买证明或签名授权；修改后摘要变化不表示许可失效。'},null,2)+'\n');
  fs.writeFileSync(path.join(stage,'COPYING.md'),'# SnowUI 所选源码\n\n先读本目录完整 LICENSE；同任务、同版本、同已确认用途不逐组件重复检查。Free 无需账户、公钥或联网。\n\n本目录仅包含你选定的文件，未自动解析或打包其依赖。集成时继续补齐实际 import、样式与外部依赖；不宣称单个组件文件可独立构建。\n\n保留 src 相对结构和 LICENSE / THIRD_PARTY_NOTICES.md；并入已有项目时建议将本目录整体放入 vendor/snowui，不覆盖项目自己的 LICENSE。若移动或改名，更新文件头的许可相对路径；移植后保留对应语言的来源说明与完整许可。多个许可版本分别保存，不能用最新版覆盖旧版。SOURCE_SELECTION.json 只供来源追溯，不代替付款或额度核验。\n');
  // mkdir 是独占保留，避免同名目标在导出期间出现时被覆盖。
  fs.mkdirSync(destination);
  try{for(const name of fs.readdirSync(stage))fs.renameSync(path.join(stage,name),path.join(destination,name));}
  catch(error){fs.rmSync(destination,{recursive:true,force:true});throw error;}
 }finally{fs.rmSync(stage,{recursive:true,force:true});}
 return {files:entries.length,licenseVersion};
}
if(process.argv[1]&&fs.existsSync(process.argv[1])&&import.meta.url===pathToFileURL(fs.realpathSync(process.argv[1])).href){
 const [option,out,...files]=process.argv.slice(2);
 if(option!=='--out'||!out||!files.length){console.error('用法：node scripts/copy-source.mjs --out 新目录 src/components/Button.svelte [其他源码路径]');process.exitCode=1;}
 else console.log(JSON.stringify(copySource(files,out)));
}
