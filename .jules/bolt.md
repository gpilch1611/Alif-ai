## 2025-05-15 - [Search Debouncing]
**Learning:** This application uses a pattern where every input event triggers a full UI re-render and expensive filtering over large data sets (like 114 surahs or 99 names). This is particularly impactful because the app is stateless and re-generates DOM from strings frequently.
**Action:** Always debounce search/filter inputs to at least 200ms to avoid CPU spikes and main thread lag during typing.

## 2026-05-16 - [Quran API Batching]
**Learning:** The Al-Quran Cloud API supports batching multiple editions (audio, translations, etc.) into a single request via the '/editions/' endpoint. Consolidating these avoids network waterfalls and reduces latency, especially on slower connections.
**Action:** Prefer batched API calls over multiple concurrent fetches when requesting different editions of the same Quranic content.
