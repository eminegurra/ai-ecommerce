import { db } from '@/db/index';
import { products } from '@/db/schema';
import { and, eq, like } from 'drizzle-orm';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const filters = [];
    const brandId = searchParams.get('brandId');
    const categoryId = searchParams.get('categoryId');
    const q = searchParams.get('q');

    if (categoryId) filters.push(eq(products.categoryId, Number(categoryId)));
    if (brandId) filters.push(eq(products.brandId, Number(brandId)));
    if (q) filters.push(like(products.name, `%${q}%`));

    const data = await db
      .select()
      .from(products)
      .where(filters.length ? and(...filters) : undefined);

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Error in /api/products:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
