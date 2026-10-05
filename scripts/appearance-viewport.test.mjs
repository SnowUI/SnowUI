import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAppearanceGate, resolveAppearanceViewportGeometry, observeAppearanceRelease } from '../src/lib/chart/appearance-viewport.ts';
const host = (ready, parentElement = null) => ({parentElement, getAttribute: key => key === 'data-snowui-appearance-gated' ? 'true' : ready ? 'true' : 'false'});
const element = parentElement => ({parentElement, getAttribute: () => null, getBoundingClientRect: () => ({top:40,height:80})});
const windowFor = () => { const w={innerHeight:600}; w.parent=w; return w; };
test('独立消费保持正常几何；页面门禁未放行时不可提前触发', () => {
 const w=windowFor(); assert.equal(resolveAppearanceViewportGeometry(element(null),w).top,40);
 assert.equal(resolveAppearanceViewportGeometry(element(host(false)),w).top,Infinity);
 assert.equal(resolveAppearanceViewportGeometry(element(host(true)),w).appearanceReleased,true);
});
test('同源 iframe 与页面嵌套门禁全部放行才释放', () => {
 const outer=windowFor(); const frame=host(false);frame.getBoundingClientRect=()=>({top:100,height:300});frame.clientHeight=300;
 const inner={parent:outer,frameElement:frame,innerHeight:300};
 const e=element(host(true)); assert.equal(resolveAppearanceViewportGeometry(e,inner).appearanceReleased,false);
 frame.getAttribute=k=>'true'; const geometry=resolveAppearanceViewportGeometry(e,inner);assert.equal(geometry.top,140);assert.equal(geometry.appearanceReleased,true);
});
test('首次放行后断开观察，卸载能取消尚未释放的观察', () => {
 const w=windowFor(); globalThis.window=w;let callback,disconnected=0, released=0;
 globalThis.MutationObserver=class {constructor(cb){callback=cb;} observe(){} disconnect(){disconnected++;}};
 const parent=host(false); const cleanup=observeAppearanceRelease(element(parent),()=>released++);
 callback();assert.equal(released,0);parent.getAttribute=()=> 'true';callback();assert.equal(released,1);assert.equal(disconnected,1);cleanup();assert.equal(disconnected,2);
 delete globalThis.window;delete globalThis.MutationObserver;
});
