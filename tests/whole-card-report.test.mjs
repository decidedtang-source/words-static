import test from 'node:test';
import assert from 'node:assert/strict';
import {renderScoreReport} from '../scripts/five-zone-workflow/report-html.mjs';
test('whole-card report summarizes every card and escapes authored content',()=>{
 const cards=Array.from({length:50},(_,i)=>({cardId:String(i),term:`word-${i}`,status:'CANDIDATE',errors:[],modules:[{id:'etymology',score:75,scores:{accuracy:3},reasons:{accuracy:'<script>not executable</script>'},issues:[]}]}));
 const html=renderScoreReport({cards}, {cards:cards.map(c=>({...c,zones:[{id:'g1',score:75,scores:{accuracy:3},reasons:{accuracy:'source verified'}}]}))});
 assert.ok(html.includes('50 条'));assert.equal((html.match(/<details/g)||[]).length,50);assert.ok(html.includes('词源／演变'));assert.ok(html.includes('word-49'));assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>not executable'));
});
