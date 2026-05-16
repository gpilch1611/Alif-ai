## 2025-05-15 - [Search Debouncing]
**Learning:** This application uses a pattern where every input event triggers a full UI re-render and expensive filtering over large data sets (like 114 surahs or 99 names). This is particularly impactful because the app is stateless and re-generates DOM from strings frequently.
**Action:** Always debounce search/filter inputs to at least 200ms to avoid CPU spikes and main thread lag during typing.

## 2025-05-16 - [API Request Batching]
**Learning:** The 'Islam' module was performing multiple sequential or concurrent fetch requests for different aspects of the same resource (audio, translation, transliteration). Many public APIs (e.g., Al-Quran Cloud) support batching these into a single response using comma-separated identifiers.
**Action:** When working with external data providers, check for batching or "include" parameters to reduce network overhead and improve loading states.
