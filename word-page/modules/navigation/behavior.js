    function go(id){
      if(id==='context')id='source';
      const el=root.querySelector('#wl-'+id);if(!el)return;
      if(id==='dictionary'||id==='top-source')el.open=true;
      const top=id==='top'?0:el.getBoundingClientRect().top-reader.getBoundingClientRect().top+reader.scrollTop-18;
      reader.scrollTo({top:Math.max(0,top),behavior:'auto'});viewSelect.value=id;updateNav();
    }
    function updateNav(){
      const desktop=frame.dataset.device==='desktop'&&frame.clientWidth>600;
      const overview=root.querySelector('.overview');
      bottom.hidden=desktop||!overview||overview.getBoundingClientRect().bottom>reader.getBoundingClientRect().top;
      let active='top';
      for(const id of ['common','history','source','bridge','deep']){const el=root.querySelector('#wl-'+id);if(el&&el.getBoundingClientRect().top<=reader.getBoundingClientRect().top+80)active=id;}
      root.querySelectorAll('.side button,.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.go===active||(['source','deep'].includes(active)&&b.dataset.go==='context')));
    }
