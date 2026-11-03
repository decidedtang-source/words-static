import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {validateEntry, reviewEntry, fingerprint, runBatch, additionalEntries} from '../scripts/five-zone-workflow/core.mjs';

const fixture=()=>({cardId:'synthetic',term:'test',context:'A test.',contextZh:'测试。',gloss:'测试',pos:'n.',definitionEn:'a check',definitionZh:'检查',contextTakeaway:'进行检查',bridgeText:'用结果检查是否达到标准',writer:'synthetic-writer',
 sources:[{id:'s',url:'https://example.org/test',title:'Synthetic fixture',retrievalStatus:'partial',section:'Visible excerpt',evidence:'Synthetic evidence only'}],
 claims:[{id:'c',text:'a check',kind:'source_fact',sourceIds:['s'],evidenceNote:'Visible excerpt supports only this meaning'}],
 dictionaryEntries:[{lemma:'test',pos:'n.',senses:[{id:'sense1',glossZh:'检查',definitionEn:'a check',sourceIds:['s']}]}],
 groups:Array.from({length:5},(_,i)=>({id:`g${i+1}`,title:['先记住，再联系','句法与概念','辨析与英文邻居','这句话在做什么','工作中可以这样说'][i],text:`Synthetic explanation ${i}`,sourceIds:['s'],claimIds:['c'],requirements:{anchor:'anchor',explanation:'explanation',example:'example',boundary:'boundary'}}))});
const receipt=e=>({cardId:e.cardId,reviewer:'synthetic-reviewer',fingerprint:fingerprint(e),ruleVersion:'five-zone/2',front:{decision:'PASS',reason:'synthetic only'},hardGates:'PASS',sourceChecks:[{claimId:'c',verdict:'SUPPORTED',note:'Synthetic visible evidence checked'}],zones:e.groups.map(g=>({id:g.id,scores:{accuracy:3,completion:3,readability:3,increment:3},reasons:{accuracy:'synthetic',completion:'synthetic',readability:'synthetic',increment:'synthetic'},requirementsVerdict:'PASS',issues:[]}))});
test('reject focused sense outside reviewed dictionary',()=>{const e=fixture();e.focusedEntries=[{entry:e.dictionaryEntries[0],sense:{id:'unknown',glossZh:'invented'}}];assert.ok(validateEntry(e).length)});
test('frozen zone titles cannot change through content',()=>{const e=fixture();e.groups[0].title='new design';assert.ok(validateEntry(e).length)});
test('expanded dictionary excludes visible senses without deleting distinct senses',()=>{const e=fixture();e.dictionaryEntries[0].senses.push({id:'different',glossZh:'另义',definitionEn:'another sense',sourceIds:['s']});const before=JSON.stringify(e);assert.deepEqual(additionalEntries(e)[0].senses.map(s=>s.id),['different']);assert.equal(JSON.stringify(e),before)});
test('valid synthetic contract is accepted without implying real semantic approval',()=>{const e=fixture();assert.deepEqual(validateEntry(e),[]);assert.equal(reviewEntry(e,receipt(e)).status,'CANDIDATE')});
for(const [name,mutate] of [
 ['missing zone',e=>e.groups.pop()],['missing teaching task',e=>delete e.groups[0].requirements.example],
 ['orphan claim',e=>e.groups[0].claimIds=['unknown']],['unsupported source',e=>e.claims[0].sourceIds=['unknown']],
 ['empty evidence',e=>e.sources[0].evidence=''],['duplicate more sense',e=>e.dictionaryEntries[0].senses.push({...e.dictionaryEntries[0].senses[0],id:'sense2'})],
 ['duplicate bridge',e=>e.bridgeText=e.definitionZh],['duplicate zone body',e=>e.groups[1].text=e.groups[0].text]
])test(`reject ${name}`,()=>{const e=fixture();mutate(e);assert.ok(validateEntry(e).length)});
for(const [name,mutate] of [
 ['self review',(r,e)=>r.reviewer=e.writer],['stale hash',r=>r.fingerprint='old'],
 ['weak zone hidden by total',r=>r.zones[3].scores.completion=2],['semantic task missing',r=>r.zones[3].requirementsVerdict='FAIL'],
 ['partial source does not support claim',r=>r.sourceChecks[0].verdict='INSUFFICIENT'],
 ['missing score rationale',r=>r.zones[0].reasons.accuracy=''],['front incomplete',r=>r.front.decision='FAIL'],
 ['hard failure',r=>r.hardGates='FAIL']
])test(`block ${name}`,()=>{const e=fixture(),r=receipt(e);mutate(r,e);assert.notEqual(reviewEntry(e,r).status,'CANDIDATE')});
test('interrupt/resume preserves completed rows and invalidates changed inputs',()=>{const a=fixture(),b={...fixture(),cardId:'synthetic2'};const receipts=[receipt(a),receipt(b)];const first=runBatch([a,b],receipts,{},1);assert.equal(Object.keys(first.entries).length,1);const resumed=runBatch([a,b],receipts,first);assert.equal(resumed.entries[a.cardId].reused,true);assert.equal(resumed.entries[b.cardId].status,'CANDIDATE');b.groups=structuredClone(b.groups);b.groups[0].text+=' changed';const stale=runBatch([a,b],receipts,resumed);assert.equal(stale.entries[a.cardId].reused,true);assert.notEqual(stale.entries[b.cardId].status,'CANDIDATE')});
test('limited validation cannot reuse stale unprocessed scores',()=>{
 const dir=mkdtempSync(join(tmpdir(),'words-zone-test-')),entries=[fixture(),{...fixture(),cardId:'second'}];
 const write=(p,x)=>writeFileSync(join(dir,p),JSON.stringify(x));
 write('entries.json',entries);write('reviews.json',entries.map(receipt));
 const run=(...args)=>spawnSync(process.execPath,[resolve('scripts/five-zone-workflow/run.mjs'),dir,...args],{encoding:'utf8'});
 assert.equal(run('--validate-only').status,0);entries[1].groups[0].text+=' changed';write('entries.json',entries);
 assert.notEqual(run('--limit=1','--validate-only').status,0);
 const report=JSON.parse(readFileSync(join(dir,'report.json'),'utf8'));assert.notEqual(report.cards[1].status,'CANDIDATE');assert.equal(report.cards[1].total,undefined);
});
