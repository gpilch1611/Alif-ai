# Religious Content Policy

Alif AI treats Islamic material as educational content, not as a personal fatwa service.

## Content Trust Levels

- `VERIFIED`: a basic educational statement with a clear Quran or hadith reference.
- `SCHOLARLY_DISAGREEMENT`: a fiqh topic where recognized scholars differ.
- `CONTEXT_DEPENDENT`: a topic where the answer depends on a user's real situation, local law, health, family, work, or finances.
- `UNVERIFIED`: content that should not be presented as religious guidance until a source is added.

## Required Metadata

Every religious FAQ item rendered in the app should include:

- `source_type`: source category, such as `quran_hadith` or `fiqh_disagreement`.
- `source_ref`: the visible reference shown to the user.
- `confidence`: one of the content trust levels above.
- `reviewed_at`: the last local review date.

## User-Facing Rule

For disputed or personal matters, the app must show a visible notice that the answer is educational and that the user should consult a trusted local imam or qualified scholar.

High-risk topics include marriage, divorce, finance, medical/mental health, employment involving haram products, and family conflict after conversion.

## High-Risk UX

High-risk FAQ entries should carry a dedicated visible badge and a short note telling the user not to make a personal decision based only on the app.

Halal/haram gray-area questions should be treated as `CONTEXT_DEPENDENT`, because ingredients, local availability, medical necessity, and school-of-law differences can change the practical answer.

Hadith references are displayed as collection references. A source line alone is not a full hadith-critical grading; if a future release gives legal rulings from hadith, it should add a formal `grade` and reviewer field.
