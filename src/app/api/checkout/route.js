import { db } from '@/db/index';
import { orders, orderItems } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, cart } = body;

    if (!name || !email || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    // Insert order
    const result = await db.insert(orders).values({
        name,          
        email,  
        total,
        status: 'pending',
    });

    // Get last inserted order ID manually
    const [lastOrder] = await db.execute(`SELECT LAST_INSERT_ID() AS id`);
    const orderId = lastOrder[0]?.id;

    if (!orderId) {
      throw new Error('Failed to get last insert ID');
    }

    const orderItemData = cart.map((item) => ({
      orderId,
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    await db.insert(orderItems).values(orderItemData);

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error('❌ Checkout error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
