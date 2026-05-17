---
subject: DAT
number: 9
title: "Spojové struktury a stromy"
tags: ["datové-struktury", "algoritmy", "c-sharp", "programování"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **Spojové struktury** jsou datové struktury, kde každý prvek **drží referenci (ukazatel) na další prvek** — místo souvislého bloku paměti jako u pole. **Hlavní zástupci:** **spojový seznam (LinkedList)** — řetěz prvků, optimalizovaný na **vkládání a mazání**. **Binární strom** — hierarchická struktura, kde každý uzel má max 2 potomky. **Binary Search Tree (BST)** — speciální binární strom optimalizovaný pro **vyhledávání v `O(log n)`**. Klíčový kontrast vůči poli: **pole = rychlý random access (O(1)) ale pomalé vkládání/mazání uprostřed (O(n))**. **Spojové struktury = rychlé vkládání/mazání (O(1) s referencí) ale pomalé hledání (O(n))**.

---

## Klíčové pojmy

- **Spojový seznam (LinkedList)** — řetěz uzlů propojených referencemi
- **Uzel (node)** — element struktury, obsahuje **hodnotu** + **referenci** na další uzel
- **Head** — první uzel seznamu (vstupní bod)
- **Tail** — poslední uzel
- **Jednosměrný seznam** — uzel má referenci jen na `next`
- **Obousměrný (doubly linked) seznam** — uzel má `next` i `previous`
- **Binární strom** — strom, kde každý uzel má max 2 potomky (left, right)
- **BST (Binary Search Tree)** — binární strom, kde **levý potomek < uzel < pravý potomek**
- **Kořen (root)** — nejvyšší uzel stromu
- **List (leaf)** — uzel bez potomků
- **Hloubka** — délka cesty z kořene k uzlu
- **Vyvážený strom** — všechny větve podobně dlouhé (lepší výkon)

---

## Hlavní výklad (5–10 min mluvení)

### 1. Spojový seznam (LinkedList)

#### Princip

**Každý prvek (uzel) má 2 části:**
1. **Hodnotu** (data)
2. **Referenci** na další uzel

```
[A | →] → [B | →] → [C | →] → [D | null]
 head                          tail
```

Poslední uzel má `next = null` — signál konce.

#### Vlastnosti

| Operace | Složitost | Důvod |
|---|---|---|
| **Vkládání na začátek** | `O(1)` | Vytvoř nový uzel, jeho `next` = head, head = nový. |
| **Vkládání na konec** | `O(1)` *(pokud máš tail ukazatel)* | Update `tail.next` + posun tailu. Bez tail ukazatele O(n). |
| **Vkládání uprostřed** | `O(1)` *(když máš referenci na předka)* | Jen přehodíš ukazatele: `n-1.next = nový, nový.next = n+1` |
| **Mazání** | `O(1)` *(s referencí)* | `n-1.next = n+1` |
| **Hledání podle hodnoty** | `O(n)` | Musíš projít seznam od head |
| **Přístup podle indexu** | `O(n)` | **NENÍ přímý** — musíš projít od head |

**Pole × LinkedList:**

| | Pole | LinkedList |
|---|---|---|
| Paměť | souvislá | rozprostřená (každý uzel jinde) |
| Random access | `O(1)` | `O(n)` |
| Vkládání uprostřed | `O(n)` (posun) | `O(1)` (přehodit reference) |
| Velikost | fixní (statická) | dynamická |

**Kdy LinkedList:**
- Časté vkládání/mazání **uprostřed** sekvence
- Nepotřebuješ random access
- Implementace queue, stack (interně může být LinkedList)

**Kdy pole:**
- Potřebuješ random access
- Sekvence je hlavně **read-only** nebo append-only

#### Jednosměrný × obousměrný

**Jednosměrný** (singly linked) — uzel zná jen `next`:
```
[A → next] → [B → next] → [C → null]
```
Procházení **jen dopředu**. Pro pohyb dozadu musíš začít znova od head.

**Obousměrný** (doubly linked) — uzel má `next` i `previous`:
```
null ← [A] ⇄ [B] ⇄ [C] → null
       head        tail
```

**Výhody obousměrného:**
- Procházení v obou směrech
- `LinkedList<T>` v .NET je obousměrný

**Nevýhody:**
- Víc paměti (2 reference per uzel místo 1)
- Víc operací při insert/delete (musíš updatovat víc referencí)

#### Cyklický seznam (kruhový)

Poslední uzel ukazuje zpět na první — žádný konec, jen cyklus. Použití: round-robin scheduling, animace.

### 2. Binární strom

#### Princip

**Strom** = hierarchická struktura. **Binární strom** = každý uzel má **max 2 potomky** (left, right).

```
        A          ← kořen (root)
       / \
      B   C
     / \   \
    D   E   F     ← listy (leaves)
```

**Pojmy:**
- **Kořen (root)** — nejvyšší uzel (jeden)
- **Potomek (child)** — uzel pod jiným
- **Rodič (parent)** — uzel nad jiným
- **Sourozenci (siblings)** — uzly se stejným rodičem
- **List (leaf)** — uzel bez potomků
- **Hloubka uzlu** — délka cesty z kořene k uzlu (root = 0)
- **Výška stromu** — maximální hloubka

#### Použití binárních stromů

- **Rozhodovací stromy** — větve = volby, listy = výsledky
- **Souborový systém** — hierarchie složek
- **HTML DOM** — strom elementů
- **Expression trees** — matematické výrazy
- **BST** — efektivní vyhledávání (níže)

### 3. Binary Search Tree (BST)

**Speciální binární strom**, který udržuje pravidlo:
> *"Pro každý uzel: levý potomek < uzel < pravý potomek."*

```
        8
       / \
      3   10
     / \    \
    1   6    14
       / \    /
      4   7  13
```

#### Operace v BST

**Hledání** `O(log n)` *(vyvážený strom)*:
```
Hledám 7:
  start root = 8
  7 < 8 → jdi vlevo na 3
  7 > 3 → jdi vpravo na 6
  7 > 6 → jdi vpravo na 7
  ✓ nalezeno
```

Každé porovnání **polovi prohledávaný prostor** — stejně jako binární vyhledávání v seřazeném poli.

**Vkládání** `O(log n)` *(vyvážený)*:
- Najdi pozici (jako při hledání)
- Vlož nový uzel jako list

**Mazání** `O(log n)`:
- Najdi uzel
- 3 případy: list (jen smaž), 1 potomek (nahraď uzel potomkem), 2 potomky (nahraď nejbližším menším/větším)

#### Worst case — degenerovaný strom

**Pokud vstup je už seřazený** (`1, 2, 3, 4, 5, ...`), BST se zvrhne na **jednostranný řetěz** = LinkedList:

```
1
 \
  2
   \
    3
     \
      4
```

**Hloubka = n**, hledání **`O(n)`** místo `O(log n)`. **Degenerovaný strom.**

**Řešení:** vyvážené stromy (AVL, Red-Black tree) — automaticky se rebalancují při insertu, garantují `O(log n)` v worst case. Implementační složitější (na střední škole se obvykle nedělá).

### 4. Procházení stromů (traversal)

3 standardní způsoby:

#### In-order (LNR — left, node, right)
```
   2
  / \
 1   3
```
Pořadí: `1 → 2 → 3` — pro BST vrátí **seřazené hodnoty**!

#### Pre-order (NLR)
Pořadí: `2 → 1 → 3` — užitečné pro **kopii stromu**.

#### Post-order (LRN)
Pořadí: `1 → 3 → 2` — užitečné pro **mazání stromu** (listy první).

#### BFS (Breadth-First) — po patrech
Pořadí: `2 → 1 → 3` (root → patro 1 → patro 2 ...) — používá frontu.

---

## Konkrétní příklady / kód

### Jednoduchá implementace LinkedList v C#

```cs
class Node {
    public int Value;
    public Node Next;

    public Node(int value) {
        Value = value;
        Next = null;
    }
}

class LinkedList {
    public Node Head;

    public void Add(int value) {
        Node newNode = new Node(value);
        if (Head == null) {
            Head = newNode;
            return;
        }
        Node current = Head;
        while (current.Next != null) {
            current = current.Next;
        }
        current.Next = newNode;
    }

    public void Print() {
        Node current = Head;
        while (current != null) {
            Console.Write(current.Value + " → ");
            current = current.Next;
        }
        Console.WriteLine("null");
    }

    public bool Contains(int value) {
        Node current = Head;
        while (current != null) {
            if (current.Value == value) return true;
            current = current.Next;
        }
        return false;
    }
}
```

### Vkládání mezi dva existující uzly

```cs
void InsertAfter(Node existing, int newValue) {
    Node newNode = new Node(newValue);
    newNode.Next = existing.Next;       // nový ukazuje na n+1
    existing.Next = newNode;            // n-1 ukazuje na nový
}
// Žádný posun — jen 2 ukazatele přehozené. O(1).
```

### Binární strom — jednoduchá implementace

```cs
class TreeNode {
    public int Value;
    public TreeNode Left;
    public TreeNode Right;

    public TreeNode(int value) {
        Value = value;
    }
}

class BST {
    public TreeNode Root;

    public void Insert(int value) {
        Root = InsertRec(Root, value);
    }

    TreeNode InsertRec(TreeNode node, int value) {
        if (node == null) return new TreeNode(value);

        if (value < node.Value)
            node.Left = InsertRec(node.Left, value);
        else if (value > node.Value)
            node.Right = InsertRec(node.Right, value);

        return node;
    }

    public bool Contains(int value) {
        return ContainsRec(Root, value);
    }

    bool ContainsRec(TreeNode node, int value) {
        if (node == null) return false;
        if (node.Value == value) return true;

        return value < node.Value
            ? ContainsRec(node.Left, value)
            : ContainsRec(node.Right, value);
    }

    public void PrintInOrder() {
        InOrder(Root);
        Console.WriteLine();
    }

    void InOrder(TreeNode node) {
        if (node == null) return;
        InOrder(node.Left);
        Console.Write(node.Value + " ");
        InOrder(node.Right);
    }
}
```

### Použití
```cs
BST tree = new BST();
tree.Insert(8);
tree.Insert(3);
tree.Insert(10);
tree.Insert(1);
tree.Insert(6);
tree.PrintInOrder();              // 1 3 6 8 10 (seřazeně!)
Console.WriteLine(tree.Contains(6));   // true
Console.WriteLine(tree.Contains(7));   // false
```

---

## Vztahy / kontrasty

- **Pole × LinkedList** — pole rychlý random access (O(1)), pomalé vkládání uprostřed (O(n)). LinkedList opačně — rychlé vkládání (O(1)), pomalý random access (O(n)).
- **Jednosměrný × obousměrný LinkedList** — jednosměrný úspornější paměťově, obousměrný umožňuje pohyb v obou směrech. .NET `LinkedList<T>` je obousměrný.
- **Strom × graf** — strom je speciální typ grafu bez cyklů, jeden kořen, hierarchická struktura. Graf může mít cykly, víc kořenů, libovolnou strukturu.
- **BST × jiný binární strom** — BST má pořadí (left < node < right). Obecný binární strom žádné takové pravidlo nemá.
- **BST × HashSet** — BST udržuje **seřazené prvky** (in-order traversal = sorted). HashSet rychlejší (O(1) vs O(log n)), ale **bez pořadí**.
- **LinkedList × Stack/Queue** — Stack a Queue mohou být **implementovány přes LinkedList** uvnitř (jednoduché push/pop na head, enqueue/dequeue na tail+head).

---

## Časté otázky komise

**Q:** Co je spojový seznam?
**A:** Datová struktura, kde každý prvek (uzel) drží **hodnotu** a **referenci na další uzel**. Tvoří řetěz prvků v paměti, **nikoliv souvislý blok** jako u pole. Hlavní zástupci: jednosměrný (next), obousměrný (next + previous), cyklický.

**Q:** Jaký je rozdíl mezi polem a LinkedListem?
**A:** **Pole** = souvislý blok paměti, indexový přístup O(1), vkládání uprostřed O(n). **LinkedList** = rozprostřené uzly s referencemi, indexový přístup O(n), vkládání/mazání s referencí O(1). Pole pro random access, LinkedList pro časté úpravy uprostřed.

**Q:** Vyjmenuj operace LinkedList a jejich složitost.
**A:** **Vkládání/mazání s referencí na předchozí uzel** O(1) — jen přehodíš ukazatele. **Vkládání na začátek** O(1). **Vkládání na konec** O(1) s tail ukazatelem, jinak O(n). **Hledání podle hodnoty** O(n) — musíš projít. **Přístup podle indexu** O(n) — NENÍ přímý.

**Q:** Co je binární strom?
**A:** Hierarchická datová struktura, kde každý uzel má **max 2 potomky** (left, right). Má jeden **kořen** (root), uzly bez potomků jsou **listy** (leaves). Použití: hierarchie souborů, DOM, rozhodovací stromy, expression trees.

**Q:** Co je BST a jeho hlavní pravidlo?
**A:** **Binary Search Tree** = speciální binární strom, kde **levý potomek < uzel < pravý potomek**. Toto pravidlo umožňuje **rychlé vyhledávání O(log n)** — každé porovnání polovi prohledávaný prostor. **In-order traversal vrátí seřazené hodnoty**.

**Q:** Co je worst case BST a jak vzniká?
**A:** **Degenerovaný strom** = řetěz uzlů jen na jednu stranu (jako LinkedList). Vzniká, když se vkládají **už seřazené hodnoty** (1, 2, 3, 4, 5...) — každá nová jde na pravou stranu předchozí. Hloubka = n, vyhledávání **O(n)** místo O(log n). **Řešení:** vyvážené stromy (AVL, Red-Black tree).

**Q:** Jaké jsou způsoby procházení stromu?
**A:** **In-order (LNR)** — levý potomek, uzel, pravý. Pro BST vrátí seřazené hodnoty. **Pre-order (NLR)** — uzel první, pak děti. Pro kopii stromu. **Post-order (LRN)** — děti první, pak uzel. Pro mazání stromu (listy první). **BFS (level-order)** — po patrech přes frontu.

**Q:** Kdy zvolíš LinkedList místo pole?
**A:** Když máš **časté vkládání/mazání uprostřed** sekvence a **nepotřebuješ random access**. Příklady: implementace stack/queue, undo historie. Pole je lepší pro read-mostly data nebo append-only.

**Q:** Jaká je hlavní výhoda obousměrného LinkedListu?
**A:** **Pohyb v obou směrech** — z libovolného uzlu zpět na head nebo dopředu na tail. Cena: víc paměti (2 reference per uzel) a víc operací při insert/delete (4 reference místo 2). .NET `LinkedList<T>` je obousměrný.

**Q:** Jaká je složitost in-order traversal BST?
**A:** **O(n)** — projdeme každý uzel přesně jednou. Rekurzivní implementace, ale linerání čas (každý uzel "se navštíví").

---

## Co bych ještě měl vědět (volně)

- **`LinkedList<T>` v .NET** — obousměrný spojový seznam. Metody `AddFirst`, `AddLast`, `AddBefore`, `AddAfter`, `Remove`. Nemá indexový přístup.
- **Skip list** — pravděpodobnostní struktura, alternativa k vyváženým stromům. O(log n) průměr.
- **B-trees** — strom s víc než 2 potomky, optimalizovaný pro disk I/O. Používají DB indexy (MySQL, PostgreSQL).
- **Heap (halda)** — binární strom, kde **rodič ≥ děti** (max-heap) nebo opačně (min-heap). Pro priority queue.
- **Trie** — strom kde každý uzel je znak, používaný pro autocomplete a slovníky.
- **AVL strom** — vyvážený BST, balance factor < 1 pro každý uzel. Rotace při insertu.
- **Red-Black tree** — vyvážený BST, .NET `SortedSet<T>` a `SortedDictionary<T>` ho používají interně.

---

## ⚠️ Nejisté / k ověření

- ⚠️ Tento zápisek staví na `_materials/dat/09/prchal/` (hodina-poznámky, neformální tone) + obecných znalostí. Materiál pokrývá xlsx Popis (*"Spojové seznamy, ukazatele, stromy (binární strom)"*).
- ⚠️ **Doplněno:** procházení stromů (in-/pre-/post-order), worst case BST, vyvážené stromy (AVL, Red-Black) — nebyly v Prchalových zápiscích detailně.
- ⚠️ **AVL a Red-Black stromy** — pokročilá témata, komise se na detail rotací zřídka ptá. Drž jen pojem *"vyvážené BST, garantují O(log n) v worst case přes auto-rebalancing"*.

---

## Praktická příprava (pro 30 min u PC)

Trénuj tyto vzory tak, abys je z prázdného souboru napsal:

1. **LinkedList class** s metodami `Add`, `Print`, `Contains` (~15 min)
2. **InsertAfter** metoda pro vkládání mezi uzly (~5 min)
3. **BST class** s `Insert` (rekurzivně), `Contains`, `InOrder traversal` (~15 min)
4. **Diagram** — nakresli strom z hodnot `[5, 3, 8, 1, 4, 7, 9]` vkládaných v tomto pořadí
5. **Worst case** — nakresli, co se stane s vkládáním `[1, 2, 3, 4, 5]` (degenerovaný strom)

---

## Status

- **Sebehodnocení (před):** 1/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-13
