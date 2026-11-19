#!/usr/bin/env python3
"""
Rheo Question Generator - Main Script
Multi-language support: Python, Java, JavaScript

Kullanım:
    python main.py [--count N] [--language LANG]

Örnek:
    python main.py --count 50 --language python
    python main.py --count 30 --language java
    python main.py --count 30 --language javascript
    python main.py --count 20 --language all
"""

import json
import argparse
import random
from pathlib import Path
from generator import (
    VariableGenerator, 
    IfElseGenerator, 
    LoopGenerator,
    JavaGenerator,
    JavaScriptGenerator
)


def generate_python_questions(count_per_topic: int = 10, include_hard: bool = False) -> list:
    """Python soruları üretir."""
    generators = [
        VariableGenerator(),
        IfElseGenerator(),
        LoopGenerator(),
    ]
    
    all_questions = []
    for gen in generators:
        questions = gen.generate(count=count_per_topic)
        for q in questions:
            q_dict = q.to_dict()
            q_dict['language'] = 'python'
            all_questions.append(q_dict)
    
    return all_questions


def generate_java_questions(count: int = 30, include_hard: bool = False) -> list:
    """Java soruları üretir."""
    gen = JavaGenerator()
    questions = gen.generate(count=count, include_hard=include_hard)
    return [q.to_dict() for q in questions]


def generate_javascript_questions(count: int = 30, include_hard: bool = False) -> list:
    """JavaScript soruları üretir."""
    gen = JavaScriptGenerator()
    questions = gen.generate(count=count, include_hard=include_hard)
    return [q.to_dict() for q in questions]


def generate_questions(language: str = 'all', count: int = 10, include_hard: bool = False) -> list:
    """Belirtilen dil için soru üretir."""
    all_questions = []
    
    if language in ('python', 'all'):
        questions = generate_python_questions(count_per_topic=count, include_hard=include_hard)
        all_questions.extend(questions)
        print(f"🐍 Python: {len(questions)} soru")
    
    if language in ('java', 'all'):
        questions = generate_java_questions(count=count * 3, include_hard=include_hard)
        all_questions.extend(questions)
        print(f"☕ Java: {len(questions)} soru")
    
    if language in ('javascript', 'all'):
        questions = generate_javascript_questions(count=count * 3, include_hard=include_hard)
        all_questions.extend(questions)
        print(f"🟨 JavaScript: {len(questions)} soru")
    
    random.shuffle(all_questions)
    return all_questions


def save_to_json(questions: list, output_path: Path) -> None:
    """Soruları JSON dosyasına kaydeder."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Toplam {len(questions)} soru üretildi: {output_path}")


def main():
    parser = argparse.ArgumentParser(description='Rheo Multi-Language Soru Üretici')
    parser.add_argument(
        '--count', 
        type=int, 
        default=10,
        help='Her topic için üretilecek soru sayısı (default: 10)'
    )
    parser.add_argument(
        '--language',
        type=str,
        default='all',
        choices=['python', 'java', 'javascript', 'all'],
        help='Hedef dil (default: all)'
    )
    parser.add_argument(
        '--hard',
        action='store_true',
        help='İleri seviye soruları dahil et (ELO >= 1200 için)'
    )
    args = parser.parse_args()
    
    # Output path
    script_dir = Path(__file__).parent
    output_path = script_dir / 'output' / 'questions.json'
    
    # Generate and save
    questions = generate_questions(
        language=args.language, 
        count=args.count,
        include_hard=args.hard
    )
    save_to_json(questions, output_path)
    
    # İstatistikler
    langs = {}
    topics = {}
    for q in questions:
        lang = q.get('language', 'unknown')
        topic = q['topic']
        langs[lang] = langs.get(lang, 0) + 1
        topics[topic] = topics.get(topic, 0) + 1
    
    print("\n📊 Dil Dağılımı:")
    for lang, count in sorted(langs.items()):
        print(f"   {lang}: {count} soru")
    
    print("\n📊 Topic Dağılımı:")
    for topic, count in sorted(topics.items()):
        print(f"   {topic}: {count} soru")


if __name__ == '__main__':
    main()
