import { sql } from '@vercel/postgres';
import { setupDatabase } from '../lib/db';

// データベースのセットアップを確実に行う
await setupDatabase();

export async function GET() {
  try {
    const result = await sql`
      SELECT
        id,
        name,
        return_time as "returnTime",
        destination
      FROM employees
      ORDER BY id
    `;

    return new Response(JSON.stringify(result.rows), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch employees' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, returnTime, destination } = body;

    if (!id || !name) {
      return new Response(JSON.stringify({ error: 'ID and name are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await sql`
      INSERT INTO employees (id, name, return_time, destination)
      VALUES (${id}, ${name}, ${returnTime || null}, ${destination || null})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        return_time = EXCLUDED.return_time,
        destination = EXCLUDED.destination
      RETURNING
        id,
        name,
        return_time as "returnTime",
        destination
    `;

    return new Response(JSON.stringify(result.rows[0]), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error upserting employee:', error);
    return new Response(JSON.stringify({ error: 'Failed to save employee' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, returnTime, destination } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await sql`
      UPDATE employees
      SET
        return_time = ${returnTime || null},
        destination = ${destination || null}
      WHERE id = ${id}
      RETURNING
        id,
        name,
        return_time as "returnTime",
        destination
    `;

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Employee not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(result.rows[0]), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    return new Response(JSON.stringify({ error: 'Failed to update employee' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}