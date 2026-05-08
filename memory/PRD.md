# Alif AI — PRD

## Original problem statement
Comprehensive analysis of ALIF-AI v0.1 (Polish/English islamic education PWA) suggested a 6-sprint roadmap covering safety, content fidelity, performance/UX, new features, market differentiators and partnerships. The user instructed to implement **everything in order EXCEPT** touching the Groq API integration (the hardcoded API key in `app.js` stays). Tech stack stays as vanilla JS + PWA, with Vite as build pipeline. Bilingual PL/EN preserved.

## Architecture
- `/app/frontend/` — Vite dev server on port 3000 (vanilla JS ESM, Tailwind via CDN, PWA service-worker)
  - `src/app.js` — main module (~4750 lines, hash router)
  - `src/data.js` — Quran metadata, hadiths, FAQ, halal/haram, etc.
  - `src/extras.js` — Sprint 1–5 module: DOMPurify sanitize, debounce, fetchTimeout, cache-24h, crisisNote (PL/EN with international hotlines), obligationScale, fiqhCards, expandedDuas (10), tafsirSnippets, hijriEvents, personas (6), topMyths, scholarPrompt, tajweedColorize
  - `src/styles.css` + `src/styles-extras.css` — themes (light/dark/romantic), focus-visible, prefers-reduced-motion, tj-* tajweed colors
  - `public/` — manifest.json, service-worker.js, /assets icons
- `/app/backend/` — minimal FastAPI stub (`/api/health`) so supervisor doesn't flap
- State storage: `localStorage` key `alif-ai-state`. No auth, no DB.

## User personas (Sprint 3 onboarding — 6 personas)
1. Curious about Islam · 2. Considering Islam · 3. New Muslim · 4. Practicing · 5. Arabic learner · 6. Learning for partner (Borzęta ↔ Surabaya)

## What's been implemented (2026-05-08)

### Sprint 1 — Safety (excl. API key)
- DOMPurify integrated (`sanitize()`); allow-list adapted for app needs (button/article/section/details/etc.)
- Compassion note + international crisis hotlines (PL 116 123/116 111, US 988, UK Samaritans, Australia Lifeline 13 11 14, Canada Talk Suicide, Indonesia 119 ext.8, Befrienders Worldwide) — rendered automatically inside `myth-suicide_bombing` detail.

### Sprint 2 — Content corrections
- `wife_beating` ref: `Tirmidhi 1162, Bukhari 4942` → `Tirmidhi 1162, Bukhari 5825/5843, Ibn Majah 1984`
- `mary` answer & ref: added `Muslim 2430`
- `suicide_bombing`: softened wording + helpline numbers in answer text
- `isis`: replaced "Al-Azhar fatwa 2014" with "Al-Azhar & majority Sunni statements 2014–2016"
- `halal/haram` shrimp: per-madhhab clarification (Hanafi haram/makruh, Shafi'i/Hanbali halal)
- `islamicMonths` Rabi al-Awwal: Mawlid an-Nabi marked as **Kwestia sporna / Disputed** with school positions
- `islamicMonths` Sha'ban: Laylat al-Bara'a marked as **Kwestia sporna / Disputed** with hadith reliability note
- New views: **Fiqh** (obligation scale Fard/Sunnah/Mustahab/Mubah/Makruh/Haram + Ghusl, Tayammum, Tarawih, Witr, Sunan rawatib)
- Expanded **Du'a library** (10 entries): after_salah, ayat_kursi_full, travel, illness, parents, yunus, asmaul_dua, entering_home, leaving_home, Sayyidul-istighfar

### Sprint 3 — Performance & UX
- `saveState()` debounced (800 ms) — no more 100 writes per dhikr tap
- `fetchTimeout()` (AbortSignal) on all external calls (Aladhan, alquran.cloud)
- `cached(key, ttl, loader)` wrapper — 24h cache for prayer times, 30d for qibla
- Contrast fix: `--muted` light theme `#6b7280` → `#4b5563`; romantic `#8b5569` → `#5c2238`
- Mobile nav `.nav-btn` font 8 px → 11 px
- `:focus-visible` outlines; `prefers-reduced-motion` respected
- **Onboarding** "Kim jesteś?" gate on first launch — 6 personas

### Sprint 4 — New features
- **Prayer Tracker** (`#tracker`): toggles for 5 daily prayers + last-7-days mini calendar with color heat
- **Islamic Calendar** (`#calendar`): Aszura, Mawlid, Isra Mi'raj, Bara'a, Ramadan, Qadr, Eid al-Fitr, Arafah, Eid al-Adha — with disputed-tradition footnotes
- **Myths view** (`#myths`) — filtered FAQ verdict='false'/'complex'; surfaced from home as `home-myths-card`
- **Tafsir snippets** under specific ayat (1:1, 2:255, 2:286, 112:1, 113:1, 114:1, 36:1, 67:1) in surah view
- **Tajweed color coding** in Quran text — heuristic spans for idgham/ikhfa/iqlab/izhar/ghunna/madd/qalqalah; toggle button per surah
- **Hifz / memorization mode** — per-ayah toggle with green ring + 5 pts

### Sprint 5 — Differentiators
- **Ramadan Mode** toggle in settings → ribbon on home with day-of-Ramadan and last-10-nights notice
- **AI Scholar persona** — toggle that swaps system prompt to traditional Sunni scholar style with adab + madhhab citations
- **Pair Mode** — generate 6-char alphanumeric code + save buddy code (Borzęta ↔ Surabaya). Widget on home shows my today-prayers count
- **Web Push prayer notifications** — `Notification` API, schedules 10-min-before reminders for Fajr/Dhuhr/Asr/Maghrib/Isha based on Aladhan timings (location: Polska)

### Infrastructure
- Vite-based dev server on supervisor `frontend` slot (port 3000, host 0.0.0.0). Runs `vite --host 0.0.0.0 --port 3000`
- Backend stub on supervisor `backend` slot — `FastAPI` with `/api/health`
- DOMPurify v3 added via yarn

## Backlog / not implemented (intentionally out-of-scope per user)
- ❌ **Backend proxy for Groq API** — user explicitly said *"oprócz ruszania kodu API"* (don't touch API). Key remains hardcoded in `app.js:3`.
- ⏸ **Tailwind CLI build-time** — Tailwind still via CDN (testing agent flagged as production-perf concern, non-blocking)
- ⏸ Pronunciation scoring (Web Speech API) — Sprint 5 stretch
- ⏸ Qibla AR camera overlay — Sprint 5 stretch
- ⏸ Sponsorship / partnership outreach (non-code)
- ⏸ Module split of app.js (still single 4750-line module)

## Next action items
1. Decide whether to migrate Tailwind to CLI (Sprint 3 perf — non-blocking).
2. Optional: split `app.js` into `views/`, `state/`, `data/` modules.
3. Optional: add tests for `tajweedColorize` heuristic against known recitations.
4. Future: pair-mode P2P sync (e.g., via WebRTC/Firestore) — current implementation is local-only.

## Test status (iteration 2 — 2026-05-08)
- Frontend 100% (46/46 review-request checks). Zero functional bugs.
- Code review notes (non-blocking): app.js is 4851 lines (split recommended); Tailwind via CDN warning; learnedLetters seed must be `[]` to keep first_letter locked in QA.

## Iteration 2 deliverables
- **Clickable locked badges**: each `BADGES_CATALOG` entry now has a `route` field. Locked cards render as `<button data-testid="badge-{id}">` with progress bar (`badgeProgress(b)` calculator) + `→` arrow. Click → `setRoute(b.route)`. Unlocked cards still render as `<div>` with `✓`. Hint text PL/EN above grid.
- **#howtopray view** (new): full step-by-step Sunni prayer guide. PL+EN. 5 prayer cards with rak'ah counts; 4 prereq cards (wudu, ubranie, qibla, niyyah); 11 movement steps (takbir → qiyam → ruku → i'tidal → sujud1 → jalsa → sujud2 → next-rakah → tashahhud → salawat → salam) — each with Arabic + transliteration + Polish/English translation + madhhab notes. Section "po modlitwie — dhikr" with Subhanallah/Alhamdulillah/AllahuAkbar counts + Ayat al-Kursi reference.
- **Linked from**: #islam page (first link, data-testid="islam-link-howtopray"), #prayer header CTA (data-testid="prayer-howtopray-btn"), and direct hash navigation. Bottom CTA in #howtopray jumps to #prayer (data-testid="howtopray-go-prayer-btn").
- **New file**: `/app/frontend/src/howtopray.js` (prayerInfo PL/EN data).

## Test status (iteration 1)
- Backend 100%, Frontend 100% (no critical, no minor issues).
