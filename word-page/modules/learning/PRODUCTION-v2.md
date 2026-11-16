# 学习义项生产 V2

输入：原selection/senses/sources及automation.examples、taskHash。保留现有定义；WordNet与Cambridge原英文候选由脚本读取，AI回传候选ID与中文译文。英文不接受AI覆盖。学习义项缺少适用来源例句时保留明确标注的原创教学补充。

来源例句与中文整理独立标记，当前义项必须有对应senseId、英文、中文。输出合同见production-v2.json，流程见docs/roadmap/v10/FRONT_AUTOMATION_V2_GUIDE.md。完整词典不随本模块改变。
