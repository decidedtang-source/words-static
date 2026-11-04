# 独立审核、退修与评分校准

三组交叉审核：第1组由第3组Writer审核，第2组由第1组Writer审核，第3组由第2组Writer审核，均未审核自己的正文。Root只修具体问题，不自行签独立批准。

- [第1组17词](review-1.md)
- [第2组17词](review-2.md)
- [第3组16词](review-3.md)
- [精确修订差异](revision-log.json)
- [独立评分校准审查](SCORING-CALIBRATION.md)
- [组1复判](CALIBRATION-1.md) · [组2复判](CALIBRATION-2.md) · [组3复判](CALIBRATION-3.md)
- [校准关闭记录](CALIBRATION-RESOLUTION.md)

初审在6个词上阻断了交付：priority的当前义与扩展义混合；dependency历史链接未直接支持更早来源；consensus辨析缺乏具体对照且重复；alternative把if夸大成only if；conclude以无that误判词义；proposal遗留范围说明与整页补充矛盾。另清理同类旧范围说明、reservation重复句与priority纯标点任务字段。修改后重新hash并由原独立Reviewer复读，不用改分代替修正文。

评分校准不是平均压分：汇总时发现相同5词正文被新审核者大幅提分，另有对形容词套用名词说明、把缺对照误扣为易读性的问题。独立校准员抽查11词、指出3/4锚点误用后，三组重新核对所有模块。初审`*-initial.json`和校准前`*-precalibration.json`保留；最终`reviews-N.json`/`whole-reviews-N.json`才参与当前封包。

机器完整性不能替代阅读：脚本可识别缺字段、纯标点任务、错误引用、自审、旧hash、低分，但教学解释是否有用仍需具体文本审查。构建报告的接受计数已修为复用真实门禁，不能因重复SUPPORTED记录或署名自审而虚报接受数。

评分为编辑尺度，不是学习效果测量或Owner认可。新版学习页面仍须Owner阅读；当前候选没有发布。
