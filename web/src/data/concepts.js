/* ══════════════════════════════════════════
   Rheo — Concept Decks (konu anlatımı)
   Short, swipeable card lessons that replace the old video nodes.
   One deck per chapter per language; 6 cards, ~90 seconds.

   Card kinds — see ConceptDeck.jsx for the renderer:
     hook     opening question, sets up why the topic matters
     idea     the core rule + a snippet
     code     a worked example
     compare  wrong-vs-right side by side
     pitfall  the classic trap
     recap    three takeaways, unlocks CONTINUE

   Every text field is { en, tr }; the deck picks the active locale.
   Code lines are already language-specific — the deck lives under its
   language key, so no per-line branching is needed.
   ══════════════════════════════════════════ */

/* ── PYTHON ────────────────────────────────────────────────────── */
const pythonDecks = {
    1: {
        titleEn: 'Variables & Types', titleTr: 'Değişkenler & Tipler',
        minutes: 2,
        cards: [
            {
                kind: 'hook', icon: '📦',
                title: { en: 'Where does a program keep things?', tr: 'Program bir şeyi nerede tutar?' },
                body: {
                    en: 'A variable is a name you stick on a value so you can ask for it again later.',
                    tr: 'Değişken, bir değere yapıştırdığın isimdir; sonra o isimle geri istersin.',
                },
            },
            {
                kind: 'idea', icon: '🏷️',
                title: { en: 'Name on the left, value on the right', tr: 'Solda isim, sağda değer' },
                body: {
                    en: 'You never declare a type. Python reads the value and picks the type for you.',
                    tr: 'Tip yazmazsın. Python değere bakar ve tipi kendisi seçer.',
                },
                code: ['name = "Rheo"', 'age = 3', 'print(name, age)   # Rheo 3'],
                caption: { en: '= means "put this in", not "is equal to".', tr: '= "eşittir" değil, "bunu içine koy" demektir.' },
            },
            {
                kind: 'code', icon: '🔢',
                title: { en: 'The four you will use every day', tr: 'Her gün kullanacağın dört tip' },
                code: [
                    'count = 42       # int',
                    'ratio = 3.14     # float',
                    'label = "hello"  # str',
                    'ready = True     # bool',
                ],
                caption: { en: 'type(count) reports the type of the value, not the name.', tr: 'type(count), ismin değil değerin tipini söyler.' },
            },
            {
                kind: 'compare', icon: '⚖️',
                title: { en: 'One equals sign, or two?', tr: 'Tek eşittir mi, çift mi?' },
                bad: { code: ['if age = 3:'], label: { en: 'assigns → SyntaxError', tr: 'atama yapar → SyntaxError' } },
                good: { code: ['if age == 3:'], label: { en: 'compares → True / False', tr: 'karşılaştırır → True / False' } },
                body: { en: 'One = stores. Two == asks a question.', tr: 'Tek = saklar. Çift == soru sorar.' },
            },
            {
                kind: 'pitfall', icon: '⚠️',
                title: { en: 'input() always hands back text', tr: 'input() her zaman metin döndürür' },
                code: ['age = input("Age: ")   # "25", a str', 'if age > 18:           # TypeError!', '    print("Adult")'],
                body: {
                    en: 'Even when the user types digits, you get a str. Convert first: int(input(...)).',
                    tr: 'Kullanıcı rakam yazsa bile elinde str olur. Önce çevir: int(input(...)).',
                },
            },
            {
                kind: 'recap', icon: '✅',
                title: { en: 'Three things to carry out', tr: 'Yanında götüreceğin üç şey' },
                bullets: [
                    { en: 'A variable is a name bound to a value — no type declaration.', tr: 'Değişken, bir değere bağlanmış isimdir — tip bildirimi yok.' },
                    { en: 'int, float, str, bool cover almost everything early on.', tr: 'int, float, str, bool başlangıçta neredeyse her şeyi kapsar.' },
                    { en: '= assigns, == compares, and input() gives you a str.', tr: '= atar, == karşılaştırır, input() sana str verir.' },
                ],
            },
        ],
    },
    2: {
        titleEn: 'Conditions & Flow', titleTr: 'Koşullar & Akış',
        minutes: 2,
        cards: [
            {
                kind: 'hook', icon: '🔀',
                title: { en: 'One input, two futures', tr: 'Tek girdi, iki gelecek' },
                body: {
                    en: 'A condition is the point where your program stops being a straight line and starts making a choice.',
                    tr: 'Koşul, programın düz çizgi olmaktan çıkıp seçim yapmaya başladığı yerdir.',
                },
            },
            {
                kind: 'idea', icon: '🧭',
                title: { en: 'if → elif → else', tr: 'if → elif → else' },
                body: {
                    en: 'Python checks top to bottom and runs the FIRST true branch only. The rest is skipped.',
                    tr: 'Python yukarıdan aşağı bakar ve SADECE ilk doğru dalı çalıştırır. Gerisi atlanır.',
                },
                code: ['if score >= 90:', '    grade = "A"', 'elif score >= 50:', '    grade = "B"', 'else:', '    grade = "F"'],
                caption: { en: 'else has no condition — it is the "none of the above" branch.', tr: "else'in koşulu yoktur — o \"hiçbiri\" dalıdır." },
            },
            {
                kind: 'code', icon: '🧪',
                title: { en: 'Indentation is the block', tr: 'Girinti, bloğun kendisidir' },
                code: ['x = 15', 'if x > 10:', '    print("big")     # inside the if', 'print("done")        # always runs'],
                caption: { en: 'Four spaces decide what belongs to the branch. Nothing else does.', tr: 'Dala neyin ait olduğuna dört boşluk karar verir. Başka hiçbir şey değil.' },
            },
            {
                kind: 'compare', icon: '⚖️',
                title: { en: 'Chain them, or repeat yourself?', tr: 'Zincirle mi, tekrar mı et?' },
                bad: { code: ['if x > 10: label = "big"', 'if x <= 10: label = "small"'], label: { en: 'two tests, can disagree later', tr: 'iki test, sonra çelişebilir' } },
                good: { code: ['if x > 10: label = "big"', 'else: label = "small"'], label: { en: 'one test, always consistent', tr: 'tek test, hep tutarlı' } },
                body: { en: 'elif/else guarantee exactly one branch wins.', tr: 'elif/else tam olarak bir dalın kazanmasını garanti eder.' },
            },
            {
                kind: 'pitfall', icon: '⚠️',
                title: { en: 'Empty things are False', tr: 'Boş şeyler False sayılır' },
                code: ['if items:      # [] → False', '    print("we have items")', '', '# 0, "", [], {}, None are falsy'],
                body: {
                    en: 'You rarely need == True. Ask for the value itself and let truthiness do the work.',
                    tr: 'Nadiren == True gerekir. Değerin kendisini sor, doğruluk (truthiness) işi halletsin.',
                },
            },
            {
                kind: 'recap', icon: '✅',
                title: { en: 'Three things to carry out', tr: 'Yanında götüreceğin üç şey' },
                bullets: [
                    { en: 'Only the first true branch in a chain runs.', tr: 'Zincirde yalnızca ilk doğru dal çalışır.' },
                    { en: 'Indentation defines the block — not braces, not luck.', tr: 'Bloğu girinti belirler — süslü parantez değil, şans hiç değil.' },
                    { en: '0, "", [], {} and None all behave as False.', tr: '0, "", [], {} ve None hepsi False gibi davranır.' },
                ],
            },
        ],
    },
    4: {
        titleEn: 'Functions', titleTr: 'Fonksiyonlar',
        minutes: 2,
        cards: [
            {
                kind: 'hook', icon: '🧩',
                title: { en: 'Copy-paste is a bug factory', tr: 'Kopyala-yapıştır bir hata fabrikasıdır' },
                body: {
                    en: 'The third time you write the same lines, you will fix a bug in two of them and forget the third.',
                    tr: 'Aynı satırları üçüncü kez yazdığında, ikisindeki hatayı düzeltip üçüncüsünü unutursun.',
                },
            },
            {
                kind: 'idea', icon: '🔁',
                title: { en: 'Take something in, hand something back', tr: 'Bir şey al, bir şey geri ver' },
                body: {
                    en: 'def names the block. Parameters are what it needs; return is what it produces.',
                    tr: 'def bloğa isim verir. Parametreler ihtiyacı, return ise ürettiğidir.',
                },
                code: ['def area(w, h):', '    return w * h', '', 'print(area(3, 4))   # 12'],
                caption: { en: 'The function runs only when you call it with ().', tr: 'Fonksiyon yalnızca () ile çağırdığında çalışır.' },
            },
            {
                kind: 'code', icon: '📥',
                title: { en: 'Defaults make arguments optional', tr: 'Varsayılanlar argümanı isteğe bağlı yapar' },
                code: ['def greet(name, greeting="Hi"):', '    return f"{greeting}, {name}!"', '', 'greet("Ada")            # Hi, Ada!', 'greet("Ada", "Hello")   # Hello, Ada!'],
                caption: { en: 'Parameters with defaults must come after the ones without.', tr: 'Varsayılanlı parametreler, varsayılansızlardan sonra gelmeli.' },
            },
            {
                kind: 'compare', icon: '⚖️',
                title: { en: 'return vs print', tr: 'return vs print' },
                bad: { code: ['def double(x):', '    print(x * 2)', '', 'y = double(5)   # y is None'], label: { en: 'shows it, gives you nothing', tr: 'gösterir, sana bir şey vermez' } },
                good: { code: ['def double(x):', '    return x * 2', '', 'y = double(5)   # y is 10'], label: { en: 'hands the value back', tr: 'değeri geri verir' } },
                body: { en: 'print talks to the human. return talks to the rest of your code.', tr: 'print insana konuşur. return kodunun geri kalanına konuşur.' },
            },
            {
                kind: 'pitfall', icon: '⚠️',
                title: { en: 'Never default to a mutable', tr: 'Asla değiştirilebilir bir varsayılan verme' },
                code: ['def add(item, cart=[]):   # built ONCE', '    cart.append(item)', '    return cart', '', '# fix: cart=None, then cart = cart or []'],
                body: {
                    en: 'That [] is created when the function is defined, so every caller shares one list.',
                    tr: 'O [] fonksiyon tanımlanırken bir kez oluşur; böylece tüm çağıranlar aynı listeyi paylaşır.',
                },
            },
            {
                kind: 'recap', icon: '✅',
                title: { en: 'Three things to carry out', tr: 'Yanında götüreceğin üç şey' },
                bullets: [
                    { en: 'Parameters are the inputs; return is the output.', tr: 'Parametreler girdi, return ise çıktıdır.' },
                    { en: 'A function with no return gives back None.', tr: "return'ü olmayan fonksiyon None döndürür." },
                    { en: 'Default arguments are evaluated once, at definition time.', tr: 'Varsayılan argümanlar tanım anında bir kez hesaplanır.' },
                ],
            },
        ],
    },
    7: {
        titleEn: 'Stacks, Queues & Trees', titleTr: 'Yığın, Kuyruk & Ağaçlar',
        minutes: 2,
        cards: [
            {
                kind: 'hook', icon: '🏗️',
                title: { en: 'The order you take things out is a design decision', tr: 'Çıkarma sırası bir tasarım kararıdır' },
                body: {
                    en: 'Undo, printer jobs, browser history — each picks a different "who is next?" rule.',
                    tr: 'Geri al, yazıcı işleri, tarayıcı geçmişi — her biri farklı bir "sıra kimde?" kuralı seçer.',
                },
            },
            {
                kind: 'idea', icon: '🥞',
                title: { en: 'Stack — last in, first out', tr: 'Yığın — son giren ilk çıkar' },
                body: {
                    en: 'A pile of plates. You always take the one you put down most recently. That is Ctrl+Z.',
                    tr: 'Tabak yığını. Hep en son koyduğunu alırsın. Ctrl+Z tam olarak budur.',
                },
                code: ['stack = []', 'stack.append("a")', 'stack.append("b")', 'stack.pop()      # "b"'],
                caption: { en: 'A plain list is already a stack: append + pop.', tr: 'Düz bir list zaten yığındır: append + pop.' },
            },
            {
                kind: 'code', icon: '🚶',
                title: { en: 'Queue — first in, first out', tr: 'Kuyruk — ilk giren ilk çıkar' },
                code: ['from collections import deque', '', 'q = deque(["a", "b"])', 'q.append("c")     # join the back', 'q.popleft()       # "a" leaves first'],
                caption: { en: 'A queue at a counter: nobody jumps ahead.', tr: 'Gişedeki sıra: kimse öne kaynak yapmaz.' },
            },
            {
                kind: 'compare', icon: '⚖️',
                title: { en: 'Why deque and not a list?', tr: 'Neden list değil de deque?' },
                bad: { code: ['q = ["a", "b", "c"]', 'q.pop(0)   # shifts every element'], label: { en: 'O(n) — slower as it grows', tr: 'O(n) — büyüdükçe yavaşlar' } },
                good: { code: ['q = deque(["a", "b", "c"])', 'q.popleft()   # just moves a pointer'], label: { en: 'O(1) — constant, always', tr: 'O(1) — her zaman sabit' } },
                body: { en: 'Same result, different cost. At 10 items nobody notices; at 100k everybody does.', tr: 'Aynı sonuç, farklı maliyet. 10 elemanda kimse fark etmez; 100 binde herkes eder.' },
            },
            {
                kind: 'idea', icon: '🌳',
                title: { en: 'Linked list & tree — nodes pointing at nodes', tr: 'Bağlı liste & ağaç — düğümleri işaret eden düğümler' },
                body: {
                    en: 'Stop storing items side by side. Store each item with a pointer to the next one — one pointer is a list, two is a tree.',
                    tr: 'Elemanları yan yana tutmayı bırak. Her elemanı sonrakine işaret ederek tut — bir işaretçi liste, iki işaretçi ağaç yapar.',
                },
                code: ['class Node:', '    def __init__(self, value):', '        self.value = value', '        self.left = None', '        self.right = None'],
                caption: { en: 'Drop .right and the same class becomes a linked list.', tr: '.right’ı çıkar, aynı sınıf bağlı listeye dönüşür.' },
            },
            {
                kind: 'recap', icon: '✅',
                title: { en: 'Three things to carry out', tr: 'Yanında götüreceğin üç şey' },
                bullets: [
                    { en: 'Stack = LIFO (append/pop). Queue = FIFO (append/popleft).', tr: 'Yığın = LIFO (append/pop). Kuyruk = FIFO (append/popleft).' },
                    { en: 'Removing from the front of a list is O(n) — use deque.', tr: 'Listenin başından silmek O(n)’dir — deque kullan.' },
                    { en: 'Trees and linked lists are just nodes holding pointers.', tr: 'Ağaçlar ve bağlı listeler, işaretçi tutan düğümlerden ibarettir.' },
                ],
            },
        ],
    },
}

/* ── JAVASCRIPT ────────────────────────────────────────────────── */
const jsDecks = {
    1: {
        titleEn: 'Variables & Types', titleTr: 'Değişkenler & Tipler',
        minutes: 2,
        cards: [
            {
                kind: 'hook', icon: '📦',
                title: { en: 'Where does a program keep things?', tr: 'Program bir şeyi nerede tutar?' },
                body: {
                    en: 'A variable is a name you stick on a value so you can ask for it again later.',
                    tr: 'Değişken, bir değere yapıştırdığın isimdir; sonra o isimle geri istersin.',
                },
            },
            {
                kind: 'idea', icon: '🏷️',
                title: { en: 'const by default, let when it changes', tr: 'Varsayılan const, değişecekse let' },
                body: {
                    en: 'const blocks reassignment, which makes the code easier to read. Reach for let only when you must.',
                    tr: 'const yeniden atamayı engeller, kodu okumayı kolaylaştırır. let’e ancak mecbur kalınca uzan.',
                },
                code: ['const name = "Rheo"', 'let score = 0', 'score = score + 10', 'console.log(name, score)   // Rheo 10'],
                caption: { en: 'var is the old one — block scope is why let and const replaced it.', tr: 'var eskisidir — blok kapsamı, let ve const’un onu neden değiştirdiğidir.' },
            },
            {
                kind: 'code', icon: '🔢',
                title: { en: 'The types you will meet first', tr: 'İlk karşılaşacağın tipler' },
                code: [
                    'const count = 42      // number',
                    'const label = "hi"    // string',
                    'const ready = true    // boolean',
                    'const nothing = null  // empty',
                    'let unset             // undefined',
                ],
                caption: { en: 'typeof tells you which one you actually have.', tr: 'Elinde gerçekte hangisi var, onu typeof söyler.' },
            },
            {
                kind: 'compare', icon: '⚖️',
                title: { en: '== or ===?', tr: '== mi, === mi?' },
                bad: { code: ['"5" == 5    // true'], label: { en: 'converts types first', tr: 'önce tip dönüştürür' } },
                good: { code: ['"5" === 5   // false'], label: { en: 'compares value AND type', tr: 'değeri VE tipi karşılaştırır' } },
                body: { en: 'Use === everywhere. == hides the bug instead of reporting it.', tr: 'Her yerde === kullan. == hatayı bildirmek yerine saklar.' },
            },
            {
                kind: 'pitfall', icon: '⚠️',
                title: { en: '+ means two different things', tr: '+ iki farklı anlama gelir' },
                code: ['"5" + 3    // "53"  → string glued', '"5" - 3    // 2     → number math', 'Number("5") + 3   // 8  the fix'],
                body: {
                    en: 'With a string on either side, + concatenates. Every other operator converts to number.',
                    tr: 'Bir taraf string ise + birleştirir. Diğer tüm operatörler sayıya çevirir.',
                },
            },
            {
                kind: 'recap', icon: '✅',
                title: { en: 'Three things to carry out', tr: 'Yanında götüreceğin üç şey' },
                bullets: [
                    { en: 'const first, let when the value has to change, never var.', tr: 'Önce const, değer değişecekse let, asla var.' },
                    { en: '=== compares value and type; == quietly converts.', tr: '=== değeri ve tipi karşılaştırır; == sessizce dönüştürür.' },
                    { en: '"5" + 3 is "53" — check your types before you add.', tr: '"5" + 3 sonucu "53" — toplamadan önce tipleri kontrol et.' },
                ],
            },
        ],
    },
    2: {
        titleEn: 'Conditions & Flow', titleTr: 'Koşullar & Akış',
        minutes: 2,
        cards: [
            {
                kind: 'hook', icon: '🔀',
                title: { en: 'One input, two futures', tr: 'Tek girdi, iki gelecek' },
                body: {
                    en: 'A condition is the point where your program stops being a straight line and starts making a choice.',
                    tr: 'Koşul, programın düz çizgi olmaktan çıkıp seçim yapmaya başladığı yerdir.',
                },
            },
            {
                kind: 'idea', icon: '🧭',
                title: { en: 'if → else if → else', tr: 'if → else if → else' },
                body: {
                    en: 'JavaScript checks top to bottom and runs the FIRST true branch only.',
                    tr: 'JavaScript yukarıdan aşağı bakar ve SADECE ilk doğru dalı çalıştırır.',
                },
                code: ['if (score >= 90) {', '  grade = "A"', '} else if (score >= 50) {', '  grade = "B"', '} else {', '  grade = "F"', '}'],
                caption: { en: 'The braces are the block — indentation is only for humans.', tr: 'Bloğu süslü parantezler yapar — girinti sadece insanlar içindir.' },
            },
            {
                kind: 'code', icon: '🎚️',
                title: { en: 'A one-line choice: the ternary', tr: 'Tek satırlık seçim: ternary' },
                code: ['const label = age >= 18', '  ? "adult"', '  : "minor"', '', '// an if/else that returns a value'],
                caption: { en: 'Great for one assignment. Nest two of them and readability dies.', tr: 'Tek atama için harika. İki tanesini iç içe koyarsan okunabilirlik biter.' },
            },
            {
                kind: 'compare', icon: '⚖️',
                title: { en: 'Falsy is not the same as missing', tr: 'Falsy ile "yok" aynı şey değildir' },
                bad: { code: ['const port = input || 8080', '// input = 0 → 8080. Wrong!'], label: { en: '|| rejects every falsy value', tr: '|| tüm falsy değerleri reddeder' } },
                good: { code: ['const port = input ?? 8080', '// only null/undefined → 8080'], label: { en: '?? rejects only null/undefined', tr: '?? yalnızca null/undefined’ı reddeder' } },
                body: { en: '0, "", NaN are real values. Defaults with || throw them away.', tr: '0, "", NaN gerçek değerlerdir. || ile varsayılan vermek onları çöpe atar.' },
            },
            {
                kind: 'pitfall', icon: '⚠️',
                title: { en: 'Six values are falsy. Learn them once.', tr: 'Altı değer falsy’dir. Bir kez öğren, yeter.' },
                code: ['false  0  ""  null  undefined  NaN', '', 'if (items.length) { /* not empty */ }'],
                body: {
                    en: 'Everything else — including [] and {} — is truthy. Yes, even an empty array.',
                    tr: 'Geri kalan her şey — [] ve {} dahil — truthy’dir. Evet, boş dizi bile.',
                },
            },
            {
                kind: 'recap', icon: '✅',
                title: { en: 'Three things to carry out', tr: 'Yanında götüreceğin üç şey' },
                bullets: [
                    { en: 'Only the first true branch in a chain runs.', tr: 'Zincirde yalnızca ilk doğru dal çalışır.' },
                    { en: 'The ternary is an if/else that produces a value.', tr: 'Ternary, değer üreten bir if/else’tir.' },
                    { en: 'Six falsy values; [] and {} are not among them.', tr: 'Altı falsy değer var; [] ve {} onlardan değil.' },
                ],
            },
        ],
    },
    4: {
        titleEn: 'Functions', titleTr: 'Fonksiyonlar',
        minutes: 2,
        cards: [
            {
                kind: 'hook', icon: '🧩',
                title: { en: 'Copy-paste is a bug factory', tr: 'Kopyala-yapıştır bir hata fabrikasıdır' },
                body: {
                    en: 'The third time you write the same lines, you will fix a bug in two of them and forget the third.',
                    tr: 'Aynı satırları üçüncü kez yazdığında, ikisindeki hatayı düzeltip üçüncüsünü unutursun.',
                },
            },
            {
                kind: 'idea', icon: '🔁',
                title: { en: 'Take something in, hand something back', tr: 'Bir şey al, bir şey geri ver' },
                body: {
                    en: 'Parameters are what the function needs; return is what it produces.',
                    tr: 'Parametreler fonksiyonun ihtiyacı, return ise ürettiğidir.',
                },
                code: ['function area(w, h) {', '  return w * h', '}', '', 'const arrow = (w, h) => w * h'],
                caption: { en: 'A one-expression arrow returns it automatically — no return keyword.', tr: 'Tek ifadeli ok fonksiyonu onu otomatik döndürür — return yazmazsın.' },
            },
            {
                kind: 'code', icon: '📥',
                title: { en: 'Defaults and rest', tr: 'Varsayılanlar ve rest' },
                code: ['function greet(name, hi = "Hi") {', '  return `${hi}, ${name}!`', '}', '', 'const sum = (...nums) =>', '  nums.reduce((a, b) => a + b, 0)'],
                caption: { en: '...nums collects every remaining argument into an array.', tr: '...nums kalan tüm argümanları bir diziye toplar.' },
            },
            {
                kind: 'compare', icon: '⚖️',
                title: { en: 'The arrow trap: braces swallow the result', tr: 'Ok tuzağı: süslü parantez sonucu yutar' },
                bad: { code: ['const double = x => { x * 2 }', 'double(5)   // undefined'], label: { en: 'a block with no return', tr: "return'süz bir blok" } },
                good: { code: ['const double = x => x * 2', 'double(5)   // 10'], label: { en: 'expression body returns it', tr: 'ifade gövdesi onu döndürür' } },
                body: { en: 'Add braces and you owe the function a return statement.', tr: 'Süslü parantez eklersen fonksiyona bir return borçlanırsın.' },
            },
            {
                kind: 'pitfall', icon: '⚠️',
                title: { en: 'A function remembers where it was born', tr: 'Fonksiyon doğduğu yeri hatırlar' },
                code: ['function counter() {', '  let n = 0', '  return () => ++n  // n survives', '}', 'const next = counter()', 'next()  // 1', 'next()  // 2'],
                body: {
                    en: 'That is a closure: the inner function keeps its outer variables alive after the outer call ends.',
                    tr: 'Bu bir closure: iç fonksiyon, dış çağrı bitse de dış değişkenleri canlı tutar.',
                },
            },
            {
                kind: 'recap', icon: '✅',
                title: { en: 'Three things to carry out', tr: 'Yanında götüreceğin üç şey' },
                bullets: [
                    { en: 'Parameters are the inputs; return is the output.', tr: 'Parametreler girdi, return ise çıktıdır.' },
                    { en: 'x => x * 2 returns; x => { x * 2 } does not.', tr: 'x => x * 2 döndürür; x => { x * 2 } döndürmez.' },
                    { en: 'A closure keeps outer variables alive after the call ends.', tr: 'Closure, çağrı bittikten sonra dış değişkenleri canlı tutar.' },
                ],
            },
        ],
    },
    7: {
        titleEn: 'Stacks, Queues & Trees', titleTr: 'Yığın, Kuyruk & Ağaçlar',
        minutes: 2,
        cards: [
            {
                kind: 'hook', icon: '🏗️',
                title: { en: 'The order you take things out is a design decision', tr: 'Çıkarma sırası bir tasarım kararıdır' },
                body: {
                    en: 'Undo, print jobs, browser history — each picks a different "who is next?" rule.',
                    tr: 'Geri al, yazıcı işleri, tarayıcı geçmişi — her biri farklı bir "sıra kimde?" kuralı seçer.',
                },
            },
            {
                kind: 'idea', icon: '🥞',
                title: { en: 'Stack — last in, first out', tr: 'Yığın — son giren ilk çıkar' },
                body: {
                    en: 'A pile of plates. You always take the one you put down most recently. That is Ctrl+Z.',
                    tr: 'Tabak yığını. Hep en son koyduğunu alırsın. Ctrl+Z tam olarak budur.',
                },
                code: ['const stack = []', 'stack.push("a")', 'stack.push("b")', 'stack.pop()      // "b"'],
                caption: { en: 'A plain array is already a stack: push + pop.', tr: 'Düz bir dizi zaten yığındır: push + pop.' },
            },
            {
                kind: 'code', icon: '🚶',
                title: { en: 'Queue — first in, first out', tr: 'Kuyruk — ilk giren ilk çıkar' },
                code: ['const q = ["a", "b"]', 'q.push("c")      // join the back', 'q.shift()        // "a" leaves first'],
                caption: { en: 'A queue at a counter: nobody jumps ahead.', tr: 'Gişedeki sıra: kimse öne kaynak yapmaz.' },
            },
            {
                kind: 'compare', icon: '⚖️',
                title: { en: 'shift() is not free', tr: 'shift() bedava değildir' },
                bad: { code: ['q.shift()   // re-indexes everything'], label: { en: 'O(n) — slower as it grows', tr: 'O(n) — büyüdükçe yavaşlar' } },
                good: { code: ['let head = 0', 'const item = q[head++]  // pointer'], label: { en: 'O(1) — constant, always', tr: 'O(1) — her zaman sabit' } },
                body: { en: 'Same result, different cost. At 10 items nobody notices; at 100k everybody does.', tr: 'Aynı sonuç, farklı maliyet. 10 elemanda kimse fark etmez; 100 binde herkes eder.' },
            },
            {
                kind: 'idea', icon: '🌳',
                title: { en: 'Linked list & tree — nodes pointing at nodes', tr: 'Bağlı liste & ağaç — düğümleri işaret eden düğümler' },
                body: {
                    en: 'Stop storing items side by side. Store each item with a pointer to the next — one pointer is a list, two is a tree.',
                    tr: 'Elemanları yan yana tutmayı bırak. Her elemanı sonrakine işaret ederek tut — bir işaretçi liste, iki işaretçi ağaç yapar.',
                },
                code: ['class Node {', '  constructor(value) {', '    this.value = value', '    this.left = null', '    this.right = null', '  }', '}'],
                caption: { en: 'Drop .right and the same class becomes a linked list.', tr: '.right’ı çıkar, aynı sınıf bağlı listeye dönüşür.' },
            },
            {
                kind: 'recap', icon: '✅',
                title: { en: 'Three things to carry out', tr: 'Yanında götüreceğin üç şey' },
                bullets: [
                    { en: 'Stack = LIFO (push/pop). Queue = FIFO (push/shift).', tr: 'Yığın = LIFO (push/pop). Kuyruk = FIFO (push/shift).' },
                    { en: 'shift() re-indexes the array — O(n). A head pointer is O(1).', tr: 'shift() diziyi yeniden indeksler — O(n). Baş işaretçisi O(1).' },
                    { en: 'Trees and linked lists are just nodes holding pointers.', tr: 'Ağaçlar ve bağlı listeler, işaretçi tutan düğümlerden ibarettir.' },
                ],
            },
        ],
    },
}

/* ── JAVA ──────────────────────────────────────────────────────── */
const javaDecks = {
    1: {
        titleEn: 'Variables & Types', titleTr: 'Değişkenler & Tipler',
        minutes: 2,
        cards: [
            {
                kind: 'hook', icon: '📦',
                title: { en: 'Java asks for the type up front', tr: 'Java tipi baştan sorar' },
                body: {
                    en: 'You declare what a variable holds before you use it. The compiler then catches whole classes of bugs for you.',
                    tr: 'Bir değişkenin ne tuttuğunu kullanmadan önce bildirirsin. Karşılığında derleyici bütün hata sınıflarını senin için yakalar.',
                },
            },
            {
                kind: 'idea', icon: '🏷️',
                title: { en: 'Type, name, value', tr: 'Tip, isim, değer' },
                body: {
                    en: 'The type is a promise. Break it and the code will not even compile.',
                    tr: 'Tip bir sözdür. Sözü bozarsan kod derlenmez bile.',
                },
                code: ['String name = "Rheo";', 'int age = 3;', 'System.out.println(name + " " + age);'],
                caption: { en: 'var age = 3; lets the compiler infer it — the type is still fixed.', tr: 'var age = 3; derleyicinin çıkarım yapmasını sağlar — tip yine sabittir.' },
            },
            {
                kind: 'code', icon: '🔢',
                title: { en: 'Primitives vs references', tr: 'İlkel tipler vs referanslar' },
                code: [
                    'int count = 42;       // primitive',
                    'double ratio = 3.14;  // primitive',
                    'boolean ready = true; // primitive',
                    'String label = "hi";  // reference',
                ],
                caption: { en: 'Lowercase types are primitives; capitalised ones are objects.', tr: 'Küçük harfli tipler ilkel, büyük harfliler nesnedir.' },
            },
            {
                kind: 'compare', icon: '⚖️',
                title: { en: 'Comparing Strings', tr: 'String karşılaştırma' },
                bad: { code: ['if (a == b)'], label: { en: 'compares addresses', tr: 'adresleri karşılaştırır' } },
                good: { code: ['if (a.equals(b))'], label: { en: 'compares the text', tr: 'metni karşılaştırır' } },
                body: { en: '== on objects asks "same box?". equals() asks "same contents?".', tr: 'Nesnelerde == "aynı kutu mu?" diye sorar. equals() "aynı içerik mi?" diye.' },
            },
            {
                kind: 'pitfall', icon: '⚠️',
                title: { en: 'int ÷ int throws away the remainder', tr: 'int ÷ int kalanı çöpe atar' },
                code: ['int a = 7, b = 2;', 'System.out.println(a / b);', '// 3, not 3.5', 'System.out.println((double) a / b);', '// 3.5'],
                body: {
                    en: 'Two ints divide as ints. Cast one side to double before you divide, not after.',
                    tr: 'İki int, int gibi bölünür. Bölmeden sonra değil, önce bir tarafı double’a çevir.',
                },
            },
            {
                kind: 'recap', icon: '✅',
                title: { en: 'Three things to carry out', tr: 'Yanında götüreceğin üç şey' },
                bullets: [
                    { en: 'Every variable declares its type — the compiler enforces it.', tr: 'Her değişken tipini bildirir — derleyici bunu zorunlu kılar.' },
                    { en: 'Use .equals() for Strings, == only for primitives.', tr: "String'lerde .equals(), == yalnızca ilkel tiplerde." },
                    { en: '7 / 2 is 3 until one side becomes a double.', tr: 'Bir taraf double olana kadar 7 / 2 sonucu 3’tür.' },
                ],
            },
        ],
    },
    2: {
        titleEn: 'Conditions & Flow', titleTr: 'Koşullar & Akış',
        minutes: 2,
        cards: [
            {
                kind: 'hook', icon: '🔀',
                title: { en: 'One input, two futures', tr: 'Tek girdi, iki gelecek' },
                body: {
                    en: 'A condition is the point where your program stops being a straight line and starts making a choice.',
                    tr: 'Koşul, programın düz çizgi olmaktan çıkıp seçim yapmaya başladığı yerdir.',
                },
            },
            {
                kind: 'idea', icon: '🧭',
                title: { en: 'if → else if → else', tr: 'if → else if → else' },
                body: {
                    en: 'Java checks top to bottom and runs the FIRST true branch only. The condition must be a boolean.',
                    tr: 'Java yukarıdan aşağı bakar ve SADECE ilk doğru dalı çalıştırır. Koşul boolean olmak zorundadır.',
                },
                code: ['if (score >= 90) {', '    grade = "A";', '} else if (score >= 50) {', '    grade = "B";', '} else {', '    grade = "F";', '}'],
                caption: { en: 'There is no truthiness here — if (1) does not compile.', tr: 'Burada truthiness yok — if (1) derlenmez.' },
            },
            {
                kind: 'code', icon: '🎚️',
                title: { en: 'switch when you branch on one value', tr: 'Tek değere göre dallanıyorsan switch' },
                code: ['String kind = switch (day) {', '    case SAT, SUN -> "weekend";', '    default -> "weekday";', '};'],
                caption: { en: 'The arrow form (Java 14+) returns a value and never falls through.', tr: 'Ok biçimi (Java 14+) değer döndürür ve asla alt case’e sızmaz.' },
            },
            {
                kind: 'compare', icon: '⚖️',
                title: { en: 'The classic switch leak', tr: 'Klasik switch sızıntısı' },
                bad: { code: ['case 1:', '    total += 5;   // no break', 'case 2:', '    total += 9;'], label: { en: 'falls through into case 2', tr: 'case 2’ye sızar' } },
                good: { code: ['case 1 -> total += 5;', 'case 2 -> total += 9;'], label: { en: 'one case, one action', tr: 'tek case, tek eylem' } },
                body: { en: 'A missing break silently runs the next case too.', tr: 'Eksik bir break, sessizce sonraki case’i de çalıştırır.' },
            },
            {
                kind: 'pitfall', icon: '⚠️',
                title: { en: '&& stops early — and that saves you', tr: '&& erken durur — bu seni kurtarır' },
                code: ['if (user != null && user.isActive()) {', '    // safe: the right side never runs', '    // when user is null', '}'],
                body: {
                    en: 'Short-circuit evaluation: if the left side settles the answer, the right side is never evaluated.',
                    tr: 'Kısa devre değerlendirme: sol taraf cevabı belirliyorsa sağ taraf hiç çalıştırılmaz.',
                },
            },
            {
                kind: 'recap', icon: '✅',
                title: { en: 'Three things to carry out', tr: 'Yanında götüreceğin üç şey' },
                bullets: [
                    { en: 'Conditions must be boolean — no truthy numbers.', tr: 'Koşullar boolean olmalı — truthy sayı yok.' },
                    { en: 'Arrow switch returns a value and cannot fall through.', tr: 'Ok switch değer döndürür ve alt case’e sızamaz.' },
                    { en: '&& and || short-circuit; use that to guard against null.', tr: '&& ve || kısa devre yapar; null’a karşı bunu kullan.' },
                ],
            },
        ],
    },
    4: {
        titleEn: 'Methods', titleTr: 'Metotlar',
        minutes: 2,
        cards: [
            {
                kind: 'hook', icon: '🧩',
                title: { en: 'Copy-paste is a bug factory', tr: 'Kopyala-yapıştır bir hata fabrikasıdır' },
                body: {
                    en: 'The third time you write the same lines, you will fix a bug in two of them and forget the third.',
                    tr: 'Aynı satırları üçüncü kez yazdığında, ikisindeki hatayı düzeltip üçüncüsünü unutursun.',
                },
            },
            {
                kind: 'idea', icon: '🔁',
                title: { en: 'The signature is a contract', tr: 'İmza bir sözleşmedir' },
                body: {
                    en: 'Return type, name, parameter types. Callers only need this line to use your method.',
                    tr: 'Dönüş tipi, isim, parametre tipleri. Çağıranın metodunu kullanmak için tek ihtiyacı bu satırdır.',
                },
                code: ['static int area(int w, int h) {', '    return w * h;', '}', '', 'System.out.println(area(3, 4));  // 12'],
                caption: { en: 'A non-void method must return on every path, or it will not compile.', tr: 'void olmayan metot her yolda return etmeli, yoksa derlenmez.' },
            },
            {
                kind: 'code', icon: '📥',
                title: { en: 'Overloading: same name, different inputs', tr: 'Aşırı yükleme: aynı isim, farklı girdi' },
                code: ['static int max(int a, int b)', 'static double max(double a, double b)', '', '// compiler picks by argument type'],
                caption: { en: 'Java has no default parameters — overloading fills that gap.', tr: 'Java’da varsayılan parametre yoktur — bu boşluğu aşırı yükleme doldurur.' },
            },
            {
                kind: 'compare', icon: '⚖️',
                title: { en: 'return vs println', tr: 'return vs println' },
                bad: { code: ['static void doubled(int x) {', '    System.out.println(x * 2);', '}'], label: { en: 'shows it, gives you nothing', tr: 'gösterir, sana bir şey vermez' } },
                good: { code: ['static int doubled(int x) {', '    return x * 2;', '}'], label: { en: 'hands the value back', tr: 'değeri geri verir' } },
                body: { en: 'println talks to the human. return talks to the rest of your code.', tr: 'println insana konuşur. return kodunun geri kalanına konuşur.' },
            },
            {
                kind: 'pitfall', icon: '⚠️',
                title: { en: 'Java passes copies — of the reference too', tr: 'Java kopya geçirir — referansı da kopyalar' },
                code: ['static void reset(int n) { n = 0; }', '// caller unchanged', '', 'static void clear(List<String> xs) {', '    xs.clear();  // caller sees it', '}'],
                body: {
                    en: 'Reassigning a parameter is invisible outside. Mutating the object it points to is not.',
                    tr: 'Parametreye yeniden atama dışarıdan görünmez. İşaret ettiği nesneyi değiştirmek görünür.',
                },
            },
            {
                kind: 'recap', icon: '✅',
                title: { en: 'Three things to carry out', tr: 'Yanında götüreceğin üç şey' },
                bullets: [
                    { en: 'The signature is the contract: return type, name, parameters.', tr: 'İmza sözleşmedir: dönüş tipi, isim, parametreler.' },
                    { en: 'Overloading replaces the default parameters Java lacks.', tr: 'Aşırı yükleme, Java’da olmayan varsayılan parametrenin yerini tutar.' },
                    { en: 'Reassigning a parameter is local; mutating the object is not.', tr: 'Parametreye atama yereldir; nesneyi değiştirmek değildir.' },
                ],
            },
        ],
    },
    7: {
        titleEn: 'Stacks, Queues & Trees', titleTr: 'Yığın, Kuyruk & Ağaçlar',
        minutes: 2,
        cards: [
            {
                kind: 'hook', icon: '🏗️',
                title: { en: 'The order you take things out is a design decision', tr: 'Çıkarma sırası bir tasarım kararıdır' },
                body: {
                    en: 'Undo, print jobs, browser history — each picks a different "who is next?" rule.',
                    tr: 'Geri al, yazıcı işleri, tarayıcı geçmişi — her biri farklı bir "sıra kimde?" kuralı seçer.',
                },
            },
            {
                kind: 'idea', icon: '🥞',
                title: { en: 'Stack — last in, first out', tr: 'Yığın — son giren ilk çıkar' },
                body: {
                    en: 'A pile of plates. You always take the one you put down most recently. That is Ctrl+Z.',
                    tr: 'Tabak yığını. Hep en son koyduğunu alırsın. Ctrl+Z tam olarak budur.',
                },
                code: ['Deque<String> stack =', '    new ArrayDeque<>();', 'stack.push("a");', 'stack.push("b");', 'stack.pop();   // "b"'],
                caption: { en: 'Prefer ArrayDeque over the legacy Stack class — it is faster.', tr: 'Eski Stack sınıfı yerine ArrayDeque tercih et — daha hızlıdır.' },
            },
            {
                kind: 'code', icon: '🚶',
                title: { en: 'Queue — first in, first out', tr: 'Kuyruk — ilk giren ilk çıkar' },
                code: ['Queue<String> q = new ArrayDeque<>();', 'q.offer("a");     // join the back', 'q.offer("b");', 'q.poll();         // "a" leaves first'],
                caption: { en: 'Same class, two doors: push/pop for LIFO, offer/poll for FIFO.', tr: 'Aynı sınıf, iki kapı: LIFO için push/pop, FIFO için offer/poll.' },
            },
            {
                kind: 'compare', icon: '⚖️',
                title: { en: 'Which list for removing from the front?', tr: 'Baştan silmek için hangi liste?' },
                bad: { code: ['List<String> q = new ArrayList<>();', 'q.remove(0);   // shifts every element'], label: { en: 'O(n) — slower as it grows', tr: 'O(n) — büyüdükçe yavaşlar' } },
                good: { code: ['Deque<String> q = new ArrayDeque<>();', 'q.poll();      // just moves a pointer'], label: { en: 'O(1) — constant, always', tr: 'O(1) — her zaman sabit' } },
                body: { en: 'Same result, different cost. At 10 items nobody notices; at 100k everybody does.', tr: 'Aynı sonuç, farklı maliyet. 10 elemanda kimse fark etmez; 100 binde herkes eder.' },
            },
            {
                kind: 'idea', icon: '🌳',
                title: { en: 'Linked list & tree — nodes pointing at nodes', tr: 'Bağlı liste & ağaç — düğümleri işaret eden düğümler' },
                body: {
                    en: 'Stop storing items side by side. Store each item with a reference to the next — one reference is a list, two is a tree.',
                    tr: 'Elemanları yan yana tutmayı bırak. Her elemanı sonrakine referansla tut — bir referans liste, iki referans ağaç yapar.',
                },
                code: ['class Node {', '    int value;', '    Node left, right;', '    Node(int v) { value = v; }', '}'],
                caption: { en: 'Drop right and the same class becomes a linked list.', tr: 'right’ı çıkar, aynı sınıf bağlı listeye dönüşür.' },
            },
            {
                kind: 'recap', icon: '✅',
                title: { en: 'Three things to carry out', tr: 'Yanında götüreceğin üç şey' },
                bullets: [
                    { en: 'Stack = LIFO (push/pop). Queue = FIFO (offer/poll).', tr: 'Yığın = LIFO (push/pop). Kuyruk = FIFO (offer/poll).' },
                    { en: 'ArrayDeque does both, and beats ArrayList at the front.', tr: 'ArrayDeque ikisini de yapar ve baştan silmede ArrayList’i yener.' },
                    { en: 'Trees and linked lists are just nodes holding references.', tr: 'Ağaçlar ve bağlı listeler, referans tutan düğümlerden ibarettir.' },
                ],
            },
        ],
    },
}

const decksByLanguage = { python: pythonDecks, javascript: jsDecks, java: javaDecks }

/* Returns the deck for a chapter in the given language, or null when that
   chapter has no concept lesson yet. Falls back to Python only if the
   language has no deck table at all — never to a different chapter. */
export function getConceptDeck(chapter, lang) {
    const table = decksByLanguage[lang] || decksByLanguage.python
    return table[chapter] || null
}

export function hasConceptDeck(chapter, lang) {
    return getConceptDeck(chapter, lang) != null
}

/* Card text is stored as { en, tr }; this resolves one against the locale. */
export function pickLocale(field, locale) {
    if (field == null) return ''
    if (typeof field === 'string') return field
    return (locale === 'tr' ? field.tr : field.en) || field.en || ''
}
