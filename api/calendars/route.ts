import { sql } from '@vercel/postgres';
import { setupDatabase } from '@/lib/db';

// データベースのセットアップを確実に行う
await setupDatabase();

// Vite用のリクエストハンドラ
export default async function handler(request: Request) {
  const { method } = request;

  if (method === 'GET') {
    try {
      const result = await sql`
        SELECT id, name, src
        FROM calendars
        ORDER BY id
      `;

      return new Response(JSON.stringify(result.rows), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error fetching calendars:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch calendars' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (method === 'POST') {
    try {
      const body = await request.json();
      const { id, name, src } = body;

      if (!id || !name) {
        return new Response(JSON.stringify({ error: 'ID and name are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const result = await sql`
        INSERT INTO calendars (id, name, src)
        VALUES (${id}, ${name}, ${src || null})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          src = EXCLUDED.src
        RETURNING id, name, src
      `;

      return new Response(JSON.stringify(result.rows[0]), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error upserting calendar:', error);
      return new Response(JSON.stringify({ error: 'Failed to save calendar' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}