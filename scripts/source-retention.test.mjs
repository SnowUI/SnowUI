import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import {createHash,createPublicKey} from 'node:crypto';
import {root,sourceFiles,checkNotices,sourceNotice} from './source-notices.mjs';
import {copySource} from './copy-source.mjs';
const temp=t=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'snowui-retention-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir;};
test('所有可复制实现含主题权威源均带许可入口',()=>{
 assert.deepEqual(checkNotices(),[]);
 assert.ok(sourceFiles().length>200);
 assert.ok(fs.readFileSync(path.join(root,'src/styles/themes.css'),'utf8').startsWith(sourceNotice('src/styles/themes.css')));
});
test('内置 Phosphor 图标的独立版权与许可随源码复制材料保留',()=>{
 const icons=fs.readFileSync(path.join(root,'src/internal/component-icon/builtin-icon-data.ts'),'utf8');
 assert.match(icons,/"sourceCollection": "phosphor"/);
 const notice=fs.readFileSync(path.join(root,'THIRD_PARTY_NOTICES.md'),'utf8');
 assert.match(notice,/## Phosphor Icons（内置功能图标快照；MIT）/);
 assert.match(notice,/Copyright \(c\) 2023 Phosphor Icons/);
 assert.match(notice,/The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software\./);
});
test('选择两个实现导出保留完整许可、路径、原字节及来源摘要',t=>{
 const out=path.join(temp(t),'vendor','snowui');const files=['src/components/Button.svelte','src/lib/date-format.ts'];
 const result=copySource(files,out);assert.equal(result.files,2);
 for(const file of [...files,'LICENSE','THIRD_PARTY_NOTICES.md','AGENTS.md'])assert.deepEqual(fs.readFileSync(path.join(out,file)),fs.readFileSync(path.join(root,file)));
 const manifest=JSON.parse(fs.readFileSync(path.join(out,'SOURCE_SELECTION.json')));
 assert.equal(manifest.licenseSha256,createHash('sha256').update(fs.readFileSync(path.join(out,'LICENSE'))).digest('hex'));
 for(const file of files){const relative=sourceNotice(file).match(/LICENSE [\d.]+: (.+)\n/)[1];assert.equal(path.resolve(out,path.dirname(file),relative),path.join(out,'LICENSE'));}
 assert.match(fs.readFileSync(path.join(out,'COPYING.md'),'utf8'),/未自动解析/);
});
test('已有项目及许可不覆盖，越界、测试文件和缺失说明均拒绝',t=>{
 const dir=temp(t),out=path.join(dir,'existing');fs.mkdirSync(out);fs.writeFileSync(path.join(out,'LICENSE'),'my-license');
 assert.throws(()=>copySource(['src/components/Button.svelte'],out),/新目录/);
 assert.equal(fs.readFileSync(path.join(out,'LICENSE'),'utf8'),'my-license');
 for(const file of ['../LICENSE','src/components/../../LICENSE','src/test/GradientMotionController.svelte'])assert.throws(()=>copySource([file],path.join(dir,'new')),/仅支持/);
 assert.equal(fs.existsSync(path.join(dir,'new')),false);
 const fake=path.join(dir,'fake');fs.mkdirSync(path.join(fake,'src'),{recursive:true});fs.writeFileSync(path.join(fake,'LICENSE'),'许可版本：v2.0.0');fs.writeFileSync(path.join(fake,'src','a.ts'),'export {};');
 assert.deepEqual(checkNotices(fake),['src/a.ts']);
 assert.throws(()=>copySource(['src/a.ts'],path.join(dir,'copy'),fake),/缺少当前许可/);
 fs.symlinkSync(path.join(root,'src/components/Button.svelte'),path.join(fake,'src','link.ts'));
 assert.throws(()=>sourceFiles(fake),/符号链接/);
});
test('许可文件头生成幂等，版本入口与免费去重规则一致',()=>{
 for(const file of sourceFiles()){
  const text=fs.readFileSync(path.join(root,file),'utf8');assert.equal(text.split('SnowUI source notice').length,2);assert.ok(text.startsWith(sourceNotice(file)));assert.doesNotMatch(sourceNotice(file),/\bv\d+\.\d+\.\d+\b/,'许可版本不应被组件元数据解析器误识别');
 }
 assert.match(fs.readFileSync(path.join(root,'AGENTS.md'),'utf8'),/同任务、同版本、同已确认范围无需重复读取/);
});

test('从符号链接入口实际执行复制 CLI，不得静默跳过',t=>{
 const dir=temp(t),link=path.join(dir,'copy.mjs'),out=path.join(dir,'export');fs.symlinkSync(path.join(root,'scripts/copy-source.mjs'),link);
 const result=JSON.parse(execFileSync(process.execPath,[link,'--out',out,'src/components/Button.svelte'],{encoding:'utf8'}));
 assert.equal(result.files,1);assert.ok(fs.existsSync(path.join(out,'LICENSE')));
});

test('工具模块可由标准输入脚本导入，不误执行 CLI',()=>{
 const code="await import("+JSON.stringify(new URL('./source-notices.mjs',import.meta.url).href)+");await import("+JSON.stringify(new URL('./copy-source.mjs',import.meta.url).href)+");console.log('import-ok');";
 assert.equal(execFileSync(process.execPath,['--input-type=module','-'],{input:code,encoding:'utf8'}).trim(),'import-ok');
});

// 归档和泄漏检查只使用合成身份，不操作真实 Owner 私钥或挑战状态。
function deliveryFixture(t){
 const dir=temp(t),base=path.join(dir,'source');fs.mkdirSync(base);
 const write=(file,content)=>{const full=path.join(base,file);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,content);};
 for(const directory of ['src','tests','scripts'])fs.mkdirSync(path.join(base,directory));
 write('package.json',JSON.stringify({name:'snowui-delivery-fixture',version:'0.0.0',type:'module',license:'SEE LICENSE IN LICENSE',exports:{'./LICENSE':'./LICENSE'},files:['dist','component-catalog.json','README.md','AGENTS.md','llms.txt','LICENSE','THIRD_PARTY_NOTICES.md']}));
 write('LICENSE','许可版本：v2.2.0\n不要求注册、登录、公钥、签名许可、激活码或中心登记\n');
 for(const file of ['README.md','AGENTS.md','llms.txt'])write(file,'[许可](./LICENSE)\n');
 for(const file of ['pnpm-lock.yaml','pnpm-workspace.yaml','tsconfig.json','tsconfig.node.json','svelte.config.js','vite.config.ts','THIRD_PARTY_NOTICES.md','component-discovery.json','component-catalog.json'])write(file,'{}\n');
 write('OWNER_IDENTITY.md','合成公开身份；不认证法律著作权。\n');
 write('owner-identity.public.json',JSON.stringify({schemaVersion:1,fixture:true,publicKey:'synthetic-public-data'})+'\n');
 write('src/a.js',sourceNotice('src/a.js',base)+'export {};\n');
 fs.copyFileSync(path.join(root,'scripts/source-notices.mjs'),path.join(base,'scripts/source-notices.mjs'));
 fs.copyFileSync(path.join(root,'scripts/check-runtime-package.mjs'),path.join(base,'scripts/check-runtime-package.mjs'));
 for(const file of ['dist/client/index.js','dist/server/index.js','dist/client/index.d.ts'])write(file,'export {};\n');
 execFileSync('git',['init','--quiet',base]);
 execFileSync('git',['-C',base,'-c','user.name=Delivery Fixture','-c','user.email=fixture@example.invalid','-c','commit.gpgsign=false','commit','--quiet','--allow-empty','-m','fixture']);
 return {dir,base,write};
}
const runArchive=(fixture,out)=>execFileSync(process.execPath,[path.join(root,'scripts/archive-source.mjs'),out,'--source-root',fixture.base],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
const runPackageCheck=fixture=>execFileSync(process.execPath,[path.join(fixture.base,'scripts/check-runtime-package.mjs')],{encoding:'utf8',stdio:['ignore','pipe','pipe']});

test('源码归档保留公开身份材料及摘要，不携带私有核验实现',t=>{
 const fixture=deliveryFixture(t),out=path.join(fixture.dir,'archive');runArchive(fixture,out);
 const zip=path.join(out,'snowui-source-0.0.0-license-2.2.0.zip');
 const listing=execFileSync('unzip',['-Z1',zip],{encoding:'utf8'});
 assert.match(listing,/\/OWNER_IDENTITY\.md\n/);assert.match(listing,/\/owner-identity\.public\.json\n/);
 assert.doesNotMatch(listing,/owner\.private|snowui-owner|challenges/);
 const prefix='snowui-source-0.0.0-license-2.2.0/';
 const identity=execFileSync('unzip',['-p',zip,prefix+'owner-identity.public.json']);
 assert.deepEqual(identity,fs.readFileSync(path.join(fixture.base,'owner-identity.public.json')));
 const manifest=JSON.parse(execFileSync('unzip',['-p',zip,prefix+'SOURCE_MANIFEST.json'],{encoding:'utf8'}));
 assert.deepEqual(manifest.ownerIdentity,{path:'owner-identity.public.json',sha256:createHash('sha256').update(identity).digest('hex')});
 assert.equal(manifest.schemaVersion,1);
 const names=listing.trim().split('\n').filter(name=>!name.endsWith('/')&&name!==prefix+'SOURCE_MANIFEST.json').map(name=>name.slice(prefix.length)).sort();
 assert.deepEqual(manifest.files.map(entry=>entry.path),names);
 for(const entry of manifest.files){
  const bytes=execFileSync('unzip',['-p',zip,prefix+entry.path]);
  assert.equal(entry.size,bytes.length);assert.equal(entry.sha256,createHash('sha256').update(bytes).digest('hex'));
 }
 assert.equal(manifest.files.some(entry=>entry.path==='SOURCE_MANIFEST.json'),false);
 assert.match(execFileSync('unzip',['-p',zip,prefix+'SOURCE_BUILD.md'],{encoding:'utf8'}),/官方 HTTPS 身份锚点尚未上线/);
});

test('源码归档拒绝所有者私钥、备份、证明状态和符号链接，失败清理暂存',t=>{
 const fixture=deliveryFixture(t),out=path.join(fixture.dir,'archive');
 const cases=[['scripts/owner.private.pem','synthetic'],['scripts/owner.backup.pem','synthetic'],['tests/owner-proof.json','{}'],['tests/state.json',JSON.stringify({purpose:'snowui-owner-maintenance',nonce:'synthetic'})]];
 for(const [file,content] of cases){
  fixture.write(file,content);assert.throws(()=>runArchive(fixture,out),/源码归档禁止所有者/);fs.rmSync(path.join(fixture.base,file));
  assert.deepEqual(fs.readdirSync(out),[],'失败不留下半份归档或暂存目录');
 }
 for(const directory of ['scripts/snowui-owner','tests/owner/challenges','tests/challenges']){
  fixture.write(directory+'/state.json','{}');assert.throws(()=>runArchive(fixture,out),/源码归档禁止所有者/);fs.rmSync(path.join(fixture.base,directory),{recursive:true});
 }
 fs.rmSync(path.join(fixture.base,'tests/owner'),{recursive:true});
 fixture.write('tests/innocent.txt','-----BEGIN '+'ENCRYPTED PRIVATE KEY-----\nsynthetic\n');
 assert.throws(()=>runArchive(fixture,out),/源码归档禁止私钥内容/);fs.rmSync(path.join(fixture.base,'tests/innocent.txt'));
 fs.symlinkSync(path.join(fixture.base,'README.md'),path.join(fixture.base,'scripts/linked.md'));
 assert.throws(()=>runArchive(fixture,out),/源码归档仅接受普通文件/);assert.deepEqual(fs.readdirSync(out),[]);
});

test('运行包允许正常交付并拒绝 dist 中伪装的所有者材料和私钥内容',t=>{
 const fixture=deliveryFixture(t);assert.match(runPackageCheck(fixture),/运行包允许清单通过/);
 for(const file of ['dist/client/owner.private.pem','dist/client/owner-challenge.json','dist/server/owner-proof.json','dist/server/snowui-owner/cli.js']){
  fixture.write(file,'synthetic\n');assert.throws(()=>runPackageCheck(fixture),/含所有者私有材料或私钥/);fs.rmSync(path.join(fixture.base,file));
 }
 fixture.write('dist/client/innocent.js','-----BEGIN '+'PRIVATE KEY-----\nsynthetic\n');
 assert.throws(()=>runPackageCheck(fixture),/含所有者私有材料或私钥/);
 fs.rmSync(path.join(fixture.base,'dist/client/innocent.js'));
 fixture.write('dist/server/innocent.json',JSON.stringify({challenge:{purpose:'snowui-owner-maintenance',nonce:'synthetic'},used:false}));
 assert.throws(()=>runPackageCheck(fixture),/含所有者私有材料或私钥/);
});

test('源码和运行包拒绝专用助记词文件及改名的恢复记录，公开元数据仍可交付',t=>{
 const fixture=deliveryFixture(t),out=path.join(fixture.dir,'archive');
 const format=['snowui-owner','ed25519','entropy-v1'].join('-'),ownerId=['snowui','byewind'].join(':');
 const synthetic=Array(24).fill('synthetic').join(' ');
 const records=[{format,mnemonic:synthetic},{version:format,mnemonic:synthetic},{ownerId,words:synthetic.split(' ')},{ownerId,recoveryWords:synthetic}];
 for(const name of ['owner.recovery.json','owner.mnemonic.txt','.owner.mnemonic.backup']){
  const source='tests/'+name,compiled='dist/client/'+name;
  fixture.write(source,synthetic);assert.throws(()=>runArchive(fixture,out),/源码归档禁止所有者/);fs.rmSync(path.join(fixture.base,source));
  fixture.write(compiled,synthetic);assert.throws(()=>runPackageCheck(fixture),/含所有者私有材料或私钥/);fs.rmSync(path.join(fixture.base,compiled));
 }
 const texts=records.map(record=>JSON.stringify(record));
 texts.push('const recovery='+JSON.stringify(records[0])+';', 'const recovery='+JSON.stringify(JSON.stringify(records[0]))+';',JSON.stringify({embedded:JSON.stringify(records[0])}));
 for(const content of texts){
  fixture.write('tests/renamed.txt',content);assert.throws(()=>runArchive(fixture,out),/源码归档禁止所有者助记词或恢复材料/);fs.rmSync(path.join(fixture.base,'tests/renamed.txt'));
  fixture.write('dist/client/renamed.js',content);assert.throws(()=>runPackageCheck(fixture),/含所有者私有材料或私钥/);fs.rmSync(path.join(fixture.base,'dist/client/renamed.js'));
 }
 fixture.write('tests/public-metadata.json',JSON.stringify({format,ownerId,wordlistSha256:'synthetic-public-digest'}));
 fixture.write('tests/documentation.txt','说明 mnemonic 字段及 '+format+'；普通英文词：'+synthetic);
 assert.doesNotThrow(()=>runArchive(fixture,out));assert.match(runPackageCheck(fixture),/运行包允许清单通过/);
});

test('公开身份副本、公钥指纹与随包文字一致，不把登记写成法律权属认证',()=>{
 const publicBytes=fs.readFileSync(path.join(root,'owner-identity.public.json'));
 const identity=JSON.parse(publicBytes);
 assert.equal(identity.ownerId,'snowui:byewind');assert.equal(identity.legalOwnershipVerified,false);
 const key=createPublicKey(identity.publicKey);assert.equal(key.asymmetricKeyType,'ed25519');
 assert.equal(identity.fingerprint,'sha256:'+createHash('sha256').update(key.export({type:'spki',format:'der'})).digest('hex'));
 for(const file of ['README.md','OWNER_IDENTITY.md']){
  const text=fs.readFileSync(path.join(root,file),'utf8');assert.ok(text.includes(identity.fingerprint));assert.match(text,/法律.*著作权/);
 }
});
