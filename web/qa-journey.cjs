const {JSDOM}=require('jsdom');
const fs=require('node:fs'),assert=require('node:assert/strict');
const wait=()=>new Promise(r=>setTimeout(r,30));
(async()=>{
 for(const locale of ['en','tr']){
 const w=new JSDOM('<div id="root"></div>',{url:`http://localhost/?locale=${locale}&language=python&journey=1`,runScripts:'dangerously',pretendToBeVisual:true}).window;
 w.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});w.HTMLElement.prototype.scrollIntoView=()=>{};
 w.eval(fs.readFileSync(__dirname+'/qa-fixture.js','utf8'));await wait();
 const before=JSON.stringify({...w.localStorage});
 const debug=[...w.document.querySelectorAll('button')].find(b=>b.textContent.includes('Debug Mission'));assert.ok(debug);debug.focus();debug.click();await wait();
 assert.ok(w.document.querySelector('[role=dialog]'));
 assert.ok(w.document.querySelector('[inert]'));
 w.document.querySelector('[role=dialog]').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await wait();
 assert.equal(w.document.querySelector('[role=dialog]'),null);assert.equal(w.document.querySelector('[inert]'),null);assert.equal(w.document.activeElement,debug);
 const check=[...w.document.querySelectorAll('button')].find(b=>b.textContent.includes(locale==='tr'?'Kısa kod keşfi':'Quick code check'));assert.ok(check);check.click();await wait();assert.ok(w.document.querySelector('#placement-title'));w.document.querySelector('[role=dialog]').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await wait();
 assert.equal(JSON.stringify({...w.localStorage}),before);w.close();console.log(locale+': Journey debug/placement coexistence, inert, focus return and unchanged storage passed');
 }
})().catch(e=>{console.error(e);process.exit(1)});
