import { db } from '@/db/index';
import { brands } from '@/db/schema';

export async function GET() {
  const data = await db.select().from(brands);
  return Response.json(data);
}
