import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {root,sourceFiles,checkNotices,sourceNotice,protectedFiles} from './source-notices.mjs';
import {copySource} from './copy-source.mjs';
const temp=t=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'snowui-retention-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir;};
test('所有可复制实现带许可入口，Owner 主题文件不改动',()=>{
 assert.deepEqual(checkNotices(),[]);
 assert.ok(sourceFiles().length>200);
 assert.ok(protectedFiles.has('src/styles/themes.css'));
 assert.ok(!fs.readFileSync(path.join(root,'src/styles/themes.css'),'utf8').includes('SnowUI source notice'));
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
 for(const file of sourceFiles())if(!protectedFiles.has(file)){
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
