export function produce({snapshot:s,automation:a}){
 const p=a.pronunciation;
 return {status:'ready',data:{word:s.term,ipa:p.ipa,pos:s.originalPOS,ipaSource:p.provider,pronunciationLang:p.variety==='GB'?'en-GB':'en-US',audioData:p.audio?'data:'+p.audio.mime+';base64,'+p.audio.base64:null,audioSourceURL:p.audio?.url||null},provenance:{provider:p.provider,url:p.url,sourceHash:p.sourceHash||null,pronunciationMode:p.audio?'source_recording':'system_tts'}};
}
