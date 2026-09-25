---
name: Video audio fallback
description: Audio-runtime guidance for the standalone P3 Health Lab film artifact.
---

When a richer music-generation callback is unavailable, preserve the film's runtime with an original local instrumental bed rather than leaving the video without audio.

**Why:** The scene-synced player seeks against canonical scene offsets, so changing the bed length or omitting it can make preview and export behavior drift from the visual loop.

**How to apply:** Keep the audio file under the film artifact's public audio directory, match the canonical total runtime, and re-run the recording validator after any soundtrack swap.