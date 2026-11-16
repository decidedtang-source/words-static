# 词头生产 V2

输入：snapshot、verifiedIPA及automation.pronunciation。脚本按完整词形、词性及US/GB变体取得音标与对应音频。输出字段及依赖见production-v2.json。音标来源、音频URL与hash进入收据；无来源音频时使用原系统TTS。音波仅切换按钮状态，不增加可见提示或改变高度。

采集、AI接入与冻结命令见docs/roadmap/v10/FRONT_AUTOMATION_V2_GUIDE.md。V1文件保持原样，V2单独升级。
