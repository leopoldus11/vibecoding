
# 📖 THE VIBE CODING MANUAL
*Accelerate your development from Days to Minutes.*

This ecosystem is designed to remove the friction of connecting services (Supabase, Resend, PayPal) so you can focus on the "Vibe" and the business logic.

---

## 🛠️ THE TOOLS

### 1. The Vibe Architect (`VIBE_ARCHITECT_PROMPT.md`)
**When to use**: Before you write a single line of code.
**How to use**: Copy the content of this file and paste it into a high-level LLM (Google Gemini 2.0 Flash/Pro or GPT-4o). Describe your business idea. It will output the exact tech stack, database schema, and an "Initial Prompt" tailored to your needs.

### 2. The Kickstart Prompt (`VIBE_KICKSTART_PROMPT.md`)
**When to use**: When you open your coding agent (Antigravity/Cursor).
**How to use**: Paste this into the chat. It ensures the AI agent understands the "Leopold Meta" (100dvh, premium aesthetics, mobile fixes) and correctly configures your services.

### 3. The Boilerplate (`/boilerplate-v1.0`)
**When to use**: As the root of your new project.
**Features**:
- **`.cursorrules`**: Prevents the AI from making common mistakes (like using `100vh` on mobile).
- **`.env.local.example`**: A roadmap of every API key you will need.
- **`package.json`**: Pre-loaded with Lucide, Confetti, and Supabase.

---

## 🧙‍♂️ THE "LEOPOLD META" SECRETS

### The Mobile Viewport Fix
`100vh` is broken on mobile because it doesn't account for address bars. **Always use `100dvh`** and a custom scroll container.

### The Payment Handshake
Never use simple links. Use the **PayPal SDK with `custom_id`**. This links the money to the user's email in Supabase automatically.

### The DNS Bridge
When using Vercel + Strato, you **cannot** use the standard `mx00.strato.com` records reliably.
**The Fix**: Use `smtpin.rzone.de` (Priority 10) in Vercel to bridge directly into Strato's internal system.
**DNS Security**: Ensure a root SPF record (`v=spf1 include:strato.com include:strato.de include:amazonses.com ~all`) and a DMARC record are in place.

---

## 🚀 YOUR NEXT PROJECT
1. Copy the `boilerplate-v1.0` folder.
2. Run `npm install`.
3. Use the **Vibe Architect** to get your prompt.
4. Paste the **Kickstart Prompt** into Antigravity.
5. **Launch.**
