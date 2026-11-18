import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizePreferences} from '../src/display-preferences.mjs';
import {underlineTarget} from '../src/reading-display.mjs';

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

test('underlines mark whole expressions without changing or interpreting source text',()=>{
  assert.equal(underlineTarget('Scope and telescope; SCOPE.','scope',true),'<u class="target-word">Scope</u> and telescope; <u class="target-word">SCOPE</u>.');
  assert.equal(underlineTarget('Clear problem  ownership.','problem ownership',true),'Clear <u class="target-word">problem  ownership</u>.');
  assert.equal(underlineTarget('<scope> & scope','scope',false),'&lt;scope&gt; &amp; scope');
  assert.equal(underlineTarget('Taking responsibility.','take responsibility',true),'Taking responsibility.');
  assert.equal(underlineTarget('scopé scope2 scope','scope',true),'scopé scope2 <u class="target-word">scope</u>');
});
