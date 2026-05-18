## 2025-05-15 - [Search Debouncing]
**Learning:** This application uses a pattern where every input event triggers a full UI re-render and expensive filtering over large data sets (like 114 surahs or 99 names). This is particularly impactful because the app is stateless and re-generates DOM from strings frequently.
**Action:** Always debounce search/filter inputs to at least 200ms to avoid CPU spikes and main thread lag during typing.

## 2026-05-16 - [Batch API Requests]
**Learning:** Fetching audio, translation, and transliteration for Quranic content individually created a network waterfall. The Al-Quran Cloud API supports batching multiple editions into a single request via the `/editions/` path.
**Action:** Consolidate multiple edition fetches for the same Quranic resource (Surah or Ayah) into one batched request to reduce network overhead and latency.
