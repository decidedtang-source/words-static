import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizePreferences} from '../src/display-preferences.mjs';
import {underlineTarget} from '../src/reading-display.mjs';

test('both face contents are independent multi-selects, including an intentionally empty face',()=>{
 assert.deepEqual(normalizePreferences({frontModule:'examples'}).frontModules,['examples']);
 const p=normalizePreferences({frontModules:['meaning','examples','meaning','bad'],backModules:[]});
 assert.deepEqual(p.frontModules,['meaning','examples']);assert.deepEqual(p.backModules,[]);
 assert.deepEqual(normalizePreferences({frontModules:[]}).frontModules,[]);
 assert.deepEqual(normalizePreferences({backModules:'bad'}).backModules,['term','meaning','foundation','context','examples']);
});

test('flip actions default to preserving state and independently validate sections and masks',()=>{
 const initial=normalizePreferences(null);assert.equal(initial.keepFace,false);assert.equal(initial.scrollMode,'module');assert.equal(normalizePreferences({keepFace:true,scrollMode:'top'}).keepFace,true);assert.equal(normalizePreferences({keepFace:'yes',scrollMode:'bad'}).scrollMode,'module');assert.deepEqual(Object.values(initial.flipSections),Array(5).fill('keep'));assert.deepEqual(Object.values(initial.flipMasks),Array(7).fill(false));
 const p=normalizePreferences({expanded:{meaning:false},masks:{meaning:true,example:true},flipSections:{meaning:'open',term:'closed',examples:'bad'},flipMasks:{meaning:true,example:false,translation:'yes'}});
 assert.equal(p.flipSections.meaning,'open');assert.equal(p.flipSections.term,'closed');assert.equal(p.flipSections.examples,'keep');assert.equal(p.flipMasks.meaning,true);assert.equal(p.flipMasks.example,false);assert.equal(p.flipMasks.translation,false);assert.equal(p.expanded.meaning,false);assert.equal(p.masks.meaning,true);
});

test('display preferences preserve old collapse choice and reject invalid values',()=>{
  const p=normalizePreferences(null,false);
  assert.equal(p.expanded.term,true);
  assert.equal(p.expanded.meaning,true);
  assert.equal(p.expanded.examples,false);
  assert.equal(p.maskChinese,false);
  assert.equal(p.underline,false);
  const custom=normalizePreferences({expanded:{term:false,examples:true,context:'false'},maskChinese:true,maskEnglish:true,underline:true},false);
  assert.equal(custom.expanded.term,false);
  assert.equal(custom.expanded.examples,true);
  assert.equal(custom.expanded.context,false);
  assert.equal(custom.maskEnglish,true);
  assert.equal(normalizePreferences({maskChinese:'true',expanded:null}).maskChinese,false);
});

test('module order removes invalid and duplicate modules and keeps missing modules',()=>{
  assert.deepEqual(normalizePreferences(null).order,['term','meaning','foundation','context','examples']);
  assert.deepEqual(normalizePreferences({order:['examples','examples','unknown','term']}).order,['examples','term','meaning','foundation','context']);
  assert.deepEqual(normalizePreferences({order:'examples'}).order,normalizePreferences(null).order);
});

test('front module and independent masks migrate legacy preferences without coupling new choices',()=>{
  const migrated=normalizePreferences({maskChinese:true,maskEnglish:false});
  assert.equal(migrated.frontModule,'term');
  assert.equal(migrated.masks.meaning,true);
  assert.equal(migrated.masks.translation,true);
  assert.equal(migrated.masks.example,false);
  const custom=normalizePreferences({frontModule:'examples',maskChinese:true,masks:{meaning:false,context:false,example:true,translation:true}});
  assert.equal(custom.frontModule,'examples');
  assert.equal(custom.masks.meaning,false);assert.equal(custom.masks.context,false);
  assert.equal(custom.masks.dictionary,true);assert.equal(custom.masks.example,true);
  assert.equal(normalizePreferences({frontModule:'bad',masks:{meaning:'yes'}}).frontModule,'term');
  assert.equal(normalizePreferences({masks:{meaning:'yes'}}).masks.meaning,false);
});

test('underlines mark whole expressions without changing or interpreting source text',()=>{
  assert.equal(underlineTarget('Scope and telescope; SCOPE.','scope',true),'<u class="target-word">Scope</u> and telescope; <u class="target-word">SCOPE</u>.');
  assert.equal(underlineTarget('Clear problem  ownership.','problem ownership',true),'Clear <u class="target-word">problem  ownership</u>.');
  assert.equal(underlineTarget('<scope> & scope','scope',false),'&lt;scope&gt; &amp; scope');
  assert.equal(underlineTarget('Taking responsibility.','take responsibility',true),'Taking responsibility.');
  assert.equal(underlineTarget('scopé scope2 scope','scope',true),'scopé scope2 <u class="target-word">scope</u>');
});

test('phonetics and part-of-speech masks are independent and do not inherit legacy Chinese masking',()=>{const old=normalizePreferences({maskChinese:true});assert.equal(old.masks.ipa,false);assert.equal(old.masks.pos,false);const p=normalizePreferences({masks:{ipa:true,pos:false},flipMasks:{ipa:true}});assert.equal(p.masks.ipa,true);assert.equal(p.masks.pos,false);assert.equal(p.flipMasks.ipa,true);assert.equal(p.flipMasks.pos,false);});
