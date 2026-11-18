const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function contextSourceMarkup(card){
 const c=card.context;if(!c)return '';
 const s=c.source;
 if(!s)return `<p class="hint" data-context-source>${c.kind==='workplace'?'工作':'指定学习'}情境由本词库编写，例句为原创教学材料。</p>`;
 const url=/^https:\/\//.test(s.url)?s.url:null;
 const access={'public-text':'公开正文','public-preview':'仅核对公开预览','public-transcript':'公开文字稿'}[s.access]||'来源范围未说明';
 return `<div class="hint context-source" data-context-source><p>${c.kind==='reading'?'词汇阅读来源':'情境参考来源'}：${esc(s.author)} · ${url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a>`:esc(s.title)}${s.date?' · '+esc(s.date):''}</p><p>${access}。下方例句为学习用原创／改写，不是逐字引文；涉及评价时归于作者观点。</p></div>`;
}
export function exampleOriginMarkup(example){const labels={'reading-original':'同主题学习例句 · 原创／改写，非原文','workplace-original':'工作情境例句 · 原创','transfer-original':'拓展例句 · 原创','domain-original':'指定情境例句 · 原创'};return `<p class="hint example-origin">${esc(labels[example.origin]||'学习例句 · 来源身份未标注')}</p>`}
