# M07 · 场景原句与当前用法

## 目的与基准

从读者实际遇到的原句解释当前意义，场景不限项目工作。保持 `word-page/modules/scenario/` 与 `wl-source`，原句在Bridge前。M02与M03都读取本模块，不各自创造场景义。

## 输入和输出

输入EntrySnapshot＋ContextSource＋必要前后文＋义项库存。输出ContextUse：contextId、entryId、quote、translation、quoteType、sourceLabel/sourceUrl/sourceDate、context、targetSpans、keyMeaning、meaning、senseRefs／expressionExplanation、location、qualifiers、evidenceRefs。

quote保留原字节内容的独立哈希；展示允许安全转义，不在原文内加解释或替换词形。译文单独版本；重点span保存起止位置、实际文本与映射说明，不能用全局字符串替换误高亮。

## 判义顺序

先读完整原句和影响判断的前后文，再查精选／库存／专业资料。当前义由场景决定，不能由“前面哪个义最常见”决定。输出六类定位：selected、inventory_not_selected、new_source_sense、context_specific、whole_expression、unresolved；类别是解释路径，不能直接用空格或词长判定。

整条术语／固定表达先处理整体。自由组合可作有依据的组合解释，引用组成概念并标明这是组合解释，不能假装词典独立收录。仅有组件不能证明制度／专业特定义时继续补证或阻塞；不把“没有整体词目”机械判为所有组合都不可解释。

## 展示与限定

原句→中文→必要上下文／重点→当前义，全部在Bridge之前。顶部预览同源。保留否定、模态、条件、主体、时间、范围和原文／节选／教学构造身份。上下文只在不影响意义时折叠；影响肯定／否定或责任判断的内容直接可见。

词目不在原句逐字出现时，明确说明词形或语境映射；不得把词目补进原句制造匹配。段落截取有省略须保留可追溯位置；不能把聊天构造归给Paul Krugman或某期Episode。

场景义摘要要足够让右侧词义块有实际内容；不得将不确定解释写成明确结论后只在编辑报告加警告。无法可靠判义时停止该词后部生产，审阅目录显示阻塞，学习发布不纳入该条。

## 版本、下游与QA

任何quote／translation／meaning／qualifier／sense变化，触发M02、M03、M08、M09及相关QA失效；原学习ID不变。普通同义换措辞也须绑定新稿哈希，不能沿用旧语义pass。

QA `Q-C01`原句／出处／译文／高亮保真；`Q-C02`否定、条件、批准与承诺强度；`Q-C03`精选缺义、组件与整体、自由组合、未决场景；`Q-C04`M02/M03一致和场景在Bridge前。重点回归用已有absorb否定句、conditional approval与pending区别、government bond yield原句词形差异；此处只是指定未来检查条件，不生成新试样。
