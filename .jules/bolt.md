## 2025-05-15 - [Search Debouncing]
**Learning:** This application uses a pattern where every input event triggers a full UI re-render and expensive filtering over large data sets (like 114 surahs or 99 names). This is particularly impactful because the app is stateless and re-generates DOM from strings frequently.
**Action:** Always debounce search/filter inputs to at least 200ms to avoid CPU spikes and main thread lag during typing.

## 2025-05-20 - [API Batching]
**Learning:** The Al-Quran Cloud API supports batching multiple editions (audio, translation, transliteration) into a single request. Given the app's vanilla JS "render everything from string" architecture, reducing the number of async data dependencies per view significantly reduces UI "jumpiness" and simplifies the rendering lifecycle.
**Action:** Prefer batched `/editions/` endpoints over `Promise.all` of multiple single-edition requests to minimize network waterfalls.
