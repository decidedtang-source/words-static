import fs from 'node:fs';
import {chromium} from '@playwright/test';
import {pathToFileURL} from 'node:url';
const dir=process.cwd()+'/content/module-runs/front-50-20261116';
const browser=await chromium.launch({executablePath:process.env.LOCALAPPDATA+'/ms-playwright/chromium-1234/chrome-win64/chrome.exe'});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.addInitScript(()=>{Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},getVoices(){return [{localService:true,lang:'en-US'}];},speak(u){u.onstart?.();}}});window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};});
 await page.goto(pathToFileURL(dir+'/index.html').href);
 const missing=[];
 for(let i=0;i<50;i++){
  await page.selectOption('#wl-word',String(i));
  const links=await page.evaluate(()=>[...document.querySelectorAll('[data-go]')].map(e=>e.dataset.go).filter(id=>!document.getElementById('wl-'+(id==='context'?'source':id))));
  if(links.length)missing.push({i,links});
 }
 await page.selectOption('#wl-word','1');
 const before=await page.locator('#wl-top').boundingBox();await page.click('[data-pronounce]');
 const after=await page.locator('#wl-top').boundingBox();
 const pressed=await page.locator('[data-pronounce]').getAttribute('aria-pressed');
 const result={all50NavigationTargetsResolve:missing.length===0,missing,audioLayoutStable:before.height===after.height,audioWaveActive:pressed==='true',audioTestMode:'simulated local voice; actual installed voice not tested'};
 fs.writeFileSync(dir+'/interaction-check.json',JSON.stringify(result,null,2));console.log(result);
 await page.click('[data-pronounce]');
 await page.addStyleTag({content:'#words-layout-review .reader{height:auto!important;overflow:visible!important;padding-bottom:24px}#words-layout-review .bottom-nav{display:none!important}'});
 await page.screenshot({path:dir+'/capacity-mobile-full.png',fullPage:true});
 await page.selectOption('#wl-word','9');await page.screenshot({path:dir+'/verification-method-mobile-full.png',fullPage:true});
 if(missing.length||!result.audioLayoutStable||!result.audioWaveActive)process.exitCode=1;
}finally{await browser.close();}
