import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';
import {stripVTControlCharacters} from 'node:util';
import {fileURLToPath} from 'node:url';
import {execFileSync,spawn} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=process.env.SNOWUI_TEST_PORT??'5219';const url=`http://127.0.0.1:${port}/`;
// Never consume a stale preview from another run, even when it answers HTTP successfully.
await new Promise((resolve,reject)=>{const probe=net.createServer();probe.once('error',error=>reject(new Error(`候选包验证端口${port}不可用；不能复用已有服务。`,{cause:error})));probe.listen({host:'127.0.0.1',port:Number(port),exclusive:true},()=>probe.close(error=>error?reject(error):resolve()));});

const directory=fs.mkdtempSync(path.join(os.tmpdir(),'snowui-runtime-'));
const fixture=path.join(directory,'consumer');fs.cpSync(path.join(root,'tests/runtime-consumer'),fixture,{recursive:true});
const [pack]=JSON.parse(execFileSync('npm',['pack','--json','--ignore-scripts','--pack-destination',directory,'--cache',path.join(root,'node_modules/.cache/npm')],{cwd:root,encoding:'utf8'}));
const manifest=JSON.parse(fs.readFileSync(path.join(fixture,'package.json'),'utf8'));manifest.dependencies['@snowui-design-system/components']='file:'+path.join(directory,pack.filename);fs.writeFileSync(path.join(fixture,'package.json'),JSON.stringify(manifest,null,2));
const run=(args)=>execFileSync('pnpm',args,{cwd:fixture,stdio:'inherit',env:{...process.env,CI:'true'}});
run(['install','--no-frozen-lockfile']);run(['check']);run(['build']);run(['exec','node','verify-tree-shaking.mjs']);
if(process.env.CI)run(['exec','playwright','install','--with-deps','chromium']);
let ownPreviewReady=false;let previewOutput='';
const server=spawn(process.execPath,[path.join(fixture,'node_modules/vite/bin/vite.js'),'preview','--host','127.0.0.1','--port',port,'--strictPort'],{cwd:fixture,stdio:['ignore','pipe','inherit']});
server.stdout.on('data',chunk=>{process.stdout.write(chunk);previewOutput=(previewOutput+chunk.toString()).slice(-4096);if(stripVTControlCharacters(previewOutput).includes(url.slice(0,-1)))ownPreviewReady=true;});
try{
 let ready=false;for(let i=0;i<80;i++){if(server.exitCode!==null)throw Error(`候选包预览提前退出：${server.exitCode}`);if(ownPreviewReady){try{if((await fetch(url)).ok){ready=true;break;}}catch{}}await new Promise(r=>setTimeout(r,250));}
 if(!ready)throw Error('候选包预览未能启动');
 execFileSync('pnpm',['exec','node','verify-browser.mjs'],{cwd:fixture,stdio:'inherit',env:{...process.env,SNOWUI_TEST_URL:url}});
 console.log('候选包独立消费检查通过：'+fixture);
}finally{server.kill('SIGTERM');}
