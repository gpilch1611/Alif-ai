## 2025-05-15 - [Search Debouncing]
**Learning:** This application uses a pattern where every input event triggers a full UI re-render and expensive filtering over large data sets (like 114 surahs or 99 names). This is particularly impactful because the app is stateless and re-generates DOM from strings frequently.
**Action:** Always debounce search/filter inputs to at least 200ms to avoid CPU spikes and main thread lag during typing.

## 2026-05-19 - [API Request Batching]
**Learning:** The Al-Quran Cloud API supports fetching multiple data "editions" (e.g., audio, translation, transliteration) in a single request via the `/editions/` endpoint. Sequential requests for these resources create a network waterfall that significantly delays the initial rendering of content-rich views like the Surah reader.
**Action:** Consolidate multiple edition requests into a single batched call using comma-separated identifiers to reduce 3 network round-trips to 1.
