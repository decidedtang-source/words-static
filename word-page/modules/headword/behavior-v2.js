    let speechToken=0,activeAudio=null;
    const speechAvailable='speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    function stopSpeech(){speechToken++;if(activeAudio){activeAudio.pause();activeAudio=null;}if(speechAvailable)window.speechSynthesis.cancel();}
    function pronounce(){
      const button=root.querySelector('[data-pronounce]'),status=root.querySelector('#wl-pronunciation-status');
      const stopping=button.getAttribute('aria-pressed')==='true';stopSpeech();button.setAttribute('aria-pressed','false');status.textContent='';
      if(stopping)return;
      const token=speechToken,w=data[Number(wordSelect.value)],finish=message=>{if(token!==speechToken)return;button.setAttribute('aria-pressed','false');status.textContent=message||'';button.dataset.error=String(Boolean(message));};
      const start=()=>{if(token===speechToken){button.setAttribute('aria-pressed','true');button.dataset.error='false';status.textContent='正在朗读 '+w.word;}};
      const fallback=()=>{
        if(token!==speechToken)return;if(!speechAvailable){finish('当前浏览器无法播放发音');return;}
        const voice=window.speechSynthesis.getVoices().find(v=>v.localService&&v.lang.toLowerCase()===w.pronunciationLang.toLowerCase());
        if(!voice){finish('暂无对应的本机英语语音');return;}
        const utterance=new SpeechSynthesisUtterance(w.word);utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=.9;utterance.onstart=start;utterance.onend=()=>finish('');utterance.onerror=()=>finish('发音未完成');
        try{start();window.speechSynthesis.speak(utterance);}catch{finish('发音暂不可用');}
      };
      if(w.audioData){
        const audio=new Audio(w.audioData);activeAudio=audio;let failed=false;
        const fail=()=>{if(failed)return;failed=true;if(token===speechToken){audio.pause();activeAudio=null;fallback();}};
        audio.onplaying=start;audio.onended=()=>finish('');audio.onerror=fail;
        try{start();const playing=audio.play();if(playing?.catch)playing.catch(fail);}catch{fail();}
      }else fallback();
    }
