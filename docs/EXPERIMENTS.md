# Experiments Log

> Format: Hypothesis → Change → Result  
> Target: ~10 entries. One change per experiment, seed fixed for fair comparison.

---

## EXP-001 — FLUX steps vs. quality

**Hypothesis:** Increasing FLUX inference steps from 4 → 8 meaningfully improves keyframe quality.  
**Change:** `steps=4` vs `steps=8`, same seed, same prompt.  
**Result:**  
**Decision:** (keep 4 / switch to 8 — why)

---

## EXP-002 — Narration voice style

**Hypothesis:** Adding "calm, warm, unhurried" to the TTS style instruction improves prosody.  
**Change:** No style instruction vs. "calm, warm, unhurried".  
**Result:**  
**Decision:** 

---

## EXP-003 — Number of storyboard shots

**Hypothesis:** 10 shots fits 90 s better than 8.  
**Change:** `num_shots=8` vs `num_shots=10`.  
**Result:**  
**Decision:** 

---

## EXP-004 — Gemini model (Flash vs Flash-Lite)

**Hypothesis:** Flash-Lite is fast enough for storyboard generation with acceptable quality.  
**Change:** `gemini-2.0-flash` vs `gemini-2.0-flash-lite`.  
**Result:**  
**Decision:** 


