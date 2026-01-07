import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  try {
    const payload = await req.json()
    console.log("PayPal Webhook Received:", payload)

    // 1. Identify the event type
    const eventType = payload.event_type
    if (eventType !== 'CHECKOUT.ORDER.APPROVED' && eventType !== 'PAYMENT.CAPTURE.COMPLETED') {
      return new Response(JSON.stringify({ message: "Ignoring non-relevant event" }), { status: 200 })
    }

    // 2. Extract Data
    const resource = payload.resource
    // PayPal returns the 'custom_id' if passed during checkout. 
    // This is our 'booking_id' from the Supabase table.
    const bookingId = resource.custom_id || resource.purchase_units?.[0]?.custom_id || resource.custom
    const paypalEmail = resource.payer?.email_address

    if (!bookingId) {
      console.warn("No custom_id (bookingId) found in payload. If this was a manual PayPal.me payment, we can't automate this.")
      return new Response(JSON.stringify({ error: "No booking ID" }), { status: 200 })
    }

    // 3. Initialize Supabase
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // 4. Update Booking Status
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .update({ 
        payment_status: 'completed',
        paypal_email: paypalEmail,
        paypal_order_id: resource.id
      })
      .eq('id', bookingId)
      .select()
      .single()

    if (fetchError || !booking) {
      console.error("Failed to update booking:", fetchError)
      return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404 })
    }

    // 5. Send Welcome Email via Resend
    // We use the preferred_email we captured on the frontend!
    const targetEmail = booking.preferred_email || paypalEmail

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Leopold Blau <hello@leopoldblau.com>',
        to: targetEmail,
        subject: '🚀 Welcome to the Batch! (Download your Manual)',
        html: `
          <div style="font-family: sans-serif; background: #050505; color: #fff; padding: 40px; border-radius: 20px;">
            <h1 style="font-size: 32px; font-weight: 900; letter-spacing: -1px; margin-bottom: 20px;">WELCOME TO THE BATCH.</h1>
            <p style="color: rgba(255,255,255,0.6); line-height: 1.6; font-size: 16px;">
              Your seat is confirmed. It's time to stop dragging and dropping and start building with the power of AI.
            </p>
            <div style="margin: 40px 0;">
              <a href="https://vibe.leopoldblau.com/manual.pdf" style="background: #fff; color: #000; padding: 16px 32px; border-radius: 12px; font-weight: 900; text-decoration: none; display: inline-block;">DOWNLOAD ZERO-TO-ONE MANUAL</a>
            </div>
            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 40px 0;" />
            <p style="font-size: 12px; color: rgba(255,255,255,0.4);">
              Questions? Just reply to this email.<br />
              See you in the workroom,<br />
              <strong>Leopold Blau</strong>
            </p>
          </div>
        `
      })
    })

    const resendData = await resendRes.json()
    console.log("Email sent:", resendData)

    return new Response(JSON.stringify({ success: true }), { status: 200 })

  } catch (err) {
    console.error("Webhook Error:", err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
