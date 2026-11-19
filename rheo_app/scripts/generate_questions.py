#!/usr/bin/env python3
"""
Rheo Question Bank Generator
Generates coding quiz questions using Gemini API in batch.
Saves to JSON files per topic/difficulty.
"""

import json
import time
import os
import sys
import google.generativeai as genai
from pathlib import Path

API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY environment variable not set!")
    sys.exit(1)
MODEL = "gemini-2.5-flash"
OUTPUT_DIR = Path(__file__).parent.parent / "assets" / "questions"
QUESTIONS_PER_BATCH = 10  # Questions per API call
TOTAL_PER_FILE = 100  # Total questions per topic/difficulty file

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel(MODEL)

# Topics with descriptions for each language
TOPICS = {
    "variable": {
        "python": "Python variables, data types (int, float, str, bool, None), type casting, string formatting, f-strings, multiple assignment, augmented operators",
        "java": "Java variables, primitive types (int, double, boolean, char, String), type casting, Scanner input, Math class, String methods",
        "javascript": "JavaScript variables (let, const, var), data types, template literals, typeof, type coercion, NaN, undefined vs null"
    },
    "loop": {
        "python": "Python for loops, while loops, nested loops, break/continue, range(), enumerate(), zip(), list comprehensions, loop-else",
        "java": "Java for loops, enhanced for-each, while, do-while, nested loops, break/continue, labeled loops, iterating arrays",
        "javascript": "JavaScript for, for...of, for...in, while, do...while, forEach, map, Array iteration, break/continue"
    },
    "if_else": {
        "python": "Python if/elif/else, boolean logic (and, or, not), ternary operator, truthy/falsy values, chained comparisons, match-case",
        "java": "Java if/else if/else, switch-case, ternary operator, boolean expressions, nested conditions, logical operators (&&, ||, !)",
        "javascript": "JavaScript if/else, switch, ternary operator, truthy/falsy, nullish coalescing (??), optional chaining (?.)"
    },
    "function": {
        "python": "Python functions, def, return, default args, *args/**kwargs, lambda, closures, decorators, recursion, scope (LEGB)",
        "java": "Java methods, static/instance methods, return types, method overloading, recursion, variable scope, access modifiers",
        "javascript": "JavaScript functions, arrow functions, callbacks, closures, IIFE, default params, rest/spread, higher-order functions"
    },
    "list": {
        "python": "Python lists, tuples, sets, dictionaries, list methods, slicing, sorting, nested structures, comprehensions, unpacking",
        "java": "Java arrays, ArrayList, HashMap, sorting (Arrays.sort, Collections.sort), 2D arrays, LinkedList, iterators",
        "javascript": "JavaScript arrays, push/pop/shift, slice/splice, map/filter/reduce, spread operator, destructuring, Set, Map"
    },
    "ai_arrays": {
        "python": "Python arrays/hashing: Two Sum, Contains Duplicate, Group Anagrams, Hash Maps, Counter, defaultdict, sliding window",
        "java": "Java arrays/hashing: HashMap operations, Array algorithms, Two Sum, HashSet, Collections frequency",
        "javascript": "JavaScript arrays/hashing: Map, Set, Object as hashmap, Array methods for algorithm problems, frequency counters"
    },
    "ai_linked_lists": {
        "python": "Python Linked Lists: Node class, singly/doubly linked, reverse, merge, detect cycle, Floyd's algorithm, dummy nodes",
        "java": "Java Linked Lists: LinkedList class, Node implementation, ListNode, reverse, merge sorted, detect cycle",
        "javascript": "JavaScript Linked Lists: class-based Node, prototype chain, reverse linked list, merge, fast/slow pointers"
    },
    "ai_trees": {
        "python": "Python Trees/Graphs: Binary trees, BST, BFS (deque), DFS (recursion/stack), tree traversals, graph adjacency list",
        "java": "Java Trees/Graphs: TreeNode, Binary Search Tree, BFS (Queue), DFS, tree traversals (inorder/preorder/postorder)",
        "javascript": "JavaScript Trees/Graphs: class TreeNode, BFS with queue, DFS recursion, adjacency list, graph traversal"
    }
}

DIFFICULTIES = {
    "easy": {
        "level": 1,
        "instruction": "EASY difficulty: basic syntax, simple operations, one concept at a time. A beginner should solve it in 10-15 seconds. Use simple variable names and straightforward logic. Code should be 3-6 lines."
    },
    "medium": {
        "level": 2,
        "instruction": "MEDIUM difficulty: combine 2-3 concepts, include minor edge cases (off-by-one, empty input, type coercion). Requires tracing through code carefully. Code should be 5-8 lines."
    },
    "hard": {
        "level": 3,
        "instruction": "HARD difficulty: subtle traps and gotchas specific to the language. Use mutable defaults, scope issues, operator precedence, shallow copy problems, closure late binding, or tricky recursion. Even experienced developers should pause and think. Code should be 6-12 lines."
    }
}

SYSTEM_PROMPT = """You are an expert coding quiz question generator. Generate EXACTLY {count} unique coding questions.

CRITICAL RULES:
1. Each question MUST be completely different — different variables, different logic, different scenarios
2. Use creative variable names from real-world contexts (shopping_cart, student_grades, game_scores, recipe_ingredients, temperatures — NOT x, y, a, b)
3. ALL 4 answer options must be plausible. Include common mistakes as wrong answers.
4. Mix question types: "output" (predict output), "missing_code" (fill blank "_____"), "debug" (find buggy line)
5. Code must be syntactically valid for the specified language
6. Explanations must be clear and educational

Language: {language}
Topic: {topic_desc}
{difficulty_instruction}

Respond with a JSON array of exactly {count} questions:
[
  {{
    "type": "output",
    "question_text": "Bu kodun çıktısı nedir?",
    "code_snippet": "...",
    "options": ["correct", "wrong1", "wrong2", "wrong3"],
    "correct_index": 0,
    "explanation": "Step-by-step explanation in Turkish"
  }},
  ...
]

IMPORTANT: Question text and explanations should be in Turkish. Code stays in the programming language.
Every question must have a DIFFERENT scenario and logic. NO repetition!"""

SCENARIOS = [
    "online alışveriş sepeti", "öğrenci not sistemi", "hava durumu verisi",
    "sosyal medya takipçi sayısı", "yemek tarifi malzemeler", "oyun skor tablosu",
    "kütüphane kitap kataloğu", "fitness egzersiz takipçisi", "müzik çalma listesi",
    "restoran menü siparişi", "banka hesap işlemleri", "trafik ışığı simulasyonu",
    "film derecelendirme sistemi", "otopark yönetimi", "hayvan barınağı kayıtları",
    "hastane randevu sistemi", "e-posta filtresi", "çalışan maaş hesaplama",
    "spor takımı istatistikleri", "market stok takibi"
]


def generate_batch(topic_id: str, difficulty: str, language: str, batch_num: int, existing_count: int) -> list:
    """Generate a batch of questions using Gemini API"""
    topic_desc = TOPICS[topic_id][language]
    diff_info = DIFFICULTIES[difficulty]
    count = QUESTIONS_PER_BATCH
    
    # Select some scenarios to suggest variety
    scenario_start = (batch_num * 3) % len(SCENARIOS)
    suggested_scenarios = SCENARIOS[scenario_start:scenario_start+3]
    
    prompt = SYSTEM_PROMPT.format(
        count=count,
        language=language.capitalize(),
        topic_desc=topic_desc,
        difficulty_instruction=diff_info["instruction"]
    )
    
    prompt += f"\n\nSuggested scenarios for variety: {', '.join(suggested_scenarios)}"
    prompt += f"\nThis is batch #{batch_num+1}. You have already generated {existing_count} questions. Make these COMPLETELY DIFFERENT from previous ones."
    prompt += f"\nRandom seed for uniqueness: {int(time.time() * 1000) % 99999}"
    
    for attempt in range(3):
        try:
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=1.0,
                    response_mime_type="application/json",
                )
            )
            
            text = response.text.strip()
            # Clean markdown if present
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()
            
            questions = json.loads(text)
            if not isinstance(questions, list):
                questions = [questions]
                
            # Process questions
            processed = []
            for i, q in enumerate(questions):
                options = q.get("options", [])
                correct_idx = q.get("correct_index", 0)
                if correct_idx >= len(options):
                    correct_idx = 0
                    
                processed.append({
                    "id": f"{topic_id}_{difficulty[0]}_{language[:2]}_{int(time.time()*1000)%99999}_{i}",
                    "type": q.get("type", "output"),
                    "difficulty": diff_info["level"],
                    "topic": topic_id,
                    "code_snippet": q.get("code_snippet", ""),
                    "question_text": q.get("question_text", ""),
                    "correct_answer": options[correct_idx] if options else "",
                    "wrong_options": [options[j] for j in range(len(options)) if j != correct_idx],
                    "explanation": q.get("explanation", ""),
                    "language": language
                })
            
            return processed
            
        except Exception as e:
            err_str = str(e)
            if "429" in err_str or "quota" in err_str.lower():
                wait_time = (attempt + 1) * 15
                print(f"  ⏳ Rate limited, waiting {wait_time}s (attempt {attempt+1}/3)")
                time.sleep(wait_time)
                continue
            print(f"  ❌ Error: {e}")
            return []
    
    print(f"  ❌ Failed after 3 retries")
    return []


def generate_topic_difficulty(topic_id: str, difficulty: str):
    """Generate all questions for a topic/difficulty combination"""
    filename = f"{topic_id}_{difficulty}.json"
    filepath = OUTPUT_DIR / filename
    
    # Load existing if any
    existing = []
    if filepath.exists():
        with open(filepath, "r", encoding="utf-8") as f:
            existing = json.load(f)
        print(f"  📂 Found {len(existing)} existing questions")
    
    if len(existing) >= TOTAL_PER_FILE:
        print(f"  ✅ Already have {len(existing)} questions, skipping")
        return
    
    remaining = TOTAL_PER_FILE - len(existing)
    batches_needed = (remaining + QUESTIONS_PER_BATCH - 1) // QUESTIONS_PER_BATCH
    
    languages = ["python", "java", "javascript"]
    
    for batch_num in range(batches_needed):
        # Rotate languages across batches
        lang = languages[batch_num % 3]
        
        print(f"  🔄 Batch {batch_num+1}/{batches_needed} ({lang}) [{len(existing)}/{TOTAL_PER_FILE}]")
        
        new_questions = generate_batch(topic_id, difficulty, lang, batch_num, len(existing))
        
        if new_questions:
            existing.extend(new_questions)
            # Save after each batch
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(existing, f, ensure_ascii=False, indent=2)
            print(f"  ✅ +{len(new_questions)} questions (total: {len(existing)})")
        else:
            print(f"  ⚠️ No questions generated in this batch")
        
        # Rate limiting — respectful delay
        time.sleep(5)
    
    print(f"  🎉 {filename}: {len(existing)} questions total")


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Allow filtering by topic from command line
    topics_to_generate = list(TOPICS.keys())
    if len(sys.argv) > 1:
        topics_to_generate = [t for t in sys.argv[1:] if t in TOPICS]
    
    difficulties = ["easy", "medium", "hard"]
    
    total = len(topics_to_generate) * len(difficulties)
    current = 0
    
    for topic_id in topics_to_generate:
        print(f"\n{'='*50}")
        print(f"📚 Topic: {topic_id}")
        print(f"{'='*50}")
        
        for difficulty in difficulties:
            current += 1
            print(f"\n[{current}/{total}] {topic_id} — {difficulty.upper()}")
            generate_topic_difficulty(topic_id, difficulty)
    
    print(f"\n{'='*50}")
    print(f"🎉 Question generation complete!")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
