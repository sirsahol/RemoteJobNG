# Source Manifest — Comprehensive Modernization of RemoteJobNG (Exhaustive)

## 🌍 Market & Competitor Ecosystem (Nigeria Focus)
1.  **Competitive Analysis (Jobberman, MyJobMag, HotNigerianJobs):**
    *   *Finding:* Jobberman owns the corporate trust space; MyJobMag is the "resource hub" (salary guides, CV reviews).
    *   *Gap:* Most local boards are cluttered with ads and have "legacy" UI. A premium, ad-free, AI-first platform is a clear differentiator.
    *   *Integration Idea:* Add a "Verified Employer" badge and a "Career Resources" MDX blog.
2.  **The "Trust Gap" & Verification:**
    *   *Finding:* Nigerians face automatic rejection due to location. Trust is the #1 currency.
    *   *Innovation:* Implement "Skill Assessments" (verified badges) and "Identity Verification" early in the roadmap.
3.  **Global Benchmarks:** LinkedIn Jobs, Indeed (Nigeria), and bordful (Next.js reference).

## 💳 Payment & Infrastructure Strategic Insights
1.  **Remote Worker Payouts (Cleva, Grey, Chimoney):**
    *   *Cleva/Grey:* Best for individual USD management.
    *   *Chimoney:* Specialized for "AI agent wallets" and global payouts via Interledger.
    *   *Feature Idea:* Integrate a "Payment Guide" for new remote workers and potentially partner with Cleva for a "Withdrawal" shortcut.
2.  **Infrastructure Challenges (Power/ISP):**
    *   *Insight:* Employers fear downtime. 
    *   *Feature Idea:* Add "Infrastructure Badges" to profiles (e.g., "Solar Powered", "Dual ISP").

## 🎨 Design System & Aesthetics (Tailwind v4 / React 19)
1.  **"Liquid Glass" (Glassmorphism) Implementation:**
    *   *Pattern:* `backdrop-blur-md bg-white/30 border border-white/20`.
    *   *Nuance:* Requires colorful/complex backgrounds to "pop."
2.  **Tailwind v4 CSS-First Config:**
    *   *Pattern:* Use `@theme` in `globals.css` for all design tokens (colors, gradients, blurs).
3.  **Modern SaaS Dashboards (Linear, Stripe, Vercel):**
    *   *Trends:* Action-oriented pipelines, high-contrast search, and personalized widgets.

## 🤖 AI & Search Architecture
1.  **Semantic Matching (Embeddings):**
    *   *Architecture:* Hybrid search (Vector + Metadata).
    *   *Tools:* `pgvector` for PostgreSQL (already in Phase 2 roadmap), `sentence-transformers` for embeddings.
2.  **Resume Ingestion:**
    *   *Tools:* `PyMuPDF`, `Apache Tika` for PDF/DOCX parsing.

## 💻 Codebase & Internal Docs
1.  **[Architecture](file:///Users/z4/RemoteJobNG/docs/architecture.md):** Decoupled Next.js/Django.
2.  **[Roadmap](file:///Users/z4/RemoteJobNG/docs/roadmap.md):** Currently at Sprint 4 completion.
3.  **[Current Navbar](file:///Users/z4/RemoteJobNG/my-app/app/components/Navbar/Navbar.jsx):** Needs a complete glassmorphism overhaul.
