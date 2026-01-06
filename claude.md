# Universal Memory Journal - Claude Code Context

**Last Updated**: 2026-01-06
**Phase**: Milestone 0.5 - Web Proof of Concept

---

## Project Overview

### What We're Building
A universal capture system that allows users to save meaningful moments from digital content (YouTube, Twitter, Instagram) via screenshots, then rediscover them later through intelligent resurfacing - like Google Photos for digital insights.

### Current Milestone: M0.5 (Web PoC)
**Goal**: Validate that AI can reliably extract content from screenshots and that the journal + resurfacing experience is valuable.

**Primary Content Sources**:
- 🎯 YouTube (videos + podcasts with timestamp support)
- 🎯 Twitter/X (tweets, threads)
- 🎯 Instagram (posts, reels)

**Success Criteria**:
- AI correctly identifies sources: >85% accuracy
- AI extracts meaningful content: >80% accuracy
- Deep linking works smoothly
- Founder uses daily for 1 week
- 3 people say "I'd use this" in demos

---

## Technical Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (to be added)
- **State**: React hooks + Context API

### Backend
- **API**: Next.js API routes (serverless)
- **Database**: Supabase (PostgreSQL)
- **AI/Vision**: Claude 3.5 Sonnet Vision API
- **Storage**: Supabase Storage (for screenshots)

### Hosting
- **Platform**: Vercel
- **Domain**: TBD (using vercel.app for PoC)

---

## Architecture Quick Reference

```
User uploads screenshot
  ↓
Next.js Frontend
  ↓
API Route (/api/analyze-screenshot)
  ↓
├─→ Upload to Supabase Storage
├─→ Send to Claude Vision API
├─→ Parse AI response (extract source, content, metadata)
├─→ Save to Supabase DB
└─→ Return entry to frontend
  ↓
Display in journal view
```

**Key Files**:
- `docs/PROJECT_SPEC.md` - Full product and engineering requirements
- `docs/RESEARCH_FINDINGS.md` - Technical research and decisions
- `app/` - Next.js App Router pages
- `lib/` - Utility functions (to be created)
- `components/` - React components (to be created)

---

## Development Guidelines

### Code Style
- **TypeScript**: Use strict typing, no `any` types
- **Components**: Functional components with hooks
- **File naming**: kebab-case for files, PascalCase for components
- **Imports**: Use `@/` alias for absolute imports

### UI/UX Principles
- **Mobile-first**: Design for mobile, enhance for desktop
- **Minimal friction**: Capture should be < 3 taps
- **Visual hierarchy**: Make content the star, not the UI
- **Fast feedback**: Show loading states, confirm actions
- **Clean design**: Avoid the "purple gradient", keep it simple

### AI Integration
- **Structured prompts**: Always request JSON output from Claude Vision
- **Confidence scores**: Track AI confidence, flag low-confidence for review
- **Error handling**: Gracefully handle API failures
- **Cost awareness**: Monitor token usage, optimize image sizes

---

## Repository Rules & Etiquette

### Git Workflow
- ✅ **Use branches** for each major feature
- ✅ **Commit frequently** with clear messages
- ❌ **Never push to main directly** - always use PRs for features
- ✅ **Include testing** before merging

### Branch Naming
- `feature/` - New features (e.g., `feature/screenshot-upload`)
- `fix/` - Bug fixes (e.g., `fix/ai-extraction-error`)
- `docs/` - Documentation updates
- `chore/` - Maintenance, deps updates

### Commit Message Format
```
<type>: <short description>

<detailed description if needed>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### What Gets Committed
- ✅ Source code, configs, docs
- ✅ `.env.example` (template)
- ❌ `.env.local` (secrets)
- ❌ `node_modules/`
- ❌ `.next/`
- ❌ API keys, credentials

---

## Frequently Used Commands

### Development
```bash
npm run dev         # Start dev server (http://localhost:3000)
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

### Database (Supabase)
```bash
# To be added when Supabase is configured
```

### Testing
```bash
# To be added in future milestones
```

---

## Testing Instructions

### Manual Testing (M0.5)
1. **Screenshot Upload**:
   - Test with 10+ different screenshots (YouTube, Twitter, Instagram)
   - Verify AI extracts source, content, metadata correctly
   - Check confidence scores

2. **Journal View**:
   - Verify entries display correctly
   - Test search functionality
   - Check categorization accuracy

3. **Deep Linking**:
   - Click entry → verify opens correct URL
   - YouTube: Check timestamp is included
   - Twitter/Instagram: Verify goes to exact post

4. **"On This Day"**:
   - Test with dummy data from past dates
   - Verify correct entries surface

### Automated Testing (M1+)
- To be implemented with Vitest/Jest

---

## Important Constraints & Policies

### Security
- ❌ **Never** log API keys or sensitive data
- ✅ **Always** use environment variables for secrets
- ✅ **Always** validate user input before processing
- ✅ **Always** sanitize AI-generated content before display

### Performance
- ⚡ Screenshot → entry creation: **< 5 seconds** target
- ⚡ Journal page load: **< 1 second** target
- 📊 Monitor AI API costs per user

### Privacy
- 🔒 User screenshots are private (signed URLs only)
- 🔒 No sharing without explicit consent
- 🔒 GDPR-compliant data export (future)

---

## Current Status & Next Steps

### ✅ Completed
- [x] Project planning and spec
- [x] GitHub repo setup
- [x] Next.js project initialized
- [x] Dependencies installed
- [x] Basic app structure created

### 🔄 In Progress
- [ ] Get Anthropic API key
- [ ] Set up Supabase project
- [ ] Create environment variables
- [ ] Set up automated documentation

### ⏭️ Next Up (Week 1)
1. Create Supabase database schema
2. Build screenshot upload UI
3. Implement Claude Vision API integration
4. Create journal entry display
5. Test with 20+ real screenshots

### ⏭️ After PoC (Week 2)
1. Implement "On This Day" feature
2. Add search functionality
3. Build deep linking for all sources
4. Polish UI based on feedback
5. Demo to 3-5 people

---

## AI Prompt Engineering Notes

### Claude Vision Analysis Prompt (Template)
```
Analyze this screenshot and extract the following information:

1. Source app (YouTube, Twitter, Instagram, or other)
2. Content type (video, tweet, post, reel, article)
3. Main text/quote (extract verbatim)
4. For YouTube: Extract timestamp if visible
5. For Twitter: Extract author handle and tweet URL if visible
6. For Instagram: Extract username if visible
7. Generate a 5-8 word title summarizing the content
8. Categorize: video, social, article, or other
9. Confidence score (0-100%)

Return JSON:
{
  "source_app": "YouTube",
  "content_type": "video",
  "text": "extracted quote here",
  "title": "5-8 word summary",
  "category": "video",
  "metadata": {
    "timestamp": "12:34" (if YouTube),
    "author": "@username" (if Twitter),
    // etc.
  },
  "confidence": 85
}
```

---

## Automated Documentation

### Files to Keep Updated
These docs should be updated automatically after major features:

1. **`docs/architecture.md`** - System design, component interactions (to be created)
2. **`docs/changelog.md`** - What changed over time (to be created)
3. **`docs/project-status.md`** - Milestones, accomplishments, where we left off (to be created)
4. **`docs/features/*.md`** - Reference docs for key features (to be created)

### Update Trigger
After completing a feature or reaching a milestone, run:
```
# To be implemented: slash command to update all docs
```

---

## Questions & Decisions Log

### Open Questions
1. Should we support drag-and-drop for screenshot upload or just file picker?
2. What's the best UI pattern for "On This Day" - modal, dedicated page, or inline?
3. Should we show low-confidence AI extractions to user for correction?

### Decisions Made
- **2026-01-06**: Pivot from Spotify to YouTube/Twitter/Instagram for MVP (better deep linking)
- **2026-01-06**: Use Claude Sonnet 4.5 for vision (best accuracy/cost balance)
- **2026-01-06**: Start with web PoC before native mobile apps

---

## Resources

- [Project Spec](docs/PROJECT_SPEC.md)
- [Research Findings](docs/RESEARCH_FINDINGS.md)
- [Claude Code Guide](docs/CLAUDE_CODE_PROJECT_GUIDE.md)
- [Claude Vision API Docs](https://docs.anthropic.com/claude/docs/vision)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

**Remember**: We're building a PoC to validate the core value proposition. Speed and validation matter more than perfection. Ship fast, learn, iterate.
