import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compile } from 'svelte/compiler';
import { formatCodeBlock } from '../src/internal/code-block/format.ts';

test('Svelte 嵌套表达式、字符串、注释与区块格式化后仍可编译且幂等', async () => {
    const source = `<script lang="ts">let count=$state(0);const text="a > b; {x}";const values=[{name:'SnowUI',value:42},{name:'Docs',value:84}];</script><button onclick={()=>count++} title={text} disabled={false}>{count}</button><!-- keep comment -->{#each values as value}<span>{value.name}: {value.value}</span>{/each}<style>span{color:red}</style>`;
    const output = await formatCodeBlock(source, 'svelte');
    assert.notEqual(output, source);
    assert.match(output, /\n\tonclick=/);
    assert.match(output, /a > b; \{x\}/);
    assert.match(output, /keep comment/);
    compile(output, { generate: 'server' });
    assert.equal(await formatCodeBlock(output, 'svelte'), output);
});

for (const [language, source] of [
    ['ts', 'const amount:number=42;const value={name:"SnowUI",amount};'],
    ['jsx', 'const app=<div title="SnowUI"><span>Docs</span></div>'],
    ['json', '{"value":42,"label":"a  b","nested":[1,2]}'],
    ['css', '.chart{color:red;background:white}'],
    ['html', '<div class="chart" title="SnowUI"><span>Docs</span></div>'],
    ['yaml', 'traffic: {docs: 42, site: 84}'],
    ['markdown', '#    SnowUI\n\n-   Docs'],
    ['graphql', 'query{viewer{id name}}'],
]) {
    test(`${language} 使用对应解析器且重复格式化稳定`, async () => {
        const output = await formatCodeBlock(source, language);
        assert.notEqual(output, source);
        assert.equal(await formatCodeBlock(output, language), output);
        if (language === 'json') assert.deepEqual(JSON.parse(output), JSON.parse(source));
    });
}

test('未知语言、语法错误、超长代码保留原文；空语言仅推断已识别代码', async () => {
    for (const [code, language] of [['echo   hello', 'bash'], ['const = {', 'ts'], ['const huge="' + 'x'.repeat(200_000) + '"', 'ts'], ['Hello world', '']]) {
        assert.equal(await formatCodeBlock(code, language), code);
    }
    assert.equal(await formatCodeBlock('const x=1'), 'const x = 1;');
    assert.match(await formatCodeBlock('<Button disabled={false} title="Docs" />'), /\n\tdisabled=/);
});
