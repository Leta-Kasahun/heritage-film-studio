# Design Thinking

## 1. Audience & Intent

- **Who:** Ethiopian families at home and in the diaspora.
- **Where / Device:** Shared via messaging apps and watched on mobile phones (`9:16`) and desktop/TV (`16:9`).
- **One Feeling at the End:** Quiet warmth, pride, and continuity across generations.
- **Intent:** Show how the everyday Ethiopian coffee ceremony (*buna*) turns ordinary morning gestures into a shared family bond.

---

## 2. Storyboard Shot-by-Shot Reasons (`storyboard.json`)

| Shot | Duration | Reason in Story |
|---|---|---|
| 0 | 8 s | Establishes place, fresh *ketema* grass hospitality, and morning light |
| 1 | 8 s | Shows care and tactile preparation as green beans are washed |
| 2 | 8 s | Captures the sensory turning point as beans roast over embers |
| 3 | 8 s | Connects wafting smoke to maternal warmth and family peace |
| 4 | 8 s | Bridges physical craft (*mukecha* mortar) with ancestral memory |
| 5 | 8 s | Highlights the black clay *jebena* and frankincense stillness |
| 6 | 8 s | Names the three rounds (*Abol*, *Tona*, *Bereka*) and community gathering |
| 7 | 8 s | Delivers emotional resolution across three generations |

---

## 3. User Tests & Iterations

### User Test 1 — Radio Cut (Narration + Pacing)
- **What was tested:** Spoken Amharic narration timing (~8 s per beat) and English subtitle readability before rendering video.
- **Feedback:** Early narration lines were too dense for an 8-second shot, and subtitle lines wrapped past two lines on vertical screens.
- **What changed:** Shortened each Amharic sentence to 8–12 words and tightened English `narration_en` lines to fit cleanly inside two subtitle lines.

### User Test 2 — Near-Final Cut (`16:9` & `9:16` MP4)
- **What was tested:** Audio balance between voice and score, plus vertical (`9:16`) framing on mobile.
- **Feedback:** Background music competed with the narrator on phone speakers, and early `9:16` exports appeared stretched on some players.
- **What changed:** Tuned `sidechaincompress` ducking (`threshold=0.02`, `ratio=6`, `attack=300ms`, `release=1500ms`), normalized final audio to `-14 LUFS` (`48 kHz` stereo), and enforced `setsar=1` (`720x1280`, `DAR 9:16`).
