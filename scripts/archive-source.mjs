import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');process.chdir(root);
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const out=path.resolve(process.argv[2]??'artifacts');fs.mkdirSync(out,{recursive:true});
const stage=fs.mkdtempSync(path.join(out,'.source-'));const folder=path.join(stage,`snowui-source-${pkg.version}`);fs.mkdirSync(folder);
const allowed=['src','tests','scripts','package.json','pnpm-lock.yaml','pnpm-workspace.yaml','tsconfig.json','tsconfig.node.json','svelte.config.js','vite.config.ts','LICENSE','THIRD_PARTY_NOTICES.md','README.md','component-discovery.json','component-catalog.json'];
for(const name of allowed){if(!fs.existsSync(name))throw Error('缺少源码交付项 '+name);fs.cpSync(name,path.join(folder,name),{recursive:true,filter:p=>!/(?:^|\/)(?:node_modules|\.git|\.DS_Store|\.env(?:\..*)?)(?:\/|$)/.test(p)&&!/^src\/(?:demo|test|playground)(?:\/|$)/.test(p)});}
fs.writeFileSync(path.join(folder,'SOURCE_BUILD.md'),'# 源码构建\n\n先阅读 LICENSE。Node 24 与 pnpm 10.20；运行 pnpm install --frozen-lockfile，然后 pnpm build、pnpm catalog:check、pnpm pack:check。无需兄弟源码仓库；构建输出为 dist/client 和 dist/server。源码可自主维护，组件运行不依赖授权服务器。\n\n此归档是维护候选，订单凭证、资源发布日期和 Figma 快照由正式交付服务另附；仅生成 ZIP 不代表已销售或已授权给客户。\n');
const basename=`snowui-source-${pkg.version}.zip`;const dest=path.join(out,basename);fs.rmSync(dest,{force:true});execFileSync('zip',['-qr',dest,path.basename(folder)],{cwd:stage});fs.rmSync(stage,{recursive:true,force:true});
const checksum=createHash('sha256').update(fs.readFileSync(dest)).digest('hex');fs.writeFileSync(dest+'.sha256',`${checksum}  ${basename}\n`);console.log(dest+'\nSHA256 '+checksum);
