# Project Spec: Universal Memory Journal

**Last Updated**: 2026-01-06
**Status**: Planning Phase

---

## Project Overview

### Vision Statement
A universal capture system that allows users to effortlessly save meaningful moments from any digital content (podcasts, social media, ebooks, etc.) and rediscover them later through intelligent resurfacing - like Google Photos for your digital insights.

### The Problem
- **Fragmented saving**: Each app has its own save/bookmark feature, creating information silos
- **High friction**: Manually pausing, transcribing, and saving content is tedious
- **Lost moments**: Saved content gets buried and never revisited
- **Missing context**: When you do find old saves, you lack context about why it mattered

### The Solution
A unified journal that:
1. Captures content from ANY source with minimal friction (screenshot/widget)
2. Uses AI to intelligently extract and categorize content
3. Resurfaces memories automatically, like Google Photos
4. Deep-links back to original sources with smart timestamps

---

## Product Requirements

### Target User
**Primary**: Knowledge workers, lifelong learners, content consumers
- Listen to 5+ hours of podcasts/audiobooks weekly
- Save interesting tweets, Instagram posts, articles
- Currently use scattered note-taking apps (Keep, Notes, etc.)
- Frustrated by high friction of manual capture
- Want to rediscover insights they've forgotten

**Founder Profile**: Non-technical founder with product mindset, Android user, wants to test on Android first but launch on iOS for broader market.

### Core User Flows

#### Flow 1: Capture (Milestone 0.5 - Web PoC)
1. User is consuming content (listening to Spotify podcast, reading tweet, watching reel)
2. User hears/sees something worth saving
3. User takes screenshot OR taps widget
4. **Screenshot path**:
   - User uploads screenshot to web app
   - AI analyzes image within 2-3 seconds
   - Extracts: source app, content type, text/quote, metadata
   - Saves to journal with timestamp
5. **Widget path** (future mobile):
   - User taps widget
   - App captures current screen context
   - Same AI processing
6. User sees confirmation: "Saved to your journal"

#### Flow 2: Browse Journal (Milestone 0.5)
1. User opens journal view
2. Sees entries in reverse chronological order
3. Each entry shows:
   - Content preview (quote, image thumbnail)
   - Source (Spotify podcast name, Twitter handle, Instagram username)
   - When it was saved
   - Auto-detected category (podcast, social, article)
4. User can filter by: date, source type, category
5. User can search by keyword

#### Flow 3: Rediscover (Milestone 0.5)
1. **Daily surface**: User opens app, sees "On This Day" - entries from 1 month, 3 months, 1 year ago
2. **On-demand browse**: User browses by category (all podcast entries, all from specific person)
3. Each entry is clickable → deep link back to source where possible

#### Flow 4: Deep Link Back (Milestone 3+)
1. User taps on journal entry
2. App opens:
   - **Spotify**: Opens podcast at intelligent timestamp (section start, not random point)
   - **Twitter**: Opens original tweet
   - **Instagram**: Opens original post/reel
   - **Generic**: Shows full context from screenshot

### Key Features by Milestone

#### **Milestone 0.5: Web Proof of Concept (MVP)** ⭐ START HERE
**Timeline**: 1-2 weeks
**Goal**: Validate AI understanding and core value proposition

**Primary Content Sources** (Perfect Deep Linking):
- 🎯 **YouTube** (videos + podcasts with timestamp support)
- 🎯 **Twitter/X** (tweets, threads)
- 🎯 **Instagram** (posts, reels)

**Secondary Sources** (Future):
- Spotify (audio podcasts - limited deep linking)
- TikTok, LinkedIn, Reddit, etc.

**Features**:
- ✅ Simple web interface (mobile responsive)
- ✅ Manual screenshot upload
- ✅ AI vision analysis (Claude 3.5 Sonnet Vision)
  - Detect source app (YouTube, Twitter, Instagram, etc.)
  - Extract text content (quotes, captions, comments)
  - Identify content type (video, tweet, post, reel)
  - Extract timestamp (for YouTube videos)
  - Generate smart title/summary
- ✅ Basic journal view (list of entries, newest first)
- ✅ Entry detail view (full content + metadata)
- ✅ **Deep link back to source** (YouTube with timestamp, Twitter to tweet, Instagram to post)
- ✅ "On This Day" view (simulated with test data)
- ✅ Auto-categorization (video, social, article, other)
- ✅ Basic search (keyword match)
- ✅ Manual entry editing (fix AI mistakes)

**What we're validating**:
- Does AI correctly identify sources from screenshots? (Target: >85% accuracy)
- Can AI extract meaningful content reliably? (Target: >80% accuracy)
- Does the deep linking work smoothly? (Can user click and return to exact moment?)
- Is the categorization accurate enough?
- Do users find value in the journal browse experience?
- Does "On This Day" feel compelling with real data?

**Out of scope for 0.5**:
- Native mobile apps
- Widget integration
- Voice capture
- Automated background capture
- Deep linking to sources
- User authentication (single user test mode)

#### **Milestone 1: Android Native App**
**Timeline**: 3-4 weeks after M0.5
**Dependencies**: M0.5 must validate AI works well

**Features**:
- Android app with screenshot capture
- Home screen widget ("Quick Save" button)
- Full journal browse (ported from web)
- "On This Day" daily notification
- User authentication (multi-user support)
- Cloud sync (entries saved to backend)

**New capabilities**:
- Screenshot auto-detect (app monitors for new screenshots)
- Widget tap → auto-process latest screenshot
- Push notifications for daily memories

#### **Milestone 2: iOS Port + Launch**
**Timeline**: 2-3 weeks after M1

**Features**:
- iOS app (feature parity with Android)
- iOS widget
- App Store submission
- Onboarding flow
- Share extension (share from other apps → journal)

#### **Milestone 3: Deep Integration + Magic**
**Timeline**: TBD based on user feedback

**Features**:
- Spotify API integration (background detection, auto-capture)
- Smart timestamp detection (section starts, not random points)
- Voice trigger ("Save this moment")
- Twitter/Instagram API integration (richer metadata)
- Advanced resurfacing:
  - Weekly digest email
  - Personalized memory feed (not just chronological)
  - Clustering related entries
- Export options (PDF, Notion, etc.)
- Collaboration (shared journals)

---

## Engineering Requirements

### Tech Stack - Milestone 0.5 (Web PoC)

#### Frontend
- **Framework**: Next.js 14+ (React)
  - Why: Fast development, mobile responsive, easy to port to mobile later, great for prototyping
- **Styling**: Tailwind CSS
  - Why: Rapid UI development, mobile-first, consistent design
- **UI Components**: Shadcn/ui
  - Why: Beautiful, accessible components out of the box
- **State Management**: React hooks + Context API (keep it simple for now)
- **File Upload**: react-dropzone for screenshot upload

#### Backend
- **Framework**: Next.js API routes (serverless)
  - Why: All-in-one solution, easy deployment, scales automatically
- **Database**: Supabase (PostgreSQL)
  - Why:
    - Free tier generous for PoC
    - Built-in auth (ready for M1)
    - Realtime capabilities
    - Full-text search
    - Image storage
- **AI/Vision**: Anthropic Claude 3.5 Sonnet with Vision
  - Why:
    - Excellent vision capabilities
    - Good at structured extraction
    - Strong reasoning for categorization
    - We're already in Claude Code ecosystem
  - Fallback: OpenAI GPT-4 Vision
- **Image Storage**: Supabase Storage
  - Why: Integrated with database, easy to use

#### Hosting & Infrastructure
- **Hosting**: Vercel
  - Why: Perfect for Next.js, free tier, instant deployments, preview URLs
- **Domain**: TBD (can use vercel.app subdomain for PoC)
- **Environment Variables**: .env.local (local) + Vercel env vars (prod)

#### Development Tools
- **Version Control**: Git + GitHub
- **Package Manager**: npm or pnpm
- **Code Quality**: ESLint, Prettier
- **Testing**: Manual testing for PoC (automated tests in M1)

### Tech Stack - Future Milestones

#### Milestone 1 (Android)
- **Framework**: React Native or Flutter
  - Lean toward: **React Native** (reuse web logic/components)
- **Widget**: Native Android widget
- **Background Processing**: Android WorkManager

#### Milestone 2 (iOS)
- **Same as M1**: React Native for cross-platform
- **Widget**: iOS WidgetKit

#### Milestone 3 (Deep Integrations)
- **Spotify API**: OAuth + Web API for metadata
- **Twitter API**: API v2 for tweet data
- **Instagram**: Graph API (if available) or web scraping

### Technical Architecture

#### System Overview
```
User Device (Mobile/Desktop)
    ↓
    Takes Screenshot
    ↓
    Uploads to Web App
    ↓
Next.js Frontend (React)
    ↓
    Sends to API Route
    ↓
Next.js API (Serverless Functions)
    ↓
    ├→ Upload image to Supabase Storage
    ├→ Send image to Claude Vision API
    ├→ Parse AI response
    ├→ Save to Supabase DB
    └→ Return entry to frontend
    ↓
Supabase PostgreSQL
    ├→ entries table
    ├→ users table (M1+)
    └→ categories table
```

#### Data Models

**Entry** (core data model)
```typescript
interface Entry {
  id: string;                    // UUID
  created_at: timestamp;         // When entry was created

  // Source data
  source_type: string;           // 'spotify' | 'twitter' | 'instagram' | 'generic'
  source_app: string;            // Detected app name
  source_url?: string;           // Deep link if available (M3+)

  // Content
  content_text: string;          // Extracted quote/text
  content_summary?: string;      // AI-generated summary
  screenshot_url: string;        // Original screenshot

  // Metadata
  title: string;                 // AI-generated title
  category: string;              // 'podcast' | 'social' | 'article' | 'other'
  tags?: string[];               // Auto or user tags

  // Context (varies by source)
  metadata: {
    // For Spotify
    podcast_name?: string;
    episode_title?: string;
    timestamp?: string;

    // For Twitter
    author?: string;
    tweet_url?: string;

    // For Instagram
    username?: string;
    post_url?: string;

    // Generic
    ai_confidence?: number;       // How confident AI is about extraction
  };

  // User data (M1+)
  user_id?: string;              // Foreign key to users

  // AI processing
  ai_analysis: {
    detected_source: string;
    confidence_score: number;
    extraction_method: string;
  };
}
```

**User** (Milestone 1+)
```typescript
interface User {
  id: string;
  email: string;
  created_at: timestamp;
  preferences: {
    daily_memory_time: string;   // "09:00" for notifications
    categories_enabled: string[];
  };
}
```

**Category** (Auto-managed)
```typescript
interface Category {
  id: string;
  name: string;                  // 'podcast', 'social', etc.
  icon: string;                  // Icon identifier
  entry_count: number;           // Cached count
}
```

#### Key Technical Decisions

**1. AI Vision Strategy**
- **Primary**: Claude 3.5 Sonnet Vision API
- **Prompt Engineering**:
  - Provide structured output format (JSON)
  - Ask for confidence scores
  - Include examples of good extractions
- **Error Handling**:
  - If confidence < 70%, flag for user review
  - Save raw AI response for debugging
  - Allow manual corrections

**2. Screenshot Processing Pipeline**
```
1. Upload screenshot → Supabase Storage
2. Get public URL
3. Send to Claude Vision API with structured prompt:
   "Analyze this screenshot. Identify:
   - What app is this from?
   - What type of content? (podcast, social post, article)
   - Extract the main text/quote
   - Generate a 5-word title
   - Categorize: podcast/social/article/other
   - Confidence: 0-100%
   Return JSON: {source_app, content_type, text, title, category, confidence}"
4. Parse JSON response
5. Save to DB with original screenshot URL
6. Return to frontend
```

**3. Search Implementation**
- **M0.5**: Simple SQL `LIKE` query on content_text and title
- **M1+**: PostgreSQL full-text search (`tsvector`)
- **M3+**: Vector embeddings for semantic search (if needed)

**4. "On This Day" Algorithm**
- Query entries where `created_at` = exactly 30 days ago, 90 days ago, 365 days ago
- If multiple matches, prioritize:
  1. Entries user has never clicked on
  2. Higher AI confidence scores
  3. Random selection for variety

**5. Auto-Categorization Logic**
- **Source-based**:
  - Spotify → podcast
  - Twitter/Instagram/TikTok → social
  - Kindle/Medium/Substack → article
- **Content-based** (if source unknown):
  - Claude analyzes text length, style, format
  - Infers category

### Performance Targets (M0.5)

- Screenshot upload → entry created: **< 5 seconds**
- Journal page load: **< 1 second**
- AI vision analysis: **< 3 seconds**
- Search results: **< 500ms**

### Security & Privacy (M1+)

- User authentication via Supabase Auth
- Row-level security (users only see their entries)
- Screenshot URLs are private (signed URLs)
- No sharing of entries without explicit consent
- GDPR-compliant data export

### Scalability Considerations (M3+)

- Supabase can handle 10K-100K users on free/pro tier
- Next.js API routes auto-scale on Vercel
- Image storage: Consider Cloudflare R2 if costs grow
- AI API costs: Monitor per-user usage, implement rate limiting

---

## Success Metrics

### Milestone 0.5 (PoC)
- ✅ AI correctly identifies source app: **>80% accuracy**
- ✅ AI extracts meaningful text: **>85% accuracy**
- ✅ Screenshot → journal entry: **<5 seconds**
- ✅ Founder uses it daily for 1 week
- ✅ Can demo to 3 people and they say "I'd use this"

### Milestone 1 (Android)
- 10 daily active users (friends/beta testers)
- 50+ entries created
- Daily retention: 40%+ (users come back next day)
- Average entries per user: 5+ per week

### Milestone 2 (iOS Launch)
- 100 users in first month
- 4.5+ star rating on App Store
- Weekly retention: 30%+
- Organic sharing: 20% invite rate

---

## Risk Assessment

### High Risk
1. **AI accuracy**: What if Claude can't reliably extract content from screenshots?
   - **Mitigation**: M0.5 validates this FIRST. If accuracy <80%, pivot to app-specific integrations.

2. **Spotify API limitations**: Spotify may not allow deep linking or background detection
   - **Mitigation**: Start generic (screenshot) so we don't depend on Spotify API for PoC.

3. **User adoption**: Will users change behavior to capture moments?
   - **Mitigation**: Make capture SO easy (one tap) that friction is minimal.

### Medium Risk
4. **Cross-platform complexity**: Building for Android + iOS
   - **Mitigation**: Use React Native in M1 to share code.

5. **Cost of AI API calls**: At scale, vision API calls could be expensive
   - **Mitigation**: Cache results, optimize prompts, consider rate limiting.

### Low Risk
6. **Technical feasibility**: We're using proven tech stack
7. **Competition**: Other journaling/bookmarking apps exist, but none with this approach

---

## Open Questions (To Research)

1. **Claude Vision API**:
   - What's the current accuracy on screenshot text extraction?
   - Cost per API call?
   - Rate limits?

2. **Spotify API**:
   - Can we get current playback position in background?
   - Deep linking format?
   - API access approval process?

3. **React Native**:
   - Best practices for screenshot detection on Android/iOS?
   - Widget implementation differences?

4. **User Research**:
   - Would users prefer voice trigger over screenshot?
   - How often do people want to be reminded of old entries?

---

## Next Steps

1. ✅ Complete this spec doc
2. ⏳ Research Claude Vision API + Spotify API capabilities
3. ⏳ Set up development environment (GitHub, Supabase, Vercel)
4. ⏳ Create `claude.md` file with project context
5. ⏳ Build M0.5 - Week 1: Basic upload + AI extraction
6. ⏳ Build M0.5 - Week 2: Journal UI + "On This Day" feature
7. ⏳ Test with real screenshots, iterate on AI prompts
8. ⏳ Demo to 3-5 people, gather feedback
9. ⏳ Decide: Proceed to M1 or pivot based on learnings

---

## Resources & References

- [Claude Vision API Docs](https://docs.anthropic.com/claude/docs/vision)
- [Spotify Web API Docs](https://developer.spotify.com/documentation/web-api)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [React Native Docs](https://reactnative.dev/docs/getting-started)

---

**Document Owner**: Founder (with Claude Code as technical advisor)
**Review Cadence**: Update after each milestone completion
