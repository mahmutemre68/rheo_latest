import { normalizeExercise } from './normalizeExercise.js'
/* ══════════════════════════════════════════
   Rheo Journey Data — v10 Modular (core.js)
   Storage → ./storage.js | i18n → ./i18n.js
   ══════════════════════════════════════════ */
import { jsExercises } from '../exercises_js.js'
import { jsExercisesCh6to10 } from '../exercises_js2.js'
import { javaExercises } from '../exercises_java.js'
import { javaExercisesCh6to10 } from '../exercises_java2.js'
import { pyExercises } from '../exercises_python.js'
import { pyExercisesCh6to10 } from '../exercises_python2.js'
import { duelQuestionPool } from './duel_questions.js'

import { loadSaved, saveTo, STORAGE_KEY, STATS_KEY, ONBOARDING_KEY } from './storage.js'
import { t, getLocale, setLocale } from './i18n.js'

// Re-export so barrel index picks them up
export { getLocale, setLocale, t }

export const mascotMessages = [
    "Let's code! 🚀", "You got this! 💪", "Keep going! 🔥",
    "Almost there! ⭐", "Debug time! 🐛",
]

/* ── Languages ── */
export const languages = [
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'javascript', name: 'JavaScript', icon: '⚡' },
    { id: 'java', name: 'Java', icon: '☕' },
]

// The chosen language has to survive a restart. It was a plain module variable,
// so every cold start silently dropped a Java or JavaScript learner back onto
// Python — including on mobile, where the WebView reloads from scratch.
const LANG_KEY = 'rheo_active_lang'
const _savedLang = loadSaved(LANG_KEY, null)
let _activeLang = languages.some(l => l.id === _savedLang) ? _savedLang : 'python'
export function getActiveLanguage() { return _activeLang }
export function setActiveLanguage(id) {
    if (!languages.some(l => l.id === id)) return
    _activeLang = id
    saveTo(LANG_KEY, id)
}

/* ── Otter Tip of the Day ── */
const tips = {
    python: [
        { tip: "Use enumerate() to get index + value in a loop!", code: "for i, v in enumerate(arr):" },
        { tip: "f-strings are the fastest way to format!", code: 'f"Hello {name}"' },
        { tip: "List comprehensions are 2x faster than loops!", code: "[x*2 for x in range(10)]" },
        { tip: "Use 'in' to check membership efficiently!", code: "if key in my_dict:" },
        { tip: "Ternary expressions save lines!", code: "x = 'yes' if a > 0 else 'no'" },
    ],
    javascript: [
        { tip: "Use destructuring for cleaner code!", code: "const { name, age } = user" },
        { tip: "Template literals are powerful!", code: "`Hello ${name}`" },
        { tip: "Arrow functions are shorter!", code: "const add = (a, b) => a + b" },
        { tip: "Use optional chaining!", code: "user?.address?.city" },
        { tip: "Nullish coalescing for defaults!", code: "const val = x ?? 'default'" },
    ],
    java: [
        { tip: "Use StringBuilder for string concat!", code: "sb.append(str)" },
        { tip: "Enhanced for-loop is cleaner!", code: "for (int x : arr) {}" },
        { tip: "var keyword for type inference!", code: "var list = new ArrayList<>()" },
        { tip: "Stream API for functional style!", code: "list.stream().filter(x -> x > 0)" },
        { tip: "Use Optional to avoid null!", code: "Optional.ofNullable(val)" },
    ],
}
const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
export function getTipOfTheDay() {
    const t = tips[_activeLang] || tips.python
    return t[dayOfYear % t.length]
}
// tipOfTheDay removed — use getTipOfTheDay() instead for correct language support

/* ── Code snippets (per-language) ── */
const codeSnippets = {
    python: {
        terminal: { lang: 'python', code: 'x = 10\\nprint(f"Value: {x}")\\n# Output: Value: 10' },
        brackets: { lang: 'python', code: 'if score >= 90:\n  grade = "A"\nelse:\n  grade = "B"' },
        play: { lang: 'python', code: 'for i in range(5):\n  print(i * 2)\n# 0, 2, 4, 6, 8' },
        search: { lang: 'python', code: 'def find_bug(arr):\n  for x in arr:\n    if x < 0:\n      return x' },
        pattern: { lang: 'python', code: 'matrix = [[1,2],[3,4]]\nfor row in matrix:\n  print(sum(row))' },
        boss: { lang: 'python', code: 'def fib(n):\n  if n <= 1: return n\n  return fib(n-1)+fib(n-2)' },
        scope: { lang: 'python', code: 'x = "global"\ndef f():\n  x = "local"\n  print(x)  # local' },
    },
    javascript: {
        terminal: { lang: 'javascript', code: 'const x = 10\nconsole.log(`Value: ${x}`)\n// Output: Value: 10' },
        brackets: { lang: 'javascript', code: 'if (score >= 90) {\n  grade = "A"\n} else {\n  grade = "B"\n}' },
        play: { lang: 'javascript', code: 'for (let i = 0; i < 5; i++) {\n  console.log(i * 2)\n}\n// 0, 2, 4, 6, 8' },
        search: { lang: 'javascript', code: 'function findBug(arr) {\n  for (const x of arr) {\n    if (x < 0) return x\n  }\n}' },
        pattern: { lang: 'javascript', code: 'const matrix = [[1,2],[3,4]]\nmatrix.forEach(row =>\n  console.log(row.reduce((a,b)=>a+b)))' },
        boss: { lang: 'javascript', code: 'function fib(n) {\n  if (n <= 1) return n\n  return fib(n-1)+fib(n-2)\n}' },
        scope: { lang: 'javascript', code: 'let x = "global"\nfunction f() {\n  let x = "local"\n  console.log(x) // local\n}' },
    },
    java: {
        terminal: { lang: 'java', code: 'int x = 10;\nSystem.out.println("Value: " + x);\n// Output: Value: 10' },
        brackets: { lang: 'java', code: 'if (score >= 90) {\n  grade = "A";\n} else {\n  grade = "B";\n}' },
        play: { lang: 'java', code: 'for (int i = 0; i < 5; i++) {\n  System.out.println(i * 2);\n}\n// 0, 2, 4, 6, 8' },
        search: { lang: 'java', code: 'static int findBug(int[] arr) {\n  for (int x : arr) {\n    if (x < 0) return x;\n  }\n  return 0;\n}' },
        pattern: { lang: 'java', code: 'int[][] matrix = {{1,2},{3,4}};\nfor (int[] row : matrix) {\n  System.out.println(\n    Arrays.stream(row).sum());\n}' },
        boss: { lang: 'java', code: 'static int fib(int n) {\n  if (n <= 1) return n;\n  return fib(n-1)+fib(n-2);\n}' },
        scope: { lang: 'java', code: 'String x = "global";\nvoid f() {\n  String x = "local";\n  System.out.println(x); // local\n}' },
    },
}

/* ── Nodes ── */
export const journeyNodes = [
    // CH 1 — Basics ⭐
    { id: 1, type: 'lesson', status: 'active', title: 'Read & Trace', stars: 0, iconKey: 'terminal', skill: 'variables', chapter: 1 },
    { id: 2, type: 'lesson', status: 'locked', title: 'Debug It!', stars: 0, iconKey: 'brackets', skill: 'conditionals', chapter: 1 },
    { id: 3, type: 'concept', status: 'locked', title: 'Learn: Variables', stars: 0, iconKey: 'concept', skill: 'variables', chapter: 1, concept: { cards: 6, minutes: 2 } },
    { id: 4, type: 'chest', status: 'locked', title: 'Loot Crate', stars: 0, iconKey: 'chest', skill: null, chapter: 1 },
    // CH 2 — Flow Control ⭐
    { id: 5, type: 'lesson', status: 'locked', title: 'Conditional Logic', stars: 0, iconKey: 'brackets', skill: 'conditionals', chapter: 2 },
    { id: 6, type: 'lesson', status: 'locked', title: 'Boolean Mastery', stars: 0, iconKey: 'pattern', skill: 'conditionals', chapter: 2 },
    { id: 7, type: 'daily', status: 'locked', title: "Today's Challenge", stars: 0, iconKey: 'daily', skill: 'mixed', chapter: 2 },
    { id: 8, type: 'concept', status: 'locked', title: 'Learn: Conditionals', stars: 0, iconKey: 'concept', skill: 'conditionals', chapter: 2, concept: { cards: 6, minutes: 2 } },
    // CH 3 — Loops ⭐⭐
    { id: 9, type: 'lesson', status: 'locked', title: 'Loop Basics', stars: 0, iconKey: 'play', skill: 'loops', chapter: 3 },
    { id: 10, type: 'lesson', status: 'locked', title: 'Nested Loops', stars: 0, iconKey: 'pattern', skill: 'loops', chapter: 3 },
    { id: 11, type: 'playground', status: 'locked', title: 'Try: Loops', stars: 0, iconKey: 'playground', skill: 'loops', chapter: 3, playground: { starterCode: { python: 'for i in range(5):\n  print(i)', javascript: 'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}', java: 'for (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}' }, expectedOutput: '0\n1\n2\n3\n4' } },
    { id: 12, type: 'chest', status: 'locked', title: 'Loot Crate', stars: 0, iconKey: 'chest', skill: null, chapter: 3 },
    // CH 4 — Functions ⭐⭐
    { id: 13, type: 'lesson', status: 'locked', title: 'Function Design', stars: 0, iconKey: 'scope', skill: 'functions', chapter: 4 },
    { id: 14, type: 'lesson', status: 'locked', title: 'Scope & Closures', stars: 0, iconKey: 'scope', skill: 'functions', chapter: 4 },
    { id: 15, type: 'concept', status: 'locked', title: 'Learn: Functions', stars: 0, iconKey: 'concept', skill: 'functions', chapter: 4, concept: { cards: 6, minutes: 2 } },
    { id: 16, type: 'boss', status: 'locked', title: 'Boss: Recursion', stars: 0, iconKey: 'boss', skill: 'functions', chapter: 4 },
    // CH 5 — Data Structures I ⭐⭐
    { id: 17, type: 'lesson', status: 'locked', title: 'Arrays Deep', stars: 0, iconKey: 'pattern', skill: 'data_structures', chapter: 5 },
    { id: 18, type: 'lesson', status: 'locked', title: 'Strings & Maps', stars: 0, iconKey: 'search', skill: 'data_structures', chapter: 5 },
    { id: 19, type: 'playground', status: 'locked', title: 'Try: Collections', stars: 0, iconKey: 'playground', skill: 'data_structures', chapter: 5, playground: { starterCode: { python: 'counts = {}\nfor c in "hello":\n  counts[c] = counts.get(c, 0) + 1\nprint(counts)', javascript: 'const counts = {};\nfor (const c of "hello") {\n  counts[c] = (counts[c] || 0) + 1;\n}\nconsole.log(counts);', java: 'Map<Character,Integer> counts = new HashMap<>();\nfor (char c : "hello".toCharArray()) {\n    counts.merge(c, 1, Integer::sum);\n}\nSystem.out.println(counts);' }, expectedOutput: "{'h': 1, 'e': 1, 'l': 2, 'o': 1}" } },
    { id: 20, type: 'chest', status: 'locked', title: 'Loot Crate', stars: 0, iconKey: 'chest', skill: null, chapter: 5 },
    // CH 6 — Algorithms I ⭐⭐⭐
    { id: 21, type: 'lesson', status: 'locked', title: 'Sorting Showdown', stars: 0, iconKey: 'pattern', skill: 'algorithms', chapter: 6 },
    { id: 22, type: 'lesson', status: 'locked', title: 'Binary Search', stars: 0, iconKey: 'search', skill: 'algorithms', chapter: 6 },
    { id: 23, type: 'lesson', status: 'locked', title: 'Time Complexity', stars: 0, iconKey: 'scope', skill: 'complexity', chapter: 6 },
    { id: 24, type: 'boss', status: 'locked', title: 'Boss: Algorithms', stars: 0, iconKey: 'boss', skill: 'algorithms', chapter: 6 },
    // CH 7 — Data Structures II ⭐⭐⭐
    { id: 25, type: 'lesson', status: 'locked', title: 'Stack & Queue', stars: 0, iconKey: 'pattern', skill: 'data_structures', chapter: 7 },
    { id: 26, type: 'lesson', status: 'locked', title: 'Linked Lists', stars: 0, iconKey: 'play', skill: 'data_structures', chapter: 7 },
    { id: 27, type: 'lesson', status: 'locked', title: 'Trees Intro', stars: 0, iconKey: 'scope', skill: 'data_structures', chapter: 7 },
    { id: 28, type: 'concept', status: 'locked', title: 'Learn: Structures', stars: 0, iconKey: 'concept', skill: 'data_structures', chapter: 7, concept: { cards: 6, minutes: 2 } },
    // CH 8 — Algorithms II ⭐⭐⭐⭐
    { id: 29, type: 'lesson', status: 'locked', title: 'Recursive Thinking', stars: 0, iconKey: 'scope', skill: 'algorithms', chapter: 8 },
    { id: 30, type: 'lesson', status: 'locked', title: 'Divide & Conquer', stars: 0, iconKey: 'pattern', skill: 'algorithms', chapter: 8 },
    { id: 31, type: 'lesson', status: 'locked', title: 'Memoization & DP', stars: 0, iconKey: 'search', skill: 'dp', chapter: 8 },
    { id: 32, type: 'boss', status: 'locked', title: 'Boss: Recursion++', stars: 0, iconKey: 'boss', skill: 'algorithms', chapter: 8 },
    // CH 9 — Advanced ⭐⭐⭐⭐
    { id: 33, type: 'lesson', status: 'locked', title: 'Graph Basics', stars: 0, iconKey: 'pattern', skill: 'graphs', chapter: 9 },
    { id: 34, type: 'lesson', status: 'locked', title: 'BFS & DFS', stars: 0, iconKey: 'search', skill: 'graphs', chapter: 9 },
    { id: 35, type: 'lesson', status: 'locked', title: 'Two Pointer', stars: 0, iconKey: 'play', skill: 'algorithms', chapter: 9 },
    { id: 36, type: 'playground', status: 'locked', title: 'Try: Graphs', stars: 0, iconKey: 'playground', skill: 'graphs', chapter: 9, playground: { starterCode: { python: 'graph = {"A": ["B","C"], "B": ["D"], "C": [], "D": []}\nvisited = set()\ndef dfs(node):\n  if node in visited: return\n  visited.add(node)\n  print(node)\n  for n in graph[node]: dfs(n)\ndfs("A")', javascript: 'const graph = {A:["B","C"], B:["D"], C:[], D:[]};\nconst visited = new Set();\nfunction dfs(node) {\n  if (visited.has(node)) return;\n  visited.add(node);\n  console.log(node);\n  for (const n of graph[node]) dfs(n);\n}\ndfs("A");', java: 'Map<String,List<String>> graph = Map.of(\n    "A",List.of("B","C"), "B",List.of("D"),\n    "C",List.of(), "D",List.of());\nSet<String> visited = new HashSet<>();\nvoid dfs(String node) {\n    if (!visited.add(node)) return;\n    System.out.println(node);\n    for (String n : graph.get(node)) dfs(n);\n}\ndfs("A");' }, expectedOutput: 'A\nB\nD\nC' } },
    // CH 10 — Mastery ⭐⭐⭐⭐
    { id: 37, type: 'lesson', status: 'locked', title: 'DP Patterns', stars: 0, iconKey: 'scope', skill: 'dp', chapter: 10 },
    { id: 38, type: 'lesson', status: 'locked', title: 'Problem Strategy', stars: 0, iconKey: 'search', skill: 'algorithms', chapter: 10 },
    { id: 39, type: 'lesson', status: 'locked', title: 'Interview Sim', stars: 0, iconKey: 'terminal', skill: 'algorithms', chapter: 10 },
    { id: 40, type: 'boss', status: 'locked', title: 'Final Boss', stars: 0, iconKey: 'boss', skill: 'algorithms', chapter: 10 },
    { id: 41, type: 'chest', status: 'locked', title: 'Gold Chest', stars: 0, iconKey: 'chest', skill: null, chapter: 10 },
    { id: 42, type: 'daily', status: 'locked', title: 'Graduation 🎓', stars: 0, iconKey: 'daily', skill: 'mixed', chapter: 10 },
]

export function getCodeSnippet(k) { return codeSnippets[_activeLang]?.[k] || codeSnippets.python?.[k] || null }

/* ── Chapter colors ── */
export const chapterColors = {
    1: { accent: '#58CC02', name: 'Basics' },
    2: { accent: '#CE82FF', name: 'Flow Control' },
    3: { accent: '#1CB0F6', name: 'Loops' },
    4: { accent: '#FF9600', name: 'Functions' },
    5: { accent: '#FF4B4B', name: 'Data Struct I' },
    6: { accent: '#2DD4BF', name: 'Algorithms I' },
    7: { accent: '#F472B6', name: 'Data Struct II' },
    8: { accent: '#818CF8', name: 'Algorithms II' },
    9: { accent: '#FB923C', name: 'Advanced' },
    10: { accent: '#FCD34D', name: 'Mastery' },
}

/* ── Mood system ── */
export function getOtterMood(streak, nextNodeType) {
    const hour = new Date().getHours()
    if (nextNodeType === 'boss') return { face: 'determined', bubble: t('Boss time! ⚔️') }
    if (nextNodeType === 'chest') return { face: 'excited', bubble: t('Loot time! 🎁') }
    if (streak >= 7) return { face: 'cool', bubble: t('On fire! 🔥') }
    // "Miss you" only makes sense to someone who has actually been here before.
    // A first-time user was being greeted by a sad otter on the very first screen.
    if (streak === 0 && profile.daysLearning > 1) return { face: 'sad', bubble: t('Miss you! 💔') }
    if (streak === 0) return { face: 'happy', bubble: t('Welcome! 👋') }
    if (hour < 10) return { face: 'sleepy', bubble: t('Good morning! ☕') }
    if (hour >= 22) return { face: 'sleepy', bubble: t('Late night coding! 🌙') }
    return { face: 'happy', bubble: t("Let's code! 🚀") }
}

/* ── Skill Radar (dynamic from lesson performance) ── */
// Scores come from each node's own `skill` tag rather than a chapter range —
// skills don't line up with chapters (Time Complexity is CH6, not CH9) and the
// tag is the thing content authors actually maintain.
const SKILL_LABELS = {
    variables: 'Variables',
    conditionals: 'Conditionals',
    loops: 'Loops',
    functions: 'Functions',
    data_structures: 'Data Struct.',
    algorithms: 'Algorithms',
    complexity: 'Complexity',
    graphs: 'Graphs',
    dp: 'Dyn.Program',
}
// Must be called at render time, not at module load: journeyNodes are still at
// their default state until loadProgress() runs, so a frozen snapshot is all zeros.
export function getSkillRadar() {
    const result = {}
    Object.entries(SKILL_LABELS).forEach(([key, label]) => {
        const skillNodes = journeyNodes.filter(n => n.skill === key && n.type === 'lesson')
        const totalStars = skillNodes.reduce((sum, n) => sum + (n.status === 'completed' ? (n.stars || 0) : 0), 0)
        const maxStars = skillNodes.length * 3
        result[key] = { label, score: maxStars > 0 ? Math.round((totalStars / maxStars) * 100) : 0 }
    })
    return result
}

/* ── Achievements (mascot-themed) ── */
const _savedAchievements = loadSaved('rheo_achievements', null)
export const achievements = [
    { id: 'first_star', icon: '🦦⭐', title: 'First Star', desc: 'Earn your first star', mascot: 'proud', check: () => journeyNodes.some(n => n.stars > 0) },
    { id: 'streak_3', icon: '🦦🔥', title: 'Hot Streak', desc: '3-day streak', mascot: 'cool', check: () => stats.streak >= 3 },
    { id: 'streak_7', icon: '🦦🏆', title: 'Week Warrior', desc: '7-day streak', mascot: 'champion', check: () => stats.streak >= 7 },
    { id: 'perfect', icon: '🦦💎', title: 'Perfect Score', desc: '100% on a quiz', mascot: 'sparkle', check: () => (loadSaved('rheo_perfect_score', false)) },
    { id: 'streak_30', icon: '🦦👑', title: 'Monthly Master', desc: '30-day streak', mascot: 'king', check: () => stats.streak >= 30 },
    { id: 'ch1_complete', icon: '🦦📗', title: 'Ch.1 Done', desc: 'Complete Chapter 1', mascot: 'happy', check: () => journeyNodes.filter(n => n.chapter === 1 && n.status === 'completed').length >= 4 },
    { id: 'speed_demon', icon: '🦦⚡', title: 'Speed Demon', desc: 'Answer in <5 seconds', mascot: 'fast', check: () => (loadSaved('rheo_speed_demon', false)) },
    { id: 'bug_hunter', icon: '🦦🐛', title: 'Bug Hunter', desc: 'Find 10 bugs total', mascot: 'detective', check: () => (loadSaved('rheo_bugs_found', 0)) >= 10 },
    { id: 'gem_collector', icon: '🦦💰', title: 'Gem Hoarder', desc: 'Collect 500 gems', mascot: 'rich', check: () => stats.gems >= 500 },
    { id: 'duel_win', icon: '🦦⚔️', title: 'Duel Victor', desc: 'Win your first duel', mascot: 'warrior', check: () => (loadSaved('rheo_duel_wins', 0)) >= 1 },
    { id: 'lesson_10', icon: '🦦📚', title: '10 Lessons', desc: 'Complete 10 lessons', mascot: 'scholar', check: () => journeyNodes.filter(n => n.status === 'completed').length >= 10 },
    { id: 'boss_slayer', icon: '🦦💀', title: 'Boss Slayer', desc: 'Defeat a boss', mascot: 'hero', check: () => journeyNodes.some(n => n.type === 'boss' && n.status === 'completed') },
]
export function checkAchievements() {
    const unlocked = loadSaved('rheo_achievements', [])
    const newUnlocks = []
    achievements.forEach(a => {
        if (!unlocked.includes(a.id) && a.check()) {
            unlocked.push(a.id)
            newUnlocks.push(a)
        }
    })
    if (newUnlocks.length > 0) {
        saveTo('rheo_achievements', unlocked)
        newUnlocks.forEach(a => window.__showAchievement?.(a.icon, a.title, a.desc))
    }
    return unlocked
}
export function isAchievementUnlocked(id) {
    const unlocked = loadSaved('rheo_achievements', [])
    return unlocked.includes(id)
}

/* ── League Rankings → now dynamic, see Arena section below ── */

/* ── Profile ── */
const _savedProfile = loadSaved('rheo_profile', null)
export const profile = {
    name: _savedProfile?.name || 'Coder',
    level: _savedProfile?.level || 1,
    xpCurrent: _savedProfile?.xpCurrent || 0,
    xpNext: _savedProfile?.xpNext || 500,
    totalStars: _savedProfile?.totalStars || 0,
    maxStars: 30,
    daysLearning: _savedProfile?.daysLearning || 0,
    longestStreak: _savedProfile?.longestStreak || 0,
    lessonsCompleted: _savedProfile?.lessonsCompleted || 0,
    totalTimeMinutes: _savedProfile?.totalTimeMinutes || 0,
    accuracy: _savedProfile?.accuracy || 0,
    bugsFound: _savedProfile?.bugsFound || 0,
}

/* ── Quests ── */
const _months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const _now = new Date()
const _daysInMonth = new Date(_now.getFullYear(), _now.getMonth() + 1, 0).getDate()
const _daysLeftInMonth = _daysInMonth - _now.getDate()
/* ── Load persisted quest state ── */
function _loadQuestState() {
    try {
        return JSON.parse(localStorage.getItem('rheo_quest_state') || '{}')
    } catch(e) { return {} }
}
function _saveQuestState(state) {
    try { localStorage.setItem('rheo_quest_state', JSON.stringify(state)) } catch (e) { }
}
const _questState = _loadQuestState()

/* ── Monthly challenge pool — rotates by month ── */
const _monthlyChallenges = [
    { task: 'Complete 15 lessons this month', total: 15, event: 'complete_lesson' },
    { task: 'Earn 2000 XP this month', total: 2000, event: 'earn_xp' },
    { task: 'Win 10 duels this month', total: 10, event: 'win_duel' },
    { task: 'Find 20 bugs this month', total: 20, event: 'find_bug' },
    { task: 'Complete 30 exercises this month', total: 30, event: 'complete_exercise' },
    { task: 'Score 100% five times this month', total: 5, event: 'perfect_score' },
    { task: 'Complete 20 lessons this month', total: 20, event: 'complete_lesson' },
    { task: 'Earn 3000 XP this month', total: 3000, event: 'earn_xp' },
    { task: 'Win 15 duels this month', total: 15, event: 'win_duel' },
    { task: 'Find 30 bugs this month', total: 30, event: 'find_bug' },
    { task: 'Complete 40 exercises this month', total: 40, event: 'complete_exercise' },
    { task: 'Score 100% eight times this month', total: 8, event: 'perfect_score' },
]
const _monthlyChallenge = _monthlyChallenges[_now.getMonth() % _monthlyChallenges.length]

/* ── Weekly case study pool — rotates by week number ── */
const _weeklyCaseStudies = [
    {
        title: 'The Calculator Trap 🪤', desc: 'Bug hunting case study — find 3 hidden bugs', icon: '🪤',
        tasks: [
            { id: 'wb1', step: '🔍 Read: Review spaghetti code' },
            { id: 'wb2', step: '🐛 Hunt: Find operator precedence bug (Stack)' },
            { id: 'wb3', step: '🐛 Hunt: Find float error (0.1+0.2)' },
            { id: 'wb4', step: '🐛 Hunt: Find state crash bug (=→+)' },
            { id: 'wb5', step: '✨ Rise: Review Clean Code version' },
        ],
    },
    {
        title: 'API Meltdown 🔥', desc: 'REST API under attack — fix security holes', icon: '🔥',
        tasks: [
            { id: 'wb1', step: '🔍 Read: Inspect endpoint handlers' },
            { id: 'wb2', step: '🛡️ Fix: SQL injection vulnerability' },
            { id: 'wb3', step: '🛡️ Fix: Missing auth middleware' },
            { id: 'wb4', step: '🛡️ Fix: Rate limiter bypass' },
            { id: 'wb5', step: '✨ Rise: Write secure version' },
        ],
    },
    {
        title: 'Memory Leak Hunt 🕳️', desc: 'Performance debugging — find the memory hogs', icon: '🕳️',
        tasks: [
            { id: 'wb1', step: '🔍 Read: Profile the application' },
            { id: 'wb2', step: '🐛 Hunt: Find unclosed event listener' },
            { id: 'wb3', step: '🐛 Hunt: Find infinite array growth' },
            { id: 'wb4', step: '🐛 Hunt: Find circular reference' },
            { id: 'wb5', step: '✨ Rise: Apply garbage collection patterns' },
        ],
    },
    {
        title: 'Recursion Rescue 🔄', desc: 'Stack overflow crisis — optimize recursive calls', icon: '🔄',
        tasks: [
            { id: 'wb1', step: '🔍 Read: Trace the call stack' },
            { id: 'wb2', step: '⚡ Fix: Add memoization to fibonacci' },
            { id: 'wb3', step: '⚡ Fix: Convert to tail recursion' },
            { id: 'wb4', step: '⚡ Fix: Replace with iterative solution' },
            { id: 'wb5', step: '✨ Rise: Compare time complexities' },
        ],
    },
]
const _currentWeekNum = Math.ceil(((_now.getTime() - new Date(_now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)))
const _weeklyCase = _weeklyCaseStudies[_currentWeekNum % _weeklyCaseStudies.length]

/* ── Mystery quest pool — rotates daily ── */
const _mysteryPool = [
    { task: 'Complete a lesson without any mistakes', reward: '15 💎', xp: 150, event: 'perfect_score' },
    { task: 'Win 2 duels in a row', reward: '20 💎', xp: 200, event: 'win_duel' },
    { task: 'Earn 200 XP today', reward: '15 💎', xp: 100, event: 'earn_xp' },
    { task: 'Find 3 bugs in lessons', reward: '10 💎', xp: 120, event: 'find_bug' },
    { task: 'Complete 3 exercises', reward: '15 💎', xp: 150, event: 'complete_exercise' },
    { task: 'Complete 2 lessons today', reward: '20 💎', xp: 180, event: 'complete_lesson' },
    { task: 'Win a Blitz duel', reward: '25 💎', xp: 200, event: 'win_duel' },
    { task: 'Reach 300 XP today', reward: '20 💎', xp: 150, event: 'earn_xp' },
    { task: 'Complete a boss level', reward: '30 💎', xp: 250, event: 'complete_lesson' },
    { task: 'Find 5 bugs total', reward: '15 💎', xp: 130, event: 'find_bug' },
    { task: 'Complete 4 exercises', reward: '20 💎', xp: 160, event: 'complete_exercise' },
    { task: 'Win 3 duels today', reward: '25 💎', xp: 200, event: 'win_duel' },
    { task: 'Earn 500 XP today', reward: '30 💎', xp: 250, event: 'earn_xp' },
    { task: 'Complete a daily quest streak', reward: '20 💎', xp: 180, event: 'complete_exercise' },
]
const _daySeed = _now.toDateString().split('').reduce((a, c) => a + c.charCodeAt(0), 0)
const _todayMystery = _mysteryPool[_daySeed % _mysteryPool.length]

export const quests = {
    monthly: {
        title: `${_months[_now.getMonth()]} Sprint`,
        task: _monthlyChallenge.task,
        current: _questState.monthlyCurrent || 0,
        total: _monthlyChallenge.total,
        daysLeft: _daysLeftInMonth,
        month: _now.getMonth(),
        event: _monthlyChallenge.event,
    },
    weekend: {
        task: 'Complete 5 lessons & win 2 duels this weekend',
        current: _questState.weekendCurrent || 0,
        total: 7,
        hoursLeft: Math.max(0, (7 - _now.getDay()) * 24 - _now.getHours()),
    },
    weeklyBuild: {
        title: _weeklyCase.title,
        desc: _weeklyCase.desc,
        icon: _weeklyCase.icon,
        tasks: _weeklyCase.tasks.map(t => ({
            ...t, done: !!(_questState.weeklyDone || {})[t.id]
        })),
        reward: { type: 'xp', amount: 500 },
        daysLeft: Math.max(0, 7 - _now.getDay()),
        weekNum: _currentWeekNum,
    },
    mysteryQuest: {
        revealed: _questState.mysteryRevealed === new Date().toDateString(),
        completed: _questState.mysteryCompleted === new Date().toDateString(),
        hidden: { task: _todayMystery.task, reward: _todayMystery.reward, xp: _todayMystery.xp, event: _todayMystery.event },
    },
    daily: [], // filled by getDailyQuests()
}

/* ── Quest Progress Helpers ── */
export function updateQuestProgress(type, key, value) {
    const state = _loadQuestState()
    if (type === 'monthly') {
        state.monthlyCurrent = Math.min((state.monthlyCurrent || 0) + value, quests.monthly.total)
        state.monthlyMonth = _now.getMonth()
        quests.monthly.current = state.monthlyCurrent
    } else if (type === 'weekend') {
        state.weekendCurrent = Math.min((state.weekendCurrent || 0) + value, quests.weekend.total)
        quests.weekend.current = state.weekendCurrent
    } else if (type === 'weeklyBuild') {
        if (!state.weeklyDone) state.weeklyDone = {}
        state.weeklyDone[key] = true
        const task = quests.weeklyBuild.tasks.find(t => t.id === key)
        if (task) task.done = true
    } else if (type === 'mystery') {
        state.mysteryRevealed = new Date().toDateString()
        if (value) state.mysteryCompleted = new Date().toDateString()
        quests.mysteryQuest.revealed = true
        quests.mysteryQuest.completed = !!value
    }
    _saveQuestState(state)
}

// Auto-reset monthly if new month
if (_questState.monthlyMonth !== _now.getMonth()) {
    const state = _loadQuestState()
    if (state.monthlyMonth !== undefined) {
        state.monthlyCurrent = 0
        quests.monthly.current = 0
    }
    state.monthlyMonth = _now.getMonth()
    _saveQuestState(state)
}
// Auto-reset weekly if new week.
// weeklyWeek was only ever written inside this block, so on a fresh profile it
// stayed undefined and the reset could never fire — weekly build + weekend
// progress carried over forever. Stamp the current week whenever it is missing.
if (_questState.weeklyWeek !== _currentWeekNum) {
    const state = _loadQuestState()
    if (state.weeklyWeek !== undefined) {
        state.weeklyDone = {}
        state.weekendCurrent = 0
        quests.weeklyBuild.tasks.forEach(t => t.done = false)
        quests.weekend.current = 0
    }
    state.weeklyWeek = _currentWeekNum
    _saveQuestState(state)
}

/* ── Daily Quest Pool (seed-based rotation) ── */
const _questPool = [
    { id: 'd1', task: 'Complete a lesson', total: 1, reward: 'chest', color: '#FB923C', event: 'complete_lesson' },
    { id: 'd2', task: 'Read 50 lines of code', total: 50, reward: 'disk', color: '#58CC02', event: 'read_lines' },
    { id: 'd3', task: 'Find 3 bugs', total: 3, reward: 'chest', color: '#38BDF8', event: 'find_bug' },
    { id: 'd4', task: 'Score 100% on a quiz', total: 1, reward: 'gem', color: '#C084FC', event: 'perfect_score' },
    { id: 'd5', task: 'Win a duel', total: 1, reward: 'chest', color: '#EF4444', event: 'win_duel' },
    { id: 'd6', task: 'Earn 100 XP', total: 100, reward: 'gem', color: '#F59E0B', event: 'earn_xp' },
    { id: 'd7', task: 'Complete 2 exercises', total: 2, reward: 'disk', color: '#14B8A6', event: 'complete_exercise' },
]
function _seedRandom(seed) { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 } }
export function getDailyQuests() {
    const dayStr = new Date().toDateString()
    const seed = dayStr.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const rng = _seedRandom(seed)
    const shuffled = [..._questPool].sort(() => rng() - 0.5)
    
    // Load persisted progress
    let saved = {}
    try {
        const stored = JSON.parse(localStorage.getItem('rheo_daily_quests') || '{}')
        if (stored.date === dayStr && stored.progress) saved = stored.progress
    } catch (e) { }

    return shuffled.slice(0, 4).map((q, i) => {
        const id = i + 1
        return { ...q, id, current: saved[id] || 0 }
    })
}
quests.daily = getDailyQuests()

/* ── Quest Event Tracking ── */
export function trackQuestEvent(eventName, amount = 1) {
    try {
        // The Flawless achievement reads this flag directly rather than going
        // through quest progress, so the event has to set it or the badge can
        // never unlock no matter how many perfect lessons are played.
        if (eventName === 'perfect_score') saveTo('rheo_perfect_score', true)
        let saved = JSON.parse(localStorage.getItem('rheo_daily_quests') || '{}')
        const today = new Date().toDateString()
        // Auto-init if no date or different day
        if (saved.date !== today) {
            saved = { date: today, progress: {}, collected: {} }
            localStorage.setItem('rheo_daily_quests', JSON.stringify(saved))
        }
        const progress = saved.progress || {}
        quests.daily.forEach(q => {
            if (q.event === eventName) {
                const taskId = q.id
                progress[taskId] = Math.min((progress[taskId] || 0) + amount, q.total)
            }
        })
        saved.progress = progress
        localStorage.setItem('rheo_daily_quests', JSON.stringify(saved))

        // Monthly quest — dynamic event matching
        if (quests.monthly.event && eventName === quests.monthly.event) {
            updateQuestProgress('monthly', null, amount)
        }
        // Weekend quest — counts lessons and duel wins
        if (eventName === 'complete_lesson' || eventName === 'win_duel') {
            updateQuestProgress('weekend', null, amount)
        }
        // Mystery quest — auto-track if revealed and matching event
        if (quests.mysteryQuest.revealed && !quests.mysteryQuest.completed && quests.mysteryQuest.hidden.event === eventName) {
            // Track mystery progress in localStorage
            const mState = _loadQuestState()
            const mProgress = (mState.mysteryProgress || 0) + amount
            mState.mysteryProgress = mProgress
            mState.mysteryProgressDate = today
            _saveQuestState(mState)
        }
    } catch (e) { }
}
window.__trackQuest = trackQuestEvent

/* ── Mystery Quest Progress Helper ── */
export function getMysteryProgress() {
    const state = _loadQuestState()
    const today = new Date().toDateString()
    if (state.mysteryProgressDate !== today) return 0
    return state.mysteryProgress || 0
}

export const journeyPowerUps = [
    { id: 'double_xp', icon: '⚡', name: 'Double XP', desc: '2x XP for 1 lesson', price: 100, type: 'consumable' },
    { id: 'extra_heart', icon: '❤️', name: 'Extra Heart', desc: '+1 heart in lesson', price: 30, type: 'consumable' },
    { id: 'hint_token', icon: '🔮', name: 'Hint Token', desc: 'Show hint token', price: 25, type: 'consumable' },
    { id: 'skip_token', icon: '🎯', name: 'Skip Token', desc: 'Skip hard question', price: 75, type: 'consumable' },
]
export function buyPowerUp(id) {
    const item = journeyPowerUps.find(p => p.id === id)
    if (!item || stats.gems < item.price) return false
    stats.gems -= item.price
    const inv = loadSaved('rheo_powerups', {})
    inv[id] = (inv[id] || 0) + 1
    saveTo('rheo_powerups', inv)
    saveProgress()
    return true
}
export function getPowerUpCount(id) {
    return (loadSaved('rheo_powerups', {}))[id] || 0
}
export function consumePowerUp(id) {
    const inv = loadSaved('rheo_powerups', {})
    if (!inv[id] || inv[id] <= 0) return false
    inv[id] -= 1
    if (inv[id] === 0) delete inv[id]
    saveTo('rheo_powerups', inv)
    return true
}

/* ══════════════════════════════════════════
   HINT CREDITS
   A hint that costs nothing gets tapped on every question, and a question
   answered with its hint open teaches nothing — the learner reads the
   reasoning instead of producing it. Three a day makes the choice real:
   spend one where you are genuinely stuck. Past that a Hint Token (gems,
   earned or bought) buys one more, so a hard day is never a hard wall.
   ══════════════════════════════════════════ */
export const DAILY_HINT_CREDITS = 3
const HINT_KEY = 'rheo_hint_credits'

function _loadHintState() {
    const saved = loadSaved(HINT_KEY, {})
    const today = new Date().toDateString()
    // Stored as a date string, so the allowance refills at the learner's own
    // local midnight and a timezone change can only ever grant, never revoke.
    if (saved.date !== today) return { date: today, used: 0 }
    return { date: today, used: saved.used || 0 }
}

export function getHintCredits() {
    const state = _loadHintState()
    return {
        free: Math.max(0, DAILY_HINT_CREDITS - state.used),
        tokens: getPowerUpCount('hint_token'),
        max: DAILY_HINT_CREDITS,
    }
}

/** Spends one hint. Returns 'free' | 'token' | null (nothing left to spend). */
export function spendHintCredit() {
    const state = _loadHintState()
    if (state.used < DAILY_HINT_CREDITS) {
        saveTo(HINT_KEY, { date: state.date, used: state.used + 1 })
        return 'free'
    }
    if (consumePowerUp('hint_token')) return 'token'
    return null
}

/* ══════════════════════════════════════════
   XP MOTIVATION SYSTEM
   ══════════════════════════════════════════ */

/* ── Daily XP Goal ── */
export function getUserDailyXPGoal() {
    try {
        const saved = localStorage.getItem('rheo_target_xp')
        if (saved) return parseInt(saved)
    } catch(e) {}
    return 100 // default 100
}

export function setDailyXPGoal(amount) {
    try { localStorage.setItem('rheo_target_xp', amount.toString()) } catch(e) {}
}

export function getDailyXPGoal() {
    const saved = loadSaved('rheo_daily_goal', {})
    const today = new Date().toDateString()
    const targetXp = getUserDailyXPGoal()
    if (saved.date !== today) {
        return { date: today, xpEarned: 0, completed: false, streak: saved.goalStreak || 0, targetXp }
    }
    return { ...saved, targetXp }
}
export function updateDailyXPGoal(xpAmount) {
    const goal = getDailyXPGoal()
    goal.xpEarned = (goal.xpEarned || 0) + xpAmount
    goal.date = new Date().toDateString()
    if (!goal.completed && goal.xpEarned >= goal.targetXp) {
        goal.completed = true
        goal.goalStreak = (goal.goalStreak || 0) + 1
        // Bonus gems for hitting daily goal
        const bonus = Math.min(goal.goalStreak * 5, 50)
        stats.gems += bonus
        window.__showAchievement?.('🎯', t('Daily Goal!'), `+${bonus} 💎 bonus`)
    }
    saveTo('rheo_daily_goal', goal)
    return goal
}

/* ── XP Milestones ── */
export const xpMilestones = [
    { xp: 100, icon: '🌱', title: 'Sprout', reward: '25 💎', gems: 25, desc: t('First 100 XP!') },
    { xp: 500, icon: '🌿', title: 'Sapling', reward: '50 💎 + Theme', gems: 50, desc: t('Just the beginning'), unlockTheme: 'ocean' },
    { xp: 1000, icon: '🌳', title: 'Tree', reward: '100 💎 + Theme', gems: 100, desc: t('A thousand congrats!'), unlockTheme: 'sunset' },
    { xp: 2500, icon: '🏔️', title: 'Mountain', reward: '200 💎 + Theme', gems: 200, desc: t('Heading to the top'), unlockTheme: 'aurora' },
    { xp: 5000, icon: '🚀', title: 'Rocket', reward: '500 💎 + Theme', gems: 500, desc: t('Space adventurer'), unlockTheme: 'neon' },
    { xp: 10000, icon: '👑', title: 'Legend', reward: '1000 💎 + Crown', gems: 1000, desc: t('Legend!'), unlockTheme: 'gold' },
]
export function checkMilestones(totalXP) {
    const claimed = loadSaved('rheo_milestones', [])
    const newMilestones = []
    xpMilestones.forEach(m => {
        if (totalXP >= m.xp && !claimed.includes(m.xp)) {
            claimed.push(m.xp)
            stats.gems += m.gems
            newMilestones.push(m)
            if (m.unlockTheme) unlockTheme(m.unlockTheme)
            window.__showAchievement?.(m.icon, m.title, m.reward)
        }
    })
    if (newMilestones.length > 0) saveTo('rheo_milestones', claimed)
    return claimed
}
export function isMilestoneClaimed(xp) {
    return (loadSaved('rheo_milestones', [])).includes(xp)
}

/* ── App Themes ── */
export const appThemes = [
    { id: 'default', name: 'Midnight', colors: { bg: '#0f172a', accent: '#14b8a6', card: '#1e293b' }, icon: '🌙', unlockXP: 0 },
    { id: 'ocean', name: 'Deep Ocean', colors: { bg: '#0c1524', accent: '#0ea5e9', card: '#162234' }, icon: '🌊', unlockXP: 500 },
    { id: 'sunset', name: 'Sunset', colors: { bg: '#1a0f1e', accent: '#f97316', card: '#2d1a2e' }, icon: '🌅', unlockXP: 1000 },
    { id: 'aurora', name: 'Aurora', colors: { bg: '#0f1a1a', accent: '#34d399', card: '#1a2d2d' }, icon: '🌌', unlockXP: 2500 },
    { id: 'neon', name: 'Neon City', colors: { bg: '#0d0d1a', accent: '#a855f7', card: '#1a1a2e' }, icon: '💜', unlockXP: 5000 },
    { id: 'gold', name: 'Royal Gold', colors: { bg: '#1a1408', accent: '#f59e0b', card: '#2d250f' }, icon: '👑', unlockXP: 10000 },
]
export function unlockTheme(themeId) {
    const unlocked = loadSaved('rheo_themes', ['default'])
    if (!unlocked.includes(themeId)) {
        unlocked.push(themeId)
        saveTo('rheo_themes', unlocked)
    }
}
export function getUnlockedThemes() { return loadSaved('rheo_themes', ['default']) }
export function getActiveTheme() { return loadSaved('rheo_active_theme', 'default') }
export function setActiveTheme(themeId) {
    const unlocked = getUnlockedThemes()
    if (unlocked.includes(themeId)) saveTo('rheo_active_theme', themeId)
}

/* ── Level Perks ── */
export const levelPerks = [
    { level: 2, icon: '🎨', perk: t('Costume Shop unlocked'), type: 'feature' },
    { level: 3, icon: '⚡', perk: t('Power-Up Shop unlocked'), type: 'feature' },
    { level: 5, icon: '🌊', perk: t('Ocean theme unlocked'), type: 'theme', themeId: 'ocean' },
    { level: 7, icon: '⚔️', perk: t('Duel mode unlocked'), type: 'feature' },
    { level: 10, icon: '🌅', perk: t('Sunset theme unlocked'), type: 'theme', themeId: 'sunset' },
    { level: 15, icon: '🏆', perk: t('Weekly tournament access'), type: 'feature' },
    { level: 20, icon: '🌌', perk: t('Aurora theme unlocked'), type: 'theme', themeId: 'aurora' },
    { level: 25, icon: '💜', perk: t('Neon City theme unlocked'), type: 'theme', themeId: 'neon' },
    { level: 30, icon: '👑', perk: t('Royal Gold theme + Legend badge'), type: 'theme', themeId: 'gold' },
]

/* ── XP Multiplier Display ── */
export function getXPMultiplier() {
    const streakMult = stats.streak >= 7 ? 3 : stats.streak >= 3 ? 2 : 1
    const hasDoubleXP = getPowerUpCount('double_xp') > 0
    const dailyGoal = getDailyXPGoal()
    const goalBonus = dailyGoal.goalStreak >= 5 ? 1.5 : dailyGoal.goalStreak >= 3 ? 1.25 : 1
    return {
        streak: streakMult,
        doubleXP: hasDoubleXP ? 2 : 1,
        goalBonus,
        total: streakMult * (hasDoubleXP ? 2 : 1) * goalBonus,
        label: streakMult > 1 || hasDoubleXP ? `${Math.round(streakMult * (hasDoubleXP ? 2 : 1) * goalBonus * 10) / 10}x` : null,
    }
}

/* ── Total XP Calculator ── */
// Level N costs 500 + (N-1)*100 XP (see addXP), so the cumulative cost of
// reaching level L is the sum of that series — not a flat 500 per level.
// The old flat formula under-reported lifetime XP from level 3 onward, which
// silently held back milestone rewards and theme unlocks.
export function getTotalXP() {
    const levelsCleared = profile.level - 1
    const spent = levelsCleared * 500 + (levelsCleared * (levelsCleared - 1) / 2) * 100
    return spent + profile.xpCurrent
}

const _savedStats = loadSaved(STATS_KEY, null)

// ── Energy auto-refill based on elapsed time ──
const MAX_ENERGY = 5
const ENERGY_REFILL_MS = 30 * 60 * 1000 // 30 minutes per energy
// Returns { energy, lastEnergyRefill } for a given saved state. The refill
// anchor MUST advance by exactly the time that was converted into energy —
// otherwise it stays pinned at the first-ever use and every reload regenerates
// a full bar from the same elapsed window.
function _calcEnergy(savedE, lastRefill, now = Date.now()) {
    if (savedE >= MAX_ENERGY) return { energy: MAX_ENERGY, lastEnergyRefill: now }
    const elapsed = Math.max(0, now - lastRefill)
    const refilled = Math.floor(elapsed / ENERGY_REFILL_MS)
    const energy = Math.min(savedE + refilled, MAX_ENERGY)
    // Full bar: the anchor is meaningless until the next spend, so reset it.
    // Partial: carry the leftover remainder so progress toward the next unit is kept.
    const lastEnergyRefill = energy >= MAX_ENERGY ? now : lastRefill + refilled * ENERGY_REFILL_MS
    return { energy, lastEnergyRefill }
}

const _initialEnergy = _calcEnergy(
    _savedStats?.energy ?? MAX_ENERGY,
    _savedStats?.lastEnergyRefill || Date.now(),
)

export const stats = {
    get language() { const lang = languages.find(lg => lg.id === _activeLang); return lang || languages[0] },
    streak: _savedStats?.streak ?? 0,
    gems: _savedStats?.gems ?? 0,
    energy: _initialEnergy.energy,
    xpToday: _savedStats?.xpToday ?? 0,
    streakShield: _savedStats?.streakShield ?? false,
    lastEnergyRefill: _initialEnergy.lastEnergyRefill,
    // Which chest nodes have already paid out. Without this the reward was
    // re-granted every time the modal was reopened.
    chestsOpened: _savedStats?.chestsOpened ?? [],
}

/* ── Chests ──
   A chest is earned, not tapped: the node runs a short lesson first, and the
   reward is collected once the node is completed. */
const CHEST_REWARDS = [
    { emoji: '💎', label: 'Gems', type: 'gems', amount: 15 },
    { emoji: '💎', label: 'Gems', type: 'gems', amount: 25 },
    { emoji: '💎', label: 'Gems', type: 'gems', amount: 40 },
    { emoji: '⭐', label: 'XP', type: 'xp', amount: 30 },
    { emoji: '⭐', label: 'XP', type: 'xp', amount: 50 },
    { emoji: '⚡', label: 'Energy', type: 'energy', amount: 10 },
    { emoji: '⚡', label: 'Energy', type: 'energy', amount: 15 },
]

export function isChestOpened(nodeId) { return stats.chestsOpened.includes(nodeId) }

export function openChest(nodeId) {
    if (isChestOpened(nodeId)) return null
    const pick = CHEST_REWARDS[Math.floor(Math.random() * CHEST_REWARDS.length)]
    if (pick.type === 'gems') stats.gems = (stats.gems || 0) + pick.amount
    else if (pick.type === 'energy') stats.energy = (stats.energy || 0) + pick.amount
    else if (pick.type === 'xp') addXP(pick.amount)
    stats.chestsOpened = [...stats.chestsOpened, nodeId]
    saveProgress()
    return pick
}

// ── Energy functions ──
// Applies any refill earned since the last check. Call before reading or
// spending energy so a long-running session regenerates too, not just a reload.
export function refreshEnergy() {
    const { energy, lastEnergyRefill } = _calcEnergy(stats.energy, stats.lastEnergyRefill)
    const changed = energy !== stats.energy || lastEnergyRefill !== stats.lastEnergyRefill
    stats.energy = energy
    stats.lastEnergyRefill = lastEnergyRefill
    return changed
}

export function useEnergy() {
    refreshEnergy()
    if (stats.energy <= 0) return false
    // Leaving a full bar starts the refill clock now.
    if (stats.energy >= MAX_ENERGY) stats.lastEnergyRefill = Date.now()
    stats.energy -= 1
    saveProgress()
    return true
}

export function getEnergyRefillTime() {
    refreshEnergy()
    if (stats.energy >= MAX_ENERGY) return null
    const elapsed = Date.now() - stats.lastEnergyRefill
    const remaining = ENERGY_REFILL_MS - (elapsed % ENERGY_REFILL_MS)
    return Math.ceil(remaining / 60000) // minutes
}

export { MAX_ENERGY }

/* ── Spaced Repetition — Track weak questions ── */
const WEAK_KEY = 'rheo_weak_questions'
export function trackWrongAnswer(nodeId, exerciseIndex, exerciseType) {
    try {
        const saved = JSON.parse(localStorage.getItem(WEAK_KEY) || '[]')
        // Avoid duplicates within same day
        const today = new Date().toDateString()
        const exists = saved.find(q => q.nodeId === nodeId && q.exerciseIndex === exerciseIndex && q.date === today)
        if (!exists) {
            saved.push({ nodeId, exerciseIndex, exerciseType, date: today, attempts: 1, lastSeen: Date.now() })
            // Keep only last 50 entries
            while (saved.length > 50) saved.shift()
            localStorage.setItem(WEAK_KEY, JSON.stringify(saved))
        } else {
            exists.attempts = (exists.attempts || 0) + 1
            exists.lastSeen = Date.now()
            localStorage.setItem(WEAK_KEY, JSON.stringify(saved))
        }
    } catch (e) { }
}
export function getWeakExercises() {
    try {
        return JSON.parse(localStorage.getItem(WEAK_KEY) || '[]')
    } catch(e) { return [] }
}
export function clearWeakExercise(nodeId, exerciseIndex) {
    try {
        const saved = JSON.parse(localStorage.getItem(WEAK_KEY) || '[]')
        const filtered = saved.filter(q => !(q.nodeId === nodeId && q.exerciseIndex === exerciseIndex))
        localStorage.setItem(WEAK_KEY, JSON.stringify(filtered))
    } catch (e) { }
}

/* ── Leaderboard Seasonal Reset ── */
const SEASON_KEY = 'rheo_season'
export function getSeasonInfo() {
    const now = new Date()
    const weekNum = Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))
    const seasonNum = Math.ceil(weekNum / 4) // New season every 4 weeks
    const saved = loadSaved(SEASON_KEY, { season: 0 })
    const isNewSeason = saved.season !== seasonNum
    return { seasonNum, weekNum, isNewSeason, daysLeft: 7 - now.getDay() }
}
export function resetSeasonIfNeeded() {
    const info = getSeasonInfo()
    if (info.isNewSeason) {
        // Reset weekly ELO by 20% toward 1000 (soft reset)
        const ds = loadSaved('rheo_duelStats', {})
        if (ds.langElo) {
            Object.keys(ds.langElo).forEach(lang => {
                ds.langElo[lang] = Math.round(1000 + (ds.langElo[lang] - 1000) * 0.8)
            })
            saveTo('rheo_duelStats', ds)
        }
        saveTo(SEASON_KEY, { season: info.seasonNum })
    }
    return info
}

/* ── Save/Load Progress ── */
export function saveProgress() {
    const nodeData = journeyNodes.map(n => ({ id: n.id, status: n.status, stars: n.stars }))
    saveTo(STORAGE_KEY, nodeData)
    saveTo(STATS_KEY, {
        streak: stats.streak, gems: stats.gems, energy: stats.energy,
        xpToday: stats.xpToday, streakShield: stats.streakShield,
        lastEnergyRefill: stats.lastEnergyRefill,
        chestsOpened: stats.chestsOpened,
        lastSaveDate: new Date().toDateString(),
    })
    // Save profile
    saveTo('rheo_profile', {
        name: profile.name, level: profile.level,
        xpCurrent: profile.xpCurrent, xpNext: profile.xpNext,
        totalStars: journeyNodes.reduce((s, n) => s + (n.stars || 0), 0),
        daysLearning: profile.daysLearning,
        longestStreak: Math.max(profile.longestStreak, stats.streak),
        lessonsCompleted: profile.lessonsCompleted,
        totalTimeMinutes: profile.totalTimeMinutes,
        accuracy: profile.accuracy,
        bugsFound: profile.bugsFound,
    })
    checkAchievements()
}

// _savedStats is a snapshot taken at import, so it never sees the write this
// function makes. Without this flag a second call in the same session (React
// StrictMode remounts the effect in dev) counts the day twice.
let _dailyLoginApplied = false

export function loadProgress() {
    const saved = loadSaved(STORAGE_KEY, null)
    // No saved nodes is normal for a first-time user — the daily-login block
    // below still has to run, otherwise day 1 never starts the streak and the
    // counter stays permanently one day behind.
    if (saved) {
        saved.forEach(s => {
            const node = journeyNodes.find(n => n.id === s.id)
            if (node) { node.status = s.status; node.stars = s.stars }
        })
    }
    // Track daily login
    const lastDate = _savedStats?.lastSaveDate
    const today = new Date().toDateString()
    if (lastDate !== today && !_dailyLoginApplied) {
        _dailyLoginApplied = true
        profile.daysLearning = (profile.daysLearning || 0) + 1
        if (lastDate) {
            const last = new Date(lastDate)
            const now = new Date()
            const diffDays = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(last.getFullYear(), last.getMonth(), last.getDate())) / 86400000)
            if (diffDays === 1) {
                stats.streak = (stats.streak || 0) + 1
            } else if (diffDays > 1 && !stats.streakShield) {
                stats.streak = 1
            } else if (diffDays > 1 && stats.streakShield) {
                stats.streakShield = false // shield consumed
            }
        } else {
            stats.streak = 1
        }
        profile.longestStreak = Math.max(profile.longestStreak || 0, stats.streak)
        stats.xpToday = 0
        saveProgress()
    }
    return true
}

export function addXP(amount) {
    // Apply multiplier
    const mult = getXPMultiplier()
    const finalAmount = Math.round(amount * mult.total)
    stats.xpToday += finalAmount
    profile.xpCurrent += finalAmount
    trackQuestEvent('earn_xp', finalAmount)
    // Track weekly XP
    try {
        const weeklyXP = JSON.parse(localStorage.getItem('rheo_weekly_xp') || '{}')
        const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
        weeklyXP[todayIdx] = (weeklyXP[todayIdx] || 0) + finalAmount
        localStorage.setItem('rheo_weekly_xp', JSON.stringify(weeklyXP))
    } catch (e) { }
    // Track login history for StreakCalendar
    try {
        const loginHistory = JSON.parse(localStorage.getItem('rheo_login_history') || '[]')
        const today = new Date().toDateString()
        if (!loginHistory.includes(today)) loginHistory.push(today)
        if (loginHistory.length > 30) loginHistory.shift()
        localStorage.setItem('rheo_login_history', JSON.stringify(loginHistory))
    } catch (e) { }
    window.__showXP?.(finalAmount)
    // Daily XP Goal check
    updateDailyXPGoal(finalAmount)
    while (profile.xpCurrent >= profile.xpNext) {
        profile.xpCurrent -= profile.xpNext
        profile.level++
        profile.xpNext = 500 + (profile.level - 1) * 100
        window.__showLevelUp?.(profile.level)
        stats.gems += 50
        // Check level perks
        const perk = levelPerks.find(p => p.level === profile.level)
        if (perk) {
            if (perk.themeId) unlockTheme(perk.themeId)
            window.__showAchievement?.(perk.icon, `Level ${profile.level}!`, perk.perk)
        }
    }
    // Check XP milestones
    checkMilestones(getTotalXP())
    saveProgress()
}

export function isOnboardingDone() { return loadSaved(ONBOARDING_KEY, false) }
export function setOnboardingDone() { saveTo(ONBOARDING_KEY, true) }

/* ── Streak Multiplier ── */
export function getStreakMultiplier() {
    return stats.streak >= 7 ? { mult: 3, label: '3x XP' } : stats.streak >= 3 ? { mult: 2, label: '2x XP' } : { mult: 1, label: null }
}

/* ══════════════════════════════════════════════
   ARENA / DUEL SYSTEM — Clash of Coders v2 MEGA
   Fully localStorage-persisted, real ELO, per-language questions,
   multiple game modes, AI personalities, battle pass, emotes, seasons
   ══════════════════════════════════════════════ */
const DUEL_STATS_KEY = 'rheo_duel_stats'
const DUEL_HISTORY_KEY = 'rheo_duel_history'
const DUEL_SEASON_KEY = 'rheo_duel_season'
const DUEL_BP_KEY = 'rheo_battle_pass'
const DUEL_DAILY_KEY = 'rheo_daily_challenge'
const DUEL_EMOTES_KEY = 'rheo_emotes'

/* ═══ QUESTION POOL — imported from duel_questions.js ═══
   130+ questions across 3 difficulty levels (ELO-mapped)
   See duel_questions.js for the full pool
   ═══════════════════════════════════════════════════════ */
const _duelPoolRef = duelQuestionPool  // re-export reference
const _legacyPoolRemoved = true  // old inline pool replaced

/* Legacy pool removed — all questions now in duel_questions.js */
if (false) { // keep structure reference for IDE
const __example = {
    python: [
        /* Standard MCQ */
        { type: 'mcq', text: 'What is the output of print(len("Hello"))?', options: ['4', '5', '6', 'Error'], correct: 1 },
        { type: 'mcq', text: 'What does range(3) produce?', options: ['[1,2,3]', '[0,1,2]', '[0,1,2,3]', 'Error'], correct: 1 },
        /* ── MCQ ── */
        { type: 'mcq', text: 'What does bool([]) return?', options: ['True', 'False', 'None', 'Error'], correct: 1 },
        { type: 'mcq', text: 'What is the output: print(type(1/2))?', options: ['<int>', '<float>', '<double>', 'Error'], correct: 1 },
        { type: 'mcq', text: 'What does "abc"[::-1] return?', options: ['"abc"', '"cba"', '"bca"', 'Error'], correct: 1 },
        { type: 'mcq', text: 'Which is immutable?', options: ['list', 'dict', 'set', 'tuple'], correct: 3 },
        { type: 'mcq', text: 'What does {1,2,3} & {2,3,4} return?', options: ['{1,2,3,4}', '{2,3}', '{1,4}', 'Error'], correct: 1 },
        { type: 'mcq', text: 'print(0.1 + 0.2 == 0.3) outputs?', options: ['True', 'False', 'Error', '0.3'], correct: 1 },
        { type: 'mcq', text: 'a = [1,2]; b = a; b.append(3); len(a)?', options: ['2', '3', 'Error', '1'], correct: 1 },
        { type: 'mcq', text: 'What does enumerate(["a","b"]) yield?', options: ['["a","b"]', '[(0,"a"),(1,"b")]', '[0,1]', 'Error'], correct: 1 },
        { type: 'mcq', text: 'print("hello" * 0) outputs?', options: ['"hello"', '""', '0', 'Error'], correct: 1 },
        { type: 'mcq', text: '"5" in [5, "5", 5.0] is True or False?', options: ['True', 'False', 'Error', 'None'], correct: 0 },
        /* ── Debug Hunt ── */
        { type: 'debug', text: 'Which line has the bug?', code: 'def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n)  # should be n-1', options: ['Line 1', 'Line 3', 'Line 4', 'No bug'], correct: 2 },
        { type: 'debug', text: 'Which line has the bug?', code: 'data = {"name": "Ali"}\nprint(data["age"])', options: ['Line 1', 'Line 2', 'Both', 'No bug'], correct: 1 },
        { type: 'debug', text: 'Which line causes infinite loop?', code: 'i = 0\nwhile i < 5:\n    print(i)\n    # missing i += 1', options: ['Line 1', 'Line 2', 'Line 3', 'Line 4 (missing)'], correct: 3 },
        /* ── Code Complete ── */
        { type: 'complete', text: 'Fill the blank', code: 'squares = [x**2 ___ x in range(5)]', options: ['if', 'for', 'while', 'with'], correct: 1 },
        { type: 'complete', text: 'Fill the blank', code: 'with ___("file.txt", "r") as f:\n    data = f.read()', options: ['file', 'open', 'read', 'load'], correct: 1 },
        { type: 'complete', text: 'Fill the blank', code: 'try:\n    x = 1/0\n___ ZeroDivisionError:\n    print("oops")', options: ['catch', 'except', 'handle', 'error'], correct: 1 },
        /* ── Code Trace ── */
        { type: 'trace', text: 'What is the final value of x?', code: 'x = 10\nfor i in range(3):\n    x = x // 2\nprint(x)', options: ['5', '2', '1', '0'], correct: 2 },
        { type: 'trace', text: 'What does this print?', code: 'a = [1, 2, 3]\nb = a[:]\nb.append(4)\nprint(len(a), len(b))', options: ['3 4', '4 4', '3 3', 'Error'], correct: 0 },
        { type: 'trace', text: 'What is the output?', code: 'def f(x, acc=[]):\n    acc.append(x)\n    return acc\nprint(len(f(1)), len(f(2)))', options: ['1 1', '1 2', '2 2', 'Error'], correct: 1 },
        /* ── Algorithm Complexity ── */
        { type: 'algo', text: 'Time complexity?', code: 'def search(arr, target):\n    for i in arr:\n        if i == target:\n            return True\n    return False', options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'], correct: 1 },
        { type: 'algo', text: 'Time complexity?', code: 'def has_dup(arr):\n    for i in range(len(arr)):\n        for j in range(i+1, len(arr)):\n            if arr[i]==arr[j]: return True\n    return False', options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(2^n)'], correct: 1 },
    ],
    javascript: [
        /* ── MCQ ── */
        { type: 'mcq', text: 'typeof null returns?', options: ['"null"', '"object"', '"undefined"', 'Error'], correct: 1 },
        { type: 'mcq', text: '[] == false is?', options: ['true', 'false', 'Error', 'undefined'], correct: 0 },
        { type: 'mcq', text: 'What does "5" - 3 return?', options: ['"53"', '2', 'NaN', 'Error'], correct: 1 },
        { type: 'mcq', text: 'NaN === NaN is?', options: ['true', 'false', 'Error', 'NaN'], correct: 1 },
        { type: 'mcq', text: 'What does typeof typeof 42 return?', options: ['"number"', '"string"', '"typeof"', 'Error'], correct: 1 },
        { type: 'mcq', text: '[1,2] + [3,4] returns?', options: ['[1,2,3,4]', '"1,23,4"', '[4,6]', 'Error'], correct: 1 },
        { type: 'mcq', text: 'const vs let: key difference?', options: ['Same', 'const = block + immutable binding', 'let = global', 'const = global'], correct: 1 },
        { type: 'mcq', text: '0 == "" is?', options: ['true', 'false', 'Error', 'NaN'], correct: 0 },
        { type: 'mcq', text: 'What does void 0 return?', options: ['0', 'null', 'undefined', 'NaN'], correct: 2 },
        { type: 'mcq', text: '[..."abc"] returns?', options: ['["abc"]', '["a","b","c"]', 'Error', '"abc"'], correct: 1 },
        /* ── Debug Hunt ── */
        { type: 'debug', text: 'Which line has the bug?', code: 'const items = [1, 2, 3];\nitems = [4, 5];\nconsole.log(items);', options: ['Line 1', 'Line 2', 'Line 3', 'No bug'], correct: 1 },
        { type: 'debug', text: 'Which line has the bug?', code: 'function greet(name) {\n  console.log("Hi " + nme);\n}', options: ['Line 1', 'Line 2', 'Line 3', 'No bug'], correct: 1 },
        { type: 'debug', text: 'Silent bug: what is wrong?', code: 'const obj = {a: 1, b: 2};\nconsole.log(obj.c);  // prints undefined', options: ['Line 1', 'Line 2 (undefined not error)', 'Both', 'No bug'], correct: 1 },
        /* ── Code Complete ── */
        { type: 'complete', text: 'Fill the blank', code: 'const double = (x) ___ x * 2;', options: [':', '=>', '->', '='], correct: 1 },
        { type: 'complete', text: 'Fill the blank', code: 'const {name, age} = ___;', options: ['person', 'Object', 'this', 'new'], correct: 0 },
        /* ── Code Trace ── */
        { type: 'trace', text: 'What does this log?', code: 'let x = 1;\nsetTimeout(() => console.log(x), 0);\nx = 2;\nconsole.log(x);', options: ['1, 2', '2, 2', '2, 1', '1, 1'], correct: 1 },
        { type: 'trace', text: 'Output?', code: 'const a = [1,2,3];\nconst b = a;\nb[0] = 99;\nconsole.log(a[0]);', options: ['1', '99', 'undefined', 'Error'], correct: 1 },
        { type: 'trace', text: 'Output?', code: 'console.log(1 + "2" + 3);', options: ['6', '"123"', '"33"', 'NaN'], correct: 1 },
        /* ── Algorithm ── */
        { type: 'algo', text: 'arr.indexOf(x) complexity?', code: 'arr.indexOf(x)', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correct: 1 },
        { type: 'algo', text: 'Map.get(key) complexity?', code: 'map.get(key)', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correct: 0 },
    ],
    java: [
        /* ── MCQ ── */
        { type: 'mcq', text: '"hello" == "hello" in Java?', options: ['Always true', 'Depends (string pool)', 'Always false', 'Error'], correct: 1 },
        { type: 'mcq', text: 'int x = 7/2; x is?', options: ['3.5', '3', '4', 'Error'], correct: 1 },
        { type: 'mcq', text: 'null instanceof Object?', options: ['true', 'false', 'NullPointerException', 'Error'], correct: 1 },
        { type: 'mcq', text: 'Which is not a primitive?', options: ['int', 'char', 'String', 'boolean'], correct: 2 },
        { type: 'mcq', text: 'byte range in Java?', options: ['0 to 255', '-128 to 127', '0 to 127', '-256 to 255'], correct: 1 },
        { type: 'mcq', text: 'Can interface have method body?', options: ['Never', 'Yes, default methods', 'Only abstract', 'Error'], correct: 1 },
        { type: 'mcq', text: 'System.out.println(10 + 20 + "30")?', options: ['"102030"', '"3030"', '60', '"1020"30"'], correct: 1 },
        { type: 'mcq', text: 'ArrayList vs LinkedList: random access?', options: ['Same', 'ArrayList O(1)', 'LinkedList O(1)', 'Both O(n)'], correct: 1 },
        { type: 'mcq', text: 'What does "abc".charAt(3) throw?', options: ['null', 'StringIndexOutOfBounds', 'Returns ""', 'NullPointer'], correct: 1 },
        { type: 'mcq', text: 'Which creates thread?', options: ['extends Thread', 'implements Runnable', 'Both', 'Neither'], correct: 2 },
        /* ── Debug Hunt ── */
        { type: 'debug', text: 'Which line has the bug?', code: 'String s = null;\nif(s.equals("test")) {\n    System.out.println("match");\n}', options: ['Line 1', 'Line 2 (NPE)', 'Line 3', 'No bug'], correct: 1 },
        { type: 'debug', text: 'Bug in this code?', code: 'int[] arr = new int[3];\nfor(int i=0; i<=3; i++) {\n    arr[i] = i;\n}', options: ['Line 1', 'Line 2 (i<=3 should be i<3)', 'Line 3', 'No bug'], correct: 1 },
        /* ── Code Complete ── */
        { type: 'complete', text: 'Fill the blank', code: 'List<String> list = new __<>();\nlist.add("hello");', options: ['List', 'ArrayList', 'Array', 'Vector'], correct: 1 },
        { type: 'complete', text: 'Fill the blank', code: 'public class Dog ___ Animal {\n    // inherits from Animal\n}', options: ['implements', 'extends', 'inherits', 'super'], correct: 1 },
        /* ── Code Trace ── */
        { type: 'trace', text: 'Output?', code: 'int a = 5;\nint b = a++;\nSystem.out.println(a + " " + b);', options: ['5 5', '6 5', '6 6', '5 6'], correct: 1 },
        { type: 'trace', text: 'Output?', code: 'String s = "Hello";\ns.concat(" World");\nSystem.out.println(s);', options: ['Hello World', 'Hello', 'Error', 'null'], correct: 1 },
        { type: 'trace', text: 'What prints?', code: 'int x = 10;\nSystem.out.println(x > 5 ? "big" : "small");', options: ['"big"', '"small"', '10', 'Error'], correct: 0 },
        /* ── Algorithm ── */
        { type: 'algo', text: 'HashMap.get(key) complexity?', code: 'map.get(key)', options: ['O(n)', 'O(1) amortized', 'O(log n)', 'O(n²)'], correct: 1 },
        { type: 'algo', text: 'Collections.sort() complexity?', code: 'Collections.sort(list)', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correct: 1 },
    ]
} // end __example
} // end if(false) — legacy pool reference

/* ═══ AI OPPONENT POOL — with PERSONALITIES ═══ */
const opponentPool = [
    { name: 'PyNinja', otterColor: '#7c3aed', personality: 'speed', accuracy: 0.65, speed: 0.9, taunt: 'Too fast!' },
    { name: 'CodeMaster42', otterColor: '#0891b2', personality: 'balanced', accuracy: 0.75, speed: 0.6, taunt: 'Ready?' },
    { name: 'LoopLord', otterColor: '#059669', personality: 'strategic', accuracy: 0.8, speed: 0.4, taunt: 'Think first.' },
    { name: 'BugSquasher', otterColor: '#dc2626', personality: 'debug_expert', accuracy: 0.9, speed: 0.5, taunt: 'I find bugs.' },
    { name: 'RecursiveRex', otterColor: '#d97706', personality: 'algo_expert', accuracy: 0.85, speed: 0.55, taunt: 'O(n!)' },
    { name: 'SyntaxError_', otterColor: '#e11d48', personality: 'speed', accuracy: 0.5, speed: 0.95, taunt: 'Speed!' },
    { name: 'BitShifter', otterColor: '#4f46e5', personality: 'speed', accuracy: 0.6, speed: 0.85, taunt: 'Faster.' },
    { name: 'NullPointer', otterColor: '#475569', personality: 'balanced', accuracy: 0.7, speed: 0.7, taunt: 'null.' },
    { name: 'AlgoQueen', otterColor: '#be185d', personality: 'strategic', accuracy: 0.9, speed: 0.35, taunt: 'Slow & correct.' },
    { name: 'StackOverflow', otterColor: '#ea580c', personality: 'balanced', accuracy: 0.75, speed: 0.65, taunt: 'I researched.' },
    { name: 'BinaryBoss', otterColor: '#0d9488', personality: 'algo_expert', accuracy: 0.82, speed: 0.6, taunt: '01010111!' },
    { name: 'ByteHunter', otterColor: '#9333ea', personality: 'speed', accuracy: 0.55, speed: 0.88, taunt: 'Target locked.' },
    { name: 'LambdaWolf', otterColor: '#16a34a', personality: 'balanced', accuracy: 0.72, speed: 0.68, taunt: '() => win' },
    { name: 'HashMapHero', otterColor: '#2563eb', personality: 'strategic', accuracy: 0.85, speed: 0.45, taunt: 'O(1) lookup.' },
    { name: 'PixelPirate', otterColor: '#db2777', personality: 'speed', accuracy: 0.58, speed: 0.92, taunt: 'Arrrgh!' },
    { name: 'TuringTest', otterColor: '#6366f1', personality: 'algo_expert', accuracy: 0.88, speed: 0.5, taunt: 'Are you human?' },
    { name: 'DevOpsDragon', otterColor: '#c026d3', personality: 'balanced', accuracy: 0.78, speed: 0.62, taunt: 'Deploy incoming.' },
    { name: 'GitGuru', otterColor: '#0ea5e9', personality: 'strategic', accuracy: 0.83, speed: 0.42, taunt: 'git push --force' },
    { name: 'RegexRanger', otterColor: '#84cc16', personality: 'debug_expert', accuracy: 0.87, speed: 0.48, taunt: '/^master$/' },
    { name: 'CSSWizard', otterColor: '#f59e0b', personality: 'balanced', accuracy: 0.7, speed: 0.72, taunt: 'display: win;' },
]

/* ═══ LEAGUE TIERS ═══ */
const leagueTiers = [
    { name: 'Bronze', minElo: 0, color: '#CD7F32' },
    { name: 'Silver', minElo: 1200, color: '#C0C0C0' },
    { name: 'Gold', minElo: 1500, color: '#FFD700' },
    { name: 'Diamond', minElo: 1800, color: '#B9F2FF' },
    { name: 'Hacker', minElo: 2200, color: '#FF00FF' },
]

/* ═══ ARENA TITLES ═══ */
export const arenaTitles = [
    { name: 'Newbie Coder', minElo: 0 },
    { name: 'Bug Hunter', minElo: 900 },
    { name: 'Code Warrior', minElo: 1100 },
    { name: 'Algorithm Knight', minElo: 1300 },
    { name: 'Syntax Samurai', minElo: 1600 },
    { name: 'Data Wizard', minElo: 1900 },
    { name: 'Legendary Hacker', minElo: 2200 },
]

export function getArenaTitle(elo) {
    const e = elo ?? duelStats.elo
    for (let i = arenaTitles.length - 1; i >= 0; i--) {
        if (e >= arenaTitles[i].minElo) return arenaTitles[i]
    }
    return arenaTitles[0]
}

/* ═══ MASCOT EVOLUTION ═══ */
export const mascotEvolutions = [
    { name: 'Baby Otter', emoji: '🦦', minWins: 0, glow: '' },
    { name: 'Warrior Otter', emoji: '⚔️🦦', minWins: 10, glow: '0 0 15px rgba(52,211,153,0.4)' },
    { name: 'Sensei Otter', emoji: '🥋🦦', minWins: 50, glow: '0 0 20px rgba(251,191,36,0.5)' },
    { name: 'Legendary Otter', emoji: '👑🦦', minWins: 100, glow: '0 0 25px rgba(168,85,247,0.6)' },
]

export function getMascotEvolution() {
    const w = duelStats.wins
    for (let i = mascotEvolutions.length - 1; i >= 0; i--) {
        if (w >= mascotEvolutions[i].minWins) return mascotEvolutions[i]
    }
    return mascotEvolutions[0]
}

/* ═══ EMOTE SYSTEM ═══ */
export const allEmotes = [
    // Free starter emotes
    { id: 'gg', label: 'GG', text: 'Good game!', price: 0, color: '#22c55e', tier: 'free' },
    { id: 'nice', label: 'NICE', text: 'Nice one!', price: 0, color: '#06b6d4', tier: 'free' },
    { id: 'gl', label: 'GL', text: 'Good luck!', price: 0, color: '#8b5cf6', tier: 'free' },
    // Common emotes (50-100 gems)
    { id: 'ez', label: 'EZ', text: 'Too easy!', price: 50, color: '#eab308', tier: 'common' },
    { id: 'wp', label: 'WP', text: 'Well played!', price: 50, color: '#14b8a6', tier: 'common' },
    { id: 'lol', label: 'LOL', text: 'Hahaha!', price: 75, color: '#fb923c', tier: 'common' },
    { id: 'rip', label: 'RIP', text: 'Rest in peace...', price: 100, color: '#ef4444', tier: 'common' },
    { id: 'bruh', label: 'BRUH', text: 'Seriously?!', price: 100, color: '#64748b', tier: 'common' },
    // Rare emotes (150-250 gems)
    { id: 'goat', label: 'GOAT', text: 'Greatest!', price: 150, color: '#f59e0b', tier: 'rare' },
    { id: 'oof', label: 'OOF', text: 'That hurts...', price: 200, color: '#ec4899', tier: 'rare' },
    { id: 'clutch', label: 'CLUTCH', text: 'Last second!', price: 200, color: '#a855f7', tier: 'rare' },
    { id: 'nerd', label: 'NERD', text: 'Big brain!', price: 250, color: '#818CF8', tier: 'rare' },
    // Legendary emotes (300+ gems)
    { id: 'rage', label: 'RAGE', text: 'Table flip!', price: 300, color: '#dc2626', tier: 'legendary' },
    { id: 'crown', label: 'KING', text: 'Bow down!', price: 500, color: '#FFD700', tier: 'legendary' },
]
const _ownedEmotes = loadSaved(DUEL_EMOTES_KEY, ['gg', 'nice', 'gl'])
export function getOwnedEmotes() { return allEmotes.filter(e => _ownedEmotes.includes(e.id)) }
export function buyEmote(id) {
    const emote = allEmotes.find(e => e.id === id)
    if (!emote || _ownedEmotes.includes(id)) return false
    if ((stats.gems || 0) < emote.price) return false
    stats.gems -= emote.price
    _ownedEmotes.push(id)
    saveTo(DUEL_EMOTES_KEY, _ownedEmotes)
    saveProgress()
    return true
}

/* ═══ WIN STREAK CELEBRATIONS ═══ */
export const streakCelebrations = [
    { minStreak: 3, title: 'ON FIRE!', icon: '🔥', color: '#f97316' },
    { minStreak: 5, title: 'UNSTOPPABLE!', icon: '⚡', color: '#eab308' },
    { minStreak: 7, title: 'DOMINATING!', icon: '💥', color: '#ef4444' },
    { minStreak: 10, title: 'LEGENDARY!', icon: '👑', color: '#a855f7' },
]

export function getStreakCelebration() {
    for (let i = streakCelebrations.length - 1; i >= 0; i--) {
        if (duelStats.winStreak >= streakCelebrations[i].minStreak) return streakCelebrations[i]
    }
    return null
}

/* ═══ SEASON SYSTEM ═══ */
function getCurrentSeasonId() {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const _seasonData = loadSaved(DUEL_SEASON_KEY, { id: getCurrentSeasonId(), startElo: 1000, gamesPlayed: 0, wins: 0 })
export function getSeasonData() {
    const currentId = getCurrentSeasonId()
    if (_seasonData.id !== currentId) {
        // Soft reset: new_elo = 1000 + (old_elo - 1000) * 0.5
        const resetElo = Math.round(1000 + (duelStats.elo - 1000) * 0.5)
        duelStats.elo = Math.max(800, resetElo)
        saveTo(DUEL_STATS_KEY, duelStats)
        _seasonData.id = currentId
        _seasonData.startElo = duelStats.elo
        _seasonData.gamesPlayed = 0
        _seasonData.wins = 0
        saveTo(DUEL_SEASON_KEY, _seasonData)
    }
    return { ..._seasonData, daysLeft: daysLeftInMonth() }
}

function daysLeftInMonth() {
    const now = new Date()
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return last.getDate() - now.getDate()
}

/* ═══ BATTLE PASS ═══ */
const battlePassTiers = [
    { tier: 1, xpNeeded: 0, free: { type: 'gems', amount: 10 }, premium: { type: 'emote', id: 'brain' } },
    { tier: 2, xpNeeded: 50, free: { type: 'gems', amount: 15 }, premium: { type: 'gems', amount: 30 } },
    { tier: 3, xpNeeded: 120, free: { type: 'title', name: '🏅 Gladiator' }, premium: { type: 'gems', amount: 50 } },
    { tier: 4, xpNeeded: 200, free: { type: 'gems', amount: 20 }, premium: { type: 'emote', id: 'fast' } },
    { tier: 5, xpNeeded: 300, free: { type: 'gems', amount: 25 }, premium: { type: 'gems', amount: 60 } },
    { tier: 6, xpNeeded: 420, free: { type: 'xp_boost', amount: 2 }, premium: { type: 'gems', amount: 75 } },
    { tier: 7, xpNeeded: 550, free: { type: 'gems', amount: 30 }, premium: { type: 'emote', id: 'sleep' } },
    { tier: 8, xpNeeded: 700, free: { type: 'title', name: '⚡ Speed Demon' }, premium: { type: 'gems', amount: 100 } },
    { tier: 9, xpNeeded: 880, free: { type: 'gems', amount: 35 }, premium: { type: 'gems', amount: 120 } },
    { tier: 10, xpNeeded: 1100, free: { type: 'gems', amount: 50 }, premium: { type: 'emote', id: 'crown' } },
    { tier: 11, xpNeeded: 1350, free: { type: 'gems', amount: 40 }, premium: { type: 'gems', amount: 80 } },
    { tier: 12, xpNeeded: 1650, free: { type: 'xp_boost', amount: 3 }, premium: { type: 'gems', amount: 100 } },
    { tier: 13, xpNeeded: 2000, free: { type: 'gems', amount: 45 }, premium: { type: 'emote', id: 'sip' } },
    { tier: 14, xpNeeded: 2400, free: { type: 'gems', amount: 50 }, premium: { type: 'gems', amount: 150 } },
    { tier: 15, xpNeeded: 3000, free: { type: 'title', name: '👾 Arena Legend' }, premium: { type: 'gems', amount: 200 } },
]
export { battlePassTiers }

const _bpData = loadSaved(DUEL_BP_KEY, { seasonId: getCurrentSeasonId(), xp: 0, tier: 0, claimed: [], premium: false })
export function getBattlePass() {
    if (_bpData.seasonId !== getCurrentSeasonId()) {
        _bpData.seasonId = getCurrentSeasonId(); _bpData.xp = 0; _bpData.tier = 0; _bpData.claimed = []
        saveTo(DUEL_BP_KEY, _bpData)
    }
    const currentTier = battlePassTiers.filter(t => _bpData.xp >= t.xpNeeded).length
    const nextTier = battlePassTiers[currentTier] || battlePassTiers[battlePassTiers.length - 1]
    const prevXp = currentTier > 0 ? battlePassTiers[currentTier - 1].xpNeeded : 0
    return { ..._bpData, currentTier, nextTier, prevXp, tiers: battlePassTiers }
}

export function addBattlePassXP(amount) {
    _bpData.xp += amount
    _bpData.tier = battlePassTiers.filter(t => _bpData.xp >= t.xpNeeded).length
    saveTo(DUEL_BP_KEY, _bpData)
}

/* ═══ DAILY ARENA CHALLENGE ═══ */
function getDailySeed() {
    const d = new Date()
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

function seededShuffle(arr, seed) {
    const a = [...arr]; let s = seed
    for (let i = a.length - 1; i > 0; i--) {
        s = (s * 9301 + 49297) % 233280
        const j = Math.floor((s / 233280) * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

export function getDailyChallenge() {
    const seed = getDailySeed()
    const lang = getActiveLanguage()
    const pool = duelQuestionPool[lang] || duelQuestionPool.python
    const questions = seededShuffle(pool, seed).slice(0, 3)
    const saved = loadSaved(DUEL_DAILY_KEY, {})
    const today = String(seed)
    return {
        questions,
        completed: saved[today]?.completed || false,
        bestTime: saved[today]?.bestTime || null,
        score: saved[today]?.score || null,
        date: today,
    }
}

export function saveDailyResult(score, timeMs) {
    const saved = loadSaved(DUEL_DAILY_KEY, {})
    const today = String(getDailySeed())
    const prev = saved[today]
    if (!prev || score > (prev.score || 0) || (score === prev.score && timeMs < prev.bestTime)) {
        saved[today] = { completed: true, score, bestTime: timeMs }
        saveTo(DUEL_DAILY_KEY, saved)
    }
    if (!prev?.completed) {
        addXP(20)
        stats.gems = (stats.gems || 0) + 5
        saveProgress()
        addBattlePassXP(15)
    }
    return saved[today]
}


/* ═══ GAME MODE CONFIGS ═══ */
export const gameModes = {
    classic: { name: 'Classic Duel', rounds: 3, timer: 20, desc: '3 questions, 20 seconds' },
    blitz: { name: 'Speed Blitz', rounds: 5, timer: 10, desc: '5 questions, 10 sec, speed bonus!', speedBonus: true },
    auction: { name: 'Code Auction', rounds: 3, timer: 20, desc: 'Bet your XP!', betting: true },
    daily: { name: 'Daily Challenge', rounds: 3, timer: 30, desc: 'Same questions for everyone' },
    survival: { name: 'Survival', rounds: 99, timer: 15, desc: '3 lives, how far can you go?', lives: 3 },
    sudden: { name: 'Sudden Death', rounds: 1, timer: 30, desc: 'One question, one chance!', suddenDeath: true },
}

/* ═══ POWER-UP SYSTEM ═══ */
export const powerUps = [
    { id: 'freeze', name: 'Time Freeze', desc: 'Timer stops for 5 seconds', uses: 1, color: '#06b6d4' },
    { id: 'fifty', name: '50:50', desc: 'Remove 2 wrong options', uses: 1, color: '#a855f7' },
    { id: 'double', name: 'Double XP', desc: 'Score x2 this round', uses: 1, color: '#f59e0b' },
]

/* ═══ ACHIEVEMENT BADGES ═══ */
const ACHIEVEMENTS_KEY = 'rheo_achievements'
export const achievementDefs = [
    // Duel milestones
    { id: 'first_blood', name: 'First Blood', desc: 'Win your first duel', check: () => duelStats.wins >= 1, color: '#22c55e', icon: '⚔️' },
    { id: 'streak3', name: 'Hat Trick', desc: 'Win 3 in a row', check: () => duelStats.bestStreak >= 3, color: '#eab308', icon: '🎩' },
    { id: 'streak5', name: 'Unstoppable', desc: 'Win 5 in a row', check: () => duelStats.bestStreak >= 5, color: '#ef4444', icon: '🔥' },
    { id: 'streak10', name: 'Legendary', desc: 'Win 10 in a row', check: () => duelStats.bestStreak >= 10, color: '#a855f7', icon: '👑' },
    { id: 'duel10', name: 'Veteran', desc: 'Complete 10 duels', check: () => duelStats.totalDuels >= 10, color: '#14b8a6', icon: '🎖️' },
    { id: 'duel50', name: 'Gladiator', desc: 'Complete 50 duels', check: () => duelStats.totalDuels >= 50, color: '#f97316', icon: '🏛️' },
    // League milestones
    { id: 'silver', name: 'Silver League', desc: 'Reach 1200 ELO', check: () => duelStats.elo >= 1200, color: '#C0C0C0', icon: '🥈' },
    { id: 'gold', name: 'Gold League', desc: 'Reach 1500 ELO', check: () => duelStats.elo >= 1500, color: '#FFD700', icon: '🥇' },
    { id: 'diamond', name: 'Diamond League', desc: 'Reach 1800 ELO', check: () => duelStats.elo >= 1800, color: '#b9f2ff', icon: '💎' },
    // Performance
    { id: 'perfect', name: 'Flawless', desc: 'Win with 0 mistakes', check: () => loadSaved(ACHIEVEMENTS_KEY, []).includes('perfect'), color: '#ec4899', icon: '✨' },
    { id: 'speed_demon', name: 'Speed Demon', desc: 'Win in Blitz mode', check: () => loadSaved(ACHIEVEMENTS_KEY, []).includes('speed_demon'), color: '#f59e0b', icon: '⚡' },
    // Journey milestones (cross-feature)
    { id: 'ch1_done', name: 'Chapter 1', desc: 'Complete Chapter 1', check: () => journeyNodes.filter(n => n.chapter === 1 && n.status === 'completed').length >= 3, color: '#58CC02', icon: '📗' },
    { id: 'ch3_done', name: 'Loop Master', desc: 'Complete Chapter 3', check: () => journeyNodes.filter(n => n.chapter === 3 && n.status === 'completed').length >= 3, color: '#1CB0F6', icon: '🔄' },
    { id: 'lesson20', name: 'Scholar', desc: 'Complete 20 lessons', check: () => journeyNodes.filter(n => n.status === 'completed').length >= 20, color: '#818CF8', icon: '📚' },
    // Economy
    { id: 'gems500', name: 'Gem Hoarder', desc: 'Own 500+ gems', check: () => (stats.gems || 0) >= 500, color: '#06b6d4', icon: '💰' },
    { id: 'bp5', name: 'Pass Tier 5', desc: 'Reach BP Tier 5', check: () => { const bp = loadSaved(DUEL_BP_KEY, {}); return (bp.xp || 0) >= 300 }, color: '#4ade80', icon: '🏆' },
    // Streak
    { id: 'streak7d', name: 'Week Warrior', desc: '7-day login streak', check: () => (stats.streak || 0) >= 7, color: '#fb923c', icon: '📅' },
    { id: 'streak30d', name: 'Monthly Master', desc: '30-day login streak', check: () => (stats.streak || 0) >= 30, color: '#f472b6', icon: '🗓️' },
]
const _unlockedAch = loadSaved(ACHIEVEMENTS_KEY, [])
export function getUnlockedAchievements() { return achievementDefs.filter(a => _unlockedAch.includes(a.id) || a.check()) }
export function checkAndUnlockAchievements(extraIds = []) {
    let newUnlocks = []
    achievementDefs.forEach(a => { if (!_unlockedAch.includes(a.id) && (a.check() || extraIds.includes(a.id))) { _unlockedAch.push(a.id); newUnlocks.push(a) } })
    if (newUnlocks.length > 0) saveTo(ACHIEVEMENTS_KEY, _unlockedAch)
    return newUnlocks
}

/* ═══ LOAD PERSISTED DUEL DATA ═══ */
export const duelStats = loadSaved(DUEL_STATS_KEY, { wins: 0, losses: 0, winStreak: 0, bestStreak: 0, elo: 1000, totalDuels: 0, fastestWin: null, langElo: {} })
if (!duelStats.langElo) duelStats.langElo = {}
export const duelHistory = loadSaved(DUEL_HISTORY_KEY, [])

/* ── Per-language ELO helpers ── */
export function getLangElo(lang) {
    const l = lang || getActiveLanguage()
    return duelStats.langElo[l] ?? duelStats.elo ?? 1000
}
export function setLangElo(lang, elo) {
    duelStats.langElo[lang] = elo
    // Keep global elo as the highest across languages
    duelStats.elo = Math.max(...Object.values(duelStats.langElo), duelStats.elo || 1000)
    saveTo(DUEL_STATS_KEY, duelStats)
}

/* ═══ CORE FUNCTIONS ═══ */
export function getLeagueTier(elo) {
    const e = elo ?? duelStats.elo
    for (let i = leagueTiers.length - 1; i >= 0; i--) {
        if (e >= leagueTiers[i].minElo) return leagueTiers[i]
    }
    return leagueTiers[0]
}
export { leagueTiers }

export function calculateElo(playerElo, opponentElo, won) {
    const K = 32
    const expected = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400))
    return Math.round(K * ((won ? 1 : 0) - expected))
}

export function getDuelQuestions(count = 3, mode = 'classic', forceLang = null) {
    const lang = forceLang || getActiveLanguage()
    const pool = duelQuestionPool[lang] || duelQuestionPool.python
    const elo = getLangElo(lang)

    // ELO → difficulty weighting
    let weights
    if (elo < 1200)       weights = { 1: 0.65, 2: 0.30, 3: 0.05 }  // Bronze/Silver
    else if (elo < 1600)  weights = { 1: 0.15, 2: 0.55, 3: 0.30 }  // Gold/Platinum
    else                  weights = { 1: 0.05, 2: 0.30, 3: 0.65 }  // Diamond/Legend

    // Group by difficulty
    const byDiff = { 1: [], 2: [], 3: [] }
    pool.forEach(q => { if (byDiff[q.difficulty]) byDiff[q.difficulty].push(q) })

    // Shuffle each group
    Object.values(byDiff).forEach(arr => arr.sort(() => Math.random() - 0.5))

    // Weighted selection
    const selected = []
    for (let i = 0; i < count; i++) {
        const r = Math.random()
        let diff = r < weights[1] ? 1 : r < weights[1] + weights[2] ? 2 : 3
        // Fallback if difficulty bucket is empty
        if (byDiff[diff].length === 0) diff = byDiff[2].length > 0 ? 2 : byDiff[1].length > 0 ? 1 : 3
        if (byDiff[diff].length > 0) selected.push(byDiff[diff].pop())
    }
    return selected.length > 0 ? selected : [...pool].sort(() => Math.random() - 0.5).slice(0, count)
}

export function getRandomOpponent(userElo) {
    const elo = userElo ?? duelStats.elo
    const idx = Math.floor(Math.random() * opponentPool.length)
    const base = opponentPool[idx]
    const eloVariance = Math.floor(Math.random() * 200) - 100
    return { ...base, elo: Math.max(800, elo + eloVariance) }
}

/* ── AI Response Time based on personality ── */
export function getAIResponseTime(opponent, questionType) {
    const baseTime = 3000
    const speedFactor = 1 - (opponent.speed || 0.5)
    const typeBonus = (opponent.personality === 'debug_expert' && questionType === 'debug') ? 0.6
        : (opponent.personality === 'algo_expert' && questionType === 'algo') ? 0.6 : 1
    return Math.floor(baseTime + (Math.random() * 10000 * speedFactor * typeBonus))
}

export function getAICorrectChance(opponent, questionType) {
    let base = opponent.accuracy || 0.7
    if (opponent.personality === 'debug_expert' && questionType === 'debug') base += 0.15
    if (opponent.personality === 'algo_expert' && questionType === 'algo') base += 0.15
    return Math.min(0.95, base)
}

/* ═══ SAVE DUEL RESULT ═══ */
export function saveDuelResult({ won, yourScore, theirScore, opponent, totalTimeMs, mode = 'classic', roundDetails = [] }) {
    const duelLang = opponent._duelLang || getActiveLanguage()
    const langElo = getLangElo(duelLang)
    const eloChange = calculateElo(langElo, opponent.elo, won)
    const baseXP = won ? 30 : 5
    const modeBonus = mode === 'blitz' ? 10 : mode === 'auction' ? 15 : 0
    const xpGain = baseXP + Math.abs(eloChange) + modeBonus
    const gemGain = won ? 10 : 0

    setLangElo(duelLang, Math.max(0, langElo + eloChange))
    duelStats.totalDuels = (duelStats.totalDuels || 0) + 1
    if (won) {
        duelStats.wins += 1
        duelStats.winStreak += 1
        duelStats.bestStreak = Math.max(duelStats.bestStreak, duelStats.winStreak)
        if (totalTimeMs && (!duelStats.fastestWin || totalTimeMs < duelStats.fastestWin)) {
            duelStats.fastestWin = totalTimeMs
        }
    } else {
        duelStats.losses += 1
        duelStats.winStreak = 0
    }
    saveTo(DUEL_STATS_KEY, duelStats)

    // Season tracking
    _seasonData.gamesPlayed += 1
    if (won) _seasonData.wins += 1
    saveTo(DUEL_SEASON_KEY, _seasonData)

    // Battle Pass XP
    addBattlePassXP(won ? 25 : 8)

    const now = new Date()
    const entry = {
        id: Date.now(), mode,
        opponent: { name: opponent.name, avatar: opponent.avatar },
        result: won ? 'win' : 'loss',
        score: `${yourScore}-${theirScore}`,
        xp: xpGain, elo: eloChange,
        date: now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        timestamp: now.getTime(), totalTimeMs,
        roundDetails,
    }
    duelHistory.unshift(entry)
    if (duelHistory.length > 30) duelHistory.length = 30
    saveTo(DUEL_HISTORY_KEY, duelHistory)

    addXP(xpGain)
    if (gemGain > 0) { stats.gems = (stats.gems || 0) + gemGain; saveProgress() }
    trackQuestEvent('duel_complete')
    if (won) trackQuestEvent('win_duel')

    const celebration = getStreakCelebration()
    return { xpGain, gemGain, eloChange, newElo: duelStats.elo, tier: getLeagueTier(duelStats.elo), title: getArenaTitle(duelStats.elo), celebration, roundDetails }
}

/* ═══ DYNAMIC LEADERBOARD (per-language) ═══ */
export function getDuelLeaderboard(lang) {
    const l = lang || getActiveLanguage()
    const userElo = getLangElo(l)
    const CACHE_KEY = `rheo_leaderboard_${l}`
    const { seasonNum } = getSeasonInfo()
    
    try {
        const saved = JSON.parse(localStorage.getItem(CACHE_KEY))
        if (saved && saved.season === seasonNum) {
            const board = saved.board.map(p => ({ ...p, xp: p.baseXp }))
            board.push({ name: profile.name || 'You', avatar: getMascotEvolution().emoji, xp: userElo, isUser: true, lang: l })
            board.sort((a, b) => b.xp - a.xp)
            return board
        }
    } catch (e) {}

    const shuffled = [...opponentPool].sort(() => Math.random() - 0.5).slice(0, 9)
    const board = shuffled.map(p => {
        const variance = Math.floor(Math.random() * 400) - 150
        return { ...p, baseXp: Math.max(800, userElo + variance), isUser: false, lang: l }
    })
    
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ season: seasonNum, board })) } catch(e) {}
    
    const finalBoard = board.map(p => ({...p, xp: p.baseXp}))
    finalBoard.push({ name: profile.name || 'You', avatar: getMascotEvolution().emoji, xp: userElo, isUser: true, lang: l })
    finalBoard.sort((a, b) => b.xp - a.xp)
    return finalBoard
}

/* ── Duel Config / Legacy Compat ── */
export const duelData = { get opponent() { return getRandomOpponent() }, timer: 20, rounds: 3 }
export const duelQuestions = getDuelQuestions(3)
export const league = {
    get current() { return getLeagueTier().name },
    get rank() { const lb = getDuelLeaderboard(); const idx = lb.findIndex(p => p.isUser); return idx >= 0 ? idx + 1 : 5 },
    get players() { return getDuelLeaderboard() },
    promotionLine: 3, relegationLine: 8,
}

/* ── Otter Costumes ── */
/* ── Otter Costumes (with persistence) ── */
function _loadCostumeState() {
    try { return JSON.parse(localStorage.getItem('rheo_costumes') || 'null') } catch(e) { return null }
}
function _saveCostumeState(costumes) {
    try {
        const data = costumes.map(c => ({ id: c.id, owned: c.owned, equipped: c.equipped }))
        localStorage.setItem('rheo_costumes', JSON.stringify(data))
    } catch (e) { }
}
const _defaultCostumes = [
    { id: 'none', name: 'Default', price: 0, owned: true, equipped: true, emoji: '🦦', slot: null },
    { id: 'tophat', name: 'Top Hat', price: 200, owned: false, equipped: false, emoji: '🎩', slot: 'hat' },
    { id: 'crown', name: 'Royal Crown', price: 500, owned: false, equipped: false, emoji: '👑', slot: 'hat' },
    { id: 'sunglasses', name: 'Cool Shades', price: 150, owned: false, equipped: false, emoji: '🕶️', slot: 'face' },
    { id: 'monocle', name: 'Monocle', price: 300, owned: false, equipped: false, emoji: '🧐', slot: 'face' },
    { id: 'cape', name: 'Hero Cape', price: 400, owned: false, equipped: false, emoji: '🦸', slot: 'body' },
    { id: 'scarf', name: 'Winter Scarf', price: 250, owned: false, equipped: false, emoji: '🧣', slot: 'body' },
    { id: 'party', name: 'Party Hat', price: 100, owned: false, equipped: false, emoji: '🥳', slot: 'hat' },
]
function _mergeWithSaved() {
    const saved = _loadCostumeState()
    if (!saved) return [..._defaultCostumes]
    return _defaultCostumes.map(def => {
        const s = saved.find(c => c.id === def.id)
        if (s) return { ...def, owned: s.owned, equipped: s.equipped }
        return { ...def }
    })
}
export const otterCostumes = _mergeWithSaved()
export function buyCostume(id) {
    const item = otterCostumes.find(c => c.id === id)
    if (!item || item.owned || stats.gems < item.price) return false
    stats.gems -= item.price
    item.owned = true
    _saveCostumeState(otterCostumes)
    saveProgress()
    return true
}
export function equipCostume(id) {
    const target = otterCostumes.find(c => c.id === id)
    if (!target || !target.owned) return false
    // Unequip others in same slot
    otterCostumes.forEach(c => {
        if (c.slot === target.slot && c.id !== id) c.equipped = false
    })
    target.equipped = !target.equipped
    _saveCostumeState(otterCostumes)
    return true
}

/* ── Settings helpers ── */
export function getSettingValue(key) {
    try { return JSON.parse(localStorage.getItem(`rheo_setting_${key}`) || 'null') } catch(e) { return null }
}
export function isHapticEnabled() { return getSettingValue('haptic') !== false }
export function isSoundEnabled() { return getSettingValue('sound') === true }

/* ══════════════════════════════════════════════════
   PER-NODE, PER-LANGUAGE EXERCISES
   All 12 types spread across journey nodes
   ══════════════════════════════════════════════════ */
const nodeExercises = {
    python: {},
}
// Merge imported exercises into nodeExercises
nodeExercises.python = { ...pyExercises, ...pyExercisesCh6to10 }

nodeExercises.javascript = { ...jsExercises, ...jsExercisesCh6to10 }
nodeExercises.java = { ...javaExercises, ...javaExercisesCh6to10 }
/* ── Answer-order randomisation ──────────────────────────────────────────
   The authored pool puts the correct answer first in 61% of items and last in
   under 1%, so "always tap A" scored ~61% without reading any code. Options are
   permuted per install so the position carries no signal.

   The permutation is derived from a stable install id + the item's identity, so
   it never changes while a learner is answering (a re-render must not move the
   buttons) and it stays the same if they revisit the item in review — but it
   differs between learners, which is what kills the shared "answer key".        */
const INSTALL_SEED_KEY = 'rheo_shuffle_seed'
function _installSeed() {
    let seed = loadSaved(INSTALL_SEED_KEY, null)
    if (typeof seed !== 'number') {
        seed = Math.floor(Math.random() * 2 ** 31)
        saveTo(INSTALL_SEED_KEY, seed)
    }
    return seed
}
function _hash(str) {
    let h = 2166136261
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) }
    return h >>> 0
}
// Fisher-Yates driven by a seeded LCG — an unbiased permutation, unlike the
// `sort(() => rand() - 0.5)` idiom used elsewhere in this file.
function _seededPermutation(n, seed) {
    const idx = Array.from({ length: n }, (_, i) => i)
    let s = seed >>> 0
    const next = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 2 ** 32 }
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1))
        const t = idx[i]; idx[i] = idx[j]; idx[j] = t
    }
    return idx
}
// Only touches `options`/`correct`. Types keyed on something else — `bug`
// (correctLine), `scramble` (correctOrder), `fillgap` (correctFill matches by
// value), `pair` (shuffles itself) — are left alone.
function _shuffleOptions(ex, key) {
    if (!Array.isArray(ex.options) || typeof ex.correct !== 'number' || ex.options.length < 2) return ex
    const perm = _seededPermutation(ex.options.length, _hash(key) ^ _installSeed())
    return {
        ...ex,
        options: perm.map(i => ex.options[i]),
        correct: perm.indexOf(ex.correct),
    }
}

// Exercises carry their own origin (_nodeId/_exerciseIndex) so a wrong answer
// can be filed against the right node for spaced repetition. Without this the
// lesson screen has no way to know which node it is running and every mistake
// was recorded under node 0, which matches nothing — the review queue stayed
// empty forever. Cached so repeated renders keep a stable array reference.
const _taggedExercises = new Map()
export function getExercisesForNode(nodeId, lang) {
    const l = lang || _activeLang
    const cacheKey = `${l}:${nodeId}`
    const cached = _taggedExercises.get(cacheKey)
    if (cached) return cached

    // Try the selected language first, NO silent fallback to Python
    const exercises = nodeExercises[l]?.[nodeId] || []
    const tagged = exercises.length > 0
        ? exercises.map((ex, i) => _shuffleOptions({ ...normalizeExercise(ex), _nodeId: nodeId, _exerciseIndex: i }, `${l}:${nodeId}:${i}`))
        : [
            {
                type: 'trace', prompt: `Coming soon! ${l.charAt(0).toUpperCase() + l.slice(1)} exercises for this lesson are being prepared.`,
                code: [{ text: '// More exercises coming soon!', highlight: true }],
                options: ['OK!'], correct: 0
            },
        ]
    _taggedExercises.set(cacheKey, tagged)
    return tagged
}

export function buildReviewExercises(lang) {
    const l = lang || _activeLang
    const weaks = getWeakExercises()
    weaks.sort((a, b) => b.attempts - a.attempts)
    
    const reviewQueue = []
    const limit = 10
    for (const w of weaks) {
        const exercisesForNode = nodeExercises[l]?.[w.nodeId] || []
        const ex = exercisesForNode[w.exerciseIndex]
        if (ex) {
            // Same seed key as the original run, so review shows the learner the
            // exact layout they got it wrong on.
            reviewQueue.push(_shuffleOptions(
                { ...ex, _isReview: true, _nodeId: w.nodeId, _exerciseIndex: w.exerciseIndex },
                `${l}:${w.nodeId}:${w.exerciseIndex}`,
            ))
        }
        if (reviewQueue.length >= limit) break
    }
    
    if (reviewQueue.length === 0) {
        return [{
            type: 'trace', prompt: `You have no weaknesses to review! Great job!`,
            code: [{ text: '// Your knowledge is solid.', highlight: true }],
            options: ['Awesome!'], correct: 0
        }]
    }
    return reviewQueue
}
