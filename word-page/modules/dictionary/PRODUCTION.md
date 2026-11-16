# 完整词典接口 · 独立生产流程

版本：1.0.0。模块ID：dictionary。本模块字段以production.json为准。

只读原库存 → 原有投影 → 原接口；不抓取、不改写、不扩充词典。

输入：snapshot、inventory、senses、dictionaryURL。
依赖：无。

由 scripts/modules/cli.mjs 调用本目录 produce.mjs，保存独立 records、输入哈希、输出哈希、生产器/合同哈希与依赖输出哈希。改字段升接口版本，改生产逻辑升生产版本，改来源或内容生成新产物；旧冻结不覆盖。失败记录留存，不以空文字伪装完成。

QA检查归属、ID、引用、步骤与页面，不作语义评分。单独重建后须重新绑定实际受影响的下游依赖，再组装完整页。
