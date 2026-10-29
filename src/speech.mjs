export class Speech{
 constructor({synth=globalThis.speechSynthesis,Utterance=globalThis.SpeechSynthesisUtterance,onChange=()=>{},onEvent=()=>{}}={}){this.synth=synth;this.Utterance=Utterance;this.onChange=onChange;this.onEvent=onEvent;this.preference='';this.rate=1;this.allowNetwork=false;this.seen=new Set();this.status='loading';this.listener=()=>this.detect();synth?.addEventListener('voiceschanged',this.listener);this.detect();this.timer=setTimeout(()=>{if(!this.voices.length)this.detect()},3000);this.timer.unref?.()}
 detect(){const available=this.synth?.getVoices()||[];const english=available.filter(v=>/^en(?:[-_]|$)/i.test(v.lang));this.localCount=english.filter(v=>v.localService===true).length;this.englishCount=english.length;this.voices=english.filter(v=>v.localService===true||this.allowNetwork).sort((a,b)=>Number(b.localService===true)-Number(a.localService===true));this.status=!(this.synth&&this.Utterance)?'unsupported':this.voices.length?'ready':this.allowNetwork?'default':'unavailable';this.onChange(this);return this.voices}
 stop(){this.generation=(this.generation||0)+1;this.synth?.cancel();if(this.status==='speaking')this.status='ready';this.onChange(this)}
 play(text,target='term'){this.stop();this.detect();const voice=this.voices.find(v=>v.voiceURI===this.preference)||this.voices.find(v=>/^en-US$/i.test(v.lang))||this.voices[0];if(!this.synth||!this.Utterance||(!voice&&!this.allowNetwork)){this.onChange(this);return false}
  const generation=this.generation;const u=new this.Utterance(text);if(voice)u.voice=voice;u.lang=voice?.lang?.replace('_','-')||'en-US';u.rate=this.rate;this.status='speaking';this.onChange(this);this.onEvent('pronunciation_requested',target);
  u.onend=()=>{if(generation!==this.generation)return;this.status='ready';this.onChange(this);this.onEvent('pronunciation_finished',target)};
  u.onerror=()=>{if(generation!==this.generation)return;this.status='error';this.onChange(this);this.onEvent('pronunciation_failed',target)};
  try{this.synth.speak(u);return true}catch{u.onerror();return false}
 }
 reveal(round,text){if(this.seen.has(round))return false;this.seen.add(round);return this.play(text)}
 destroy(){clearTimeout(this.timer);this.stop();this.synth?.removeEventListener('voiceschanged',this.listener)}
}
