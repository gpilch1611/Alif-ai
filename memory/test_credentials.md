# Alif AI — Test Credentials

This is a static PWA — **no authentication is required** to use the app.

## State storage
- All user state is stored locally in `localStorage` under key `alif-ai-state`.
- No accounts, no login.

## External services (not part of this codebase)
- Groq API — key is hardcoded in `/app/frontend/src/app.js` (line 3) per user request. Not to be changed.
- Aladhan API (prayer times) — public, no key.
- alquran.cloud (Quran content) — public, no key.

## Test seed
For testing flows that require an existing state, set localStorage before reload:
```js
localStorage.setItem('alif-ai-state', JSON.stringify({
  onboardingDone: true,
  persona: 'practicing',
  lang: 'pl',
  theme: 'light',
  prayerLog: {},
  hifzMemorized: {},
  ramadanMode: false,
  scholarMode: false,
  pairCode: '',
  pairBuddyCode: '',
  tajweedColor: false,
  pushEnabled: false
}));
```
