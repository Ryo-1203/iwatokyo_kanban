import { sql } from '@vercel/postgres';

export function GET() {
  return handleRequest(async () => {
    const result = await sql`
      SELECT id, name, src
      FROM calendars
      ORDER BY id
    `;
    return result.rows;
  });
}

export function POST(request) {
  return handleRequest(async () => {
    const body = await request.json();
    const { id, name, src } = body;

    if (!id || !name) {
      throw new Error('ID and name are required');
    }

    const result = await sql`
      INSERT INTO calendars (id, name, src)
      VALUES (${id}, ${name}, ${src || null})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        src = EXCLUDED.src
      RETURNING id, name, src
    `;
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
                   error.message === 'Calendar not found' ? 404 : 500;
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
      CREATE TABLE IF NOT EXISTS calendars (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        src TEXT
      )
    `;

    // 初期データのチェックと挿入
    const countResult = await sql`SELECT COUNT(*) FROM calendars`;
    if (countResult.rows[0].count === 0) {
      await sql`
        INSERT INTO calendars (id, name, src)
        VALUES
          ('1', '会社の祝日', 'https://calendar.google.com/calendar/embed?src=ja.japanese%23holiday%40group.v.calendar.google.com&ctz=Asia%2FTokyo'),
          ('2', '営業チーム', '')
      `;
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}