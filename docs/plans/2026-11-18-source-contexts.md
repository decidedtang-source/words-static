# Source-specific context restoration

Base: 8e93f3e. Branch: feature/source-contexts-20261118. Rollback tag: published-before-source-contexts-20261118.

## User request and boundaries
Fix the existing 1,875 cards according to their actual purpose: workplace/project management vs the associated reading article. Preserve layout, word IDs and study history. User explicitly authorized fixing all existing cards and previously authorized publication. Do not import new dates, change scheduler policy, activate the V10 candidate, or touch Podcast/Notion/automation content.

## Findings
The public importer discarded source title/link and category. Enrichment copied the ordinary meaning into the context explanation, and did not display the original teaching-example identity. The source batches explicitly say their examples are original learning sentences, not article quotes.

## Implementation
- Keep the 15 published batches explicit in content/published-batches.json. All 1,875 entries carry an explicit purpose, scene, independent explanation field and example origin. Missing context or origin fails enrichment.
- 1,500 workplace cards retain both existing example sentences. Of those, 1,454 retain the original meaning with the original daily group scene; 46 receive the matching candidate's more specific sentence interpretation and boundaries. This is not a claim that all 1,500 explanations were rewritten from scratch.
- 375 reading cards have individually mapped article focus, with 16 article sources. 171 primary examples changed; 204 already relevant examples retained. All second examples remain separately labeled transfer practice. 41 contextual collocations replaced. Corrected ordinary sense wording for counterpart and acknowledged.
- Distinguish vocabulary/article origin from example origin. Primary reading examples are original/teaching paraphrases, not exact quotations. No newly reproduced article passages. Three paywall previews explicitly labeled as previews; one public transcript; twelve full public texts. Do not present political judgments as independently verified news facts.
- Existing card and dictionary detail share the same context/provenance renderer. Context and example masks, English-only audio, independent front/back modules and equal card size remain. Keep existing lexical Bridge explanation as a separate supplementary paragraph for workplace cards.
- Future non-work/non-reading domains can supply kind=domain with an explicit scene and origin rather than silently becoming workplace examples. See content/contexts/README.md.

## GitHub candidate information requested by user
GitHub connector failed with Unknown tool, so gh API and existing Git objects verified the branches. Older PR7 is still draft. The newer R2 candidate at trial/v10-r2-50-20261116, commit 45f198cd410d0946e1717b9314af8246c64964d9, records 50 reviewed / 0 accepted / 0 published. It is different from the superseded pilot50 draft.
M02/M07 provide source identity, qualifier and shared-context principles. The R2 reading cards still identify their examples as teaching paraphrases, not recovered article quotations. Reused 46 same-sentence workplace interpretations and cross-checked 3 unchanged reading examples; the changed account-for example cannot inherit the candidate's workplace interpretation. Exact 49 bundle pointers are in content/contexts/candidate-reuse.json. Frozen candidate files and review locks were not changed.

## Independent review and fixes
The final reviewer checked all 16 primary sources and all 49 candidate mappings, and confirmed identity preservation across all 1,875 cards. Findings corrected with focused regression coverage:
- Remove workplace supplier/batch/deadline collocations from reading context.
- acknowledged can refer to internal acknowledgement, not necessarily a public statement.
- at the expense of concerns pension spending vs other public needs in the France article.
- annually denotes yearly petroleum consumption; reporting frequency is not annualization.
- presumption, plausible and knife-edge must preserve the argument's rejected alternative and negation.
- sustainable must reflect the author's proposed reduction of concentrated wealth in this source context.
- skepticism describes an earlier view the author has revised, not his current conclusion.
- intervened refers at that occurrence to the Russia/Ukraine war, not the Brazilian election.
- feel the full effect concerns families and healthcare changes that have not fully taken effect.
- Preserve less in the author's comparative treasonous wording; practice sentence explicitly teaches its accusatory register.
- Restore the on construction in pull the plug on and passive form be emboldened to.
- Remove the category-error note that referred to the superseded first example.
- Correct title to subtitle, and source publication date to 2026-10-15 for On Inflation.
- Restore the legacy framing Bridge explanation after a browser regression exposed its omission.

## Verification
Source inventory and full generated-data coverage tests passed; source semantic regressions exercised RED to GREEN. One full browser pass exposed the Bridge regression; the repaired lexical and source-context browser tests pass. Final full suite and production readback recorded in the delivery receipt.

## Limits and decisions
No claim of complete dictionary certification or a full rewrite of workplace content. Original topical examples were chosen instead of bulk article quotation, with explicit labels. Old card IDs, dates, terms, IPA, POS and levels remain unchanged; two corrected ordinary meanings and 171 first examples intentionally differ. The source batch hash for Oct29 reflects its current local source file. Learning events and scheduling code are unchanged.

Final verification: 41/41 unit tests; 14/14 browser tests (serial); build and git diff --check passed; 390px screenshot inspected. Validation receipt: docs/source-contexts-20261118-receipt.json. Production deployment/readback follows this committed validation.
