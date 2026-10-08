/* ══════════════════════════════════════════════════════════════════
   JAVASCRIPT DUEL QUESTIONS — 80+ questions across 3 difficulty levels
   Sources: Stanford CS106A, Harvard CS50W, MDN, ECMA spec edge cases
   ══════════════════════════════════════════════════════════════════ */
export const javascriptQuestions = [

    /* ╔══════════════════════════════════════════════════════════════╗
       ║  DIFFICULTY 1 — Fundamentals (ELO < 1200)                  ║
       ╚══════════════════════════════════════════════════════════════╝ */

    // ── Types & Basics ──
    { difficulty: 1, type: 'mcq', text: 'typeof "hello" returns?', options: ['"text"', '"string"', '"String"', '"char"'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: 'Which declares a constant?', options: ['var x=5', 'let x=5', 'const x=5', 'fixed x=5'], correct: 2 },
    { difficulty: 1, type: 'mcq', text: '[1,2,3].length returns?', options: ['2', '3', '4', 'undefined'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: '"Hello".toUpperCase() returns?', options: ['"hello"', '"HELLO"', '"Hello"', 'Error'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: 'Math.floor(4.7) returns?', options: ['5', '4', '4.7', 'NaN'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: 'What is undefined in JS?', options: ['A string', 'Default value for uninitialized vars', 'Same as null', 'An error'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: 'Array.isArray([1,2]) returns?', options: ['true', 'false', '"array"', 'Error'], correct: 0 },
    { difficulty: 1, type: 'mcq', text: 'What does parseInt("42px") return?', options: ['NaN', '42', '"42"', 'Error'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: '"abc".includes("b") returns?', options: ['true', 'false', '1', 'Error'], correct: 0 },
    { difficulty: 1, type: 'mcq', text: 'What does isNaN("hello") return?', options: ['true', 'false', '"NaN"', 'Error'], correct: 0 },

    // ── Trace ──
    { difficulty: 1, type: 'trace', text: 'Output?', code: 'let x = 10;\\nif (x > 5) x = x * 2;\\nconsole.log(x);', options: ['10', '20', '5', 'undefined'], correct: 1 },
    { difficulty: 1, type: 'trace', text: 'What is logged?', code: 'let sum = 0;\\nfor (let i=1; i<=3; i++) sum += i;\\nconsole.log(sum);', options: ['3', '6', '10', '1'], correct: 1 },
    { difficulty: 1, type: 'trace', text: 'Output?', code: 'const arr = [1, 2, 3];\\narr.push(4);\\nconsole.log(arr.length);', options: ['3', '4', '5', 'Error'], correct: 1 },
    { difficulty: 1, type: 'trace', text: 'What is logged?', code: 'let a = "5";\\nlet b = 3;\\nconsole.log(a + b);', options: ['8', '"53"', '"8"', 'NaN'], correct: 1 },
    { difficulty: 1, type: 'trace', text: 'Output?', code: 'const obj = {name: "Ali"};\\nconsole.log(obj.age);', options: ['null', 'undefined', 'Error', '""'], correct: 1 },

    // ── Debug ──
    { difficulty: 1, type: 'debug', text: 'Which line has the bug?', code: 'const name = "Alice";\\nconsole.log("Hi " + Name);', options: ['Line 1', 'Line 2 (Name ≠ name)', 'Both', 'No bug'], correct: 1 },
    { difficulty: 1, type: 'debug', text: 'Why does this error?', code: 'let x;\\nconsole.log(x.toString());', options: ['x is NaN', 'x is undefined, no toString()', 'toString wrong', 'No error'], correct: 1 },

    // ── Complete ──
    { difficulty: 1, type: 'complete', text: 'Fill the blank', code: 'const nums = [1,2,3];\\nnums.___(4);', options: ['add', 'push', 'append', 'insert'], correct: 1 },
    { difficulty: 1, type: 'complete', text: 'Fill the blank', code: 'function greet(name) {\\n  ___ `Hello, ${name}!`;\\n}', options: ['print', 'return', 'yield', 'echo'], correct: 1 },
    { difficulty: 1, type: 'complete', text: 'Fill the blank', code: 'const doubled = nums.___(x => x * 2);', options: ['filter', 'map', 'reduce', 'forEach'], correct: 1 },

    /* ╔══════════════════════════════════════════════════════════════╗
       ║  DIFFICULTY 2 — Intermediate (ELO 1200-1600)               ║
       ╚══════════════════════════════════════════════════════════════╝ */

    // ── MCQ — JS Quirks & Gotchas ──
    { difficulty: 2, type: 'mcq', text: 'typeof null returns?', options: ['"null"', '"object"', '"undefined"', '"NaN"'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'NaN === NaN evaluates to?', options: ['true', 'false', 'NaN', 'Error'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'How to properly check for NaN?', options: ['x === NaN', 'Number.isNaN(x)', 'x == NaN', 'typeof x === "NaN"'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: '[1,2] + [3,4] returns?', options: ['[1,2,3,4]', '"1,23,4"', '[4,6]', 'Error'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: '0 == "" evaluates to?', options: ['true', 'false', 'Error', 'undefined'], correct: 0 },
    { difficulty: 2, type: 'mcq', text: '0 === "" evaluates to?', options: ['true', 'false', 'Error', 'undefined'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'Object.freeze(obj) does what?', options: ['Deep clone', 'Prevents adding/modifying top-level props', 'Deletes obj', 'Makes recursive immutable'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'What is void 0?', options: ['0', 'null', 'undefined', 'NaN'], correct: 2 },
    { difficulty: 2, type: 'mcq', text: '"5" - 3 returns?', options: ['"53"', '2', 'NaN', 'Error'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: '"5" + 3 returns?', options: ['8', '"53"', 'NaN', 'Error'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'What does !![] evaluate to?', options: ['true', 'false', '[]', 'Error'], correct: 0 },
    { difficulty: 2, type: 'mcq', text: 'let vs var: key difference?', options: ['Same thing', 'let is block-scoped, var is function-scoped', 'var is block-scoped', 'let is global'], correct: 1 },

    // ── Trace — Event loop, coercion, references ──
    { difficulty: 2, type: 'trace', text: 'What does this log?', code: 'let x = 1;\\nsetTimeout(() => console.log(x), 0);\\nx = 2;\\nconsole.log(x);', options: ['1 then 2', '2 then 2', '2 then 1', '1 then 1'], correct: 1 },
    { difficulty: 2, type: 'trace', text: 'Output?', code: 'const a = [1,2,3];\\nconst b = a;\\nb[0] = 99;\\nconsole.log(a[0]);', options: ['1', '99', 'undefined', 'Error'], correct: 1 },
    { difficulty: 2, type: 'trace', text: 'Output?', code: 'console.log(1 + "2" + 3);', options: ['6', '"123"', '"33"', 'NaN'], correct: 1 },
    { difficulty: 2, type: 'trace', text: 'Output?', code: 'let a = {x:1};\\nlet b = {x:1};\\nconsole.log(a === b);', options: ['true', 'false', 'Error', 'undefined'], correct: 1 },
    { difficulty: 2, type: 'trace', text: 'Output?', code: 'const arr = [1,2,3];\\nconst [x, ...rest] = arr;\\nconsole.log(rest);', options: ['[2,3]', '[1,2,3]', '3', 'Error'], correct: 0 },
    { difficulty: 2, type: 'trace', text: 'What is logged?', code: 'let i = 0;\\nwhile (i < 3) {\\n  i++;\\n}\\nconsole.log(i);', options: ['2', '3', '4', 'undefined'], correct: 1 },
    { difficulty: 2, type: 'trace', text: 'Output?', code: 'console.log(typeof typeof 42);', options: ['"number"', '"string"', '"typeof"', 'Error'], correct: 1 },
    { difficulty: 2, type: 'trace', text: 'What does this return?', code: '[10,9,8].sort().toString()', options: ['"8,9,10"', '"10,8,9"', '"10,9,8"', 'Error'], correct: 1 },

    // ── Debug ──
    { difficulty: 2, type: 'debug', text: 'Which line has the bug?', code: 'const items = [1, 2, 3];\\nitems = [4, 5];', options: ['Line 1', 'Line 2 (const reassignment)', 'Both', 'No bug'], correct: 1 },
    { difficulty: 2, type: 'debug', text: 'Why does this log undefined?', code: 'function add(a, b) {\\n  return\\n    a + b;\\n}\\nconsole.log(add(1,2));', options: ['Wrong syntax', 'ASI inserts ; after return', 'Math error', 'No bug'], correct: 1 },
    { difficulty: 2, type: 'debug', text: 'Silent bug in this code?', code: 'const obj = {a: 1, b: 2};\\nconsole.log(obj.c);', options: ['Line 1', 'Line 2 (undefined, not error)', 'Both', 'No bug (but prints undefined)'], correct: 3 },
    { difficulty: 2, type: 'debug', text: 'What is wrong here?', code: '[10, 9, 1, 2, 100].sort()\\n// Expected: [1,2,9,10,100]', options: ['Nothing wrong', 'Default sort is lexicographic, not numeric', 'sort is unstable', 'Array too small'], correct: 1 },

    // ── Complete ──
    { difficulty: 2, type: 'complete', text: 'Arrow function syntax', code: 'const double = (x) ___ x * 2;', options: [':', '=>', '->', '='], correct: 1 },
    { difficulty: 2, type: 'complete', text: 'Destructure an object', code: 'const {name, ___} = person;', options: ['...rest', 'other', '*rest', '&rest'], correct: 0 },

    // ── Algo ──
    { difficulty: 2, type: 'algo', text: 'arr.indexOf(x) complexity?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correct: 1 },
    { difficulty: 2, type: 'algo', text: 'Map.get(key) average complexity?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correct: 0 },
    { difficulty: 2, type: 'algo', text: 'arr.filter().map() combined complexity?', code: 'arr.filter(x => x > 0).map(x => x * 2)', options: ['O(n)', 'O(2n) = O(n)', 'O(n²)', 'O(n log n)'], correct: 1 },
    { difficulty: 2, type: 'algo', text: 'Object.keys(obj) complexity?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correct: 1 },

    /* ╔══════════════════════════════════════════════════════════════╗
       ║  DIFFICULTY 3 — Advanced (ELO > 1600)                      ║
       ╚══════════════════════════════════════════════════════════════╝ */

    // ── MCQ — Deep JS knowledge ──
    { difficulty: 3, type: 'mcq', text: '[...new Set([1,2,2,3,1])] returns?', options: ['[1,2,3]', '[1,2,2,3,1]', 'Set{1,2,3}', 'Error'], correct: 0 },
    { difficulty: 3, type: 'mcq', text: '({}+[]) evaluates to?', options: ['"[object Object]"', '0', 'NaN', '""'], correct: 0 },
    { difficulty: 3, type: 'mcq', text: 'What is a WeakMap used for?', options: ['Faster lookups', 'Keys are weakly held (GC-friendly)', 'Ordered map', 'Immutable map'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'What does Symbol.iterator enable?', options: ['Async ops', 'Custom for...of behavior', 'Type checking', 'Error handling'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'Temporal Dead Zone (TDZ) applies to?', options: ['var only', 'let and const', 'function declarations', 'All variables'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'What is the output: +[] ?', options: ['NaN', '0', '""', 'Error'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'structuredClone() vs JSON.parse(JSON.stringify())?', options: ['Same thing', 'structuredClone handles circular refs, Date, Map, Set', 'JSON is better', 'structuredClone is slower always'], correct: 1 },

    // ── Trace — Closures, promises, prototypes ──
    { difficulty: 3, type: 'trace', text: 'Output? (Classic var closure trap)', code: 'for (var i=0; i<3; i++) {\\n  setTimeout(()=>console.log(i), 0);\\n}', options: ['0 1 2', '3 3 3', '0 0 0', 'Error'], correct: 1 },
    { difficulty: 3, type: 'trace', text: 'And with let?', code: 'for (let i=0; i<3; i++) {\\n  setTimeout(()=>console.log(i), 0);\\n}', options: ['0 1 2', '3 3 3', '0 0 0', 'Error'], correct: 0 },
    { difficulty: 3, type: 'trace', text: 'Execution order?', code: 'console.log("1");\\nsetTimeout(()=>console.log("2"),0);\\nPromise.resolve().then(()=>console.log("3"));\\nconsole.log("4");', options: ['1 2 3 4', '1 4 3 2', '1 4 2 3', '1 3 4 2'], correct: 1 },
    { difficulty: 3, type: 'trace', text: 'Output?', code: 'async function foo() { return 1; }\\nconsole.log(typeof foo());', options: ['"number"', '"object"', '"promise"', '"undefined"'], correct: 1 },
    { difficulty: 3, type: 'trace', text: 'Promise chain result?', code: 'Promise.resolve(1)\\n  .then(x => x + 1)\\n  .then(x => { throw x })\\n  .catch(x => x + 1)\\n  .then(x => console.log(x))', options: ['1', '2', '3', '4'], correct: 2 },
    { difficulty: 3, type: 'trace', text: 'Output?', code: 'function Foo() {}\\nFoo.prototype.x = 1;\\nconst a = new Foo();\\nconst b = new Foo();\\na.x = 2;\\nconsole.log(b.x);', options: ['1', '2', 'undefined', 'Error'], correct: 0 },
    { difficulty: 3, type: 'trace', text: 'What does this return?', code: 'const gen = function*() {\\n  yield 1; yield 2; yield 3;\\n}\\nconst it = gen();\\nit.next(); it.next();\\nconsole.log(it.next().value);', options: ['1', '2', '3', 'undefined'], correct: 2 },

    // ── Debug ──
    { difficulty: 3, type: 'debug', text: 'Memory leak — what is wrong?', code: 'const handlers = [];\\nfunction setup(el) {\\n  const data = loadHugeData();\\n  el.onclick = () => console.log(data);\\n  handlers.push(el.onclick);\\n}', options: ['No bug', 'handlers retains closure → data never GC\'d', 'onclick is wrong', 'loadHugeData is async'], correct: 1 },
    { difficulty: 3, type: 'debug', text: 'What is the issue?', code: 'async function fetchAll(urls) {\\n  const results = [];\\n  for (const url of urls) {\\n    results.push(await fetch(url));\\n  }\\n  return results;\\n}', options: ['No bug', 'Sequential, not parallel — use Promise.all', 'Missing try/catch', 'results is const'], correct: 1 },

    // ── Algo ──
    { difficulty: 3, type: 'algo', text: 'Array.sort() in V8 complexity?', code: '[5,3,1,4,2].sort((a,b)=>a-b)', options: ['O(n)', 'O(n log n) — TimSort', 'O(n²)', 'O(log n)'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'BFS space complexity?', code: 'function bfs(graph, start) {\\n  const q = [start], vis = new Set();\\n}', options: ['O(1)', 'O(V)', 'O(E)', 'O(V+E)'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'Amortized push to dynamic array?', code: 'const a = [];\\nfor (let i=0; i<n; i++) a.push(i);', options: ['O(n) per push', 'O(1) amortized', 'O(log n)', 'O(n²) total'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'Time complexity of Set.has()?', options: ['O(n)', 'O(1) average', 'O(log n)', 'O(n²)'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'What data structure implements LRU cache?', code: 'Implement O(1) get and put', options: ['Array + Map', 'HashMap + Doubly Linked List', 'BST', 'Stack + Queue'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'Optimal algorithm to merge k sorted arrays of total n elements?', options: ['O(n²)', 'O(n log k) — min-heap', 'O(nk)', 'O(n)'], correct: 1 },

    /* ── University-Specific Additions ── */

    // ── Harvard CS50W: Web Development ──
    { difficulty: 1, type: 'mcq', text: 'document.getElementById("x") returns?', options: ['NodeList', 'Single element or null', 'Array', 'String'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'fetch() returns what by default?', options: ['JSON data', 'A Promise that resolves to Response', 'A string', 'An XMLHttpRequest'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'event.preventDefault() does what?', options: ['Stops event bubbling', 'Prevents default browser behavior', 'Removes event listener', 'Returns false'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: 'Which HTTP method is used to update data?', options: ['GET', 'POST', 'PUT', 'DELETE'], correct: 2 },

    // ── Stanford CS106A/B: Recursion Patterns ──
    { difficulty: 2, type: 'trace', text: 'Recursion — output?', code: 'function count(n) {\\n  if (n===0) return;\\n  count(n-1);\\n  console.log(n);\\n}\\ncount(3);', options: ['3 2 1', '1 2 3', '3 2 1 0', '0 1 2 3'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'What is the maximum call stack size?', options: ['Infinite', 'Language-defined, typically ~10k-25k frames', 'Exactly 1000', 'Depends on RAM only'], correct: 1 },
    { difficulty: 2, type: 'algo', text: 'Recursive binary search time complexity?', code: 'function bs(arr, t, lo, hi) {\\n  if(lo>hi) return -1;\\n  let mid = (lo+hi)>>1;\\n  if(arr[mid]===t) return mid;\\n  return arr[mid]<t ? bs(arr,t,mid+1,hi) : bs(arr,t,lo,mid-1);\\n}', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'], correct: 1 },

    // ── MIT 6.031: Immutability in JS ──
    { difficulty: 3, type: 'mcq', text: 'Object.freeze(obj) is shallow — nested objects?', options: ['Also frozen', 'Still mutable', 'Throws error', 'Deleted'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'const arr = [1,2]; arr.push(3); — error?', options: ['Yes, const is immutable', 'No, const prevents reassignment not mutation', 'Depends on strict mode', 'Runtime error'], correct: 1 },
    { difficulty: 3, type: 'trace', text: 'Spread creates shallow copy — output?', code: 'const a = {x: {y: 1}};\\nconst b = {...a};\\nb.x.y = 99;\\nconsole.log(a.x.y);', options: ['1', '99', 'undefined', 'Error'], correct: 1 },

    // ── Princeton COS226: Graph Algorithms in JS ──
    { difficulty: 3, type: 'algo', text: 'Adjacency list vs matrix — space complexity?', options: ['List O(V+E), Matrix O(V²)', 'Both O(V²)', 'List O(V²), Matrix O(V+E)', 'Both O(V+E)'], correct: 0 },
    { difficulty: 3, type: 'algo', text: 'Minimum Spanning Tree — which algorithms?', options: ['BFS and DFS', "Prim's and Kruskal's", "Dijkstra and Floyd's", 'Topological sort'], correct: 1 },
    { difficulty: 3, type: 'algo', text: "Kruskal's MST uses which data structure?", options: ['Stack', 'Union-Find (Disjoint Sets)', 'Queue', 'HashMap'], correct: 1 },

    // ── MIT 6.006: DP in JS context ──
    { difficulty: 3, type: 'trace', text: 'DP coin change — minimum coins for amount=11, coins=[1,5,6]?', code: '// dp[i] = min coins for amount i', options: ['3 (6+5)', '2 (6+5)', '11 (all 1s)', '6'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'Longest Common Subsequence complexity?', code: 'LCS(str1, str2) // lengths m and n', options: ['O(m+n)', 'O(mn)', 'O(2^n)', 'O(m log n)'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'Greedy vs DP: key difference?', options: ['Same thing', 'Greedy makes locally optimal choices, DP considers all subproblems', 'DP is always faster', 'Greedy needs more memory'], correct: 1 },

    // ── Harvard CS50: Data Structure Choice ──
    { difficulty: 2, type: 'mcq', text: 'When to use a stack? (CS50)', options: ['Random access', 'LIFO: undo, call stack, bracket matching', 'Priority scheduling', 'Key-value storage'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'When to use a queue?', options: ['LIFO order', 'FIFO: BFS, task scheduling, buffering', 'Key lookups', 'Sorting'], correct: 1 },
]

