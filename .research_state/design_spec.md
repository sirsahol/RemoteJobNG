# UI/UX Design Specification: RemoteJobNG 2026 (Liquid Glass) - Refined

## 🎨 Visual Identity
The "Liquid Glass" system prioritizes depth, translucency, and high-performance micro-interactions using Tailwind CSS v4.

### 1. Design Tokens (@theme implementation)
Implemented in `my-app/app/globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-glass-surface: rgba(255, 255, 255, 0.1);
  --color-glass-border: rgba(255, 255, 255, 0.2);
  --shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  --blur-glass: 16px;
  
  --color-brand-blue: #3b82f6;
  --color-brand-indigo: #6366f1;
  --background-mesh: radial-gradient(at 0% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
                     radial-gradient(at 50% 0%, hsla(225,39%,20%,1) 0, transparent 50%), 
                     radial-gradient(at 100% 0%, hsla(225,39%,10%,1) 0, transparent 50%);
}
```

### 2. Core Components
- **The "Glass Island" Navbar:**
  - Floating container with `backdrop-blur-[--blur-glass]` and `bg-[--color-glass-surface]`.
  - Subtle `border-b` with `border-[--color-glass-border]`.
- **Job Card (Widget Style):**
  - Frosted appearance with high saturation (`saturate-180`).
  - Hover effect: Inner glow enhancement and shadow expansion.

## 🛠 AI Integration & Verification
- **Semantic Matching:** Leveraging `pgvector` on PostgreSQL to map candidate embeddings to job descriptions.
- **Verification Engine:** Automated skill badges based on GitHub/LinkedIn metadata and integrated "Power/ISP Reliability" badges for Nigerian workers.
