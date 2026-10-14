import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createEdgeProgressiveBlurStyles } from '../src/lib/progressive-blur.ts';

test('edge blur places four transparent layers on every requested edge', () => {
  const directions = {
    'top-to-bottom': ['top: 0', 'height: 96px', 'to bottom'],
    'bottom-to-top': ['bottom: 0', 'height: 96px', 'to top'],
    'left-to-right': ['left: 0', 'width: 96px', 'to right'],
    'right-to-left': ['right: 0', 'width: 96px', 'to left']
  };
  for (const [direction, [edge, extent, gradient]] of Object.entries(directions)) {
    const result = createEdgeProgressiveBlurStyles({ direction, extent: '96px' });
    assert.match(result.containerStyle, new RegExp(edge));
    assert.match(result.containerStyle, new RegExp(extent.replace('.', '\\.')));
    assert.match(result.containerStyle, /pointer-events: none/);
    assert.deepEqual(result.layers.map(layer => layer.index), [0, 1, 2, 3]);
    assert.deepEqual(result.layers.map(layer => layer.style.match(/backdrop-filter: blur\((\d+px)\)/)?.[1]), ['2px', '6px', '12px', '24px']);
    for (const layer of result.layers) {
      assert.ok(layer.style.includes(`mask-image: linear-gradient(${gradient},`));
      assert.ok(layer.style.includes('background-image: linear-gradient(transparent, transparent)'));
    }
  }
});

test('Site top edge preserves the existing 80px fixed visual baseline', () => {
  const result = createEdgeProgressiveBlurStyles({ direction: 'top-to-bottom', extent: '80px', position: 'fixed', zIndex: 19 });
  assert.match(result.containerStyle, /position: fixed; top: 0; left: 0; right: 0; height: 80px; z-index: 19/);
  assert.deepEqual(result.layers.map(layer => layer.style.match(/#000 (\d+%), transparent (\d+%)/)?.slice(1)), [
    ['20%', '100%'], ['16%', '72%'], ['10%', '48%'], ['4%', '28%']
  ]);
});
