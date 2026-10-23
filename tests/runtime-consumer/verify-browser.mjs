import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const response=await fetch(process.env.SNOWUI_TEST_URL);const html=await response.text();assert.equal(response.status,200);assert.ok(html.includes('identity-ok'));assert.ok(html.includes('Count 0'));assert.ok(html.includes('Legacy snippet'));
const browser=await chromium.launch({headless:true});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error('Browser pageerror:',e.stack);});page.on('console',m=>{if(m.type()==='error'||m.text().includes('hydration_mismatch')||m.text().includes('derived_inert'))errors.push(m.text());});
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
  await page.locator('.snowui-toaster-slot').filter({hasText:'Package timed notification'}).waitFor({state:'detached'});
  await page.getByTestId('package-notification-dismissed').filter({hasText:new RegExp(`^${++callbacks}$`)}).waitFor();
  await page.getByRole('button',{name:'Package persistent',exact:true}).click();
  await page.locator('.snowui-toaster-slot').filter({hasText:'Package persistent notification'}).waitFor();
  await page.getByRole('button',{name:'Package clear notifications',exact:true}).click();
  await page.locator('.snowui-toaster-slot').filter({hasText:'Package persistent notification'}).waitFor({state:'detached'});
  await page.getByTestId('package-notification-dismissed').filter({hasText:new RegExp(`^${++callbacks}$`)}).waitFor();
 }
 await page.getByRole('button',{name:'Package four notifications',exact:true}).click();
 await page.locator('.snowui-toaster-slot').filter({hasText:`Package revision ${serial+4}`}).waitFor();
 await page.locator('.snowui-toaster-slot').filter({hasText:`Package revision ${serial+1}`}).waitFor({state:'detached'});
 await page.getByTestId('package-notification-dismissed').filter({hasText:new RegExp(`^${++callbacks}$`)}).waitFor();
 await page.getByRole('button',{name:'Package clear notifications',exact:true}).click();
 callbacks+=3;serial+=4;
 await page.getByTestId('package-notification-dismissed').filter({hasText:new RegExp(`^${callbacks}$`)}).waitFor();
 assert.equal(await page.locator('.snowui-toaster-slot').filter({hasText:/Package revision /}).count(),0);
}
console.log('PASS: tarball Pagination 8 lifecycle combinations / 24 teardown-remount cycles; Toast 6 positions / 2 motion modes, exit cleanup, next enqueue, push-out and exact dismissal callbacks');
// 仅使用真实tarball和随包默认图标；不从资源包或兄弟源码补入实现。
assert.ok(html.includes('Package accordion body remains ordinary prose'));
const packageAccordion=page.locator('.package-builtin-accordion');
const packageAccordionTitle=packageAccordion.getByRole('button',{name:'Complete package accordion installation and delivery settings',exact:true});
await packageAccordionTitle.waitFor();
assert.equal(await packageAccordion.locator('.snowui-accordion-title-item > .package-accordion-label').count(),2);
assert.equal(await page.locator('.package-explicit-accordion .package-accordion-must-not-leak').count(),0);
for(const font of [16,8]){
 await page.evaluate(font=>{document.documentElement.style.fontSize=`${font}px`;document.documentElement.style.setProperty('--gap-scale','.25');},font);
 for(const width of [320,180,120,320]){
  await page.locator('.package-builtin-accordion, .package-explicit-accordion, .package-minus-accordion').evaluateAll((nodes,width)=>nodes.forEach(n=>n.style.width=`${width}px`),width);
  await page.waitForFunction(()=>[...document.querySelectorAll('.package-builtin-accordion .snowui-accordion-title-item, .package-explicit-accordion .snowui-accordion-title-item, .package-minus-accordion .snowui-accordion-title-item')].every(title=>{
   const rects=[...title.children].filter(n=>!['STYLE','SCRIPT'].includes(n.tagName)&&getComputedStyle(n).position!=='absolute').map(n=>{const r=n.getBoundingClientRect();if(!n.classList.contains('snowui-accordion-default-indicator'))return r;const c=getComputedStyle(n),w=parseFloat(c.width),h=parseFloat(c.height),x=(r.left+r.right)/2,y=(r.top+r.bottom)/2;return{left:x-w/2,right:x+w/2,top:y-h/2,bottom:y+h/2,width:w,height:h};}).filter(r=>r.width>0&&r.height>0).sort((a,b)=>a.left-b.left);
   const text=title.querySelector(':scope > .snowui-text'),indicator=getComputedStyle(title.querySelector('.snowui-accordion-default-indicator'));
   return rects.length>=2&&rects.slice(1).every((r,i)=>r.left-rects[i].right>=4)&&rects.every(r=>Math.abs(r.top+r.bottom-rects[0].top-rects[0].bottom)<1)&&parseFloat(indicator.width)>=12&&parseFloat(indicator.height)>=12&&text.getBoundingClientRect().height<=parseFloat(getComputedStyle(text).lineHeight)+.5;
  }));
  assert.equal(await packageAccordionTitle.getAttribute('aria-expanded'),'true');
 }
}
const packagePlus=await packageAccordion.locator('.snowui-accordion-default-indicator svg').first().evaluate(n=>{const box=n.getBBox();return {viewBox:n.getAttribute('viewBox'),box:[box.x,box.y,box.width,box.height]};});
assert.deepEqual(packagePlus,{viewBox:'0 0 32 32',box:[4,4,24,24]});
const packageMinus=await page.locator('.package-minus-accordion .snowui-accordion-default-indicator svg').evaluate(n=>{const box=n.getBBox();return {viewBox:n.getAttribute('viewBox'),box:[box.x,box.y,box.width,box.height]};});
assert.deepEqual(packageMinus,{viewBox:'0 0 32 32',box:[4,15,24,2]});
await packageAccordionTitle.click();await page.waitForFunction(()=>document.querySelector('[data-testid="package-accordion-state"]')?.textContent==='/1');await packageAccordionTitle.press('Enter');await page.waitForFunction(()=>document.querySelector('[data-testid="package-accordion-state"]')?.textContent==='0/2');await packageAccordion.locator('.snowui-accordion-content').first().click({position:{x:4,y:4}});assert.equal(await packageAccordionTitle.getAttribute('aria-expanded'),'true');assert.equal(await page.getByTestId('package-accordion-state').textContent(),'0/2');
await page.evaluate(()=>document.documentElement.style.fontSize='16px');
console.log('PASS: tarball Accordion built-in title Text part, explicit ownership, 16/8px and 320/180/120/recovery, complete names, 4px/12px layout floors, original plus/minus geometry, binding callbacks and prose click isolation');

await page.locator('#package-show-side-panel').click();
const packagePanel=page.getByRole('dialog',{name:'Complete package panel installation and delivery settings',exact:true});await packagePanel.waitFor();
for(const font of [16,8]){
 await page.evaluate(font=>{document.documentElement.style.fontSize=`${font}px`;document.documentElement.style.setProperty('--gap-scale','.25');},font);
 await page.waitForFunction(()=>{const group=document.querySelector('.package-side-panel .snowui-side-panel-title-group'),title=group.querySelector('.snowui-side-panel-title').getBoundingClientRect(),close=group.querySelector('.snowui-side-panel-close').getBoundingClientRect();return close.left-title.right>=4&&close.width>=12&&title.width>0&&Math.abs(title.top+title.bottom-close.top-close.bottom)<1;});
}
await packagePanel.evaluate(n=>n.style.setProperty('--snowui-side-panel-toolbar-gap','24px'));
assert.equal(await packagePanel.locator('.snowui-side-panel-title-group').evaluate(n=>{const a=n.querySelector('.snowui-side-panel-title').getBoundingClientRect(),b=n.querySelector('.snowui-side-panel-close').getBoundingClientRect();return b.left-a.right;}),24);
await packagePanel.evaluate(n=>n.style.removeProperty('--snowui-side-panel-toolbar-gap'));
const packagePanelDraft=packagePanel.getByRole('textbox',{name:'Package panel draft',exact:true});await packagePanelDraft.fill('Unsaved tarball panel draft');const packagePanelNode=await packagePanel.elementHandle();
await packagePanel.locator('.snowui-side-panel-toolbar-top .snowui-side-panel-toolbar-group .snowui-button').first().click();await page.waitForFunction(()=>document.querySelector('.package-side-panel')?.dataset.placement==='inline');assert.equal(await packagePanelDraft.inputValue(),'Unsaved tarball panel draft');assert.equal(await packagePanel.evaluate((n,prior)=>n===prior,packagePanelNode),true);
await packagePanel.locator('.snowui-side-panel-toolbar-top .snowui-side-panel-toolbar-group .snowui-button').first().click();await page.waitForFunction(()=>document.querySelector('.package-side-panel')?.dataset.placement==='floating');assert.equal(await packagePanelDraft.inputValue(),'Unsaved tarball panel draft');await packagePanel.locator('.snowui-side-panel-close').click();await packagePanel.waitFor({state:'detached'});
await page.evaluate(()=>{document.documentElement.style.fontSize='16px';document.documentElement.style.removeProperty('--gap-scale');});
console.log('PASS: tarball SidePanel title/close 4px and 12px at 16/8px, larger 24px override, complete panel name, stable portal identity and unsaved draft across placement and close');

await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#package-tooltip-trigger').hover();
const packageTooltip=page.locator('.snowui-tooltip-portal');await packageTooltip.waitFor();const packageTooltipRow=packageTooltip.locator('.package-tooltip-row');await packageTooltipRow.waitFor();
for(const font of [16,8]){
 await page.evaluate(font=>{document.documentElement.style.fontSize=`${font}px`;document.documentElement.style.setProperty('--gap-scale','.25');},font);
 const badgeSize=await packageTooltipRow.locator('.snowui-badge').evaluate(n=>n.getBoundingClientRect().width);
 for(const width of [320,180,120,80,320]){
  await packageTooltipRow.evaluate((n,width)=>n.style.width=`${width}px`,width);
  await page.waitForFunction(()=>{const row=document.querySelector('.package-tooltip-row'),a=row.querySelector('.package-tooltip-label').getBoundingClientRect(),b=row.querySelector('.snowui-badge').getBoundingClientRect(),line=parseFloat(getComputedStyle(row.querySelector('.package-tooltip-label')).lineHeight);return b.left-a.right>=4&&a.width>0&&a.height<=line+.5&&Math.abs(a.top+a.bottom-b.top-b.bottom)<1;});
  assert.ok(Math.abs(await packageTooltipRow.locator('.snowui-badge').evaluate(n=>n.getBoundingClientRect().width)-badgeSize)<.5);
  const packageTooltipLabel=packageTooltipRow.locator('.package-tooltip-label');assert.equal(await packageTooltipLabel.evaluate(n=>{const clone=n.cloneNode(true);clone.querySelectorAll('[aria-hidden="true"],script,style').forEach(n=>n.remove());return clone.textContent.trim();}),'Complete package build status');
  if(width===80){await packageTooltipLabel.hover();await page.waitForTimeout(500);assert.equal(await packageTooltipRow.isVisible(),true);assert.equal(await packageTooltip.locator('.package-tooltip-prose').isVisible(),true);}
 }
}
await page.mouse.move(0,0);await packageTooltip.waitFor({state:'detached'});await page.emulateMedia({reducedMotion:'no-preference'});await page.evaluate(()=>{document.documentElement.style.fontSize='16px';document.documentElement.style.removeProperty('--gap-scale');});
console.log('PASS: tarball Tooltip rich-label composition keeps 4px, Badge canvas, complete accessible text, original prose and stable content hover at 16/8px and 320/180/120/80/recovery without registering a duplicate Text tooltip');

const packageSidebar=page.locator('[data-package-sidebar]'),packageFooter=packageSidebar.locator('.snowui-sidebar-footer > [data-as="footer"]');
for(const font of [16,8]){
 await page.evaluate(font=>{document.documentElement.style.fontSize=`${font}px`;document.documentElement.style.setProperty('--gap-scale','.25');},font);
 const avatar=packageFooter.locator(':scope > .snowui-avatar'),width=await avatar.evaluate(n=>n.getBoundingClientRect().width);
 for(const size of [180,120,80,60,180]){
  await packageFooter.evaluate((n,size)=>n.style.width=`${size}px`,size);
  const q=await packageFooter.evaluate(n=>{const a=n.querySelector(':scope > .snowui-avatar').getBoundingClientRect(),b=n.querySelector(':scope > .snowui-text').getBoundingClientRect(),r=n.getBoundingClientRect();return{gap:b.left-a.right,sameRow:Math.abs(a.top+a.bottom-b.top-b.bottom)<1,inside:a.left>=r.left-.5&&b.right<=r.right+.5,width:b.width};});assert.ok(q.gap>=4&&q.sameRow&&q.inside&&q.width>0,JSON.stringify(q));
  assert.ok(Math.abs(await avatar.evaluate(n=>n.getBoundingClientRect().width)-width)<.5);
  const text=await packageFooter.locator(':scope > .snowui-text').evaluate(n=>{const c=n.cloneNode(true);c.querySelectorAll('[aria-hidden="true"],script,style').forEach(n=>n.remove());return c.textContent.trim();});assert.equal(text,'Complete package current user name');
 }
 await packageSidebar.evaluate(n=>n.style.setProperty('--snowui-sidebar-footer-gap-override','24px'));
 assert.equal(await packageFooter.evaluate(n=>parseFloat(getComputedStyle(n).columnGap)),24);
 await packageSidebar.evaluate(n=>n.style.removeProperty('--snowui-sidebar-footer-gap-override'));
}
await packageFooter.evaluate(n=>n.style.removeProperty('width'));
await packageSidebar.hover();await packageSidebar.getByRole('button',{name:'收起侧边栏',exact:true}).click();await packageSidebar.waitFor({state:'visible'});assert.equal(await packageSidebar.getAttribute('data-collapsed'),'true');assert.equal(await packageSidebar.locator('.snowui-sidebar-footer').getAttribute('aria-hidden'),'true');await packageSidebar.hover();await packageSidebar.getByRole('button',{name:'展开侧边栏',exact:true}).click();assert.equal(await packageSidebar.getAttribute('data-collapsed'),'false');
await page.evaluate(()=>{document.documentElement.style.removeProperty('font-size');document.documentElement.style.removeProperty('--gap-scale');});
console.log('PASS: tarball Sidebar explicit footer 4px, stable Avatar, complete truncated user name, 16/8px and 180/120/80/60/recovery, 24px override and original collapse/reopen');

await page.emulateMedia({reducedMotion:'reduce'});await page.mouse.move(0,0);
for(const font of[16,8,20])for(const textScale of[.5,1,2]){
 await page.evaluate(({font,textScale})=>{document.documentElement.style.fontSize=`${font}px`;document.documentElement.style.setProperty('--text-scale',String(textScale));},{font,textScale});
 const boxes=await page.locator('[data-package-brand] .snowui-snow-ui-logo-wordmark').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect(),letters=[...n.querySelectorAll('.snowui-logo-letter > svg')].map(n=>n.getBoundingClientRect());return{height:r.height,font:parseFloat(getComputedStyle(n).fontSize),count:letters.length,inside:letters.every(b=>b.left>=r.left-.5&&b.right<=r.right+.5&&b.top>=r.top-.5&&b.bottom<=r.bottom+.5),paintHeight:Math.max(...letters.map(b=>b.height))};}));assert.equal(boxes.length,3);for(const box of boxes){assert.equal(box.count,6);assert.ok(box.inside,JSON.stringify(box));assert.ok(Math.abs(box.paintHeight-box.height)<.1,JSON.stringify(box));}
}
await page.evaluate(()=>{document.documentElement.style.removeProperty('font-size');document.documentElement.style.removeProperty('--text-scale');});
console.log('PASS: tarball SnowUILogo text/horizontal/vertical canvases at root 16/8/20 and text-scale .5/1/2, proportional drawing, compact and exact glyph containment without changing body-text floors');

const packageTagGroup=page.locator('[data-package-tag-group]'),packageTags=packageTagGroup.locator('.snowui-tag');await page.emulateMedia({reducedMotion:'reduce'});await page.mouse.move(0,0);
for(const font of[16,8]){
 await page.evaluate(font=>{document.documentElement.style.fontSize=`${font}px`;document.documentElement.style.setProperty('--gap-scale','.25');},font);
 for(const width of[320,180,120,80,320]){
  await packageTagGroup.evaluate((n,width)=>n.style.width=`${width}px`,width);
  const q=await packageTags.evaluateAll(nodes=>{const r=nodes.map(n=>(n.querySelector('.snowui-tag-arrow-shape')??n).getBoundingClientRect()).sort((a,b)=>a.left-b.left);return{sameRow:r.every(b=>Math.abs(b.top+b.bottom-r[0].top-r[0].bottom)<1),gaps:r.slice(1).map((b,i)=>b.left-r[i].right),internal:nodes.map(n=>parseFloat(getComputedStyle(n).columnGap))};});assert.ok(q.sameRow&&q.gaps.every(g=>g>=3.99)&&q.internal.every(g=>g===0),JSON.stringify(q));
  for(let i=0;i<3;i++){await packageTags.nth(i).scrollIntoViewIfNeeded();}
 }
}
const toggled=packageTags.first();await toggled.scrollIntoViewIfNeeded();await toggled.click();assert.equal(await toggled.getAttribute('aria-pressed'),'true');await toggled.click();assert.equal(await toggled.getAttribute('aria-pressed'),'false');const closed=packageTags.last();await closed.scrollIntoViewIfNeeded();await closed.hover();await closed.getByRole('button',{name:'关闭标签',exact:true}).click();assert.equal(await packageTags.count(),2);await packageTagGroup.getByRole('button',{name:'Reset package tags',exact:true}).click();assert.equal(await packageTags.count(),3);
await page.evaluate(()=>{document.documentElement.style.removeProperty('font-size');document.documentElement.style.removeProperty('--gap-scale');});
console.log('PASS: tarball Tag groups keep 4px outside and zero inside, exact fractional arrow canvases including content-box, horizontal narrow/recovery, toggle, close and reset');
const packageToast=page.locator('.package-line-toast');
for(const font of[16,8]){
 await page.evaluate(font=>{document.documentElement.style.fontSize=`${font}px`;document.documentElement.style.setProperty('--gap-scale','.25');},font);
 for(const width of[320,180,120,80,320]){
  await packageToast.evaluate((n,width)=>n.style.width=`${width}px`,width);
  const q=await packageToast.evaluate(n=>{const a=n.querySelector('.snowui-toast-builtin-icon').getBoundingClientRect(),b=n.querySelector(':scope > .snowui-text').getBoundingClientRect();return{gap:b.left-a.right,sameRow:Math.abs(a.top+a.bottom-b.top-b.bottom)<1,contained:b.right<=n.getBoundingClientRect().right+.5};});assert.ok(q.gap>=4&&q.sameRow&&q.contained,JSON.stringify(q));
 }
 await packageToast.evaluate(n=>n.style.setProperty('--snowui-toast-gap-override','24px'));assert.equal(await packageToast.evaluate(n=>parseFloat(getComputedStyle(n).columnGap)),24);await packageToast.evaluate(n=>n.style.removeProperty('--snowui-toast-gap-override'));
}
const richTexts=page.locator('.package-rich-toast > .snowui-frame > .snowui-text');assert.equal(await richTexts.count(),2);assert.ok((await richTexts.nth(1).boundingBox()).y>(await richTexts.nth(0).boundingBox()).y);
await page.evaluate(()=>{document.documentElement.style.removeProperty('font-size');document.documentElement.style.removeProperty('--gap-scale');});
console.log('PASS: tarball Toast single-line 4px, complete text, narrow/recovery, 24px override and original rich multiline body');
const packageSort=page.locator('.package-sort-head .snowui-table-sort');
for(const font of[16,8]){
 await page.evaluate(font=>{document.documentElement.style.fontSize=`${font}px`;document.documentElement.style.setProperty('--gap-scale','.25');},font);
 const q=await packageSort.evaluate(n=>{const a=n.querySelector('.snowui-table-head-content').getBoundingClientRect(),b=n.querySelector('.snowui-table-sort-icon').getBoundingClientRect();return{gap:b.left-a.right,sameRow:Math.abs(a.top+a.bottom-b.top-b.bottom)<1,contained:b.right<=n.getBoundingClientRect().right+.5};});assert.ok(q.gap>=4&&q.sameRow&&q.contained,JSON.stringify(q));
 await page.locator('.package-sort-head .snowui-table-head-indicator').dblclick();assert.ok(await packageSort.evaluate(n=>{const t=n.querySelector('.snowui-table-head-content');return t.scrollWidth<=t.clientWidth+1;}));
}
await page.evaluate(()=>{document.documentElement.style.removeProperty('font-size');document.documentElement.style.removeProperty('--gap-scale');});
console.log('PASS: tarball TableHead effective 4px sort gap, single-line title and Table double-click fit without truncation at 16/8px');
await page.getByRole('button',{name:'Package long notification',exact:true}).click();const longNotification=page.locator('.package-long-notification');await longNotification.waitFor();
for(const font of[16,8]){
 await page.evaluate(font=>{document.documentElement.style.fontSize=`${font}px`;document.documentElement.style.setProperty('--gap-scale','.25');},font);
 for(const width of[320,180,120,80,320]){
  await longNotification.evaluate((n,width)=>n.style.width=`${width}px`,width);
  const q=await longNotification.evaluate(n=>{const a=n.querySelector('.snowui-toast-builtin-icon').getBoundingClientRect(),t=n.querySelector('.package-generated-notification-label'),b=t.getBoundingClientRect();return{gap:b.left-a.right,sameRow:Math.abs(a.top+a.bottom-b.top-b.bottom)<1,height:b.height,lineHeight:parseFloat(getComputedStyle(t).lineHeight),contained:b.right<=n.getBoundingClientRect().right+.5};});assert.ok(q.gap>=4&&q.sameRow&&q.height<=q.lineHeight+.5&&q.contained,JSON.stringify(q));
 }
}
await longNotification.evaluate(n=>n.style.width='80px');await longNotification.locator('.package-generated-notification-label').hover();await page.getByRole('tooltip').filter({hasText:'Complete package notification with a long result 完整通知结果'}).waitFor();await page.mouse.move(0,0);
await page.getByRole('button',{name:'Package complex notification',exact:true}).click();const explicitNotification=page.locator('.package-explicit-notification');await explicitNotification.waitFor();assert.equal(await explicitNotification.getAttribute('data-single-line'),null);assert.equal(await explicitNotification.locator('.package-generated-notification-label').count(),0);const explicitTexts=explicitNotification.locator(':scope > .snowui-frame > .snowui-text');assert.equal(await explicitTexts.count(),2);assert.ok((await explicitTexts.nth(1).boundingBox()).y>(await explicitTexts.nth(0).boundingBox()).y);
await page.getByRole('button',{name:'Package clear notifications',exact:true}).click();await explicitNotification.waitFor({state:'detached'});await longNotification.waitFor({state:'detached'});await page.evaluate(()=>{document.documentElement.style.removeProperty('font-size');document.documentElement.style.removeProperty('--gap-scale');});
console.log('PASS: tarball Toaster generated Text part, long string single-line fit and tooltip at 80px, original explicit multiline children isolated from parts.Text and unchanged queue lifecycle');
const packageToolbar=page.locator('.package-narrow-toolbar');
for(const font of[16,8]){
 await page.evaluate(font=>{document.documentElement.style.fontSize=`${font}px`;document.documentElement.style.setProperty('--gap-scale','.25');},font);
 for(const width of[320,180,120,80,320]){
  await packageToolbar.evaluate((n,width)=>n.style.width=`${width}px`,width);
  const q=await packageToolbar.evaluate(n=>{const a=n.querySelector('.snowui-table-toolbar-selection').getBoundingClientRect(),b=n.querySelector('.snowui-table-toolbar-bulk > .snowui-button').getBoundingClientRect();return{gap:b.left-a.right,sameRow:Math.abs(a.top+a.bottom-b.top-b.bottom)<1};});assert.ok(q.gap>=4&&q.sameRow,JSON.stringify(q));
 }
}
await packageToolbar.evaluate(n=>{n.style.width='80px';n.scrollLeft=n.scrollWidth;});await page.waitForFunction(()=>{const n=document.querySelector('.package-narrow-toolbar'),t=n.querySelector('.snowui-table-toolbar-scrollbar'),r=n.getBoundingClientRect(),b=t.getBoundingClientRect();return n.scrollLeft>0&&t.dataset.visible==='true'&&Math.abs(b.left-r.left-4)<1&&b.right<=r.right+.5;});
const packageTrack=packageToolbar.locator('.snowui-table-toolbar-scrollbar');assert.ok((await packageTrack.boundingBox()).y>=(await packageToolbar.locator('.snowui-table-toolbar-bulk').boundingBox()).y+(await packageToolbar.locator('.snowui-table-toolbar-bulk').boundingBox()).height+4);
for(const label of['Package copy selection','Package delete selection']){const control=page.getByRole('button',{name:label,exact:true});await control.scrollIntoViewIfNeeded();await control.click();}
assert.equal(await page.getByTestId('package-toolbar-results').textContent(),'1/1/2');const packageClear=page.getByRole('button',{name:'Package clear selection',exact:true});await packageClear.scrollIntoViewIfNeeded();await packageClear.click();await page.waitForFunction(()=>document.querySelector('[data-testid="package-toolbar-results"]').textContent==='1/1/0');await page.waitForFunction(()=>document.querySelector('.package-narrow-toolbar .snowui-table-toolbar-scrollbar').dataset.visible==='false');
await page.evaluate(()=>{document.documentElement.style.removeProperty('font-size');document.documentElement.style.removeProperty('--gap-scale');});
console.log('PASS: tarball TableToolbar 4px count/action gap, native local scrolling at 80px, pinned shared track below controls, 16/8px recovery and copy/delete/clear exactly once');
await page.emulateMedia({reducedMotion:'no-preference'});
await page.locator('[data-package-time-trigger="status"]').hover();await page.locator('.snowui-tooltip-portal [data-package-time-content="status"]').waitFor({state:'visible'});await page.waitForFunction(()=>{const el=document.querySelector('.snowui-tooltip-portal');return el&&el.getAnimations({subtree:true}).every(a=>a.playState!=='running');});
await page.evaluate(()=>{window.__packageTimelineSamples=[];window.__packageNativeRaf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=callback=>window.__packageNativeRaf(timestamp=>{callback(timestamp-50);queueMicrotask(()=>{const shell=document.querySelector('.snowui-tooltip-motion-shell');if(shell?.dataset.switchPhase!=='moving')return;const layers=[...document.querySelectorAll('.snowui-tooltip-content-layer')];window.__packageTimelineSamples.push({layers:layers.length,values:[shell.style.getPropertyValue('--snowui-tooltip-motion-x'),shell.style.getPropertyValue('--snowui-tooltip-motion-y'),...layers.flatMap(n=>[n.style.getPropertyValue('--snowui-tooltip-layer-x'),n.style.getPropertyValue('--snowui-tooltip-layer-y')])]});});});});
try{await page.locator('[data-package-time-trigger="shortcut"]').hover();await page.waitForFunction(()=>window.__packageTimelineSamples.length>0);await page.waitForFunction(()=>document.querySelector('.snowui-tooltip-motion-shell')?.dataset.switchPhase==='idle');const samples=await page.evaluate(()=>window.__packageTimelineSamples);assert.ok(samples.some(s=>s.layers===2),'必须实际覆盖新旧两层移动帧');assert.deepEqual(samples.filter(s=>s.values.some(v=>!Number.isFinite(parseFloat(v)))),[],'提前帧时间不能生成NaN坐标');assert.equal(await page.locator('.snowui-tooltip-portal [data-tooltip-layer="outgoing"]').count(),0);}finally{await page.evaluate(()=>{window.requestAnimationFrame=window.__packageNativeRaf;delete window.__packageNativeRaf;delete window.__packageTimelineSamples;});}
console.log('PASS: tarball Tooltip early animation-frame timestamps retain finite shell/content coordinates and complete the original joined-content lifecycle');
await page.emulateMedia({reducedMotion:'reduce'});
const packageCode=page.locator('.package-inline-code'),packageCodeWidth=page.locator('[data-package-code-width]');
for(const font of[16,8]){await page.evaluate(font=>{document.documentElement.style.fontSize=`${font}px`;document.documentElement.style.setProperty('--gap-scale','.25');},font);const originalLeadingWidth=await packageCode.locator('.snowui-code-block-single-line-leading').evaluate(n=>n.getBoundingClientRect().width);for(const width of[320,180,120,80,320]){await packageCodeWidth.evaluate((n,w)=>n.style.width=`${w}px`,width);const q=await packageCode.evaluate(n=>{const a=n.querySelector('.snowui-code-block-single-line-leading').getBoundingClientRect(),c=n.querySelector('.snowui-code-block-single-line-content').getBoundingClientRect(),b=n.querySelector('.snowui-code-block-single-line-trailing').getBoundingClientRect();return{gap:parseFloat(getComputedStyle(n).columnGap),gaps:[c.left-a.right,b.left-c.right],widths:[a.width,c.width,b.width]};});assert.ok(q.gap>=4&&q.gaps.every(g=>g>=4)&&q.widths.every(w=>w>0),JSON.stringify(q));assert.equal(await packageCode.locator('.snowui-code-block-single-line-leading').evaluate(n=>n.getBoundingClientRect().width),originalLeadingWidth);const viewport=packageCode.locator('.snowui-code-block-single-line-content');await viewport.evaluate(n=>n.scrollLeft=n.scrollWidth);assert.ok(await viewport.evaluate(n=>n.scrollLeft>0));const short=await page.locator('.package-short-code').evaluate(n=>{const r=n.getBoundingClientRect(),t=n.querySelector('.snowui-code-block-single-line-trailing').getBoundingClientRect();return Math.abs(r.right-t.right-parseFloat(getComputedStyle(n).paddingRight));});assert.ok(short<=.5);assert.ok(await page.locator('.package-code-default .snowui-code-block-toolbar').evaluate(n=>parseFloat(getComputedStyle(n).columnGap)>=4));}await packageCodeWidth.evaluate(n=>n.style.width='1024px');for(const override of['0px','24px']){await packageCode.evaluate((n,v)=>n.style.setProperty('--snowui-code-block-gap-override',v),override);await page.waitForFunction(expected=>parseFloat(getComputedStyle(document.querySelector('.package-inline-code')).columnGap)===expected,override==='0px'?4:24);}await packageCode.evaluate(n=>n.style.removeProperty('--snowui-code-block-gap-override'));}
await page.locator('.package-code-default .snowui-code-block-toolbar button').last().click();await page.locator('.snowui-code-block-fullscreen').waitFor({state:'visible'});assert.ok(await page.locator('.snowui-code-block-fullscreen .snowui-code-block-toolbar').evaluate(n=>parseFloat(getComputedStyle(n).columnGap)>=4));await page.locator('.snowui-code-block-fullscreen .snowui-code-block-toolbar button').last().click();await page.locator('.snowui-code-block-fullscreen').waitFor({state:'detached'});
await page.evaluate(()=>{window.__packageClipboardDescriptor=Object.getOwnPropertyDescriptor(navigator,'clipboard');Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.__packageCodeCopied=value;}}});});try{await packageCode.locator('.snowui-code-block-single-line-trailing button').click();await page.waitForFunction(()=>window.__packageCodeCopied===document.querySelector('[data-testid="package-code-source"]').textContent);}finally{await page.evaluate(()=>{if(window.__packageClipboardDescriptor)Object.defineProperty(navigator,'clipboard',window.__packageClipboardDescriptor);else delete navigator.clipboard;delete window.__packageClipboardDescriptor;delete window.__packageCodeCopied;document.documentElement.style.removeProperty('font-size');document.documentElement.style.removeProperty('--gap-scale');});}
console.log('PASS: tarball CodeBlock 4px code/accessory and language/action gaps, shared fixed single-line direction, short-code Fill, larger overrides, original horizontal scroll, exact copy and fullscreen');

await page.emulateMedia({reducedMotion:'reduce'});
const packageActions=page.locator('.package-gap-actions'),packageActionWidth=page.locator('[data-package-action-width]');
for(const font of[16,8])for(const override of['0px','24px']){
 await page.evaluate(font=>{document.documentElement.style.fontSize=`${font}px`;document.documentElement.style.setProperty('--gap-scale','.25');},font);
 await packageActions.evaluate((n,v)=>n.style.setProperty('--snowui-overflow-actions-gap-override',v),override);
 assert.equal(await packageActions.evaluate(n=>parseFloat(getComputedStyle(n).columnGap)),override==='24px'?24:4);
 await packageActionWidth.evaluate(n=>n.style.width='80px');await packageActions.evaluate(n=>n.scrollIntoView({block:'center'}));const more=page.getByRole('button',{name:'Package gap actions',exact:true});await more.click();await page.getByRole('option',{name:'Archive document',exact:true}).waitFor();const hidden=await packageActions.locator('[data-overflow-mode="hidden"]').count();await packageActionWidth.evaluate(n=>n.style.width='600px');assert.equal(await packageActions.locator('[data-overflow-mode="hidden"]').count(),hidden);await page.getByRole('option',{name:'Archive document',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('.package-gap-actions [data-overflow-mode="full"]').length===3);
}
assert.equal(await page.getByTestId('package-gap-action-selected').textContent(),'archive:menu;'.repeat(4));await page.evaluate(()=>{document.documentElement.style.removeProperty('font-size');document.documentElement.style.removeProperty('--gap-scale');});
console.log('PASS: tarball OverflowActions 4px group floor and larger override at 16/8px, real 80px overflow, open-menu freeze, full recovery and exactly-once menu actions');

assert.deepEqual(errors,[]);console.log('PASS: actual tarball SSR, hydration, Frame identity, Snippet, Input binding, Button event, DataTable/Toolbar Context chart/sidebar render, keyboard activation, animated numeric update and light/dark theme');
} finally { await browser.close(); }
