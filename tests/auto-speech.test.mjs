import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeAutoSpeech,playbackItems} from '../src/auto-speech.mjs';
test('automatic speech validates independent triggers and ordered English-only selection',()=>{
 const prefs=normalizeAutoSpeech({switch:true,details:false,reveal:false,order:['example2','word','example2','chinese'],selected:['word','example2','chinese'],gap:500});
 assert.deepEqual(prefs.order,['example2','word','example1']);
 assert.deepEqual(playbackItems({term:'scope',examples:[{en:'First',zh:'中文'},{en:'Second'}]},prefs),[{text:'Second',target:'example2'},{text:'scope',target:'word'}]);
 assert.deepEqual(playbackItems({term:'scope'},prefs),[{text:'scope',target:'word'}]);
 assert.equal(normalizeAutoSpeech().reveal,true);
 assert.deepEqual(playbackItems({term:'scope'},normalizeAutoSpeech({selected:[]})),[]);
});

test('freeform Chinese and mixed-script dictionary queries never enter the English playlist',()=>{for(const term of ['中文','scope 中文','日本語','단어'])assert.deepEqual(playbackItems({term},normalizeAutoSpeech()),[]);assert.deepEqual(playbackItems({term:'scope'},normalizeAutoSpeech()),[{text:'scope',target:'word'}]);});
