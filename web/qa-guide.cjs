const {JSDOM}=require('jsdom');
const fs=require('node:fs'), assert=require('node:assert/strict');
const wait=()=>new Promise(r=>setTimeout(r,20));
(async()=>{
 for(const locale of ['en','tr']) for(const language of ['python','javascript']) {
  const w=new JSDOM('<div id="root"></div>',{url:`http://localhost/?locale=${locale}&language=${language}`,runScripts:'dangerously',pretendToBeVisual:true}).window;
  w.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
  const errors=[];w.addEventListener('error',e=>errors.push(e.message));
  w.eval(fs.readFileSync(__dirname+'/qa-fixture.js','utf8'));await wait();
  assert.equal(w.document.querySelectorAll('[role=status]').length,1);
  assert.equal(w.document.querySelector('[role=status]').getAttribute('aria-live'),'polite');
  const mascot=w.document.querySelector('img');assert.ok(mascot.src.endsWith('/mascot_happy.png'));assert.equal(mascot.parentElement.getAttribute('aria-hidden'),'true');
  assert.ok(w.document.querySelector('[role=status]').textContent.includes(locale==='tr'?'score = 4 ile başla':'Start with score = 4'));
  const before=JSON.stringify({...w.localStorage}), tr=locale==='tr';
  const click=async(label,double=false)=>{const b=[...w.document.querySelectorAll('button')].find(b=>b.textContent.trim()===label);assert.ok(b,label);assert.equal(b.disabled,false);b.click();if(double)b.click();await wait()};
  await click(tr?'Satır 1':'Line 1');assert.ok(w.document.querySelector('[role=status]'));
  await click(tr?'Satır 2':'Line 2',true);
  assert.ok(w.document.body.textContent.includes(tr?'Neden kuralı karşılamıyor?':'Why does it fail?'));
  await click(tr?'Değişkenin değeri yok.':'The variable has no value.');assert.ok(w.document.querySelector('[role=status]'));
  await click(tr?'Koşul score = 4 değerini dışlıyor.':'The condition excludes score = 4.',true);
  assert.equal([...w.document.querySelectorAll('button')].find(b=>b.textContent.includes(tr?'Durumları doğrula':'Verify cases')).disabled,true);
  for(const op of ['==','>']) {
   await click(op);await click(tr?'Durumları doğrula':'Verify cases',true);
   assert.ok(!w.document.body.textContent.includes(tr?'Üç durum eşleşti.':'All three cases match.'));
   await click(tr?'Başka düzeltme dene':'Try another fix');
  }
  assert.equal(w.document.querySelectorAll('[role=status]').length,1);
  await click('>=');await click(tr?'Durumları doğrula':'Verify cases',true);
  assert.ok(w.document.body.textContent.includes(tr?'Üç durum eşleşti.':'All three cases match.'));
  assert.equal(w.document.querySelectorAll('tbody tr').length,3);
  assert.equal(w.document.querySelectorAll('[role=status]').length,1);
  assert.equal(w.document.querySelectorAll('img').length,1);
  assert.equal(JSON.stringify({...w.localStorage}),before,'No progress/rewards/ratings/queue writes');
  // Keyboard wrap and exit; jsdom checks event/focus only, not visual layout.
  const buttons=[...w.document.querySelectorAll('button')];buttons.at(-1).focus();
  w.document.querySelector('section').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}));assert.equal(w.document.activeElement,buttons[0]);
  await click(tr?'Yolculuğa dön':'Back to journey');assert.equal(w.__closed,true);assert.deepEqual(errors,[]);w.close();
  console.log(`${locale}/${language}: wrong line/reason, two failing fixes, boundary verification, double-click, storage and keyboard passed`);
 }
 for(const mode of ['escape','exit','java']) {
  const w=new JSDOM('<div id="root"></div>',{url:`http://localhost/?language=${mode==='java'?'java':'python'}`,runScripts:'dangerously',pretendToBeVisual:true}).window;
  w.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});w.eval(fs.readFileSync(__dirname+'/qa-fixture.js','utf8'));await wait();
  if(mode==='java')assert.ok(w.document.body.textContent.includes('supports Python and JavaScript'));
  if(mode==='escape')w.document.querySelector('section').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
  else [...w.document.querySelectorAll('button')].find(b=>b.textContent==='Exit practice').click();
  assert.equal(w.__closed,true);w.close();console.log(mode+': passed');
 }
})().catch(e=>{console.error(e);process.exit(1)});
