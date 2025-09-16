// /api/data.ts
import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { INITIAL_EMPLOYEES, INITIAL_CALENDARS } from '../constants';

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
          await client.query('DELETE FROM employees;'); // データを一旦すべて削除
          for (const emp of employees) { // 新しいデータセットを挿入
            await client.query(
              'INSERT INTO employees (id, name, "returnTime", destination) VALUES ($1, $2, $3, $4)',
              [emp.id, emp.name, emp.returnTime, emp.destination]
            );
          }
        }
        if (calendars) {
          await client.query('DELETE FROM calendars;'); // データを一旦すべて削除
           for (const cal of calendars) { // 新しいデータセットを挿入
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

    // --- GET/POST以外のメソッドへの対応 ---
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);

  } catch (error) {
    // --- エラーハンドリング ---
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  }
}