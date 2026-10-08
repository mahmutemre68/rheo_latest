/* ══════════════════════════════════════════════════════════════════
   JAVA DUEL QUESTIONS — 80+ questions across 3 difficulty levels
   Sources: MIT 6.031, Princeton COS226, Stanford CS106A/B, Oracle docs
   ══════════════════════════════════════════════════════════════════ */
export const javaQuestions = [

    /* ╔══════════════════════════════════════════════════════════════╗
       ║  DIFFICULTY 1 — Fundamentals (ELO < 1200)                  ║
       ╚══════════════════════════════════════════════════════════════╝ */

    // ── Types & Basics ──
    { difficulty: 1, type: 'mcq', text: 'Which is a primitive type?', options: ['String', 'Integer', 'int', 'Array'], correct: 2 },
    { difficulty: 1, type: 'mcq', text: '"Hello".length() returns?', options: ['4', '5', '6', 'Error'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: 'Keyword to create objects?', options: ['create', 'new', 'make', 'alloc'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: 'int x = 7/2; x is?', options: ['3.5', '3', '4', 'Error'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: 'System.out.println(5+3) prints?', options: ['53', '8', '5+3', 'Error'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: 'Default value of int field?', options: ['null', '0', '-1', 'undefined'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: 'Which loop runs at least once?', options: ['for', 'while', 'do-while', 'for-each'], correct: 2 },
    { difficulty: 1, type: 'mcq', text: 'How to declare an array of 5 ints?', options: ['int[5] arr', 'int arr[5]', 'int[] arr = new int[5]', 'array<int>(5)'], correct: 2 },
    { difficulty: 1, type: 'mcq', text: 'What is the entry point of a Java program?', options: ['init()', 'start()', 'main()', 'run()'], correct: 2 },
    { difficulty: 1, type: 'mcq', text: 'Which access modifier is most restrictive?', options: ['public', 'protected', 'default', 'private'], correct: 3 },

    // ── Trace ──
    { difficulty: 1, type: 'trace', text: 'Output?', code: 'int x = 10;\\nSystem.out.println(x > 5 ? "big" : "small");', options: ['"big"', '"small"', '10', 'Error'], correct: 0 },
    { difficulty: 1, type: 'trace', text: 'What is printed?', code: 'int sum = 0;\\nfor (int i=1; i<=4; i++) sum += i;\\nSystem.out.println(sum);', options: ['4', '10', '6', '15'], correct: 1 },
    { difficulty: 1, type: 'trace', text: 'Output?', code: 'String s = "Hello ";\\ns += "World";\\nSystem.out.println(s);', options: ['Hello', 'Hello World', 'Error', 'HelloWorld'], correct: 1 },
    { difficulty: 1, type: 'trace', text: 'What is printed?', code: 'int[] arr = {10, 20, 30};\\nSystem.out.println(arr[1]);', options: ['10', '20', '30', 'Error'], correct: 1 },
    { difficulty: 1, type: 'trace', text: 'Output?', code: 'boolean a = true;\\nboolean b = false;\\nSystem.out.println(a || b);', options: ['true', 'false', '1', 'Error'], correct: 0 },

    // ── Debug ──
    { difficulty: 1, type: 'debug', text: 'Which line has the bug?', code: 'int[] arr = new int[3];\\nSystem.out.println(arr[3]);', options: ['Line 1', 'Line 2 (ArrayIndexOutOfBounds)', 'Both', 'No bug'], correct: 1 },
    { difficulty: 1, type: 'debug', text: 'What is wrong?', code: 'String name = "Alice"\\nSystem.out.println(name);', options: ['Line 1 (missing semicolon)', 'Line 2', 'Both', 'No bug'], correct: 0 },

    // ── Complete ──
    { difficulty: 1, type: 'complete', text: 'Inheritance keyword', code: 'public class Dog ___ Animal {\\n    // inherits\\n}', options: ['implements', 'extends', 'inherits', 'super'], correct: 1 },
    { difficulty: 1, type: 'complete', text: 'String concatenation', code: 'String name = "World";\\nSystem.out.println("Hello " ___ name);', options: ['++', '+', '&', '.'], correct: 1 },
    { difficulty: 1, type: 'complete', text: 'Fill the blank', code: 'Scanner sc = ___ Scanner(System.in);\\nString line = sc.nextLine();', options: ['a', 'new', 'create', 'make'], correct: 1 },

    /* ╔══════════════════════════════════════════════════════════════╗
       ║  DIFFICULTY 2 — Intermediate (ELO 1200-1600)               ║
       ╚══════════════════════════════════════════════════════════════╝ */

    // ── MCQ — Java-specific gotchas ──
    { difficulty: 2, type: 'mcq', text: '"hello"=="hello" always true?', options: ['Always', 'Depends (string pool vs new)', 'Never', 'Error'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'null instanceof Object?', options: ['true', 'false', 'NullPointerException', 'Error'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'Can interface have method body (Java 8+)?', options: ['Never', 'Yes: default methods', 'Only static', 'Only abstract'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'println(10+20+"30") prints?', options: ['"102030"', '"3030"', '60', '"10"'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'println("30"+10+20) prints?', options: ['"60"', '"301020"', '"30"', 'Error'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'ArrayList vs LinkedList random access?', options: ['Both O(1)', 'ArrayList O(1), LinkedList O(n)', 'LinkedList O(1)', 'Both O(n)'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'What is autoboxing?', options: ['Auto array', 'int↔Integer auto-convert', 'Auto import', 'Auto casting'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: '"abc".charAt(3) throws?', options: ['Returns null', 'StringIndexOutOfBoundsException', 'Returns ""', 'Returns \\u0000'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'What is the diamond operator <>?', options: ['Comparison', 'Type inference for generics', 'Null check', 'Cast operator'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'StringBuilder vs String for concatenation in loops?', options: ['Same performance', 'StringBuilder is much faster', 'String is faster', 'Neither is good'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'What does the final keyword prevent?', options: ['Class creation', 'Overriding/reassignment/subclassing', 'Method calls', 'Object creation'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'Which creates thread?', options: ['extends Thread', 'implements Runnable', 'Both', 'Neither'], correct: 2 },

    // ── Trace — Post-increment, String immutability, Integer cache ──
    { difficulty: 2, type: 'trace', text: 'Output?', code: 'int a = 5;\\nint b = a++;\\nSystem.out.println(a + " " + b);', options: ['5 5', '6 5', '6 6', '5 6'], correct: 1 },
    { difficulty: 2, type: 'trace', text: 'Output? (++a vs a++)', code: 'int a = 5;\\nint b = ++a;\\nSystem.out.println(a + " " + b);', options: ['5 6', '6 6', '6 5', '5 5'], correct: 1 },
    { difficulty: 2, type: 'trace', text: 'String immutability — output?', code: 'String s = "Hello";\\ns.concat(" World");\\nSystem.out.println(s);', options: ['Hello World', 'Hello', 'Error', 'null'], correct: 1 },
    { difficulty: 2, type: 'trace', text: 'Integer cache — output?', code: 'Integer a = 127;\\nInteger b = 127;\\nSystem.out.println(a == b);', options: ['true', 'false', 'Error', 'Sometimes'], correct: 0 },
    { difficulty: 2, type: 'trace', text: 'Output?', code: 'int x = 0;\\nswitch(x) {\\n  case 0: System.out.print("A");\\n  case 1: System.out.print("B");\\n  default: System.out.print("C");\\n}', options: ['"A"', '"AB"', '"ABC"', '"AC"'], correct: 2 },
    { difficulty: 2, type: 'trace', text: 'What is printed?', code: 'List<Integer> list = new ArrayList<>();\\nlist.add(1); list.add(2); list.add(3);\\nlist.remove(1);\\nSystem.out.println(list);', options: ['[2,3]', '[1,3]', '[1,2]', 'Error'], correct: 1 },
    { difficulty: 2, type: 'trace', text: 'Output?', code: 'String a = "abc";\\nString b = "abc";\\nString c = new String("abc");\\nSystem.out.println(a==b + " " + (a==c));', options: ['true true', 'true false', 'false true', 'false false'], correct: 1 },

    // ── Debug ──
    { difficulty: 2, type: 'debug', text: 'NPE on which line?', code: 'String s = null;\\nif(s.equals("test")) {\\n    System.out.println("match");\\n}', options: ['Line 1', 'Line 2 (NPE)', 'Line 3', 'No bug'], correct: 1 },
    { difficulty: 2, type: 'debug', text: 'How to fix the NPE above?', code: 'String s = null;\\nif("test".equals(s)) { ... }', options: ['Same NPE', 'Fixed: literal.equals() is null-safe', 'Still crashes', 'Wrong approach'], correct: 1 },
    { difficulty: 2, type: 'debug', text: 'Off-by-one — which line?', code: 'int[] arr = new int[3];\\nfor(int i=0; i<=3; i++)\\n    arr[i] = i;', options: ['Line 1', 'Line 2 (i<=3 → i<3)', 'Line 3', 'No bug'], correct: 1 },
    { difficulty: 2, type: 'debug', text: 'Missing break — what happens?', code: 'int x = 1;\\nswitch(x) {\\n  case 1: print("A");\\n  case 2: print("B");\\n  break;\\n}', options: ['"A"', '"AB"', '"B"', 'Error'], correct: 1 },

    // ── Complete ──
    { difficulty: 2, type: 'complete', text: 'Fill for generics', code: 'List<String> list = new ___<>();\\nlist.add("hello");', options: ['List', 'ArrayList', 'Array', 'Collection'], correct: 1 },
    { difficulty: 2, type: 'complete', text: 'Try-with-resources', code: 'try (___ reader = new BufferedReader(new FileReader("f"))) {\\n    String line = reader.readLine();\\n}', options: ['final', 'var', 'BufferedReader', 'auto'], correct: 2 },

    // ── Algo ──
    { difficulty: 2, type: 'algo', text: 'HashMap.get(key) average complexity?', options: ['O(n)', 'O(1) amortized', 'O(log n)', 'O(n²)'], correct: 1 },
    { difficulty: 2, type: 'algo', text: 'Collections.sort() complexity?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correct: 1 },
    { difficulty: 2, type: 'algo', text: 'ArrayList.add(index, element) complexity?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correct: 1 },
    { difficulty: 2, type: 'algo', text: 'HashSet.contains() average complexity?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n log n)'], correct: 1 },

    /* ╔══════════════════════════════════════════════════════════════╗
       ║  DIFFICULTY 3 — Advanced (ELO > 1600)                      ║
       ╚══════════════════════════════════════════════════════════════╝ */

    // ── MCQ — Deep Java knowledge ──
    { difficulty: 3, type: 'mcq', text: 'Integer 128 == Integer 128?', options: ['false (cache only -128 to 127)', 'true', 'Error', 'Depends on JVM'], correct: 0 },
    { difficulty: 3, type: 'mcq', text: 'What is happens-before?', options: ['Thread scheduling', 'Memory visibility guarantee between threads', 'Method order', 'GC order'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'PriorityQueue internal structure?', options: ['Balanced BST', 'Binary heap (array-based)', 'Sorted linked list', 'Hash table'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'ConcurrentHashMap vs synchronized HashMap?', options: ['Same performance', 'Segment/stripe locking: better concurrency', 'HashMap is faster', 'ConcurrentMap is immutable'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'What does volatile guarantee?', options: ['Atomicity', 'Visibility across threads', 'Both atomicity and visibility', 'Thread safety'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'Why is HashMap O(1) amortized and not O(1)?', options: ['Hash collisions can degrade to O(n) or O(log n)', 'Memory allocation', 'Rehashing', 'Serialization'], correct: 0 },
    { difficulty: 3, type: 'mcq', text: 'Stream.parallel() vs sequential()?', options: ['Same speed', 'Parallel uses ForkJoinPool for multi-core', 'Sequential is always faster', 'Parallel only works with lists'], correct: 1 },

    // ── Trace — Polymorphism, generics, concurrency ──
    { difficulty: 3, type: 'trace', text: 'Dynamic dispatch — output?', code: 'class A { void f(){print("A");} }\\nclass B extends A { void f(){print("B");} }\\nA obj = new B();\\nobj.f();', options: ['"A"', '"B"', 'Compile error', 'Runtime error'], correct: 1 },
    { difficulty: 3, type: 'trace', text: 'String pool — output?', code: 'String s1 = "abc";\\nString s2 = new String("abc");\\nprintln(s1==s2);\\nprintln(s1.equals(s2));', options: ['true true', 'false true', 'true false', 'false false'], correct: 1 },
    { difficulty: 3, type: 'trace', text: 'Shallow clone — output?', code: 'int[] a = {1,2,3};\\nint[] b = a.clone();\\nb[0] = 99;\\nprintln(a[0]);', options: ['99', '1', 'Error', 'null'], correct: 1 },
    { difficulty: 3, type: 'trace', text: 'Output? (Static vs instance method)', code: 'class A { static void f(){print("A");} }\\nclass B extends A { static void f(){print("B");} }\\nA obj = new B();\\nobj.f();', options: ['"A" (static binding)', '"B"', 'Error', 'null'], correct: 0 },
    { difficulty: 3, type: 'trace', text: 'What does this print?', code: 'try {\\n  print("1");\\n  throw new Exception();\\n} catch(Exception e) {\\n  print("2");\\n} finally {\\n  print("3");\\n}', options: ['"12"', '"123"', '"13"', '"1"'], correct: 1 },

    // ── Debug — Production bugs ──
    { difficulty: 3, type: 'debug', text: 'ConcurrentModificationException?', code: 'List<String> list = new ArrayList<>(List.of("a","b","c"));\\nfor (String s : list)\\n    if (s.equals("b")) list.remove(s);', options: ['Line 1', 'Line 2', 'Line 3 (modify during iteration)', 'No bug'], correct: 2 },
    { difficulty: 3, type: 'debug', text: 'Deadlock risk in this code?', code: 'synchronized(lockA) {\\n  synchronized(lockB) { }\\n}\\n// Thread 2:\\nsynchronized(lockB) {\\n  synchronized(lockA) { }\\n}', options: ['No issue', 'Lock ordering inversion → deadlock', 'Performance only', 'Compile error'], correct: 1 },
    { difficulty: 3, type: 'debug', text: 'equals() without hashCode() — what breaks?', code: 'class Key {\\n  int id;\\n  @Override public boolean equals(Object o) { ... }\\n  // No hashCode override\\n}', options: ['Nothing', 'HashMap/HashSet lookup fails', 'NPE', 'Compile error'], correct: 1 },

    // ── Algo — Princeton COS226 level ──
    { difficulty: 3, type: 'algo', text: 'TreeMap.get(key) complexity?', options: ['O(1)', 'O(log n) — Red-Black tree', 'O(n)', 'O(n log n)'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'QuickSort worst case?', code: 'Arrays.sort(arr)', options: ['O(n log n) always', 'O(n²) — mitigate with random pivot', 'O(n)', 'O(2^n)'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'Recursive DFS space complexity?', code: 'void dfs(int v, boolean[] vis) {\\n    vis[v]=true;\\n    for(int u:adj[v])\\n        if(!vis[u]) dfs(u,vis);\\n}', options: ['O(1)', 'O(V)', 'O(E)', 'O(V²)'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'Best case for insertion sort?', options: ['O(n²)', 'O(n) — already sorted', 'O(n log n)', 'O(1)'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'Union-Find with path compression and union by rank?', options: ['O(n)', 'O(α(n)) ≈ O(1) amortized', 'O(log n)', 'O(n²)'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'What is the time complexity of String concatenation in a loop (n iterations)?', code: 'String s = "";\\nfor(int i=0; i<n; i++) s += "a";', options: ['O(n)', 'O(n²) — new String each time', 'O(n log n)', 'O(1)'], correct: 1 },

    /* ── University-Specific Additions ── */

    // ── Princeton COS226: BST, Huffman, Knuth ──
    { difficulty: 2, type: 'mcq', text: 'In-order traversal of BST gives?', options: ['Random order', 'Sorted ascending order', 'Reverse order', 'Level order'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'Huffman encoding is optimal because?', options: ['Fixed-length codes', 'Prefix-free codes with minimum weighted path length', 'No compression', 'Uses balanced trees'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'Knuth shuffle (Fisher-Yates) complexity?', code: 'for(int i=n-1; i>0; i--)\\n    swap(arr, i, rand(0,i));', options: ['O(n²)', 'O(n)', 'O(n log n)', 'O(1)'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: '3-way partitioning (Dijkstra) useful when?', options: ['All elements unique', 'Many duplicate keys', 'Already sorted', 'Small arrays only'], correct: 1 },
    { difficulty: 2, type: 'algo', text: 'BST worst-case search (unbalanced)?', code: 'Insert 1,2,3,4,5 into BST', options: ['O(log n)', 'O(n) — degenerates to linked list', 'O(1)', 'O(n²)'], correct: 1 },

    // ── MIT 6.031: Specifications, Rep Exposure ──
    { difficulty: 3, type: 'mcq', text: 'Rep exposure bug (6.031)?', options: ['Public fields', 'Returning mutable internal reference', 'Using generics', 'Overriding equals'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'Defensive copy prevents?', options: ['NPE', 'Client modifying internal state via returned reference', 'Stack overflow', 'Deadlock'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'Iterator contract: what does hasNext() guarantee?', options: ['Modifies collection', 'Returns true if next() will succeed', 'Removes element', 'Sorts elements'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'Why use List interface instead of ArrayList?', options: ['Faster', 'Program to interface, not implementation (flexibility)', 'Less memory', 'Required by Java'], correct: 1 },

    // ── Stanford CS106B: Recursion Patterns ──
    { difficulty: 3, type: 'trace', text: 'Recursion trace — output?', code: 'void f(int n) {\\n    if(n==0) return;\\n    System.out.print(n+" ");\\n    f(n-2);\\n    System.out.print(n+" ");\\n}\\nf(4);', options: ['"4 2 2 4"', '"4 2 4 2"', '"2 4 4 2"', '"4 2 0 2 4"'], correct: 0 },
    { difficulty: 3, type: 'mcq', text: 'Power set of {a,b,c} has how many subsets?', options: ['3', '6', '8', '7'], correct: 2 },
    { difficulty: 2, type: 'mcq', text: 'Tower of Hanoi: minimum moves for n disks?', options: ['n', 'n²', '2ⁿ - 1', 'n!'], correct: 2 },

    // ── Harvard CS50: Memory & Stack ──
    { difficulty: 2, type: 'mcq', text: 'StackOverflowError in Java means?', options: ['Array too large', 'Recursion too deep, call stack exhausted', 'Integer overflow', 'Memory leak'], correct: 1 },
    { difficulty: 2, type: 'debug', text: 'What causes StackOverflow?', code: 'void f() {\\n    f();\\n}', options: ['Line 1', 'Line 2 (infinite recursion, no base case)', 'Both', 'No bug'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'Linked list reversal — iterative time/space?', options: ['O(n)/O(n)', 'O(n)/O(1)', 'O(n²)/O(1)', 'O(1)/O(1)'], correct: 1 },

    // ── MIT 6.006: Graph & DP in Java ──
    { difficulty: 3, type: 'algo', text: 'Topological sort of DAG using DFS?', code: 'void topo(int v) {\\n    visited[v]=true;\\n    for(int u:adj[v])\\n        if(!visited[u]) topo(u);\\n    stack.push(v);\\n}', options: ['O(V)', 'O(V+E)', 'O(V²)', 'O(E log V)'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'Longest Increasing Subsequence — optimal DP?', options: ['O(n)', 'O(n log n) — patience sorting', 'O(n²)', 'O(2^n)'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'Floyd-Warshall: all-pairs shortest paths?', code: 'for k: for i: for j: d[i][j]=min(d[i][j], d[i][k]+d[k][j])', options: ['O(V²)', 'O(V³)', 'O(V+E)', 'O(V² log V)'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'When is BFS preferred over DFS?', options: ['Finding shortest path in unweighted graph', 'Detecting cycles', 'Topological sort', 'Finding bridges'], correct: 0 },
]

