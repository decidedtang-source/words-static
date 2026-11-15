const {chromium}=require('@playwright/test');
const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
(async()=>{
 const tmp=path.resolve(__dirname,'pdf-parts');fs.mkdirSync(tmp,{recursive:true});
 const executablePath=process.env.CHROMIUM_PATH||(fs.existsSync('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe')?'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe':undefined);
 const browser=await chromium.launch({executablePath});
 try{
  const page=await browser.newPage({viewport:{width:390,height:900},deviceScaleFactor:2});
  await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
  await page.emulateMedia({media:'screen',colorScheme:'light'});
  await page.addStyleTag({content:`
   html,body{margin:0!important;padding:0!important;background:#fffdf8!important}
   body>.version,body>noscript,#words-layout-review .review-controls{display:none!important}
   #words-layout-review{width:390px!important;margin:0!important}
   #words-layout-review .frame{width:390px!important;max-width:390px!important;margin:0!important;box-shadow:none!important}
   #words-layout-review .reader{height:auto!important;overflow:visible!important;padding-bottom:16px!important}
   *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
   @page{margin:0}
  `});
  const results=[];
  for(const [i,word]of ['scope','leverage','absorb'].entries()){
   await page.locator('#wl-word').selectOption(String(i),{force:true});
   await page.locator('#wl-device').selectOption('phone',{force:true});
   await page.evaluate(()=>document.fonts.ready);
   const metrics=await page.locator('.frame').evaluate(el=>({height:Math.ceil(el.getBoundingClientRect().height),width:el.getBoundingClientRect().width,overflow:document.documentElement.scrollWidth>390,openDetails:document.querySelectorAll('details[open]').length}));
   if(metrics.overflow||metrics.openDetails)throw Error(JSON.stringify(metrics));
   await page.pdf({path:path.join(tmp,word+'.pdf'),width:'390px',height:(metrics.height+2)+'px',margin:{top:0,bottom:0,left:0,right:0},printBackground:true,displayHeaderFooter:false,scale:1,tagged:true});
   await page.locator('.frame').screenshot({path:path.join(tmp,word+'.png')});
   results.push({word,...metrics});
   await page.locator('#wl-bridge-history').evaluate(el=>el.open=true);
   const expandedHeight=await page.locator('.frame').evaluate(el=>Math.ceil(el.getBoundingClientRect().height));
   await page.pdf({path:path.join(tmp,word+'-expanded.pdf'),width:'390px',height:(expandedHeight+2)+'px',margin:{top:0,bottom:0,left:0,right:0},printBackground:true,scale:1,tagged:true});
  }
  fs.writeFileSync(path.join(tmp,'checks.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
