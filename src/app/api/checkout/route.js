import Stripe from 'stripe';
import { db } from '@/db/index';
import { orders, orderItems, payments } from '@/db/schema';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { cart, name, email } = await req.json();

    if (!cart || !name || !email) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    const line_items = cart.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // ✅ Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email: email,
      metadata: {
        name,
        cart: JSON.stringify(cart), // required if you use webhook
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    // ✅ OPTIONAL: Save order before redirect (useful if you skip webhooks)
    const result = await db.insert(orders).values({
      name,
      email,
      total,
      status: 'paid',
    });

    const [orderIdRow] = await db.execute(`SELECT LAST_INSERT_ID() as id`);
    const orderId = orderIdRow[0].id;

    const items = cart.map((item) => ({
      orderId,
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    await db.insert(orderItems).values(items);

    await db.insert(payments).values({
      orderId,
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent ?? null,
      amount: total,
      status: 'paid',
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('❌ Checkout error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
