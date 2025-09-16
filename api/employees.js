import { sql } from '@vercel/postgres';

export function GET() {
  return handleRequest(async () => {
    const result = await sql`
      SELECT
        id,
        name,
        return_time as "returnTime",
        destination
      FROM employees
      ORDER BY id
    `;
    return result.rows;
  });
}

export function POST(request) {
  return handleRequest(async () => {
    const body = await request.json();
    const { id, name, returnTime, destination } = body;

    if (!id || !name) {
      throw new Error('ID and name are required');
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
    return result.rows[0];
  });
}

export function PUT(request) {
  return handleRequest(async () => {
    const body = await request.json();
    const { id, returnTime, destination } = body;

    if (!id) {
      throw new Error('ID is required');
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
      throw new Error('Employee not found');
    }

    return result.rows[0];
  });
}

// 共通ハンドラー関数
async function handleRequest(handler) {
  try {
    // データベース初期化
    await initializeDatabase();

    const result = await handler();
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('API Error:', error);
    const status = error.message.includes('required') ? 400 :
                   error.message === 'Employee not found' ? 404 : 500;
    return new Response(JSON.stringify({ error: error.message }), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// データベース初期化
async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS employees (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        return_time VARCHAR(10),
        destination VARCHAR(255)
      )
    `;

    // 初期データのチェックと挿入
    const countResult = await sql`SELECT COUNT(*) FROM employees`;
    if (countResult.rows[0].count === 0) {
      await sql`
        INSERT INTO employees (id, name, return_time, destination)
        VALUES
          ('1', 'Alice', '', ''),
          ('2', 'Bob', '14:00', 'Client Meeting'),
          ('3', 'Charlie', '', ''),
          ('4', 'Diana', '15:30', 'Lunch'),
          ('5', 'Ethan', '', ''),
          ('6', 'Fiona', '13:00', 'Supplier Visit')
      `;
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}