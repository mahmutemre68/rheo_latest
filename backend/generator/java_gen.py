"""
Java Question Generator
Üretilen soru tipleri:
- Değişken tanımlama (int, String)
- Aritmetik işlemler
- If-Else koşulları
- For döngüleri
- Advanced: Inheritance, Polymorphism
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
    language: str = "java"

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


class JavaGenerator:
    """Java soru üreteci."""

    VARIABLE_NAMES = ['x', 'y', 'a', 'b', 'num', 'val', 'count', 'result']

    def __init__(self):
        self.question_count = 0

    def _generate_id(self, difficulty: int) -> str:
        self.question_count += 1
        timestamp = int(time.time() * 1000) % 100000
        return f"java_{difficulty}_{timestamp}_{self.question_count}"

    # ===== Basic Questions =====

    def generate_variable(self) -> Question:
        """int x = 5; System.out.println(x);"""
        var = random.choice(self.VARIABLE_NAMES)
        value = random.randint(1, 20)

        code = f"""int {var} = {value};
System.out.println({var});"""

        return Question(
            id=self._generate_id(1),
            type="prediction",
            difficulty=1,
            topic="variables",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=str(value),
            wrong_options=[str(value + 1), str(value - 1), "Error"],
            explanation=f"Java'da int bir tam sayı tipidir ve {var} değişkenine {value} atanmıştır."
        )

    def generate_arithmetic(self) -> Question:
        """int x = 5; int y = 3; System.out.println(x + y);"""
        var1, var2 = random.sample(self.VARIABLE_NAMES[:4], 2)
        val1 = random.randint(2, 15)
        val2 = random.randint(2, 10)
        
        ops = [('+', val1 + val2), ('-', val1 - val2), ('*', val1 * val2)]
        op, result = random.choice(ops)

        code = f"""int {var1} = {val1};
int {var2} = {val2};
System.out.println({var1} {op} {var2});"""

        wrong = [str(result + 1), str(result - 1)]
        if op == '+':
            wrong.append(f"{val1}{val2}")  # String concat yanılgısı
        else:
            wrong.append(str(val1 + val2))

        return Question(
            id=self._generate_id(1),
            type="prediction",
            difficulty=1,
            topic="variables",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=str(result),
            wrong_options=wrong[:3],
            explanation=f"Java'da {op} operatörü matematiksel işlem yapar."
        )

    def generate_if_else(self) -> Question:
        """if (x > 5) ... else ..."""
        var = random.choice(self.VARIABLE_NAMES[:4])
        value = random.randint(1, 10)
        threshold = 5
        
        if value > threshold:
            correct = "Greater"
            wrong = ["Less", "Equal", "Error"]
        else:
            correct = "Less"
            wrong = ["Greater", "Equal", "Error"]

        code = f"""int {var} = {value};
if ({var} > {threshold}) {{
    System.out.println("Greater");
}} else {{
    System.out.println("Less");
}}"""

        return Question(
            id=self._generate_id(1),
            type="prediction",
            difficulty=1,
            topic="if_else",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=correct,
            wrong_options=wrong,
            explanation=f"{value} > {threshold} koşulu {'doğru' if value > threshold else 'yanlış'} olduğu için '{correct}' basılır."
        )

    def generate_for_loop(self) -> Question:
        """for (int i = 0; i < n; i++) { sum += i; }"""
        limit = random.randint(3, 6)
        result = sum(range(limit))

        code = f"""int sum = 0;
for (int i = 0; i < {limit}; i++) {{
    sum += i;
}}
System.out.println(sum);"""

        wrong = [
            str(sum(range(limit + 1))),  # i <= limit
            str(sum(range(1, limit + 1))),  # 1'den başla
            str(limit)  # Sadece limit
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
            explanation=f"Döngü 0'dan {limit-1}'e kadar gider. 0+1+...+{limit-1} = {result}"
        )

    # ===== Hard Questions (ELO >= 1200) =====

    def generate_inheritance(self) -> Question:
        """class Child extends Parent { ... }"""
        parent_val = random.randint(10, 20)
        child_val = random.randint(1, 9)
        result = parent_val + child_val

        code = f"""class Parent {{
    int x = {parent_val};
}}
class Child extends Parent {{
    int y = {child_val};
    void print() {{
        System.out.println(x + y);
    }}
}}
new Child().print();"""

        return Question(
            id=self._generate_id(3),
            type="prediction",
            difficulty=3,
            topic="inheritance",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=str(result),
            wrong_options=[str(parent_val), str(child_val), "Error"],
            explanation=f"Child, Parent'tan x={parent_val} değerini miras alır. x + y = {result}"
        )

    def generate_polymorphism(self) -> Question:
        """Method overriding"""
        code = """class Animal {
    void speak() {
        System.out.println("...");
    }
}
class Dog extends Animal {
    void speak() {
        System.out.println("Woof");
    }
}
Animal a = new Dog();
a.speak();"""

        return Question(
            id=self._generate_id(3),
            type="prediction",
            difficulty=3,
            topic="polymorphism",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer="Woof",
            wrong_options=["...", "Error", "Animal"],
            explanation="Polimorfizm: Değişken tipi Animal olsa da, nesne Dog olduğu için Dog.speak() çalışır."
        )

    def generate_string_methods(self) -> Question:
        """String manipulation"""
        words = ["Hello", "World", "Java", "Code"]
        word = random.choice(words)
        
        methods = [
            (f'"{word}".length()', str(len(word)), "length() String uzunluğunu verir"),
            (f'"{word}".toUpperCase()', word.upper(), "toUpperCase() büyük harfe çevirir"),
            (f'"{word}".charAt(0)', word[0], "charAt(0) ilk karakteri verir"),
        ]
        
        method_code, correct, expl = random.choice(methods)
        
        code = f"System.out.println({method_code});"

        wrong = [word.lower(), str(len(word) + 1), word[1] if len(word) > 1 else "a"]

        return Question(
            id=self._generate_id(2),
            type="prediction",
            difficulty=2,
            topic="strings",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=correct,
            wrong_options=wrong[:3],
            explanation=expl
        )

    def generate(self, count: int = 10, include_hard: bool = False) -> List[Question]:
        """Belirtilen sayıda soru üretir."""
        basic_generators = [
            self.generate_variable,
            self.generate_arithmetic,
            self.generate_if_else,
            self.generate_for_loop,
            self.generate_string_methods,
        ]
        
        hard_generators = [
            self.generate_inheritance,
            self.generate_polymorphism,
        ]

        generators = basic_generators[:]
        if include_hard:
            generators.extend(hard_generators)

        questions = []
        for _ in range(count):
            gen_func = random.choice(generators)
            questions.append(gen_func())

        return questions
