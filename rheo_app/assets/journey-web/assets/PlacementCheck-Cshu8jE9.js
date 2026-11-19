import{r,j as e}from"./vendor-react-BUwNS7rP.js";import{t as n,am as S}from"./index-Bo0dDUmJ.js";import"./vendor-motion-BLsFjOXQ.js";const g={python:[`x = 2
x = x + 3
print(x)`,`x = 3
if x > 5:
    print("A")
else:
    print("B")`,`total = 0
for n in [1, 2, 3]:
    total += n
print(total)`],javascript:[`let x = 2;
x = x + 3;
console.log(x);`,`const x = 3;
if (x > 5) {
  console.log("A");
} else {
  console.log("B");
}`,`let total = 0;
for (const n of [1, 2, 3]) {
  total += n;
}
console.log(total);`],java:[`int x = 2;
x = x + 3;
System.out.println(x);`,`int x = 3;
if (x > 5) {
    System.out.println("A");
} else {
    System.out.println("B");
}`,`int total = 0;
for (int n : new int[]{1, 2, 3}) {
    total += n;
}
System.out.println(total);`]};function C(s){if(!g[s])throw new Error("Unsupported placement language");return[{topic:"variables",code:g[s][0],options:["2","5","3"],correct:1,explanation:"x starts at 2. Adding 3 leaves x at 5."},{topic:"conditionals",code:g[s][1],options:["A","B","A and B"],correct:1,explanation:"3 is not greater than 5, so only the else branch runs."},{topic:"loops",code:g[s][2],options:["3","123","6"],correct:2,explanation:"The loop adds 1, then 2, then 3: the total is 6."}]}function E(s,o){const i=s.filter((d,l)=>Number.isInteger(o[l])&&o[l]===d.correct).length,a=s.filter((d,l)=>Number.isInteger(o[l])&&o[l]>=0&&o[l]<d.options.length).length,x=s.find((d,l)=>o[l]!==d.correct);return{correctCount:i,answeredCount:a,total:s.length,topic:(x==null?void 0:x.topic)||"mixed"}}const T={variables:"Trace how a variable changes, one line at a time.",conditionals:"Practise which branch runs and why.",loops:"Track the total after each loop iteration.",mixed:"Try a longer trace with more than one concept."};function F({language:s,onClose:o}){const[i]=r.useState(()=>C(s)),[a,x]=r.useState(-1),[d,l]=r.useState([]),[u,N]=r.useState(void 0),p=r.useRef(void 0),j=r.useRef(null),v=r.useRef(null);r.useEffect(()=>{const t=document.activeElement;return()=>{t==null||t.focus()}},[]),r.useEffect(()=>{var t;(t=j.current)==null||t.focus()},[a]);const y=a===i.length,h=i[a],w=t=>{p.current===void 0&&(p.current=t,N(t),l(c=>[...c,t]))},k=()=>{p.current!==void 0&&(p.current=void 0,N(void 0),x(t=>t+1))},m=y?E(i,d):null;return e.jsxs("section",{ref:v,role:"dialog","aria-modal":"true","aria-labelledby":"placement-title",onKeyDown:t=>{if(t.key==="Escape"){t.preventDefault(),o();return}if(t.key!=="Tab")return;const c=[...v.current.querySelectorAll("button:not(:disabled)")],f=c[0],b=c.at(-1);t.shiftKey&&(document.activeElement===f||document.activeElement===j.current)?(t.preventDefault(),b==null||b.focus()):!t.shiftKey&&document.activeElement===b&&(t.preventDefault(),f==null||f.focus())},className:"fixed inset-0 z-[300] flex flex-col bg-slate-950 text-white",children:[e.jsxs("header",{className:"flex justify-between items-center px-5 py-4 border-b border-slate-800",style:{paddingTop:"max(16px, env(safe-area-inset-top))"},children:[e.jsxs("span",{className:"text-sm font-bold text-teal-300",children:[n("Quick code check")," · ",s]}),e.jsx("button",{onClick:o,className:"px-3 py-2 rounded-lg text-sm text-slate-300",children:n("Skip for now")})]}),e.jsx("div",{className:"flex-1 overflow-y-auto px-5 py-6",children:e.jsxs("div",{className:"max-w-md mx-auto space-y-5",children:[e.jsx(S,{size:72,mood:"thinking",showGlow:!1}),e.jsx("h1",{id:"placement-title",ref:j,tabIndex:-1,className:"text-2xl font-bold outline-none",children:n(a<0?"Find your next practice":y?"Suggested practice":"What does this print?")}),a<0?e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"text-slate-300 leading-relaxed",children:n("Three short questions. No timer, no hearts, no rewards.")}),e.jsx("p",{className:"text-sm text-slate-400",children:n("This is a small sample, not a level certificate. Your journey stays unchanged.")}),e.jsx("button",{onClick:()=>x(0),className:"w-full min-h-12 rounded-xl bg-teal-400 text-slate-950 font-bold",children:n("Try 3 questions")})]}):y?e.jsxs(e.Fragment,{children:[e.jsxs("p",{className:"text-sm text-slate-400",children:[n("Answered"),": ",m.answeredCount,"/",m.total," · ",n("Correct"),": ",m.correctCount,"/",m.total]}),e.jsx("p",{className:"text-lg leading-relaxed text-teal-200",children:n(T[m.topic])}),e.jsx("p",{className:"text-sm text-slate-400",children:n("This is a small sample, not a level certificate. Your journey stays unchanged.")}),e.jsx("button",{onClick:o,className:"w-full min-h-12 rounded-xl bg-teal-400 text-slate-950 font-bold",children:n("Back to journey")})]}):e.jsxs(e.Fragment,{children:[e.jsxs("p",{className:"text-xs text-slate-400",children:[a+1,"/",i.length," · ",n("No timer")]}),s==="java"&&e.jsx("p",{className:"text-xs text-slate-400",children:n("Java snippet runs inside main().")}),e.jsx("pre",{className:"font-mono text-sm leading-6 bg-slate-900 rounded-2xl p-4 overflow-x-auto","aria-label":n("Question code"),children:h.code}),e.jsxs("div",{className:"flex flex-col gap-3",children:[h.options.map((t,c)=>e.jsx("button",{disabled:u!==void 0,onClick:()=>w(c),className:`min-h-12 rounded-xl px-4 py-3 border text-left font-mono ${u===c?"border-teal-300 bg-teal-500/15":"border-slate-700 bg-slate-900"}`,children:t},c)),u===void 0&&e.jsx("button",{onClick:()=>w(null),className:"min-h-12 rounded-xl text-sm text-slate-400",children:n("Not sure yet")})]}),u!==void 0&&e.jsxs("div",{role:"status",className:"rounded-xl bg-slate-900 p-4 space-y-3",children:[e.jsx("p",{className:"font-bold text-teal-200",children:u===h.correct?n("Correct!"):n("Let’s trace it together.")}),e.jsx("p",{className:"text-sm leading-relaxed text-slate-300",children:n(h.explanation)}),e.jsx("button",{onClick:k,className:"w-full min-h-12 rounded-xl bg-teal-400 text-slate-950 font-bold",children:n(a===i.length-1?"See suggestion":"CONTINUE")})]})]})]})})]})}export{F as default};
