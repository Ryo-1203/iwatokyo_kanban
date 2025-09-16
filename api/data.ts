// /api/data.ts
import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- 初期データをこのファイル内に直接定義 ---
const INITIAL_EMPLOYEES = [
  { id: '1', name: 'Alice', returnTime: '', destination: '' },
  { id: '2', name: 'Bob', returnTime: '14:00', destination: 'Client Meeting' },
  { id: '3', name: 'Charlie', returnTime: '', destination: '' },
  { id: '4', name: 'Diana', returnTime: '15:30', destination: 'Lunch' },
  { id: '5', name: 'Ethan', returnTime: '', destination: '' },
  { id: '6', name: 'Fiona', returnTime: '13:00', destination: 'Supplier Visit' },
];

const INITIAL_CALENDARS = [
    {
        id: '1',
        name: '会社の祝日',
        src: 'https://calendar.google.com/calendar/embed?src=ja.japanese%23holiday%40group.v.calendar.google.com&ctz=Asia%2FTokyo'
    },
    {
        id: '2',
        name: '営業チーム',
        src: ''
    },
];
// -----------------------------------------

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  try {
    // --- データベースとテーブルの初期化 ---
    await sql`
      CREATE TABLE IF NOT EXISTS employees (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        "returnTime" VARCHAR(255),
        destination TEXT
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS calendars (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        src TEXT
      );
    `;

    // --- GETリクエスト（データ取得）の処理 ---
    if (req.method === 'GET') {
      let { rows: employees } = await sql`SELECT * FROM employees ORDER BY name;`;
      let { rows: calendars } = await sql`SELECT * FROM calendars ORDER BY name;`;

      // もしDBにデータがなければ、初期データを挿入して返す
      if (employees.length === 0 && calendars.length === 0) {
        const client = await sql.connect();
        try {
            await client.query('BEGIN');
            for (const emp of INITIAL_EMPLOYEES) {
                await client.query(
                    'INSERT INTO employees (id, name, "returnTime", destination) VALUES ($1, $2, $3, $4)',
                    [emp.id, emp.name, emp.returnTime, emp.destination]
                );
            }
            for (const cal of INITIAL_CALENDARS) {
                await client.query(
                    'INSERT INTO calendars (id, name, src) VALUES ($1, $2, $3)',
                    [cal.id, cal.name, cal.src]
                );
            }
            await client.query('COMMIT');
            employees = INITIAL_EMPLOYEES;
            calendars = INITIAL_CALENDARS;
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
      }
      return res.status(200).json({ employees, calendars });
    }

    // --- POSTリクエスト（データ保存）の処理 ---
    if (req.method === 'POST') {
      const { employees, calendars } = req.body;
      const client = await sql.connect();
      try {
        await client.query('BEGIN');
        if (employees) {
          await client.query('DELETE FROM employees;');
          for (const emp of employees) {
            await client.query(
              'INSERT INTO employees (id, name, "returnTime", destination) VALUES ($1, $2, $3, $4)',
              [emp.id, emp.name, emp.returnTime, emp.destination]
            );
          }
        }
        if (calendars) {
          await client.query('DELETE FROM calendars;');
           for (const cal of calendars) {
             await client.query(
               'INSERT INTO calendars (id, name, src) VALUES ($1, $2, $3)',
               [cal.id, cal.name, cal.src]
             );
           }
        }
        await client.query('COMMIT');
        return res.status(200).json({ message: 'Data updated successfully' });
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
}