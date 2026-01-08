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
        const bookingId = payload.resource.custom_id || payload.resource.purchase_units?.[0]?.custom_id
        const paypalOrderId = payload.resource.id || payload.resource.purchase_units?.[0]?.payments?.captures?.[0]?.id

        console.log(`[Webhook] Processing Booking: ${bookingId}`)
        console.log(`[Webhook] PayPal Order/Capture ID: ${paypalOrderId}`)

        if (!bookingId) {
            console.error("No custom_id (bookingId) found in payload.")
            return new Response(JSON.stringify({ error: "No booking ID" }), { status: 400 })
        }

        // 3. Initialize Supabase
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

        // 4. Update Booking Status
        // Update the booking status
        console.log(`[Database] Attempting to update booking ${bookingId} to 'completed'...`)
        const { data: booking, error: updateError } = await supabase
            .from('bookings')
            .update({
                payment_status: 'completed',
                paypal_email: payload.resource.payer?.email_address,
                paypal_order_id: paypalOrderId
            })
            .eq('id', bookingId)
            .select()
            .single()

        if (updateError) {
            console.error("[Database] Update Error:", updateError)
            throw updateError
        }

        console.log(`[Database] Success! Booking ${bookingId} marked as completed.`)
        if (!booking) {
            return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404 })
        }

        // 5. Fetch Course Info from Database (Dynamic!)
        const { data: batchData, error: batchError } = await supabase
            .from('batches')
            .select('topic, date, sessions')
            .eq('id', booking.batch_id)
            .single()

        if (batchError) {
            console.warn('[Database] Could not fetch batch info:', batchError)
        }

        // Fallback if batch not found
        const courseInfo = batchData || { topic: 'VibeCoding Intensive', date: 'Upcoming', sessions: [] }

        // Generate Google Calendar Links
        const calendarLinks = courseInfo.sessions.map((session, idx) => {
            const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(courseInfo.topic + ' - Session ' + (idx + 1))}&dates=${session.start}/${session.end}&details=${encodeURIComponent('VibeCoding Intensive with Leopold Blau. See you in the workroom.')}&location=Online&sf=true&output=xml`;
            return `<a href="${url}" style="color: #fff; text-decoration: underline; font-size: 13px; display: block; margin-top: 10px;">+ Add Session ${idx + 1} to Google Calendar</a>`;
        }).join('');

        // 6. Send Welcome Email via Resend
        const targetEmail = booking.preferred_email || resource.payer?.email_address

        const resendRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'Leopold Blau <hello@leopoldblau.com>',
                to: targetEmail,
                subject: `🚀 Welcome to ${courseInfo.topic}!`,
                html: `
          <div style="font-family: sans-serif; background: #050505; color: #fff; padding: 40px; border-radius: 20px; max-width: 600px; margin: 0 auto;">
            <div style="margin-bottom: 30px;">
                <span style="font-size: 10px; font-weight: 900; letter-spacing: 3px; color: rgba(255,255,255,0.4); text-transform: uppercase;">
                    VibeCoding by Leopold Blau
                </span>
            </div>
            
            <h1 style="font-size: 32px; font-weight: 900; letter-spacing: -1.5px; margin: 0 0 10px 0; line-height: 1;">
                READY TO SHIP.
            </h1>
            <p style="font-size: 18px; color: #fff; margin: 0 0 30px 0; font-style: italic; opacity: 0.8;">
                Confirmed for: ${courseInfo.topic}
            </p>

            <div style="background: rgba(255,255,255,0.05); padding: 25px; border-radius: 15px; margin-bottom: 30px; border: 1px solid rgba(255,255,255,0.1);">
                <span style="font-size: 11px; font-weight: 900; text-transform: uppercase; color: rgba(255,255,255,0.3); letter-spacing: 1px;">Intake Dates</span>
                <p style="margin: 10px 0 0 0; font-weight: 700; font-size: 20px;">${courseInfo.date}</p>
                ${calendarLinks}
            </div>

            <p style="color: rgba(255,255,255,0.6); line-height: 1.6; font-size: 16px; margin-bottom: 40px;">
                Your seat is secured. We're going to bridge the gap between "having an idea" and "deploying a product" using the most advanced AI workflows available today.
            </p>

            <div style="margin: 40px 0;">
              <a href="https://vibe.leopoldblau.com/manual.pdf" style="background: #fff; color: #000; padding: 18px 36px; border-radius: 14px; font-weight: 900; text-decoration: none; display: inline-block; font-size: 14px; letter-spacing: 1px;">DOWNLOAD THE STARTUP MANUAL</a>
            </div>

            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px; margin-top: 40px;">
                <p style="font-size: 12px; color: rgba(255,255,255,0.4); margin: 0;">
                    Questions? Reply to this email.<br />
                    See you in the workroom,<br />
                    <strong style="color: #fff;">Leopold Blau</strong>
                </p>
                <p style="font-size: 9px; color: rgba(255,255,255,0.2); margin-top: 20px;">
                    Order Ref: ${booking.id} | Trans ID: ${booking.paypal_order_id || 'N/A'}
                </p>
            </div>
          </div>
        `
            })
        })

        const resendData = await resendRes.json()
        console.log("Personalized email sent successfully:", resendData)

        return new Response(JSON.stringify({ success: true }), { status: 200 })

    } catch (err) {
        console.error("Webhook Error:", err)
        return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
})
