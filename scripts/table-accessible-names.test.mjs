import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import { render } from 'svelte/server';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const server = await createServer({
    configFile: false,
    plugins: [svelte({ compilerOptions: { dev: false }, inspector: false })],
    server: { middlewareMode: true, hmr: false },
    ssr: { external: ['svelte'], optimizeDeps: { noDiscovery: true, include: [] } },
    appType: 'custom',
    logLevel: 'error',
});

try {
    const { default: Fixture } = await server.ssrLoadModule('/tests/table-accessible-names.svelte');
    const html = (props) => render(Fixture, { props }).body;

    test('default locale names the scroll region and omits internal column IDs', () => {
        const output = html({ tableName: '订阅', columnLabel: '创建时间' });
        assert.match(output, /aria-label="订阅，可横向滚动"/);
        assert.match(output, /aria-label="调整 创建时间 列宽"/);
        assert.doesNotMatch(output, /aria-label="[^"]*createdAt/);
    });

    test('English locale and unnamed columns use localized generic names', () => {
        const output = html({ locale: 'en-US', tableName: 'Subscriptions' });
        assert.match(output, /aria-label="Subscriptions, horizontally scrollable"/);
        assert.match(output, /aria-label="Resize column width"/);
        assert.doesNotMatch(output, /aria-label="[^"]*createdAt/);
    });

    test('provider overrides apply to built-in labels without changing business text', () => {
        const output = html({
            locale: 'en-US',
            tableName: 'Subscriptions',
            columnLabel: 'Created',
            messages: {
                'table.scrollRegionNamed': 'Scroll through {{name}}',
                'tableHead.resizeColumn': 'Set width for {{column}}',
            },
        });
        assert.match(output, /aria-label="Scroll through Subscriptions"/);
        assert.match(output, /aria-label="Set width for Created"/);
        assert.match(output, /<table[^>]*aria-label="Subscriptions"/);
    });

    test('unnamed tables use a localized region fallback', () => {
        assert.match(html({}), /aria-label="可横向滚动的表格"/);
        assert.match(html({ locale: 'en-US' }), /aria-label="Scrollable table"/);
    });
} finally {
    await server.close();
}
