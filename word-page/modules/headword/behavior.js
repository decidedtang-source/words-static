    let speechToken=0;
    const speechAvailable='speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    function stopSpeech(){speechToken++;if(speechAvailable)window.speechSynthesis.cancel();}
    function pronounce(){
      const button=root.querySelector('[data-pronounce]'),status=root.querySelector('#wl-pronunciation-status');
      if(!speechAvailable)return;
      const stopping=button.getAttribute('aria-pressed')==='true';
      stopSpeech();button.setAttribute('aria-pressed','false');
      button.dataset.error='false';button.title='发音';
      if(stopping){status.textContent='';return;}
      const voices=window.speechSynthesis.getVoices().filter(v=>v.localService&&/^en[-_]/i.test(v.lang));
      const voice=voices.find(v=>/^en[-_]US$/i.test(v.lang));
      if(!voice){status.textContent='暂无本机美式英语语音，请安装后重试。';button.title=status.textContent;button.dataset.error='true';return;}
      const token=speechToken,word=data[Number(wordSelect.value)].word;
      const utterance=new SpeechSynthesisUtterance(word);utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=.9;
      const finish=message=>{if(token!==speechToken)return;button.setAttribute('aria-pressed','false');status.textContent=message;button.title=message||'发音';button.dataset.error=String(Boolean(message));};
      utterance.onstart=()=>{if(token===speechToken){button.setAttribute('aria-pressed','true');status.textContent='正在朗读 '+word;}};
      utterance.onend=()=>finish('');utterance.onerror=()=>finish('发音未完成，请重试。');
      button.setAttribute('aria-pressed','true');status.textContent='正在准备发音…';
      try{window.speechSynthesis.speak(utterance);}catch(e){finish('发音暂不可用，请重试。');}
    }
