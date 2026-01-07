
import React, { useEffect, useRef } from 'react';

interface PayPalButtonProps {
    amount: number;
    bookingId: string;
    onSuccess: () => void;
    onError: (err: any) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, bookingId, onSuccess, onError }) => {
    const buttonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.paypal && buttonRef.current) {
            // Clear previous buttons if any
            buttonRef.current.innerHTML = '';

            window.paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color: 'white',
                    shape: 'pill',
                    label: 'pay'
                },
                createOrder: (_data: any, actions: any) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                currency_code: 'EUR',
                                value: amount.toString()
                            },
                            custom_id: bookingId // This links the payment to our Supabase record!
                        }]
                    });
                },
                onApprove: async (_data: any, actions: any) => {
                    const details = await actions.order.capture();
                    console.log('Payment Approved:', details);
                    onSuccess();
                },
                onError: (err: any) => {
                    console.error('PayPal Error:', err);
                    onError(err);
                }
            }).render(buttonRef.current);
        }
    }, [amount, bookingId]);

    return <div ref={buttonRef} className="w-full min-h-[150px]" />;
};

export default PayPalButton;
