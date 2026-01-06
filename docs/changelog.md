# Changelog

All notable changes to the Universal Memory Journal project will be documented in this file.

---

## [Unreleased]

### Added
- Initial project structure
- Planning documents (PROJECT_SPEC.md, RESEARCH_FINDINGS.md)
- Next.js project with TypeScript and Tailwind
- Claude.md project context file
- Automated documentation structure

---

## [0.1.0] - 2026-01-06

### Phase 1: Planning ✅

**Added**:
- Complete project specification document
- Technical research on Claude Vision API, Spotify API
- Decision to pivot MVP focus to YouTube, Twitter, Instagram (better deep linking)
- Three-milestone roadmap (M0.5: Web PoC, M1: Android, M2: iOS)

**Decisions Made**:
- Use Claude Sonnet 4.5 for vision analysis (best accuracy/cost balance)
- Start with generic screenshot approach (not app-specific integrations)
- Accept Spotify timestamp limitation for PoC
- Focus on proving core value with YouTube/social media first

### Phase 2: Setup ✅

**Added**:
- GitHub repository: [universal-memory-journal](https://github.com/meriteshjoshi/universal-memory-journal)
- Next.js 16.1.1 project with App Router
- TypeScript configuration
- Tailwind CSS styling
- Dependencies installed:
  - `@supabase/supabase-js` - Database client
  - `@anthropic-ai/sdk` - Claude API client
  - `react-dropzone` - File upload UI
- Environment variable templates (.env.example, .env.local)
- Claude.md project context file
- Automated documentation files:
  - architecture.md - System design reference
  - changelog.md - This file
  - project-status.md - Current state tracking

**Project Structure**:
```
/
├── app/                  # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── docs/                 # Planning & documentation
│   ├── PROJECT_SPEC.md
│   ├── RESEARCH_FINDINGS.md
│   ├── CLAUDE_CODE_PROJECT_GUIDE.md
│   ├── architecture.md
│   ├── changelog.md
│   └── project-status.md
├── public/               # Static assets
├── claude.md             # Claude Code context
├── package.json
└── ...config files
```

---

## Next Up

### Week 1: Core Features
- [ ] Set up Supabase project and database
- [ ] Create database schema for entries
- [ ] Build screenshot upload UI component
- [ ] Implement Claude Vision API integration
- [ ] Create journal entry display components
- [ ] Test with 20+ real screenshots from YouTube/Twitter/Instagram

### Week 2: Validation Features
- [ ] Implement "On This Day" memory surfacing
- [ ] Add search functionality
- [ ] Build deep linking for all content sources
- [ ] Polish UI based on initial feedback
- [ ] Demo to 3-5 potential users
- [ ] Document learnings for Milestone 1

---

## Version History Format

We follow [Semantic Versioning](https://semver.org/):
- **Major.Minor.Patch** (e.g., 1.2.3)
- **Major**: Breaking changes, new milestones
- **Minor**: New features, enhancements
- **Patch**: Bug fixes, small improvements

For pre-release versions (current):
- **0.x.x**: Development/PoC phase
- **1.0.0**: First public launch (Milestone 2 - iOS)

---

**Last Updated**: 2026-01-06
