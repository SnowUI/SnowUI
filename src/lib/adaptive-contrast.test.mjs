import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getAdaptiveContrastColor, isAdaptiveContrastMonochrome } from './adaptive-contrast.ts';

test('反白使用设计系统静态黑白，不需要 DOM', () => {
    assert.equal(getAdaptiveContrastColor(), 'var(--static-black-100, #000)');
    assert.equal(getAdaptiveContrastColor(true), 'var(--static-white-100, #fff)');
    assert.equal(typeof document, 'undefined');
});

test('只接管明确不透明黑白，彩色、透明与未知变量不变', () => {
    for (const color of ['black', 'WHITE', '#000', '#fff', '#000f', '#FFFF', '#000000FF', '#ffffffff', 'var(--black-100)', 'var(--static-white-100, #fff)']) {
        assert.ok(isAdaptiveContrastMonochrome(color), color);
    }
    for (const color of ['red', '#f00', '#0008', '#00000080', '#000ff', 'transparent', 'var(--primary)', 'url(#gradient)']) {
        assert.equal(isAdaptiveContrastMonochrome(color), false, color);
    }
});
