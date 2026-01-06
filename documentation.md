# 🚀 VibeCoding Course: Technical Documentation

This document serves as the "Source of Truth" for the technical architecture, business logic, and third-party integrations for the VibeCoding platform.

---

## 🏗️ 1. Architecture Overview
- **VibeStack**: React (Vite) + Tailwind CSS + Lucide Icons.
- **Data Source**: `data/courses.json` (Local UI State) + **Supabase** (Live Inventory).
  - `courses.json` handles the static UI (dates, topics, descriptions).
  - `Supabase` tracks the live `seats_booked` number to manage "Sold Out" states automatically.
- **Styling**: `#050505` background, glassmorphism, aggressive typography.

---

## 🗄️ 2. Supabase Setup & Data Sync

To make seat tracking live, your frontend needs to talk to a database. Follow these exact steps.

### Step 1: Create the Inventory Table
In your Supabase Dashboard, go to the **SQL Editor** and run:
```sql
create table course_inventory (
  id text primary key, -- Must match the "id" in courses.json (e.g., 'batch-001')
  topic text not null,
  max_seats int not null,
  seats_booked int default 0
);

-- Enable Realtime (optional but recommended)
alter publication supabase_realtime add table course_inventory;
```

### Step 2: Insert Your Batches (The Manual Part)
You need to create a row in the database for every batch listed in `courses.json`.
1. Go to the **Table Editor** in Supabase and select `course_inventory`.
2. Click **Insert -> Insert row**.
3. **Crucial**: Ensure the `id` fields match exactly (e.g., `batch-001`, `batch-002`). This is the "bridge" between your code and your database.

### Step 3: Connect the Frontend
Add your Supabase credentials to `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: The Sync Logic
The `BookingSection.tsx` component is programmed to:
1. Load initial data from `courses.json`.
2. Fetch live `seats_booked` from Supabase using the match on `id`.
3. Overlay the live counts onto the UI.

---

### Success/Error Handling
- **Return URL**: `https://vibe.leopoldblau.com/#success`
- **Cancel URL**: `https://vibe.leopoldblau.com/#payment-issue`

### Live Sync via Webhook
To update `seats_booked` automatically when someone buys:
1. **The PayPal Link**: In your PayPal button dashboard, locate the "Advanced Variables" or "Custom ID" field.
2. **The Variable**: Set it to the Batch ID (e.g., `batch-001`).
3. **The Webhook**: Point PayPal to your **Supabase Edge Function**.
   - The function receives the Batch ID via the `custom_id` field.
   - It runs `UPDATE course_inventory SET seats_booked = seats_booked + 1 WHERE id = custom_id`.

---

## 🗓️ 3. Calendar Optimization (Cal.com)

### The "Add to Calendar" Logic
The `PaymentSuccess.tsx` page automatically detects the selected course and offers:
- **Google Calendar Links**: Individual links per day generated via URL templates.
- **Apple/iCal/Outlook File**: A single `.ics` file containing all sessions, generated dynamically as a Data URI.

### The "One-Calendar" Logic
To simplify consulting management, we use **one** master calendar event for high-ticket calls and pass user intent through **Query String Parameters (QSP)**.

---

## 📈 4. Marketing & Growth Logic

### Social Proof Buffer
- **File**: `components/BookingSection.tsx`
- **Variable**: `SOCIAL_PROOF_BUFFER = 2`
- **Logic**: Automatically adds 2 simulated bookings to every batch. This ensures every intake looks moving and avoids the "cold start" problem.

### Lead Magnet (Zero-to-One Manual)
- **Component**: `MacBookAudit.tsx`
- **Process**: Users provide Name/Company/Email to unlock the download.
- **Conversion**: This builds your email list even if they don't buy the course immediately.

---

- [ ] Create `course_inventory` table in Supabase.
- [ ] Insert rows matching `batch-001`, `batch-002`, etc.
- [ ] Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local`.
- [ ] Update `VITE_CALCOM_URL` and `VITE_PAYPAL_URL`.
- [ ] Set PayPal Webhook to point to the Supabase Edge Function.
- [ ] Set "Custom ID" in PayPal buttons to match the batch IDs.

---

## 📧 6. Email Automation Strategy (The VibeCode Way)

To maintain a premium feel with zero manual work, we use **Resend** (resend.com) integrated with our Supabase Edge Functions.

### The Tool: Resend
- **Why**: 3,000 free emails/month, best-in-class typography, and supports **React Email**.
- **Setup**: Create an API Key at Resend and add it to your Supabase Secrets: `supabase secrets set RESEND_API_KEY=re_...`

### Automated Flows
1. **Onboarding (Post-Payment)**: 
   - **Trigger**: PayPal Webhook -> Supabase Function.
   - **Content**: A "Welcome to the Batch" email with the **PDF Manual attached**.
   - **Vibe**: Dark mode, clean sans-serif typography, high-contrast buttons.
2. **Lead Nurture (Guide Download)**:
   - **Trigger**: `MacBookAudit.tsx` form submission.
   - **Content**: Immediate delivery of the Zero-to-One guide.
3. **Pre-Intake Reminder**:
   - **Trigger**: Scheduled Cron Job (Supabase).
   - **Content**: 24-hour reminder with the workroom link.

---

*Built with AI in the VibeCoding Spirit.*
