---
subject: DAT
number: 14
title: "Verzovací systémy: Git a GitHub"
tags: ["programování", "verzování", "workflow"]
share: public
status: review
speakingTime: 12
updated: "2026-05-17"
---

## Co řeknu jako první (30 s úvod)

> **Git** je **distribuovaný verzovací systém** vytvořený **Linusem Torvaldsem** v roce 2005 pro vývoj Linux Kernelu. Řeší dva základní problémy: *"jak pracovat v týmu na jednom kódu"* a *"jak se vrátit, když něco rozbiju"*. Distribuovaný = každý vývojář má **kompletní kopii historie** na svém disku, lze pracovat offline. Git ukládá **snapshoty** (na rozdíl od starších systémů jako SVN, které ukládaly diffy). **GitHub** je **webová služba** pro hosting Git repozitářů — Git je nástroj, GitHub je platforma. V této otázce projdu **historii, workflow, základní příkazy, branching, vzdálené repozitáře a klientské aplikace**.

---

## Klíčové pojmy

- **VCS (Version Control System)** — verzovací systém
- **Centralizovaný × distribuovaný** — SVN má jeden server, Git má kompletní kopii u každého
- **Snapshot** — odraz celého souborového systému v daný moment (Git ukládá tyto)
- **Repository (repo)** — adresář s `.git/` složkou, drží celou historii
- **Working directory** — soubory, které právě editujeme
- **Staging area (index)** — "přípravná zóna" před commitem
- **Commit** — checkpoint v historii s zprávou
- **Branch** — paralelní linie vývoje
- **Merge** — sloučení dvou branchů
- **Merge conflict** — když dva lidé změnili stejný řádek, Git neví co vybrat
- **Remote** — vzdálený repozitář (GitHub, GitLab)
- **Push / Pull** — odesílání / stahování změn
- **`.gitignore`** — soubor pro ignoraci určitých souborů (hesla, build artefakty)
- **Pull Request (PR)** — žádost o začlenění branche, schvaluje ji někdo jiný

---

## Hlavní výklad (5–10 min mluvení)

### 1. Historie a motivace

- **2005** — Linus Torvalds, vyvíjel Linux Kernel
- Předtím se používalo: ZIPy s názvy `oauth_final_v2_opravdu_final_final2.zip` (anti-pattern), nebo **SVN**
- **SVN** (Subversion) je **centralizovaný** — jeden server, ostatní kopie. Když nejde internet, nemůžeš verzovat.
- **Git** je **distribuovaný** — každý má **plnou kopii historie**, lze pracovat offline a synchronizovat později.

### 2. Centralizovaný × distribuovaný (klíčový kontrast)

| | SVN (centralizovaný) | Git (distribuovaný) |
|---|---|---|
| Uložení | Jeden server, ostatní kopie | Každý vývojář kompletní historie |
| Offline práce | ❌ Ne | ✅ Ano |
| Co ukládá | **Diffy** (rozdíly mezi soubory) | **Snapshoty** (celé verze) |
| Rychlost | Závisí na síti | Lokální, rychlé |
| Failure mode | Server padne → všechno offline | Server padne → každý má kopii |

### 3. Jak Git funguje uvnitř

- **`.git/` složka** v kořenu projektu — skrytá, **drží celou historii a metadata**. Pokud ji smažeš, **přijdeš o historii**.
- **Každý commit** = snapshot celého souborového systému (Git je chytrý — pokud se soubor nezměnil, ukládá jen referenci na předchozí verzi).
- **Hash** každého commitu je SHA-1 (40 znaků). Identifikuje commit jednoznačně.

### 4. Workflow — tři stavy souboru

```
Working directory  ──(git add)──▶  Staging area  ──(git commit)──▶  Repository
   (kde píšeš)                    (přípravná zóna)                  (uložená historie)
```

1. **Working directory** — kde reálně editujeme
2. **Staging area (index)** — *"co chci poslat do dalšího commitu"*. Před commitem.
3. **Repository** — uložená historie. Hash + zpráva + autor + diff.

**Mantra:** *"add do stagingu, commit do repa, push na remote."*

### 5. Základní příkazy

#### Inicializace
```bash
git init                          # založí .git/ v aktuální složce
git clone <url>                   # stáhne existující projekt
```

#### Klasický workflow
```bash
git status                        # co je změněno, na jakém branchi seš
git add <soubor>                  # přidá konkrétní soubor do stagingu
git add .                         # přidá VŠECHNY změny ze složky
git commit -m "zpráva"             # vytvoří commit s touto zprávou
```

#### Historie a porovnání
```bash
git log                           # výpis commitů (autor, datum, hash, zpráva)
git log --oneline                 # zkrácený výpis
git diff                          # ukáže nezacommitnuté změny
git diff <commit1> <commit2>      # porovná dva commity
```

#### Návrat / oprava
```bash
git revert <hash>                 # vytvoří NOVÝ commit, který ruší starý (bezpečné)
git reset --hard <hash>           # NEBEZPEČNÉ — vrátí historii a smaže commity
```

⚠️ **`reset --hard` je destruktivní** — drží Git lekci: *"committed → safe; uncommitted → at risk; reset --hard → all gone"*.

### 6. Branching

**Branch (větev)** = paralelní linie vývoje. Default branch je dnes typicky **`main`** (dříve `master`).

```bash
git branch                        # výpis branchí, hvězdička u aktuálního
git branch <nazev>                # vytvoří novou branch
git switch <nazev>                # přepne se (moderní)
git checkout <nazev>              # to samé, starší syntax
git switch -c <nazev>             # vytvoř + přepni v jednom kroku

git merge <nazev>                 # sloučí <nazev> do AKTUÁLNÍ branche
git branch -d <nazev>             # smaže branch (jen pokud je už mergnutá)
```

**Use case branchí:**
- **Feature branche** — pracuju na nové funkci, hlavní branch zůstává stabilní
- **Bugfix branche** — oprava bugu izolovaně
- **Release branche** — příprava na nasazení

#### Merge conflict

Když **dva lidé změnili stejný řádek**, Git neví, co je správně. Soubor obsahuje markery:

```
<<<<<<< HEAD
moje verze
=======
verze z druhé branche
>>>>>>> feature-branch
```

**Řešení manuálně:** smažeš markery, ponecháš tu verzi (nebo kombinaci), kterou chceš. Pak `git add` + `git commit`.

### 7. Vzdálené repozitáře (remotes)

**Git** = nástroj na tvém PC. **GitHub / GitLab / Bitbucket** = webové služby pro hosting Git repozitářů.

```bash
git remote add origin <url>       # propojí lokální repo se serverem
git push                          # odešle změny na server
git push -u origin main           # první push, nastaví upstream
git pull                          # stáhne změny ze serveru a sloučí
git fetch                         # jen stáhne info, NEsloučí (bezpečnější)
```

**Pull = fetch + merge.** Fetch je bezpečný (nic neslučuje), pull rovnou aplikuje.

### 8. GitHub features

| Feature | Co dělá |
|---|---|
| **Fork** | Kopie cizího projektu k tobě na účet. Můžeš experimentovat, případně poslat PR zpět. |
| **Pull Request (PR)** | Žádost o začlenění tvé branche do hlavního projektu. Code review + diskuse + schválení. |
| **Issues** | Nahlašování chyb, úkolů, feature requestů (Jira-like). |
| **GitHub Actions** | CI/CD — automatické testy po push, build, deploy. |
| **`.gitignore`** | Soubor, kde říkáš Gitu *"tyhle věci ignoruj"*: `node_modules/`, `.env`, `bin/`, `obj/`. |

### 9. `.gitignore` v praxi

```
# secrets
.env
*.key

# build artefakty
node_modules/
bin/
obj/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

⚠️ **Hesla a klíče NIKDY do Gitu.** Pokud commitneš heslo, **už je v historii navždy** — `.git/` to drží. Použít `.env` + `.gitignore`, nebo secrets manager.

### 10. CLI × klientské aplikace

**Git je primárně CLI nástroj** — všechny moderní GUI aplikace ho **interně volají**.

| Klient | Charakter |
|---|---|
| **CLI (Git Bash, Terminal)** | Plná moc, všechny příkazy, někdy strašidelné pro začátečníky |
| **GitHub Desktop** | Jednoduché, doporučené pro začátky. Pro casual workflow stačí. |
| **VS Code Source Control** | Integrované v IDE, ikona vlevo (větev). Stage/commit/push jedním klikem. |
| **GitKraken** | Vizuální, krásný graf branchí. Komerční (placené pro non-OSS). |
| **SourceTree** | Atlassian, zdarma. Detailní, vhodné pro pokročilé. |

**U zkoušky pravděpodobně používáš VS Code Source Control panel + příležitostně CLI.** Komise se může pichnout *"co se stane, když kliknu Stage v VS Code?"* — odpověď: *"to volá `git add` v pozadí"*.

---

## Konkrétní příklady / kód

### Vytvoření repa od nuly + první commit
```bash
mkdir MujProjekt
cd MujProjekt
git init                                    # vznikne .git/

echo "# Můj Projekt" > README.md
git status                                  # README.md = červené (untracked)
git add README.md
git status                                  # zelené (staged)
git commit -m "První commit: README"
git log                                     # uvidíš jeden commit
```

### Branching workflow
```bash
git switch -c feature-login                 # nová branch + přepni
# ... edituj kód ...
git add .
git commit -m "Implementace přihlášení"

git switch main                             # zpět na main
git merge feature-login                     # sloučí změny
git branch -d feature-login                 # smaž branch (už je v main)
```

### Push na GitHub poprvé
```bash
git remote add origin https://github.com/user/projekt.git
git branch -M main                          # přejmenuj na main, kdyby byl master
git push -u origin main                     # první push s nastavením upstreamu
```

### Stažení a začlenění změn z týmu
```bash
git pull                                    # stáhne + sloučí
# ALTERNATIVA bezpečnější:
git fetch                                   # stáhne jen info
git log origin/main                         # podívej se, co tam přibylo
git merge origin/main                       # potom sloučí, když souhlasíš
```

### Oprava chyby přes revert
```bash
git log                                     # najdi hash chybného commitu
git revert abc1234                          # vytvoří NOVÝ commit, který chybu opraví
# Historie zachovaná, jen "anti-commit"
```

---

## Vztahy / kontrasty

- **Git × GitHub** — Git je **nástroj** (lokální), GitHub je **služba** (cloud hosting). Git může běžet bez GitHubu (lokálně), GitHub bez Gitu nemá smysl.
- **SVN × Git** — SVN centralizovaný + diffy, Git distribuovaný + snapshoty.
- **`git fetch` × `git pull`** — fetch jen stáhne info, **nemění** working directory. Pull = fetch + merge (rovnou aplikuje). Fetch je **bezpečnější**.
- **`git revert` × `git reset --hard`** — **revert** vytváří nový commit, historie zachovaná. **Reset --hard** přepíše historii, **destruktivní**.
- **Working dir × Staging × Repo** — tři vrstvy stavu souboru. `add` mezi 1→2, `commit` mezi 2→3.
- **Branch × Tag** — branch je pohyblivý ukazatel (commits přibývají), tag je **fixní pojmenování commitu** (typicky verze: `v1.0.0`).
- **Merge × Rebase** — *(advanced)* merge zachovává historii s "merge commit", rebase přepisuje historii pro plochou linii. Komise spíš ne.

---

## Časté otázky komise

**Q:** Co je Git a kdo ho vytvořil?
**A:** **Distribuovaný verzovací systém** vytvořil **Linus Torvalds v roce 2005** pro vývoj Linux Kernelu. Slouží ke správě verzí kódu, týmové spolupráci a možnosti vrátit se k předchozím stavům.

**Q:** Jaký je rozdíl mezi Gitem a GitHubem?
**A:** **Git** je **nástroj na lokálním PC** — verzovací systém. **GitHub** je **webová služba** pro hosting Git repozitářů + features jako PR, Issues, Actions. Git může fungovat bez GitHubu, GitHub bez Gitu nemá smysl. Konkurence GitHubu: GitLab, Bitbucket.

**Q:** Co je rozdíl mezi centralizovaným a distribuovaným verzovacím systémem?
**A:** **Centralizovaný (SVN)** — jeden server, ostatní jen kopie. Bez internetu nelze verzovat. **Distribuovaný (Git)** — každý vývojář má **kompletní historii** lokálně. Lze pracovat offline a synchronizovat později.

**Q:** Co dělá `git add` a co `git commit`?
**A:** **`git add`** přesune změny z **working directory** do **staging area** — připravená pro další commit. **`git commit`** vezme to ze stagingu a vytvoří **checkpoint v historii** s commit zprávou. Tři vrstvy: working → staging → repo.

**Q:** Co je branch a k čemu slouží?
**A:** **Branch (větev)** je paralelní linie vývoje. Hlavní branch je `main`, ostatní typicky pro **feature** (nová funkce), **bugfix** nebo **release**. Umožňuje pracovat izolovaně bez dopadu na hlavní kód, pak změny **merge**ovat zpět.

**Q:** Co je merge conflict a jak ho řešíš?
**A:** Když **dva lidi změnili stejný řádek souboru**, Git neví, kterou verzi vybrat. Soubor obsahuje markery `<<<<<<`, `======`, `>>>>>>` ohraničující obě verze. Řeší se **manuálně** — smažeš markery, ponecháš požadovanou verzi (nebo kombinaci), `git add` a commit.

**Q:** Jaký je rozdíl mezi `git pull` a `git fetch`?
**A:** **`git fetch`** stáhne ze serveru **jen info** o nových commitech — nemění tvé soubory. **`git pull`** = `fetch` + automatický **merge**. Fetch je bezpečnější — můžeš si nejdřív projít, co přibylo, a teprve pak slučovat.

**Q:** Co je Pull Request?
**A:** **Žádost o začlenění** tvé branche/forku do hlavního projektu. Funguje na GitHubu/GitLabu — autor PR napíše popis, ostatní mohou **review**ovat, komentovat, schválit nebo odmítnout. Základní mechanika **open-source vývoje**.

**Q:** Co patří do `.gitignore`?
**A:** Soubory, které **nechceš verzovat**: hesla a secrets (`.env`, `*.key`), build artefakty (`node_modules/`, `bin/`, `obj/`), IDE konfigurace (`.vscode/`, `.idea/`), OS soubory (`.DS_Store`). **Hesla nikdy do Gitu** — historie je trvalá.

**Q:** Co je rozdíl mezi `git revert` a `git reset --hard`?
**A:** **`git revert <hash>`** vytvoří **nový commit**, který ruší změny ze starého — **historie zachována**, bezpečné. **`git reset --hard <hash>`** **přepíše historii**, smaže novější commity — **destruktivní**, použít jen lokálně před pushem.

**Q:** Vyjmenuj 3 klientské aplikace pro Git kromě CLI.
**A:** **GitHub Desktop** (jednoduchý, oficiální od GitHubu), **VS Code Source Control** (integrované v IDE), **GitKraken** (vizuální graf branchí), **SourceTree** (Atlassian). Všechny pod kapotou volají Git CLI příkazy.

---

## Co bych ještě měl vědět (volně)

- **`git stash`** — dočasně schová neukončené změny, abys mohl přepnout branch.
- **`git tag v1.0.0`** — pojmenovaný odkaz na commit, typicky pro release verze.
- **`git rebase`** — alternativa k merge, **přepisuje historii** pro plochou linii. Advanced, vyhnout se na sdílených branchích.
- **`git cherry-pick <hash>`** — vezme jeden konkrétní commit z jiné branche.
- **HEAD** — speciální ukazatel na aktuální commit / branch.
- **Detached HEAD** — když jsi checkoutnutý na konkrétní commit, ne na branch. Změny se ztratí, pokud nezakládáš branch.
- **SSH klíče × HTTPS** — dvě cesty autentizace u remote. SSH klíče bezpečnější, jednorázové nastavení.
- **`git config --global user.name "..."`** — nastavení autora pro commits.
- **Trunk-based × GitFlow** — různé branching strategie. GitFlow má víc branchí (develop, feature, release, hotfix). Trunk-based jen main + krátké feature branche.

---

## ⚠️ Nejisté / k ověření

- ⚠️ **Materiál v `_materials/dat/14/` je v `nezarucene/`** (PRG = no validation systém, ale podle memory `nezarucene` ≠ nekvalitní). Hodina-poznámky jsou primárním zdrojem.
- ⚠️ **Default branch `main` × `master`** — od 2020 GitHub default `main`. Starší repa mají `master`. Komise může mluvit o obou.
- ⚠️ **`git checkout` × `git switch`** — `checkout` je staré (multifunkční), `switch` (od Git 2.23) přesnější pro přepínání branchí. Drž obojí.
- ⚠️ **CLI × GUI** — komise se může pichnout *"používáte CLI nebo GUI?"*. Buď upřímný — *"VS Code Source Control pro běžnou práci, CLI pro pokročilé operace (rebase, stash, log)"*.

---

## Praktická příprava (pro 30 min u PC)

DAT 14 je **lehčí praktika** než typické DAT — hlavně **CLI příkazy v sekvenci**. Trénuj tyhle scénáře z hlavy za **<10 min každý**:

1. **Init + první commit:** `mkdir → cd → git init → echo > README.md → git add → git commit -m`
2. **Branching:** vytvoř branch, přepni se, zedituj soubor, commitni, vrať se na main, mergni
3. **Remote:** `git remote add → git push -u origin main`
4. **Pull workflow:** `git fetch → git log origin/main → git merge`
5. **Návrat:** `git log` → najít hash → `git revert`

---

## Status

- **Sebehodnocení (před):** 5/10 *(z progress.md)*
- **Sebehodnocení (po):** _/10
- **Datum poslední revize:** 2026-05-10
