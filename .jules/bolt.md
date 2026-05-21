## 2025-05-15 - [Search Debouncing]
**Learning:** This application uses a pattern where every input event triggers a full UI re-render and expensive filtering over large data sets (like 114 surahs or 99 names). This is particularly impactful because the app is stateless and re-generates DOM from strings frequently.
**Action:** Always debounce search/filter inputs to at least 200ms to avoid CPU spikes and main thread lag during typing.

## 2026-05-21 - [API Batching with Al-Quran Cloud]
**Learning:** The Al-Quran Cloud API supports fetching multiple editions (audio, translation, transliteration) in a single request via the `/editions/` endpoint. Using this significantly reduces network overhead and prevents waterfalls in a vanilla JS app that re-renders frequently.
**Action:** Consolidate multiple surah or ayah metadata requests into a single batched call using comma-separated edition identifiers.
