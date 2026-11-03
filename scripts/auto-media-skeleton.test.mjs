import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import { render } from 'svelte/server';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const server = await createServer({ configFile: false, plugins: [svelte({ compilerOptions: { dev: false }, inspector: false })], server: { middlewareMode: true, hmr: false }, ssr: { external: ['svelte'], optimizeDeps: { noDiscovery: true, include: [] } }, appType: 'custom', logLevel: 'error' });
try {
 const { default: Fixture } = await server.ssrLoadModule('/tests/auto-media-skeleton.svelte');
 test('字符串媒体初始渲染自动包含 Avatar、Image 与 Icon 的 Skeleton', () => {
  const html = render(Fixture, { props: { src: '/sample.png' } }).body;
  assert.equal((html.match(/class="[^"]*snowui-skeleton(?:\s|")/g) ?? []).length, 3);
 });
 test('没有媒体来源时不伪造媒体加载骨架', () => {
  const html = render(Fixture).body;
  assert.doesNotMatch(html, /class="[^"]*snowui-skeleton(?:\s|")/);
 });
 test('账户数据加载时无图片 Avatar 仍由 Frame 生成骨架', () => {
  const html = render(Fixture, { props: { loading: true } }).body;
  assert.equal((html.match(/class="[^"]*snowui-skeleton(?:\s|")/g) ?? []).length, 1);
 });
 test('Avatar 与 Icon 遵守显式关闭 Skeleton', () => {
  const html = render(Fixture, { props: { src: '/sample.png', skeleton: false } }).body;
  assert.equal((html.match(/class="[^"]*snowui-skeleton(?:\s|")/g) ?? []).length, 1);
 });
} finally { await server.close(); }
