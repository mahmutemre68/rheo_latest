"""
Loop Question Generator
Üretilen soru tipleri:
- for range() döngüsü
- Toplam hesaplama
- Sayaç (counter) döngüleri
- While döngüsü
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


class LoopGenerator:
    """Döngü soruları üretir."""

    def __init__(self):
        self.question_count = 0

    def _generate_id(self, difficulty: int) -> str:
        self.question_count += 1
        timestamp = int(time.time() * 1000) % 100000
        return f"loops_{difficulty}_{timestamp}_{self.question_count}"

    def generate_simple_range(self) -> Question:
        """Basit for range: for i in range(5): print(i)"""
        n = random.randint(3, 6)

        code = f"for i in range({n}):\n    print(i)"

        # Çıktı: 0, 1, 2, ... n-1
        correct = "\n".join(str(i) for i in range(n))

        # Yanlış şıklar
        wrong = [
            "\n".join(str(i) for i in range(1, n + 1)),  # 1'den başlama hatası
            "\n".join(str(i) for i in range(n + 1)),     # n dahil hatası
            str(n),  # Sadece son değer
        ]

        return Question(
            id=self._generate_id(1),
            type="prediction",
            difficulty=1,
            topic="loops",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=correct,
            wrong_options=wrong,
            explanation=f"range({n}) 0'dan {n-1}'e kadar sayılar üretir ({n} dahil değil)."
        )

    def generate_range_with_start(self) -> Question:
        """range(start, end): for i in range(2, 6): print(i)"""
        start = random.randint(1, 3)
        end = start + random.randint(3, 5)

        code = f"for i in range({start}, {end}):\n    print(i)"

        correct = "\n".join(str(i) for i in range(start, end))

        wrong = [
            "\n".join(str(i) for i in range(start, end + 1)),  # end dahil
            "\n".join(str(i) for i in range(end)),              # start yok
            "\n".join(str(i) for i in range(start - 1, end)),   # start-1'den başla
        ]

        return Question(
            id=self._generate_id(2),
            type="prediction",
            difficulty=2,
            topic="loops",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=correct,
            wrong_options=wrong,
            explanation=f"range({start}, {end}) {start}'den başlar, {end}'e kadar gider ({end} dahil değil)."
        )

    def generate_sum_loop(self) -> Question:
        """Toplam hesaplama: toplam = 0; for i in range(4): toplam += i"""
        n = random.randint(4, 7)
        correct_sum = sum(range(n))

        code = f"""toplam = 0
for i in range({n}):
    toplam += i
print(toplam)"""

        wrong = [
            str(correct_sum + n),  # n de dahil edilmiş
            str(n - 1),            # Son değer sanılmış
            str(n * (n - 1)),      # Çarpım hatası
        ]

        return Question(
            id=self._generate_id(2),
            type="prediction",
            difficulty=2,
            topic="loops",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=str(correct_sum),
            wrong_options=wrong,
            explanation=f"0+1+2+...+{n-1} = {correct_sum}. range({n}) 0'dan {n-1}'e kadar toplar."
        )

    def generate_counter_loop(self) -> Question:
        """Sayaç döngüsü: Kaç kez çalışır?"""
        n = random.randint(3, 8)

        code = f"""sayac = 0
for i in range({n}):
    sayac += 1
print(sayac)"""

        wrong = [
            str(n - 1),  # Off-by-one
            str(n + 1),  # Off-by-one (diğer yön)
            "0",         # Hiç artmamış
        ]

        return Question(
            id=self._generate_id(1),
            type="prediction",
            difficulty=1,
            topic="loops",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=str(n),
            wrong_options=wrong,
            explanation=f"Döngü {n} kez çalışır (i: 0, 1, 2, ..., {n-1})."
        )

    def generate_while_loop(self) -> Question:
        """While döngüsü: while x < 5: x += 1"""
        start = random.randint(0, 2)
        limit = start + random.randint(3, 5)

        code = f"""x = {start}
while x < {limit}:
    x += 1
print(x)"""

        # x artarak limit'e ulaşır
        correct = str(limit)

        wrong = [
            str(limit - 1),  # Son artış unutulmuş
            str(limit + 1),  # Bir fazla artmış
            str(start),      # Hiç değişmemiş
        ]

        return Question(
            id=self._generate_id(2),
            type="prediction",
            difficulty=2,
            topic="loops",
            code_snippet=code,
            question_text="Bu kodun çıktısı nedir?",
            correct_answer=correct,
            wrong_options=wrong,
            explanation=f"x {start}'dan başlar, her adımda 1 artar. x={limit} olunca koşul sağlanmaz ve döngü biter."
        )

    def generate(self, count: int = 10) -> List[Question]:
        """Belirtilen sayıda karışık soru üretir."""
        generators = [
            self.generate_simple_range,
            self.generate_range_with_start,
            self.generate_sum_loop,
            self.generate_counter_loop,
            self.generate_while_loop,
        ]

        questions = []
        for _ in range(count):
            gen_func = random.choice(generators)
            questions.append(gen_func())

        return questions
