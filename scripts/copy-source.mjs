import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {root,sourceFiles,sourceNotice} from './source-notices.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
/** Export selected source files with full license materials; preserve src paths without guessing dependencies or overwriting user files. */
export function copySource(files,out,base=root){
 if(!files.length)throw Error('至少选择一个源码文件');
 const destination=path.resolve(out);
 if(destination===path.resolve(base)||destination.startsWith(path.resolve(base)+path.sep))throw Error('目标必须在来源目录之外');
 if(fs.existsSync(destination))throw Error('目标必须是尚不存在的新目录');
 const allowed=new Set(sourceFiles(base)),selected=[...new Set(files)];
 const entries=selected.map(file=>{
  if(!allowed.has(file))throw Error('仅支持明确的组件或共享源码路径');
  const bytes=fs.readFileSync(path.join(base,file));
  if(!bytes.toString().endsWith(sourceNotice(file,base)))throw Error('所选源码缺少当前许可说明');
  return {file,bytes};
 });
 // Read all materials up front so validation failures never leave partial output.
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
  fs.writeFileSync(path.join(stage,'SOURCE_SELECTION.json'),JSON.stringify({format:1,licenseVersion,licenseSha256:hash(license),files:entries.map(({file,bytes})=>({path:file,sha256:hash(bytes)})),note:'Provenance record only, not proof of purchase or signed authorization; digest changes after local edits do not invalidate your license.'},null,2)+'\n');
  fs.writeFileSync(path.join(stage,'COPYING.md'),'# SnowUI Selected Source\n\nRead the full `./LICENSE` in this directory first; within the same task, license version, and confirmed purpose, do not repeat per-component checks. Free usage requires no account, public key, or network access.\n\nThis directory contains only the files you explicitly selected; the dependency graph is not automatically resolved or bundled. Supply any required internal imports, stylesheets, and external dependencies during integration; a single component file is not guaranteed to build standalone.\n\nPreserve the relative `src/` structure alongside `LICENSE` and `THIRD_PARTY_NOTICES.md`. When vendoring into an existing project, place this directory under `vendor/snowui` without overwriting your project\'s own `LICENSE`. If you move or rename files, update the relative license path in the trailing `@license` notice; when porting to another language or framework, retain attribution and the full license. Keep distinct license versions separate rather than overwriting older copies. `SOURCE_SELECTION.json` is for provenance tracking only and does not replace payment or entitlement verification.\n');
  // Exclusive mkdir prevents overwriting a destination created concurrently during staging.
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
