import json, glob

with open('assets/questions.json') as f:
    qs = json.load(f)

ids = set(q['id'] for q in qs)
added = 0

for fp in sorted(glob.glob('assets/questions/*.json')):
    with open(fp) as f:
        new = json.load(f)
    for q in new:
        if q['id'] not in ids:
            qs.append(q)
            ids.add(q['id'])
            added += 1

with open('assets/questions.json', 'w') as f:
    json.dump(qs, f, ensure_ascii=False, indent=2)

topics = {}
for q in qs:
    topics[q.get('topic', '?')] = topics.get(q.get('topic', '?'), 0) + 1

print(f'Added {added}, Total: {len(qs)}')
for t, c in sorted(topics.items()):
    print(f'  {t}: {c}')
