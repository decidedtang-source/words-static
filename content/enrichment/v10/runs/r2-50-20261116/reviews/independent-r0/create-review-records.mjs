import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {contentQaIds,fingerprintInput,hashArtifact} from '../../../../../../../scripts/word-content/workflow.mjs';
import {validateEntity} from '../../../../../../../scripts/word-content/contracts.mjs';
const run=path.resolve('content/enrichment/v10/runs/r2-50-20261116');
const out=run+'/reviews/independent-r0';
const read=f=>JSON.parse(fs.readFileSync(f));
const manifest=read(run+'/manifest.json'),selected=read(run+'/selected.json'),vocab=read('public/vocabulary.json').words;
const items=manifest.itemStates.filter(i=>selected.calibration.includes(i.entryId));
assert.equal(items.length,24);
const issues=[];
const add=(issueId,entryIds,qaIds,severity,observation,requiredChange)=>issues.push({issueId,entryIds,qaIds,severity,observation,requiredChange});
const all=items.map(i=>i.entryId);
add('R0-M05-USAGE',all,['Q-L01'],'important','Every selected-sense usageNote only identifies original teaching text. The displayed usage tip repeats selection/provenance boilerplate. Required independent front-section usage guidance is missing.','Add per-sense usage guidance and entry-specific learning tips; keep provenance separate; ensure guidance appears in the projection.');
add('R0-SOURCE-TIME',all,['Q-S03'],'minor','Source retrieval timestamps uniformly assert midnight with minute/second precision, whereas source evidence supplies only a checked date.','Record actual ingestion time with precision/meaning limitations or verified retrieval time.');
add('R0-OBJECTIVE-POS',['V20261012-002'],['Q-D01','Q-L01'],'important','objective%3:00:00:: is adjective lexicalPos a in OEWN but Sense.pos and selected labels say n.','Correct the source POS mapping and learning label.');
add('R0-OBJECTIVE-QUEUE',['V20261012-002'],['Q-L01'],'important','shorten the queue is translated as reducing waiting time; queue length and waiting time are different metrics.','Make the English and Chinese example express the same objective.');
const components=['V20261014-075','V20261014-076','V20261029-005','V20261014-003','V20261018-106','V20261016-119'];
add('R0-COMPONENT-IDENTITY',components,['Q-D01','Q-D02','Q-L01','Q-N01','Q-L03'],'important','Component senses receive the entire phrase lexicalEntryId and phrase POS. Their summaries appear as whole-headword meanings, e.g. frame the issue includes picture frame. Components are not explicitly labeled/separated in dictionary/learning projection.','Preserve component lexical identity and actual POS; visibly identify component meanings; give a phrase-level general summary without inventing dictionary whole-expression coverage.');
add('R0-NASA-SENSE',['V20261014-075','V20261014-076'],['Q-D01','Q-D02','Q-C03'],'important','Both packages use web:nasa-verification and the fragment verification provides objective evidence for different concepts. It omits requirements for verification and is not a validation definition; identical sense ID/version denotes incompatible meanings.','Use distinct semantic IDs and complete attributed editorial definitions supported separately by NASA 5.3/5.4. Distinguish concept from a method based on it.');
add('R0-SHOCK-WRONG-SENSE',['V20261016-119'],['Q-D01','Q-L01','Q-C03','Q-B02','Q-B05','Q-A02'],'important','shock%1:11:00:: denotes geological crust agitation. Chinese gloss, town-closure example and economic Bridge do not match it.','Obtain suitable evidence for the adverse/economic-change meaning; fix every dependent gloss, example, reference and Bridge; block if evidence remains insufficient.');
add('R0-ACCOUNT-FOR-EXAMPLE',['V20261012-117'],['Q-A05'],'important','Does that percentage account for all shifts or only the day shift? awkwardly assigns account for shifts to a percentage, and introduces an unsupported consideration/inclusion sense.','Use a natural expression of the supported part-of-total sense, or independently source and teach the additional sense.');
add('R0-CAPACITY-SCOPE',['V20261012-012'],['Q-S01','Q-C01','Q-C02','Q-B02','Q-A01'],'important','Translation and explanations categorically add simultaneous startup to start both projects. Both quantifies the projects, not explicit concurrency.','Retain both without asserting concurrent timing; label any simultaneous scheduling interpretation as contextual inference.');
add('R0-VALIDATION-INTENT',['V20261014-076'],['Q-A03'],'important','Pragmatic Action asserts opposition to selecting an unrelated check merely for convenience. No convenience-based proposal or such opposition is stated.','Describe the actual request and matching criterion; mark the convenience contrast as a teaching counterexample if retained.');
add('R0-OWNERSHIP-EDGE',['V20261012-015'],['Q-A04'],'important','condition to practice:commitment duplicates the role-alignment edge explanation without explaining a conditional-commitment relationship.','Remove the unnecessary condition edge or give a distinct, justified local relationship.');
add('R0-TRADEOFF-TYPO',['V20261012-020'],['Q-A05'],'minor','Second work-example Chinese begins 请选择方案前, an ungrammatical rendering of before we choose an option.','Correct word order while preserving the request to quantify before choosing.');
add('R0-ROUTE-ENUM',['V20261012-078','V20261012-117','V20261014-075','V20261014-076','V20261029-005','V20261012-015'],['Q-B01'],'important','inventory_only/external/contextualized are not the frozen M07 six-value location vocabulary.','Map actual sense position/expression reasoning to the frozen vocabulary, separate from explanation strategy.');
add('R0-QUALIFIERS',['V20261012-022','V20261012-024','V20261012-053','V20261012-093','V20261018-106','V20261016-119'],['Q-C02'],'important','Structured qualifiers omit explicit constraints: tentative until review; pending still/yet; reservation before review; provided named confirming actor; lead continued/actor; inflation another/households. Prose mostly preserves them but bound constraint fields do not.','Populate applicable conditions, agents and timeScope from actual text, without invented dates or actors.');
const limits=['No learner acceptance or physical-device/audio verification.','Current candidate DOM/layout not certified; content projection observations are data-level only.','21 IPA values remain explicitly null/unverified; this alone is not a semantic failure.','All 24 inventories are partial.','20 entries have no verified history and explicitly retain that gap.','Cambridge indexed excerpts do not establish full dictionary access.'];
const sources={reviewer:'/root/r2_implementation_review',time:new Date().toISOString(),method:'Read all24 semantic packages and bound inputs, compared selected OEWN definitions and lexical POS with licensed snapshot; examined bilingual examples, contexts, all analysis blocks, both Bridge branches, practices and edges. Independently reopened NASA and four Etymonline pages. Cambridge direct pages returned 403; used official indexed evidence for supplied IPA and relevant meanings.',checks:[{url:'https://www.nasa.gov/reference/5-0-product-realization/',locator:'5.3 and 5.4',finding:'Supports requirements-based verification versus intended environment/user expectations for validation and multiple methods. Does not support the reused validation fragment.'},...['objective','capacity','reservation','qualify'].map(t=>({url:'https://www.etymonline.com/word/'+t,locator:'main etymology',finding:'Recorded dates and bounded historical relationship corroborated; no organizational facts inferred.'})),...['provided','constraint','buffer'].map(t=>({url:'https://dictionary.cambridge.org/dictionary/english/'+t,locator:'official indexed entry, US pronunciation',finding:'Recorded IPA independently matched, including complete provided that; meanings supported at the indicated source scope.'}))],limitations:limits};
const write=(f,v)=>fs.writeFileSync(out+'/'+f,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
write('source-checks.json',sources);
const entries=[];
for(const i of items){
 const b=read(i.artifactPath),input=read(i.inputPath),term=b.snapshot.term;
 assert.equal(hashArtifact(b),i.artifactHash);assert.equal(fingerprintInput(input),i.inputHash);assert.deepEqual(b.snapshot,input.snapshot);
 const original=vocab.find(w=>w.id===i.entryId);assert.ok(original);assert.equal(original.term,term);assert.equal(original.example,b.context.quote);
 const own=issues.filter(x=>x.entryIds.includes(i.entryId));
 const observation={
 'Q-H01':`${term}: original identity retained. ${b.verifiedIPA?'Recorded IPA independently matched official Cambridge indexed pronunciation.':'verifiedIPA is null: no unverified original IPA certified.'} Sense-POS problems are reported under D01/L01.`,
 'Q-S01':`Original quote checked: ${b.context.quote} Translation read: ${b.context.translation} Shared projection is data-level, not screenshot acceptance.`,
 'Q-S03':'Teaching/paraphrase identity retained; no invented external speaker/date. Source timestamp precision limitation recorded separately.',
 'Q-N01':`General: ${b.selection.general} Current: ${b.context.meaning} Populated, shared projected summaries; component mistakes listed below.`,
 'Q-D01':`Compared ${b.senses.length} sense definitions, POS, glosses and locators with actual OEWN snapshot or official excerpt/NASA evidence.`,
 'Q-D02':`Coverage explicitly ${b.inventory.coverageStatus}. Component/whole expression distinction examined; no complete dictionary coverage accepted.`,
 'Q-L01':`Read ${b.selection.senses.length} selected senses and every bilingual original example. Per-sense usage/projection gap detailed below.`,
 'Q-L03':'Summary follows selected text and shared navigation projection; specific component-summary faults recorded below.',
 'Q-L04':`No frequency rank asserted. Current references ${b.context.senseRefs.join(', ')}; not mechanically forced to first selected sense.`,
 'Q-Y01':b.history.claims.length?`Independently checked ${term} historical dates in Etymonline; preserved precision and bounded inference.`:`No historical claim exists for ${term}; this check is not applicable, not a historical-source pass.`,
 'Q-Y03':b.history.claims.length?'Historical scope bounded; no organizational facts inferred.':'Unverified history explicitly disclosed and historyLink null; absence is not fabricated explanation.',
 'Q-C01':'Quote and word identity match original vocabulary/frozen snapshot; teaching identity retained; target slices inspected, including reservation substring inflection.',
 'Q-C02':`Read polarity/modality/conditions against ${b.context.quote}; excluded inference: ${b.context.qualifiers.excludedInferences.join(' ')}`,
 'Q-C03':`Current interpretation: ${b.context.meaning}. Checked real referenced senses and composition/professional evidence.`,
 'Q-C04':'M02/M03 share ContextUse fields with M07 through adapter. Actual candidate DOM/visual order remains engineering review and is not certified here.',
 'Q-B01':`Location ${b.bridge.location}; strategies ${b.bridge.strategies.join(', ')}. Route assessed separately from depth.`,
 'Q-B02':`Read actual Bridge against evidence and limit: ${b.bridge.boundary}`,
 'Q-B04':`Boundary read: ${b.bridge.boundary}. No general authority/completed approval inferred from lexical relation.`,
 'Q-B05':b.history.claims.length?'Supported historical branch remains distinct from semantic bridge.':'Missing history does not block supported modern meaning; wrong current sense evidence still blocks.',
 'Q-A01':'Read five blocks, seven dimension coverage and work expressions; combined syntax/concept and game/neighbors contain distinct sentence-specific information. Workplace intro is supplemented by actual examples.',
 'Q-A02':`Depth ${b.analysis.depth}; reason ${b.analysis.depthReason}. Checked useful distinctions and evidence limits without token quotas.`,
 'Q-A03':`Read game/neighbors/action functions separately. Action: ${b.analysis.blocks.find(x=>x.blockId==='action').text}`,
 'Q-A04':b.practices.length?`Read ${b.practices.length} full cards, role/authority boundaries, criteria, questions, responses and ${b.analysis.edges.length} versioned edge explanations.`:`No Practice attached to ${term}; local explanation remains readable. No forced relationship required.`,
 'Q-A05':`Read both original work expressions, Chinese/use limits: ${b.analysis.workplaceUse.map(u=>u.en).join(' / ')}`};
 const checks=contentQaIds.map(qaId=>{const related=own.filter(x=>x.qaIds.includes(qaId));let result=related.length?'fail':'pass';if(qaId==='Q-Y01'&&!b.history.claims.length||qaId==='Q-A04'&&!b.practices.length)result='not_applicable';return {qaId,result,observation:observation[qaId]+(related.length?' Issues: '+related.map(x=>x.observation).join(' '):''),evidencePaths:[i.artifactPath,i.inputPath,path.resolve('content/enrichment/v10/sources/oewn-selected-2025.json'),path.resolve('content/enrichment/v10/sources/web-evidence-20261116.json'),out+'/source-checks.json'],issueIds:related.map(x=>x.issueId)};});
 const review={schemaVersion:1,reviewId:'independent-r0-'+i.entryId,reviewer:'/root/r2_implementation_review',role:'content-reviewer',scope:'full_package',inputHash:i.inputHash,artifactHash:i.artifactHash,checks,verdict:'fail',issues:own.map(({entryIds,...x})=>x),time:new Date().toISOString()};
 assert.ok(validateEntity('ReviewRecord',review).valid);assert.equal(checks.length,24);write(i.entryId+'.json',review);entries.push({entryId:i.entryId,term,verdict:'fail',inputHash:i.inputHash,artifactHash:i.artifactHash,issueIds:own.map(x=>x.issueId),reviewPath:out+'/'+i.entryId+'.json'});
}
write('summary.json',{reviewer:'/root/r2_implementation_review',scope:'full_package',revision:'r0',counts:{reviewed:24,pass:0,fail:24,blocked:0},calibrationPassed:false,expansionAllowed:false,issues,entries,limitations:limits});
console.log(JSON.stringify({directory:out,records:entries.length,issueCategories:issues.length,originalQuotesAndHashesMatched:true}));
