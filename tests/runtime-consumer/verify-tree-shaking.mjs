import {build} from 'vite';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const result=await build({configFile:false,build:{outDir:'minimal-dist',lib:{entry:'tree-shaking.ts',formats:['es'],fileName:'button'},rolldownOptions:{external:id=>id==='svelte'||id.startsWith('svelte/')}}});
const code=fs.readFileSync('minimal-dist/button.js','utf8');
assert.ok(code.includes('snowui-button'));
const chunks=(Array.isArray(result)?result:[result]).flatMap(r=>r.output).filter(o=>o.type==='chunk');
for(const chunk of chunks)for(const [id,module] of Object.entries(chunk.modules)) {
 if(/\/lib\/media-loading\.js$|\/components\/(BarChart|DataTable)\.js$|\/blocks\/Sidebar\.js$/.test(id))assert.equal(module.renderedLength,0,`Unexpected retained implementation: ${id}`);
}
console.log('PASS: Button-only bundle excludes charts, DataTable and Sidebar');
