import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const response=await fetch(process.env.SNOWUI_TEST_URL);const html=await response.text();assert.equal(response.status,200);assert.ok(html.includes('identity-ok'));assert.ok(html.includes('Count 0'));assert.ok(html.includes('Legacy snippet'));
const browser=await chromium.launch({headless:true});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'||m.text().includes('hydration_mismatch'))errors.push(m.text());});
await page.goto(process.env.SNOWUI_TEST_URL);await page.getByRole('button',{name:'Count 0',exact:true}).click();await page.getByRole('button',{name:'Count 1',exact:true}).waitFor();await page.getByRole('textbox',{name:'Name',exact:true}).fill('Bound value');assert.equal(await page.getByTestId('bound').textContent(),'Bound value');await page.getByRole('searchbox',{name:'Search rows',exact:true}).fill('Beta');await page.waitForFunction(()=>!document.querySelector('tbody')?.textContent?.includes('Alpha'));assert.ok((await page.locator('tbody').textContent()).includes('Beta'));assert.equal(await page.getByTestId('identity').textContent(),'identity-ok');await page.getByRole('button',{name:'Coordinate target',exact:true}).click();assert.equal(await page.getByTestId('coordination-count').textContent(),'1');assert.equal(await page.locator('#coordinated-target').evaluate(el=>getComputedStyle(el).opacity),'0.4');const countButton=page.getByRole('button',{name:'Count 1',exact:true});await countButton.focus();await page.keyboard.press('Space');await page.getByRole('button',{name:'Count 2',exact:true}).waitFor();
await page.waitForFunction(()=>document.querySelector('[data-testid="animated-number"]')?.textContent?.trim()==='2');
const light=await page.getByTestId('theme-probe').evaluate(el=>getComputedStyle(el).backgroundColor);await page.evaluate(()=>document.documentElement.setAttribute('theme','dark'));const dark=await page.getByTestId('theme-probe').evaluate(el=>getComputedStyle(el).backgroundColor);assert.notEqual(dark,light);await page.evaluate(()=>document.documentElement.removeAttribute('theme'));assert.equal(await page.getByTestId('theme-probe').evaluate(el=>getComputedStyle(el).backgroundColor),light);
// 必须在已水合的真实 tarball 消费页面验证，CSS 注入顺序与源码模式不同。
const separators=await page.locator('.snowui-sidebar .snowui-separator-row').evaluateAll(nodes=>nodes.map(node=>{
 const css=getComputedStyle(node);
 return node.getBoundingClientRect().height-parseFloat(css.paddingTop)-parseFloat(css.paddingBottom);
}));
assert.equal(separators.length,2);
for(const height of separators)assert.equal(height,0.5,'运行包侧栏必须保留真实分隔线绘制高度');
console.log('PASS: tarball Sidebar explicit and built-in Separator content height 0.5px');
// 仅消费已安装tarball的公开Context，语言更新必须保留同一分组折叠状态。
assert.ok(html.includes('Primary navigation'),'服务端已编译Provider必须输出英文默认名称');
await page.getByRole('navigation',{name:'Primary navigation',exact:true}).waitFor();
await page.getByRole('button',{name:'Collapse Components',exact:true}).click();
await page.getByRole('button',{name:'Expand Components',exact:true}).waitFor();
await page.getByRole('button',{name:'Use Chinese',exact:true}).click();
await page.getByRole('navigation',{name:'主导航',exact:true}).waitFor();
await page.getByRole('button',{name:'展开Components',exact:true}).waitFor();
assert.equal(await page.getByRole('button',{name:'收起Components',exact:true}).count(),0,'切语言不得重开已折叠分组');
await page.getByRole('button',{name:'展开Components',exact:true}).click();
await page.getByRole('button',{name:'收起Components',exact:true}).waitFor();
await page.getByRole('button',{name:'Override labels',exact:true}).click();
await page.getByRole('navigation',{name:'Package navigation',exact:true}).waitFor();
await page.getByRole('button',{name:'Close Components',exact:true}).waitFor();
await page.getByRole('button',{name:'Use English',exact:true}).click();
await page.getByRole('button',{name:'Close Components',exact:true}).waitFor();
await page.getByRole('button',{name:'Override labels',exact:true}).click();
await page.getByRole('navigation',{name:'Primary navigation',exact:true}).waitFor();
await page.getByRole('button',{name:'Collapse Components',exact:true}).waitFor();
assert.equal(await page.getByRole('button',{name:'Count 2',exact:true}).count(),1,'Provider局部更新不得重置外围业务计数');
console.log('PASS: tarball LocaleProvider SSR, reactive en/zh, messages override and removal, SidebarSection collapse state and external business state');
assert.deepEqual(errors,[]);console.log('PASS: actual tarball SSR, hydration, Frame identity, Snippet, Input binding, Button event, DataTable/Toolbar Context chart/sidebar render, keyboard activation, animated numeric update and light/dark theme');await browser.close();
