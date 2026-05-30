## 2025-05-15 - [Search Debouncing]
**Learning:** This application uses a pattern where every input event triggers a full UI re-render and expensive filtering over large data sets (like 114 surahs or 99 names). This is particularly impactful because the app is stateless and re-generates DOM from strings frequently.
**Action:** Always debounce search/filter inputs to at least 200ms to avoid CPU spikes and main thread lag during typing.

## 2026-05-25 - [API Request Batching]
**Learning:** The application frequently makes multiple waterfall or parallel requests to the same external API (Al-Quran Cloud) to fetch different "editions" (audio, translation, transliteration) of the same content.
**Action:** Consolidate these into single batched requests using the `/editions/` endpoint to reduce network overhead and improve load times, especially on mobile networks.

## 2026-05-30 - [Memoize History Quiz Pool]
**Learning:** The 'historyQuizPool' function was reconstructing a large set of objects (~70+) from a 174KB static data file on every invocation. In a vanilla JS app that re-renders often, this leads to unnecessary CPU churn and garbage collection pressure.
**Action:** Memoize large object pool generators that depend on static data to ensure they are only built once per session.
