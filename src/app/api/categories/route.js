import { db } from '@/db/index';
import { categories } from '@/db/schema';

export async function GET() {
  const data = await db.select().from(categories);
  return Response.json(data);
}
