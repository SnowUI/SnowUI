import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { compile, compileModule } from 'svelte/compiler';
import {sourceNotice} from './source-notices.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
process.chdir(root);
const staging=path.join(root,'.runtime-build');
fs.rmSync(staging,{recursive:true,force:true});
fs.rmSync('dist',{recursive:true,force:true,maxRetries:3,retryDelay:100});
const excluded=/(?:^|\/)(?:demo|test|playground)(?:\/|$)|\.test\.|\.md$|\.DS_Store$/;
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const file of walk('src')){
 if(excluded.test(file))continue;
 const out=path.join(staging,'input',path.relative('src',file));fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(file,out);
}
execFileSync('pnpm',['exec','svelte-package','--input','.runtime-build/input','--output','.runtime-build/package','--tsconfig','tsconfig.json'],{stdio:'inherit'});
const pkg=path.join(staging,'package');
function resolveImport(from,spec){
 if(!spec.startsWith('.'))return spec;
 const [pathname,query]=spec.split('?');
 const absolute=path.resolve(path.dirname(from),pathname);
 const found=[absolute,absolute+'.js',absolute+'.svelte.js',absolute+'.svelte',path.join(absolute,'index.js')].find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());
 if(!found)throw new Error(`构建后引用不存在: ${from} -> ${spec}`);
 let rel=path.relative(path.dirname(from),found).split(path.sep).join('/');
 if(rel.endsWith('.svelte'))rel+='.js';
 rel=rel.replaceAll('.svelte.js','.js');
 return (rel.startsWith('.')?rel:'./'+rel)+(query?'?'+query:'');
}
for(const mode of ['client','server']){
 for(const file of walk(pkg)){
  const rel=path.relative(pkg,file);
  if(excluded.test(rel)||rel.endsWith('.map'))continue;
  let code=fs.readFileSync(file);
  let outputRel=rel;
  if(rel.endsWith('.svelte')){
   code=compile(code.toString(),{filename:path.join('src',rel),generate:mode,dev:false,css:'injected'}).js.code;
   outputRel+='.js';
  }else if(rel.endsWith('.svelte.js'))code=compileModule(code.toString(),{filename:path.join('src',rel),generate:mode,dev:false}).js.code;
  if(outputRel.endsWith('.js')){
   code=code.toString().replaceAll('import.meta.env.DEV','false').replace(/((?:from\s*|import\s*\(|import\s*)["'])([^"']+)(["'])/g,(_,a,s,b)=>a+resolveImport(file,s)+b).replace(/\/\/# sourceMappingURL=.*$/gm,'');
  }
  outputRel=outputRel.replaceAll('.svelte.js','.js').replaceAll('.svelte.d.ts','.d.ts');
  if(outputRel.endsWith('.d.ts')) code=code.toString().replace(/(["'])([^"']+)\.svelte(?:\.js)?\1/g,'$1$2.js$1');
  const dest=path.join('dist',mode,outputRel);
  // 保留的源码许可说明需指向安装包根 LICENSE，不能沿用 src 的层级。
  if(code.toString().startsWith('/* SnowUI source notice'))code=code.toString().replace(/^\/\* SnowUI source notice[\s\S]*?\*\/\n/,sourceNotice(dest));
  fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,code);
 }
}
fs.writeFileSync('dist/client/styles/index.d.ts','export {};\n');
fs.rmSync(staging,{recursive:true,force:true});
console.log('客户端、服务端、公开类型与样式已生成；未输出原始组件及 source map。');
