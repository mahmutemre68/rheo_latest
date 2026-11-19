"""
Variable Assignment Question Generator
Üretilen soru tipleri:
- Basit değişken atama
- Toplama, çıkarma, çarpma işlemleri
- Değişken yeniden atama
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


class VariableGenerator:
    """Değişken atama ve aritmetik işlem soruları üretir."""

    VARIABLE_NAMES = ['a', 'b', 'x', 'y', 'n', 'm', 'num', 'val']
    OPERATIONS = [
        ('+', 'toplar', lambda a, b: a + b),
        ('-', 'çıkarır', lambda a, b: a - b),
        ('*', 'çarpar', lambda a, b: a * b),
    ]

    def __init__(self):
        self.question_count = 0

    def _generate_id(self, difficulty: int) -> str:
        """Unique question ID üretir: variables_1_1707234567"""
        self.question_count += 1
        timestamp = int(time.time() * 1000) % 100000
        return f"variables_{difficulty}_{timestamp}_{self.question_count}"

    def _generate_wrong_options(
        self, correct: int, var1_val: int, var2_val: int, operation: str
    ) -> List[str]:
        """Akla yatkın yanlış şıklar üretir."""
        wrong = set()

        # String concatenation hatası (çok yaygın yeni başlayan hatası)
        if operation == '+':
            wrong.add(f"{var1_val}{var2_val}")

        # Off-by-one hataları
        wrong.add(str(correct + 1))
        wrong.add(str(correct - 1))

        # Operasyon karışıklığı
        if operation == '+':
            wrong.add(str(var1_val * var2_val))
        elif operation == '*':
            wrong.add(str(var1_val + var2_val))
        elif operation == '-':
            wrong.add(str(var2_val - var1_val))  # Ters çıkarma

        # correct değerini çıkar ve 3 tane seç
        wrong.discard(str(correct))
        wrong_list = list(wrong)
        random.shuffle(wrong_list)
        return wrong_list[:3]

    def generate_simple_assignment(self) -> Question:
        """Basit değişken atama sorusu: a = 5; print(a)"""
        var_name = random.choice(self.VARIABLE_NAMES)
        value = random.randint(1, 20)

        code = f"{var_name} = {value}\nprint({var_name})"
        correct = str(value)

        wrong = [
            str(value + 1),
            str(value - 1),
            "Error"
        ]

        return Question(
            id=self._generate_id(1),
            type="prediction",
            difficulty=1,
            topic="variables",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=correct,
            wrong_options=wrong,
            explanation=f"print() fonksiyonu {var_name} değişkeninin değerini ekrana basar."
        )

    def generate_arithmetic(self) -> Question:
        """Aritmetik işlem sorusu: a = 5; b = 3; print(a + b)"""
        var1 = random.choice(self.VARIABLE_NAMES[:4])
        var2 = random.choice([v for v in self.VARIABLE_NAMES[4:] if v != var1])
        
        val1 = random.randint(2, 15)
        val2 = random.randint(2, 10)

        op_symbol, op_name, op_func = random.choice(self.OPERATIONS)
        result = op_func(val1, val2)

        code = f"{var1} = {val1}\n{var2} = {val2}\nprint({var1} {op_symbol} {var2})"

        wrong = self._generate_wrong_options(result, val1, val2, op_symbol)

        return Question(
            id=self._generate_id(1),
            type="prediction",
            difficulty=1,
            topic="variables",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=str(result),
            wrong_options=wrong,
            explanation=f"Python'da {op_symbol} operatörü sayıları {op_name}."
        )

    def generate_reassignment(self) -> Question:
        """Değişken yeniden atama: a = 5; a = a + 3; print(a)"""
        var = random.choice(self.VARIABLE_NAMES[:4])
        initial = random.randint(3, 10)
        delta = random.randint(2, 5)

        op_symbol, _, op_func = random.choice(self.OPERATIONS[:2])  # Sadece + ve -
        final = op_func(initial, delta)

        code = f"{var} = {initial}\n{var} = {var} {op_symbol} {delta}\nprint({var})"

        wrong = [
            str(initial),  # Güncelleme unutuldu
            str(delta),    # İlk değer yerine delta
            str(initial + delta + 1)  # Off-by-one
        ]

        return Question(
            id=self._generate_id(2),
            type="prediction",
            difficulty=2,
            topic="variables",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=str(final),
            wrong_options=wrong,
            explanation=f"{var} önce {initial} değerini alıyor, sonra {op_symbol} {delta} işlemiyle {final} oluyor."
        )

    def generate(self, count: int = 10) -> List[Question]:
        """Belirtilen sayıda karışık soru üretir."""
        generators = [
            self.generate_simple_assignment,
            self.generate_arithmetic,
            self.generate_reassignment,
        ]

        questions = []
        for _ in range(count):
            gen_func = random.choice(generators)
            questions.append(gen_func())

        return questions
