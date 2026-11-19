"""
If/Else Logic Question Generator
Üretilen soru tipleri:
- Basit if kontrolü
- If-else blokları
- If-elif-else zincirleri
"""

import random
import time
from dataclasses import dataclass
from typing import List, Tuple


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
            "explanation": self.explanation
        }


class IfElseGenerator:
    """If/Else mantık soruları üretir."""

    COMPARISONS = [
        ('>', 'büyüktür', lambda a, b: a > b),
        ('<', 'küçüktür', lambda a, b: a < b),
        ('>=', 'büyük veya eşittir', lambda a, b: a >= b),
        ('<=', 'küçük veya eşittir', lambda a, b: a <= b),
        ('==', 'eşittir', lambda a, b: a == b),
        ('!=', 'eşit değildir', lambda a, b: a != b),
    ]

    OUTPUTS_TR = ['Evet', 'Hayır', 'Doğru', 'Yanlış', 'Büyük', 'Küçük', 'Eşit']
    OUTPUTS_EN = ['Yes', 'No', 'True', 'False', 'Big', 'Small', 'Equal']

    def __init__(self):
        self.question_count = 0

    def _generate_id(self, difficulty: int) -> str:
        self.question_count += 1
        timestamp = int(time.time() * 1000) % 100000
        return f"if_else_{difficulty}_{timestamp}_{self.question_count}"

    def _get_output_pair(self) -> Tuple[str, str]:
        """Birbirine zıt iki çıktı döner."""
        pairs = [
            ('Evet', 'Hayır'),
            ('Doğru', 'Yanlış'),
            ('Büyük', 'Küçük'),
            ('Pozitif', 'Negatif'),
        ]
        return random.choice(pairs)

    def generate_simple_if(self) -> Question:
        """Basit if kontrolü: if x > 5: print('Büyük')"""
        var = random.choice(['x', 'n', 'num'])
        value = random.randint(1, 15)
        threshold = random.randint(5, 10)

        comp_symbol, comp_name, comp_func = random.choice(self.COMPARISONS[:4])
        condition_true = comp_func(value, threshold)

        output_if = random.choice(self.OUTPUTS_TR)

        code = f"{var} = {value}\nif {var} {comp_symbol} {threshold}:\n    print('{output_if}')"

        if condition_true:
            correct = output_if
            explanation = f"{value} {comp_name} {threshold} olduğu için koşul doğru, '{output_if}' yazdırılır."
        else:
            correct = "(Çıktı yok)"
            explanation = f"{value} {comp_name} {threshold} olmadığı için koşul yanlış, hiçbir şey yazdırılmaz."

        wrong = [
            output_if if correct == "(Çıktı yok)" else "(Çıktı yok)",
            "Error",
            str(value)
        ]

        return Question(
            id=self._generate_id(1),
            type="prediction",
            difficulty=1,
            topic="if_else",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=correct,
            wrong_options=wrong,
            explanation=explanation
        )

    def generate_if_else(self) -> Question:
        """If-else bloğu: if x > 5: print('A') else: print('B')"""
        var = random.choice(['x', 'y', 'val'])
        value = random.randint(1, 15)
        threshold = random.randint(5, 10)

        comp_symbol, comp_name, comp_func = random.choice(self.COMPARISONS[:2])
        condition_true = comp_func(value, threshold)

        output_if, output_else = self._get_output_pair()

        code = f"""{var} = {value}
if {var} {comp_symbol} {threshold}:
    print('{output_if}')
else:
    print('{output_else}')"""

        if condition_true:
            correct = output_if
            wrong_first = output_else
            explanation = f"{value} {comp_name} {threshold} olduğu için if bloğu çalışır."
        else:
            correct = output_else
            wrong_first = output_if
            explanation = f"{value} {comp_name} {threshold} olmadığı için else bloğu çalışır."

        wrong = [
            wrong_first,
            f"{output_if}\n{output_else}",  # İkisi de yazdırılır hatası
            "Error"
        ]

        return Question(
            id=self._generate_id(2),
            type="prediction",
            difficulty=2,
            topic="if_else",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=correct,
            wrong_options=wrong,
            explanation=explanation
        )

    def generate_if_elif_else(self) -> Question:
        """If-elif-else zinciri"""
        var = random.choice(['score', 'puan', 'x'])
        value = random.randint(0, 100)

        # Notlandırma sistemi
        if value >= 90:
            correct = "A"
            explanation = f"{value} >= 90 olduğu için 'A' yazdırılır."
        elif value >= 70:
            correct = "B"
            explanation = f"{value} >= 70 ve < 90 olduğu için 'B' yazdırılır."
        elif value >= 50:
            correct = "C"
            explanation = f"{value} >= 50 ve < 70 olduğu için 'C' yazdırılır."
        else:
            correct = "F"
            explanation = f"{value} < 50 olduğu için 'F' yazdırılır."

        code = f"""{var} = {value}
if {var} >= 90:
    print('A')
elif {var} >= 70:
    print('B')
elif {var} >= 50:
    print('C')
else:
    print('F')"""

        all_options = ['A', 'B', 'C', 'F']
        wrong = [opt for opt in all_options if opt != correct][:3]

        return Question(
            id=self._generate_id(2),
            type="prediction",
            difficulty=2,
            topic="if_else",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=correct,
            wrong_options=wrong,
            explanation=explanation
        )

    def generate(self, count: int = 10) -> List[Question]:
        """Belirtilen sayıda karışık soru üretir."""
        generators = [
            self.generate_simple_if,
            self.generate_if_else,
            self.generate_if_elif_else,
        ]

        questions = []
        for _ in range(count):
            gen_func = random.choice(generators)
            questions.append(gen_func())

        return questions
