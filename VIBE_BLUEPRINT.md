
# 💎 The Vibe-Stack Master Blueprint (2026 Edition)
*The definitive guide to reproducing the high-vibe, automated course engine.*

## 🏗️ Phase 1: The Visual Foundation (Frontend)

### 1. Viewport & Scrolling (The "Anti-Bounce" Logic)
- **Unified Height**: Use `100dvh` instead of `100vh` or `100svh` to handle mobile browser toolbars dynamically.
- **Scroll Container**: Wrap main content in a `div` with `h-[100dvh] overflow-y-auto w-full`.
- **Custom Scroll Event**: Dispatch a `scroll-container` event from the main `div` so sticky elements (Header, Footer) can track position correctly without `window.scrollY` (which stays at 0 in nested containers).
- **Safe Snapping**: Use `snap-y snap-proximity`. Avoid `snap-mandatory` on mobile as it fights the user during dynamic viewport resizing.
- **Width Fix**: Use `width: 100%` on `html/body` + `overflow-x-hidden`. Avoid `100vw` as it includes the scrollbar width and causes horizontal jitter.

### 2. Spacing Algorithm (The "Premium Fit")
- **Hero Measurement**: Use a `ResizeObserver` or `useLayoutEffect` to measure `Header`, `Hero Content`, and `Footer` height.
- **Gap Distribution**: Calculate `totalGapSpace = ViewportHeight - (Header + Hero + Buffer)`. 
- **Anchor-to-Bottom**: Distribute this space into CSS variables (`--equal-spacing`) to push the primary CTA button to the exact bottom fold of the screen.

### 3. Components
- **MobileStickyFooter**: Position it *outside* the main scrollable container. Listen for the `scroll-container` event to show/hide.
- **ConsentBanner**: Categorized consent (Essential, Analytics, Marketing). Logs decisions to `consent_logs` table in Supabase.

---

## �️ Phase 2: The Core Infrastructure (Supabase)

### 1. Database Schema (`bookings`)
```sql
create table bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  batch_id text not null,          -- Matches data/courses.json
  preferred_email text not null,   -- Captured before payment
  paypal_email text,               -- Captured from webhook
  payment_status text default 'pending', -- 'pending', 'completed'
  payment_amount numeric,
  paypal_order_id text             -- Tracking ID for reconciliation
);

-- Security (RLS)
alter table bookings enable row level security;
create policy "Allow anonymous inserts" on bookings for insert with check (true);
create policy "Allow internal access" on bookings for select using (true);
```

### 2. Edge Function Setup (The "Automation Brain")
- **Location**: `supabase/functions/paypal-webhook/index.ts`.
- **Logic**: 
  - Receives PayPal JSON payload.
  - Extracts `custom_id` (matches our `booking.id`).
  - Updates `payment_status` to `completed`.
  - Triggers Resend API to send the Welcome Email.

---

## 📧 Phase 3: The Communication Engine (Resend)

### 1. DNS Identity (Vercel-Strato Bridge)
*Crucial: If NS is on Vercel, all MX/TXT must be added to Vercel.*
- **MX Records**: Root `@` points to Strato (`mx00.strato.com`).
- **SPF Record**: `v=spf1 include:strato.com include:amazonses.com ~all`.
- **DKIM/TXT**: Copy from Resend Dashboard -> Domains.

### 2. Integration Modes
- **Auth Mode**: Use the Resend -> Supabase "Managed Integration" to push SMTP settings for password resets/invites.
- **Logic Mode**: Store `RESEND_API_KEY` in Supabase Edge Function Secrets for automated manual delivery.

---

## 💳 Phase 4: The Payment Handshake (PayPal JS SDK)

### 1. The Script
Include in `index.html`:
`<script src="https://www.paypal.com/sdk/js?client-id=YOUR_ID&currency=EUR"></script>`

### 2. The Linkage (The "Magic Trick")
In the `createOrder` call, you **must** pass the `custom_id`:
```javascript
purchase_units: [{
  amount: { value: '333.00' },
  custom_id: "OUR_SUPABASE_BOOKING_ID" 
}]
```
*This is the only way the Webhook knows which email to send the PDF to.*

---

## 📅 Phase 5: Social & Calendar (Post-Purchase)

### 1. Success UI
- Launch `canvas-confetti` on the `#success` hash.
- **Google Calendar**: Generate template URL using `Intake Topic` and `Batch Times`.
- **iCal/Apple**: Generate a data-blob `.ics` file on-the-fly from `courses.json` session data.

---

## 🧪 Phase 6: Automated Testing Logic
- **URL Param**: Append `?test=true` to toggle the "Developer Vibe Tester" panel.
- **Webhook Simulator**: Use PayPal's simulator with a real `id` from the Supabase table.
- **SQL Editor**: The ultimate source of truth for seeing if the "Handshake" happened.
