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

### 🧪 How to Test the Connection
1.  **UI-to-DB**: Select a course on your local site. Click "Test Success". Check your Supabase `course_inventory` table. If the `seats_booked` increased by 1, the connection is alive.
2.  **DB-to-UI**: Manually change `seats_booked` in your Supabase table to match `max_seats` (e.g., set it to `6`).
3.  **The Result**: Refresh your website. That specific course card should now be **"Sold Out"** and greyed out automatically.

### 🔄 The "New Batch" Workflow
When you want to launch a new intake:
1.  **JSON**: Add a new object to `data/courses.json` with a unique ID (e.g., `batch-004`).
2.  **Supabase**: Create a new row in the `course_inventory` table with the **exact same ID**.
3.  **Result**: The website will instantly pick up the new metadata from JSON and the live seat count from Supabase.

---

## 📂 3. Cross-Project Access (Consent-Cop etc.)
I strictly follow the "Workspace Rule." If you want me to look at code in your `consent-cop` project:
1.  Go to your IDE (VS Code / Cursor).
2.  **File -> Add Folder to Workspace...**
3.  Select the `consent-cop---ai-powered-gdpr-compliance` directory.
4.  Once you do this, I will automatically see both projects in my sidebar and can copy/paste logic between them.

---

## 🏗️ 4. Viewport & Layout Logic
I have implemented **Scroll Snapping** in `App.tsx`. 
- **The Snap**: Every section (`Hero`, `Problem`, `Booking`) is wrapped in `snap-start`.
- **The Height**: I use `min-h-[100svh]` (Small Viewport Height) to ensure content is always visible regardless of mobile browser address bars.

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

## 📧 6. Email Automation: The Resend & Supabase Bridge

To maintain a premium, automated experience, we use **Resend** as our delivery engine. You need to connect your Resend API Key to Supabase in **two specific places** depending on your goal.

### Phase A: Verify your Domain (Crucial First Step)
Before doing anything in Supabase, Resend needs permission to send emails as `@leopoldblau.com`.
1.  Go to [Resend Dashboard -> Domains](https://resend.com/domains).
2.  Add `leopoldblau.com` and follow instructions to add DNS records in your host (Strato).
3.  **Wait** until status shows as **"Verified"**.

---

### Phase B: Integration 1 — Official Supabase Auth Emails (SMTP)
*Use this if you want Supabase to use Resend for "Confirm Email" or "Reset Password" links.*

1.  **In Resend**: Go to [API Keys](https://resend.com/api-keys) and copy your key (`re_...`).
2.  **In Supabase**: Go to **Project Settings** (Gear icon) -> **Auth**.
3.  Scroll down to **SMTP Settings**.
4.  Toggle **Enable Custom SMTP** to **ON**.
5.  Fill in these exact values:
    - **Sender Email**: `leopold@leopoldblau.com` (or your verified sender).
    - **Sender Name**: `Leopold Blau | VibeCoding`
    - **SMTP Host**: `smtp.resend.com`
    - **Port**: `465` (Use SSL)
    - **Username**: `resend` (Literal string "resend").
    - **Password**: `re_Your_API_Key_Here` (Paste your actual key).
6.  Click **Save**.

---

### Phase C: Integration 2 — Automated Course Emails (Edge Functions)
*Use this for "Welcome to the Batch," "Bonus Guide Delivery," and "Automated Invoices."*

#### Option 1: The Dashboard Way (Easiest)
1.  Go to your **Supabase Dashboard**.
2.  Go to **Edge Functions** (lightning bolt icon).
3.  Click **Manage Secrets** (top right).
4.  Click **Add Secret**.
5.  Set Name: `RESEND_API_KEY`, Value: `re_...`

#### Option 2: The CLI Way
```bash
supabase secrets set RESEND_API_KEY=re_your_actual_key_here
```

---

### 🚀 Automated "Vibe" Flows
1. **Onboarding**: Delivery of the **PDF Manual** + Batch details after PayPal success.
2. **Lead Nurture**: Delivery of the "Zero-to-One" manual upon form submission.
3. **Typography**: We use **React Email** inside our functions to ensure our emails look like premium newsletters, not spam.

---

## 📊 7. Advanced Analytics & BigQuery (The Data Warehouse)

To scale multiple projects without losing your mind, we use a **Central Hub Architecture**.

### The Orchestration Strategy
1. **The Hub**: Create one dedicated Google Cloud Project called `Leopold-Data-Warehouse`.
2. **The Datasets**: Inside this Hub, create separate BigQuery Datasets for each property:
   - `vibecoding_ga4_export`
   - `consentcop_ga4_export`
   - `personal_site_ga4_export`
3. **The Benefit**: This allows you to write SQL queries that join data across all your sites (e.g., "Show me every user who started on ConsentCop and eventually booked a VibeCoding call").

### How to Plan the Integration
1. **GA4 Tracking**: Install one GA4 tag per property.
2. **BigQuery Link**: In GA4 Admin -> Product Links -> BigQuery Links. Point all of them to your `Leopold-Data-Warehouse` project.
3. **Daily Export**: Enable the "Daily" export frequency (Free tier of BigQuery supports this up to a certain limit).

### Privacy & Consent (VibeConsent V2)
- **Tool**: `ConsentBanner.tsx`
- **Logic**: Tracks Essential, Analytics, and Marketing separately.
- **Cross-Domain**: Sets a cookie on `.leopoldblau.com` so consent carries over from the root domain to the subdomain.
- **Proof of Consent**: To maintain a legal audit trail, run this SQL in your Supabase Editor:

```sql
create table consent_logs (
  id uuid default gen_random_uuid() primary key,
  timestamp timestamptz default now(),
  preferences jsonb not null,
  user_agent text,
  origin text -- e.g., 'vibe.leopoldblau.com'
);

-- Enable RLS (Security)
alter table consent_logs enable row level security;
create policy "Allow anonymous inserts" on consent_logs for insert with check (true);
```

### 💳 PayPal Dynamic Pricing
The app now uses a single `VITE_PAYPAL_URL` (Base: `https://www.paypal.com/paypalme/leoblau`) and dynamically appends the batch price (e.g., `/200EUR`). 
- **Benefit**: You don't need to manually update links in JSON; just change the `price` field.

---

*Built with AI in the VibeCoding Spirit.*
