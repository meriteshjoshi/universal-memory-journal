# System Architecture

**Last Updated**: 2026-01-06
**Status**: Initial Setup

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Device                           │
│                    (Mobile/Desktop Browser)                  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ Screenshot Upload
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Frontend                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Upload Component  │  Journal View  │  Entry Detail  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ API Request
                             ▼
┌─────────────────────────────────────────────────────────────┐
│           Next.js API Routes (Serverless)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/analyze-screenshot                              │  │
│  │  /api/entries (CRUD)                                  │  │
│  │  /api/search                                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────┬───────────────────────────┬────────────────────────────┘
      │                           │
      │                           │
      ▼                           ▼
┌─────────────────┐    ┌──────────────────────────┐
│ Claude Vision   │    │    Supabase Backend      │
│      API        │    │  ┌────────────────────┐  │
│                 │    │  │  PostgreSQL DB     │  │
│ (AI Analysis)   │    │  │  - entries table   │  │
│                 │    │  │  - users table     │  │
└─────────────────┘    │  └────────────────────┘  │
                       │  ┌────────────────────┐  │
                       │  │  Storage           │  │
                       │  │  - screenshots/    │  │
                       │  └────────────────────┘  │
                       └──────────────────────────┘
```

---

## Component Breakdown

### Frontend Layer

#### Pages (App Router)
- **`/app/page.tsx`** - Homepage with upload interface
- **`/app/journal/page.tsx`** - Journal browse view (to be created)
- **`/app/entry/[id]/page.tsx`** - Individual entry detail (to be created)
- **`/app/memories/page.tsx`** - "On This Day" view (to be created)

#### Components (to be created)
- **`ScreenshotUploader`** - Drag-and-drop or file picker for screenshot upload
- **`EntryCard`** - Display single journal entry
- **`JournalGrid`** - Grid/list view of entries
- **`SearchBar`** - Search entries by keyword
- **`CategoryFilter`** - Filter by source type
- **`MemoryFeed`** - "On This Day" daily memories

#### State Management
- React Context for global state (entries, user)
- Local state for UI interactions
- No Redux/Zustand needed for PoC

---

### Backend Layer

#### API Routes

**`/api/analyze-screenshot`** (POST)
- Receives screenshot file
- Uploads to Supabase Storage
- Sends to Claude Vision API
- Parses AI response
- Saves entry to database
- Returns entry object

**`/api/entries`** (GET)
- Retrieves all entries for user
- Supports pagination, filtering
- Returns array of entries

**`/api/entries/[id]`** (GET, PATCH, DELETE)
- Get single entry
- Update entry (user corrections)
- Delete entry

**`/api/search`** (GET)
- Full-text search on entries
- Returns matching entries

**`/api/memories`** (GET)
- Returns entries from past dates
- "On This Day" logic

---

### Data Layer

#### Database Schema (Supabase PostgreSQL)

**`entries` table**:
```sql
CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Source metadata
  source_type TEXT NOT NULL,  -- 'youtube', 'twitter', 'instagram'
  source_app TEXT,
  source_url TEXT,

  -- Content
  content_text TEXT NOT NULL,
  content_summary TEXT,
  screenshot_url TEXT NOT NULL,

  -- AI-generated
  title TEXT NOT NULL,
  category TEXT NOT NULL,  -- 'video', 'social', 'article', 'other'
  tags TEXT[],

  -- Source-specific metadata (JSONB)
  metadata JSONB DEFAULT '{}',

  -- AI processing info
  ai_confidence INTEGER,  -- 0-100
  ai_analysis JSONB,

  -- User (to be added in M1)
  -- user_id UUID REFERENCES users(id),

  -- Indexes
  CONSTRAINT check_confidence CHECK (ai_confidence >= 0 AND ai_confidence <= 100)
);

CREATE INDEX idx_entries_created_at ON entries(created_at DESC);
CREATE INDEX idx_entries_category ON entries(category);
CREATE INDEX idx_entries_source_type ON entries(source_type);
-- CREATE INDEX idx_entries_user_id ON entries(user_id);  -- M1+
```

**Example metadata JSONB**:
```json
{
  "youtube": {
    "video_title": "How to Build...",
    "channel": "Tech Channel",
    "timestamp": "12:34",
    "video_id": "abc123"
  },
  "twitter": {
    "author": "@username",
    "tweet_url": "https://twitter.com/...",
    "is_thread": false
  },
  "instagram": {
    "username": "@user",
    "post_url": "https://instagram.com/p/...",
    "is_reel": true
  }
}
```

**`users` table** (M1+):
```sql
-- To be created in Milestone 1
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preferences JSONB DEFAULT '{}'
);
```

#### Storage Structure (Supabase Storage)

**Bucket**: `screenshots`
```
screenshots/
  ├── {user_id}/  (M1+, for now just use /temp/)
  │   ├── {entry_id}_original.png
  │   └── {entry_id}_thumb.png (future optimization)
```

**Storage Policies**:
- Public read access (signed URLs)
- Authenticated write access (M1+)

---

### External Services

#### Claude Vision API

**Endpoint**: `https://api.anthropic.com/v1/messages`

**Request Format**:
```typescript
{
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  messages: [{
    role: "user",
    content: [
      {
        type: "image",
        source: {
          type: "url",
          url: screenshot_url
        }
      },
      {
        type: "text",
        text: "Analyze this screenshot..." // See claude.md for full prompt
      }
    ]
  }]
}
```

**Response Handling**:
- Parse JSON from Claude response
- Validate structure
- Extract confidence score
- Handle errors gracefully

---

## Data Flow Examples

### 1. Screenshot Upload Flow

```
1. User selects screenshot
   ↓
2. Frontend: ScreenshotUploader component
   - Show loading state
   - Send POST to /api/analyze-screenshot
   ↓
3. API Route: /api/analyze-screenshot
   - Validate file type/size
   - Upload to Supabase Storage → Get URL
   - Send to Claude Vision API → Get analysis
   - Parse AI response → Extract fields
   - Save to Supabase DB → Get entry ID
   - Return entry object
   ↓
4. Frontend: Update UI
   - Show success message
   - Display entry in journal
   - Clear upload form
```

### 2. Journal Browse Flow

```
1. User navigates to /journal
   ↓
2. Frontend: JournalGrid component
   - Show loading skeleton
   - Fetch GET /api/entries
   ↓
3. API Route: /api/entries
   - Query Supabase DB
   - Order by created_at DESC
   - Limit 50 (pagination)
   - Return entries array
   ↓
4. Frontend: Render entries
   - Map over entries → EntryCard components
   - Show source icons, titles, previews
   - Enable search/filter
```

### 3. Deep Link Click Flow

```
1. User clicks on entry
   ↓
2. Frontend: Extract source_url from entry
   ↓
3. Open in new tab:
   - YouTube: https://youtube.com/watch?v={id}&t={timestamp}
   - Twitter: {tweet_url}
   - Instagram: {post_url}
```

---

## Performance Considerations

### Target Metrics
- Screenshot upload → entry created: **< 5 seconds**
- Journal page load: **< 1 second**
- Search results: **< 500ms**

### Optimization Strategies

**Image Upload**:
- Client-side compression before upload
- Resize large screenshots (max 1920x1080)
- Use WebP format when possible

**AI API Calls**:
- Monitor token usage
- Implement request caching (don't re-analyze same screenshot)
- Consider Haiku for simple cases

**Database Queries**:
- Use indexes on common query patterns
- Implement pagination (50 entries per page)
- Cache frequently accessed data

**Frontend**:
- Use Next.js Image component for optimization
- Lazy load images below fold
- Code splitting for heavy components

---

## Security Architecture

### API Security
- Rate limiting on API routes (to be added)
- Input validation and sanitization
- CORS configuration for production

### Data Security
- Environment variables for secrets
- Signed URLs for screenshot access
- Row-level security in Supabase (M1+)

### Authentication (M1+)
- Supabase Auth for user management
- JWT tokens for API authentication
- Secure session handling

---

## Deployment Architecture (Vercel)

```
GitHub Repo
  ↓
  ↓ (git push)
  ↓
Vercel Platform
  ├── Build: Next.js SSR + API Routes
  ├── Deploy: Edge Network (CDN)
  └── Monitoring: Analytics, Logs

Connected Services:
  ├── Supabase (Database + Storage)
  └── Anthropic API (Vision Analysis)
```

**Environment**:
- Development: localhost:3000
- Preview: vercel-preview-{hash}.vercel.app (per branch)
- Production: universal-memory-journal.vercel.app (main branch)

---

## Future Architecture Considerations

### Milestone 1 (Android App)
- Add React Native mobile app
- Shared API backend (Next.js)
- Mobile-specific screenshot detection
- Push notifications for "On This Day"

### Milestone 2 (iOS App)
- Cross-platform React Native codebase
- iOS-specific widget integration
- App Store deployment

### Milestone 3 (Advanced Features)
- Background processing queue for AI analysis
- Caching layer (Redis) for frequent queries
- Vector embeddings for semantic search
- Analytics pipeline (Mixpanel integration)

---

**Last Updated**: 2026-01-06 - Initial architecture for Milestone 0.5 Web PoC
