# Claude Code Project Guide: PSB System

**Plan → Setup → Build**

A comprehensive guide for starting and managing Claude Code projects effectively.

---

## Phase 1: PLAN

### Pre-Planning Questions

Before opening Claude Code, answer these two critical questions:

#### 1. What are you actually trying to do?
- Learning a new technology?
- Validating an idea with customers?
- Building an alpha version?
- Prototyping to see if something is possible?

**Why it matters**: Your goal determines what's important to build vs. what you can skip.

#### 2. What are your milestones?
- What does version 1 (MVP) look like?
- What can be left out or saved for future versions?
- What are versions 2, 3, etc.?

**Structure**: Think in terms of MVP + 1-2 improvement versions.

### Using AI to Help Plan

**Pro Tip**: Tell AI to ask YOU questions.

Example prompt: *"Hey Claude, I want to build this project. What are the three most important questions I need to answer to build an MVP successfully?"*

**Alternative**: Use Claude/ChatGPT voice mode to talk through your idea, then have it summarize into markdown.

### Project Spec Document

The main deliverable of the planning phase. Contains two parts:

#### Part 1: Product Requirements

**Answers**: Who is this for? What problems does it solve? What should it do?

**Key sections**:
- Target user/problem
- User flows and interactions (be specific!)
- Feature milestones

**Critical**: Don't say "users can create entries" — say "users start with prompts, can add photos, can edit past entries" etc.

**Remember**:
- Don't build everything at once
- Define what "done" looks like for each milestone
- Iterate on requirements as you build

#### Part 2: Engineering Requirements

**Tech Stack** - Be explicit about:
- Programming language
- Frontend framework
- Backend framework
- Database choice
- Hosting/infrastructure provider
- Component libraries
- Authentication, payments, email, storage, AI providers

**Example Stack**:
- Frontend: Vercel (hosting), Next.js, Tailwind, Shadcn
- Backend/DB: MongoDB or Supabase
- Auth: Clerk
- Payments: Stripe
- Email: Resend
- Backend hosting: Digital Ocean
- Object storage: Cloudflare R2
- AI: Anthropic (+ Gemini for images)

**Technical Architecture**:
- System design overview
- Key components and interactions
- Database schema
- API design
- Implementation patterns/best practices

**Pro Tip**: If unsure about tech choices, ask Claude to create a research report with options and recommendations.

**Action Item**: Provision infrastructure NOW (create databases, set up hosting, generate API keys).

---

## Phase 2: SETUP

### 7-Step Setup Checklist

#### Step 1: Set Up GitHub Repo

**Why it's critical**:
- Enables Claude Code on web and mobile
- Access to GitHub CLI and GitHub Actions
- Deploy previews with Vercel/similar
- Issue-based development workflow
- Multi-agent development support

**Best Practice**: Use branches for each major feature.

#### Step 2: Create Environment Variable File

1. Ask Claude to create example `.env` file based on your tech stack
2. Create a copy and fill in actual credentials/API keys
3. This prevents Claude from stopping to ask you for keys

#### Step 3: Set Up `claude.md` File

**Think of it as**: Your project's memory (always included in context).

**What to include**:
- Project goals and architecture overview
- Design style guide and UX guidelines
- Constraints and policies (e.g., "never push to main directly")
- Repository etiquette (PRs vs direct merges, branch naming)
- Frequently used commands (build, test)
- Testing instructions
- Rules Claude should follow

**Keep it concise**: Link to other files instead of repeating information.

**Examples of linked files**:
- Project spec doc
- Architecture.md
- Other detailed docs

**Remember**: Build it up iteratively, not perfect on day one.

#### Step 4: Set Up Automated Documentation

**Purpose**: Docs that Claude keeps updated as you work.

**Four core documents**:

1. **`architecture.md`**
   - System design, app structure, component interactions
   - Update after adding big features

2. **`changelog.md`**
   - List of changes over time
   - Helps track work and shows project evolution

3. **`project-status.md`**
   - Project milestones
   - What's accomplished
   - Where you left off last time

4. **Reference docs for key features** (optional)
   - High-level feature overviews
   - Examples: onboarding.md, payments.md, notifications.md

**How to keep updated**:
- Add instruction in `claude.md`
- Create custom slash command Claude runs after finishing features

#### Step 5: Set Up Plugins

**What they are**: Combinations of slash commands, sub-agents, MCP servers, hooks, and skills.

**How to manage**: Use `/plugins` command in Claude Code.

**Recommended plugins**:
- **Anthropic Frontend Plugin**: Better UIs, avoid "purple gradient"
- **Anthropic Feature Dev Plugin**: Streamlined feature development
- **Every Compound Engineering Plugin**: Suite of commands for continuous improvement

#### Step 6: Set Up MCPs (Model Context Protocol)

**What they are**: Integrations connecting Claude Code to external tools/services.

**Recommended MCPs by category**:

**Database**:
- MongoDB MCP or Supabase MCP
- Critical for rapid schema iteration

**Web Apps**:
- Playwright MCP or Puppeteer MCP
- For testing user flows

**Other useful MCPs**:
- Vercel MCP (deployment)
- Mixpanel MCP (analytics)
- Linear MCP (project management)

**Installation**: Usually one-line install per MCP.

#### Step 7: Set Up Slash Commands & Subagents

**Slash Commands**:
- Shortcuts to prompts/tasks
- Use same context window as main conversation

**Subagents**:
- Specialized agents for specific tasks
- Use forked context window (isolated from main conversation)
- Perfect for parallel work

**Built-in subagents to use**:
- Planning subagent
- Codebase search subagent

**Recommended custom subagents**:
1. **Changelog subagent**: Update changelog after features
2. **Frontend testing subagent**: Run Playwright tests automatically
3. **Retro agent**: Reflect on improvements, update claude.md/prompts/commands

**Recommended slash commands**:
- `/commit` and `/pr` (from Anthropic plugin)
- `/feature-dev` (feature development workflow)
- Custom: Update all docs based on recent changes
- Custom: Create GitHub issues from spec/prompt

### Bonus Advanced Setup

#### Bonus 1: Pre-configure Permissions

**Purpose**: Pre-approve/block commands so Claude doesn't need to ask.

**Example**: Always allow git commands or file edits without asking.

**Benefit**: Prevents Claude waiting for permission while you're away.

#### Bonus 2: Set Up Hooks

**What they are**: Scripts that run automatically at specific points in Claude Code lifecycle.

**Examples**:
- **Stop hook**: Check if tests pass when Claude finishes; if not, tell Claude to fix them
- **Notification hook**: Ping Slack when Claude needs permission

---

## Phase 3: BUILD

### Building Your MVP

1. Use your Project Spec Doc and milestones
2. Ask Claude to build Milestone 1
3. **Pro Tip**: Request parallel subagents for faster development
4. **Always**: Use plan mode first for better results

### Three Development Workflows

#### Workflow 1: General Workflow (Single Feature)

**Four parts**:

1. **Research** (optional)
   - Create research report
   - For bigger features with tech stack decisions or new APIs

2. **Plan** (CRITICAL)
   - Use plan mode
   - Claude breaks down task, asks clarifying questions
   - **Most common mistake**: Not using plan mode enough

3. **Implement**
   - Claude uses plugins, sub-agents, MCPs, slash commands
   - Try `/feature-dev` from Anthropic plugin

4. **Test**
   - Automated where possible

#### Workflow 2: Issue-Based Development

**Concept**: GitHub issues = source of truth for features/tasks.

**Benefits**:
- Keeps project organized
- Single source of truth (not scattered todo files)
- Enables parallel work with multiple Claude instances

**Setup**:
- Split work into GitHub issues
- Ask Claude to convert project spec/milestones into issues
- Create issues manually as needed

**Automation**: Create slash command/subagent to generate issues from files.

**Parallel work options**:
- Ask Claude to tackle multiple issues using subagents (same session)
- Use multiple Claude Code instances (different sessions)

#### Workflow 3: Multi-Agent Development (Advanced)

**What it is**: Multiple Claude Code instances working on different features simultaneously.

**Key technology**: Git work trees
- Multiple working copies of repo in different directories
- Each on different branch
- Isolated files, shared git history

**Workflow**:
1. Each Claude instance works in its own work tree
2. When done, merge work trees together (into main or feature branch)

**Capability**: Can work on 3+ features at once.

### Four Productivity Tips

#### Tip 1: Use the Best Models

**Hierarchy**:
- **Opus 4.5**: Planning and complex tasks
- **Sonnet**: Implementation workhorse
- **Haiku**: Simple tasks and bug fixes

**Why**: Time saved from fewer mistakes > money saved from cheaper model.

#### Tip 2: Periodically Update `claude.md`

- Update as you add features or reach milestones
- **Pro Tip**: Create slash command that updates `claude.md` then creates git commit

#### Tip 3: Practice Regression Prevention

**Method**: When Claude makes a mistake, type `#` to give an instruction.

**Result**: Claude automatically incorporates it into `claude.md`.

**Benefit**: Update `claude.md` on the fly without manual edits.

#### Tip 4: Don't Be Afraid to Throw Away Work

- Code is cheap
- If something isn't working (especially in prototypes), undo or restart
- Often gets you to a better solution faster
- Use Claude Code's checkpoints and rewind features

---

## Quick Reference

### Planning Checklist
- [ ] Answer: What am I trying to do?
- [ ] Answer: What are my milestones?
- [ ] Use AI to ask clarifying questions
- [ ] Create Project Spec Doc (Product + Engineering requirements)
- [ ] Choose and document tech stack
- [ ] Provision infrastructure

### Setup Checklist
- [ ] Set up GitHub repo
- [ ] Create `.env` file with credentials
- [ ] Create `claude.md` file
- [ ] Set up automated docs (architecture, changelog, status, feature refs)
- [ ] Install recommended plugins
- [ ] Set up MCPs for your tech stack
- [ ] Configure slash commands and subagents
- [ ] (Optional) Pre-configure permissions
- [ ] (Optional) Set up hooks

### Building Checklist
- [ ] Build MVP using Project Spec
- [ ] Choose workflow (general/issue-based/multi-agent)
- [ ] Always use plan mode for new features
- [ ] Update `claude.md` periodically
- [ ] Use `#` for regression prevention
- [ ] Don't hesitate to throw away and restart if needed

---

## Key Principles

1. **Planning saves time**: 15 minutes planning > hours of frustration
2. **Be specific**: The clearer you are, the better Claude understands
3. **Build iteratively**: MVP first, then improvements
4. **Keep context lean**: Link to docs instead of bloating `claude.md`
5. **Use the right workflow**: Match workflow to task complexity
6. **Use plan mode**: The most common mistake is not planning enough
7. **Code is cheap**: Don't be precious about throwing work away
