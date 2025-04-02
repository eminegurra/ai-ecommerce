import { db } from '@/db/index';
import { products } from '@/db/schema';

export async function GET() {
  const allProducts = await db.select().from(products);
  return Response.json(allProducts);
}
