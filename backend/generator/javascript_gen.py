"""
JavaScript Question Generator
Üretilen soru tipleri:
- let/const değişkenler
- Fonksiyonlar
- Arrow functions
- Array metodları (map, filter)
- Template literals
"""

import random
import time
from dataclasses import dataclass
from typing import List


@dataclass
class Question:
    id: str
    type: str
    difficulty: int
    topic: str
    code_snippet: str
    question_text: str
    correct_answer: str
    wrong_options: List[str]
    explanation: str
    language: str = "javascript"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "type": self.type,
            "difficulty": self.difficulty,
            "topic": self.topic,
            "code_snippet": self.code_snippet,
            "question_text": self.question_text,
            "correct_answer": self.correct_answer,
            "wrong_options": self.wrong_options,
            "explanation": self.explanation,
            "language": self.language
        }


class JavaScriptGenerator:
    """JavaScript soru üreteci."""

    VARIABLE_NAMES = ['x', 'y', 'a', 'b', 'num', 'val', 'count', 'result']

    def __init__(self):
        self.question_count = 0

    def _generate_id(self, difficulty: int) -> str:
        self.question_count += 1
        timestamp = int(time.time() * 1000) % 100000
        return f"js_{difficulty}_{timestamp}_{self.question_count}"

    # ===== Basic Questions =====

    def generate_let_variable(self) -> Question:
        """let x = 5; console.log(x);"""
        var = random.choice(self.VARIABLE_NAMES)
        value = random.randint(1, 20)

        code = f"""let {var} = {value};
console.log({var});"""

        return Question(
            id=self._generate_id(1),
            type="prediction",
            difficulty=1,
            topic="variables",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=str(value),
            wrong_options=[str(value + 1), str(value - 1), "undefined"],
            explanation=f"let ile tanımlanan {var} değişkeni {value} değerini tutar."
        )

    def generate_const_variable(self) -> Question:
        """const x = 5;"""
        var = random.choice(self.VARIABLE_NAMES)
        value = random.randint(1, 20)

        code = f"""const {var} = {value};
console.log({var});"""

        return Question(
            id=self._generate_id(1),
            type="prediction",
            difficulty=1,
            topic="variables",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=str(value),
            wrong_options=[str(value + 1), "undefined", "Error"],
            explanation=f"const sabit değişken tanımlar. {var} = {value}"
        )

    def generate_template_literal(self) -> Question:
        """Template string"""
        name = random.choice(["Ali", "Ayşe", "Mehmet", "Zeynep"])
        age = random.randint(18, 30)

        code = f"""const name = "{name}";
const age = {age};
console.log(`${{name}} is ${{age}}`);"""

        correct = f"{name} is {age}"

        return Question(
            id=self._generate_id(1),
            type="prediction",
            difficulty=1,
            topic="strings",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=correct,
            wrong_options=[f"${{{name}}} is ${{{age}}}", f"{name}{age}", "undefined"],
            explanation="Template literals (``) içinde ${} ile değişkenler yazılır."
        )

    def generate_function(self) -> Question:
        """function add(a, b) { return a + b; }"""
        val1 = random.randint(2, 10)
        val2 = random.randint(2, 10)
        result = val1 + val2

        code = f"""function add(a, b) {{
    return a + b;
}}
console.log(add({val1}, {val2}));"""

        return Question(
            id=self._generate_id(1),
            type="prediction",
            difficulty=1,
            topic="functions",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=str(result),
            wrong_options=[str(result + 1), f"{val1}{val2}", "undefined"],
            explanation=f"add fonksiyonu {val1} + {val2} = {result} döndürür."
        )

    def generate_for_loop(self) -> Question:
        """for (let i = 0; i < n; i++)"""
        limit = random.randint(3, 6)
        result = sum(range(limit))

        code = f"""let sum = 0;
for (let i = 0; i < {limit}; i++) {{
    sum += i;
}}
console.log(sum);"""

        wrong = [
            str(sum(range(limit + 1))),
            str(sum(range(1, limit + 1))),
            str(limit)
        ]

        return Question(
            id=self._generate_id(2),
            type="prediction",
            difficulty=2,
            topic="loops",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=str(result),
            wrong_options=wrong,
            explanation=f"Döngü 0'dan {limit-1}'e kadar gider. Toplam = {result}"
        )

    # ===== Hard Questions (ELO >= 1200) =====

    def generate_arrow_function(self) -> Question:
        """const add = (a, b) => a + b;"""
        val1 = random.randint(2, 10)
        val2 = random.randint(2, 10)
        result = val1 + val2

        code = f"""const add = (a, b) => a + b;
console.log(add({val1}, {val2}));"""

        return Question(
            id=self._generate_id(2),
            type="prediction",
            difficulty=2,
            topic="arrow_functions",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=str(result),
            wrong_options=[str(result - 1), f"{val1}{val2}", "undefined"],
            explanation=f"Arrow function: (a, b) => a + b kısaltılmış function sözdizimi."
        )

    def generate_map(self) -> Question:
        """arr.map(x => x * 2)"""
        arr = [random.randint(1, 5) for _ in range(3)]
        multiplier = random.choice([2, 3])
        result = [x * multiplier for x in arr]

        code = f"""const arr = {arr};
const doubled = arr.map(x => x * {multiplier});
console.log(doubled);"""

        result_str = str(result).replace(" ", "")

        return Question(
            id=self._generate_id(3),
            type="prediction",
            difficulty=3,
            topic="array_methods",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=result_str,
            wrong_options=[str(arr), str(sum(result)), "[undefined]"],
            explanation=f"map() her elemanı {multiplier} ile çarpar: {result}"
        )

    def generate_filter(self) -> Question:
        """arr.filter(x => x > 5)"""
        arr = [random.randint(1, 10) for _ in range(5)]
        threshold = 5
        result = [x for x in arr if x > threshold]

        code = f"""const arr = {arr};
const filtered = arr.filter(x => x > {threshold});
console.log(filtered);"""

        result_str = str(result).replace(" ", "")

        return Question(
            id=self._generate_id(3),
            type="prediction",
            difficulty=3,
            topic="array_methods",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=result_str,
            wrong_options=[str(arr), "[]", str([x for x in arr if x <= threshold])],
            explanation=f"filter() sadece {threshold}'ten büyük elemanları döndürür: {result}"
        )

    def generate_spread_operator(self) -> Question:
        """const arr2 = [...arr1, 4];"""
        arr1 = [random.randint(1, 3) for _ in range(3)]
        new_val = random.randint(4, 6)
        result = arr1 + [new_val]

        code = f"""const arr1 = {arr1};
const arr2 = [...arr1, {new_val}];
console.log(arr2);"""

        result_str = str(result).replace(" ", "")

        return Question(
            id=self._generate_id(2),
            type="prediction",
            difficulty=2,
            topic="spread",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=result_str,
            wrong_options=[str(arr1), str([new_val] + arr1), "Error"],
            explanation=f"Spread operator (...) diziyi açar ve yeni eleman ekler."
        )

    def generate(self, count: int = 10, include_hard: bool = False) -> List[Question]:
        """Belirtilen sayıda soru üretir."""
        basic_generators = [
            self.generate_let_variable,
            self.generate_const_variable,
            self.generate_template_literal,
            self.generate_function,
            self.generate_for_loop,
        ]
        
        hard_generators = [
            self.generate_arrow_function,
            self.generate_map,
            self.generate_filter,
            self.generate_spread_operator,
        ]

        generators = basic_generators[:]
        if include_hard:
            generators.extend(hard_generators)

        questions = []
        for _ in range(count):
            gen_func = random.choice(generators)
            questions.append(gen_func())

        return questions
