import test from 'node:test';
import assert from 'node:assert/strict';
import {checkWholeCard,MODULES,wholeFingerprint} from '../scripts/five-zone-workflow/whole-card.mjs';
const fixture=()=>{
 const e={cardId:'test',term:'test'},z={reviewer:'zone-reviewer'},s={cardId:'test',writer:'writer',headword:{ipa:'test',pos:'n.',chunk:'a test',ipaNote:'verified'},examples:[{en:'A test.',zh:'测试。',kind:'authored_example'}],sources:[{id:'source',url:'https://example.org',title:'Synthetic',section:'Visible',retrievalStatus:'full_page',evidence:'Synthetic only'}],etymology:['modern_connection','historical_fact','current_use'].map(kind=>({kind,title:kind,text:'Synthetic explanation',sourceId:'source'}))};
 const r={cardId:'test',reviewer:'reviewer',ruleVersion:'whole-card/1',fingerprint:wholeFingerprint(e,s,z),sourceChecks:[{sourceId:'source',verdict:'SUPPORTED',note:'Synthetic only'}],modules:MODULES.map(id=>({id,decision:'PASS',scores:{accuracy:3,completion:3,readability:3,increment:3},reasons:{accuracy:'evidence',completion:'complete',readability:'clear',increment:'useful'},issues:[]}))};return {e,s,z,r};
};
test('complete synthetic whole-card contract passes',()=>{const {e,s,z,r}=fixture();assert.equal(checkWholeCard(e,s,z,r).status,'CANDIDATE')});
for(const [name,change] of [
 ['missing writer',x=>{delete x.s.writer;x.r.fingerprint=wholeFingerprint(x.e,x.s,x.z)}],['missing etymology',x=>x.s.etymology=[]],['missing pronunciation',x=>x.s.headword.ipa=''],['missing examples',x=>x.s.examples=[]],
 ['unverified history',x=>x.s.etymology[1].sourceId='unknown'],['stale review',x=>x.r.fingerprint='old'],
 ['one weak module',x=>x.r.modules[0].scores.accuracy=2],['missing module',x=>x.r.modules.pop()],
 ['missing source check',x=>x.r.sourceChecks=[]],['self review',x=>x.r.reviewer='writer']
])test(`block ${name}`,()=>{const x=fixture();change(x);assert.notEqual(checkWholeCard(x.e,x.s,x.z,x.r).status,'CANDIDATE')});
