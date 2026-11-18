export class Speech{
 constructor({synth=globalThis.speechSynthesis,Utterance=globalThis.SpeechSynthesisUtterance,onChange=()=>{},onEvent=()=>{}}={}){this.synth=synth;this.Utterance=Utterance;this.onChange=onChange;this.onEvent=onEvent;this.preference='';this.rate=1;this.allowNetwork=false;this.seen=new Set();this.status='loading';this.listener=()=>this.detect();synth?.addEventListener('voiceschanged',this.listener);this.detect();this.timer=setTimeout(()=>{if(!this.voices.length)this.detect()},3000);this.timer.unref?.()}
 detect(){const available=this.synth?.getVoices()||[];const english=available.filter(v=>/^en(?:[-_]|$)/i.test(v.lang));this.localCount=english.filter(v=>v.localService===true).length;this.englishCount=english.length;this.voices=english.filter(v=>v.localService===true||this.allowNetwork).sort((a,b)=>Number(b.localService===true)-Number(a.localService===true));this.status=!(this.synth&&this.Utterance)?'unsupported':this.voices.length?'ready':this.allowNetwork?'default':'unavailable';this.onChange(this);return this.voices}
 stop(){this.generation=(this.generation||0)+1;clearTimeout(this.sequenceTimer);this.synth?.cancel();if(this.status==='speaking')this.status='ready';this.onChange(this)}
 play(text,target='term'){return this.playSequence([{text,target}],0)}
 playSequence(items,gap=500){this.stop();const generation=this.generation;const pending=items.filter(item=>typeof item.text==='string'&&item.text.trim());if(!pending.length)return false;const next=()=>{if(generation!==this.generation)return false;const item=pending.shift();return this.speakItem(item.text,item.target||'term',generation,()=>{if(!pending.length)return;if(gap>0)this.sequenceTimer=setTimeout(next,gap);else next()})};return next()}
 speakItem(text,target,generation,finished){this.detect();const voice=this.voices.find(v=>v.voiceURI===this.preference)||this.voices.find(v=>/^en-US$/i.test(v.lang))||this.voices[0];if(!this.synth||!this.Utterance||(!voice&&!this.allowNetwork)){this.onChange(this);return false}
  const u=new this.Utterance(text);if(voice)u.voice=voice;u.lang=voice?.lang?.replace('_','-')||'en-US';u.rate=this.rate;this.status='speaking';this.onChange(this);this.onEvent('pronunciation_requested',target);
  let settled=false;u.onend=()=>{if(settled||generation!==this.generation)return;settled=true;this.status='ready';this.onChange(this);this.onEvent('pronunciation_finished',target);finished?.()};
  u.onerror=()=>{if(settled||generation!==this.generation)return;settled=true;this.status='error';this.onChange(this);this.onEvent('pronunciation_failed',target)};
  try{this.synth.speak(u);return true}catch{u.onerror();return false}
 }
 reveal(round,text){if(this.seen.has(round))return false;this.seen.add(round);return this.play(text)}
 destroy(){clearTimeout(this.timer);this.stop();this.synth?.removeEventListener('voiceschanged',this.listener)}
}
