// 组件介绍是面向使用者的唯一摘要；不从职责、代码或任意段落猜测。
export function readComponentIntroduction(markdown, name = 'Component') {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let fence = null, collecting = false, count = 0;
  const body = [];
  for (const line of lines) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (collecting) throw new Error(`${name}: 组件介绍不允许代码围栏`);
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
      continue;
    }
    if (fence) continue;
    if (/^## 组件介绍\s*$/.test(line)) { count++; collecting = true; continue; }
    if (/^#{1,2} /.test(line)) collecting = false;
    if (collecting) body.push(line);
  }
  const text = body.join('\n').trim();
  if (count !== 1 || !text || /\n\s*\n/.test(text) || /^[#>|*-]/m.test(text) || /[<>`]|\[[^\]]+\]\(/.test(text) || /^(?:TODO|TBD|待补充|—)$/i.test(text)) {
    throw new Error(`${name}: 必须提供唯一的「## 组件介绍」及一段非空纯文本`);
  }
  return text.replace(/\s+/g, ' ');
}
