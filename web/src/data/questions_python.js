/* ══════════════════════════════════════════════════════════════════
   PYTHON DUEL QUESTIONS — 80+ questions across 3 difficulty levels
   Sources: MIT 6.0001/6.006, Stanford CS106A, Harvard CS50, Princeton COS226
   ══════════════════════════════════════════════════════════════════ */
export const pythonQuestions = [

    /* ╔══════════════════════════════════════════════════════════════╗
       ║  DIFFICULTY 1 — Fundamentals (ELO < 1200)                  ║
       ║  Focus: syntax, basic ops, simple control flow, types      ║
       ╚══════════════════════════════════════════════════════════════╝ */

    // ── Data Types & Literals ──
    { difficulty: 1, type: 'mcq', text: 'What is the output of type(3.14).__name__?', options: ['int', 'float', 'double', 'number'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: 'Which of these is a valid Python string?', options: ["'hello'", '"hello"', '"""hello"""', 'All of them'], correct: 3 },
    { difficulty: 1, type: 'mcq', text: 'What does bool(0) return?', options: ['True', 'False', '0', 'Error'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: 'What is the type of None?', options: ['int', 'bool', 'NoneType', 'void'], correct: 2 },
    { difficulty: 1, type: 'mcq', text: 'What does 2 ** 10 evaluate to?', options: ['20', '100', '1024', '210'], correct: 2 },
    { difficulty: 1, type: 'mcq', text: 'Which is NOT a Python keyword?', options: ['elif', 'switch', 'lambda', 'yield'], correct: 1 },

    // ── Strings ──
    { difficulty: 1, type: 'mcq', text: '"Python"[0] returns?', options: ['"P"', '"p"', '"Python"', 'Error'], correct: 0 },
    { difficulty: 1, type: 'mcq', text: 'len("Hello\\nWorld") returns?', options: ['10', '11', '12', '13'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: '"abc" * 3 returns?', options: ['"abcabcabc"', '9', 'Error', '"abc3"'], correct: 0 },
    { difficulty: 1, type: 'mcq', text: '"Python"[1:4] returns?', options: ['"Pyt"', '"yth"', '"ytho"', '"Pyth"'], correct: 1 },

    // ── Lists & Collections ──
    { difficulty: 1, type: 'mcq', text: 'What does [1,2,3].append(4) return?', options: ['[1,2,3,4]', 'None', '4', 'Error'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: 'How to get the last element of a list?', options: ['lst[0]', 'lst[-1]', 'lst[len]', 'lst.last()'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: 'range(1, 8, 2) produces which values?', options: ['1,3,5,7', '1,2,3,4,5,6,7', '2,4,6,8', '1,3,5,7,8'], correct: 0 },

    // ── Operators & Expressions ──
    { difficulty: 1, type: 'mcq', text: '17 % 5 evaluates to?', options: ['3', '2', '3.4', '5'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: '15 // 4 evaluates to?', options: ['3', '3.75', '4', 'Error'], correct: 0 },

    // ── Trace — Basic flow ──
    { difficulty: 1, type: 'trace', text: 'What does this print?', code: 'x = 5\\nif x > 3:\\n    x += 10\\nprint(x)', options: ['5', '15', '3', '10'], correct: 1 },
    { difficulty: 1, type: 'trace', text: 'What is printed?', code: 'total = 0\\nfor i in range(1, 5):\\n    total += i\\nprint(total)', options: ['4', '10', '15', '5'], correct: 1 },
    { difficulty: 1, type: 'trace', text: 'Output?', code: 'x = "hello"\\nprint(x.upper())', options: ['"hello"', '"HELLO"', '"Hello"', 'Error'], correct: 1 },
    { difficulty: 1, type: 'trace', text: 'What is printed?', code: 'nums = [10, 20, 30]\\nprint(nums[1])', options: ['10', '20', '30', 'Error'], correct: 1 },
    { difficulty: 1, type: 'trace', text: 'Output?', code: 'x = True\\ny = False\\nprint(x and y)', options: ['True', 'False', '1', '0'], correct: 1 },
    { difficulty: 1, type: 'trace', text: 'What does this print?', code: 'for i in range(3):\\n    print(i, end=" ")', options: ['1 2 3', '0 1 2', '0 1 2 3', '1 2'], correct: 1 },

    // ── Debug — Beginner bugs ──
    { difficulty: 1, type: 'debug', text: 'Which line causes an error?', code: 'name = "Alice"\\nprint("Age: " + 25)', options: ['Line 1', 'Line 2 (str + int TypeError)', 'Both', 'No bug'], correct: 1 },
    { difficulty: 1, type: 'debug', text: 'Which line has the bug?', code: 'nums = [1, 2, 3]\\nprint(nums[3])', options: ['Line 1', 'Line 2 (IndexError: only 0-2)', 'Both', 'No bug'], correct: 1 },

    // ── Complete — Fill the blank ──
    { difficulty: 1, type: 'complete', text: 'Fill the blank', code: 'for i ___ range(5):\\n    print(i)', options: ['of', 'in', 'from', 'at'], correct: 1 },
    { difficulty: 1, type: 'complete', text: 'Fill the blank', code: 'def add(a, b):\\n    ___ a + b', options: ['print', 'return', 'yield', 'output'], correct: 1 },
    { difficulty: 1, type: 'complete', text: 'Fill the blank', code: 'if score >= 90:\\n    grade = "A"\\n___ score >= 80:\\n    grade = "B"', options: ['else if', 'elif', 'elseif', 'elsif'], correct: 1 },

    /* ╔══════════════════════════════════════════════════════════════╗
       ║  DIFFICULTY 2 — Intermediate (ELO 1200-1600)               ║
       ║  Focus: gotchas, scoping, mutability, comprehensions,      ║
       ║  error handling, dict/set ops, intermediate tracing        ║
       ╚══════════════════════════════════════════════════════════════╝ */

    // ── MCQ — Language gotchas (MIT 6.0001 style) ──
    { difficulty: 2, type: 'mcq', text: 'print(0.1 + 0.2 == 0.3) outputs?', options: ['True', 'False', 'Error', '0.30000000000000004'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'a = [1,2]; b = a; b.append(3); len(a)?', options: ['2', '3', 'Error', 'None'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'What does {1,2,3} & {2,3,4} return?', options: ['{1,2,3,4}', '{2,3}', '{1,4}', 'Error'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'What is the output: print([] is [])?', options: ['True', 'False', 'None', 'Error'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'dict.get("missing_key") returns?', options: ['KeyError', 'None', '""', '0'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: '[1,2,3] == [1,2,3] is?', options: ['True', 'False', 'Error', 'None'], correct: 0 },
    { difficulty: 2, type: 'mcq', text: '[1,2,3] is [1,2,3] is?', options: ['True', 'False', 'Error', 'None'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'Which is immutable?', options: ['list', 'dict', 'set', 'frozenset'], correct: 3 },
    { difficulty: 2, type: 'mcq', text: 'sorted("dacb") returns?', options: ['"abcd"', "['a','b','c','d']", 'Error', "('a','b','c','d')"], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'What does "hello".replace("l","L",1) return?', options: ['"heLLo"', '"heLlo"', '"HeLLo"', 'Error'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'print(type(lambda: 0)) shows?', options: ["<class 'function'>", "<class 'lambda'>", 'Error', "<class 'callable'>"], correct: 0 },
    { difficulty: 2, type: 'mcq', text: '{} is a dict or a set?', options: ['set', 'dict', 'Both', 'Error'], correct: 1 },

    // ── Trace — Scoping, mutability, comprehensions ──
    { difficulty: 2, type: 'trace', text: 'Output? (Mutable default — MIT classic)', code: 'def f(x, acc=[]):\\n    acc.append(x)\\n    return len(acc)\\nprint(f(1), f(2), f(3))', options: ['1 1 1', '1 2 3', '3 3 3', 'Error'], correct: 1 },
    { difficulty: 2, type: 'trace', text: 'What prints? (Local scoping)', code: 'x = 10\\ndef foo():\\n    x = 20\\nfoo()\\nprint(x)', options: ['10', '20', 'None', 'Error'], correct: 0 },
    { difficulty: 2, type: 'trace', text: 'What is x?', code: 'x = 10\\nfor i in range(3):\\n    x = x // 2\\nprint(x)', options: ['5', '2', '1', '0'], correct: 2 },
    { difficulty: 2, type: 'trace', text: 'Output?', code: 'a = [1, 2, 3]\\nb = a[:]\\nb.append(4)\\nprint(len(a), len(b))', options: ['3 4', '4 4', '3 3', 'Error'], correct: 0 },
    { difficulty: 2, type: 'trace', text: 'What does this produce?', code: 'result = [x*2 for x in range(5) if x % 2 == 0]\\nprint(result)', options: ['[0,2,4,6,8]', '[0,4,8]', '[2,6]', '[0,2,4]'], correct: 1 },
    { difficulty: 2, type: 'trace', text: 'Output?', code: 'd = {"a": 1, "b": 2}\\nd["c"] = d.get("b", 0) + 1\\nprint(d["c"])', options: ['1', '2', '3', 'Error'], correct: 2 },
    { difficulty: 2, type: 'trace', text: 'What is printed?', code: 'a, *b, c = [1, 2, 3, 4, 5]\\nprint(b)', options: ['[2,3,4]', '[1,2,3,4]', '[2,3,4,5]', 'Error'], correct: 0 },
    { difficulty: 2, type: 'trace', text: 'Output?', code: 'def swap(a, b):\\n    a, b = b, a\\nx, y = 1, 2\\nswap(x, y)\\nprint(x, y)', options: ['2 1', '1 2', 'Error', 'None None'], correct: 1 },

    // ── Debug — Subtle mistakes ──
    { difficulty: 2, type: 'debug', text: 'Bug in factorial — which line?', code: 'def factorial(n):\\n    if n == 0:\\n        return 1\\n    return n * factorial(n)', options: ['Line 2', 'Line 3', 'Line 4 (n not n-1, infinite recursion)', 'No bug'], correct: 2 },
    { difficulty: 2, type: 'debug', text: 'Why doesn\'t this reverse the list?', code: 'def rev(lst):\\n    lst = lst[::-1]\\ndata = [1,2,3]\\nrev(data)\\nprint(data)', options: ['[::-1] is wrong', 'Reassigning lst only changes the local ref', 'print is wrong', 'No bug'], correct: 1 },
    { difficulty: 2, type: 'debug', text: 'What is the bug?', code: 'counts = {}\\nfor word in words:\\n    counts[word] += 1', options: ['words undefined', 'KeyError: key doesn\'t exist yet', 'Syntax error', 'No bug'], correct: 1 },
    { difficulty: 2, type: 'debug', text: 'Why does this skip items?', code: 'nums = [1,2,3,4,5]\\nfor i in range(len(nums)):\\n    if nums[i] % 2 == 0:\\n        nums.pop(i)', options: ['pop is wrong method', 'Modifying list while iterating by index', 'range is wrong', 'No bug'], correct: 1 },

    // ── Complete ──
    { difficulty: 2, type: 'complete', text: 'Create a generator', code: 'def countdown(n):\\n    while n > 0:\\n        ___ n\\n        n -= 1', options: ['return', 'yield', 'print', 'send'], correct: 1 },
    { difficulty: 2, type: 'complete', text: 'Open file safely', code: 'with ___(\"data.txt\") as f:\\n    content = f.read()', options: ['file', 'open', 'read', 'load'], correct: 1 },
    { difficulty: 2, type: 'complete', text: 'Handle exception', code: 'try:\\n    result = 10 / x\\n___ ZeroDivisionError:\\n    result = 0', options: ['catch', 'except', 'handle', 'when'], correct: 1 },

    // ── Algo — Basic complexity ──
    { difficulty: 2, type: 'algo', text: 'Time complexity?', code: 'def find(arr, target):\\n    for item in arr:\\n        if item == target:\\n            return True\\n    return False', options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'], correct: 1 },
    { difficulty: 2, type: 'algo', text: 'What is the complexity?', code: 'def has_dup(arr):\\n    return len(arr) != len(set(arr))', options: ['O(n²)', 'O(n)', 'O(n log n)', 'O(1)'], correct: 1 },
    { difficulty: 2, type: 'algo', text: 'Complexity of this nested loop?', code: 'for i in range(n):\\n    for j in range(n):\\n        print(i, j)', options: ['O(n)', 'O(n²)', 'O(2n)', 'O(n!)'], correct: 1 },
    { difficulty: 2, type: 'algo', text: 'Which is faster for membership test?', code: 'x in my_list  # vs\\nx in my_set', options: ['List (O(n))', 'Set (O(1) avg)', 'Same speed', 'Depends on data'], correct: 1 },

    /* ╔══════════════════════════════════════════════════════════════╗
       ║  DIFFICULTY 3 — Advanced (ELO > 1600)                      ║
       ║  Focus: closures, generators, decorators, metaclasses,     ║
       ║  algorithm design, graph theory, DP, amortized analysis    ║
       ╚══════════════════════════════════════════════════════════════╝ */

    // ── MCQ — Deep Python knowledge ──
    { difficulty: 3, type: 'mcq', text: 'print((-1) ** 0.5) outputs?', options: ['Error', '-1', '(6.12e-17+1j)', 'nan'], correct: 2 },
    { difficulty: 3, type: 'mcq', text: 'next(iter([])) raises?', options: ['IndexError', 'StopIteration', 'ValueError', 'TypeError'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'id(256)==id(256) in CPython?', options: ['True (int cache -5 to 256)', 'False', 'Random', 'Error'], correct: 0 },
    { difficulty: 3, type: 'mcq', text: 'What is __slots__ used for?', options: ['Thread safety', 'Restrict instance attributes, save memory', 'Define methods', 'Import control'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'What does @functools.lru_cache do?', options: ['Lazy loading', 'Memoization with LRU eviction', 'Thread locking', 'Async caching'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'collections.defaultdict(list)["new_key"] returns?', options: ['KeyError', '[]', 'None', '""'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'What is the MRO (Method Resolution Order) in Python?', options: ['Alphabetical', 'C3 linearization', 'Depth-first only', 'Random'], correct: 1 },

    // ── Trace — Closures, generators, advanced OOP ──
    { difficulty: 3, type: 'trace', text: 'Output? (Closure trap — MIT 6.009)', code: 'fns = [lambda: i for i in range(4)]\\nprint([f() for f in fns])', options: ['[0,1,2,3]', '[3,3,3,3]', '[0,0,0,0]', 'Error'], correct: 1 },
    { difficulty: 3, type: 'trace', text: 'How to fix the closure trap?', code: 'fns = [lambda i=i: i for i in range(4)]\\nprint([f() for f in fns])', options: ['[0,1,2,3]', '[3,3,3,3]', '[0,0,0,0]', 'Error'], correct: 0 },
    { difficulty: 3, type: 'trace', text: 'What is printed?', code: 'gen = (x**2 for x in range(5))\\nnext(gen); next(gen)\\nprint(sum(gen))', options: ['30', '29', '25', '22'], correct: 3 },
    { difficulty: 3, type: 'trace', text: 'Output of this recursion? (Fibonacci)', code: 'def f(n):\\n    if n <= 1: return n\\n    return f(n-1) + f(n-2)\\nprint(f(7))', options: ['7', '13', '21', '8'], correct: 1 },
    { difficulty: 3, type: 'trace', text: 'What is printed? (Class attribute vs instance)', code: 'class A:\\n    x = []\\na = A(); b = A()\\na.x.append(1)\\nprint(b.x)', options: ['[]', '[1]', 'Error', 'None'], correct: 1 },
    { difficulty: 3, type: 'trace', text: 'Output? (Decorator behavior)', code: 'def deco(fn):\\n    def wrapper(*a):\\n        return fn(*a) * 2\\n    return wrapper\\n@deco\\ndef add(a,b): return a+b\\nprint(add(3,4))', options: ['7', '14', 'Error', '34'], correct: 1 },
    { difficulty: 3, type: 'trace', text: 'What does this evaluate to?', code: 'from itertools import chain\\nlist(chain([1,2], [3,4], [5]))', options: ['[[1,2],[3,4],[5]]', '[1,2,3,4,5]', 'Error', '[1,5]'], correct: 1 },

    // ── Debug — Production-grade ──
    { difficulty: 3, type: 'debug', text: 'Binary search bug — which line?', code: 'def bs(arr, t):\\n    lo, hi = 0, len(arr)\\n    while lo < hi:\\n        mid = (lo + hi) // 2\\n        if arr[mid] == t: return mid\\n        elif arr[mid] < t: lo = mid\\n        else: hi = mid\\n    return -1', options: ['Line 2', 'Line 4', 'Line 6 (lo=mid → infinite loop)', 'No bug'], correct: 2 },
    { difficulty: 3, type: 'debug', text: 'Memory leak in this pattern?', code: 'class Node:\\n    def __init__(self, val):\\n        self.val = val\\n        self.parent = None\\n        self.children = []\\n    def add(self, child):\\n        child.parent = self\\n        self.children.append(child)', options: ['No issue', 'Circular reference: parent↔children prevents GC in ref-counting', 'val leak', 'Missing __del__'], correct: 1 },
    { difficulty: 3, type: 'debug', text: 'Thread-safety issue?', code: 'balance = 0\\ndef deposit(amount):\\n    global balance\\n    balance += amount', options: ['No bug (GIL protects it)', 'Not atomic: read-modify-write race', 'global is wrong', 'Missing return'], correct: 1 },

    // ── Algo — MIT 6.006 / Princeton COS226 ──
    { difficulty: 3, type: 'algo', text: 'Dijkstra with binary heap complexity?', code: 'Dijkstra(G, src)  # binary heap PQ', options: ['O(V²)', 'O((V+E) log V)', 'O(V log V)', 'O(E)'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'Amortized cost of list.append()?', code: 'lst = []\\nfor i in range(n):\\n    lst.append(i)  # dynamic array', options: ['O(n) per op', 'O(1) amortized', 'O(log n)', 'O(√n)'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'Which finds strongly connected components?', code: 'Given directed graph G = (V, E)', options: ['BFS', "Prim's algorithm", "Tarjan's / Kosaraju's", "Kruskal's"], correct: 2 },
    { difficulty: 3, type: 'algo', text: 'Time to BUILD a heap from n elements?', code: 'heapq.heapify(arr)  # n elements', options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'Merge sort recurrence relation?', code: 'T(n) = ?', options: ['T(n)=T(n-1)+O(n)', 'T(n)=2T(n/2)+O(n)', 'T(n)=T(n/2)+O(1)', 'T(n)=2T(n-1)+O(1)'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'Best algorithm to find shortest path in unweighted graph?', code: 'Unweighted graph G, find shortest s→t', options: ['DFS', 'BFS', 'Dijkstra', 'Bellman-Ford'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'What is the space complexity of DFS?', code: 'def dfs(node, visited):\\n    visited.add(node)\\n    for n in neighbors(node):\\n        if n not in visited:\\n            dfs(n, visited)', options: ['O(1)', 'O(V)', 'O(E)', 'O(V+E)'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'Counting sort time complexity?', code: 'Given n integers in range [0, k]', options: ['O(n log n)', 'O(n + k)', 'O(n²)', 'O(k log k)'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'What is the optimal substructure property?', code: 'Required for dynamic programming', options: ['Problem can be divided into subproblems', 'Optimal solution contains optimal sub-solutions', 'Greedy works', 'O(1) space'], correct: 1 },

    /* ── University-Specific Additions ── */

    // ── MIT 6.006: Topological Sort, DP ──
    { difficulty: 3, type: 'algo', text: 'Topological sort requires the graph to be?', code: 'topological_sort(G)', options: ['Undirected', 'DAG (Directed Acyclic)', 'Complete', 'Weighted'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'DP: memoization vs tabulation?', options: ['Same approach', 'Memoization=top-down+cache, Tabulation=bottom-up+table', 'Tabulation is always faster', 'Memoization uses no extra space'], correct: 1 },
    { difficulty: 3, type: 'algo', text: 'Bellman-Ford can detect?', code: 'Run V-1 relaxations, then check again', options: ['Minimum spanning tree', 'Negative weight cycles', 'Strongly connected components', 'Bipartite graphs'], correct: 1 },
    { difficulty: 3, type: 'trace', text: 'DP Fibonacci — how many unique subproblems for fib(10)?', code: '@lru_cache\\ndef fib(n):\\n    if n<=1: return n\\n    return fib(n-1)+fib(n-2)', options: ['100', '10', '11', '55'], correct: 2 },
    { difficulty: 2, type: 'algo', text: 'Binary search — what must be true about the input?', code: 'def bsearch(arr, target):', options: ['Must be a list', 'Must be sorted', 'Must have unique elements', 'Must be integers'], correct: 1 },

    // ── Stanford CS106B: Backtracking, Hash Collision ──
    { difficulty: 3, type: 'mcq', text: 'Backtracking prunes branches by?', options: ['Sorting first', 'Abandoning paths that violate constraints early', 'Using dynamic programming', 'Random selection'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'Hash collision resolution: chaining vs open addressing?', options: ['Chaining uses linked lists at each slot', 'Open addressing has no collisions', 'They are identical', 'Chaining uses no extra memory'], correct: 0 },
    { difficulty: 2, type: 'algo', text: 'Hash table with chaining — worst case search?', code: 'All n keys hash to same bucket', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'N-Queens: how many solutions for 8×8 board?', options: ['1', '12', '92', '724'], correct: 2 },

    // ── Princeton COS226: Union-Find, Red-Black BST ──
    { difficulty: 3, type: 'algo', text: 'Union-Find: path compression does what?', code: 'def find(x):\\n    if parent[x]!=x:\\n        parent[x]=find(parent[x])\\n    return parent[x]', options: ['Sorts the tree', 'Flattens tree by pointing nodes directly to root', 'Doubles tree height', 'Removes duplicates'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'Red-Black BST guarantees?', options: ['O(1) search', 'O(log n) worst-case operations', 'O(n) insert', 'Perfect balance'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'Percolation threshold (COS226 classic)?', options: ['~0.3', '~0.5', '~0.593', '~0.8'], correct: 2 },

    // ── Harvard CS50: Hash Tables, Memory ──
    { difficulty: 2, type: 'mcq', text: 'Hash table load factor = ?', options: ['n / capacity', 'capacity / n', 'n * capacity', 'log(n)'], correct: 0 },
    { difficulty: 2, type: 'mcq', text: 'Stack memory vs Heap memory?', options: ['Stack=dynamic, Heap=fixed', 'Stack=LIFO for locals, Heap=dynamic allocation', 'Same thing', 'Stack is slower'], correct: 1 },
    { difficulty: 1, type: 'mcq', text: 'What does a hash function do? (CS50)', options: ['Encrypts data', 'Maps input to a fixed-size index', 'Sorts data', 'Compresses data'], correct: 1 },

    // ── MIT 6.031: Specifications, Immutability ──
    { difficulty: 3, type: 'mcq', text: 'Rep invariant (MIT 6.031) ensures?', options: ['Code compiles', 'Internal data structure is always valid', 'No imports needed', 'O(1) operations'], correct: 1 },
    { difficulty: 2, type: 'mcq', text: 'Why prefer immutable objects? (6.031)', options: ['Faster execution', 'Thread-safe, easier to reason about, no defensive copies', 'Less memory', 'Required by Python'], correct: 1 },
    { difficulty: 2, type: 'trace', text: 'Immutability — output?', code: 's = "hello"\\ns.upper()\\nprint(s)', options: ['"HELLO"', '"hello"', 'Error', 'None'], correct: 1 },
    { difficulty: 3, type: 'mcq', text: 'Abstraction function (AF) in ADT design maps?', options: ['Input → Output', 'Rep values → Abstract values', 'Functions → Classes', 'Tests → Code'], correct: 1 },
]

