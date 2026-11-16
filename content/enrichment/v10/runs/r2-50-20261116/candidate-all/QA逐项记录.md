# R2 需求与QA执行追踪

这是本次执行记录，不改冻结方案中的历史状态文字。pass_with_scope不表示真机/用户/部署通过；具体未测见各行。

| QA | 结果 | 证据与范围 |
| --- | --- | --- |
| Q-G01 | pass | baseline-manifest; candidate-all/design.json;96 unchanged hashes |
| Q-G02 | pass_with_scope | qa/adapter-conformance.json:3 old words x4widths x2themes; actual new-word visual-review.json; no claim same-word comparison for new words |
| Q-G03 | pass | requirement trace below and 48 case dispositions |
| Q-G04 | pass | qa/unit-tests.txt: authorization/scope/hold rejection |
| Q-H01 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-H02 | pass_simulated | 48 candidate audio start/stop/end/error/keyboard/layout cases; no listening test |
| Q-H03 | pass_simulated | candidate-all/design.json extraChecks: local voice, stale callbacks, keyboard,reduced motion; physical devices not run |
| Q-S01 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-S02 | pass | 50 entryChecks and navigationTargets; default preview closed |
| Q-S03 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-N01 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-N02 | pass | 50 entryChecks navigationTargets plus48 Bridge return cases; dictionary auto-reveal |
| Q-N03 | pass_browser | 200 render observations,320/390/768/1440; screenshots; real device not run |
| Q-N04 | pass | 48 interaction cases incl commitment Practice cards; same-entry return; stable sense anchors checked |
| Q-D01 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-D02 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-D03 | pass_with_scope | embedded offline inventory;50 initial collapsed checks; JS-disabled first-entry fallback; no runtime network dictionary loader to simulate |
| Q-D04 | pass | unit-tests source-change invalidation; original IDs unchanged; no source overwriting accepted state |
| Q-L01 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-L02 | pass | original3 word-content/test +24 adapter cases;96 protected hashes |
| Q-L03 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-L04 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-Y01 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-Y02 | pass | original baseline preserved;two history regions separate;missing new histories disclosed |
| Q-Y03 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-C01 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-C02 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-C03 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-C04 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-B01 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-B02 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-B03 | pass | semantic full-package records + bridge return checks; historical link folded, missing evidence explicitly handled |
| Q-B04 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-B05 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-B06 | pass | unit-tests prompt/practice/source binding and depth-route separation; evidence refs retained |
| Q-A01 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-A02 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-A03 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-A04 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-A05 | pass | 50 current-hash independent full_package records referenced by manifest.json; detailed per-entry observations and exceptions preserved |
| Q-A06 | not_run | No user comprehension/transfer assessment; accepted0 |
| Q-E01 | pass | baseline manifest and actual design check:1875 IDs/15batches/originalquotes/96 files unchanged |
| Q-E02 | pass | unit-tests input/draft/source/practice invalidation; immutable r0/r1/r2 and review hash matching |
| Q-E03 | pass | unit-tests interruption/partial files/journal recovery/retry limit; no third content revision |
| Q-E04 | pass_with_scope | 3 original browser regressions; candidate no localStorage/IndexedDB writes; live-learning integration not attempted |
| Q-E05 | pass_with_scope | 200 render cases; no page errors; exact50 quote checks; embedded50 only/static first-entry fallback. Copy control not present in frozen review template; original library copy covered by browser regression |
| Q-E06 | pass | candidate-lock+final-candidate; sources/module files/artifact/HTML hashes verified; immutable old baselines remain available; no live rollback executed |
| Q-E07 | not_run | No deployment authorization requested or used; trial source synchronization only,published0 |

## R01–R12

| 要求 | 本次证据 |
| --- | --- |
| R01 原版增量 | 96基准哈希、24旧词同屏对照、原9模块保持 |
| R02 词典/精选/当前义独立 | 每包inventory、selection、context及独立Q-D/L/C审核 |
| R03 成熟来源真实范围 | OEWN许可、web-evidence主张定位、partial/component库存 |
| R04 原句限定 | 50原句SHA；独立Q-C01/C02；修订后的qualifiers |
| R05 两历史与Bridge | 独立M06及Bridge.historyLink；逐条Q-Y/B审核 |
| R06 原七步与实践 | 原Prompt哈希、七维覆盖、每词2工作句、0/1/多Practice |
| R07 阅读交互 | 200四宽度、48主题/发音/返回、50导航和来源预览 |
| R08 学习身份 | 1875/15不变；FSRS/备份回归；候选不写学习存储 |
| R09 模块/依赖/冻结 | 输入/稿件/审阅指纹、修订日志、完整依赖锁 |
| R10 校准/QA/试读 | 24锁通过后26；50独立审核；用户验收0 |
| R11 准入/流程 | 用户原话授权、R2冻结、门禁测试；本次无新增付费API |
| R12 原库与范围保全 | V6–V9/原库/Podcast不动；仅隔离分支源代码同步 |
