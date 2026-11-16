export function produce({snapshot:s},edit){
 if(edit&&JSON.stringify(edit.refs)!==JSON.stringify((edit.cards||[]).map(c=>({unitId:c.unitId,version:c.version,scope:c.scope}))))throw Error('History reference mismatch');
 const cards=(edit?.cards||[]).map(c=>({unitId:c.unitId,version:c.version,label:(c.scope==='component_history'?'组成词 · ':'词条 · ')+c.lemma,summary:c.summary,url:c.receipt.url,status:c.receipt.status}));
 const ready=cards.length>0&&cards.every(c=>c.status==='ready'&&c.summary)&&edit.cards.every(c=>c.receipt.textSHA);
 return {status:ready?'ready':'source_pending',data:{history:ready?cards.map(c=>c.summary).join('\n'):'历史资料正在补充。',historyUrl:cards[0]?.url||'',historyScope:edit?.scope||'whole_entry',historyCards:cards},provenance:{refs:edit?.refs||[],wholeHistoryStatus:edit?.wholeHistoryStatus||'not_acquired',receipts:(edit?.cards||[]).map(c=>c.receipt)}};
}
