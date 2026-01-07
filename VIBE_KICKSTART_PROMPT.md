
# ⚡ THE ULTIMATE KICKSTART PROMPT (VIBE-STACK)

*Paste this into Antigravity or Cursor when starting a new project with the Vibe-Stack Boilerplate.*

---

"I am starting a new project using the Vibe-Stack. I have already initialized the boilerplate with Tailwind, Lucide, and Supabase. 

**My Goal**: [INSERT YOUR IDEA HERE - e.g. 'A subscription-only newsletter for AI founders']

**Architectural Requirements**:
1. **Premium Aesthetic**: Implement the design tokens from the `.cursorrules` (Black background, glassmorphism, Outfit typography). All buttons must have hover micro-animations and active scaling.
2. **Viewport Optimization**: Use the 'Leopold Meta' for the layout. Ensure `100dvh` is used for full-screen hero sections and that scrolling is handled via a main container with `snap-y snap-proximity`.
3. **Data & Auth**: 
   - Set up Supabase Client in `lib/supabase.ts`. 
   - Draft the SQL schema for [List needed tables] and create a `README_DEV.md` containing the code.
4. **Payments & Automation**:
   - Integrate the PayPal JS SDK in `index.html`. 
   - Create a `PayPalButton.tsx` component that passes `custom_id` to a Supabase Edge Function.
   - Set up a Resend webhook handler for welcome emails.

**Deliverable**:
Please start by building the **Mobile-First Hero section** and the **Capture Screen** for the first user interaction. Ensure the code is production-ready for Vercel deployment."
---
