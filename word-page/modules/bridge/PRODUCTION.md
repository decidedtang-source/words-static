# Bridge现代与历史联系 · 独立生产流程

版本：1.0.0。模块ID：bridge。本模块字段以production.json为准。

精选义/当前场景义/普通词史 → 现代联系正文 + 独立折叠历史联系 → 回看准确义项。历史联系是编辑衔接，不复制整段词史，不强造历史因果。

输入：selection、senses、bridge。
依赖：learning、history、scenario。

由 scripts/modules/cli.mjs 调用本目录 produce.mjs，保存独立 records、输入哈希、输出哈希、生产器/合同哈希与依赖输出哈希。改字段升接口版本，改生产逻辑升生产版本，改来源或内容生成新产物；旧冻结不覆盖。失败记录留存，不以空文字伪装完成。

QA检查归属、ID、引用、步骤与页面，不作语义评分。单独重建后须重新绑定实际受影响的下游依赖，再组装完整页。
