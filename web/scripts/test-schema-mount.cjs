const { JSDOM } = require('/workspace/scratch/cd71ff465b23/rheo-retry-delivery/qa-runtime/node_modules/jsdom')
const fs=require('node:fs'),assert=require('node:assert/strict')
;(async()=>{
const w=new JSDOM('<div id="root"></div>',{url:'http://localhost/',runScripts:'dangerously',pretendToBeVisual:true}).window
w.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}})
const errors=[];w.addEventListener('error',e=>errors.push(e.message))
w.eval(fs.readFileSync(process.argv[2],'utf8'))
const wait=()=>new Promise(r=>setTimeout(r,30))
assert.equal(w.cards.length,55)
for(let i=0;i<w.cards.length;i++){
 w.mountCard(i);await wait()
 const ex=w.cards[i],button=[...w.document.querySelectorAll('button')].find(b=>b.textContent.includes(ex.options[ex.correct].label))
 assert.ok(button,`card${i} correct label rendered`);button.click();await wait()
 assert.ok(w.document.body.textContent.includes(ex.explanation),`card${i} explanation visible`)
}
assert.deepEqual(errors,[])
w.close();console.log('55 complexity cards mounted and answered in React/jsdom; no uncaught render errors. Not visual/device QA.')
})().catch(e=>{console.error(e);process.exitCode=1})
