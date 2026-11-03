# Research 2 — 17词试产
日期2026-11-03；Writer trial_writer_2。状态DRAFT / 待独立审核 / NOT_DEPLOYED。
保留input-2.json的17个cardId、公开原句与译文；补充对话与工作句均标自编。未复制词典例句或网页全文。

## 五区资料需求与方法
01现代义联系；02句法与整句概念；03同一场景下的邻词区别；04当前句的沟通动作和接话；05可迁移的工作表达。词典支持词义与搭配，教学资料支持方法，不能互相冒充。记忆类比与原句句法拆解是Writer教学整理。

## 实际工具调用
tools.web__run共17次：search_query 9次（32个查询），open 8次（23个URL请求）。这是请求次数，不是成功全文数。token unknown；耗时未独立计量，unknown；初稿1轮，标题修正1次；独立审核通过率unknown。
- 首轮5次open尝试17个Cambridge词头，全部403。
- turn46search：commitment和trade-off原站索引。
- turn50search：contingency/context/clarify原站索引；agenda后补。
- turn54search：confirm/specify/elaborate/summarize原站索引。
- turn56search：recap/align/consensus/concern原站索引。
- turn57search：objection/reservation/rationale原站索引；输出有截断，rationale另查。
- turn59search：rationale及Cambridge agenda教学词汇表索引；找到British Council教学页。
- turn63view：British Council Agreeing and disagreeing完整读取；旧clarifying-your-meaning路径不可达；Cambridge unit20直连404。
- turn65search：BBC议程教学PDF索引、Oxford Online English会议课程线索；未使用镜像或论坛。
- turn68view：Oxford Online English完整脚本读取成功；ORSYS超时，未采用。
- turn81search：复核summarize，其他查询未增加关键证据。
- turn82search：补核unanimity/intention/schedule/minutes邻词，采用下表实际来源。
- turn83view：BBC What is summarising? PDF单页14行全文读取成功。

## 复用
17词各有词义依据。教学资料17次卡片引用，4个不同URL，13次为批内复用。邻词对照复用本批已核词义；没有为了每区硬凑新来源。原文摘录0词；常见搭配和原创练习句并非词典引文。sourceIds标注各区引用。

## 去重来源
|来源|获取状态|小节|支持的概念|
|---|---|---|---|
|[COMMITMENT — Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/commitment)|index_excerpt|noun: promise / Business English|对具体行动或交付作出的明确承诺|
|[Attending a Business Meeting – Video](https://www.oxfordonlineenglish.com/attending-business-meeting)|full_page|Full Script §§2–4; lines 455–559|按建议、提问、承诺等功能练习；讲明具体问题，再给出回应。|
|[INTENTION — Collins English Dictionary](https://www.collinsdictionary.com/us/dictionary/english/intention)|index_excerpt|Synonymy note: plan or design|intention 表示打算，不自动构成对他人的承诺。|
|[CONTINGENCY — Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/contingency)|index_excerpt|noun: future possible event; contingency plan|可能发生且需要预先准备的意外情况|
|[TRADE-OFF — Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/tradeoff)|index_excerpt|tradeoff: two desired qualities; loss of a benefit|获得一项优势时需要付出的另一项代价|
|[Agreeing and disagreeing](https://learnenglish.britishcouncil.org/free-resources/speaking/b1/agreeing-disagreeing)|full_page|Transcript lines 21–77|通过给理由和调整方案展示同意、不同意的互动。|
|[Working in English — Business English Vocabulary Online, Unit 20](https://www.cambridge.org/elt/workinginenglish/vocabonline/unit20.htm)|index_excerpt|unit20: agenda (n), meeting subjects|会议准备讨论的事项清单|
|[Talking Business — Meetings: Agenda setting](https://downloads.bbc.co.uk/worldservice/learningenglish/business/talkingbusiness/pdfs/2.1_agenda.pdf)|index_excerpt|Useful Phrases; Transcript clips 1–2|会议开始时说明议题与次序。|
|[SCHEDULE — Dictionary.com](https://www.dictionary.com/browse/schedule)|index_excerpt|definition: planned things and times|列出事项与实施时间。|
|[minutes — The People’s Law Dictionary](https://dictionary.law.com/Default.aspx?selected=1254)|index_excerpt|definition 1: written record of meetings|会议纪要是会议的书面记录。|
|[CONTEXT — Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/context)|index_excerpt|noun: CAUSE OF EVENT / LANGUAGE|理解当前事项所需的背景|
|[CLARIFY — Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/clarify)|index_excerpt|verb: EXPLAIN|把含糊的意思、范围或要求讲清楚|
|[CONFIRM — Cambridge Dictionary](https://dictionary.cambridge.org/us/dictionary/english/confirm)|index_excerpt|verb: MAKE CERTAIN / PROVE TRUE|确认信息、安排或双方理解是否成立|
|[ELABORATE — Cambridge Dictionary](https://dictionary.cambridge.org/us/dictionary/english/elaborate)|index_excerpt|verb: add information; elaborate on|对已经说出的观点进一步详细说明|
|[SPECIFY — Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/specify)|index_excerpt|verb / Business English|明确写出或说出具体要求|
|[SUMMARIZE — Cambridge Dictionary](https://dictionary.cambridge.org/us/dictionary/english/summarize)|index_excerpt|verb: important facts in a short clear form|概括重点而不是重复全部细节|
|[What is summarising?](https://downloads.bbc.co.uk/skillswise/english/en07unde/factsheet/en07unde-l1-f-what-is-summarising.pdf)|full_page|page 1, lines 3–13|概括提取重点，不加入不必要细节。|
|[RECAP — Cambridge Dictionary](https://dictionary.cambridge.org/us/dictionary/english/recap)|index_excerpt|verb / Business English MEETINGS|简短回顾已经讨论或发生的内容|
|[ALIGN — Cambridge Dictionary](https://dictionary.cambridge.org/us/dictionary/english/align)|index_excerpt|verb: STRAIGHT LINE / Business English|使目标、理解或安排彼此一致|
|[CONSENSUS — Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/consensus?topic=accepting-and-agreeing)|index_excerpt|noun: generally accepted opinion / Business English|团队对某个方向形成的普遍共识|
|[UNANIMITY — Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/unanimity)|index_excerpt|American Dictionary: complete agreement|所有成员完全同意。|
|[CONCERN — Cambridge Dictionary](https://dictionary.cambridge.org/us/dictionary/english/concern)|index_excerpt|noun: WORRY|值得注意或让人担心的事项|
|[OBJECTION — Cambridge Dictionary](https://dictionary.cambridge.org/us/dictionary/english/objection)|index_excerpt|noun / Business English|对提议明确表示反对的理由或意见|
|[RESERVATION — Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/reservation?q=reservations)|index_excerpt|noun: DOUBT|尚未消除的保留意见或疑虑|
|[RATIONALE — Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/rationale?topic=motives-and-reasons)|index_excerpt|noun: reasons explaining a decision|某项决定或方案背后的理由|

## 限制与待审
Cambridge均为index_excerpt，即使索引返回较长内容，也不冒称全文。agenda采用原站教学词汇表索引，直连404。align on priorities结合公开原句与抽象义理解，不称词典独立收录。词典支持词义/搭配；语用推进、句法拆解、现代记忆类比与自编场景由Writer负责，仍需独立Reviewer检验。concern未断言时间已证实不足；consensus不等于所有细节全体一致；objection无回应不等于正式批准；reservation不等于最终否决。Oxford Online English是独立教学机构，并非Oxford University Press。只参考一般教学方法，不复制课程全文。未写入私有资料、Notion、生产数据、代码、Git或调度；未新增IPA或词源声明。
