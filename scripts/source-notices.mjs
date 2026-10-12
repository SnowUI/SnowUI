import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const protectedFiles=new Set(['src/styles/themes.css']);
export function sourceFiles(base=root){
 const walk=dir=>fs.readdirSync(path.join(base,dir),{withFileTypes:true}).flatMap(e=>{
  if(e.isSymbolicLink())throw Error('源码不可包含符号链接');
  const p=dir+'/'+e.name;
  if(e.isDirectory())return /\/(test|demo|playground)$/.test(p)?[]:walk(p);
  return /\.(svelte|ts|js|mjs|css)$/.test(p)&&!p.includes('.test.')?[p]:[];
 });return walk('src').sort();
}
export function sourceNotice(file,base=root){
 const version=fs.readFileSync(path.join(base,'LICENSE'),'utf8').match(/许可版本：v([\d.]+)/)?.[1];
 if(!version)throw Error('完整 LICENSE 缺少版本');
 const relative=path.relative(path.dirname(file),'LICENSE').split(path.sep).join('/');
 const text=`SnowUI source notice | LICENSE ${version}: ${relative}\n复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。`;
 return file.endsWith('.svelte')?`<!-- ${text} -->\n`:`/* ${text} */\n`;
}
export function checkNotices(base=root){return sourceFiles(base).filter(file=>!protectedFiles.has(file)&&!fs.readFileSync(path.join(base,file),'utf8').startsWith(sourceNotice(file,base)));}
if(process.argv[1]&&fs.existsSync(process.argv[1])&&import.meta.url===pathToFileURL(fs.realpathSync(process.argv[1])).href){
 const write=process.argv.slice(2).join(' ')==='--write';
 if(process.argv.length>2&&!write&&process.argv[2]!=='--check')throw Error('仅支持 --write / --check');
 if(write)for(const file of sourceFiles()){
  if(protectedFiles.has(file))continue;
  const full=path.join(root,file),text=fs.readFileSync(full,'utf8');
  const stripped=text.replace(/^(?:<!--|\/\*) SnowUI source notice[\s\S]*?(?:-->|\*\/)\n/,'');
  fs.writeFileSync(full,sourceNotice(file)+stripped);
 }
 const missing=checkNotices();if(missing.length){console.error('许可文件头缺失或过期：\n'+missing.join('\n'));process.exitCode=1;}
 else console.log(`源码许可文件头通过；${sourceFiles().length-protectedFiles.size} 文件，Owner 专属主题文件保持原样。`);
}
