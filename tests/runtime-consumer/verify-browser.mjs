import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const response=await fetch(process.env.SNOWUI_TEST_URL);const html=await response.text();assert.equal(response.status,200);assert.ok(html.includes('identity-ok'));assert.ok(html.includes('Count 0'));assert.ok(html.includes('Legacy snippet'));
const browser=await chromium.launch({headless:true});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'||m.text().includes('hydration_mismatch')||m.text().includes('derived_inert'))errors.push(m.text());});
try {
await page.goto(process.env.SNOWUI_TEST_URL);await page.getByRole('button',{name:'Count 0',exact:true}).click();await page.getByRole('button',{name:'Count 1',exact:true}).waitFor();await page.getByRole('textbox',{name:'Name',exact:true}).fill('Bound value');assert.equal(await page.getByTestId('bound').textContent(),'Bound value');await page.getByRole('searchbox',{name:'Search rows',exact:true}).fill('Beta');await page.waitForFunction(()=>!document.querySelector('table[aria-label="Package filtered rows"] tbody')?.textContent?.includes('Alpha'));assert.ok((await page.locator('table[aria-label="Package filtered rows"] tbody').textContent()).includes('Beta'));assert.equal(await page.getByTestId('identity').textContent(),'identity-ok');await page.getByRole('button',{name:'Coordinate target',exact:true}).click();assert.equal(await page.getByTestId('coordination-count').textContent(),'1');assert.equal(await page.locator('#coordinated-target').evaluate(el=>getComputedStyle(el).opacity),'0.4');const countButton=page.getByRole('button',{name:'Count 1',exact:true});await countButton.focus();await page.keyboard.press('Space');await page.getByRole('button',{name:'Count 2',exact:true}).waitFor();
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
assert.ok(html.includes('Media action'));
assert.equal(await page.getByRole('button',{name:'Media action',exact:true}).count(),1);
// 服务端与水合后验证原生图片属性和最近作用域，单项覆盖不能泄漏到 DOM。
for(const [alt,loading] of [['default media','lazy'],['inherited media','eager'],['explicit media','lazy'],['nested media','lazy'],['nested eager media','eager']]) {
 assert.match(html,new RegExp(`alt="${alt}"[^>]*loading="${loading}"`));
 assert.equal(await page.getByAltText(alt,{exact:true}).getAttribute('loading'),loading);
}
await page.getByRole('button',{name:'Toggle media loading',exact:true}).click();
await page.waitForFunction(()=>document.querySelector('img[alt="inherited media"]')?.loading==='lazy');
assert.equal(await page.getByAltText('nested eager media',{exact:true}).getAttribute('loading'),'eager');
assert.equal(await page.locator('[medialoading]').count(),0);
console.log('PASS: tarball media-loading SSR, hydration, reactive inherited default, explicit override and nearest scope');
// 同一候选 tarball 的单行 CSS、类型、SSR 和水合行为，不能回退源码别名。
assert.ok(html.includes('package-content-line'));
await page.getByRole('region',{name:'Package single-line layout',exact:true}).waitFor();
for(const fontSize of ['16px','8px']) {
 await page.evaluate(size=>{document.documentElement.style.fontSize=size;},fontSize);
 for(const width of [320,120,80,320]) {
  await page.locator('#package-content-line').evaluate((n,w)=>{n.style.width=`${w}px`;},width);
  await page.waitForFunction(()=>{
   const n=document.querySelector('#package-content-line'),a=n.querySelector('[data-as="leading"]').getBoundingClientRect(),b=n.querySelector('.snowui-text').getBoundingClientRect(),c=n.querySelector('[data-as="trailing"]').getBoundingClientRect();
   return b.left-a.right>=4&&c.left-b.right>=4&&Math.abs(a.top+a.bottom-b.top-b.bottom)<2;
  });
 }
 const spacing=await page.locator('#package-text-line').evaluate(n=>{const t=n.querySelectorAll('.snowui-text');return t[1].getBoundingClientRect().left-t[0].getBoundingClientRect().right;});
 assert.ok(spacing>=4,'独立文字元素也保持4 CSS px下限');
 for(const selector of ['#package-line-button','.package-line-menu','#package-line-chip','#package-line-link'])assert.ok(await page.locator(selector).evaluate(n=>parseFloat(getComputedStyle(n).columnGap))>=4,selector);
}
assert.equal(await page.locator('table[aria-label="Package single-line table"] tbody td').evaluate(n=>getComputedStyle(n).display),'table-cell');
assert.equal(await page.locator('#package-content-line[singleline]').count(),0);
await page.getByRole('tab',{name:'Package beta',exact:true}).waitFor();
await page.getByRole('button',{name:'Package action',exact:true}).click();
await page.locator('.package-line-menu').click();
assert.equal(await page.getByTestId('package-content-calls').textContent(),'2');
await page.evaluate(()=>{document.documentElement.style.fontSize='';});
console.log('PASS: tarball singleLine SSR/hydration, narrow/recovery, 16/8px roots, independent text labels, Button/MenuItem/Chip/Link gap, native td and accessible Tab label');
// 实际 tarball 中的复合侧栏宿主，验证真实状态附件和操作预算。
for(const fontSize of ['16px','8px']) {
 await page.evaluate(size=>{document.documentElement.style.fontSize=size;document.documentElement.style.setProperty('--gap-scale','.25');},fontSize);
 for(const id of ['package-sidebar-button','package-sidebar-link']) {
  const item=page.locator(`[data-sidebar-item-id="${id}"]`);await item.hover();
  const fit=await item.evaluate(n=>{const root=n.getBoundingClientRect(),leading=n.querySelector('.snowui-sidebar-item-leading').getBoundingClientRect(),content=n.querySelector('.snowui-sidebar-item-content').getBoundingClientRect(),parts=[...n.querySelector('.snowui-sidebar-item-content').children].map(c=>c.getBoundingClientRect()),actions=n.querySelector('.snowui-sidebar-item-actions')?.getBoundingClientRect();return {gaps:[content.left-leading.right,...parts.slice(1).map((c,i)=>c.left-parts[i].right),...(actions?[actions.left-parts.at(-1).right]:[])],inside:parts.at(-1).right<=root.right,leading:leading.width};});
  assert.ok(fit.gaps.every(g=>g>=4),JSON.stringify(fit));assert.ok(fit.inside);assert.ok(fit.leading>=12);
 }
 const section=page.locator('[data-sidebar-section-id="package-sidebar-section"]');await section.hover();
 const fit=await section.evaluate(n=>{const header=n.querySelector('.snowui-sidebar-section-header').getBoundingClientRect(),title=n.querySelector('.snowui-sidebar-section-title').getBoundingClientRect(),arrow=n.querySelector('.snowui-sidebar-section-toggle-icon').getBoundingClientRect(),actions=n.querySelector('.snowui-sidebar-section-actions').getBoundingClientRect();return {gaps:[arrow.left-title.right,actions.left-arrow.right],inside:actions.right<=header.right&&actions.top>=header.top&&actions.bottom<=header.bottom};});assert.ok(fit.gaps.every(g=>g>=4));assert.ok(fit.inside);
}
await page.locator('[data-sidebar-section-id="package-sidebar-section"] .snowui-sidebar-section-toggle').click();
assert.equal(await page.getByText('Package section body',{exact:true}).count(),0);
await page.locator('[data-sidebar-section-id="package-sidebar-section"] .snowui-sidebar-section-toggle').press('Enter');
await page.getByText('Package section body',{exact:true}).waitFor();
await page.evaluate(()=>{document.documentElement.style.fontSize='';document.documentElement.style.removeProperty('--gap-scale');});
console.log('PASS: tarball SidebarItem Button/Link, 16/8px gap floor, tags/update/action budget, SidebarSection title fit and keyboard reopening');
// 原生标签与截断名称必须由实际预编译包保留，不能只验源码 alias。
const completeCaption='Complete package action 完整执行名称';
await page.getByRole('button',{name:completeCaption,exact:true}).waitFor();
for(const fontSize of ['16px','8px']){
 await page.evaluate(size=>{document.documentElement.style.fontSize=size;document.documentElement.style.setProperty('--gap-scale','.25');},fontSize);
 for(const selector of ['.package-line-checkbox','.package-line-radio','.package-line-switch']){
  await page.waitForFunction(selector=>{const n=document.querySelector(selector),a=n.querySelector('.snowui-control-inset').getBoundingClientRect(),b=n.querySelector('.snowui-control-label').getBoundingClientRect();return b.left-a.right>=4&&Math.abs(a.top+a.bottom-b.top-b.bottom)<2;},selector);
 }
 await page.getByRole('checkbox',{name:'Complete package checkbox 完整选项名称',exact:true}).waitFor();
 await page.getByRole('radio',{name:'Complete package radio 完整单选名称',exact:true}).waitFor();
 await page.getByRole('switch',{name:'Complete package switch 完整开关名称',exact:true}).waitFor();
}
await page.getByRole('button',{name:completeCaption,exact:true}).click();
const checkbox=page.getByRole('checkbox',{name:'Complete package checkbox 完整选项名称',exact:true});
await page.locator('.package-line-checkbox').click();assert.equal(await checkbox.isChecked(),true);
await page.getByTestId('package-control-values').filter({hasText:'["one"]/null/false/1'}).waitFor();
await checkbox.press('Space');assert.equal(await checkbox.isChecked(),false);
const radio=page.getByRole('radio',{name:'Complete package radio 完整单选名称',exact:true});
await page.locator('.package-line-radio').click();assert.equal(await radio.isChecked(),true);
await page.locator('.package-line-radio').click();assert.equal(await radio.isChecked(),false);
const switchControl=page.getByRole('switch',{name:'Complete package switch 完整开关名称',exact:true});
await switchControl.press('Space');assert.equal(await switchControl.isChecked(),true);
await page.locator('.package-line-switch').click();assert.equal(await switchControl.isChecked(),false);
await page.getByTestId('package-control-values').filter({hasText:'[]/undefined/false/1'}).waitFor();
await page.evaluate(()=>{document.documentElement.style.fontSize='';document.documentElement.style.removeProperty('--gap-scale');});
console.log('PASS: tarball complete truncated Button/Checkbox names, control label spacing at 16/8px roots and gap-scale .25, Checkbox group, Radio native deselection, Switch keyboard and binding state');
// 四类输入宿主同时验证预编译类型、SSR、水合、原生值与图文几何。
assert.ok(html.includes('package-field-form'));
await page.getByRole('combobox',{name:'Package workspace',exact:true}).waitFor();
for(const fontSize of ['16px','8px']){
 await page.evaluate(size=>{document.documentElement.style.fontSize=size;document.documentElement.style.setProperty('--gap-scale','.25');},fontSize);
 for(const selector of ['.package-segment-input','.package-segment-select'])await page.waitForFunction(selector=>{
  const n=document.querySelector(selector),select=n.matches(".snowui-select"),a=select?n.querySelector(".snowui-select-trigger"):n.querySelector('[data-as="leading"]'),b=select?n.querySelector(".snowui-select-indicator"):n.querySelector("input");return b.getBoundingClientRect().left-a.getBoundingClientRect().right>=4;
 },selector);
 assert.equal(await page.locator('.package-segment-field').evaluate(n=>getComputedStyle(n).gap),'0px');
 const borderless=page.locator('.package-borderless-search');await borderless.locator('input').focus();
 await page.waitForFunction(()=>{const n=document.querySelector('.package-borderless-search');return Math.abs(n.querySelector('input').getBoundingClientRect().right-n.querySelector('.snowui-input-clear-btn').getBoundingClientRect().right)<.6;});
}
const editable=page.getByRole('textbox',{name:'Package entry',exact:true});await editable.fill('Edited package entry');
assert.deepEqual(await page.locator('#package-field-form').evaluate(n=>[...new FormData(n).entries()]),[['entry','Edited package entry'],['workspace','snowui']]);
const packageSearch=page.getByRole('searchbox',{name:'Package search',exact:true});await packageSearch.focus();await page.locator('.package-collapsing-search .snowui-input-clear-btn').click();
assert.equal(await packageSearch.inputValue(),'');await page.getByRole('button',{name:'Leave package search',exact:true}).click();
await page.waitForFunction(()=>getComputedStyle(document.querySelector('.package-collapsing-search input')).opacity==='0');
await packageSearch.focus();await packageSearch.fill('New package query');assert.equal(await packageSearch.inputValue(),'New package query');
await page.evaluate(()=>{document.documentElement.style.fontSize='';document.documentElement.style.removeProperty('--gap-scale');});
console.log('PASS: tarball Input/Field/Select/SearchInput types, SSR/hydration, 16/8px minimum gaps, continuous segments, combobox name, native form values, unbound clear collapse and actual borderless clear width');
for(const fontSize of ['16px','8px']) {
 await page.evaluate(size=>{document.documentElement.style.fontSize=size;document.documentElement.style.setProperty('--gap-scale','.25');},fontSize);
 const field=page.locator('.package-default-field');
 for(const width of [260,160,120,260]) {
  await field.evaluate((n,w)=>{n.style.width=`${w}px`;},width);
  const fit=await field.evaluate(n=>{const control=n.querySelector(':scope > .package-default-date').getBoundingClientRect(),leading=n.querySelector(':scope > [data-as="leading"]').getBoundingClientRect(),trailing=n.querySelector(':scope > [data-as="trailing"]').getBoundingClientRect(),label=n.querySelector(':scope > [data-as="label"]').getBoundingClientRect();return {gaps:[control.left-leading.right,trailing.left-control.right],sameRow:[leading,trailing].every(b=>Math.abs(b.top+b.bottom-control.top-control.bottom)<1),labelAbove:label.bottom<=control.top+.5};});
  assert.ok(fit.sameRow,JSON.stringify(fit));assert.ok(fit.labelAbove);assert.ok(fit.gaps.every(g=>g>=4));
  assert.equal(await field.locator('input').inputValue(),'2026-02-01');
 }
}
await page.getByRole('button',{name:'Package date action',exact:true}).click();assert.equal(await page.getByTestId('package-field-actions').textContent(),'1');
await page.evaluate(()=>{document.documentElement.style.fontSize='';document.documentElement.style.removeProperty('--gap-scale');});
console.log('PASS: tarball default Field keeps label above and external graphic/date/action on one row at 16/8px, scaled gaps and narrow/recovery widths');

// 默认列表标签通过实际安装包验证视口内的文字、附件和完整选择值。
await page.setViewportSize({width:360,height:720});
const longChoice='Complete package workspace name with a searchable distinctive TailToken';
const listTrigger=page.getByRole('combobox',{name:'Package long choices',exact:true});await listTrigger.click();
const longOption=page.getByRole('option',{name:longChoice,exact:true});await longOption.waitFor();
assert.equal(await longOption.locator('.package-list-label').count(),1);
for(const fontSize of ['16px','8px']){
 await page.evaluate(size=>{document.documentElement.style.fontSize=size;document.documentElement.style.setProperty('--gap-scale','.25');},fontSize);
 await page.waitForFunction(()=>{const n=document.querySelector('.snowui-listbox [role="option"][aria-selected="true"]'),text=n.querySelector('.snowui-text').getBoundingClientRect(),check=n.querySelector('.snowui-menu-item-check').getBoundingClientRect(),panel=n.closest('.snowui-listbox-portal-anchor').getBoundingClientRect();return check.left-text.right>=4&&check.right<=Math.min(panel.right,window.innerWidth-8)+.6;});
}
await page.locator('.snowui-listbox-header input').fill('TailToken');await longOption.waitFor();await longOption.click();assert.equal(await listTrigger.locator('.snowui-select-value').textContent(),longChoice);
await page.setViewportSize({width:1280,height:720});await page.evaluate(()=>{document.documentElement.style.fontSize='';document.documentElement.style.removeProperty('--gap-scale');});
console.log('PASS: tarball Listbox typed Text part, complete registered label, 360px viewport, 16/8px scaled gaps, visible check attachment, tail search and selection');
// 搜索入口固定单行与路径容器的原换行合同采用不同所有者。
const packageBox=page.getByRole('button',{name:'Complete package search query',exact:true});await packageBox.waitFor();
const packagePath=page.getByRole('navigation',{name:'Package page path',exact:true});await packagePath.waitFor();
for(const fontSize of ['16px','8px']){
 await page.evaluate(size=>{document.documentElement.style.fontSize=size;document.documentElement.style.setProperty('--gap-scale','.25');},fontSize);
 const boxGaps=await packageBox.evaluate(n=>{const a=n.querySelector('[data-as="leading"]').getBoundingClientRect(),b=n.querySelector('.snowui-search-box-content').getBoundingClientRect(),c=n.querySelector('[data-as="trailing"]').getBoundingClientRect();return [b.left-a.right,c.left-b.right];});assert.ok(boxGaps.every(gap=>gap>=4));
 const pathGap=await packagePath.evaluate(n=>{const a=n.querySelector('[data-as="item"]').getBoundingClientRect(),b=n.querySelector('[data-as="separator"]').getBoundingClientRect();return b.left-a.right;});assert.ok(pathGap>=4);assert.equal(await packagePath.evaluate(n=>getComputedStyle(n).flexWrap),'wrap');
}
assert.equal(await packagePath.locator('[data-as="item"]').last().getAttribute('aria-current'),'page');assert.equal(await packagePath.locator('[data-as="separator"]').getAttribute('aria-hidden'),'true');
await page.evaluate(()=>{document.documentElement.style.fontSize='';document.documentElement.style.removeProperty('--gap-scale');});
console.log('PASS: tarball SearchBox and Breadcrumb public gap types, 16/8px effective spacing, complete trigger name, ordinary path wrapping and current-page/separator semantics');
// 新增生命周期与通知队列用例必须走实际安装包，不能解析维护工作区源码。
const pagination=page.getByRole('navigation',{name:'Package pagination',exact:true});
let generation=0,callbacks=0,serial=0;
for(const reducedMotion of ['no-preference','reduce']) {
 await page.emulateMedia({reducedMotion});
 for(const composition of ['built-in','explicit'])for(const responsive of ['auto','none']) {
  await page.getByRole('combobox',{name:'Package pagination composition',exact:true}).selectOption(composition);
  await page.getByRole('combobox',{name:'Package pagination responsive',exact:true}).selectOption(responsive);
  for(let cycle=0;cycle<3;cycle++) {
   await pagination.locator('[aria-current="page"]').filter({hasText:/^1$/}).waitFor();
   await pagination.locator('[data-page="2"]').click();
   await pagination.locator('[aria-current="page"]').filter({hasText:/^2$/}).waitFor();
   await page.getByRole('button',{name:'Dispose package pagination',exact:true}).click();
   await pagination.waitFor({state:'detached'});
   assert.equal(await page.getByTestId('package-pagination-state').textContent(),`Instance ${generation}, page 4, page size 10`);
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   assert.deepEqual(errors,[]);
   await page.getByRole('button',{name:'Restore package pagination',exact:true}).click();generation++;
   await pagination.locator('[aria-current="page"]').filter({hasText:/^1$/}).waitFor();
  }
 }
 for(const position of ['top','top-left','top-right','bottom','bottom-left','bottom-right']) {
  await page.getByRole('combobox',{name:'Package notification position',exact:true}).selectOption(position);
  await page.getByRole('button',{name:'Package timed',exact:true}).click();
  await page.mouse.move(1,1);
  await page.getByText('Package timed notification',{exact:true}).waitFor({state:'detached'});
  await page.getByTestId('package-notification-dismissed').filter({hasText:new RegExp(`^${++callbacks}$`)}).waitFor();
  await page.getByRole('button',{name:'Package persistent',exact:true}).click();
  await page.getByText('Package persistent notification',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Package clear notifications',exact:true}).click();
  await page.getByText('Package persistent notification',{exact:true}).waitFor({state:'detached'});
  await page.getByTestId('package-notification-dismissed').filter({hasText:new RegExp(`^${++callbacks}$`)}).waitFor();
 }
 await page.getByRole('button',{name:'Package four notifications',exact:true}).click();
 await page.getByText(`Package revision ${serial+4}`,{exact:true}).waitFor();
 await page.getByText(`Package revision ${serial+1}`,{exact:true}).waitFor({state:'detached'});
 await page.getByTestId('package-notification-dismissed').filter({hasText:new RegExp(`^${++callbacks}$`)}).waitFor();
 await page.getByRole('button',{name:'Package clear notifications',exact:true}).click();
 callbacks+=3;serial+=4;
 await page.getByTestId('package-notification-dismissed').filter({hasText:new RegExp(`^${callbacks}$`)}).waitFor();
 assert.equal(await page.getByText(/^Package revision /).count(),0);
}
console.log('PASS: tarball Pagination 8 lifecycle combinations / 24 teardown-remount cycles; Toast 6 positions / 2 motion modes, exit cleanup, next enqueue, push-out and exact dismissal callbacks');
assert.deepEqual(errors,[]);console.log('PASS: actual tarball SSR, hydration, Frame identity, Snippet, Input binding, Button event, DataTable/Toolbar Context chart/sidebar render, keyboard activation, animated numeric update and light/dark theme');
} finally { await browser.close(); }
