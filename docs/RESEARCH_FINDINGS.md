# Research Findings: Technical Feasibility

**Date**: 2026-01-06
**Status**: Planning Phase

---

## 1. Claude 3.5 Sonnet Vision API

### Accuracy & Capabilities

**OCR Performance**:
- ✅ Strong vision model with advanced OCR technology
- ✅ Can transcribe text from imperfect images (screenshots, printed pages)
- ✅ Excels at visual reasoning (charts, graphs)
- ✅ Surpasses Claude 3 Opus on standard vision benchmarks
- ⚠️ Some accuracy issues with radio button extraction (but generally good)

**Benchmark Results**:
- OSWorld benchmark (screenshot category): **14.9% accuracy**
  - This nearly doubled the next-best system (7.8%)
  - Note: This is a complex task, not simple OCR

**Real-World Testing**:
- Text extraction works well without requiring separate OCR
- Best for extracting text from less-than-perfect images

**Conclusion**: Claude 3.5 Sonnet should handle screenshot text extraction well for our use case (extracting quotes from Spotify, Twitter, Instagram screenshots). Expect >80% accuracy for clean screenshots.

---

## 2. Claude Vision API Pricing

### How It Works
Images are charged based on **token consumption**, not fixed "per image" pricing.

**Token Calculation Formula**:
```
tokens = (width_px × height_px) / 750
```

### Pricing by Model (2025)

| Model | Input Cost | Output Cost | Best For |
|-------|-----------|-------------|----------|
| **Claude Opus 4.5** | $5 / 1M tokens | $25 / 1M tokens | Complex analysis |
| **Claude Sonnet 4.5** | $3 / 1M tokens | $15 / 1M tokens | **Recommended for PoC** |
| **Claude Haiku 3.5** | $0.25 / 1M tokens | $1.25 / 1M tokens | Simple tasks, cost optimization |

### Cost Examples (Claude Sonnet 4.5)

**Typical Screenshot** (~1600 tokens):
- **Cost**: ~$4.80 per 1,000 images
- **Per image**: ~$0.0048 (less than half a cent)

**Monthly Cost Projections**:

| Usage | Images/Month | Cost (Sonnet) | Cost (Haiku) |
|-------|--------------|---------------|--------------|
| Single user testing | 100 | $0.48 | $0.04 |
| Active beta (10 users) | 500 | $2.40 | $0.20 |
| Light launch (100 users, 5 saves/week) | 2,000 | $9.60 | $0.80 |
| Active launch (100 users, 10 saves/day) | 30,000 | $144 | $12 |

### Optimization Strategies

1. **Start with Sonnet 4.5** (best accuracy/cost balance)
2. **Switch to Haiku for simple cases** (when screenshot is very clean)
3. **Cache results** (don't reprocess same screenshot)
4. **Optimize image size** (resize mobile screenshots before uploading)

**Conclusion**: Cost is very reasonable for PoC and early launch. At scale (1000+ daily active users), consider Haiku or implement intelligent model selection.

---

## 3. Spotify API Capabilities

### Current Playback Position (Web API)

**✅ Available Features**:
- Get current playback state (track, position, playing/paused)
- Seek to specific position: `player.seek(position_ms)`
- Start playback from specific position in playlist/album
- Access via Web API and Web Playback SDK

**📋 API Endpoints**:
- `GET /me/player` - Get current playback info
- `PUT /me/player/seek` - Seek to position

### Deep Linking with Timestamps

**⚠️ CRITICAL LIMITATION (as of 2025)**:
- Timestamp sharing **only works for VIDEO podcasts**
- **NOT available for audio-only podcasts** (most podcast content)
- Previous URI timestamp feature (`spotify:track:xxxxx#0:39`) was **removed in August 2025**

**URL Format (when it works)**:
```
https://open.spotify.com/episode/[episode_id]?si=[session_id]&t=1195308
```
- `t` parameter = milliseconds
- Example: `t=1195308` = 19:55 minutes

**Workaround Options**:
1. Manually modify URL with `&t=` parameter (unreliable on mobile)
2. Use Spotify Web API to control playback programmatically
3. Store timestamp in our app, provide manual "go to timestamp" instructions

### API Access Restrictions (May 2025 Update)

**New Criteria for Extended Access**:
- If app doesn't meet new criteria, Web API is **limited to development mode**
- Development mode = **25 test users maximum**
- Mainly limited to experimentation and personal use

**Impact on Our App**:
- ⚠️ For public launch, we may need to apply for extended access
- For PoC with <25 users: ✅ No problem
- For public iOS launch: Need to investigate extended access criteria

---

## 4. Implications for Our MVP

### What This Means for Milestone 0.5 (Web PoC)

**✅ Great News**:
- Claude Vision API is perfect for screenshot analysis
- Cost is negligible for PoC (<$5 for hundreds of tests)
- AI should reliably extract Spotify content from screenshots

**⚠️ Challenges**:
- **No reliable deep linking to Spotify timestamps** for audio podcasts
- Can only link to episode, not specific moment
- This affects the "revisit" experience quality

### Revised Strategy for Spotify Integration

**Milestone 0.5 (Web PoC)**:
- ✅ Extract podcast name, episode title, timestamp from screenshot using Claude Vision
- ✅ Store timestamp in our database
- ✅ Display "You saved this at 19:55" in journal entry
- ⚠️ Deep link opens episode in Spotify, but NOT at timestamp
- ✅ Provide "Listen from 19:55" instruction to user

**Milestone 3+ (Future)**:
- Option A: Build in-app audio player (complex, expensive)
- Option B: Use Spotify Web Playback SDK to control playback from our app
- Option C: Wait for Spotify to restore timestamp deep linking
- Option D: Focus on other content types (Twitter, Instagram work better for deep linking)

### Updated Success Criteria

**For PoC validation**, the key question is:
> "Is the screenshot → AI extraction → journal entry flow valuable even without perfect deep linking?"

**Hypothesis**: Yes, because:
1. Seeing the quote/moment saved is valuable itself
2. Knowing WHICH episode and timestamp is better than nothing
3. User can manually seek to timestamp (one extra step)
4. Other content types (Twitter, Instagram) CAN deep link properly

---

## 5. Alternative Content Sources Research

Based on Spotify limitations, let's assess deep linking for other sources:

| Source | Deep Link Support | Ease of Integration | Priority |
|--------|-------------------|---------------------|----------|
| **Twitter/X** | ✅ Excellent (direct tweet URLs) | Easy | HIGH |
| **Instagram** | ✅ Good (post URLs) | Medium | HIGH |
| **YouTube** | ✅ Excellent (timestamp URLs: &t=95s) | Easy | HIGH |
| **Spotify** (audio podcasts) | ❌ Poor (no timestamp for audio) | Medium | MEDIUM |
| **Spotify** (video podcasts) | ✅ Good (timestamp URLs) | Medium | MEDIUM |
| **Apple Podcasts** | ⚠️ Limited | Unknown | LOW (for PoC) |
| **Kindle/Books** | ❌ No public API | Hard | LOW (for PoC) |

**Recommendation**: For PoC, test with **Twitter, Instagram, and YouTube screenshots** alongside Spotify. These have better deep linking support and will show the full value of the "revisit" experience.

---

## 6. Product Decision: Pivot to YouTube + Social Media

### Decision Made (2026-01-06)

**✅ PIVOT**: Focus Milestone 0.5 on YouTube, Twitter, and Instagram instead of Spotify.

**Reasoning**:
1. **Better deep linking**: YouTube supports timestamp URLs perfectly
2. **Broader appeal**: More users consume YouTube/social than Spotify podcasts
3. **Easier to demo**: Everyone understands saving a viral tweet or YouTube moment
4. **Prove core value faster**: Focus on what works best technically
5. **Still generic**: Architecture supports adding Spotify later

**Updated Priority for PoC**:
- 🎯 **YouTube** (PRIMARY) - timestamp deep linking works perfectly
- 🎯 **Twitter** (PRIMARY) - direct tweet URLs work perfectly
- 🎯 **Instagram** (PRIMARY) - post URLs work well
- 📦 **Spotify** (FUTURE) - add in Milestone 3+ when we solve timestamp issue

**Impact on Development**:
- Build generic screenshot → AI extraction → journal entry flow
- Test and optimize for YouTube, Twitter, Instagram first
- AI prompt engineering focuses on these three sources
- Demo videos use these sources (more relatable)
- Spotify support comes later as "expansion" feature

---

## 7. Open Questions (Still Need Research)

### Technical Questions
1. **React Native screenshot detection**:
   - How do we detect when user takes screenshot on Android/iOS?
   - Can we auto-process without user manually uploading?

2. **Background processing**:
   - Can we run AI vision processing in background?
   - Battery/performance impact?

3. **Supabase Storage limits**:
   - How many screenshots can we store on free tier?
   - Storage costs at scale?

### Product Questions
1. **User behavior**:
   - Will users actually take screenshots to save moments?
   - Or do they prefer widget tap + automatic capture?

2. **AI prompt engineering**:
   - What prompt structure gives best extraction accuracy?
   - How do we handle edge cases (dark mode, cropped screenshots)?

3. **Resurfacing algorithm**:
   - Random selection vs. intelligent prioritization?
   - How often should "On This Day" show memories?

---

## Next Steps

### Before Starting Development

1. ✅ Complete research (DONE)
2. ⏳ Set up development environment:
   - Create GitHub repo
   - Set up Supabase project
   - Get Claude API key
   - Set up Vercel account
3. ⏳ Test Claude Vision API manually:
   - Take 10 different screenshots (Spotify, Twitter, Instagram, YouTube)
   - Send to Claude API with extraction prompt
   - Measure accuracy and refine prompt
4. ⏳ Create `claude.md` with project context
5. ✅ Update PROJECT_SPEC.md with research findings

### During Milestone 0.5

1. Build basic upload + vision analysis
2. Test with 20+ real screenshots
3. Measure AI accuracy (aim for >80%)
4. Test "On This Day" with dummy data
5. Demo to 3-5 people, gather feedback

---

## Key Decisions Made

1. **✅ Use Claude Sonnet 4.5 for Vision API** (best accuracy/cost balance)
2. **✅ Start with generic screenshot approach** (not Spotify-specific)
3. **✅ Accept Spotify timestamp deep linking limitation for PoC**
4. **✅ Test with multiple content sources** (Twitter, Instagram, YouTube + Spotify)
5. **⏳ Defer Spotify API integration to Milestone 3+** (focus on proving core value first)

---

**Prepared by**: Claude Code
**Reviewed by**: Founder
