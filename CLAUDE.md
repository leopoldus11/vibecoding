### 1. Tech Stack
*   **Frontend**: React 19 (Vite), TypeScript, Tailwind CSS, Lucide Icons.
*   **Database & Backend**: Supabase (PostgreSQL) for lead capture and booking management.
*   **Payments**: PayPal Smart Buttons integration.
*   **Analytics**: Custom high-resolution tracking (GA4/GTM compatible) with Google Consent Mode V2 support.
*   **Email**: Resend (integrated via Supabase Edge Functions).
*   **Automation**: Supabase Edge Functions (Deno) for PayPal webhook reconciliation and automated welcome emails.

### 2. Current Progress: Micro SaaS Features
*   **Analytics (95% Complete)**: Exceptionally robust. Includes a `ConsentBanner` with granular controls, `vibe_uid` for cross-domain tracking, and full ecommerce funnel events (view, select, begin checkout, purchase).
*   **First-Party Data (90% Complete)**: Supabase is active with a `bookings` table. The funnel captures user emails *before* payment, creating a "Pending" record that can be used for recovery of abandoned carts.
*   **Booking Flow (80% Complete)**: `BookingSection.tsx` is the engine. It handles course selection, real-time seat availability (by querying Supabase), and pre-registration.
*   **Automated Fulfillment (70% Complete)**: The Supabase Edge Function (`paypal-webhook`) handles payment confirmation and sends a personalized welcome email with calendar invites.

### 3. Half-Finished Components & Logic Gaps
*   **`Booking.tsx` vs `BookingSection.tsx`**: `Booking.tsx` is a redundant placeholder referencing a "TidyCal" widget, while `BookingSection.tsx` contains the actual logic.
*   **Data Synchronization Gap**: The `paypal-webhook` (Edge Function) has a **hardcoded course map**. If you update `courses.json` in the frontend, the webhook will send outdated or incorrect info to the customer.
*   **Scheduling Link Inconsistency**: `App.tsx` references `VITE_CALCOM_URL`, but this isn't currently displayed in the booking flow. The user is left in a "manual download" state after payment.
*   **No Admin Dashboard**: There is no UI to manage courses/seats; you have to edit `courses.json` and push code.

### 4. Next 3 Immediate Steps (MVP Path)
1.  **Sync Course Data**: Move the course data from `courses.json` into a Supabase table (`batches`). Update both the frontend and the Edge Function to read from this table. This eliminates the "Hardcoded Map" risk.
2.  **Unify the Booking UI**: Delete the redundant `Booking.tsx`. Ensure the "Success" state in `BookingSection.tsx` or the `#success` page includes the actual scheduling link (Cal.com) or a clear next step.
3.  **Automated Seat Locking**: Currently, seats are only "taken" after a successful payment webhook. To prevent overbooking during high-traffic launches, implement a 10-minute "seat lock" (TTL) in Supabase once a user clicks "Secure Your Seat."
