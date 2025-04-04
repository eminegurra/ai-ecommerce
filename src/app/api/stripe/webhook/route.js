import Stripe from 'stripe';
import { db } from '@/db/index';
import { orders, orderItems, payments } from '@/db/schema';
import { buffer } from 'micro';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed.', err.message);
    return new NextResponse('Webhook error', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const metadata = session.metadata || {};
    const cart = JSON.parse(metadata.cart || '[]');

    // Save order
    const orderResult = await db.insert(orders).values({
      name: metadata.name,
      email: session.customer_email,
      total: session.amount_total / 100,
      status: 'paid',
    });

    const [orderIdRow] = await db.execute(`SELECT LAST_INSERT_ID() as id`);
    const orderId = orderIdRow[0].id;

    // Save order items
    const items = cart.map((item) => ({
      orderId,
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));
    await db.insert(orderItems).values(items);

    // Save payment
    await db.insert(payments).values({
      orderId,
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
      amount: session.amount_total / 100,
      status: session.payment_status,
    });

    console.log('✅ Order + payment saved');
  }

  return new NextResponse('Webhook received', { status: 200 });
}
