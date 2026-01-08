
import { supabase } from './supabase';

/**
 * Vibe-Stack Analytics Utility
 * High-resolution tracking for the course booking funnel.
 * Uses standard GA4 Enhanced Ecommerce events.
 */

interface TrackEventProps {
    event: string;
    [key: string]: any;
}

const pushToDataLayer = (payload: TrackEventProps) => {
    const dataLayer = (window as any).dataLayer || [];
    const vibeUid = localStorage.getItem('vibe_uid');

    dataLayer.push({
        ...payload,
        vibe_uid: vibeUid, // Cross-subdomain identity bridge
        user_id: vibeUid   // GA4 Known User ID
    });
};

export const analytics = {
    // 0. Page View (Explicit)
    pageView: (url?: string) => {
        pushToDataLayer({
            event: 'page_view',
            page_path: url || window.location.pathname,
            page_title: document.title
        });
    },

    // 1. View course list
    viewItemList: (items: any[]) => {
        pushToDataLayer({
            event: 'view_item_list',
            ecommerce: {
                item_list_id: 'vibe_courses',
                item_list_name: 'VibeCoding Course Batches',
                items: items.map((item, index) => ({
                    item_id: item.id,
                    item_name: item.topic,
                    index: index + 1,
                    price: item.price
                }))
            }
        });
    },

    // 2. Select a specific course
    selectItem: (item: any) => {
        pushToDataLayer({
            event: 'select_item',
            ecommerce: {
                item_list_id: 'vibe_courses',
                item_list_name: 'VibeCoding Course Batches',
                items: [{
                    item_id: item.id,
                    item_name: item.topic,
                    price: item.price
                }]
            }
        });
    },

    // 3. Start the checkout (Pay button clicked)
    beginCheckout: (item: any, email: string) => {
        pushToDataLayer({
            event: 'begin_checkout',
            ecommerce: {
                value: item.price,
                currency: 'EUR',
                items: [{
                    item_id: item.id,
                    item_name: item.topic,
                    price: item.price
                }]
            },
            customer_email: email // Note: Only used if consent is granted or hashed
        });
    },

    // 4. Successful purchase
    purchase: (booking: any) => {
        pushToDataLayer({
            event: 'purchase',
            ecommerce: {
                transaction_id: booking.paypal_order_id || booking.id,
                value: booking.payment_amount,
                currency: 'EUR',
                items: [{
                    item_id: booking.batch_id,
                    item_name: 'Course Batch', // In a real app we'd fetch the name
                    price: booking.payment_amount
                }]
            }
        });
    },

    // 5. Generic event
    track: (name: string, props: any = {}) => {
        pushToDataLayer({
            event: name,
            ...props
        });
    }
};
