## 2025-05-15 - [Search Debouncing]
**Learning:** This application uses a pattern where every input event triggers a full UI re-render and expensive filtering over large data sets (like 114 surahs or 99 names). This is particularly impactful because the app is stateless and re-generates DOM from strings frequently.
**Action:** Always debounce search/filter inputs to at least 200ms to avoid CPU spikes and main thread lag during typing.

## 2026-05-25 - [API Request Batching]
**Learning:** The application frequently makes multiple waterfall or parallel requests to the same external API (Al-Quran Cloud) to fetch different "editions" (audio, translation, transliteration) of the same content.
**Action:** Consolidate these into single batched requests using the `/editions/` endpoint to reduce network overhead and improve load times, especially on mobile networks.

## 2024-05-27 - [Lazy Initialization for Cached RegExp Pattern]
**Learning:** In a vanilla JS environment where data objects (like `historyContent`) are defined in the same script or imported globally, eager initialization of derived values (like a compiled `RegExp` for term highlighting) can lead to `ReferenceError` if the data isn't yet ready or defined in the correct order.
**Action:** Use a lazy initialization pattern (check if cache exists inside the function) to ensure the optimization is safe and only runs when the data is guaranteed to be available, while still providing the performance benefit of caching for subsequent calls.
